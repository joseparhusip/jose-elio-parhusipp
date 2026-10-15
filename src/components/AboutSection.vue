<script setup>
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

const facts = [
  { label: 'Pendidikan', value: 'S1 Bisnis Digital', sub: 'ULBI Bandung' },
  { label: 'IPK', value: '3,75', sub: 'dari 4,00' },
  { label: 'Sertifikasi', value: 'SAP', sub: 'Certified' },
]

// Dua baris marquee bergerak berlawanan arah
const half = Math.ceil(tools.length / 2)
// Tiap baris diisi 2x agar cukup panjang untuk layar lebar (1440px ke atas)
const toolRows = [tools.slice(0, half), tools.slice(half)].map((row) =>
  [...row, ...row].map((tool, i) => ({ ...tool, key: `${tool.name}-${i}`, dup: i >= row.length })),
)

// Proteksi gambar: cegah klik kanan (save as) & drag gambar keluar dari halaman
function preventImageAction(event) {
  event.preventDefault()
  return false
}
</script>

<template>
  <section id="tentang" class="about">
    <div class="container">
      <div class="about__top">
        <div class="about__intro">
          <span class="section-label" v-reveal
            ><span class="section-label__num">01</span>Tentang Saya</span
          >

          <h2 class="section-title" v-reveal="80">
            Menghubungkan <span class="serif-accent">data</span>, desain, dan kode jadi satu solusi
          </h2>

          <div class="about__desc" v-reveal="160">
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
        </div>

        <aside class="about__side">
          <figure class="about__quote" v-reveal.right="120">
            <span class="about__quote-mark" aria-hidden="true">&ldquo;</span>
            <blockquote>
              Solusi terbaik lahir dari data yang dipahami dan desain yang dirasakan.
            </blockquote>
            <figcaption>Prinsip kerja saya</figcaption>
          </figure>

          <dl class="about__facts" v-reveal.right="220">
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

      <ul class="about__highlights">
        <li
          v-for="(item, index) in highlights"
          :key="item.title"
          class="about__highlight"
          v-reveal="index * 100"
        >
          <span class="about__highlight-num">0{{ index + 1 }}</span>
          <h3 class="about__highlight-title">{{ item.title }}</h3>
          <p class="about__highlight-desc">{{ item.desc }}</p>
        </li>
      </ul>
    </div>

    <div class="about__tools" v-reveal>
      <div class="container">
        <span class="about__tools-label">Tools &amp; teknologi yang saya kuasai</span>
      </div>

      <div class="about__marquees">
        <div
          v-for="(row, rowIndex) in toolRows"
          :key="rowIndex"
          class="about__marquee"
          :class="{ 'about__marquee--reverse': rowIndex === 1 }"
        >
          <!-- Isi diulang 2x supaya geraknya menyambung tanpa jeda -->
          <ul v-for="copy in 2" :key="copy" class="about__marquee-track" :aria-hidden="copy === 2">
            <li
              v-for="tool in row"
              :key="tool.key"
              class="about__tool"
              :class="{ 'about__tool--dup': tool.dup }"
              oncontextmenu="return false"
              @contextmenu.prevent="preventImageAction"
            >
              <span class="about__tool-icon">
                <img
                  :src="tool.icon"
                  :alt="copy === 1 ? tool.name : ''"
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

.about__top {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: start;
}

.about__desc {
  margin-top: 1.5rem;
  max-width: 40rem;
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

/* ---- Sisi kanan: kutipan + fakta ---- */
.about__side {
  display: grid;
  gap: 1rem;
  padding-top: 2.4rem;
}

.about__quote {
  position: relative;
  margin: 0;
  padding: 2rem 1.8rem 1.6rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background:
    radial-gradient(120% 90% at 100% 0%, var(--color-primary-soft), transparent 60%),
    var(--color-bg);
  overflow: hidden;
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

.about__quote blockquote {
  position: relative;
  margin: 0;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.5rem, 2.4vw, 1.9rem);
  line-height: 1.25;
  color: var(--color-text);
  text-wrap: balance;
}

.about__quote figcaption {
  margin-top: 1.2rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.about__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  margin: 0;
}

.about__fact {
  padding: 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
}

.about__fact dt {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.about__fact dd {
  display: grid;
  margin: 0.5rem 0 0;
}

.about__fact strong {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-text);
}

.about__fact span {
  font-size: 0.78rem;
  color: var(--color-text-soft);
}

/* ---- Tiga keunggulan ---- */
.about__highlights {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  list-style: none;
  margin: clamp(3rem, 6vw, 4.5rem) 0 0;
  padding: 0;
}

.about__highlight {
  position: relative;
  padding: 1.6rem 1.5rem 1.7rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  transition:
    border-color 0.3s ease,
    transform 0.35s var(--ease-out);
}

.about__highlight.reveal-done:hover {
  border-color: color-mix(in srgb, var(--color-primary) 55%, transparent);
  transform: translateY(-4px);
}

.about__highlight-num {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--color-primary);
}

.about__highlight-title {
  margin: 2.2rem 0 0.5rem;
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.about__highlight-desc {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--color-text-soft);
}

/* ---- Marquee tools ---- */
.about__tools {
  margin-top: clamp(3.5rem, 7vw, 5rem);
}

.about__tools-label {
  display: block;
  margin-bottom: 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.about__marquee {
  display: flex;
  overflow: hidden;
  padding: 0.35rem 0;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.about__marquee-track {
  display: flex;
  flex-shrink: 0;
  gap: 0.75rem;
  margin: 0;
  padding: 0 0.375rem;
  list-style: none;
  animation: about-marquee 38s linear infinite;
}

.about__marquee--reverse .about__marquee-track {
  animation-direction: reverse;
}

.about__marquee:hover .about__marquee-track {
  animation-play-state: paused;
}

@keyframes about-marquee {
  to {
    transform: translateX(-100%);
  }
}

.about__tool {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.55rem 1.1rem 0.55rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  white-space: nowrap;
}

.about__tool-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #fff; /* logo asli (warna-warni) paling jelas di atas putih */
}

.about__tool-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.about__tool-name {
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--color-text);
}

/* Kalau animasi dimatikan di pengaturan OS (Windows: "Animation effects" off),
   marquee diganti jadi susunan chip rapi yang diam, tanpa duplikat. */
@media (prefers-reduced-motion: reduce) {
  .about__marquees {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    max-width: var(--container);
    margin-inline: auto;
    padding-inline: var(--gutter);
    box-sizing: border-box;
  }

  .about__marquee,
  .about__marquee-track {
    display: contents;
  }

  .about__marquee-track[aria-hidden='true'],
  .about__tool--dup {
    display: none;
  }
}

/* ---- Tablet ---- */
@media (max-width: 960px) {
  .about__top {
    grid-template-columns: 1fr;
  }

  .about__side {
    padding-top: 0;
  }

  .about__highlights {
    grid-template-columns: 1fr;
  }

  .about__highlight-title {
    margin-top: 1rem;
  }
}

/* ---- HP ---- */
@media (max-width: 480px) {
  .about__facts {
    grid-template-columns: 1fr 1fr;
  }

  .about__fact:first-child {
    grid-column: 1 / -1;
  }

  .about__quote {
    padding: 1.6rem 1.4rem 1.4rem;
  }
}
</style>
