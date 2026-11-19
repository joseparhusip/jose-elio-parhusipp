import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

window.addEventListener('vite:preloadError', (event) => {
  const KEY = 'reload-after-deploy'
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0)
    if (Date.now() - last < 10000) return
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
  }
  event.preventDefault()
  window.location.reload()
})

document.addEventListener('touchstart', () => {}, { passive: true })
