<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import figmaIcon from './icons/icons-about/Figma-logo.svg'
import flutterIcon from './icons/icons-about/lockup_flutter_horizontal.svg'
import powerBiIcon from './icons/icons-about/New_Power_BI_Logo.svg'
import pythonIcon from './icons/icons-about/Python-logo-notext.svg'
import reactIcon from './icons/icons-about/React-icon.svg'
import streamlitIcon from './icons/icons-about/Streamlit.svg'
import vueIcon from './icons/icons-about/Vue.js_Logo_2.svg'
import excelIcon from './icons/icons-about/excel-logo.svg'
import plotlyIcon from './icons/icons-about/plotly-ar21.svg'
import colabIcon from './icons/icons-about/Google_Colaboratory_SVG_Logo.svg'
import postgresqlIcon from './icons/icons-about/Logo_PostgreSQL.png'
import mysqlIcon from './icons/icons-about/mysql-ar21.svg'
import nodejsIcon from './icons/icons-about/Node.js_logo.svg'
import phpIcon from './icons/icons-about/new-php-logo.svg'

const highlights = [
  {
    title: 'Full-stack & mobile',
    desc: 'Terbiasa membangun aplikasi end-to-end, dari frontend, backend, sampai database, untuk web maupun mobile dengan Flutter.',
  },
  {
    title: 'Analitis & terstruktur',
    desc: 'Berpengalaman sebagai System Analyst, merancang ERD, UML, dan flowchart, serta mengelola jadwal dan anggaran proyek.',
  },
  {
    title: 'Kolaboratif',
    desc: 'Aktif berorganisasi dan terbiasa bekerja lintas peran dalam tim untuk menghasilkan produk yang sesuai kebutuhan pengguna.',
  },
]

const tools = [
  { name: 'Flutter', icon: flutterIcon },
  { name: 'Figma', icon: figmaIcon },
  { name: 'Power BI', icon: powerBiIcon },
  { name: 'Python', icon: pythonIcon },
  { name: 'React', icon: reactIcon },
  { name: 'Streamlit', icon: streamlitIcon },
  { name: 'Vue.js', icon: vueIcon },
  { name: 'Excel', icon: excelIcon },
  { name: 'Plotly', icon: plotlyIcon },
  { name: 'Google Colab', icon: colabIcon },
  { name: 'PostgreSQL', icon: postgresqlIcon },
  { name: 'MySQL', icon: mysqlIcon },
  { name: 'Node.js', icon: nodejsIcon },
  { name: 'PHP', icon: phpIcon },
]

// Proteksi gambar: cegah klik kanan (save as) & drag gambar keluar dari halaman
function preventImageAction(event) {
  event.preventDefault()
  return false
}

/* ---------------------------------------------------------
   Animasi geser besar (kutipan dari KIRI, ikon tools dari KANAN).
   Yang diamati IntersectionObserver adalah WADAH-nya (tidak ikut
   bergeser), bukan elemen yang meluncur. Kalau elemen yang meluncur
   yang diamati, posisinya yang di luar layar bikin observer mengira
   "belum kelihatan" dan animasinya tidak pernah mulai.
--------------------------------------------------------- */
const visualEl = ref(null)
const toolsEl = ref(null)
const visualIn = ref(false)
const toolsIn = ref(false)
let slideObserver = null

onMounted(() => {
  slideObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        if (entry.target === visualEl.value) visualIn.value = true
        else if (entry.target === toolsEl.value) toolsIn.value = true
        slideObserver.unobserve(entry.target)
      })
    },
    { threshold: 0.25, rootMargin: '0px 0px -60px 0px' },
  )
  slideObserver.observe(visualEl.value)
  slideObserver.observe(toolsEl.value)
})

onUnmounted(() => {
  slideObserver?.disconnect()
})

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
        const el = entry.target
        el.classList.add('is-visible')
        revealObserver.unobserve(el)

        // Setelah animasi masuk selesai, buang delay & tandai "selesai".
        // Tanpa ini, delay stagger ikut kebawa ke efek hover (ikon terasa
        // telat naik saat di-hover).
        const delay = parseFloat(el.style.transitionDelay) || 0
        setTimeout(() => {
          el.style.transitionDelay = '0ms'
          el.classList.add('reveal-done')
        }, delay + 800)
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
</script>

<template>
  <section id="tentang" class="about">
    <div class="about__inner">
      <div ref="visualEl" class="about__visual" :class="{ 'is-in': visualIn }">
        <div class="about__blob"></div>
        <div class="about__quote">
          <p class="about__quote-text">
            "Solusi terbaik lahir dari data yang dipahami dan desain yang dirasakan."
          </p>
        </div>
      </div>

      <div class="about__content">
        <span class="about__eyebrow" v-reveal>Tentang Saya</span>

        <h2 class="about__title" v-reveal="90">
          Menghubungkan data, desain, dan kode jadi satu solusi
        </h2>

        <p class="about__desc" v-reveal="180">
          Saya Jose, Fresh Graduate S1 Bisnis Digital (IPK 3,75/4,00) dari
          Universitas Logistik dan Bisnis Internasional (ULBI) Bandung, dengan
          minat besar di web, mobile, data, dan AI. Saya terbiasa membangun
          aplikasi end-to-end dengan React.js, Vue.js, Node.js, PHP, MySQL,
          dan PostgreSQL, mulai dari pemodelan sistem (UML, ERD, Flowchart),
          merancang sistem e-commerce dengan integrasi Midtrans dan RajaOngkir,
          mengolah data dengan Google Colab, sampai visualisasi data dengan
          Python dan Streamlit. Di sisi mobile, saya mengembangkan aplikasi
          dengan Flutter dan Dart. Saya juga bersertifikasi SAP.
        </p>

        <ul class="about__highlights">
          <li
            v-for="(item, index) in highlights"
            :key="item.title"
            class="about__highlight"
            v-reveal="260 + index * 90"
          >
            <span class="about__highlight-icon">✓</span>
            <div>
              <h3 class="about__highlight-title">{{ item.title }}</h3>
              <p class="about__highlight-desc">{{ item.desc }}</p>
            </div>
          </li>
        </ul>

        <div ref="toolsEl" class="about__tools" :class="{ 'is-in': toolsIn }">
          <span class="about__tools-label">Yang saya kuasai</span>

          <ul class="about__tools-list">
            <li
              v-for="(tool, index) in tools"
              :key="tool.name"
              class="about__tools-item"
              :title="tool.name"
              :style="{ '--i': index }"
              oncontextmenu="return false"
              @contextmenu.prevent="preventImageAction"
            >
              <img
                :src="tool.icon"
                :alt="tool.name"
                class="about__tools-icon"
                loading="lazy"
                width="32"
                height="32"
                draggable="false"
                oncontextmenu="return false"
                @contextmenu.prevent="preventImageAction"
                @dragstart.prevent="preventImageAction"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding: 5rem 1.5rem;
  background: var(--color-surface, #fff);
  /* PENTING: ikon "Yang saya kuasai" (dari kanan) dan kutipan (dari kiri)
     mulai dari luar layar. Overflow horizontal harus dipotong di batas
     section, kalau tidak halaman melebar dan browser HP memunculkan strip
     kosong / scroll ke samping. `clip` (bukan `hidden`) supaya tidak
     bikin scroll container baru. */
  overflow-x: hidden; /* fallback browser lama */
  overflow-x: clip;
}

.about__inner {
  max-width: 1160px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 3.5rem;
  align-items: center;
}

.about__visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
}

.about__blob {
  position: absolute;
  width: 300px;
  height: 300px;
  background: linear-gradient(155deg, var(--color-mint, #cfe3dd), var(--color-accent-soft, #fbe4d8));
  border-radius: 42% 58% 65% 35% / 45% 45% 55% 55%;
  animation: about-blob-float 9s ease-in-out infinite;
}

/* Gerakan sangat halus, cuma biar blob terasa "hidup", bukan animasi warna */
@keyframes about-blob-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(3deg);
  }
}

.about__quote {
  position: relative;
  width: 250px;
  padding: 2rem 1.75rem;
  background: var(--color-bg, #f1f4f1);
  border-radius: 20px;
  box-shadow: 0 24px 45px -25px rgba(37, 54, 50, 0.4);
}

.about__quote-text {
  margin: 0;
  font-family: var(--font-body);
  font-style: italic;
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--color-text, #253632);
}

.about__eyebrow {
  display: inline-flex;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary-dark, #4f7566);
  background: var(--color-mint, #cfe3dd);
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
}

.about__title {
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  line-height: 1.25;
  font-weight: 600;
  color: var(--color-text, #253632);
  margin: 1.1rem 0 1rem;
  letter-spacing: -0.01em;
}

.about__desc {
  text-align: justify;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.75;
  color: var(--color-text-soft, #5c6f69);
  margin: 0 0 2rem;
  max-width: 560px;
}

.about__highlights {
  list-style: none;
  margin: 0 0 2.25rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.about__highlight {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
}

.about__highlight-icon {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-primary, #6b9080);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  margin-top: 0.15rem;
}

.about__highlight-title {
  margin: 0 0 0.2rem;
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text, #253632);
}

.about__highlight-desc {
  text-align: justify;
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text-soft, #5c6f69);
}

.about__tools {
  padding-top: 1.75rem;
  border-top: 1px solid rgba(107, 144, 128, 0.2);
}

.about__tools-label {
  display: block;
  text-align: center;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-soft, #5c6f69);
  margin-bottom: 0.9rem;
}

.about__tools-list {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-items: center;
  align-items: center;
  gap: 1rem 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.about__tools-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  padding: 0;
  transition: transform 0.2s ease;
}

.about__tools-item:hover {
  transform: translateY(-3px);
}

.about__tools-icon {
  width: 32px;
  height: 32px;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  /* Proteksi: cegah seleksi, drag, dan long-press save di mobile */
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none;
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

/* ---------------------------------------------------------
   Animasi geser besar. Pakai properti `translate` & `scale`
   (bukan `transform`) supaya tidak bentrok dengan animasi blob
   (about-blob-float) dan efek hover ikon yang memakai `transform`.
   Warna elemen tidak diubah sama sekali.
--------------------------------------------------------- */

/* 1) Kutipan + blob: masuk dari KIRI layar ke posisi semula.
   Sebelum masuk viewport: sembunyi di luar layar sebelah kiri. */
.about__visual:not(.is-in) .about__blob,
.about__visual:not(.is-in) .about__quote {
  opacity: 0;
  translate: -100vw 0;
}

.about__visual.is-in .about__blob {
  animation:
    about-blob-float 9s ease-in-out infinite,
    about-slide-in-left 1.3s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

/* Kartu kutipan menyusul sedikit di belakang blob (delay 0.12 dtk) */
.about__visual.is-in .about__quote {
  animation: about-slide-in-left 1.3s cubic-bezier(0.22, 1, 0.36, 1) 0.12s backwards;
}

@keyframes about-slide-in-left {
  from {
    opacity: 0;
    translate: -100vw 0;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

/* 2) Ikon "Yang saya kuasai": masuk dari KANAN layar satu per satu
   (berurutan, jeda 55 ms per ikon) sambil sedikit membesar. */
.about__tools:not(.is-in) .about__tools-item {
  opacity: 0;
  translate: 100vw 0;
  scale: 0.8;
}

.about__tools.is-in .about__tools-item {
  animation: about-slide-in-right 1.2s cubic-bezier(0.22, 1, 0.36, 1)
    calc(var(--i, 0) * 55ms) backwards;
}

@keyframes about-slide-in-right {
  from {
    opacity: 0;
    translate: 100vw 0;
    scale: 0.8;
  }
  to {
    opacity: 1;
    translate: 0 0;
    scale: 1;
  }
}

/* Reduce motion: teks (v-reveal) langsung tampil & blob berhenti
   melayang terus-menerus. Animasi geser masuk kutipan dan ikon tools
   sengaja TIDAK dimatikan, sesuai permintaan. */
@media (prefers-reduced-motion: reduce) {
  .reveal,
  .reveal:not(.is-visible) {
    transition: none;
    opacity: 1;
    transform: none;
  }

  .about__blob {
    animation: none;
  }

  .about__visual.is-in .about__blob {
    animation: about-slide-in-left 1.3s cubic-bezier(0.22, 1, 0.36, 1) backwards;
  }
}

@media (max-width: 900px) {
  .about__inner {
    /* minmax(0, 1fr): kolom boleh menyusut, tidak melebar oleh isi yang panjang */
    grid-template-columns: minmax(0, 1fr);
  }

  .about__visual {
    order: -1;
    min-height: 260px;
  }

  .about__tools-list {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 600px) {
  .about__tools-list {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 400px) {
  .about__tools-list {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .about {
    padding: 3.5rem 1.25rem;
  }

  .about__eyebrow {
    display: table;
    margin: 0 auto;
  }
}
</style>
