<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/* ---------------------------------------------------------
   Layar "Koneksi terputus": muncul otomatis saat internet hilang
   (event offline dari browser) dan menutup sendiri saat tersambung
   lagi, didahului pesan singkat "Tersambung kembali".
   Tombol "Coba lagi" memeriksa koneksi dengan memanggil situs sendiri.

   Catatan: ini hanya bekerja kalau situs sudah sempat terbuka. Kalau
   pengunjung membuka situs dalam keadaan offline sejak awal, browser
   yang menampilkan halaman offline-nya sendiri.
--------------------------------------------------------- */
const state = ref('online') // online | offline | back
const checking = ref(false)
let backTimer = 0

function goOffline() {
  clearTimeout(backTimer)
  state.value = 'offline'
}

function goOnline() {
  if (state.value !== 'offline') return
  state.value = 'back'
  backTimer = setTimeout(() => (state.value = 'online'), 1600)
}

async function retry() {
  if (checking.value) return
  checking.value = true
  try {
    // Permintaan kecil tanpa cache: berhasil = benar-benar tersambung
    await fetch(`/favicon.ico?cek=${Date.now()}`, { method: 'HEAD', cache: 'no-store' })
    goOnline()
  } catch {
    // Masih offline: biarkan layar tetap tampil
  } finally {
    setTimeout(() => (checking.value = false), 500)
  }
}

onMounted(() => {
  if (!navigator.onLine) goOffline()
  window.addEventListener('offline', goOffline)
  window.addEventListener('online', goOnline)
})

onUnmounted(() => {
  clearTimeout(backTimer)
  window.removeEventListener('offline', goOffline)
  window.removeEventListener('online', goOnline)
})
</script>

<template>
  <Transition name="offline">
    <div
      v-if="state !== 'online'"
      class="offline"
      :class="{ 'offline--back': state === 'back' }"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="offline-title"
      aria-describedby="offline-desc"
    >
      <div class="offline__card">
        <div class="offline__strip mono-meta">
          <span>Status · Jaringan</span>
          <span class="offline__status">
            <span class="offline__dot" aria-hidden="true"></span>
            {{ state === 'back' ? 'Tersambung' : 'Offline' }}
          </span>
        </div>

        <!-- Ikon sinyal: garis putus saat offline, utuh saat tersambung -->
        <svg class="offline__icon" viewBox="0 0 64 64" aria-hidden="true">
          <path class="offline__wave offline__wave--3" d="M8 26a34 34 0 0 1 48 0" />
          <path class="offline__wave offline__wave--2" d="M16 34a23 23 0 0 1 32 0" />
          <path class="offline__wave offline__wave--1" d="M24 42a12 12 0 0 1 16 0" />
          <circle cx="32" cy="50" r="3.2" class="offline__point" />
          <path v-if="state !== 'back'" class="offline__slash" d="M12 12 52 52" />
        </svg>

        <h2 id="offline-title" class="offline__title">
          <template v-if="state === 'back'">
            Tersambung <span class="serif-accent">kembali</span>.
          </template>
          <template v-else>
            Koneksi <span class="serif-accent">terputus</span>.
          </template>
        </h2>
        <p id="offline-desc" class="offline__lead">
          <template v-if="state === 'back'">Internet sudah kembali. Silakan lanjutkan.</template>
          <template v-else>
            Data tidak bisa dimuat tanpa internet. Periksa Wi-Fi atau data seluler,
            halaman ini akan tersambung lagi otomatis.
          </template>
        </p>

        <button
          v-if="state !== 'back'"
          type="button"
          class="btn btn--primary offline__btn"
          :disabled="checking"
          @click="retry"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
            :class="{ 'offline__spin': checking }"
          >
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" />
          </svg>
          {{ checking ? 'Memeriksa…' : 'Coba lagi' }}
        </button>

        <p v-if="state !== 'back'" class="offline__hint mono-meta">
          <span class="offline__pulse" aria-hidden="true"></span>
          Menunggu koneksi
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.offline {
  position: fixed;
  inset: 0;
  z-index: 9998; /* di bawah loader (9999), di atas semua isi */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: color-mix(in srgb, var(--color-bg) 88%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.offline__card {
  /* Boleh menyempit di HP (min-width: 0), maksimal 440px di layar lebar */
  flex: 0 1 440px;
  min-width: 0;
  box-sizing: border-box;
  padding: 1.25rem 1.5rem 1.75rem;
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.55);
  text-align: center;
}

.offline__strip {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--color-rule);
  text-align: left;
  white-space: nowrap;
}

.offline__status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
}

.offline__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-danger);
  transition: background-color 0.3s ease;
}

.offline--back .offline__dot {
  background: var(--color-accent);
}

/* ---- Ikon sinyal ---- */
.offline__icon {
  display: block;
  width: 72px;
  height: 72px;
  margin: 1.75rem auto 1.25rem;
}

.offline__wave,
.offline__slash {
  fill: none;
  stroke-width: 3.2;
  stroke-linecap: round;
}

.offline__wave {
  stroke: var(--color-text-soft);
  stroke-dasharray: 5 7;
  opacity: 0.55;
  transition: stroke 0.3s ease, opacity 0.3s ease;
}

.offline__point {
  fill: var(--color-text);
}

.offline__slash {
  stroke: var(--color-danger);
}

/* Tersambung: gelombang jadi utuh & berwarna */
.offline--back .offline__wave {
  stroke: var(--color-accent);
  stroke-dasharray: none;
  opacity: 1;
}

.offline__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 6vw, 2.3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.offline__lead {
  max-width: 22rem;
  margin: 0.8rem auto 0;
  font-size: 0.98rem;
  line-height: 1.65;
  color: var(--color-text-soft);
}

.offline__btn {
  min-height: 48px;
  margin-top: 1.5rem;
  padding: 0 1.5rem;
}

.offline__btn:disabled {
  opacity: 0.75;
  cursor: progress;
}

.offline__spin {
  animation: offline-spin 0.8s linear infinite;
}

/* Baris sendiri di bawah tombol, rata tengah */
.offline__hint {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.55rem;
  margin: 1.25rem 0 0;
}

.offline__pulse {
  position: relative;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-text-soft);
}

.offline__pulse::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid var(--color-text-soft);
  animation: offline-ping 1.8s var(--ease-out) infinite;
}

@keyframes offline-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes offline-ping {
  from {
    transform: scale(0.6);
    opacity: 0.9;
  }
  to {
    transform: scale(1.9);
    opacity: 0;
  }
}

/* Muncul & hilang */
.offline-enter-active,
.offline-leave-active {
  transition: opacity 0.35s ease;
}

.offline-enter-active .offline__card,
.offline-leave-active .offline__card {
  transition: transform 0.45s var(--ease-out), opacity 0.35s ease;
}

.offline-enter-from,
.offline-leave-to {
  opacity: 0;
}

.offline-enter-from .offline__card,
.offline-leave-to .offline__card {
  opacity: 0;
  transform: translateY(14px) scale(0.98);
}
</style>
