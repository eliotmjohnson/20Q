/**
 * Hybrid model fallback (stub).
 *
 * Product rule: the commons tree owns guesses; the model only runs on a near-miss
 * (wrong leaf guess with questions still remaining).
 *
 * Later wiring:
 *   VITE_MODEL_PROXY_URL  — Cloudflare Worker URL that proxies to xAI (never call
 *                           the model provider from the browser). When set, this
 *                           module will POST { history, remaining } and expect a
 *                           ModelResponse JSON body. Not implemented in this spike.
 *
 * Fail-open demo (mock only):
 *   ?modelFail=1                 — throw after the mock delay
 *   sessionStorage key
 *     twentyq-model-fail = '1'   — same
 *   VITE_MODEL_MOCK_FAIL=1       — build-time flag
 */

export type Answer = 'yes' | 'no' | 'maybe'

export type QaTurn = {
  question: string
  answer: Answer
}

export type ModelResponse =
  | { type: 'question'; text: string }
  | { type: 'guess'; name: string }

/** Documented for the Worker + xAI step; unused in this stub. */
export const MODEL_PROXY_ENV = 'VITE_MODEL_PROXY_URL'

const PROXY_URL =
  (typeof import.meta !== 'undefined' &&
    (import.meta.env?.VITE_MODEL_PROXY_URL as string | undefined)?.trim()) ||
  ''

/** Spike always ships a local mock; later flip USE_MOCK off when proxy is required. */
const USE_MOCK = true

const MOCK_DELAY_MS = 450
const MOCK_TIMEOUT_MS = 8_000

const DISTINGUISHING_Q =
  'Is it something uncommon, niche, or hard to categorize with a simple yes/no?'

export function isModelEnabled(): boolean {
  return USE_MOCK || Boolean(PROXY_URL)
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function shouldSimulateFail(): boolean {
  try {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search)
      if (q.get('modelFail') === '1') return true
      if (sessionStorage.getItem('twentyq-model-fail') === '1') return true
    }
  } catch {
    /* private mode / SSR */
  }
  try {
    return import.meta.env?.VITE_MODEL_MOCK_FAIL === '1'
  } catch {
    return false
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('Model request timed out')), ms)
    promise.then(
      (v) => {
        clearTimeout(id)
        resolve(v)
      },
      (err) => {
        clearTimeout(id)
        reject(err)
      },
    )
  })
}

/**
 * Deterministic mock: one distinguishing question (if budget allows), then a guess.
 * Real proxy path is intentionally not called yet.
 */
async function mockAsk(
  history: QaTurn[],
  remaining: number,
): Promise<ModelResponse> {
  await delay(MOCK_DELAY_MS)

  if (shouldSimulateFail()) {
    throw new Error('Simulated model failure')
  }

  const alreadyAsked = history.some((h) => h.question === DISTINGUISHING_Q)

  if (!alreadyAsked && remaining > 1) {
    return { type: 'question', text: DISTINGUISHING_Q }
  }

  const last = history[history.length - 1]
  if (last?.question === DISTINGUISHING_Q && last.answer === 'yes') {
    return { type: 'guess', name: 'something unusual' }
  }

  // Prefer a concrete noun from an earlier yes, else generic.
  const yesTurn = [...history].reverse().find((h) => h.answer === 'yes')
  if (yesTurn && /animal|person|food|electronic|living/i.test(yesTurn.question)) {
    return { type: 'guess', name: 'something else in that category' }
  }

  return { type: 'guess', name: 'something else' }
}

/**
 * Ask the model (mock for this spike). Always fail-open at the call site on throw.
 * `remaining` is questions left in the ≤20 budget (not including a pending ask).
 */
export async function askModelFallback(
  history: QaTurn[],
  remaining: number,
): Promise<ModelResponse> {
  // Spike: never hit the network even if VITE_MODEL_PROXY_URL is set.
  // Later:
  //   if (PROXY_URL) {
  //     const res = await fetch(PROXY_URL, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ history, remaining }),
  //     })
  //     if (!res.ok) throw new Error(`Model proxy ${res.status}`)
  //     return (await res.json()) as ModelResponse
  //   }
  void PROXY_URL

  return withTimeout(mockAsk(history, remaining), MOCK_TIMEOUT_MS)
}
