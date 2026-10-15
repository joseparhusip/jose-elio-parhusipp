<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import gmailIcon from './icons/icons-about/gmail.svg'
import { useChatWidgetStore } from '../stores/chatWidget'
import { vReveal } from '@/directives/reveal'

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
  slideObserver.observe(infoWrap.value)
  slideObserver.observe(formWrap.value)
})

onBeforeUnmount(() => {
  slideObserver?.disconnect()
})

const contactInfo = [
  {
    label: 'Email',
    value: 'joseparhusip7@gmail.com',
    icon: gmailIcon,
    iconAlt: 'Gmail',
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
      <header class="contact__header">
        <span v-reveal class="section-label">
          <span class="section-label__num">04</span> Kontak
        </span>
        <h2 v-reveal="80" class="section-title contact__title">
          Punya ide atau proyek? Yuk, <span class="serif-accent">ngobrol</span>.
        </h2>
      </header>

      <div class="contact__grid">
        <!-- Kiri: ajakan chat + email -->
        <div ref="formWrap" class="contact__col" :class="{ 'is-in': formIn }">
          <div class="contact__cta">
            <span class="contact__cta-glow" aria-hidden="true"></span>

            <span class="contact__status">
              <span class="contact__status-dot" aria-hidden="true"></span>
              Terbuka untuk kerja & kolaborasi
            </span>

            <h3 class="contact__cta-title">Ngobrol langsung, tanpa isi form panjang.</h3>
            <p class="contact__cta-desc">
              Klik tombol di bawah, nanti muncul chat kecil di pojok kanan bawah layar.
              Jawab beberapa pertanyaan singkat dan pesan kamu langsung terkirim ke email saya.
            </p>

            <div class="contact__cta-actions">
              <button type="button" class="contact__chat-btn" @click="openChat">
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

            <ul class="contact__list">
              <li v-for="item in contactInfo" :key="item.label" class="contact__item">
                <span
                  class="contact__item-icon"
                  aria-hidden="true"
                  oncontextmenu="return false"
                  @contextmenu.prevent="preventImageAction"
                >
                  <img
                    :src="item.icon"
                    :alt="item.iconAlt"
                    class="contact__item-icon-img"
                    draggable="false"
                    oncontextmenu="return false"
                    @contextmenu.prevent="preventImageAction"
                    @dragstart.prevent="preventImageAction"
                  />
                </span>
                <span class="contact__item-text">
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
                </span>
                <svg class="contact__item-arrow" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
                </svg>
              </li>
            </ul>
          </div>
        </div>

        <!-- Kanan: peta lokasi -->
        <div ref="infoWrap" class="contact__col" :class="{ 'is-in': infoIn }">
          <div class="contact__map-card">
            <div class="contact__map-head">
              <span class="contact__map-label">Lokasi</span>
              <span class="contact__map-zone">Jawa Barat, Indonesia · WIB</span>
            </div>

            <div
              ref="mapContainer"
              class="contact__map"
              oncontextmenu="return false"
              @contextmenu.prevent="preventImageAction"
            ></div>

            <div class="contact__places">
              <button
                v-for="(loc, index) in mapLocations"
                :key="loc.name"
                type="button"
                class="contact__place"
                @click="focusLocation(index)"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                  <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"
                    d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
                  <circle cx="12" cy="9.5" r="2.4" fill="none" stroke="currentColor" stroke-width="1.8" />
                </svg>
                {{ loc.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding: var(--section-y) 0;
  background: var(--color-bg);
  /* Kartu masuk dari luar layar: potong overflow di batas section */
  overflow-x: hidden;
  overflow-x: clip;
}

.contact__header {
  max-width: 46rem;
  margin-bottom: clamp(2.2rem, 5vw, 3.5rem);
}

.contact__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: stretch;
}

.contact__col {
  display: flex;
  min-width: 0;
}

.contact__col > * {
  flex: 1;
}

/* ---- Panel ajakan chat ---- */
.contact__cta {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: clamp(1.6rem, 4vw, 2.75rem);
  border-radius: var(--radius-lg);
  border: 1px solid color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
  background:
    radial-gradient(90% 70% at 100% 0%, var(--color-primary-soft), transparent 70%),
    radial-gradient(70% 60% at 0% 100%, var(--color-accent-soft), transparent 70%),
    var(--color-surface);
  overflow: hidden;
  isolation: isolate;
}

.contact__cta-glow {
  position: absolute;
  z-index: -1;
  right: -80px;
  top: -80px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  border: 1px dashed color-mix(in srgb, var(--color-primary) 45%, transparent);
  opacity: 0.6;
}

.contact__status {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: fit-content;
  padding: 0.4rem 0.85rem 0.4rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: var(--color-text-soft);
}

.contact__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 0 var(--color-accent);
  animation: contact-pulse 2.2s ease-out infinite;
}

@keyframes contact-pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-accent) 60%, transparent);
  }
  100% {
    box-shadow: 0 0 0 9px transparent;
  }
}

.contact__cta-title {
  font-family: var(--font-heading);
  font-size: clamp(1.45rem, 2.6vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.15;
  color: var(--color-text);
  margin: 1.4rem 0 0.8rem;
  max-width: 22ch;
  text-wrap: balance;
}

.contact__cta-desc {
  margin: 0;
  max-width: 34rem;
  font-size: 0.98rem;
  line-height: 1.75;
  color: var(--color-text-soft);
  text-wrap: pretty;
}

.contact__cta-actions {
  margin-top: 1.7rem;
}

.contact__chat-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.95rem 1.7rem;
  border: 0;
  border-radius: 999px;
  background: var(--color-primary);
  font-family: var(--font-body);
  font-size: 0.98rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 16px 32px -16px var(--color-primary);
  transition: background 0.25s ease, transform 0.3s var(--ease-out);
}

.contact__chat-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.contact__list {
  list-style: none;
  margin: auto 0 0;
  padding: 2rem 0 0;
}

.contact__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.85rem 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  transition: border-color 0.25s ease;
}

.contact__item:hover {
  border-color: var(--color-primary);
}

.contact__item-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #fff;
}

.contact__item-icon-img {
  display: block;
  width: 22px;
  height: 22px;
  object-fit: contain;
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none;
}

.contact__item-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.contact__item-label {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.contact__item-value {
  font-family: var(--font-body);
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--color-text);
  overflow-wrap: break-word;
}

.contact__item-value--btn {
  padding: 0;
  margin: 0;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
}

/* Seluruh baris email bisa diklik (area sentuh lebih besar di HP) */
.contact__item-value--btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

.contact__item-arrow {
  flex-shrink: 0;
  color: var(--color-text-soft);
  transition: color 0.25s ease, transform 0.3s var(--ease-out);
}

.contact__item:hover .contact__item-arrow {
  color: var(--color-primary);
  transform: translate(2px, -2px);
}

/* ---- Kartu peta ---- */
.contact__map-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 0.9rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}

.contact__map-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.3rem 1rem;
  padding: 0.4rem 0.5rem 0;
}

.contact__map-label {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.contact__map-zone {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  color: var(--color-text-soft);
}

.contact__map {
  flex: 1;
  width: 100%;
  min-height: 300px;
  border-radius: calc(var(--radius-lg) - 0.6rem);
  border: 1px solid var(--color-border);
  overflow: hidden;
  z-index: 0;
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
}

.contact__place {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.25s ease, color 0.25s ease;
}

.contact__place svg {
  color: var(--color-accent);
}

.contact__place:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* ---------------------------------------------------------
   Animasi geser kartu Kontak: panel chat masuk dari KIRI,
   peta dari KANAN. Pakai `translate` (bukan transform) supaya
   tidak bentrok dengan efek hover di dalam kartu.
--------------------------------------------------------- */
.contact__col:not(.is-in) > * {
  opacity: 0;
}

.contact__col:not(.is-in) .contact__cta {
  translate: -100vw 0;
}

.contact__col:not(.is-in) .contact__map-card {
  translate: 100vw 0;
}

.contact__col.is-in .contact__cta {
  animation: contact-slide-in-left 1.2s var(--ease-out) backwards;
}

.contact__col.is-in .contact__map-card {
  animation: contact-slide-in-right 1.2s var(--ease-out) 0.1s backwards;
}

@keyframes contact-slide-in-left {
  from {
    opacity: 0;
    translate: -100vw 0;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

@keyframes contact-slide-in-right {
  from {
    opacity: 0;
    translate: 100vw 0;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact__status-dot {
    animation: none;
  }
}

/* ---- Tablet & HP ---- */
@media (max-width: 360px) {
  .contact__item-value {
    overflow-wrap: anywhere;
  }
}

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
    justify-content: center;
  }

  .contact__item-value {
    font-size: 0.86rem;
  }

  .contact__item {
    padding: 0.75rem 0.8rem;
    gap: 0.7rem;
  }

  .contact__item-icon {
    width: 38px;
    height: 38px;
  }

  .contact__map {
    min-height: 220px;
  }
}
</style>
