import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Setelah deploy baru, file kode lama (nama berisi hash) sudah tidak ada di
// server. Tab yang masih memakai versi lama akan gagal memuat bagian yang
// dimuat belakangan (chat, peta, kartu 3D, ...). Solusinya: reload sekali
// untuk mengambil versi terbaru. Dijaga supaya tidak reload berulang-ulang.
window.addEventListener('vite:preloadError', (event) => {
  const KEY = 'reload-after-deploy'
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0)
    if (Date.now() - last < 10000) return
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    // Penyimpanan diblokir: tetap reload sekali
  }
  event.preventDefault()
  window.location.reload()
})

// Safari iOS baru menerapkan gaya :active (efek tombol "ditekan") kalau
// halaman punya pendengar touchstart. Pendengar kosong ini cukup.
document.addEventListener('touchstart', () => {}, { passive: true })
