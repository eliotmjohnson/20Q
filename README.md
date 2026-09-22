# 20 Questions

PWA 20Q game — commons decision tree, offline, no account.

Live: https://eliotmjohnson.github.io/20Q/

## Play

Think of anything (animal, object, person). Answer Yes / No / Maybe. The seed tree guesses within 20 questions. Wrong leaf → give up, with optional teach-for-next-time on this device.

## Enhance guesses (experimental opt-in)

Default remains **seed-only**. Open the ⚙ gear on the start screen and enable **Enhance guesses** (stored in `localStorage`).

When ON, after a wrong leaf guess with questions remaining, the app lazy-loads [`@mlc-ai/web-llm`](https://github.com/mlc-ai/web-llm) and runs **SmolLM2-360M-Instruct-q4f16_1-MLC** in the browser (~**210 MB** first download; ~376 MB VRAM). Same Yes/No UI; ≤20 total questions. Cancel / load failure / OOM / timeout → fail-open to give-up / teach.

Desktop Chrome or Edge with WebGPU recommended. Safari / many phones lack usable WebGPU — leave the toggle off on those (seed-only path stays light).

No API keys, no paid services, no Cloudflare Worker on this path.

## App scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Stack

React + TypeScript + Vite + vite-plugin-pwa. Oxlint for lint. Optional WebLLM via dynamic import.

## Parked Worker proxy

`src/modelFallback.ts` and `worker/` remain in the repo but are **not** on the live product path. See [`worker/README.md`](worker/README.md).
