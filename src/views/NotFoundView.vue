<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { vReveal } from '@/directives/reveal'
import { lang } from '@/composables/useLang'

// Kartu 3D (Three.js) dimuat terpisah supaya teks halaman tampil lebih dulu
const LanyardCard = defineAsyncComponent(() => import('@/components/LanyardCard.vue'))

/* ---------------------------------------------------------
   Halaman 404: alamat yang dibuka tidak ada.
   Saat dibuka langsung (ketik alamat / refresh), Vercel mengirim
   dist/404.html dengan status 404 asli (lihat scripts/prerender-pages.js),
   lalu aplikasi menampilkan halaman ini. Saat pindah halaman di dalam
   aplikasi, router yang mengarahkan ke sini (rute "catch-all").
   Tampil penuh satu layar sebagai halaman pemberitahuan: kartu ID 3D
   yang "rusak" tergantung miring dari atas layar, pesan, dan tautan teks
   ke beranda. Navbar, footer, & chat disembunyikan di App.vue.
--------------------------------------------------------- */
const route = useRoute()

// Alamat yang dicari, dipotong kalau terlalu panjang
const wantedPath = computed(() => {
  const path = decodeURIComponent(route.fullPath || '/')
  return path.length > 48 ? `${path.slice(0, 45)}…` : path
})
</script>

<template>
  <main class="notfound">
    <div class="container">
      <div class="notfound__body">
        <!-- Kartu 404 tergantung dari tepi atas layar (hiasan, bisa ditarik) -->
        <div class="notfound__hang">
          <LanyardCard variant="notfound" :path="wantedPath" />
        </div>

        <div class="notfound__text">
          <h1 v-reveal.clip="140" class="notfound__title">
            <template v-if="lang === 'en'">This page <span class="serif-accent">got lost</span>.</template>
            <template v-else>Halaman ini <span class="serif-accent">tersesat</span>.</template>
          </h1>
          <p v-reveal="220" class="notfound__lead">
            <template v-if="lang === 'en'">
              The address <code class="notfound__path">{{ wantedPath }}</code> does not exist or
              has been moved. Try starting again from the
              <RouterLink to="/" class="notfound__home">home page</RouterLink>.
            </template>
            <template v-else>
              Alamat <code class="notfound__path">{{ wantedPath }}</code> tidak ada atau
              sudah dipindahkan. Coba mulai lagi dari
              <!-- Tanpa tombol: satu-satunya jalan keluar adalah tautan teks ini -->
              <RouterLink to="/" class="notfound__home">beranda</RouterLink>.
            </template>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Tepat satu layar, tidak bisa di-scroll (lihat html.notice-page di main.css) */
.notfound {
  box-sizing: border-box; /* padding termasuk dalam 100vh, jadi pas satu layar */
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  padding: clamp(1.25rem, 3vw, 2rem) 0;
}

/* Isi di tengah layar */
.notfound > .container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Kartu di kiri, teks di kanan */
.notfound__body {
  --top-gap: clamp(1.25rem, 3vw, 2rem);
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 5vw, 4.5rem);
  align-items: center;
}

/* Slot kartu: mulai dari tepi atas layar supaya tali terlihat tergantung
   dari "langit-langit" */
.notfound__hang {
  --lanyard-max-scale: 1.22;
  align-self: start;
  width: min(250px, 100%);
  height: 640px;
  margin: calc(-1 * var(--top-gap)) auto 0;
}

.notfound__text {
  padding-bottom: 0.5rem;
}

.notfound__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4.2vw, 3.4rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.notfound__lead {
  max-width: 30rem;
  margin: 1rem 0 0;
  font-size: 1.02rem;
  line-height: 1.7;
  color: var(--color-text-soft);
}

.notfound__path {
  padding: 0.1em 0.4em;
  border-radius: 4px;
  background: var(--color-surface-soft);
  font-family: var(--font-mono);
  font-size: 0.86em;
  color: var(--color-text);
  word-break: break-all;
}

.notfound__home {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}

.notfound__home:hover {
  text-decoration-thickness: 2px;
}

@media (max-width: 860px) {
  .notfound__body {
    grid-template-columns: 1fr;
    align-content: start;
    justify-items: center;
    gap: 0;
    text-align: center;
  }

  /* Kartu mengecil di layar pendek supaya teks tetap muat satu layar */
  .notfound__hang {
    --lanyard-max-scale: 0.92;
    width: min(200px, 70%, 21dvh);
    height: min(470px, 56dvh);
  }

  .notfound__text {
    padding-bottom: 1rem;
  }

  /* Kalimat alamat rata kanan-kiri; baris terakhir tetap di tengah */
  .notfound__lead {
    max-width: 26rem;
    margin-inline: auto;
    text-align: justify;
    text-align-last: center;
    hyphens: auto;
  }
}
</style>
