<script setup>
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  section: { type: String, required: true },
})

/* Halaman terpisah (/tentang, /pengalaman, dst.) memakai komponen
   section yang sama dengan beranda, jadi isi & tampilannya identik. */
const sections = {
  tentang: defineAsyncComponent(() => import('@/components/AboutSection.vue')),
  pengalaman: defineAsyncComponent(() => import('@/components/ExperienceSection.vue')),
  proyek: defineAsyncComponent(() => import('@/components/ProjectsSection.vue')),
  kontak: defineAsyncComponent(() => import('@/components/ContactSection.vue')),
}

const current = computed(() => sections[props.section])
</script>

<template>
  <main class="section-page">
    <component :is="current" />
  </main>
</template>

<style scoped>
/* Jaga footer tetap di bawah walau isi halaman pendek */
.section-page {
  min-height: 70vh;
}
</style>
