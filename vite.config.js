import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'node:child_process'
import process from 'node:process'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Kode versi build: commit Git (Vercel mengisinya otomatis), cadangan waktu build.
// Dipakai notifikasi "Versi baru tersedia" (src/components/UpdateToast.vue).
function buildVersion() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA
  if (sha) return sha.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return String(Date.now())
  }
}

// Menulis dist/version.json berisi kode versi build ini
function versionFile(version) {
  return {
    name: 'version-file',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ v: version }),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const version = command === 'build' ? buildVersion() : 'dev'
  return {
    plugins: [vue(), vueDevTools(), versionFile(version)],
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
