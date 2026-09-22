<script setup>
import TheLoader from './components/TheLoader.vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import ChatWidget from './components/ChatWidget.vue'
</script>

<template>
  <TheLoader />
  <TheNavbar />
  <RouterView />
  <TheFooter />
  <!-- Widget chat mengambang, tampil di semua halaman -->
  <ChatWidget />
</template>
