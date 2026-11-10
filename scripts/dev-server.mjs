// Try the assistant on your own computer: npm run dev, then open http://localhost:8888
// Without ANTHROPIC_API_KEY set, it gives sample replies so you can check the page.
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import handler from "../netlify/functions/chat.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const PORT = process.env.PORT || 8888;
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon" };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === "/api/chat") {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const request = new Request(url, { method: req.method, headers: req.headers, body: req.method === "POST" ? Buffer.concat(chunks) : undefined });
    const response = await handler(request, { ip: req.socket.remoteAddress });
    res.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body) for await (const chunk of response.body) res.write(chunk);
    return res.end();
  }
  const file = path.join(root, url.pathname === "/" ? "index.html" : path.normalize(url.pathname));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  try {
    const data = await readFile(file);
    res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch { res.writeHead(404); res.end("Not found"); }
}).listen(PORT, () => console.log(`Assistant running at http://localhost:${PORT}${process.env.ANTHROPIC_API_KEY ? "" : "  (test mode: no API key)"}`));
