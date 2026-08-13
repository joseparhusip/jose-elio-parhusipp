<script setup>
import figmaIcon from './icons/icons-about/Figma-logo.svg'
import flutterIcon from './icons/icons-about/lockup_flutter_horizontal.svg'
import powerBiIcon from './icons/icons-about/New_Power_BI_Logo.svg'
import pythonIcon from './icons/icons-about/Python-logo-notext.svg'
import reactIcon from './icons/icons-about/React-icon.svg'
import streamlitIcon from './icons/icons-about/Streamlit.svg'
import vueIcon from './icons/icons-about/Vue.js_Logo_2.svg'

const highlights = [
  {
    title: 'Full-stack & mobile',
    desc: 'Terbiasa membangun aplikasi end-to-end, dari frontend, backend, sampai database, untuk web maupun mobile dengan Flutter.',
  },
  {
    title: 'Analitis & terstruktur',
    desc: 'Berpengalaman sebagai System Analyst — merancang ERD, UML, dan flowchart, serta mengelola jadwal dan anggaran proyek.',
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
]
</script>

<template>
  <section id="tentang" class="about">
    <div class="about__inner">
      <div class="about__visual">
        <div class="about__blob"></div>
        <div class="about__quote">
          <p class="about__quote-text">
            "Solusi terbaik lahir dari data yang dipahami dan desain yang dirasakan."
          </p>
        </div>
      </div>

      <div class="about__content">
        <span class="about__eyebrow">Tentang Saya</span>

        <h2 class="about__title">
          Menghubungkan data, desain, dan kode jadi satu solusi
        </h2>

        <p class="about__desc">
          Saya Jose, mahasiswa Bisnis Digital semester akhir di Universitas
          Logistik dan Bisnis Internasional (ULBI) Bandung. Saya punya minat
          besar pada pengolahan data serta pengembangan website dan aplikasi
          mobile — mulai dari mengolah basis data dengan Google Colab,
          merancang sistem e-commerce dengan integrasi Midtrans dan
          RajaOngkir, sampai membangun aplikasi mobile dengan Flutter dan
          Dart. Saya terbiasa bekerja terstruktur, berpikir analitis, dan
          nyaman berkolaborasi dalam tim.
        </p>

        <ul class="about__highlights">
          <li v-for="item in highlights" :key="item.title" class="about__highlight">
            <span class="about__highlight-icon">✓</span>
            <div>
              <h3 class="about__highlight-title">{{ item.title }}</h3>
              <p class="about__highlight-desc">{{ item.desc }}</p>
            </div>
          </li>
        </ul>

        <div class="about__tools">
          <span class="about__tools-label">Yang saya kuasai</span>
          <ul class="about__tools-list">
            <li
              v-for="tool in tools"
              :key="tool.name"
              class="about__tools-item"
              :title="tool.name"
            >
              <img
                :src="tool.icon"
                :alt="tool.name"
                class="about__tools-icon"
                loading="lazy"
                width="32"
                height="32"
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
  font-family: 'Stack Sans Text', sans-serif;
  font-style: italic;
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--color-text, #253632);
}

.about__eyebrow {
  display: inline-flex;
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary-dark, #4f7566);
  background: var(--color-mint, #cfe3dd);
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
}

.about__title {
  font-family: 'Stack Sans Text', sans-serif;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  line-height: 1.25;
  font-weight: 600;
  color: var(--color-text, #253632);
  margin: 1.1rem 0 1rem;
  letter-spacing: -0.01em;
}

.about__desc {
  font-family: 'Stack Sans Text', sans-serif;
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
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text, #253632);
}

.about__highlight-desc {
  margin: 0;
  font-family: 'Stack Sans Text', sans-serif;
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
  font-family: 'Stack Sans Text', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-soft, #5c6f69);
  margin-bottom: 0.9rem;
}

.about__tools-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
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
}

@media (max-width: 900px) {
  .about__inner {
    grid-template-columns: 1fr;
  }

  .about__visual {
    order: -1;
    min-height: 260px;
  }
}

@media (max-width: 480px) {
  .about {
    padding: 3.5rem 1.25rem;
  }
}
</style>
