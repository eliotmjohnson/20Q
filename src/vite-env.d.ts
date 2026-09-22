/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_MODEL_PROXY_URL?: string
  readonly VITE_USE_MODEL_MOCK?: string
  readonly VITE_MODEL_MOCK_FAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
