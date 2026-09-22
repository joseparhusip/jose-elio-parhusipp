<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import gmailIcon from './icons/icons-about/gmail.svg'
import { useChatWidgetStore } from '../stores/chatWidget'

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
   v-reveal: animasi "muncul" halus saat elemen masuk viewport
   saat discroll. Cuma main di opacity & transform (posisi),
   warna sama sekali tidak disentuh/diubah.
   Pakai: v-reveal (fade+naik), v-reveal.scale (fade+membesar),
   v-reveal.left / v-reveal.right (geser dari samping).
   Value opsional = delay (ms), untuk efek berurutan/staggered.
--------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
)

const vReveal = {
  mounted(el, binding) {
    let variant = 'up'
    if (binding.modifiers.scale) variant = 'scale'
    else if (binding.modifiers.left) variant = 'left'
    else if (binding.modifiers.right) variant = 'right'

    el.classList.add('reveal', `reveal--${variant}`)

    const delay = typeof binding.value === 'number' ? binding.value : 0
    el.style.transitionDelay = `${delay}ms`

    // Paksa browser "melukis" kondisi tersembunyi ini dulu (tunggu 2 frame)
    // sebelum mulai diobservasi. Tanpa ini, elemen yang sudah kelihatan
    // duluan (misalnya pas reload / buka pertama kali) suka langsung
    // "loncat" ke posisi akhir tanpa animasi sama sekali.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        revealObserver.observe(el)
      })
    })
  },
  unmounted(el) {
    revealObserver.unobserve(el)
  },
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

  const group = L.featureGroup(markers)
  mapInstance.fitBounds(group.getBounds().pad(0.5))
  mapInstance.setMaxBounds(WEST_JAVA_BOUNDS)
})

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }
})

</script>

<template>
  <section id="kontak" class="contact">
    <div class="contact__inner">
      <div ref="infoWrap" class="contact__col" :class="{ 'is-in': infoIn }">
        <div class="contact__info">
          <span class="contact__eyebrow" v-reveal>Kontak</span>
          <h2 class="contact__title" v-reveal="80">Yuk, mulai obrolan</h2>
          <p class="contact__desc" v-reveal="160">
            Ada proyek, ide kolaborasi, atau sekadar mau say hi? Kirim pesan lewat form di samping,
            atau langsung hubungi lewat kontak berikut.
          </p>

          <ul class="contact__list">
            <li
              v-for="(item, index) in contactInfo"
              :key="item.label"
              class="contact__item"
              v-reveal="260 + index * 90"
            >
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
                <span v-else class="contact__item-value contact__item-value--static">{{
                  item.value
                }}</span>
              </span>
            </li>
          </ul>

          <div class="contact__map-block" v-reveal="360">
            <span class="contact__item-label">Lokasi</span>
            <div
              ref="mapContainer"
              class="contact__map"
              oncontextmenu="return false"
              @contextmenu.prevent="preventImageAction"
            ></div>
          </div>
        </div>
      </div>

      <div ref="formWrap" class="contact__col" :class="{ 'is-in': formIn }">
        <div class="contact__chat-card">
          <span class="contact__chat-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="contact__chat-icon-svg" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
              />
            </svg>
          </span>

          <h3 class="contact__chat-title">Ngobrol langsung, yuk</h3>
          <p class="contact__chat-desc">
            Lebih cepat daripada isi form manual. Klik tombol di bawah, nanti muncul chat kecil
            di pojok kanan bawah layar — tinggal jawab beberapa pertanyaan singkat dan pesan kamu
            langsung terkirim ke email aku.
          </p>

          <button type="button" class="contact__chat-btn" @click="openChat">
            Mulai Chat
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="contact__submit-icon">
              <path d="M4.5 12H19.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path
                d="M13.5 6L19.5 12L13.5 18"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <p class="contact__chat-note">Atau klik "Email" di sebelah kiri — arahnya sama kok 😄</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding: 5rem 1.5rem;
  background: var(--color-bg, #f1f4f1);
  /* PENTING: kartu info (dari kiri) dan kartu form (dari kanan) mulai dari
     luar layar. Overflow horizontal harus dipotong di batas section, kalau
     tidak halaman melebar dan browser HP memunculkan strip kosong / scroll
     ke samping. `clip` (bukan `hidden`) supaya tidak bikin scroll container. */
  overflow-x: hidden; /* fallback browser lama */
  overflow-x: clip;
}

.contact__inner {
  max-width: 1160px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 3.5rem;
  align-items: start;
}

.contact__info {
  background: var(--color-surface, #fff);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 24px 50px -30px rgba(37, 54, 50, 0.35);
}

.contact__eyebrow {
  display: inline-flex;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary-dark, #4f7566);
  background: var(--color-mint, #cfe3dd);
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
}

.contact__title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  line-height: 1.25;
  font-weight: 600;
  color: var(--color-text, #253632);
  margin: 1.1rem 0 1rem;
}

.contact__desc {
  text-align: justify;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.75;
  color: var(--color-text-soft, #5c6f69);
  margin: 0 0 2rem;
  max-width: 440px;
}

.contact__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  background: var(--color-bg, #f1f4f1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.contact__item:hover {
  transform: translateX(3px);
  box-shadow: 0 14px 28px -20px rgba(37, 54, 50, 0.4);
}

.contact__item-icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface, #fff);
  box-shadow: 0 6px 16px -10px rgba(37, 54, 50, 0.4);
}

.contact__item-icon-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  display: block;
  /* Proteksi: cegah seleksi, drag, dan long-press save di mobile */
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none;
}

.contact__item-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.contact__item-label {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-soft, #5c6f69);
}

.contact__item-value {
  font-family: var(--font-body);
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--color-text, #253632);
  text-decoration: none;
  white-space: nowrap;
}

.contact__item-value:hover {
  color: var(--color-primary, #6b9080);
}

.contact__item-value--static {
  cursor: default;
}

.contact__item-value--btn {
  /* Reset tampilan default <button> supaya identik dengan gaya link lama */
  display: inline;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  text-align: left;
  cursor: pointer;
}

.contact__map-block {
  margin-top: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.contact__map-block .contact__item-label {
  padding-left: 0.25rem;
}

.contact__map {
  width: 100%;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px -25px rgba(37, 54, 50, 0.35);
  border: 1px solid rgba(124, 111, 240, 0.2);
  z-index: 0;
}

/* Proteksi gambar tile & marker peta: cegah save/drag, peta tetap bisa digeser & zoom */
.contact__map :deep(img) {
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

/* --- Kartu ajakan buka chat (pengganti form manual) --- */
.contact__chat-card {
  height: 100%;
  background: var(--color-surface, #fff);
  border-radius: 24px;
  padding: 2.5rem 2.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.9rem;
  box-shadow: 0 24px 50px -30px rgba(37, 54, 50, 0.35);
}

.contact__chat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary, #6b9080), var(--color-primary-dark, #4f7566));
  margin-bottom: 0.35rem;
}

.contact__chat-icon-svg {
  width: 28px;
  height: 28px;
}

.contact__chat-title {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-text, #253632);
  margin: 0;
}

.contact__chat-desc {
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--color-text-soft, #5c6f69);
  margin: 0;
}

.contact__chat-btn {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  background: var(--color-primary, #6b9080);
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1.9rem;
  cursor: pointer;
  margin-top: 0.4rem;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.contact__chat-btn:hover {
  background: var(--color-primary-dark, #4f7566);
  transform: translateY(-2px);
}

.contact__chat-btn:hover .contact__submit-icon {
  transform: translateX(3px);
}

.contact__submit-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
}

.contact__chat-note {
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: var(--color-text-soft, #5c6f69);
  margin: 0.25rem 0 0;
}

/* ---------------------------------------------------------
   Animasi geser besar kartu Kontak. Pakai properti `translate`
   (bukan `transform`) supaya tidak bentrok dengan efek hover di
   dalam kartu yang memakai `transform`. Warna tidak diubah.
--------------------------------------------------------- */

/* Sebelum masuk viewport: kartu sembunyi di luar layar. */
.contact__col:not(.is-in) .contact__info {
  opacity: 0;
  translate: -100vw 0;
}

.contact__col:not(.is-in) .contact__chat-card {
  opacity: 0;
  translate: 100vw 0;
}

/* Kartu info + peta: masuk dari KIRI layar ke posisi semula. */
.contact__col.is-in .contact__info {
  animation: contact-slide-in-left 1.3s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

/* Kartu form: masuk dari KANAN layar, menyusul sedikit (0.1 dtk). */
.contact__col.is-in .contact__chat-card {
  animation: contact-slide-in-right 1.3s cubic-bezier(0.22, 1, 0.36, 1) 0.1s backwards;
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

/* ---------------------------------------------------------
   Reveal system: dipakai lewat directive v-reveal di template.
   Hanya memainkan opacity & transform (posisi/skala), warna
   elemen sama sekali tidak diubah oleh animasi ini.
--------------------------------------------------------- */
.reveal {
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.reveal:not(.is-visible) {
  opacity: 0;
  transform: translateY(22px);
}

.reveal--scale:not(.is-visible) {
  transform: translateY(14px) scale(0.94);
}

.reveal--left:not(.is-visible) {
  transform: translateX(-28px);
}

.reveal--right:not(.is-visible) {
  transform: translateX(28px);
}

/* Reduce motion: hanya teks v-reveal yang langsung tampil. Animasi geser
   kartu kiri/kanan sengaja TIDAK dimatikan, sesuai permintaan. */
@media (prefers-reduced-motion: reduce) {
  .reveal,
  .reveal:not(.is-visible) {
    transition: none;
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 900px) {
  .contact__inner {
    /* minmax(0, 1fr): kolom tidak ikut melebar oleh teks yang tidak bisa patah */
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 480px) {
  .contact {
    padding: 3.5rem 1.25rem;
  }

  .contact__eyebrow {
    display: table;
    margin: 0 auto;
  }

  .contact__info {
    padding: 1.75rem;
  }

  .contact__chat-card {
    padding: 1.75rem 1.5rem;
  }

  .contact__map {
    height: 180px;
  }

  .contact__item {
    padding: 0.9rem 0.85rem;
    gap: 0.75rem;
  }

  .contact__item-value {
    font-size: 0.82rem;
    /* HP layar sempit (<= 360px): email/teks panjang boleh turun baris,
       tidak menembus keluar kartu */
    white-space: normal;
    overflow-wrap: anywhere;
  }
}
</style>
