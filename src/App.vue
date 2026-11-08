<script setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TheLoader from './components/TheLoader.vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import CustomCursor from './components/CustomCursor.vue'
import OfflineScreen from './components/OfflineScreen.vue'
import UpdateToast from './components/UpdateToast.vue'
import { useChatWidgetStore } from './stores/chatWidget'
import { privacyOpen } from './composables/usePrivacy'

// Halaman pemberitahuan (404) tampil penuh: tanpa navbar, footer, & chat
const route = useRoute()
const isNotice = computed(() => Boolean(route.meta.notFound))

/* Widget chat & pop up privasi tidak dibutuhkan di layar pertama, jadi
   kodenya dipisah dan baru dimuat belakangan (halaman awal lebih ringan).
   - Chat: dimuat saat browser senggang, atau langsung saat diminta
     (mis. tombol "Mulai Chat" diklik sebelum widget sempat dimuat).
   - Privasi: baru dimuat saat pertama kali dibuka. */
const ChatWidget = defineAsyncComponent(() => import('./components/ChatWidget.vue'))
const PrivacyDialog = defineAsyncComponent(() => import('./components/PrivacyDialog.vue'))

const chatStore = useChatWidgetStore()
const chatReady = ref(false)
const privacyReady = ref(false)

watch(
  () => chatStore.isOpen,
  (open) => {
    if (open) chatReady.value = true
  },
)
watch(privacyOpen, (open) => {
  if (open) privacyReady.value = true
})

// Halaman pemberitahuan dikunci satu layar (lihat html.notice-page di main.css)
watch(isNotice, (notice) => document.documentElement.classList.toggle('notice-page', notice), {
  immediate: true,
})

onMounted(() => {
  const whenIdle = window.requestIdleCallback || ((fn) => setTimeout(fn, 2000))
  whenIdle(() => (chatReady.value = true), { timeout: 4000 })
})
</script>

<template>
  <TheLoader />
  <ScrollProgress v-if="!isNotice" />
  <!-- Dibungkus supaya bisa "zoom" masuk saat loader selesai (lihat TheLoader.vue) -->
  <div class="app-stage">
    <TheNavbar v-if="!isNotice" />
    <RouterView />
    <TheFooter v-if="!isNotice" />
  </div>
  <!-- Widget chat mengambang, tampil di semua halaman kecuali pemberitahuan -->
  <ChatWidget v-if="!isNotice && chatReady" />
  <!-- Pop up kebijakan privasi (dibuka dari footer) -->
  <PrivacyDialog v-if="privacyReady" />
  <!-- Layar "Koneksi terputus" saat internet hilang -->
  <OfflineScreen />
  <!-- Notifikasi "Versi baru tersedia" setelah deploy baru -->
  <UpdateToast />
  <!-- Kursor custom (hanya perangkat dengan mouse) -->
  <CustomCursor />
</template>
