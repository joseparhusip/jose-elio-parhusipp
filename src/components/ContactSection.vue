<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import gmailIcon from './icons/icons-about/gmail.svg'

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

const form = ref({
  name: '',
  email: '',
  message: '',
})

const submitState = ref('idle') // idle | loading | success | error
const submitMessage = ref('')

const contactInfo = [
  {
    label: 'Email',
    value: 'joseparhusip7@gmail.com',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=joseparhusip7@gmail.com',
    icon: gmailIcon,
    iconAlt: 'Gmail',
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

// Kosong ('') artinya panggil /api/contact di domain yang sama (production di Vercel).
// Kalau butuh nunjuk ke backend lain saat development, set VITE_API_URL di .env.
const API_URL = import.meta.env.VITE_API_URL || ''

async function handleSubmit() {
  submitState.value = 'loading'
  submitMessage.value = ''

  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok || !data.ok) {
      throw new Error(data.error || 'Gagal mengirim pesan, coba lagi ya.')
    }

    submitState.value = 'success'
    form.value = { name: '', email: '', message: '' }

    // balik ke idle otomatis setelah beberapa detik biar form bisa dipakai lagi
    setTimeout(() => {
      if (submitState.value === 'success') submitState.value = 'idle'
    }, 5000)
  } catch (err) {
    submitState.value = 'error'
    submitMessage.value = err.message || 'Ada masalah pas ngirim pesan, coba lagi ya.'
  }
}
</script>

<template>
  <section id="kontak" class="contact">
    <div class="contact__inner">
      <div class="contact__info" v-reveal.left>
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
              <a
                v-if="item.href"
                :href="item.href"
                class="contact__item-value"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ item.value }}
              </a>
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

      <form class="contact__form" v-reveal.right="120" @submit.prevent="handleSubmit">
        <div class="contact__field">
          <label for="name" class="contact__label">Nama</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="contact__input"
            placeholder="Nama kamu"
            required
            :disabled="submitState === 'loading'"
          />
        </div>

        <div class="contact__field">
          <label for="email" class="contact__label">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="contact__input"
            placeholder="email@kamu.com"
            required
            :disabled="submitState === 'loading'"
          />
        </div>

        <div class="contact__field">
          <label for="message" class="contact__label">Pesan</label>
          <textarea
            id="message"
            v-model="form.message"
            class="contact__input contact__textarea"
            rows="4"
            placeholder="Ceritakan proyek atau ide kamu..."
            required
            :disabled="submitState === 'loading'"
          ></textarea>
        </div>

        <button
          type="submit"
          class="contact__submit"
          :disabled="submitState === 'loading'"
        >
          {{ submitState === 'loading' ? 'Mengirim...' : 'Kirim Pesan' }}
          <svg
            v-if="submitState !== 'loading'"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="contact__submit-icon"
          >
            <path
              d="M4.5 12H19.5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <path
              d="M13.5 6L19.5 12L13.5 18"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <!-- Animasi checklist ketika berhasil -->
        <Transition name="contact-fade">
          <div v-if="submitState === 'success'" class="contact__success" role="status">
            <svg class="contact__success-icon" viewBox="0 0 52 52" aria-hidden="true">
              <circle class="contact__success-icon-circle" cx="26" cy="26" r="24" fill="none" />
              <path class="contact__success-icon-check" fill="none" d="M14 27l7 7 16-16" />
            </svg>
            <span class="contact__success-text">
              Pesan terkirim! Cek email kamu, sudah aku kirim konfirmasi ke sana ✨
            </span>
          </div>
        </Transition>

        <Transition name="contact-fade">
          <p
            v-if="submitState === 'error'"
            class="contact__submit-status contact__submit-status--error"
          >
            {{ submitMessage }}
          </p>
        </Transition>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding: 5rem 1.5rem;
  background: var(--color-bg, #f1f4f1);
  /* FIX area kosong di kanan (mobile): form kontak sebelum muncul digeser
     28px ke kanan (v-reveal.right), dan itu ikut melebarkan halaman.
     Overflow horizontal dipotong di batas section. */
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
  border: 1px solid rgba(107, 144, 128, 0.2);
  z-index: 0;
}

/* Proteksi gambar tile & marker peta: cegah save/drag, peta tetap bisa digeser & zoom */
.contact__map :deep(img) {
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

.contact__form {
  background: var(--color-surface, #fff);
  border-radius: 24px;
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 24px 50px -30px rgba(37, 54, 50, 0.35);
}

.contact__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact__label {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text, #253632);
}

.contact__input {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-text, #253632);
  background: var(--color-bg, #f1f4f1);
  border: 1.5px solid rgba(107, 144, 128, 0.25);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.contact__input:focus {
  border-color: var(--color-primary, #6b9080);
}

.contact__textarea {
  resize: vertical;
  min-height: 100px;
  font-family: var(--font-body);
}

.contact__submit {
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
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.contact__submit-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
}

.contact__submit:hover .contact__submit-icon {
  transform: translateX(3px);
}

.contact__submit:hover {
  background: var(--color-primary-dark, #4f7566);
  transform: translateY(-2px);
}

.contact__submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

/* --- Animasi checklist sukses --- */
.contact__success {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin: -0.5rem 0 0;
  padding: 0.6rem 0.9rem;
  background: rgba(107, 144, 128, 0.1);
  border-radius: 12px;
}

.contact__success-icon {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

.contact__success-icon-circle {
  stroke: var(--color-primary, #6b9080);
  stroke-width: 3;
  stroke-miterlimit: 10;
  stroke-dasharray: 151;
  stroke-dashoffset: 151;
  animation: contact-draw-circle 0.5s ease-in-out forwards;
}

.contact__success-icon-check {
  stroke: var(--color-primary, #6b9080);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 36;
  stroke-dashoffset: 36;
  animation: contact-draw-check 0.35s 0.45s ease-in-out forwards;
}

@keyframes contact-draw-circle {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes contact-draw-check {
  to {
    stroke-dashoffset: 0;
  }
}

.contact__success-text {
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-primary-dark, #4f7566);
  line-height: 1.4;
}

.contact-fade-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.contact-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.contact-fade-leave-active {
  transition: opacity 0.25s ease;
}

.contact-fade-leave-to {
  opacity: 0;
}

.contact__submit-status {
  font-family: var(--font-body);
  font-size: 0.9rem;
  margin: -0.5rem 0 0;
}

.contact__submit-status--error {
  color: #c0524a;
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

  .contact__form {
    padding: 1.5rem;
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
