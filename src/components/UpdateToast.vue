<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { t } from '@/composables/useLang'

/* ---------------------------------------------------------
   Notifikasi "Versi baru tersedia".
   Setiap build menulis /version.json (lihat vite.config.js). Situs
   mencocokkan isinya dengan versi yang sedang dipakai:
   - saat pengunjung kembali ke tab ini,
   - saat internet tersambung lagi,
   - dan setiap 10 menit selama tab terbuka & terlihat.
   Kalau beda, muncul notifikasi kecil. Halaman TIDAK di-reload paksa,
   supaya isian chat/posisi baca pengunjung tidak hilang.
   Hanya membaca file situs sendiri: tanpa pelacak, tanpa cookie.

   Untuk melihat tampilannya tanpa menunggu deploy: buka situs dengan
   akhiran ?cek-update (mis. joseparhusip.com/?cek-update).
--------------------------------------------------------- */
const CURRENT = import.meta.env.VITE_APP_VERSION
const CHECK_EVERY_MS = 10 * 60 * 1000
const MIN_GAP_MS = 60 * 1000 // jangan cek lebih sering dari 1x per menit

const visible = ref(false)
const reloading = ref(false)
let dismissedVersion = null
let lastCheck = 0
let timer = 0

async function check() {
  if (!CURRENT || CURRENT === 'dev' || document.hidden || !navigator.onLine) return
  if (Date.now() - lastCheck < MIN_GAP_MS) return
  lastCheck = Date.now()
  try {
    const res = await fetch(`/version.json?t=${lastCheck}`, { cache: 'no-store' })
    if (!res.ok) return
    const { v } = await res.json()
    if (v && v !== CURRENT && v !== dismissedVersion) {
      dismissedVersion = v
      visible.value = true
    }
  } catch {
    // Gagal cek (mis. jaringan putus): coba lagi di kesempatan berikutnya
  }
}

function onVisibility() {
  if (!document.hidden) check()
}

function reload() {
  reloading.value = true
  window.location.reload()
}

function dismiss() {
  visible.value = false
}

onMounted(() => {
  // Mode pratinjau: tampilkan notifikasi langsung
  if (new URLSearchParams(window.location.search).has('cek-update')) {
    setTimeout(() => (visible.value = true), 800)
  }
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('online', check)
  timer = setInterval(check, CHECK_EVERY_MS)
})

onUnmounted(() => {
  clearInterval(timer)
  document.removeEventListener('visibilitychange', onVisibility)
  window.removeEventListener('online', check)
})
</script>

<template>
  <Transition name="update">
    <div v-if="visible" class="update" role="status" aria-live="polite">
      <span class="update__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
        </svg>
      </span>
      <div class="update__text">
        <p class="update__label mono-meta">{{ t({ id: 'Pembaruan', en: 'Update' }) }}</p>
        <p class="update__title">{{ t({ id: 'Versi baru tersedia.', en: 'A new version is available.' }) }}</p>
      </div>
      <button type="button" class="btn btn--primary update__btn" :disabled="reloading" @click="reload">
        {{ reloading ? t({ id: 'Memuat…', en: 'Loading…' }) : t({ id: 'Muat ulang', en: 'Reload' }) }}
      </button>
      <button
        type="button"
        class="btn-close update__close"
        :aria-label="t({ id: 'Tutup', en: 'Close' })"
        @click="dismiss"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/* Pojok kiri bawah (kanan bawah sudah dipakai tombol chat & ke atas) */
.update {
  position: fixed;
  left: 1.25rem;
  bottom: 1.25rem;
  z-index: 9000;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  max-width: calc(100vw - 2.5rem);
  box-sizing: border-box;
  padding: 0.7rem 0.7rem 0.7rem 0.85rem;
  border: 1px solid var(--color-rule);
  border-radius: var(--radius);
  background: var(--color-surface);
  box-shadow: 0 24px 48px -24px rgba(0, 0, 0, 0.55);
}

.update__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
  color: var(--color-primary);
}

.update__text {
  min-width: 0;
}

.update__label,
.update__title {
  margin: 0;
}

.update__title {
  margin-top: 0.15rem;
  font-family: var(--font-heading);
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
}

.update__btn {
  min-height: 38px;
  padding: 0 0.95rem;
  font-size: 0.85rem;
  white-space: nowrap;
}

.update__close {
  --close-size: 38px;
}

/* HP: selebar layar di atas tombol mengambang, judul boleh turun baris */
@media (max-width: 520px) {
  .update {
    left: 0.75rem;
    right: 0.75rem;
    bottom: calc(5.25rem + env(safe-area-inset-bottom));
    max-width: none;
    gap: 0.6rem;
  }

  .update__icon {
    display: none;
  }

  .update__text {
    flex: 1;
  }

  .update__title {
    white-space: normal;
    font-size: 0.92rem;
  }
}

.update-enter-active,
.update-leave-active {
  transition: opacity 0.3s ease, transform 0.4s var(--ease-out);
}

.update-enter-from,
.update-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
