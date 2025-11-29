import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Ava-Kaloyan/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.svg', 'icons/*.png'],
      manifest: {
        name: 'Българско Приключение - Игра за Саша и Лю',
        short_name: 'БГ Приключение',
        description: 'Забавна игра за учене на български за Саша и Лю',
        start_url: './',
        display: 'standalone',
        background_color: '#7c3aed',
        theme_color: '#7c3aed',
        orientation: 'any',
        categories: ['education', 'games', 'kids'],
        lang: 'bg',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Cache all static assets
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        // Ensure the app works fully offline
        navigateFallback: 'index.html',
        navigateFallbackAllowlist: [/^(?!\/__).*/],
        // Don't cache-bust URLs with hashes (Vite handles this)
        dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
        // Cache Tailwind CDN for offline use
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tailwind-cdn-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false // Disable in dev to avoid issues
      }
    })
  ],
  server: {
    port: 3000,
    open: true
  }
})
