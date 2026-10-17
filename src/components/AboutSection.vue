<script setup>
import { ref, computed } from 'vue'
import { vReveal } from '@/directives/reveal'
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

// Ikon garis sederhana untuk tiap keunggulan (path SVG 24x24)
const highlightIcons = {
  code: 'M8 7 3 12l5 5M16 7l5 5-5 5M14 4l-4 16',
  diagram: 'M4 4h6v5H4zM14 15h6v5h-6zM14 4h6v5h-6zM7 9v4a2 2 0 0 0 2 2h5M17 9v6',
  team: 'M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M21 19v-1a4 4 0 0 0-3-3.85M15.5 4.15a3 3 0 0 1 0 5.7',
}

const highlights = [
  {
    title: 'Full-stack & mobile',
    icon: 'code',
    keywords: ['Vue', 'React', 'Flutter', 'Node.js'],
    desc: 'Terbiasa membangun aplikasi end-to-end, dari frontend, backend, sampai database, untuk web maupun mobile dengan Flutter.',
  },
  {
    title: 'Analitis & terstruktur',
    icon: 'diagram',
    keywords: ['ERD', 'UML', 'Flowchart'],
    desc: 'Berpengalaman sebagai System Analyst, merancang ERD, UML, dan flowchart, serta mengelola jadwal dan anggaran proyek.',
  },
  {
    title: 'Kolaboratif',
    icon: 'team',
    keywords: ['Tim lintas peran', 'Organisasi'],
    desc: 'Aktif berorganisasi dan terbiasa bekerja lintas peran dalam tim untuk menghasilkan produk yang sesuai kebutuhan pengguna.',
  },
]

// Bidang minat, ditampilkan sebagai chip di kartu perkenalan
const interests = ['Web', 'Mobile', 'Data', 'AI']

// Kategori dipakai untuk filter di grid tools
const categories = [
  { key: 'all', label: 'Semua' },
  { key: 'web', label: 'Web' },
  { key: 'db', label: 'Database' },
  { key: 'data', label: 'Data' },
  { key: 'design', label: 'Mobile & Desain' },
]

const tools = [
  { name: 'Vue.js', icon: vueIcon, cat: 'web' },
  { name: 'React', icon: reactIcon, cat: 'web' },
  { name: 'Node.js', icon: nodejsIcon, cat: 'web' },
  { name: 'PHP', icon: phpIcon, cat: 'web' },
  { name: 'PostgreSQL', icon: postgresqlIcon, cat: 'db' },
  { name: 'MySQL', icon: mysqlIcon, cat: 'db' },
  { name: 'Python', icon: pythonIcon, cat: 'data' },
  { name: 'Streamlit', icon: streamlitIcon, cat: 'data' },
  { name: 'Plotly', icon: plotlyIcon, cat: 'data' },
  { name: 'Power BI', icon: powerBiIcon, cat: 'data' },
  { name: 'Excel', icon: excelIcon, cat: 'data' },
  { name: 'Google Colab', icon: colabIcon, cat: 'data' },
  { name: 'Flutter', icon: flutterIcon, cat: 'design' },
  { name: 'Figma', icon: figmaIcon, cat: 'design' },
]

const categoryLabel = Object.fromEntries(categories.map((c) => [c.key, c.label]))

const facts = [
  { label: 'Pendidikan', value: 'S1 Bisnis Digital', sub: 'ULBI Bandung' },
  { label: 'IPK', value: '3,75', sub: 'dari 4,00' },
  { label: 'Sertifikasi', value: 'SAP', sub: 'Certified' },
]

const activeCat = ref('all')

function countOf(key) {
  return key === 'all' ? tools.length : tools.filter((t) => t.cat === key).length
}

// Tools yang tidak cocok tidak dihapus, cukup diredupkan, supaya grid tidak "loncat"
function isMatch(tool) {
  return activeCat.value === 'all' || tool.cat === activeCat.value
}

const matchCount = computed(() => countOf(activeCat.value))

// Proteksi gambar: cegah klik kanan (save as) & drag gambar keluar dari halaman
function preventImageAction(event) {
  event.preventDefault()
  return false
}
</script>

<template>
  <section id="tentang" class="about">
    <div class="container">
      <header class="about__header">
        <span class="section-label" v-reveal
          ><span class="section-label__num">01</span>Tentang Saya</span
        >

        <h2 class="section-title" v-reveal.clip="80">
          Menghubungkan <span class="serif-accent">data</span>, desain, dan kode jadi satu solusi
        </h2>
      </header>

      <!-- Bento: perkenalan besar di kiri, kutipan + fakta di kanan -->
      <div class="about__bento">
        <article class="about__card about__card--intro" v-reveal.left="160">
          <span class="about__card-tag">Halo, saya Jose</span>

          <div class="about__desc">
            <p>
              Saya Jose, Fresh Graduate S1 Bisnis Digital (IPK 3,75/4,00) dari Universitas Logistik
              dan Bisnis Internasional (ULBI) Bandung, dengan minat besar di web, mobile, data, dan
              AI.
            </p>
            <p>
              Saya terbiasa membangun aplikasi end-to-end dengan React.js, Vue.js, Node.js, PHP,
              MySQL, dan PostgreSQL, mulai dari pemodelan sistem (UML, ERD, Flowchart), merancang
              sistem e-commerce dengan integrasi Midtrans dan RajaOngkir, mengolah data dengan
              Google Colab, sampai visualisasi data dengan Python dan Streamlit. Di sisi mobile,
              saya mengembangkan aplikasi dengan Flutter dan Dart. Saya juga bersertifikasi SAP.
            </p>
          </div>

          <div class="about__interests">
            <span class="about__interests-label">Minat</span>
            <ul v-reveal.stagger.scale="{ delay: 520, step: 70 }">
              <li v-for="item in interests" :key="item">{{ item }}</li>
            </ul>
          </div>
        </article>

        <figure class="about__card about__card--quote" v-reveal.right="200">
          <span class="about__quote-mark" aria-hidden="true">&ldquo;</span>
          <blockquote>Solusi terbaik lahir dari data yang dipahami dan desain yang dirasakan.</blockquote>
          <figcaption>Prinsip kerja saya</figcaption>
        </figure>

        <dl class="about__card about__card--facts" v-reveal.right="280">
          <div v-for="fact in facts" :key="fact.label" class="about__fact">
            <dt>{{ fact.label }}</dt>
            <dd>
              <strong>{{ fact.value }}</strong>
              <span>{{ fact.sub }}</span>
            </dd>
          </div>
        </dl>
      </div>

      <!-- Keunggulan: baris memanjang, bukan kartu -->
      <div class="about__caps">
        <span class="about__block-label" v-reveal.left>Yang saya bawa ke tim</span>

        <ol class="about__caps-list">
          <li
            v-for="(item, index) in highlights"
            :key="item.title"
            class="about__cap"
            v-reveal="index * 110"
          >
            <span class="about__cap-num">0{{ index + 1 }}</span>

            <div class="about__cap-head">
              <span class="about__cap-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    :d="highlightIcons[item.icon]"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <h3 class="about__cap-title">{{ item.title }}</h3>
            </div>

            <p class="about__cap-desc">{{ item.desc }}</p>

            <ul class="about__cap-keys" aria-label="Kata kunci">
              <li v-for="key in item.keywords" :key="key">{{ key }}</li>
            </ul>
          </li>
        </ol>
      </div>

      <!-- Tools: grid ubin dengan filter kategori -->
      <div class="about__stack">
        <div class="about__stack-head" v-reveal>
          <div>
            <span class="about__block-label">Tools &amp; teknologi yang saya kuasai</span>
            <p class="about__stack-count" aria-live="polite">
              <strong>{{ matchCount }}</strong> dari {{ tools.length }} tools
            </p>
          </div>

          <div class="about__filters" role="group" aria-label="Filter kategori tools">
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
        </div>

        <ul class="about__tools" v-reveal.stagger.scale="{ delay: 140, step: 45 }">
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
            <span class="about__tool-text">
              <span class="about__tool-name">{{ tool.name }}</span>
              <span class="about__tool-cat">{{ categoryLabel[tool.cat] }}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  position: relative;
  padding: var(--section-y) 0;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.about__header {
  max-width: 46rem;
}

/* ---- Bento grid ---- */
.about__bento {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-template-rows: auto auto;
  gap: 1rem;
  margin-top: clamp(2rem, 4vw, 3rem);
}

.about__card {
  position: relative;
  margin: 0;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  overflow: hidden;
}

.about__card--intro {
  grid-column: 1 / span 7;
  grid-row: 1 / span 2;
  display: flex;
  flex-direction: column;
  padding: clamp(1.5rem, 3vw, 2.4rem);
  background:
    radial-gradient(
        circle,
        color-mix(in srgb, var(--color-text-soft) 22%, transparent) 1px,
        transparent 1.3px
      )
      0 0 / 18px 18px,
    var(--color-bg);
}

/* Pola titik hanya terlihat di pojok kanan atas */
.about__card--intro::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(200deg, transparent 0%, var(--color-bg) 40%);
  pointer-events: none;
}

.about__card--intro > * {
  position: relative;
}

.about__card-tag {
  align-self: flex-start;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--color-accent) 35%, transparent);
  background: var(--color-accent-soft);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.about__desc {
  margin-top: 1.4rem;
}

.about__desc p {
  margin: 0 0 1rem;
  font-size: clamp(1rem, 1.3vw, 1.06rem);
  line-height: 1.8;
  color: var(--color-text-soft);
  text-wrap: pretty;
}

.about__desc p:first-child {
  font-size: clamp(1.08rem, 1.6vw, 1.22rem);
  line-height: 1.65;
  color: var(--color-text);
}

.about__interests {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1.4rem;
  border-top: 1px dashed var(--color-border);
}

.about__interests-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.about__interests ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.about__interests li {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
}

/* Kutipan */
.about__card--quote {
  grid-column: 8 / span 5;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem 1.8rem 1.6rem;
  background:
    radial-gradient(120% 90% at 100% 0%, var(--color-primary-soft), transparent 60%),
    var(--color-bg);
}

.about__quote-mark {
  position: absolute;
  top: -1.4rem;
  right: 1.2rem;
  font-family: var(--font-serif);
  font-size: 9rem;
  line-height: 1;
  color: var(--color-primary);
  opacity: 0.35;
}

.about__card--quote blockquote {
  position: relative;
  margin: 2.2rem 0 0;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.45rem, 2.3vw, 1.85rem);
  line-height: 1.25;
  color: var(--color-text);
  text-wrap: balance;
}

.about__card--quote figcaption {
  margin-top: 1.2rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
}

/* Fakta: baris label kiri, nilai kanan */
.about__card--facts {
  grid-column: 8 / span 5;
  display: grid;
  padding: 0.4rem 1.4rem;
}

.about__fact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
}

.about__fact + .about__fact {
  border-top: 1px solid var(--color-border);
}

.about__fact dt {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.about__fact dd {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0;
  text-align: right;
}

.about__fact strong {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.about__fact span {
  font-size: 0.8rem;
  color: var(--color-text-soft);
}

/* ---- Label kecil untuk tiap blok ---- */
.about__block-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

/* ---- Keunggulan: baris memanjang ---- */
.about__caps {
  margin-top: clamp(3rem, 6vw, 4.5rem);
}

.about__caps-list {
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-border);
}

.about__cap {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1.1fr) minmax(0, 1.6fr) minmax(0, 1fr);
  align-items: center;
  gap: 1.5rem;
  padding: 1.4rem 1rem;
  border-bottom: 1px solid var(--color-border);
  border-radius: 0;
  transition:
    background 0.35s ease,
    border-radius 0.35s ease;
}

.about__cap:hover {
  background: var(--color-bg);
  border-radius: var(--radius-lg);
}

.about__cap-num {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text-soft);
  transition: color 0.3s ease;
}

.about__cap:hover .about__cap-num {
  color: var(--color-primary);
}

.about__cap-head {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.about__cap-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  transition:
    color 0.3s ease,
    background 0.3s ease,
    border-color 0.3s ease,
    transform 0.4s var(--ease-out);
}

.about__cap:hover .about__cap-icon {
  color: var(--color-accent);
  background: var(--color-accent-soft);
  border-color: color-mix(in srgb, var(--color-accent) 35%, transparent);
  transform: rotate(-6deg);
}

.about__cap-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.about__cap-desc {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--color-text-soft);
  text-wrap: pretty;
}

.about__cap-keys {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.about__cap-keys li {
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-soft);
}

/* ---- Tools: grid ubin + filter ---- */
.about__stack {
  margin-top: clamp(3.5rem, 7vw, 5rem);
}

.about__stack-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem 2rem;
}

.about__stack-count {
  margin: 0.4rem 0 0;
  font-size: 0.9rem;
  color: var(--color-text-soft);
}

.about__stack-count strong {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-text);
}

.about__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.about__filter {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.6rem 0.45rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-soft);
  cursor: pointer;
  transition:
    color 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;
}

.about__filter:hover {
  color: var(--color-text);
}

.about__filter:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.about__filter--active {
  color: var(--color-text);
  border-color: color-mix(in srgb, var(--color-primary) 55%, transparent);
  background: var(--color-primary-soft);
}

.about__filter-count {
  min-width: 1.4rem;
  padding: 0.1rem 0.35rem;
  border-radius: 999px;
  background: var(--color-surface);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  text-align: center;
  color: var(--color-text-soft);
}

.about__filter--active .about__filter-count {
  background: var(--color-primary);
  color: #fff;
}

.about__tools {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 0.6rem;
  margin: 1.4rem 0 0;
  padding: 0;
  list-style: none;
}

.about__tool {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.8rem 0.6rem 0.6rem;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  transition:
    opacity 0.35s ease,
    filter 0.35s ease,
    transform 0.4s var(--ease-out),
    border-color 0.3s ease;
  transition-delay: calc(var(--i) * 18ms);
}

.about__tool:not(.about__tool--dim):hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--color-primary) 45%, transparent);
}

.about__tool--dim {
  opacity: 0.28;
  filter: grayscale(1);
  transform: scale(0.97);
}

.about__tool-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #fff; /* logo asli (warna-warni) paling jelas di atas putih */
}

.about__tool-icon img {
  width: 26px;
  height: 26px;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.about__tool-text {
  display: grid;
  min-width: 0;
}

.about__tool-name {
  overflow: hidden;
  font-size: 0.92rem;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--color-text);
}

.about__tool-cat {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.04em;
  color: var(--color-text-soft);
}

@media (prefers-reduced-motion: reduce) {
  .about__tool,
  .about__cap,
  .about__cap-icon {
    transition: none;
  }
}

/* ---- Tablet ---- */
@media (max-width: 960px) {
  .about__card--intro {
    grid-column: 1 / -1;
    grid-row: auto;
  }

  .about__card--quote,
  .about__card--facts {
    grid-column: span 6;
  }

  .about__cap {
    grid-template-columns: 2.5rem minmax(0, 1fr);
    gap: 0.9rem 1rem;
    align-items: start;
  }

  .about__cap-num {
    padding-top: 0.8rem;
  }

  .about__cap-desc,
  .about__cap-keys {
    grid-column: 2;
  }

  .about__cap-keys {
    justify-content: flex-start;
  }
}

/* ---- HP ---- */
@media (max-width: 640px) {
  .about__card--quote,
  .about__card--facts {
    grid-column: 1 / -1;
  }

  .about__card--quote {
    padding: 1.6rem 1.4rem 1.4rem;
  }

  .about__fact dd {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.1rem;
  }

  .about__cap {
    grid-template-columns: minmax(0, 1fr);
    padding: 1.2rem 0.25rem;
  }

  .about__cap:hover {
    background: none;
  }

  .about__cap-num {
    padding-top: 0;
  }

  .about__cap-desc,
  .about__cap-keys {
    grid-column: 1;
  }

  /* Filter jadi satu baris yang bisa digeser */
  .about__filters {
    flex-wrap: nowrap;
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 0.2rem;
  }

  .about__filters::-webkit-scrollbar {
    display: none;
  }

  .about__filter {
    flex-shrink: 0;
  }

  .about__tools {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about__tool-icon {
    width: 34px;
    height: 34px;
  }

  .about__tool-icon img {
    width: 22px;
    height: 22px;
  }
}
</style>
