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
      <header class="section-head">
        <div class="section-head__meta">
          <span class="section-label" v-reveal
            ><span class="section-label__num">01</span>Tentang Saya</span
          >
          <span class="section-head__note" v-reveal="60">
            Profil singkat<br />Bandung, Jawa Barat
          </span>
        </div>
        <div class="section-head__main">
          <h2 class="section-title" v-reveal.clip="80">
            Menghubungkan <span class="serif-accent">data</span>, desain, dan kode jadi satu solusi
          </h2>
        </div>
      </header>

      <!-- Perkenalan: teks panjang di kiri, kutipan + fakta di kanan -->
      <div class="about__intro">
        <article class="about__story" v-reveal.left="160">
          <span class="mono-meta about__tag">Halo, saya Jose</span>

          <div class="about__desc">
            <p class="about__lead">
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
            <span class="mono-meta">Minat</span>
            <ul v-reveal.stagger.scale="{ delay: 520, step: 70 }">
              <li v-for="item in interests" :key="item">{{ item }}</li>
            </ul>
          </div>
        </article>

        <aside class="about__side">
          <figure class="about__quote" v-reveal.right="200">
            <blockquote>Solusi terbaik lahir dari data yang dipahami dan desain yang dirasakan.</blockquote>
            <figcaption class="mono-meta">Prinsip kerja saya</figcaption>
          </figure>

          <dl class="about__facts" v-reveal.right="280">
            <div v-for="fact in facts" :key="fact.label" class="about__fact">
              <dt>{{ fact.label }}</dt>
              <dd>
                <strong>{{ fact.value }}</strong>
                <span>{{ fact.sub }}</span>
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <!-- Keunggulan: baris bergaris seperti tabel -->
      <div class="about__caps">
        <div class="about__block-head" v-reveal.left>
          <span class="about__block-label">Yang saya bawa ke tim</span>
          <span class="mono-meta">{{ String(highlights.length).padStart(2, '0') }} poin</span>
        </div>

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
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    :d="highlightIcons[item.icon]"
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

      <!-- Tools: grid spesimen bergaris dengan filter kategori -->
      <div class="about__stack">
        <div class="about__block-head about__block-head--stack" v-reveal>
          <div>
            <span class="about__block-label">Tools &amp; teknologi yang saya kuasai</span>
            <p class="about__stack-count mono-meta" aria-live="polite">
              <strong>{{ String(matchCount).padStart(2, '0') }}</strong> / {{ tools.length }} tools
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
            <span class="about__tool-index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
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
  padding: var(--section-y) 0;
  background: var(--color-bg);
}

/* ---- Perkenalan ---- */
.about__intro {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: start;
}

.about__tag {
  display: block;
  margin-bottom: 1.25rem;
  color: var(--color-primary);
}

.about__desc p {
  margin: 0 0 1.1rem;
  font-size: 1rem;
  line-height: 1.8;
  color: var(--color-text-soft);
  text-wrap: pretty;
  max-width: 40rem;
}

.about__desc .about__lead {
  font-family: var(--font-heading);
  font-size: clamp(1.3rem, 2.3vw, 1.6rem);
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.02em;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

.about__interests {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  margin-top: 1.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
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
  padding: 0.3rem 0.7rem;
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.04em;
  color: var(--color-text);
}

/* Kolom kanan: kutipan + fakta */
.about__side {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}

.about__quote {
  margin: 0;
  padding: 0.25rem 0 0.25rem 1.4rem;
  border-left: 2px solid var(--color-primary);
}

.about__quote blockquote {
  margin: 0 0 1rem;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.6rem, 2.6vw, 2.1rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--color-text);
  text-wrap: balance;
}

.about__facts {
  margin: 0;
  border-top: 1px solid var(--color-rule);
}

.about__fact {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  align-items: baseline;
  gap: 1rem;
  padding: 0.95rem 0;
  border-bottom: 1px solid var(--color-border);
}

.about__fact dt {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.about__fact dd {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.25rem 0.6rem;
  margin: 0;
}

.about__fact strong {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.about__fact span {
  font-size: 0.85rem;
  color: var(--color-text-soft);
}

/* ---- Kepala blok (keunggulan & tools) ---- */
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

/* ---- Keunggulan ---- */
.about__caps {
  margin-top: clamp(4rem, 8vw, 6rem);
}

.about__caps-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.about__cap {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 3.2fr) minmax(0, 5fr) minmax(0, 3fr);
  align-items: baseline;
  gap: 1rem 1.75rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.25s ease;
}

.about__cap:hover {
  background: var(--color-surface);
}

.about__cap-num {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--color-primary);
  padding-left: 0.25rem;
}

.about__cap-head {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.about__cap-icon {
  display: inline-grid;
  place-items: center;
  color: var(--color-text-soft);
  transform: translateY(2px);
}

.about__cap-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.2rem;
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
  gap: 0.35rem 1rem;
  margin: 0;
  padding: 0 0.25rem 0 0;
  list-style: none;
}

.about__cap-keys li {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  color: var(--color-text-soft);
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

.about__stack-count {
  margin: 0.45rem 0 0;
}

.about__stack-count strong {
  font-weight: 500;
  color: var(--color-text);
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
  color: var(--color-primary);
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

.about__tool-index {
  position: absolute;
  top: 0.5rem;
  right: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--color-text-soft);
  opacity: 0.7;
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

.about__tool-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.about__tool-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

.about__tool-cat {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

/* ---- Responsif ---- */
@media (max-width: 960px) {
  .about__intro {
    grid-template-columns: 1fr;
  }

  .about__cap {
    grid-template-columns: 3rem minmax(0, 1fr) minmax(0, 1.6fr);
  }

  .about__cap-keys {
    grid-column: 2 / -1;
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .about__cap {
    grid-template-columns: 2.5rem minmax(0, 1fr);
    gap: 0.6rem 0.75rem;
  }

  .about__cap-desc,
  .about__cap-keys {
    grid-column: 2;
  }

  .about__fact {
    grid-template-columns: 6rem minmax(0, 1fr);
  }

  .about__tools {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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

@media (prefers-reduced-motion: reduce) {
  .about__filter::after,
  .about__tool,
  .about__cap {
    transition: none;
  }
}
</style>
