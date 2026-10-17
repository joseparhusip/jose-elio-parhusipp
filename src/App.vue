<script setup>
import TheLoader from './components/TheLoader.vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import ChatWidget from './components/ChatWidget.vue'
import ScrollProgress from './components/ScrollProgress.vue'
</script>

<template>
  <TheLoader />
  <ScrollProgress />
  <TheNavbar />
  <RouterView />
  <TheFooter />
  <!-- Widget chat mengambang, tampil di semua halaman -->
  <ChatWidget />
</template>
