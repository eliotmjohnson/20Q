import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { CACHE_VERSION } from './src/buildInfo.ts'

export default defineConfig({
  base: '/20Q/',
  plugins: [
    react(),
    VitePWA({
      // Registered from main.tsx via virtual:pwa-register (auto reload on update).
      injectRegister: false,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: '20 Questions',
        short_name: '20Q',
        description: 'Think of anything — I will guess it in 20 questions.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/20Q/',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // Extra precache entry so CACHE_VERSION bumps always mint a new SW.
        additionalManifestEntries: [
          {
            url: `cache-version.json`,
            revision: String(CACHE_VERSION),
          },
        ],
      },
    }),
  ],
})
