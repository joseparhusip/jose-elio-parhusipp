import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Safari iOS baru menerapkan gaya :active (efek tombol "ditekan") kalau
// halaman punya pendengar touchstart. Pendengar kosong ini cukup.
document.addEventListener('touchstart', () => {}, { passive: true })
