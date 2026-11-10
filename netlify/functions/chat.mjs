// Server side of the chat. Receives the conversation, asks Claude, streams the answer back.
// Your API key stays here on the server — it is never sent to visitors' browsers.
import Anthropic from "@anthropic-ai/sdk";
import { buildSystem } from "./prompt.mjs";
import { KNOWLEDGE } from "./_generated/knowledge.mjs";

const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
const MAX_TURNS = 40;            // messages kept per conversation
const MAX_MESSAGE_CHARS = 6000;  // longest single message a visitor can send
const MAX_ANSWER_TOKENS = 2000;  // longest answer (about 1,500 words)
const PER_IP_PER_HOUR = Number(process.env.RATE_LIMIT_PER_HOUR) || 40; // per network per hour; raise for workshops (everyone on one Wi-Fi shares a limit)

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

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claude = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_ANSWER_TOKENS,
          system: buildSystem(KNOWLEDGE),
          messages,
        });
        for await (const event of claude) {
          if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("Claude API error:", err?.status, err?.message);
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
