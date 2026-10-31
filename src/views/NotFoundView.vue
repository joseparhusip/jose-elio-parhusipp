<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { vReveal } from '@/directives/reveal'

/* ---------------------------------------------------------
   Halaman 404: alamat yang dibuka tidak ada.
   Saat dibuka langsung (ketik alamat / refresh), Vercel mengirim
   dist/404.html dengan status 404 asli (lihat scripts/prerender-pages.js),
   lalu aplikasi menampilkan halaman ini. Saat pindah halaman di dalam
   aplikasi, router yang mengarahkan ke sini (rute "catch-all").
   Tampil penuh satu layar sebagai halaman pemberitahuan (hanya angka dan
   pesan, dengan tautan teks ke beranda). Navbar, footer, & chat
   disembunyikan di App.vue.
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
        <!-- Angka besar: "0" di tengah miring biru, senada dengan "Parhusip." -->
        <p v-reveal.clip="60" class="notfound__code" aria-hidden="true">
          4<span class="notfound__code-mid">0</span>4
        </p>

        <div class="notfound__text">
          <h1 v-reveal.clip="140" class="notfound__title">
            Halaman ini <span class="serif-accent">tersesat</span>.
          </h1>
          <p v-reveal="220" class="notfound__lead">
            Alamat <code class="notfound__path">{{ wantedPath }}</code> tidak ada atau
            sudah dipindahkan. Coba mulai lagi dari
            <!-- Tanpa tombol: satu-satunya jalan keluar adalah tautan teks ini -->
            <RouterLink to="/" class="notfound__home">beranda</RouterLink>.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.notfound {
  box-sizing: border-box; /* padding termasuk dalam 100vh, jadi pas satu layar */
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  padding: clamp(1.25rem, 3vw, 2rem) 0;
}

/* Isi di tengah layar */
.notfound > .container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Angka besar di kiri, teks di kanan */
.notfound__body {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 5vw, 4.5rem);
  align-items: center;
  align-content: center;
  padding: clamp(2rem, 5vw, 3rem) 0;
}


.notfound__code {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(7rem, 24vw, 20rem);
  font-weight: 800;
  line-height: 0.8;
  letter-spacing: -0.04em;
  color: var(--color-text);
  user-select: none;
}

.notfound__code-mid {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--color-primary);
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
    align-content: center;
    justify-items: center;
    text-align: center;
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
