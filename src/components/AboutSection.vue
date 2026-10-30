<script setup>
import { ref } from 'vue'
import { vReveal } from '@/directives/reveal'
import figmaIcon from './icons/icons-about/Figma-logo.svg'
import flutterIcon from './icons/icons-about/Flutter-mark.svg'
import powerBiIcon from './icons/icons-about/New_Power_BI_Logo.svg'
import pythonIcon from './icons/icons-about/Python-logo-notext.svg'
import reactIcon from './icons/icons-about/React-icon.svg'
import streamlitIcon from './icons/icons-about/Streamlit.svg'
import vueIcon from './icons/icons-about/Vue.js_Logo_2.svg'
import excelIcon from './icons/icons-about/excel-logo.svg'
import plotlyIcon from './icons/icons-about/Plotly-mark.svg'
import colabIcon from './icons/icons-about/Google_Colaboratory_SVG_Logo.svg'
import postgresqlIcon from './icons/icons-about/Logo_PostgreSQL.png'
import mysqlIcon from './icons/icons-about/MySQL-mark.svg'
import nodejsIcon from './icons/icons-about/Nodejs-mark.svg'
import phpIcon from './icons/icons-about/new-php-logo.svg'
import tailwindIcon from './icons/icons-about/Tailwind_CSS_Logo.svg'
// Ikon simbol dari Simple Icons (CC0), diwarnai sesuai warna brand
import nextjsIcon from './icons/icons-about/Nextjs-logo.svg'
import typescriptIcon from './icons/icons-about/TypeScript-logo.svg'
import goIcon from './icons/icons-about/Go-logo.svg'
import expressIcon from './icons/icons-about/Express-logo.svg'
import dartIcon from './icons/icons-about/Dart-logo.svg'
import dockerIcon from './icons/icons-about/Docker-logo.svg'
import gitIcon from './icons/icons-about/Git-logo.svg'
import postmanIcon from './icons/icons-about/Postman-logo.svg'
import swaggerIcon from './icons/icons-about/Swagger-logo.svg'
import pandasIcon from './icons/icons-about/Pandas-logo.svg'

// Tiga kata kunci di kalimat manifesto + catatan kakinya
const highlights = [
  {
    title: 'full-stack & mobile',
    keywords: ['Vue', 'React', 'Flutter', 'Node.js'],
  },
  {
    title: 'analitis',
    keywords: ['ERD', 'UML', 'Flowchart'],
  },
  {
    title: 'kolaboratif',
    keywords: ['Tim lintas peran', 'Organisasi'],
  },
]

// Kategori dipakai untuk filter di grid tools
const categories = [
  { key: 'all', label: 'Semua' },
  { key: 'fe', label: 'Frontend' },
  { key: 'be', label: 'Backend' },
  { key: 'db', label: 'Database' },
  { key: 'ops', label: 'API & DevOps' },
  { key: 'data', label: 'Data' },
  { key: 'design', label: 'Mobile & Desain' },
]

const tools = [
  { name: 'Vue.js', icon: vueIcon, cat: 'fe' },
  { name: 'React', icon: reactIcon, cat: 'fe' },
  { name: 'Next.js', icon: nextjsIcon, cat: 'fe' },
  { name: 'TypeScript', icon: typescriptIcon, cat: 'fe' },
  { name: 'Tailwind CSS', icon: tailwindIcon, cat: 'fe' },
  { name: 'Go (Gin)', icon: goIcon, cat: 'be' },
  { name: 'Node.js', icon: nodejsIcon, cat: 'be' },
  { name: 'Express', icon: expressIcon, cat: 'be' },
  { name: 'PHP', icon: phpIcon, cat: 'be' },
  { name: 'PostgreSQL', icon: postgresqlIcon, cat: 'db' },
  { name: 'MySQL', icon: mysqlIcon, cat: 'db' },
  { name: 'Docker', icon: dockerIcon, cat: 'ops' },
  { name: 'Git', icon: gitIcon, cat: 'ops' },
  { name: 'Postman', icon: postmanIcon, cat: 'ops' },
  { name: 'Swagger', icon: swaggerIcon, cat: 'ops' },
  { name: 'Python', icon: pythonIcon, cat: 'data' },
  { name: 'Pandas', icon: pandasIcon, cat: 'data' },
  { name: 'Streamlit', icon: streamlitIcon, cat: 'data' },
  { name: 'Plotly', icon: plotlyIcon, cat: 'data' },
  { name: 'Power BI', icon: powerBiIcon, cat: 'data' },
  { name: 'Excel', icon: excelIcon, cat: 'data' },
  { name: 'Google Colab', icon: colabIcon, cat: 'data' },
  { name: 'Flutter', icon: flutterIcon, cat: 'design' },
  { name: 'Dart', icon: dartIcon, cat: 'design' },
  { name: 'Figma', icon: figmaIcon, cat: 'design' },
]

// Kata kunci yang sedang disorot (kalimat & catatan kaki menyala bersamaan)
const activeHighlight = ref(null)

const activeCat = ref('all')

// Tools tampil sebagai baris yang bergeser terus ke kanan; tombol
// "Lihat semua" membuka grid lengkap (dengan filter), "Tutup" kembali.
const showAll = ref(false)
const half = Math.ceil(tools.length / 2)
const toolRows = [tools.slice(0, half), tools.slice(half)]
const stackEl = ref(null)

function toggleAll() {
  showAll.value = !showAll.value
  if (!showAll.value) {
    activeCat.value = 'all'
    // Grid lebih tinggi dari baris geser: kembalikan judul Tools ke layar
    requestAnimationFrame(() => {
      const top = stackEl.value?.getBoundingClientRect().top ?? 0
      if (top < 0) stackEl.value.scrollIntoView({ block: 'start', behavior: 'smooth' })
    })
  }
}

function countOf(key) {
  return key === 'all' ? tools.length : tools.filter((t) => t.cat === key).length
}

// Tools yang tidak cocok tidak dihapus, cukup diredupkan, supaya grid tidak "loncat"
function isMatch(tool) {
  return activeCat.value === 'all' || tool.cat === activeCat.value
}

// Proteksi gambar: cegah klik kanan (save as) & drag gambar keluar dari halaman
function preventImageAction(event) {
  event.preventDefault()
  return false
}
</script>

<template>
  <section id="tentang" class="about">
    <div class="container">
      <!-- Manifesto: satu kalimat menggantikan judul, perkenalan, dan daftar
           keunggulan. Kata kunci bernomor seperti catatan kaki majalah. -->
      <header class="section-head about__head">
        <div class="section-head__meta">
          <span class="section-label" v-reveal
            ><span class="section-label__num">01</span>Tentang Saya</span
          >
        </div>
        <div class="section-head__main">
          <h2 class="section-title about__manifesto" v-reveal.clip="80">
            Saya membangun
            <span
              class="about__key"
              :class="{ 'is-active': activeHighlight === 0 }"
              @mouseenter="activeHighlight = 0"
              @mouseleave="activeHighlight = null"
              >{{ highlights[0].title }}<sup>1</sup></span
            >, berpikir
            <span
              class="about__key serif-accent"
              :class="{ 'is-active': activeHighlight === 1 }"
              @mouseenter="activeHighlight = 1"
              @mouseleave="activeHighlight = null"
              >{{ highlights[1].title }}<sup>2</sup></span
            >, dan bekerja
            <span
              class="about__key"
              :class="{ 'is-active': activeHighlight === 2 }"
              @mouseenter="activeHighlight = 2"
              @mouseleave="activeHighlight = null"
              >{{ highlights[2].title }}<sup>3</sup></span
            >.
          </h2>

          <ol class="about__notes" v-reveal.stagger="{ delay: 200, step: 90 }">
            <li
              v-for="(item, index) in highlights"
              :key="item.title"
              class="about__note"
              :class="{ 'is-active': activeHighlight === index }"
              @mouseenter="activeHighlight = index"
              @mouseleave="activeHighlight = null"
            >
              <span class="about__note-num">{{ index + 1 }}</span>
              {{ item.keywords.join(' · ') }}
            </li>
          </ol>
        </div>
      </header>

      <!-- Tools: baris bergeser; "Lihat semua" membuka grid + filter kategori -->
      <div ref="stackEl" class="about__stack">
        <div class="about__block-head about__block-head--stack" v-reveal>
          <span class="about__block-label">Tools</span>

          <div class="about__stack-actions">
            <div v-if="showAll" class="about__filters" role="group" aria-label="Filter kategori tools">
              <button
                v-for="cat in categories"
                :key="cat.key"
                type="button"
                class="about__filter"
                :class="{ 'about__filter--active': activeCat === cat.key }"
                :aria-pressed="activeCat === cat.key"
                @click="activeCat = cat.key"
              >
                {{ cat.label }}
                <span class="about__filter-count">{{ countOf(cat.key) }}</span>
              </button>
            </div>

            <button
              type="button"
              class="about__toggle"
              :aria-expanded="showAll"
              aria-controls="about-tools"
              @click="toggleAll"
            >
              {{ showAll ? 'Tutup' : `Lihat semua ${tools.length}` }}
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path
                  v-if="showAll"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  d="M6 6l12 12M18 6 6 18"
                />
                <path
                  v-else
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Dua baris bergeser berlawanan arah. Tiap baris diulang dua kali
             supaya putarannya mulus tanpa jeda. -->
        <div v-if="!showAll" class="about__marquees" v-reveal>
          <div
            v-for="(row, r) in toolRows"
            :key="r"
            class="about__marquee"
            :class="r === 0 ? 'about__marquee--right' : 'about__marquee--left'"
          >
            <ul class="about__marquee-track">
              <li
                v-for="(tool, index) in [...row, ...row]"
                :key="`${tool.name}-${index}`"
                class="about__chip"
                :aria-hidden="index >= row.length ? 'true' : undefined"
                oncontextmenu="return false"
                @contextmenu.prevent="preventImageAction"
              >
                <img
                  :src="tool.icon"
                  :alt="index >= row.length ? '' : tool.name"
                  class="about__chip-icon"
                  width="24"
                  height="24"
                  draggable="false"
                  @dragstart.prevent="preventImageAction"
                />
                <span class="about__chip-name">{{ tool.name }}</span>
              </li>
            </ul>
          </div>
        </div>

        <ul v-else id="about-tools" class="about__tools">
          <li
            v-for="(tool, index) in tools"
            :key="tool.name"
            class="about__tool"
            :class="{ 'about__tool--dim': !isMatch(tool) }"
            :style="{ '--i': index }"
            oncontextmenu="return false"
            @contextmenu.prevent="preventImageAction"
          >
            <span class="about__tool-icon">
              <img
                :src="tool.icon"
                :alt="tool.name"
                loading="lazy"
                width="28"
                height="28"
                draggable="false"
                oncontextmenu="return false"
                @contextmenu.prevent="preventImageAction"
                @dragstart.prevent="preventImageAction"
              />
            </span>
            <span class="about__tool-name">{{ tool.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding: var(--section-y) 0;
  background: var(--color-bg);
}

/* ---- Manifesto ---- */
.about__head {
  margin-bottom: 0;
}

.about__manifesto {
  max-width: 22ch;
}

.about__key {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 0.14em;
  text-decoration-color: var(--color-rule);
  transition: color 0.25s ease, text-decoration-color 0.25s ease;
}

.about__key sup {
  margin-left: 0.08em;
  font-family: var(--font-mono);
  font-size: 0.3em;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0;
  vertical-align: super;
  color: var(--color-text-soft);
}

.about__key.is-active {
  color: var(--color-primary);
  text-decoration-color: currentColor;
}

/* Catatan kaki: nomor kecil + kata kunci mono */
/* Lebar tiap catatan mengikuti isinya (tidak dibagi rata) supaya kata kunci
   tetap satu baris; kalau layar sempit, catatan pindah utuh ke baris baru */
.about__notes {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
  margin: clamp(2rem, 4vw, 2.75rem) 0 0;
  padding: 1rem 0 0;
  border-top: 1px solid var(--color-rule);
  list-style: none;
}

.about__note {
  white-space: nowrap;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1.7;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-soft);
  transition: color 0.25s ease;
}

.about__note-num {
  margin-right: 0.5rem;
  color: var(--color-text);
}

.about__note.is-active,
.about__note.is-active .about__note-num {
  color: var(--color-primary);
}

/* ---- Kepala blok tools ---- */
.about__block-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--color-rule);
}

.about__block-label {
  font-family: var(--font-heading);
  font-size: clamp(1.15rem, 1.8vw, 1.35rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

/* ---- Tools ---- */
.about__stack {
  margin-top: clamp(4rem, 8vw, 6rem);
}

.about__block-head--stack {
  align-items: flex-end;
  flex-wrap: wrap;
  border-bottom: 0;
  padding-bottom: 1.25rem;
}

.about__stack-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem 1.75rem;
}

.about__toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 40px;
  padding: 0 1rem;
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-sm);
  background: none;
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.about__toggle:hover {
  border-color: var(--color-text);
  background: var(--color-surface);
}

/* ---- Dua baris bergeser ---- */
.about__marquees {
  display: grid;
  gap: 0.75rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--color-rule);
  border-bottom: 1px solid var(--color-rule);
}

.about__marquee {
  overflow: hidden;
  /* Tepi kiri & kanan memudar supaya chip "muncul" dan "hilang" halus */
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
}

.about__marquee-track {
  display: flex;
  width: max-content;
  margin: 0;
  padding: 0;
  list-style: none;
  animation: about-marquee-right 48s linear infinite;
}

/* Baris bawah bergerak ke kiri, sedikit lebih lambat supaya tidak seirama */
.about__marquee--left .about__marquee-track {
  animation-name: about-marquee-left;
  animation-duration: 54s;
}

.about__marquee:hover .about__marquee-track {
  animation-play-state: paused;
}

@keyframes about-marquee-right {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes about-marquee-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* Chip: garis tipis tanpa isi, ikon polos; menyala saat disorot */
.about__chip {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-shrink: 0;
  margin-right: 0.75rem;
  padding: 0.75rem 1.25rem 0.75rem 1rem;
  border: 1px solid var(--color-rule);
  border-radius: 999px;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.about__chip:hover {
  border-color: var(--color-text);
  background: var(--color-surface);
}

.about__chip-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}

.about__chip-name {
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  color: var(--color-text);
}

/* Grid lengkap muncul pelan saat dibuka */
.about__tools {
  animation: about-grid-in 0.4s var(--ease-out);
}

@keyframes about-grid-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

.about__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.4rem;
}

.about__filter {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  padding: 0.35rem 0;
  border: 0;
  background: none;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-soft);
  cursor: pointer;
  transition: color 0.2s ease;
}

.about__filter::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease-out);
}

.about__filter:hover {
  color: var(--color-text);
}

.about__filter--active {
  color: var(--color-text);
}

.about__filter--active::after {
  transform: scaleX(1);
}

.about__filter-count {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  color: var(--color-text-soft);
}

.about__filter--active .about__filter-count {
  color: var(--color-text);
}

/* Grid bergaris: garis dibagi bersama antar sel */
.about__tools {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-rule);
  border-left: 1px solid var(--color-border);
}

.about__tool {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-height: 84px;
  padding: 1.1rem 1rem;
  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  transition: opacity 0.3s ease, background-color 0.25s ease;
}

.about__tool:hover {
  background: var(--color-surface);
}

.about__tool--dim {
  opacity: 0.25;
}

.about__tool-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  background: var(--color-surface-soft);
}

.about__tool-icon img {
  width: 26px;
  height: 26px;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}

.about__tool-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

/* ---- Responsif ---- */
/* Tablet: ketiga catatan tidak muat sejajar, jadi ditumpuk rapi */
@media (max-width: 1100px) {
  .about__notes {
    flex-direction: column;
  }
}

@media (max-width: 640px) {

  .about__note {
    white-space: normal;
  }

  .about__tools {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about__stack-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .about__marquee-track {
    animation-duration: 38s;
  }

  .about__marquee--left .about__marquee-track {
    animation-duration: 42s;
  }

  .about__chip {
    gap: 0.55rem;
    padding: 0.6rem 1rem 0.6rem 0.8rem;
  }

  .about__chip-icon {
    width: 20px;
    height: 20px;
  }

  .about__chip-name {
    font-size: 0.86rem;
  }

  .about__tool {
    gap: 0.6rem;
    min-height: 72px;
    padding: 0.9rem 0.7rem;
  }

  .about__tool-icon {
    width: 34px;
    height: 34px;
  }

  .about__tool-icon img {
    width: 22px;
    height: 22px;
  }

  .about__tool-name {
    font-size: 0.86rem;
  }
}

/* Baris Tools tetap bergeser walau "kurangi animasi" aktif (gerakannya
   pelan & linear, dan berhenti saat disorot). Aturan global di main.css
   mematikan semua animasi, jadi di sini dikecualikan dengan !important. */
@media (prefers-reduced-motion: reduce) {
  .about__marquee-track {
    animation-duration: 48s !important;
    animation-iteration-count: infinite !important;
  }

  .about__marquee--left .about__marquee-track {
    animation-duration: 54s !important;
  }
}

@media (prefers-reduced-motion: reduce) and (max-width: 640px) {
  .about__marquee-track {
    animation-duration: 38s !important;
  }

  .about__marquee--left .about__marquee-track {
    animation-duration: 42s !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about__filter::after,
  .about__tool,
  .about__key,
  .about__note {
    transition: none;
  }
}
</style>
