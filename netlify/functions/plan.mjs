// Plan writer: drafts ONE section of a business or expansion plan per request, streamed back.
// The page calls it once per section, so each request stays well inside Netlify's time limit.
import Anthropic from "@anthropic-ai/sdk";
import { buildSystem } from "../../lib/prompt.mjs";
import { KNOWLEDGE } from "../../lib/_generated/knowledge.mjs";
import { PLAN_GUIDE, SECTION_IDS, buildPlanRequest } from "../../lib/plan.mjs";

// Plans can use a different (e.g. more capable) model than the chat. Slower models risk hitting the time limit.
const MODEL = process.env.PLAN_MODEL || process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
const MAX_SECTION_TOKENS = 3200;
// Sonnet 5.5 thinks before answering by default, and thinking counts toward max_tokens.
// "between_tools" turns off up-front thinking: faster sections that don't get cut short.
// Set THINKING=adaptive in Netlify to let the model think first (slower; needs a bigger budget).
const THINKING = (process.env.THINKING || "").toLowerCase() === "adaptive" ? null : { type: "between_tools" };
const PER_IP_PER_HOUR = Number(process.env.RATE_LIMIT_PER_HOUR) || 40;
const WEB_SEARCH_ON = (process.env.WEB_SEARCH || "on").toLowerCase() !== "off";

const hits = new Map();
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
  const extra = (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  return origin === new URL(req.url).origin || extra.includes(origin);
}
const text = (body, status = 200) => new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8" } });
const clip = (s, n) => (typeof s === "string" ? s.slice(0, n) : "");

export default async (req, context) => {
  if (req.method !== "POST") return text("Method not allowed", 405);
  if (!allowedOrigin(req)) return text("Not allowed from this website.", 403);
  const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "unknown";
  if (rateLimited(ip)) return text("Too many requests in the last hour. Please try again soon, or contact Eeyoupreneur at sam@eeyoupreneur.ca.", 429);

  let body;
  try { body = await req.json(); } catch { return text("Bad request", 400); }
  if (!SECTION_IDS.includes(body?.section)) return text("Bad request", 400);

  const answers = {};
  for (const [k, v] of Object.entries(body.answers || {})) if (typeof v === "string") answers[clip(k, 40)] = clip(v, 1500);
  const written = (Array.isArray(body.written) ? body.written : []).slice(0, 12)
    .map((w) => ({ id: clip(w?.id, 40), text: clip(w?.text, 9000) }));
  const { spec, prompt } = buildPlanRequest({
    sectionId: body.section,
    answers,
    chat: clip(body.chat, 6000),
    written,
    note: clip(body.note, 1000),
    lang: body.lang === "fr" ? "fr" : "en",
    partial: clip(body.partial, 14000),
  });

  const encoder = new TextEncoder();
  const status = (obj) => encoder.encode(`\x1e${JSON.stringify(obj)}\x1e`);

  // No key yet (local testing): stream a sample section.
  if (!process.env.ANTHROPIC_API_KEY) {
    const sample = `# ${spec.heading}\n\n**Test mode** — no API key is set. This is where the "${spec.heading}" section will be written.\n\n| Item | Estimate |\n|---|---|\n| Example | $1,000 |\n\n- [owner to confirm details]`;
    return new Response(new ReadableStream({
      async start(c) {
        for (const w of sample.split(/(\s+)/)) { c.enqueue(encoder.encode(w)); await new Promise((r) => setTimeout(r, 8)); }
        c.enqueue(status({ done: true }));
        c.close();
      },
    }), { headers: { "content-type": "text/plain; charset=utf-8" } });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const useSearch = WEB_SEARCH_ON && spec.search > 0;
  const system = buildSystem(KNOWLEDGE);
  system.push({ type: "text", text: PLAN_GUIDE });

  return new Response(new ReadableStream({
    async start(controller) {
      let wrote = false;
      async function run(withSearch, withThinking = true) {
        let convo = [{ role: "user", content: prompt }];
        for (let round = 0; round < 3; round++) {
          const claude = client.messages.stream({
            model: MODEL,
            max_tokens: MAX_SECTION_TOKENS,
            system,
            ...(withThinking && THINKING ? { thinking: THINKING } : {}),
            ...(withSearch ? { tools: [{ type: "web_search_20260318", name: "web_search", max_uses: spec.search, user_location: { type: "approximate", region: "Quebec", country: "CA", timezone: "America/Toronto" } }] } : {}),
            messages: convo,
          });
          for await (const ev of claude) {
            if (ev.type === "content_block_start" && ev.content_block?.type === "server_tool_use") controller.enqueue(status({ searching: true }));
            else if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
              wrote = true;
              controller.enqueue(encoder.encode(ev.delta.text));
            }
          }
          const final = await claude.finalMessage();
          if (final.stop_reason !== "pause_turn") return final.stop_reason;
          convo = [...convo, { role: "assistant", content: final.content }];
        }
        return "pause_turn";
      }
      try {
        let stop;
        try { stop = await run(useSearch); }
        catch (err) {
          if (wrote) throw err;
          // A model that doesn't accept this thinking setting, or web search being off: retry simply.
          console.error("Plan: retrying with basic settings:", err?.status, err?.message);
          stop = await run(err?.status === 400 && /thinking/i.test(err?.message || "") ? useSearch : false, false);
        }
        // "done" tells the page the section finished; if it never arrives, the page offers a retry.
        controller.enqueue(status({ searching: false, done: true, truncated: stop === "max_tokens" }));
      } catch (err) {
        console.error("Plan API error:", err?.status, err?.message);
        controller.enqueue(status({ searching: false, error: true, busy: err?.status === 429 || err?.status === 529 }));
      } finally {
        controller.close();
      }
    },
  }), { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
};

export const config = { path: "/api/plan" };
