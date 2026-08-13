<script setup>
import TheLoader from './components/TheLoader.vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
</script>

<template>
  <TheLoader />
  <TheNavbar />
  <RouterView />
  <TheFooter />
</template>
