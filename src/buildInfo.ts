/**
 * Client cache / PWA bust key.
 * Bump when shipped behavior changes and installed PWAs must drop the prior
 * Workbox precache (e.g. hybrid model path). Prefer this over SEED_VERSION
 * unless the seed tree itself changed — SEED_VERSION also wipes learned trees.
 */
export const CACHE_VERSION = 17
