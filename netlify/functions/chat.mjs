// Server side of the chat. Receives the conversation, asks Claude, streams the answer back.
// Your API key stays here on the server — it is never sent to visitors' browsers.
import Anthropic from "@anthropic-ai/sdk";
import { buildSystem } from "../../lib/prompt.mjs";
import { KNOWLEDGE } from "../../lib/_generated/knowledge.mjs";

const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
const MAX_TURNS = 40;            // messages kept per conversation
const MAX_MESSAGE_CHARS = 6000;  // longest single message a visitor can send
const MAX_ANSWER_TOKENS = 3000;  // longest answer (about 2,000 words)
// Sonnet 5.5 thinks before answering by default, and thinking counts toward max_tokens.
// "between_tools" turns off up-front thinking so answers start fast and don't get cut short.
// Set THINKING=adaptive in Netlify to let the model think first.
const THINKING = (process.env.THINKING || "").toLowerCase() === "adaptive" ? null : { type: "between_tools" };
const PER_IP_PER_HOUR = Number(process.env.RATE_LIMIT_PER_HOUR) || 40; // per network per hour; raise for workshops (everyone on one Wi-Fi shares a limit)

// Web search: lets the assistant look things up when the resource library doesn't cover it.
// Turn off with WEB_SEARCH=off. WEB_SEARCH_MAX caps searches per answer (each search has a small fee).
const WEB_SEARCH_ON = (process.env.WEB_SEARCH || "on").toLowerCase() !== "off";
const WEB_SEARCH_TOOL = {
  type: "web_search_20260318",
  name: "web_search",
  max_uses: Number(process.env.WEB_SEARCH_MAX) || 3,
  user_location: { type: "approximate", region: "Quebec", country: "CA", timezone: "America/Toronto" },
};

const hits = new Map(); // ip -> [timestamps]; resets when the server sleeps
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 3_600_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > PER_IP_PER_HOUR;
}

function allowedOrigin(req) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const self = new URL(req.url).origin;
  const extra = (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  return origin === self || extra.includes(origin);
}

const text = (body, status = 200) =>
  new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8" } });

export default async (req, context) => {
  if (req.method !== "POST") return text("Method not allowed", 405);
  if (!allowedOrigin(req)) return text("Not allowed from this website.", 403);

  const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "unknown";
  if (rateLimited(ip)) {
    return text("You've sent a lot of messages in the last hour. Please take a break and try again soon, or contact Eeyoupreneur directly at sam@eeyoupreneur.ca.", 429);
  }

  let body;
  try { body = await req.json(); } catch { return text("Bad request", 400); }

  // Keep only clean user/assistant turns, newest last.
  const messages = (Array.isArray(body?.messages) ? body.messages : [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages.at(-1).role !== "user") return text("Bad request", 400);

  const encoder = new TextEncoder();

  // No key yet (e.g. testing on your computer): send a sample reply so the page still works.
  if (!process.env.ANTHROPIC_API_KEY) {
    const sample = `**Test mode** — no API key is set, so this is a sample reply.\n\nYou asked: _${messages.at(-1).content.slice(0, 200)}_\n\nOnce the key is added in Netlify, real answers will appear here, drawing on the resource library.`;
    const stream = new ReadableStream({
      async start(c) {
        for (const word of sample.split(/(\s+)/)) { c.enqueue(encoder.encode(word)); await new Promise((r) => setTimeout(r, 12)); }
        c.close();
      },
    });
    return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8" } });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Status messages for the page (e.g. "searching the web") travel inside \x1e…\x1e markers,
  // which the page shows as a status line and never stores in the conversation.
  const status = (obj) => encoder.encode(`\x1e${JSON.stringify(obj)}\x1e`);

  const stream = new ReadableStream({
    async start(controller) {
      const sources = new Map(); // url -> title, from web citations
      let wroteText = false;

      async function run(useSearch, withThinking = true) {
        let convo = messages;
        // A long search turn can pause; continue it up to 3 times.
        for (let round = 0; round < 3; round++) {
          const claude = client.messages.stream({
            model: MODEL,
            max_tokens: MAX_ANSWER_TOKENS,
            system: buildSystem(KNOWLEDGE, { webSearch: useSearch }),
            ...(withThinking && THINKING ? { thinking: THINKING } : {}),
            ...(useSearch ? { tools: [WEB_SEARCH_TOOL] } : {}),
            messages: convo,
          });
          const toolInput = {}; // block index -> partial JSON of a search query
          for await (const event of claude) {
            if (event.type === "content_block_start" && event.content_block?.type === "server_tool_use") {
              toolInput[event.index] = "";
              controller.enqueue(status({ searching: true }));
            } else if (event.type === "content_block_delta") {
              const d = event.delta;
              if (d?.type === "text_delta") {
                wroteText = true;
                controller.enqueue(encoder.encode(d.text));
              } else if (d?.type === "input_json_delta" && event.index in toolInput) {
                toolInput[event.index] += d.partial_json;
              } else if (d?.type === "citations_delta" && d.citation?.type === "web_search_result_location") {
                if (d.citation.url && !sources.has(d.citation.url)) sources.set(d.citation.url, d.citation.title || d.citation.url);
              }
            } else if (event.type === "content_block_stop" && event.index in toolInput) {
              try {
                const q = JSON.parse(toolInput[event.index] || "{}").query;
                if (q) controller.enqueue(status({ searching: true, query: q }));
              } catch {}
              delete toolInput[event.index];
            }
          }
          const final = await claude.finalMessage();
          if (final.stop_reason !== "pause_turn") break;
          convo = [...convo, { role: "assistant", content: final.content }];
        }
      }

      try {
        try {
          await run(WEB_SEARCH_ON);
        } catch (err) {
          if (wroteText) throw err;
          // A model that doesn't accept this thinking setting, or web search being off: retry simply.
          console.error("Retrying with basic settings:", err?.status, err?.message);
          const thinkingIssue = err?.status === 400 && /thinking/i.test(err?.message || "");
          await run(thinkingIssue ? WEB_SEARCH_ON : false, false);
        }
        controller.enqueue(status({ searching: false }));
        if (sources.size) {
          const list = [...sources].slice(0, 8).map(([url, title]) => `- [${title.replace(/[\[\]]/g, "")}](${url})`).join("\n");
          controller.enqueue(encoder.encode(`\n\n**Web sources**\n${list}`));
        }
      } catch (err) {
        console.error("Claude API error:", err?.status, err?.message);
        controller.enqueue(status({ searching: false }));
        controller.enqueue(encoder.encode("\n\n_Sorry — something went wrong on our end. Please try again in a moment._"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
};

export const config = { path: "/api/chat" };
