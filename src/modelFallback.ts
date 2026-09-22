/**
 * Hybrid model fallback.
 *
 * Product rule: the commons tree owns guesses; the model only runs on a near-miss
 * (wrong leaf guess with questions still remaining).
 *
 * Wiring:
 *   VITE_MODEL_PROXY_URL  — Cloudflare Worker URL that proxies to xAI (never call
 *                           the model provider from the browser). When set, POST
 *                           { history, remaining } and expect ModelResponse JSON.
 *   VITE_USE_MODEL_MOCK=1 — force the local mock even if the proxy URL is set (QA).
 *
 * Prefer: proxy URL set → real Worker; else mock (local / Pages until key arrives).
 *
 * Fail-open demo (mock path):
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

export const MODEL_PROXY_ENV = 'VITE_MODEL_PROXY_URL'

const PROXY_URL =
  (typeof import.meta !== 'undefined' &&
    (import.meta.env?.VITE_MODEL_PROXY_URL as string | undefined)?.trim()) ||
  ''

const FORCE_MOCK =
  typeof import.meta !== 'undefined' &&
  import.meta.env?.VITE_USE_MODEL_MOCK === '1'

/** Real proxy when URL is set and mock is not forced; otherwise local mock. */
const USE_MOCK = FORCE_MOCK || !PROXY_URL

const MOCK_DELAY_MS = 450
const MOCK_TIMEOUT_MS = 8_000
const PROXY_TIMEOUT_MS = 12_000

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

function isModelResponse(raw: unknown): raw is ModelResponse {
  if (!raw || typeof raw !== 'object') return false
  const o = raw as Record<string, unknown>
  if (o.type === 'question' && typeof o.text === 'string' && o.text.trim()) {
    return true
  }
  if (o.type === 'guess' && typeof o.name === 'string' && o.name.trim()) {
    return true
  }
  return false
}

/**
 * Deterministic mock: one distinguishing question (if budget allows), then a guess.
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

async function proxyAsk(
  history: QaTurn[],
  remaining: number,
): Promise<ModelResponse> {
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history, remaining }),
  })
  if (!res.ok) {
    throw new Error(`Model proxy ${res.status}`)
  }
  const data: unknown = await res.json()
  if (!isModelResponse(data)) {
    throw new Error('Model proxy returned invalid ModelResponse')
  }
  return data
}

/**
 * Ask the model (Worker proxy when configured, else mock).
 * Always fail-open at the call site on throw.
 * `remaining` is questions left in the ≤20 budget (not including a pending ask).
 */
export async function askModelFallback(
  history: QaTurn[],
  remaining: number,
): Promise<ModelResponse> {
  if (!USE_MOCK && PROXY_URL) {
    return withTimeout(proxyAsk(history, remaining), PROXY_TIMEOUT_MS)
  }
  return withTimeout(mockAsk(history, remaining), MOCK_TIMEOUT_MS)
}
