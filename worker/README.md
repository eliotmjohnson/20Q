# 20Q model proxy (Cloudflare Worker)

Proxies hybrid-model fallback requests from the GitHub Pages client to xAI
chat completions. The browser never sees `XAI_API_KEY`.

## Contract

`POST /` with JSON:

```json
{
  "history": [{ "question": "Is it an animal?", "answer": "yes" }],
  "remaining": 3
}
```

Success (`200`):

```json
{ "type": "question", "text": "Does it live in water?" }
```

or

```json
{ "type": "guess", "name": "dolphin" }
```

Errors are non-2xx (`400` / `429` / `502`) so the client **fail-opens** back to
the tree / give-up path.

CORS allows `https://eliotmjohnson.github.io` and localhost Vite ports.

## Rate limiting (choice: Cache API)

Hard cap: **20 requests per UTC day per client IP**.

Implemented with the Workers **Cache API** (date-keyed counter, no KV namespace
or Durable Object binding). Pros: zero infra setup — `wrangler deploy` is
enough after the secret. Cons: counters are per-colo (soft global cap); fine
for a personal Pages demo. Upgrade later to a KV `RATE_LIMIT` binding if you
need a strict global counter.

## One-time auth + secret (do this when the key arrives)

You need a Cloudflare account and an xAI API key. Do **not** commit either.

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put XAI_API_KEY
# paste the key when prompted
```

Optional model override (default `grok-3-mini`):

```bash
# edit wrangler.toml [vars] XAI_MODEL = "grok-3-mini"
# or: npx wrangler secret put is not needed for non-secret vars
```

## Deploy Worker (no key in this repo)

```bash
cd worker
npm install
npx wrangler deploy
```

Note the printed URL, e.g. `https://20q-model-proxy.<account>.workers.dev`.

Local smoke (optional):

```bash
# put the key in worker/.dev.vars (gitignored):
#   XAI_API_KEY=xai-...
npx wrangler dev
```

## Wire the Pages client

Build the Vite app with the Worker URL so `src/modelFallback.ts` hits the
proxy instead of the local mock:

```bash
# from repo root
VITE_MODEL_PROXY_URL=https://20q-model-proxy.<account>.workers.dev npm run build
# then publish dist/ to GitHub Pages as usual
```

Behavior:

| Build env | Runtime |
| --- | --- |
| `VITE_MODEL_PROXY_URL` unset | local mock (current live / QA spike) |
| `VITE_MODEL_PROXY_URL` set | POST to Worker |
| `VITE_USE_MODEL_MOCK=1` | force mock even if proxy URL is set (QA) |

**Live Pages today:** ship without `VITE_MODEL_PROXY_URL` so production stays on
the mock until the key + Worker URL exist. After deploy, rebuild Pages once
with the URL set.

## Checklist when the key lands

1. `cd worker && npm i && npx wrangler login`
2. `npx wrangler secret put XAI_API_KEY`
3. `npx wrangler deploy` → copy Worker URL
4. Rebuild Pages: `VITE_MODEL_PROXY_URL=<url> npm run build` (+ deploy `dist/`)
5. Smoke a near-miss game on https://eliotmjohnson.github.io/20Q/

Do not put `XAI_API_KEY` in client env, GitHub Actions plaintext, or this repo.
