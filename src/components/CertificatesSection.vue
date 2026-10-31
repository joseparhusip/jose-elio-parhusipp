<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { vReveal } from '@/directives/reveal'
import { vType } from '@/directives/type'
import toeflImg from './img-sertifikat/toefl-ulbi-2026.jpg'
import sapImg from './img-sertifikat/sap01-edugate-2025.jpg'
import smartpathImg from './img-sertifikat/smartpath-bootcamp-2024.png'
import p2mwImg from './img-sertifikat/p2mw-2023.jpg'
import udemyImg from './img-sertifikat/udemy-codeigniter-2023.jpg'

/* ---------------------------------------------------------
   Sertifikat: daftar bergaris seperti arsip dokumen (bukan grid kartu).
   - Desktop: baris di kiri, satu bingkai pratinjau di kanan yang ikut
     berganti saat baris disorot/difokus. Klik baris atau bingkai untuk
     melihat dokumen penuh (lightbox).
   - HP: bingkai pratinjau disembunyikan; baris yang dipilih membuka
     gambarnya langsung di bawah baris itu (akordeon).
   Urutan: terbaru di atas.
--------------------------------------------------------- */
const certificates = [
  {
    title: 'TOEFL Prediction Test',
    issuer: 'Pusat Bahasa ULBI',
    kind: 'Bahasa',
    date: 'Jan 2026',
    detail: 'Skor keseluruhan 450 (Listening 44 · Structure 46 · Reading 45).',
    ref: '0013/MANPBIO-ULBI/SRT/I/2026',
    image: toeflImg,
  },
  {
    title: 'SAP01 — SAP Overview',
    issuer: 'SAP University Partnership · EDUGATE',
    kind: 'Kursus profesional',
    date: 'Jul 2025',
    detail: 'Pengenalan sistem ERP SAP dan modul-modul bisnisnya.',
    ref: 'ID 550181560',
    image: sapImg,
  },
  {
    title: 'Career Planning for IT/Computer',
    issuer: 'SmartPath · International Bootcamp',
    kind: 'Bootcamp',
    date: 'Jan 2024',
    detail: 'Peserta sesi "Introduction to Successful Career Planning for IT/Computer".',
    ref: '170/SP/I/2024',
    image: smartpathImg,
  },
  {
    title: 'Peserta P2MW 2023',
    issuer: 'Ditjen Diktiristek · Kemendikbudristek',
    kind: 'Program nasional',
    date: 'Des 2023',
    detail:
      'Program Pembinaan Mahasiswa Wirausaha, kategori Bisnis Digital: aplikasi marketplace untuk UMKM di lingkungan ULBI.',
    ref: '7358/E2/DT.01.03/2023',
    image: p2mwImg,
  },
  {
    title: 'Toko Online dengan CodeIgniter 3 & API Raja Ongkir',
    issuer: 'Udemy · Padang Tekno',
    kind: 'Kursus online',
    date: 'Agu 2023',
    detail: 'Kursus 21,5 jam membangun toko online lengkap dengan cek ongkir.',
    ref: 'UC-eebd53d3-c6d2-4898-92a8-e439588435b3',
    image: udemyImg,
  },
]

const years = certificates.map((c) => Number(c.date.slice(-4)))
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
            <span class="section-label__num">04</span> Sertifikat
          </span>
          <span v-reveal="80" class="section-head__note">
            {{ String(certificates.length).padStart(2, '0') }} dokumen<br />{{ yearRange }}
          </span>
        </div>
        <div class="section-head__main">
          <h2 v-type="'sertifikat'" class="section-title">
            Bukti saya terus <span class="serif-accent">belajar</span>
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
              data-cursor="Lihat"
              @mouseenter="active = index"
              @focus="active = index"
              @click="active === index ? openLightbox(index) : (active = index)"
            >
              <span class="certs__num">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="certs__main">
                <span class="certs__title">{{ cert.title }}</span>
                <span class="certs__issuer">{{ cert.issuer }}</span>
              </span>
              <span class="certs__side">
                <span class="certs__kind">{{ cert.kind }}</span>
                <span class="certs__date">{{ cert.date }}</span>
              </span>
            </button>

            <!-- HP: gambar terbuka di bawah baris yang dipilih -->
            <div :id="`cert-${index}`" class="certs__inline" :inert="active !== index">
              <div class="certs__inline-inner">
                <p class="certs__detail">{{ cert.detail }}</p>
                <button
                  type="button"
                  class="certs__inline-shot"
                  :aria-label="`Perbesar sertifikat ${cert.title}`"
                  @click="openLightbox(index)"
                  @contextmenu.prevent="preventImageAction"
                >
                  <img
                    :src="cert.image"
                    :alt="`Sertifikat ${cert.title}`"
                    loading="lazy"
                    draggable="false"
                    @dragstart.prevent="preventImageAction"
                  />
                </button>
              </div>
            </div>
          </li>
        </ol>

        <!-- Desktop: satu bingkai pratinjau yang ikut berganti -->
        <aside v-reveal.scale="160" class="certs__preview" aria-live="polite">
          <button
            type="button"
            class="certs__frame"
            data-cursor="Perbesar"
            :aria-label="`Perbesar sertifikat ${activeCert.title}`"
            @click="openLightbox(active)"
            @contextmenu.prevent="preventImageAction"
          >
            <Transition name="cert-fade" mode="out-in">
              <img
                :key="activeCert.ref"
                :src="activeCert.image"
                :alt="`Sertifikat ${activeCert.title}`"
                class="certs__frame-img"
                draggable="false"
                @dragstart.prevent="preventImageAction"
              />
            </Transition>
          </button>

          <div class="certs__caption">
            <p class="certs__detail">{{ activeCert.detail }}</p>
            <dl class="certs__meta mono-meta">
              <div>
                <dt>No.</dt>
                <dd>{{ activeCert.ref }}</dd>
              </div>
            </dl>
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
        :aria-label="certificates[lightbox].title"
        @click.self="closeLightbox"
        @contextmenu.prevent="preventImageAction"
      >
        <button type="button" class="cert-lightbox__close" aria-label="Tutup" @click="closeLightbox">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div class="cert-lightbox__stage" @click.self="closeLightbox">
          <button
            type="button"
            class="cert-lightbox__nav cert-lightbox__nav--prev"
            aria-label="Sertifikat sebelumnya"
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
            :alt="`Sertifikat ${certificates[lightbox].title}`"
            class="cert-lightbox__img"
            draggable="false"
            @dragstart.prevent="preventImageAction"
          />
          <button
            type="button"
            class="cert-lightbox__nav cert-lightbox__nav--next"
            aria-label="Sertifikat berikutnya"
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
            {{ certificates[lightbox].kind }} · {{ certificates[lightbox].date }} ·
            {{ lightbox + 1 }} / {{ certificates.length }}
          </span>
          {{ certificates[lightbox].title }}
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
.certs__frame,
.certs__inline-shot {
  position: relative;
  border-color: transparent !important;
}

/* Cincin tipis: gradien kerucut yang di-mask jadi garis tepi saja */
.certs__frame::before,
.certs__inline-shot::before,
.certs__frame::after,
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

.certs__frame::before,
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
.certs__frame::after,
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

/* Bingkai: alas lembut + dokumen di tengah dengan bayangan kertas tipis */
.certs__frame {
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 4 / 3;
  padding: clamp(1rem, 2.5vw, 1.75rem);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-lg);
  background: var(--color-surface-soft);
  cursor: zoom-in;
}

.certs__frame-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 14px 30px -18px rgba(0, 0, 0, 0.45);
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

.cert-lightbox__close,
.cert-lightbox__nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(14, 15, 17, 0.7);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cert-lightbox__close:hover,
.cert-lightbox__nav:hover {
  background: rgba(255, 255, 255, 0.16);
}

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

  .certs__inline-shot {
    display: block;
    width: 100%;
    margin-top: 0.85rem;
    padding: 0.75rem;
    border: 1px solid var(--color-rule);
    border-radius: var(--radius);
    background: var(--color-surface-soft);
    cursor: zoom-in;
  }

  .certs__inline-shot img {
    display: block;
    width: 100%;
    max-height: 60vh;
    object-fit: contain;
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
  .certs__frame::before,
  .certs__frame::after,
  .certs__inline-shot::before,
  .certs__inline-shot::after {
    animation-duration: 6s !important;
    animation-iteration-count: infinite !important;
  }
}
</style>
