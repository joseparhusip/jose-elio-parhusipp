<script setup>
import { ref, computed, onMounted } from 'vue'
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
        <span class="gh__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.27 7.78 10.77.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.16.69-3.83-1.52-3.83-1.52-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.16a10.9 10.9 0 0 1 5.74 0c2.19-1.47 3.15-1.16 3.15-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.66 5.31-5.19 5.59.41.35.77 1.04.77 2.1 0 1.51-.01 2.73-.01 3.1 0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z" />
          </svg>
        </span>
        <div>
          <h3 class="gh__heading">Aktivitas GitHub</h3>
          <p class="gh__sub" aria-live="polite">
            <template v-if="status === 'ready'">{{ heading }}</template>
            <template v-else-if="status === 'loading'">Memuat kontribusi...</template>
            <template v-else>Kontribusi belum bisa dimuat.</template>
          </p>
        </div>
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

      <div v-else class="gh__scroll">
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
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  padding: clamp(1.1rem, 2.5vw, 1.6rem);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  box-shadow: var(--shadow-card);
}

.gh__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 1.5rem;
  margin-bottom: 1.25rem;
}

.gh__title {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.gh__icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--color-surface-soft);
  color: var(--color-text);
}

.gh__icon svg {
  width: 22px;
  height: 22px;
}

.gh__heading {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
}

.gh__sub {
  margin: 0.15rem 0 0;
  font-size: 0.86rem;
  color: var(--color-text-soft);
}

.gh__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.gh__tab {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-soft);
  cursor: pointer;
  transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease;
}

.gh__tab:hover {
  border-color: var(--color-text-soft);
  color: var(--color-text);
}

.gh__tab.is-active {
  border-color: var(--color-text);
  background: var(--color-text);
  color: var(--color-bg);
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
  column-gap: 0.5rem;
  row-gap: 0.4rem;
  width: max-content;
  margin-inline: auto;
}

.gh__months {
  grid-column: 2;
  display: grid;
  grid-template-columns: repeat(var(--weeks), var(--cell));
  column-gap: var(--gap);
  font-size: 0.72rem;
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
  font-size: 0.68rem;
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
  border-radius: 3px;
  outline: 1px solid rgba(127, 127, 127, 0.08);
  outline-offset: -1px;
}

.gh__cell.is-empty {
  visibility: hidden;
}

/* Skala warna memakai warna aksen (toska), mirip nuansa hijau GitHub */
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
  border-radius: 8px;
  background: var(--color-text);
  color: var(--color-bg);
  font-size: 0.74rem;
  font-weight: 500;
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
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
}

.gh__retry:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.gh__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1rem;
}

.gh__link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-accent);
  text-decoration: none;
}

.gh__link:hover {
  text-decoration: underline;
}

.gh__legend {
  display: flex;
  align-items: center;
  gap: var(--gap);
  font-size: 0.72rem;
  color: var(--color-text-soft);
}

.gh__legend span:first-child {
  margin-right: 0.3rem;
}

.gh__legend span:last-child {
  margin-left: 0.3rem;
}

@media (prefers-reduced-motion: reduce) {
  .gh__graph.is-loading .gh__cell {
    animation: none;
  }
}

@media (max-width: 640px) {
  .gh__tabs {
    width: 100%;
  }
}
</style>
