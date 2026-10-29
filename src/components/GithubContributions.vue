<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { vReveal } from '@/directives/reveal'

/* ---------------------------------------------------------
   Grafik kontribusi GitHub (seperti di halaman profil).
   Data diambil dari API publik yang membaca halaman kontribusi
   GitHub, jadi tidak perlu token. Hasil tiap tahun disimpan
   supaya pindah tab tidak memanggil API berulang kali.
--------------------------------------------------------- */
const USERNAME = 'joseparhusip'
const API_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}`
const PROFILE_URL = `https://github.com/${USERNAME}`
const FIRST_YEAR = 2024

const currentYear = new Date().getFullYear()
const ranges = [
  { key: 'last', label: 'Setahun terakhir' },
  ...Array.from({ length: currentYear - FIRST_YEAR + 1 }, (_, i) => {
    const year = String(currentYear - i)
    return { key: year, label: year }
  }),
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const DAY_LABELS = ['', 'Sen', '', 'Rab', '', 'Jum', '']

const activeRange = ref('last')
const status = ref('loading')
const cache = new Map()
const data = ref(null)

async function load(key) {
  activeRange.value = key

  if (cache.has(key)) {
    data.value = cache.get(key)
    status.value = 'ready'
    return
  }

  status.value = 'loading'
  try {
    const res = await fetch(`${API_URL}?y=${key}`)
    if (!res.ok) throw new Error('Gagal memuat kontribusi')
    const json = await res.json()
    const result = {
      total: Object.values(json.total)[0] ?? 0,
      days: json.contributions,
    }
    cache.set(key, result)
    // Abaikan respons lama kalau pengguna sudah pindah tab
    if (activeRange.value !== key) return
    data.value = result
    status.value = 'ready'
  } catch {
    if (activeRange.value === key) status.value = 'error'
  }
}

onMounted(() => load('last'))

// Susun hari ke dalam kolom minggu (Minggu di baris pertama, seperti GitHub)
const weeks = computed(() => {
  if (!data.value) return []
  const days = data.value.days
  const firstDay = new Date(`${days[0].date}T00:00:00`).getDay()
  const cells = [...Array(firstDay).fill(null), ...days]
  const result = []
  for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7))
  return result
})

// Label bulan muncul di minggu pertama tiap bulan baru
const monthLabels = computed(() => {
  const labels = []
  let lastMonth = -1
  weeks.value.forEach((week, index) => {
    const day = week.find(Boolean)
    if (!day) return
    const month = new Date(`${day.date}T00:00:00`).getMonth()
    if (month !== lastMonth) {
      // Lewati label yang terlalu mepet dengan label sebelumnya
      if (!labels.length || index - labels[labels.length - 1].col >= 3) {
        labels.push({ col: index, text: MONTHS[month] })
      }
      lastMonth = month
    }
  })
  return labels
})

const heading = computed(() => {
  if (!data.value) return ''
  const total = data.value.total.toLocaleString('id-ID')
  return activeRange.value === 'last'
    ? `${total} kontribusi dalam setahun terakhir`
    : `${total} kontribusi di tahun ${activeRange.value}`
})

function formatDay(day) {
  const date = new Date(`${day.date}T00:00:00`).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return day.count
    ? `${day.count} kontribusi pada ${date}`
    : `Tidak ada kontribusi pada ${date}`
}

/* ---- Tooltip saat kotak disorot ---- */
const tooltip = ref(null)
const graphEl = ref(null)
const scrollEl = ref(null)

// Di layar sempit grafik digeser ke ujung kanan supaya bulan terbaru langsung terlihat
watch(data, async () => {
  await nextTick()
  if (scrollEl.value) scrollEl.value.scrollLeft = scrollEl.value.scrollWidth
})

function showTooltip(event, day) {
  if (!day || !graphEl.value) return
  const cell = event.currentTarget.getBoundingClientRect()
  const box = graphEl.value.getBoundingClientRect()
  tooltip.value = {
    text: formatDay(day),
    x: cell.left - box.left + cell.width / 2,
    y: cell.top - box.top,
  }
}

function hideTooltip() {
  tooltip.value = null
}
</script>

<template>
  <div v-reveal="120" class="gh">
    <div class="gh__head">
      <div class="gh__title">
        <h3 class="gh__heading"><span class="gh__heading-num">03.1</span> Aktivitas GitHub</h3>
        <p class="gh__sub" aria-live="polite">
          <template v-if="status === 'ready'">{{ heading }}</template>
          <template v-else-if="status === 'loading'">Memuat kontribusi...</template>
          <template v-else>Kontribusi belum bisa dimuat.</template>
        </p>
      </div>

      <div class="gh__tabs" role="tablist" aria-label="Pilih rentang waktu">
        <button
          v-for="range in ranges"
          :key="range.key"
          type="button"
          role="tab"
          class="gh__tab"
          :class="{ 'is-active': activeRange === range.key }"
          :aria-selected="activeRange === range.key"
          @click="load(range.key)"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <div ref="graphEl" class="gh__graph" :class="{ 'is-loading': status === 'loading' }">
      <div v-if="status === 'error'" class="gh__error">
        <p>Coba muat ulang halaman, atau lihat langsung di profil GitHub saya.</p>
        <button type="button" class="gh__retry" @click="load(activeRange)">Coba lagi</button>
      </div>

      <div v-else ref="scrollEl" class="gh__scroll">
        <div class="gh__calendar" :style="{ '--weeks': weeks.length || 53 }">
          <div class="gh__months" aria-hidden="true">
            <span
              v-for="label in monthLabels"
              :key="label.col"
              class="gh__month"
              :style="{ gridColumn: label.col + 1 }"
            >
              {{ label.text }}
            </span>
          </div>

          <div class="gh__days" aria-hidden="true">
            <span v-for="(label, i) in DAY_LABELS" :key="i">{{ label }}</span>
          </div>

          <div class="gh__grid" role="img" :aria-label="heading || 'Grafik kontribusi GitHub'">
            <template v-if="status === 'ready'">
              <div v-for="(week, w) in weeks" :key="w" class="gh__week">
                <span
                  v-for="(day, d) in week"
                  :key="d"
                  class="gh__cell"
                  :class="day ? `lv-${day.level}` : 'is-empty'"
                  @mouseenter="showTooltip($event, day)"
                  @mouseleave="hideTooltip"
                ></span>
              </div>
            </template>
            <template v-else>
              <div v-for="w in 53" :key="w" class="gh__week">
                <span v-for="d in 7" :key="d" class="gh__cell lv-0"></span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div
        v-if="tooltip"
        class="gh__tooltip"
        :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
        aria-hidden="true"
      >
        {{ tooltip.text }}
      </div>
    </div>

    <div class="gh__foot">
      <a :href="PROFILE_URL" class="gh__link" target="_blank" rel="noopener noreferrer">
        Lihat profil GitHub
        <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </svg>
      </a>
      <div class="gh__legend" aria-hidden="true">
        <span>Sedikit</span>
        <span v-for="lv in 5" :key="lv" class="gh__cell" :class="`lv-${lv - 1}`"></span>
        <span>Banyak</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gh {
  --cell: 11px;
  --gap: 3px;
  margin-top: clamp(3.5rem, 7vw, 5rem);
  padding-top: 1.1rem;
  border-top: 1px solid var(--color-rule);
}

.gh__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem 2rem;
  margin-bottom: 1.75rem;
}

.gh__heading {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text);
}

.gh__heading-num {
  color: var(--color-text-soft);
}

.gh__heading-num::before {
  content: '(';
}

.gh__heading-num::after {
  content: ')';
}

.gh__sub {
  margin: 0.6rem 0 0;
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 2.2vw, 1.6rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.15;
  color: var(--color-text);
}

/* Tab rentang: teks bergaris bawah */
.gh__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
}

.gh__tab {
  position: relative;
  padding: 0.35rem 0;
  border: 0;
  background: none;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.04em;
  color: var(--color-text-soft);
  cursor: pointer;
  transition: color 0.2s ease;
}

.gh__tab::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--color-text);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease-out);
}

.gh__tab:hover {
  color: var(--color-text);
}

.gh__tab.is-active {
  color: var(--color-text);
}

.gh__tab.is-active::after {
  transform: scaleX(1);
}

.gh__tab:focus-visible,
.gh__retry:focus-visible,
.gh__link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* ---- Grafik ---- */
.gh__graph {
  position: relative;
}

.gh__scroll {
  overflow-x: auto;
  padding-bottom: 0.35rem;
  scrollbar-width: thin;
}

.gh__calendar {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 0.6rem;
  row-gap: 0.45rem;
  width: max-content;
  margin-inline: auto;
}

.gh__months {
  grid-column: 2;
  display: grid;
  grid-template-columns: repeat(var(--weeks), var(--cell));
  column-gap: var(--gap);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  color: var(--color-text-soft);
}

.gh__month {
  white-space: nowrap;
}

.gh__days {
  grid-column: 1;
  grid-row: 2;
  display: grid;
  grid-template-rows: repeat(7, var(--cell));
  row-gap: var(--gap);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  line-height: var(--cell);
  color: var(--color-text-soft);
}

.gh__grid {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  gap: var(--gap);
}

.gh__week {
  display: grid;
  grid-template-rows: repeat(7, var(--cell));
  gap: var(--gap);
}

.gh__cell {
  width: var(--cell);
  height: var(--cell);
  border-radius: 2px;
}

.gh__cell.is-empty {
  visibility: hidden;
}

/* Skala warna memakai warna aksen (hijau sinyal), mirip nuansa hijau GitHub */
.lv-0 { background: var(--color-surface-soft); }
.lv-1 { background: color-mix(in srgb, var(--color-accent) 30%, var(--color-surface-soft)); }
.lv-2 { background: color-mix(in srgb, var(--color-accent) 55%, var(--color-surface-soft)); }
.lv-3 { background: color-mix(in srgb, var(--color-accent) 80%, var(--color-surface-soft)); }
.lv-4 { background: var(--color-accent); }

.gh__graph.is-loading .gh__cell {
  animation: gh-pulse 1.4s ease-in-out infinite;
}

@keyframes gh-pulse {
  50% { opacity: 0.45; }
}

.gh__tooltip {
  position: absolute;
  z-index: 5;
  padding: 0.35rem 0.6rem;
  border-radius: var(--radius-sm);
  background: var(--color-text);
  color: var(--color-bg);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  white-space: nowrap;
  pointer-events: none;
  transform: translate(-50%, calc(-100% - 6px));
}

.gh__error {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.5rem 0;
  font-size: 0.9rem;
  color: var(--color-text-soft);
}

.gh__error p {
  margin: 0;
}

.gh__retry {
  min-height: 38px;
  padding: 0 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-rule);
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
}

.gh__retry:hover {
  border-color: var(--color-text);
}

.gh__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1.1rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
}

.gh__link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text);
  text-decoration: none;
}

.gh__link:hover {
  color: var(--color-primary);
}

.gh__legend {
  display: flex;
  align-items: center;
  gap: var(--gap);
  color: var(--color-text-soft);
}

.gh__legend span:first-child {
  margin-right: 0.35rem;
}

.gh__legend span:last-child {
  margin-left: 0.35rem;
}

@media (prefers-reduced-motion: reduce) {
  .gh__graph.is-loading .gh__cell {
    animation: none;
  }
}
</style>
