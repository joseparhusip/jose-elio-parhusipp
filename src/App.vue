<script setup>
import TheLoader from './components/TheLoader.vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import ChatWidget from './components/ChatWidget.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import CustomCursor from './components/CustomCursor.vue'
</script>

<template>
  <TheLoader />
  <ScrollProgress />
  <!-- Dibungkus supaya bisa "zoom" masuk saat loader selesai (lihat TheLoader.vue) -->
  <div class="app-stage">
    <TheNavbar />
    <RouterView />
    <TheFooter />
  </div>
  <!-- Widget chat mengambang, tampil di semua halaman -->
  <ChatWidget />
  <!-- Kursor custom (hanya perangkat dengan mouse) -->
  <CustomCursor />
</template>
