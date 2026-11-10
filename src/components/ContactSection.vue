<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useChatWidgetStore } from '../stores/chatWidget'
import { vReveal } from '@/directives/reveal'
import { vType } from '@/directives/type'
import { loaderDone } from '@/composables/useLoaderState'
import { lang, t } from '@/composables/useLang'

const chatStore = useChatWidgetStore()

// Klik "Email" ATAU kartu ajakan chat sama-sama membuka widget chat
// mengambang di pojok kanan bawah, alih-alih membuka aplikasi email.
function openChat() {
  chatStore.open()
}

// Proteksi gambar: cegah klik kanan (save as) & drag gambar keluar dari halaman
function preventImageAction(event) {
  event.preventDefault()
  return false
}

/* ---------------------------------------------------------
   Animasi geser besar: kartu info + peta masuk dari KIRI, kartu
   form masuk dari KANAN. Yang diamati IntersectionObserver adalah
   WADAH tiap kartu (diam di tempat), bukan kartunya. Kalau kartu
   yang meluncur yang diamati, posisinya yang di luar layar bikin
   observer mengira "belum kelihatan" dan animasinya tidak mulai.
   Tiap kartu punya pemicu sendiri, jadi di HP (kartu ditumpuk
   atas-bawah) form baru meluncur saat kamu scroll sampai ke sana.
--------------------------------------------------------- */
const infoWrap = ref(null)
const formWrap = ref(null)
const infoIn = ref(false)
const formIn = ref(false)
let slideObserver = null

onMounted(() => {
  slideObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        if (entry.target === infoWrap.value) infoIn.value = true
        else if (entry.target === formWrap.value) formIn.value = true
        slideObserver.unobserve(entry.target)
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
  )
  // Tunggu loader selesai, supaya kalau halaman di-reload tepat di bagian
  // kontak, animasinya tidak habis di balik tirai loader
  const startObserving = () => {
    slideObserver.observe(infoWrap.value)
    slideObserver.observe(formWrap.value)
  }
  if (loaderDone.value) startObserving()
  else {
    const stop = watch(loaderDone, (done) => {
      if (!done) return
      stop()
      startObserving()
    })
  }
})

onBeforeUnmount(() => {
  slideObserver?.disconnect()
})

/* ---- Jam lokal Bekasi (WIB), berjalan langsung ----
   Memberi gambaran kapan pesan kemungkinan dibaca, tanpa teks panjang. */
const now = ref(new Date())
let clockTimer = 0

const clockParts = computed(() => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now.value)
  const get = (type) => parts.find((part) => part.type === type)?.value ?? '00'
  return { hour: get('hour'), minute: get('minute') }
})

// Bagian hari di Bekasi: pagi / siang / sore / malam
const dayPart = computed(() => {
  const hour = Number(clockParts.value.hour)
  if (hour >= 4 && hour < 11) return { id: 'Pagi', en: 'Morning' }
  if (hour >= 11 && hour < 15) return { id: 'Siang', en: 'Afternoon' }
  if (hour >= 15 && hour < 18) return { id: 'Sore', en: 'Evening' }
  return { id: 'Malam', en: 'Night' }
})

const clockIso = computed(() => now.value.toISOString())

onMounted(() => {
  // Diperbarui tiap 15 detik: cukup untuk jam menit, ringan untuk baterai
  clockTimer = setInterval(() => (now.value = new Date()), 15000)
})

onBeforeUnmount(() => clearInterval(clockTimer))

// Info singkat di bawah jam
const facts = [
  { label: { id: 'Basis', en: 'Based in' }, value: { id: 'Bekasi, Jawa Barat', en: 'Bekasi, West Java' } },
  { label: { id: 'Saat ini', en: 'Currently' }, value: 'Back End Developer · SPKD' },
  { label: { id: 'Bahasa', en: 'Languages' }, value: { id: 'Indonesia · Inggris', en: 'Indonesian · English' } },
]

const mapLocations = [
  { name: 'Bandung', lat: -6.9175, lng: 107.6191 },
  { name: 'Bekasi', lat: -6.2383, lng: 106.9756 },
]

// Klik nama kota di bawah peta: peta terbang ke kota itu & buka popup-nya
const mapMarkers = []

function focusLocation(index) {
  const loc = mapLocations[index]
  if (!mapInstance || !loc) return
  mapInstance.flyTo([loc.lat, loc.lng], 11, { duration: 0.8 })
  mapMarkers[index]?.openPopup()
}

const mapContainer = ref(null)
let mapInstance = null
let mapObserver = null
let unmounted = false

/* Peta (Leaflet + gambar peta OpenStreetMap) baru dimuat saat bagian Kontak
   hampir terlihat, supaya tidak memperberat halaman di awal. */
async function initMap() {
  const [{ default: L }] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')])
  if (unmounted || !mapContainer.value) return

  // Batas wilayah Jawa Barat: peta tidak bisa digeser atau di-zoom out
  // sampai keluar provinsi (apalagi keluar Indonesia).
  const WEST_JAVA_BOUNDS = L.latLngBounds([-8.05, 105.75], [-5.6, 108.95])

  // Penanda peta: pin biru buatan sendiri (gaya di .contact__pin). Ujung
  // bawah pin tepat di lokasi, kepalanya di atas, jadi nama kota tidak tertutup.
  const pinIcon = L.divIcon({
    className: 'contact__pin',
    html: '<span class="contact__pin-head"></span>',
    iconSize: [18, 26],
    iconAnchor: [9, 26],
    popupAnchor: [0, -26],
  })

  mapInstance = L.map(mapContainer.value, {
    scrollWheelZoom: false,
    maxBounds: WEST_JAVA_BOUNDS,
    maxBoundsViscosity: 1.0,
    minZoom: 8,
    maxZoom: 15,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 15,
    minZoom: 8,
    bounds: WEST_JAVA_BOUNDS,
  }).addTo(mapInstance)

  const markers = mapLocations.map((loc) =>
    L.marker([loc.lat, loc.lng], { icon: pinIcon })
      .addTo(mapInstance)
      .bindPopup(loc.name, { closeButton: false }),
  )
  mapMarkers.push(...markers)

  const group = L.featureGroup(markers)
  mapInstance.fitBounds(group.getBounds().pad(0.5))
  mapInstance.setMaxBounds(WEST_JAVA_BOUNDS)
}

onMounted(() => {
  mapObserver = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return
      mapObserver.disconnect()
      initMap()
    },
    { rootMargin: '400px' },
  )
  mapObserver.observe(mapContainer.value)
})

onBeforeUnmount(() => {
  unmounted = true
  mapObserver?.disconnect()
  mapMarkers.length = 0
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})

</script>

<template>
  <section id="kontak" class="contact">

    <div class="container">
      <header class="section-head">
        <div class="section-head__meta">
          <span v-reveal class="section-label">
            <span class="section-label__num">05</span> {{ t({ id: 'Kontak', en: 'Contact' }) }}
          </span>
        </div>
        <div class="section-head__main">
          <h2 v-type="'kontak'" :key="lang" class="section-title contact__title">
            <template v-if="lang === 'en'">
              Have an idea or project? Let's <span class="serif-accent">talk</span>.
            </template>
            <template v-else>
              Punya ide atau proyek? Yuk, <span class="serif-accent">ngobrol</span>.
            </template>
          </h2>
        </div>
      </header>

      <div class="contact__grid">
        <!-- Kiri: ajakan chat (tautan sosial sudah ada di footer) -->
        <div ref="formWrap" class="contact__col" :class="{ 'is-in': formIn }">
          <div class="contact__cta">
            <span class="contact__status mono-meta">
              {{ t({ id: 'Terbuka untuk kerja & kolaborasi', en: 'Open to work & collaboration' }) }}
            </span>

            <!-- Jam lokal Bekasi -->
            <div class="contact__clock">
              <p class="contact__clock-label mono-meta">
                {{ t({ id: 'Waktu lokal', en: 'Local time' }) }} · Bekasi
              </p>
              <p class="contact__clock-row">
                <time class="contact__clock-time" :datetime="clockIso">
                  {{ clockParts.hour }}<span class="contact__clock-colon" aria-hidden="true">:</span>{{ clockParts.minute }}
                </time>
                <span class="contact__clock-zone serif-accent">WIB</span>
                <span class="contact__clock-part mono-meta">{{ t(dayPart) }}</span>
              </p>
            </div>

            <dl class="contact__facts">
              <div v-for="fact in facts" :key="t(fact.label)" class="contact__fact">
                <dt class="mono-meta">{{ t(fact.label) }}</dt>
                <dd>{{ t(fact.value) }}</dd>
              </div>
            </dl>

            <div class="contact__cta-actions">
              <button type="button" class="btn btn--primary contact__chat-btn" @click="openChat">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
                  />
                </svg>
                {{ t({ id: 'Mulai Chat', en: 'Start Chat' }) }}
              </button>
            </div>

          </div>
        </div>

        <!-- Kanan: peta lokasi -->
        <div ref="infoWrap" class="contact__col" :class="{ 'is-in': infoIn }">
          <figure class="contact__map-card">
            <figcaption class="contact__map-head mono-meta">
              <span class="contact__map-label">{{ t({ id: 'Lokasi', en: 'Location' }) }}</span>
              <span>Bandung · Bekasi</span>
            </figcaption>

            <div
              ref="mapContainer"
              class="contact__map"
              @contextmenu.prevent="preventImageAction"
            ></div>

            <div class="contact__places" v-reveal.stagger.scale="{ delay: 500, step: 70 }">
              <button
                v-for="(loc, index) in mapLocations"
                :key="loc.name"
                type="button"
                class="btn btn--ghost contact__place"
                @click="focusLocation(index)"
              >
                <span class="contact__place-num">0{{ index + 1 }}</span>
                {{ loc.name }}
              </button>
            </div>
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  position: relative;
  isolation: isolate;
  padding: var(--section-y) 0;
  background: var(--color-bg);
  /* Kolom masuk dari samping: potong overflow di batas section */
  overflow-x: hidden;
  overflow-x: clip;
}

.contact__title {
  max-width: 16ch;
}

.contact__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: stretch;
}

.contact__col {
  display: flex;
  min-width: 0;
}

.contact__col > * {
  flex: 1;
}

/* ---- Kolom ajakan chat ---- */
.contact__cta {
  display: flex;
  flex-direction: column;
}

/* Label status: lencana solid, senada dengan "Terbuka untuk kerja" di beranda */
.contact__status {
  align-self: flex-start;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  background: var(--color-text);
  color: var(--color-bg);
  font-weight: 600;
  box-shadow: 0 2px 0 color-mix(in srgb, var(--color-text) 45%, var(--color-bg));
}

/* ---- Jam lokal ---- */
.contact__clock {
  margin-top: 2rem;
}

.contact__clock-label {
  margin: 0;
}

.contact__clock-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.2rem 0.8rem;
  margin: 0.5rem 0 0;
}

.contact__clock-time {
  font-family: var(--font-heading);
  font-size: clamp(3.4rem, 7vw, 5rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
}

/* Titik dua berkedip pelan, seperti jam digital */
.contact__clock-colon {
  display: inline-block;
  margin: 0 0.02em;
  animation: contact-colon 2s steps(1, end) infinite;
}

@keyframes contact-colon {
  50% {
    opacity: 0.25;
  }
}

.contact__clock-zone {
  font-size: clamp(1.6rem, 3vw, 2.1rem);
  color: var(--color-primary);
}

.contact__clock-part {
  padding: 0.15rem 0.5rem;
  border: 1px solid var(--color-rule);
  border-radius: 999px;
  color: var(--color-text);
}

/* ---- Info singkat: baris bergaris seperti buku catatan ---- */
.contact__facts {
  margin: 1.8rem 0 0;
  border-top: 1px solid var(--color-rule);
}

.contact__fact {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  gap: 1rem;
  align-items: baseline;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-rule);
}

.contact__fact dt {
  margin: 0;
}

.contact__fact dd {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 500;
  color: var(--color-text);
}

/* Tombol chat di dasar kolom: sejajar dengan bawah kartu peta */
.contact__cta-actions {
  margin-top: auto;
  padding-top: 1.8rem;
}

/* ---- Peta ---- */
.contact__map-card {
  display: flex;
  flex-direction: column;
  margin: 0;
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  overflow: hidden;
}

.contact__map-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.3rem 1rem;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid var(--color-rule);
}

.contact__map-label {
  color: var(--color-text);
}

.contact__map {
  flex: 1;
  width: 100%;
  min-height: 260px;
  z-index: 0;
  /* Tema gelap: peta dibalik jadi gelap. Tema terang: hitam-putih biasa. */
  --map-tiles: grayscale(1) invert(1) brightness(0.82) contrast(0.92);
  background: var(--color-surface);
}

:root[data-theme='light'] .contact__map {
  --map-tiles: grayscale(1) contrast(0.95);
}

.contact__map :deep(.leaflet-tile-pane) {
  filter: var(--map-tiles);
}

/* Kontrol, popup, & atribusi Leaflet mengikuti palet situs */
.contact__map :deep(.leaflet-bar) {
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-sm);
  box-shadow: none;
  overflow: hidden;
}

.contact__map :deep(.leaflet-bar a) {
  border-bottom-color: var(--color-rule);
  background: var(--color-surface);
  color: var(--color-text);
}

.contact__map :deep(.leaflet-bar a:hover) {
  background: var(--color-surface-soft);
}

.contact__map :deep(.leaflet-bar a.leaflet-disabled) {
  background: var(--color-surface);
  color: var(--color-rule);
}

.contact__map :deep(.leaflet-popup-content-wrapper),
.contact__map :deep(.leaflet-popup-tip) {
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: 0 8px 20px -10px rgba(0, 0, 0, 0.6);
}

.contact__map :deep(.leaflet-popup-content-wrapper) {
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-sm);
}

.contact__map :deep(.leaflet-popup-content) {
  margin: 0.45rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.contact__map :deep(.leaflet-control-attribution) {
  background: color-mix(in srgb, var(--color-surface) 82%, transparent);
  color: var(--color-text-soft);
}

.contact__map :deep(.leaflet-control-attribution a) {
  color: var(--color-text);
}

/* Pin: kepala bulat biru + tangkai tipis; ujung tangkai = lokasi */
.contact__map :deep(.contact__pin) {
  background: none;
  border: 0;
}

.contact__map :deep(.contact__pin-head) {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  border: 3px solid var(--color-surface);
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow:
    0 0 0 1.5px var(--color-primary),
    0 4px 8px -2px rgba(0, 0, 0, 0.45);
}

.contact__map :deep(.contact__pin)::after {
  content: '';
  position: absolute;
  left: 8px;
  top: 17px;
  width: 2px;
  height: 9px;
  border-radius: 1px;
  background: var(--color-primary);
}

.contact__map :deep(img) {
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

.contact__places {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  border-top: 1px solid var(--color-rule);
}

.contact__place {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 34px;
  padding: 0 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.contact__place-num {
  color: var(--color-text-soft);
}

/* ---------------------------------------------------------
   Animasi masuk kolom Kontak: kiri dari kiri, peta dari kanan.
   Jarak geser pendek supaya tenang. Pakai `translate` (bukan
   transform) supaya tidak bentrok dengan efek hover.
--------------------------------------------------------- */
.contact__col:not(.is-in) > * {
  opacity: 0;
}

.contact__col.is-in .contact__cta {
  animation: contact-in-left 0.9s var(--ease-out) backwards;
}

.contact__col.is-in .contact__map-card {
  animation: contact-in-right 0.9s var(--ease-out) 0.1s backwards;
}

@keyframes contact-in-left {
  from {
    opacity: 0;
    translate: -48px 0;
  }
}

@keyframes contact-in-right {
  from {
    opacity: 0;
    translate: 48px 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact__clock-colon {
    animation: none;
  }
}

/* ---- Tablet & HP ---- */
@media (max-width: 900px) {
  .contact__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 480px) {
  .contact__chat-btn {
    width: 100%;
  }

  .contact__fact {
    grid-template-columns: 6rem minmax(0, 1fr);
  }

  .contact__map {
    min-height: 220px;
  }
}
</style>
