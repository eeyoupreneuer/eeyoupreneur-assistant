# Eeyoupreneur Business Assistant

An AI chat for business plans and business support in Eeyou Istchee. It runs on Netlify (free plan is fine) and shows up as a page on your Wix site.

**How it works:** a visitor types a question → the chat page sends it to a small server function on Netlify → the function sends it to Claude along with your instructions and your resource library → the answer streams back. Your API key stays on the server.

## What's in this folder

| Folder / file | What it is | Will you edit it? |
|---|---|---|
| `knowledge/` | Your resource library: PDFs, Word files, notes | Yes, often |
| `lib/prompt.mjs` | The assistant's instructions and personality | Sometimes |
| `lib/plan.mjs` | What each business plan section covers | Sometimes |
| `public/index.html`, `public/plan.js` | The chat page and the My plan tab | Rarely |
| `netlify/functions/chat.mjs`, `plan.mjs` | Server code that talks to Claude | Rarely (limits are at the top) |
| `scripts/` | Build and local test tools | No |

---

## Setup (about 30–45 minutes, once)

### 1. Get a Claude API key
1. Go to **console.anthropic.com** and create an account (use your Eeyoupreneur email).
2. Add a payment method and some prepaid credit.
3. **Set a monthly spend limit** under Limits. This is your real safety net against surprise bills.
4. Create an API key and copy it somewhere safe. Never put it in the code or share it.

### 2. Add your documents
Put your PDFs, Word files and notes into `knowledge/`. See `knowledge/README.md` for tips. Short, dated, clearly named files give the best answers.

### 3. Put the project on GitHub
1. Create a free account at github.com if you don't have one.
2. Create a new **private** repository, e.g. `eeyoupreneur-assistant`.
3. Upload everything in this folder (except `node_modules`, if you have it).

### 4. Deploy on Netlify
1. In Netlify: **Add new site → Import an existing project → GitHub**, pick the repository.
2. Leave the build settings as they are (they come from `netlify.toml`).
3. Before the first deploy, or right after, go to **Site configuration → Environment variables** and add:
   - `ANTHROPIC_API_KEY` = your key from step 1
4. Deploy (or **Deploys → Trigger deploy**). You'll get an address like `eeyoupreneur-assistant.netlify.app`.
5. Open it and ask a question to test. If it answers "Test mode", the key isn't set yet.

### 5. Add it to your Wix site
1. In the Wix Editor, add a new page, e.g. **Business Assistant**, and add it to your menu.
2. **Add Elements → Embed Code → Embed a Site**, paste your Netlify address.
3. Stretch it to full width and set the height to about **800 px**. Check the mobile view too and make it tall there as well.
4. Publish.

**Optional, cleaner address:** in Netlify, add a custom domain like `assistant.eeyoupreneur.ca`. Netlify will show a CNAME record to add in Wix under **Domains → Manage DNS records**. Then link to it from your menu, or embed that address instead.

If you use another Wix address or domain for the embed and the chat won't load inside it, add that address to the `frame-ancestors` line in `netlify.toml`.

---

## Updating the resource library
1. Add, replace or delete files in `knowledge/` on GitHub (drag files onto the folder page, then **Commit**).
2. Netlify rebuilds automatically in about a minute. The deploy log lists which files were read and which were skipped.

## Changing how it behaves
Edit the text in `lib/prompt.mjs` (chat) or `lib/plan.mjs` (plan writer), e.g. what topics it covers, how it mentions Eeyoupreneur, tone. Commit, and Netlify redeploys.

## Settings (Netlify environment variables)
| Name | What it does |
|---|---|
| `ANTHROPIC_API_KEY` | Required. Your Claude key. |
| `CLAUDE_MODEL` | Optional. Default `claude-sonnet-5-5`. Use `claude-haiku-5-5` for cheaper, faster, simpler answers. |
| `RATE_LIMIT_PER_HOUR` | Optional. Messages allowed per network per hour (default 40). Everyone on the same Wi-Fi shares one limit, so set it to 500 for workshops. |
| `WEB_SEARCH` | Optional. Web search is on by default; set to `off` to answer from the resource library only. |
| `WEB_SEARCH_MAX` | Optional. Most web searches per answer (default 3). Each search has a small fee on top of normal usage. |
| `PLAN_MODEL` | Optional. Model for the My plan writer only (defaults to `CLAUDE_MODEL`). A slower model may hit Netlify's time limit on long sections. |
| `ALLOWED_ORIGINS` | Optional. Extra websites allowed to call the chat, comma separated. Usually not needed. |

## Costs
- Netlify free plan covers this for normal traffic.
- Claude is pay-per-use, priced by how much text goes in and out. Your resource library is sent with each question, but it's **cached**, so repeat reads cost much less. A bigger library means higher cost per question. Check current prices at anthropic.com/pricing and watch usage in the console for the first few weeks.

## Built-in limits
At the top of `chat.mjs`: each visitor can send about 40 messages an hour, each message up to 6,000 characters, answers up to about 1,500 words. The hourly limit is best-effort; your spend limit in the Claude console is the real cap.

## Privacy
- The app doesn't save conversations anywhere. They stay in the visitor's browser tab and disappear when it's closed.
- Questions are sent to Anthropic to generate answers. Read Anthropic's commercial terms and privacy policy so you can explain this to users if asked.
- The page tells visitors not to share personal information.

## Try it on your computer (optional)
Needs Node.js 20+. In this folder:
```
npm install
npm run dev
```
Open http://localhost:8888. Without a key it gives sample replies. To test real answers, run `ANTHROPIC_API_KEY=your-key npm run dev` (Mac/Linux).

## When the library gets big
If `npm run build` warns that the library is over ~150k tokens, trim documents first. If you truly need hundreds of documents, the next step is "search then answer" (retrieval), which can be added later without changing the chat page.
