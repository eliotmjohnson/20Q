# 20 Questions

PWA 20Q game (commons decision tree + hybrid model near-miss fallback).

Live: https://eliotmjohnson.github.io/20Q/

## Hybrid model proxy

Near-miss fallback can call a Cloudflare Worker that proxies to xAI (Grok).
The API key never ships in the client.

- Scaffold + docs: [`worker/README.md`](worker/README.md)
- Client switch: set `VITE_MODEL_PROXY_URL` at build time → real Worker; unset → local mock (current Pages default until the key arrives)
- Force mock for QA: `VITE_USE_MODEL_MOCK=1`

Do **not** deploy the Worker or put secrets from this repo until an xAI key + `wrangler login` are available.

## App scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Stack

React + TypeScript + Vite + vite-plugin-pwa. Oxlint for lint.
