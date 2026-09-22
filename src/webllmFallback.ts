/**
 * In-browser WebLLM fallback (experimental opt-in).
 *
 * Product rule: seed tree owns guesses. When "Enhance guesses" is ON and the
 * player rejects a leaf with questions remaining, we lazy-load @mlc-ai/web-llm
 * and ask a tiny local chat model for a follow-up yes/no or guess.
 *
 * No API keys, no proxy, no Cloudflare Worker. Fail-open on load/OOM/timeout/
 * cancel/parse errors → caller shows give-up / teach.
 *
 * Model: SmolLM2-360M-Instruct-q4f16_1-MLC (~210 MB first download, ~376 MB VRAM).
 * Falls back to q4f32_1 if shader-f16 is unavailable.
 */

export type Answer = 'yes' | 'no' | 'maybe'

export type QaTurn = {
  question: string
  answer: Answer
}

export type ModelResponse =
  | { type: 'question'; text: string }
  | { type: 'guess'; name: string }

type WebLLMModule = typeof import('@mlc-ai/web-llm')

export type WebLLMProgress = {
  phase: 'downloading' | 'thinking'
  text: string
  /** 0–1 while downloading; 1 once ready / thinking */
  progress: number
}

export const ENHANCE_STORAGE_KEY = 'twentyq-enhance-guesses'

/** Primary tiny chat model (WebLLM prebuilt list). */
export const WEBLLM_MODEL_ID = 'SmolLM2-360M-Instruct-q4f16_1-MLC'
/** Broader GPU support when f16 shaders are missing. */
export const WEBLLM_MODEL_ID_F32 = 'SmolLM2-360M-Instruct-q4f32_1-MLC'
/** Approximate first-download size for the q4f16 weights + wasm (docs / catalogs). */
export const WEBLLM_MODEL_DOWNLOAD_MB = 210

const LOAD_TIMEOUT_MS = 180_000
const INFER_TIMEOUT_MS = 45_000

type EngineLike = {
  chat: {
    completions: {
      create: (req: Record<string, unknown>) => Promise<{
        choices: Array<{ message?: { content?: string | null } }>
      }>
    }
  }
  interruptGenerate: () => void | Promise<void>
  unload?: () => Promise<void>
}

let enginePromise: Promise<EngineLike> | null = null
let engine: EngineLike | null = null
let loadedModelId: string | null = null
let cancelled = false
let progressHandler: ((p: WebLLMProgress) => void) | null = null

export function isEnhanceEnabled(): boolean {
  try {
    return localStorage.getItem(ENHANCE_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function setEnhanceEnabled(on: boolean): void {
  try {
    localStorage.setItem(ENHANCE_STORAGE_KEY, on ? '1' : '0')
  } catch {
    /* private mode */
  }
}

export function setWebLLMProgressHandler(
  handler: ((p: WebLLMProgress) => void) | null,
): void {
  progressHandler = handler
}

export function cancelWebLLM(): void {
  cancelled = true
  try {
    void engine?.interruptGenerate()
  } catch {
    /* ignore */
  }
}

function emit(p: WebLLMProgress): void {
  try {
    progressHandler?.(p)
  } catch {
    /* UI handler errors must not break inference */
  }
}

function throwIfCancelled(): void {
  if (cancelled) throw new Error('WebLLM cancelled')
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`${label} timed out`)), ms)
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

export function isWebGPUAvailable(): boolean {
  try {
    return typeof navigator !== 'undefined' && 'gpu' in navigator
  } catch {
    return false
  }
}

const WEBLLM_CDN =
  'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.85/+esm'

async function loadWebLLMModule(): Promise<WebLLMModule> {
  // CDN dynamic import: keeps ~6 MB runtime out of the Vite/PWA precache so
  // seed-only phones never download it. Types come from the npm package.
  // Variable URL + Function avoids TS2307 / bundler resolving the CDN string.
  const dynamicImport = new Function(
    'u',
    'return import(u)',
  ) as (u: string) => Promise<unknown>
  const mod = await dynamicImport(WEBLLM_CDN)
  return mod as WebLLMModule
}

async function createEngine(modelId: string): Promise<EngineLike> {
  const webllm = await loadWebLLMModule()
  throwIfCancelled()

  const created = await webllm.CreateMLCEngine(modelId, {
    initProgressCallback: (report) => {
      const progress =
        typeof report.progress === 'number' && Number.isFinite(report.progress)
          ? Math.max(0, Math.min(1, report.progress))
          : 0
      const text = (report.text || 'Downloading model…').trim()
      emit({
        phase: progress >= 1 ? 'thinking' : 'downloading',
        text: progress >= 1 ? 'Model ready…' : text || 'Downloading model…',
        progress,
      })
    },
  })
  return created as unknown as EngineLike
}

async function ensureEngine(): Promise<EngineLike> {
  if (engine) return engine
  if (enginePromise) return enginePromise

  if (!isWebGPUAvailable()) {
    throw new Error('WebGPU not available')
  }

  enginePromise = (async () => {
    try {
      const primary = await withTimeout(
        createEngine(WEBLLM_MODEL_ID),
        LOAD_TIMEOUT_MS,
        'Model download',
      )
      throwIfCancelled()
      engine = primary
      loadedModelId = WEBLLM_MODEL_ID
      return primary
    } catch (err) {
      // f16 missing / OOM on primary → try f32 variant once.
      const msg = err instanceof Error ? err.message : String(err)
      if (/cancel/i.test(msg)) throw err
      emit({
        phase: 'downloading',
        text: 'Retrying with compatible model…',
        progress: 0,
      })
      const fallback = await withTimeout(
        createEngine(WEBLLM_MODEL_ID_F32),
        LOAD_TIMEOUT_MS,
        'Model download',
      )
      throwIfCancelled()
      engine = fallback
      loadedModelId = WEBLLM_MODEL_ID_F32
      return fallback
    }
  })()

  try {
    return await enginePromise
  } catch (err) {
    enginePromise = null
    engine = null
    loadedModelId = null
    throw err
  }
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

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    /* fall through */
  }
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1))
    } catch {
      /* fall through */
    }
  }
  // Soft parse: "QUESTION: ..." / "GUESS: ..."
  const q = trimmed.match(/^(?:question|q)\s*[:-]\s*(.+)$/im)
  if (q?.[1]) return { type: 'question', text: q[1].trim() }
  const g = trimmed.match(/^(?:guess|g)\s*[:-]\s*(.+)$/im)
  if (g?.[1]) return { type: 'guess', name: g[1].trim() }
  throw new Error('Model returned non-JSON')
}

function buildPrompt(
  history: QaTurn[],
  remaining: number,
  wrongGuess?: string,
): { system: string; user: string } {
  const system = [
    'You are helping play 20 Questions.',
    'Given prior yes/no answers, respond with ONLY a single JSON object, no markdown:',
    '{"type":"question","text":"<short yes/no question>"}',
    'or',
    '{"type":"guess","name":"<thing>"}',
    'Rules: one yes/no question OR one concrete guess; do not repeat prior questions;',
    'keep questions short; prefer a guess when remaining is 1.',
  ].join(' ')

  const lines = history.map(
    (h, i) => `${i + 1}. Q: ${h.question} → ${h.answer}`,
  )
  const user = [
    lines.length ? `History:\n${lines.join('\n')}` : 'History: (none yet)',
    wrongGuess ? `Wrong leaf guess: ${wrongGuess}` : null,
    `Questions remaining (including your next ask/guess): ${remaining}`,
    'Return JSON only.',
  ]
    .filter(Boolean)
    .join('\n')

  return { system, user }
}

/**
 * Ask the in-browser model. Throws on cancel / load / OOM / timeout / bad JSON.
 * Callers must fail-open to give-up.
 */
export async function askWebLLMFallback(
  history: QaTurn[],
  remaining: number,
  wrongGuess?: string,
): Promise<ModelResponse> {
  cancelled = false

  if (remaining <= 0) {
    throw new Error('No questions remaining')
  }

  emit({ phase: 'downloading', text: 'Downloading model…', progress: 0 })

  const eng = await ensureEngine()
  throwIfCancelled()

  emit({ phase: 'thinking', text: 'Still thinking…', progress: 1 })

  const { system, user } = buildPrompt(history, remaining, wrongGuess)

  const completion = await withTimeout(
    eng.chat.completions.create({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.7,
      max_tokens: 96,
      // Best-effort structured output when the runtime supports it.
      response_format: { type: 'json_object' },
    }),
    INFER_TIMEOUT_MS,
    'Model inference',
  )

  throwIfCancelled()

  const content = completion.choices?.[0]?.message?.content
  if (!content || typeof content !== 'string') {
    throw new Error('Empty model response')
  }

  const parsed = extractJsonObject(content)
  if (!isModelResponse(parsed)) {
    throw new Error('Invalid ModelResponse shape')
  }

  if (parsed.type === 'question') {
    const text = parsed.text.trim()
    return {
      type: 'question',
      text: text.endsWith('?') ? text : `${text}?`,
    }
  }
  return { type: 'guess', name: parsed.name.trim() }
}

/** Test/debug helper — which model id is loaded (if any). */
export function getLoadedWebLLMModelId(): string | null {
  return loadedModelId
}
