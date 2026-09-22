# 20 Questions

PWA 20Q game — commons decision tree, offline, no account.

Live: https://eliotmjohnson.github.io/20Q/

## Play

Think of anything (animal, object, person). Answer Yes / No / Maybe. The seed tree guesses within 20 questions. Wrong leaf → give up, with optional teach-for-next-time on this device.

## App scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Stack

React + TypeScript + Vite + vite-plugin-pwa. Oxlint for lint.

## Hybrid model (parked)

`src/modelFallback.ts` and `worker/` stay in the repo but are **not** on the live product path. `App.tsx` never calls the model; wrong leaf fails open to give-up / learn.

To opt in later: set `VITE_ENABLE_MODEL=1` and `VITE_MODEL_PROXY_URL` at build, then re-wire `App.tsx`. See [`worker/README.md`](worker/README.md). Do not deploy the Worker or ship secrets until an xAI key + `wrangler login` are available.
