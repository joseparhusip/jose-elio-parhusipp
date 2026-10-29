<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useChatWidgetStore } from '../stores/chatWidget'
import { vReveal } from '@/directives/reveal'
import { loaderDone } from '@/composables/useLoaderState'

const chatStore = useChatWidgetStore()

// Klik "Email" ATAU kartu ajakan chat sama-sama membuka widget chat
// mengambang di pojok kanan bawah, alih-alih membuka aplikasi email.
function openChat() {
  chatStore.open()
}

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

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

const contactInfo = [
  {
    label: 'Email',
    value: 'joseparhusip7@gmail.com',
    // Klik item ini membuka widget chat (lihat openChat), bukan mailto.
    action: openChat,
  },
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

// Batas wilayah Jawa Barat: peta tidak bisa digeser atau di-zoom out
// sampai keluar provinsi (apalagi keluar Indonesia).
const WEST_JAVA_BOUNDS = L.latLngBounds([-8.05, 105.75], [-5.6, 108.95])

const mapContainer = ref(null)
let mapInstance = null

onMounted(() => {
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
    L.marker([loc.lat, loc.lng]).addTo(mapInstance).bindPopup(loc.name),
  )
  mapMarkers.push(...markers)

  const group = L.featureGroup(markers)
  mapInstance.fitBounds(group.getBounds().pad(0.5))
  mapInstance.setMaxBounds(WEST_JAVA_BOUNDS)
})

onBeforeUnmount(() => {
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
            <span class="section-label__num">04</span> Kontak
          </span>
        </div>
        <div class="section-head__main">
          <h2 v-reveal.clip="80" class="section-title contact__title">
            Punya ide atau proyek? Yuk, <span class="serif-accent">ngobrol</span>.
          </h2>
        </div>
      </header>

      <div class="contact__grid">
        <!-- Kiri: ajakan chat + daftar kontak -->
        <div ref="formWrap" class="contact__col" :class="{ 'is-in': formIn }">
          <div class="contact__cta">
            <span class="contact__status mono-meta">
              <span class="contact__status-dot" aria-hidden="true"></span>
              Terbuka untuk kerja &amp; kolaborasi
            </span>

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
                Mulai Chat
              </button>
            </div>

            <ul class="contact__list" v-reveal.stagger="{ delay: 450, step: 90 }">
              <li
                v-for="item in contactInfo"
                :key="item.label"
                class="contact__item"
                :class="{ 'contact__item--action': item.action }"
              >
                <span class="contact__item-label">{{ item.label }}</span>
                <button
                  v-if="item.action"
                  type="button"
                  class="contact__item-value contact__item-value--btn"
                  @click="item.action"
                >
                  {{ item.value }}
                </button>
                <span v-else class="contact__item-value">{{ item.value }}</span>
                <svg
                  v-if="item.action"
                  class="contact__item-arrow"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
                </svg>
              </li>
            </ul>
          </div>
        </div>

        <!-- Kanan: peta lokasi -->
        <div ref="infoWrap" class="contact__col" :class="{ 'is-in': infoIn }">
          <figure class="contact__map-card">
            <figcaption class="contact__map-head mono-meta">
              <span class="contact__map-label">Lokasi</span>
              <span>Bandung · Bekasi</span>
            </figcaption>

            <div
              ref="mapContainer"
              class="contact__map"
              oncontextmenu="return false"
              @contextmenu.prevent="preventImageAction"
            ></div>

            <div class="contact__places" v-reveal.stagger.scale="{ delay: 500, step: 70 }">
              <button
                v-for="(loc, index) in mapLocations"
                :key="loc.name"
                type="button"
                class="contact__place"
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

.contact__status {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--color-text);
}

.contact__status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: contact-blink 2.4s ease-in-out infinite;
}

@keyframes contact-blink {
  50% {
    opacity: 0.35;
  }
}

.contact__cta-actions {
  margin-top: 1.8rem;
}

.contact__chat-btn:hover {
  transform: translateY(-1px);
}

/* Daftar kontak: baris bergaris, label mono | nilai | panah */
.contact__list {
  list-style: none;
  margin: auto 0 0;
  padding: 2.5rem 0 0;
}

.contact__item {
  position: relative;
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid var(--color-rule);
}

.contact__item:last-child {
  border-bottom: 1px solid var(--color-rule);
}

.contact__item-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.contact__item-value {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
  overflow-wrap: break-word;
}

.contact__item-value--btn {
  padding: 0;
  margin: 0;
  border: 0;
  background: none;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

/* Seluruh baris email bisa diklik (area sentuh lebih besar di HP) */
.contact__item-value--btn::after {
  content: '';
  position: absolute;
  inset: 0;
}

.contact__item--action:hover .contact__item-value--btn {
  color: var(--color-primary);
}

.contact__item-arrow {
  align-self: center;
  color: var(--color-text-soft);
  transition: color 0.2s ease, transform 0.3s var(--ease-out);
}

.contact__item--action:hover .contact__item-arrow {
  color: var(--color-primary);
  transform: translate(2px, -2px);
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
  min-height: 320px;
  z-index: 0;
}

/* Peta dibuat hitam-putih supaya menyatu dengan palet; penanda bawaan Leaflet sudah biru */
.contact__map :deep(.leaflet-tile-pane) {
  filter: grayscale(1) contrast(0.95);
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
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-rule);
  background: transparent;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.contact__place-num {
  color: var(--color-text-soft);
}

.contact__place:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
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
  .contact__status-dot {
    animation: none;
  }
}

/* ---- Tablet & HP ---- */
@media (max-width: 900px) {
  .contact__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .contact__map {
    min-height: 260px;
  }
}

@media (max-width: 480px) {
  .contact__chat-btn {
    width: 100%;
  }

  .contact__item {
    grid-template-columns: 5rem minmax(0, 1fr) auto;
    gap: 0.75rem;
  }

  .contact__item-value {
    font-size: 0.9rem;
    overflow-wrap: anywhere;
  }

  .contact__map {
    min-height: 220px;
  }
}
</style>
