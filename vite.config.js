import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'node:child_process'
import process from 'node:process'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

function buildVersion() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA
  if (sha) return sha.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return String(Date.now())
  }
}

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

function devApi(routes) {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const [path, file] of Object.entries(routes)) {
        server.middlewares.use(path, async (req, res) => {
          for (const key of ['WAKATIME_USERNAME', 'WAKATIME_API_KEY', 'GITHUB_TOKEN']) {
            if (env[key] && !process.env[key]) process.env[key] = env[key]
          }
          const url = new URL(req.originalUrl || req.url, 'http://localhost')
          req.query = Object.fromEntries(url.searchParams)
          res.status = (code) => {
            res.statusCode = code
            return res
          }
          res.json = (body) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(body))
            return res
          }
          try {
            const { default: handler } = await server.ssrLoadModule(file)
            await handler(req, res)
          } catch (error) {
            res.statusCode = 500
            res.end(String(error))
          }
        })
      }
    },
  }
}

export default defineConfig(({ command }) => {
  const version = command === 'build' ? buildVersion() : 'dev'
  return {
    plugins: [
      vue(),
      vueDevTools(),
      versionFile(version),
      devApi({
        '/api/coding-time': '/api/coding-time.js',
        '/api/github-contributions': '/api/github-contributions.js',
      }),
    ],
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
