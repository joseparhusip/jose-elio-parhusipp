<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TheLoader from './components/TheLoader.vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import ChatWidget from './components/ChatWidget.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import CustomCursor from './components/CustomCursor.vue'
import OfflineScreen from './components/OfflineScreen.vue'

// Halaman pemberitahuan (404) tampil penuh: tanpa navbar, footer, & chat
const route = useRoute()
const isNotice = computed(() => Boolean(route.meta.notFound))
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
  <ChatWidget v-if="!isNotice" />
  <!-- Layar "Koneksi terputus" saat internet hilang -->
  <OfflineScreen />
  <!-- Kursor custom (hanya perangkat dengan mouse) -->
  <CustomCursor />
</template>
