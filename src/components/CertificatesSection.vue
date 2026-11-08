<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { vReveal } from '@/directives/reveal'
import { vType } from '@/directives/type'
import { lang, t } from '@/composables/useLang'
import sapImg from './img-sertifikat/sap01-edugate-2025.jpg'
import smartpathImg from './img-sertifikat/smartpath-bootcamp-2024.webp'
import p2mwImg from './img-sertifikat/p2mw-2023.jpg'
import udemyImg from './img-sertifikat/udemy-codeigniter-2023.jpg'

/* ---------------------------------------------------------
   Sertifikat: daftar bergaris seperti arsip dokumen (bukan grid kartu).
   - Desktop: baris di kiri, satu bingkai pratinjau di kanan yang ikut
     berganti saat baris disorot/difokus. Klik gambar di bingkai untuk
     melihat dokumen penuh (lightbox).
   - HP: bingkai pratinjau disembunyikan; baris yang dipilih membuka
     gambarnya langsung di bawah baris itu (akordeon). Klik gambarnya
     untuk melihat dokumen penuh.
   Klik baris hanya memilih sertifikat, tidak membuka lightbox.
   Urutan: terbaru di atas.
--------------------------------------------------------- */
const certificates = [
  {
    title: 'SAP01 — SAP Overview',
    issuer: 'SAP University Partnership · EDUGATE',
    kind: { id: 'Kursus profesional', en: 'Professional course' },
    date: 'Jul 2025',
    detail: {
      id: 'Pengenalan sistem ERP SAP dan modul-modul bisnisnya.',
      en: 'An introduction to the SAP ERP system and its business modules.',
    },
    ref: 'ID 550181560',
    image: sapImg,
    size: [528, 800],
  },
  {
    title: 'Career Planning for IT/Computer',
    issuer: 'SmartPath · International Bootcamp',
    kind: 'Bootcamp',
    date: 'Jan 2024',
    detail: {
      id: 'Peserta sesi "Introduction to Successful Career Planning for IT/Computer".',
      en: 'Participated in the session "Introduction to Successful Career Planning for IT/Computer".',
    },
    ref: '170/SP/I/2024',
    image: smartpathImg,
    size: [2000, 1414],
  },
  {
    title: { id: 'Peserta P2MW 2023', en: 'P2MW 2023 Participant' },
    issuer: 'Ditjen Diktiristek · Kemendikbudristek',
    kind: { id: 'Program nasional', en: 'National program' },
    date: { id: 'Des 2023', en: 'Dec 2023' },
    detail: {
      id: 'Program Pembinaan Mahasiswa Wirausaha, kategori Bisnis Digital: aplikasi marketplace untuk UMKM di lingkungan ULBI.',
      en: 'Student Entrepreneurship Development Program, Digital Business category: a marketplace app for MSMEs in the ULBI community.',
    },
    ref: '7358/E2/DT.01.03/2023',
    image: p2mwImg,
    size: [1241, 1755],
  },
  {
    title: {
      id: 'Toko Online dengan CodeIgniter 3 & API Raja Ongkir',
      en: 'Online Store with CodeIgniter 3 & Raja Ongkir API',
    },
    issuer: 'Udemy · Padang Tekno',
    kind: { id: 'Kursus online', en: 'Online course' },
    date: { id: 'Agu 2023', en: 'Aug 2023' },
    detail: {
      id: 'Kursus 21,5 jam membangun toko online lengkap dengan cek ongkir.',
      en: 'A 21.5-hour course on building a complete online store with shipping cost calculation.',
    },
    ref: 'UC-eebd53d3-c6d2-4898-92a8-e439588435b3',
    url: 'https://ude.my/UC-eebd53d3-c6d2-4898-92a8-e439588435b3',
    image: udemyImg,
    size: [1600, 1190],
  },
]

const years = certificates.map((c) => Number(t(c.date).slice(-4)))
const yearRange = `${Math.min(...years)}–${Math.max(...years)}`

const active = ref(0)
const activeCert = computed(() => certificates[active.value])

// ---- Lightbox ----
const lightbox = ref(null)

function openLightbox(index) {
  lightbox.value = index
}

function closeLightbox() {
  lightbox.value = null
}

function stepLightbox(dir) {
  lightbox.value = (lightbox.value + dir + certificates.length) % certificates.length
}

function onKeydown(event) {
  if (lightbox.value === null) return
  if (event.key === 'Escape') closeLightbox()
  else if (event.key === 'ArrowRight') stepLightbox(1)
  else if (event.key === 'ArrowLeft') stepLightbox(-1)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// ---- Kertas miring mengikuti kursor (hanya mouse, bukan HP) ----
const tiltEl = ref(null)
const tilting = ref(false)
let canTilt = false
let tiltFrame = 0
let tiltTarget = null

onMounted(() => {
  canTilt =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

function onTiltMove(event) {
  if (!canTilt || !tiltEl.value) return
  const rect = tiltEl.value.getBoundingClientRect()
  tiltTarget = {
    x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
    y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
  }
  tilting.value = true
  if (!tiltFrame) tiltFrame = requestAnimationFrame(applyTilt)
}

function applyTilt() {
  tiltFrame = 0
  if (!tiltTarget || !tiltEl.value) return
  const { x, y } = tiltTarget
  const style = tiltEl.value.style
  style.setProperty('--rx', `${((0.5 - y) * 14).toFixed(2)}deg`)
  style.setProperty('--ry', `${((x - 0.5) * 18).toFixed(2)}deg`)
  style.setProperty('--gx', `${(x * 100).toFixed(1)}%`)
  style.setProperty('--gy', `${(y * 100).toFixed(1)}%`)
}

function onTiltLeave() {
  cancelAnimationFrame(tiltFrame)
  tiltFrame = 0
  tiltTarget = null
  tilting.value = false
  const style = tiltEl.value?.style
  if (!style) return
  ;['--rx', '--ry', '--gx', '--gy'].forEach((name) => style.removeProperty(name))
}

onUnmounted(() => cancelAnimationFrame(tiltFrame))

// Proteksi gambar: cegah klik kanan & drag, sama seperti gambar proyek
function preventImageAction(event) {
  event.preventDefault()
  return false
}
</script>

<template>
  <section id="sertifikat" class="certs">
    <div class="container">
      <header class="section-head">
        <div class="section-head__meta">
          <span v-reveal class="section-label">
            <span class="section-label__num">04</span> {{ t({ id: 'Sertifikat', en: 'Certificates' }) }}
          </span>
          <span v-reveal="80" class="section-head__note">
            {{ String(certificates.length).padStart(2, '0') }} {{ t({ id: 'dokumen', en: 'documents' }) }}<br />{{ yearRange }}
          </span>
        </div>
        <div class="section-head__main">
          <h2 :key="lang" v-type="'sertifikat'" class="section-title">
            <template v-if="lang === 'en'">
              Proof that I keep <span class="serif-accent">learning</span>
            </template>
            <template v-else>
              Bukti saya terus <span class="serif-accent">belajar</span>
            </template>
          </h2>
        </div>
      </header>

      <div class="certs__body">
        <!-- Daftar arsip -->
        <ol class="certs__list" v-reveal.stagger="{ delay: 120, step: 70 }">
          <li
            v-for="(cert, index) in certificates"
            :key="cert.ref"
            class="certs__item"
            :class="{ 'certs__item--active': active === index }"
          >
            <button
              type="button"
              class="certs__row"
              :aria-expanded="active === index"
              :aria-controls="`cert-${index}`"
              @mouseenter="active = index"
              @focus="active = index"
              @click="active = index"
            >
              <span class="certs__num">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="certs__main">
                <span class="certs__title">{{ t(cert.title) }}</span>
                <span class="certs__issuer">{{ cert.issuer }}</span>
              </span>
              <span class="certs__side">
                <span class="certs__kind">{{ t(cert.kind) }}</span>
                <span class="certs__date">{{ t(cert.date) }}</span>
              </span>
            </button>

            <!-- HP: gambar terbuka di bawah baris yang dipilih -->
            <div :id="`cert-${index}`" class="certs__inline" :inert="active !== index">
              <div class="certs__inline-inner">
                <p class="certs__detail">{{ t(cert.detail) }}</p>
                <button
                  type="button"
                  class="certs__inline-shot"
                  :aria-label="t({ id: `Perbesar sertifikat ${t(cert.title)}`, en: `Enlarge certificate: ${t(cert.title)}` })"
                  @click="openLightbox(index)"
                  @contextmenu.prevent="preventImageAction"
                >
                  <img
                    :src="cert.image"
                    :width="cert.size[0]"
                    :height="cert.size[1]"
                    :alt="t({ id: `Sertifikat ${t(cert.title)}`, en: `Certificate: ${t(cert.title)}` })"
                    loading="lazy"
                    draggable="false"
                    @dragstart.prevent="preventImageAction"
                  />
                </button>
                <a
                  v-if="cert.url"
                  :href="cert.url"
                  class="btn btn--ghost certs__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ t({ id: 'Lihat di Udemy', en: 'View on Udemy' }) }}
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                      stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              </div>
            </div>
          </li>
        </ol>

        <!-- Desktop: satu bingkai pratinjau yang ikut berganti -->
        <aside v-reveal.scale="160" class="certs__preview" aria-live="polite">
          <button
            type="button"
            class="certs__frame"
            :class="{ 'is-tilting': tilting }"
            :data-cursor="t({ id: 'Perbesar', en: 'Enlarge' })"
            :aria-label="t({ id: `Perbesar sertifikat ${t(activeCert.title)}`, en: `Enlarge certificate: ${t(activeCert.title)}` })"
            @click="openLightbox(active)"
            @contextmenu.prevent="preventImageAction"
            @pointermove="onTiltMove"
            @pointerleave="onTiltLeave"
          >
            <span ref="tiltEl" class="certs__tilt">
            <Transition name="cert-fade" mode="out-in">
              <!-- Kartu membungkus pas gambar (tegak/mendatar), garis warna di tepinya -->
              <span :key="activeCert.ref" class="certs__card">
                <!-- Dua lembar kertas di belakang: kesan tumpukan dokumen -->
                <span class="certs__sheet certs__sheet--1" aria-hidden="true"></span>
                <span class="certs__sheet certs__sheet--2" aria-hidden="true"></span>
                <img
                  :src="activeCert.image"
                  :width="activeCert.size[0]"
                  :height="activeCert.size[1]"
                  :alt="t({ id: `Sertifikat ${t(activeCert.title)}`, en: `Certificate: ${t(activeCert.title)}` })"
                  class="certs__frame-img"
                  draggable="false"
                  @dragstart.prevent="preventImageAction"
                />
                <span class="certs__glare" aria-hidden="true"></span>
              </span>
            </Transition>
            </span>
          </button>

          <div class="certs__caption">
            <p class="certs__detail">{{ t(activeCert.detail) }}</p>
            <dl class="certs__meta mono-meta">
              <div>
                <dt>No.</dt>
                <dd>{{ activeCert.ref }}</dd>
              </div>
            </dl>
            <a
              v-if="activeCert.url"
              :href="activeCert.url"
              class="btn btn--ghost certs__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t({ id: 'Lihat di Udemy', en: 'View on Udemy' }) }}
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                  stroke-linejoin="round" d="M7 17 17 7M8 7h9v9" />
              </svg>
            </a>
          </div>
        </aside>
      </div>
    </div>

    <!-- Lightbox: dokumen penuh, bisa digeser kiri/kanan -->
    <Transition name="cert-lightbox">
      <div
        v-if="lightbox !== null"
        class="cert-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="t(certificates[lightbox].title)"
        @click.self="closeLightbox"
        @contextmenu.prevent="preventImageAction"
      >
        <button type="button" class="btn-close btn-close--dark cert-lightbox__close" :aria-label="t({ id: 'Tutup', en: 'Close' })" @click="closeLightbox">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div class="cert-lightbox__stage" @click.self="closeLightbox">
          <button
            type="button"
            class="btn-close btn-close--dark cert-lightbox__nav cert-lightbox__nav--prev"
            :aria-label="t({ id: 'Sertifikat sebelumnya', en: 'Previous certificate' })"
            @click="stepLightbox(-1)"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" d="M19 12H5m6-6-6 6 6 6" />
            </svg>
          </button>
          <img
            :key="certificates[lightbox].ref"
            :src="certificates[lightbox].image"
            :width="certificates[lightbox].size[0]"
            :height="certificates[lightbox].size[1]"
            :alt="t({ id: `Sertifikat ${t(certificates[lightbox].title)}`, en: `Certificate: ${t(certificates[lightbox].title)}` })"
            class="cert-lightbox__img"
            draggable="false"
            @dragstart.prevent="preventImageAction"
          />
          <button
            type="button"
            class="btn-close btn-close--dark cert-lightbox__nav cert-lightbox__nav--next"
            :aria-label="t({ id: 'Sertifikat berikutnya', en: 'Next certificate' })"
            @click="stepLightbox(1)"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </button>
        </div>

        <p class="cert-lightbox__caption">
          <span>
            {{ t(certificates[lightbox].kind) }} · {{ t(certificates[lightbox].date) }} ·
            {{ lightbox + 1 }} / {{ certificates.length }}
          </span>
          {{ t(certificates[lightbox].title) }}
        </p>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.certs {
  /* Warna garis berputar: hanya palet website (biru azure + hijau aksen),
     tanpa merah/ungu pelangi. Ikut tema karena memakai variabel warna. */
  --rgb-1: var(--color-primary);
  --rgb-2: var(--color-accent);
  --rgb-3: color-mix(in srgb, var(--color-primary) 45%, #fff);
  --rgb-glow: 0.75;
  padding: var(--section-y) 0;
}

/* Mode terang: pendaran diredam supaya tidak norak di latar putih */
:global(:root[data-theme='light']) .certs {
  --rgb-glow: 0.4;
}

/* Sudut gradien yang bisa dianimasikan (garis berputar mulus) */
@property --cert-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

/* ---- Garis warna berputar di sekeliling kartu sertifikat ---- */
.certs__card,
.certs__inline-shot {
  position: relative;
  border-color: transparent !important;
}

/* Cincin tipis: gradien kerucut yang di-mask jadi garis tepi saja */
.certs__card::before,
.certs__inline-shot::before,
.certs__card::after,
.certs__inline-shot::after {
  content: '';
  position: absolute;
  border-radius: inherit;
  background: conic-gradient(
    from var(--cert-angle),
    var(--rgb-1),
    var(--rgb-3),
    var(--rgb-2),
    var(--rgb-1)
  );
  animation: cert-rgb 6s linear infinite;
  pointer-events: none;
}

.certs__card::before,
.certs__inline-shot::before {
  inset: -1px;
  padding: 2px;
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box exclude,
    linear-gradient(#000 0 0);
}

/* Pendaran lembut di BELAKANG kartu */
.certs__card::after,
.certs__inline-shot::after {
  inset: 2px;
  z-index: -1;
  filter: blur(20px);
  opacity: var(--rgb-glow);
}

@keyframes cert-rgb {
  to {
    --cert-angle: 360deg;
  }
}

/* ---- Isi: daftar kiri, pratinjau kanan ---- */
.certs__body {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: start;
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
}

.certs__list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-text);
}

.certs__item {
  border-bottom: 1px solid var(--color-rule);
}

.certs__row {
  position: relative;
  display: grid;
  grid-template-columns: 2.2rem minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: baseline;
  width: 100%;
  padding: 1.15rem 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

/* Garis tipis di kiri yang tumbuh pada baris aktif */
.certs__row::before {
  content: '';
  position: absolute;
  left: -1rem;
  top: 1.1rem;
  bottom: 1.1rem;
  width: 2px;
  background: var(--color-primary);
  transform: scaleY(0);
  transition: transform 0.35s var(--ease-out);
}

.certs__item--active .certs__row::before {
  transform: scaleY(1);
}

.certs__num {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-text-soft);
}

.certs__main {
  display: grid;
  gap: 0.3rem;
  min-width: 0;
}

.certs__title {
  font-family: var(--font-heading);
  font-size: clamp(1.1rem, 1.6vw, 1.3rem);
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--color-text-soft);
  transition: color 0.25s ease;
}

.certs__item--active .certs__title,
.certs__row:hover .certs__title {
  color: var(--color-text);
}

.certs__issuer {
  font-size: 0.88rem;
  color: var(--color-text-soft);
}

.certs__side {
  display: grid;
  justify-items: end;
  gap: 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.certs__kind {
  color: var(--color-text-soft);
}

.certs__date {
  color: var(--color-text);
}

/* Akordeon (khusus HP), tertutup di desktop */
.certs__inline {
  display: none;
}

/* ---- Pratinjau ---- */
.certs__preview {
  position: sticky;
  top: 6rem;
}

/* Panggung pratinjau: tinggi tetap supaya halaman tidak loncat saat
   ganti sertifikat; kartu di tengahnya membungkus pas gambar */
.certs__frame {
  display: grid;
  place-items: center;
  width: 100%;
  min-height: min(470px, 58vh);
  padding: 0;
  border: 0;
  background: none;
  cursor: zoom-in;
}

/* Kertas miring: sudut diisi JS lewat --rx/--ry, titik kilau lewat --gx/--gy */
.certs__tilt {
  display: inline-block;
  transform: perspective(1100px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform 0.7s var(--ease-out);
  will-change: transform;
}

.certs__frame.is-tilting .certs__tilt {
  transition-duration: 0.12s;
}

/* Lembar di belakang kartu, sedikit miring seperti tumpukan kertas */
.certs__sheet {
  position: absolute;
  inset: 0;
  z-index: -2;
  border-radius: inherit;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: transform 0.7s var(--ease-out);
  pointer-events: none;
}

.certs__sheet--1 {
  transform: translate(6px, 7px) rotate(1.6deg);
}

.certs__sheet--2 {
  z-index: -3;
  background: var(--color-surface-soft);
  transform: translate(-5px, 11px) rotate(-2.2deg);
}

.certs__frame.is-tilting .certs__sheet--1 {
  transform: translate(10px, 12px) rotate(2.4deg);
}

.certs__frame.is-tilting .certs__sheet--2 {
  transform: translate(-9px, 17px) rotate(-3.2deg);
}

/* Kilau cahaya di permukaan kertas */
.certs__glare {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  background: radial-gradient(
    circle at var(--gx, 50%) var(--gy, 0%),
    rgba(255, 255, 255, 0.34),
    rgba(255, 255, 255, 0.08) 32%,
    transparent 60%
  );
  mix-blend-mode: soft-light;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.certs__frame.is-tilting .certs__glare {
  opacity: 1;
}

/* Kartu terangkat: bayangan lebih panjang saat dimiringkan */
.certs__frame.is-tilting .certs__card {
  box-shadow: 0 28px 48px -26px rgba(0, 0, 0, 0.55);
}

/* Kartu: jarak tipis antara gambar dan garis warna */
.certs__card {
  display: block;
  padding: 7px;
  border-radius: var(--radius);
  background: var(--color-surface-soft);
  transition: box-shadow 0.5s var(--ease-out);
}

.certs__frame-img {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: min(440px, 54vh);
  border-radius: 3px;
  user-select: none;
  -webkit-user-drag: none;
}

.certs__caption {
  margin-top: 1.1rem;
}

.certs__detail {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--color-text-soft);
  text-wrap: pretty;
}

.certs__link {
  gap: 0.45rem;
  min-height: 40px;
  margin-top: 1rem;
  padding: 0 0.9rem;
  font-size: 0.82rem;
  text-decoration: none;
}

.certs__meta {
  display: grid;
  gap: 0.35rem;
  margin: 0.9rem 0 0;
}

.certs__meta div {
  display: flex;
  gap: 0.75rem;
}

.certs__meta dt {
  min-width: 5.5rem;
}

.certs__meta dd {
  margin: 0;
  color: var(--color-text);
  overflow-wrap: anywhere;
  text-transform: none;
  letter-spacing: 0.02em;
}

.cert-fade-enter-active,
.cert-fade-leave-active {
  transition: opacity 0.2s ease;
}

.cert-fade-enter-from,
.cert-fade-leave-to {
  opacity: 0;
}

/* ---- Lightbox ---- */
.cert-lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4.5rem 1.25rem 2rem;
  background: rgba(10, 11, 13, 0.94);
}

.cert-lightbox__stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
}

.cert-lightbox__img {
  max-width: min(90vw, 1100px);
  max-height: 74vh;
  object-fit: contain;
  border-radius: 3px;
  user-select: none;
  -webkit-user-drag: none;
}

/* Tampilan tombol dari .btn-close--dark (main.css); di sini hanya posisi */
.cert-lightbox__close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
}

.cert-lightbox__nav {
  position: absolute;
  top: 50%;
  margin-top: -22px;
}

.cert-lightbox__nav--prev {
  left: -58px;
}

.cert-lightbox__nav--next {
  right: -58px;
}

.cert-lightbox__caption {
  display: grid;
  justify-items: center;
  gap: 0.25rem;
  margin: 0;
  max-width: 40rem;
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 600;
  text-align: center;
  color: #fff;
}

.cert-lightbox__caption span {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.cert-lightbox-enter-active,
.cert-lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.cert-lightbox-enter-from,
.cert-lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 1320px) {
  .cert-lightbox__nav--prev {
    left: 8px;
  }

  .cert-lightbox__nav--next {
    right: 8px;
  }
}

/* ---- Tablet & HP: tanpa pratinjau, gambar terbuka di bawah baris ---- */
@media (max-width: 900px) {
  .certs__body {
    grid-template-columns: 1fr;
  }

  .certs__preview {
    display: none;
  }

  .certs__row::before {
    left: -0.6rem;
  }

  .certs__inline {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.4s var(--ease-out);
  }

  .certs__item--active .certs__inline {
    grid-template-rows: 1fr;
  }

  .certs__inline-inner {
    overflow: hidden;
    padding-left: 3.2rem;
  }

  .certs__item--active .certs__inline-inner {
    padding-bottom: 1.25rem;
  }

  /* Kartu membungkus pas gambar, jadi garis warna tidak jauh dari sertifikat */
  .certs__inline-shot {
    display: block;
    width: fit-content;
    max-width: 100%;
    margin-top: 0.85rem;
    padding: 6px;
    border: 1px solid var(--color-rule);
    border-radius: var(--radius);
    background: var(--color-surface-soft);
    cursor: zoom-in;
  }

  .certs__inline-shot img {
    display: block;
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 60vh;
    border-radius: 2px;
    box-shadow: 0 10px 24px -16px rgba(0, 0, 0, 0.5);
    user-select: none;
    -webkit-user-drag: none;
  }
}

@media (max-width: 640px) {
  /* Tanggal & jenis pindah ke bawah judul supaya judul tidak sesak */
  .certs__row {
    grid-template-columns: 1.8rem minmax(0, 1fr);
  }

  .certs__side {
    grid-column: 2;
    display: flex;
    gap: 0.75rem;
    justify-items: start;
  }

  .certs__inline-inner {
    padding-left: 2.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .certs__row::before,
  .certs__inline {
    transition: none;
  }
}

/* Garis berputar tetap jalan walau "kurangi animasi" aktif (pelan & halus).
   Aturan global di main.css mematikan semua animasi, jadi dikecualikan. */
@media (prefers-reduced-motion: reduce) {
  .certs__card::before,
  .certs__card::after,
  .certs__inline-shot::before,
  .certs__inline-shot::after {
    animation-duration: 6s !important;
    animation-iteration-count: infinite !important;
  }
}
</style>
