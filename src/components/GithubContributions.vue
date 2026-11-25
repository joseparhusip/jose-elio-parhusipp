<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { vReveal } from '@/directives/reveal'
import { lang, t, LOCALES } from '@/composables/useLang'

const GithubSkyline = defineAsyncComponent(() => import('./GithubSkyline.vue'))

const USERNAME = 'joseparhusip'
const API_URL = '/api/github-contributions'
const FALLBACK_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}`
const PROFILE_URL = `https://github.com/${USERNAME}`
const FIRST_YEAR = 2024

const currentYear = new Date().getFullYear()
const ranges = [
  { key: 'last', label: { id: 'Setahun terakhir', en: 'Past 12 months', ja: '過去12か月' } },
  ...Array.from({ length: currentYear - FIRST_YEAR + 1 }, (_, i) => {
    const year = String(currentYear - i)
    return { key: year, label: year }
  }),
]

const MONTHS = {
  id: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
}
const DAY_LABELS = {
  id: ['', 'Sen', '', 'Rab', '', 'Jum', ''],
  en: ['', 'Mon', '', 'Wed', '', 'Fri', ''],
  ja: ['', '月', '', '水', '', '金', ''],
}
const locale = computed(() => LOCALES[lang.value])

const activeRange = ref('last')
const status = ref('loading')
const cache = new Map()
const data = ref(null)

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) throw new Error(url)
  const json = await res.json()
  if (!Array.isArray(json.contributions) || !json.contributions.length) throw new Error(url)
  return json
}

async function fetchContributions(key) {
  try {
    return await fetchJson(`${API_URL}?y=${key}`)
  } catch {
    return fetchJson(`${FALLBACK_URL}?y=${key}`)
  }
}

async function load(key) {
  activeRange.value = key

  if (cache.has(key)) {
    data.value = cache.get(key)
    status.value = 'ready'
    return
  }

  status.value = 'loading'
  try {
    const json = await fetchContributions(key)
    const result = {
      total: Object.values(json.total)[0] ?? 0,
      days: json.contributions,
    }
    cache.set(key, result)
    if (activeRange.value !== key) return
    data.value = result
    status.value = 'ready'
  } catch {
    if (activeRange.value === key) status.value = 'error'
  }
}

const rootEl = ref(null)
let loadObserver = null

onMounted(() => {
  loadObserver = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return
      loadObserver.disconnect()
      load('last')
      loadCoding()
    },
    { rootMargin: '400px' },
  )
  loadObserver.observe(rootEl.value)
})

onBeforeUnmount(() => loadObserver?.disconnect())

const coding = ref(null)
async function loadCoding() {
  try {
    const res = await fetch('/api/coding-time')
    if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) return
    const json = await res.json()
    if (json.mode === 'today' && typeof json.todaySeconds === 'number') coding.value = json
    else if (typeof json.totalSeconds === 'number' && json.totalSeconds > 0) coding.value = json
  } catch {
    coding.value = null
  }
}

function hoursOf(seconds) {
  return Math.floor(seconds / 3600)
}

function durationText(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return t({
    id: h ? `${h} jam ${m} mnt` : `${m} mnt`,
    en: h ? `${h}h ${m}m` : `${m}m`,
    ja: h ? `${h}時間${m}分` : `${m}分`,
  })
}

const codingTiles = computed(() => {
  const data = coding.value
  if (!data) return []
  if (data.mode === 'today') {
    const day = data.date
      ? new Date(`${data.date}T00:00:00`).toLocaleDateString(locale.value, { weekday: 'long', day: 'numeric', month: 'short' })
      : ''
    const tiles = [
      {
        key: 'total',
        label: t({ id: 'Ngoding hari ini', en: 'Coding today', ja: '今日のコーディング' }),
        value: data.todaySeconds ? durationText(data.todaySeconds) : '0m',
        sub: data.todaySeconds
          ? day
          : t({ id: 'belum mulai hari ini', en: 'not started yet today', ja: '今日はまだ開始前' }),
      },
    ]
    if (data.languages[0]) {
      tiles.push({
        key: 'lang',
        label: t({ id: 'Bahasa utama', en: 'Top language', ja: '主な言語' }),
        value: data.languages[0].name,
        sub: t({ id: `${data.languages[0].percent}% hari ini`, en: `${data.languages[0].percent}% today`, ja: `今日の${data.languages[0].percent}%` }),
      })
    }
    return tiles
  }
  const since = data.since
    ? new Date(data.since).toLocaleDateString(locale.value, { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
  const tiles = [
    {
      key: 'total',
      label: t({ id: 'Total ngoding', en: 'Time coding', ja: '総コーディング時間' }),
      value: t({
        id: `${hoursOf(data.totalSeconds).toLocaleString(locale.value)} jam`,
        en: `${hoursOf(data.totalSeconds).toLocaleString(locale.value)} hrs`,
        ja: `${hoursOf(data.totalSeconds).toLocaleString(locale.value)}時間`,
      }),
      sub: since ? t({ id: `sejak ${since}`, en: `since ${since}`, ja: `${since}から` }) : '',
    },
  ]
  if (data.dailyAverageSeconds) {
    tiles.push({
      key: 'average',
      label: t({ id: 'Rata-rata harian', en: 'Daily average', ja: '1日の平均' }),
      value: durationText(data.dailyAverageSeconds),
      sub: t({ id: '7 hari terakhir', en: 'last 7 days', ja: '直近7日間' }),
    })
  }
  if (data.bestDay) {
    tiles.push({
      key: 'bestday',
      label: t({ id: 'Hari terlama', en: 'Longest day', ja: '最長の日' }),
      value: durationText(data.bestDay.seconds),
      sub: new Date(`${data.bestDay.date}T00:00:00`).toLocaleDateString(locale.value, { day: 'numeric', month: 'short' }),
    })
  }
  return tiles
})

const weeks = computed(() => {
  if (!data.value) return []
  const days = data.value.days
  const firstDay = new Date(`${days[0].date}T00:00:00`).getDay()
  const cells = [...Array(firstDay).fill(null), ...days]
  const result = []
  for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7))
  return result
})

const monthLabels = computed(() => {
  const labels = []
  let lastMonth = -1
  weeks.value.forEach((week, index) => {
    const day = week.find(Boolean)
    if (!day) return
    const month = new Date(`${day.date}T00:00:00`).getMonth()
    if (month !== lastMonth) {
      if (!labels.length || index - labels[labels.length - 1].col >= 3) {
        labels.push({ col: index, text: t(MONTHS)[month] })
      }
      lastMonth = month
    }
  })
  return labels
})

const heading = computed(() => {
  if (!data.value) return ''
  const total = data.value.total.toLocaleString(locale.value)
  if (lang.value === 'en') {
    const noun = data.value.total === 1 ? 'contribution' : 'contributions'
    return activeRange.value === 'last'
      ? `${total} ${noun} in the last year`
      : `${total} ${noun} in ${activeRange.value}`
  }
  if (lang.value === 'ja') {
    return activeRange.value === 'last'
      ? `過去1年間のコントリビューション：${total}件`
      : `${activeRange.value}年のコントリビューション：${total}件`
  }
  return activeRange.value === 'last'
    ? `${total} kontribusi dalam setahun terakhir`
    : `${total} kontribusi di tahun ${activeRange.value}`
})

function formatDay(day) {
  const date = new Date(`${day.date}T00:00:00`).toLocaleDateString(locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  if (lang.value === 'en') {
    if (!day.count) return `No contributions on ${date}`
    return `${day.count} ${day.count === 1 ? 'contribution' : 'contributions'} on ${date}`
  }
  if (lang.value === 'ja') {
    return day.count ? `${date}：${day.count}件のコントリビューション` : `${date}：コントリビューションなし`
  }
  return day.count
    ? `${day.count} kontribusi pada ${date}`
    : `Tidak ada kontribusi pada ${date}`
}

const WEEKDAYS = {
  id: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  ja: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
}

const insights = computed(() => {
  if (!data.value) return null
  const days = data.value.days
  let longest = 0
  let run = 0
  let best = null
  const perWeekday = Array(7).fill(0)
  days.forEach((day) => {
    run = day.count ? run + 1 : 0
    longest = Math.max(longest, run)
    if (day.count && (!best || day.count > best.count)) best = day
    perWeekday[new Date(`${day.date}T00:00:00`).getDay()] += day.count
  })
  const topWeekday = perWeekday.indexOf(Math.max(...perWeekday))
  return {
    active: days.filter((day) => day.count).length,
    total: days.length,
    longest,
    best,
    weekday: perWeekday[topWeekday] ? topWeekday : null,
  }
})

const dayUnit = (n) => t({ id: 'hari', en: n === 1 ? 'day' : 'days', ja: '日' })

const counted = ref({ active: 0, longest: 0, best: 0 })
let countFrame = 0
const insightsEl = ref(null)
const insightsSeen = ref(false)
let insightsObserver = null

onMounted(() => {
  insightsObserver = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return
      insightsSeen.value = true
      insightsObserver.disconnect()
    },
    { threshold: 0.6 },
  )
  if (insightsEl.value) insightsObserver.observe(insightsEl.value)
})

onBeforeUnmount(() => insightsObserver?.disconnect())

watch([insights, insightsSeen], ([info, seen]) => {
  cancelAnimationFrame(countFrame)
  if (!info || !seen) return
  const target = { active: info.active, longest: info.longest, best: info.best?.count ?? 0 }
  const start = performance.now()
  const DURATION = 900
  const tick = (now) => {
    const p = Math.min(1, (now - start) / DURATION)
    const eased = 1 - Math.pow(1 - p, 3)
    counted.value = {
      active: Math.round(target.active * eased),
      longest: Math.round(target.longest * eased),
      best: Math.round(target.best * eased),
    }
    if (p < 1) countFrame = requestAnimationFrame(tick)
  }
  countFrame = requestAnimationFrame(tick)
})

onBeforeUnmount(() => cancelAnimationFrame(countFrame))

const insightTiles = computed(() => {
  const info = insights.value
  const dash = '—'
  const shortDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString(locale.value, { day: 'numeric', month: 'short' })
  return [
    {
      key: 'active',
      label: t({ id: 'Hari aktif', en: 'Active days', ja: 'アクティブ日数' }),
      value: info ? counted.value.active.toLocaleString(locale.value) : dash,
      sub: info ? t({ id: `dari ${info.total} hari`, en: `of ${info.total} days`, ja: `${info.total}日中` }) : '',
    },
    {
      key: 'streak',
      label: t({ id: 'Streak terpanjang', en: 'Longest streak', ja: '最長連続記録' }),
      value: info ? String(counted.value.longest) : dash,
      sub: info
        ? t({
            id: `${dayUnit(info.longest)} berturut-turut`,
            en: `${dayUnit(info.longest)} in a row`,
            ja: `${dayUnit(info.longest)}連続`,
          })
        : '',
    },
    {
      key: 'best',
      label: t({ id: 'Hari tersibuk', en: 'Busiest day', ja: '最も多かった日' }),
      value: info?.best ? String(counted.value.best) : dash,
      sub: info?.best
        ? t({
            id: `kontribusi · ${shortDate(info.best.date)}`,
            en: `contributions · ${shortDate(info.best.date)}`,
            ja: `件・${shortDate(info.best.date)}`,
          })
        : '',
    },
    {
      key: 'weekday',
      label: t({ id: 'Hari favorit', en: 'Favorite day', ja: 'よく活動する曜日' }),
      value: info && info.weekday !== null ? t(WEEKDAYS)[info.weekday] : dash,
      sub: info && info.weekday !== null ? t({ id: 'paling sering commit', en: 'most commits', ja: '最もコミットが多い' }) : '',
    },
  ]
})

const focusLevel = ref(null)
const todayKey = new Date().toLocaleDateString('en-CA')

function cellClass(day) {
  if (!day) return 'is-empty'
  return [
    `lv-${day.level}`,
    {
      'is-best': insights.value?.best?.date === day.date,
      'is-today': day.date === todayKey,
      'is-dim': focusLevel.value !== null && day.level !== focusLevel.value,
    },
  ]
}

const view = ref('2d')
const tooltip = ref(null)
const graphEl = ref(null)
const scrollEl = ref(null)

watch([data, view], async () => {
  await nextTick()
  if (scrollEl.value) scrollEl.value.scrollLeft = scrollEl.value.scrollWidth
})

function showTooltip(event, day) {
  if (!day || !graphEl.value) return
  const cell = event.currentTarget.getBoundingClientRect()
  const box = graphEl.value.getBoundingClientRect()
  tooltip.value = {
    day,
    x: cell.left - box.left + cell.width / 2,
    y: cell.top - box.top,
  }
}

function hideTooltip() {
  tooltip.value = null
}

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}
const canUse3d = ref(false)

onMounted(() => {
  canUse3d.value = hasWebGL()
  if (canUse3d.value) view.value = '3d'
})

function setView(value) {
  view.value = value
  hideTooltip()
}

function onSkylineHover(info) {
  tooltip.value = info
}

function onSkylineUnsupported() {
  canUse3d.value = false
  view.value = '2d'
}
</script>

<template>
  <div ref="rootEl" v-reveal="120" class="gh">
    <div class="gh__head">
      <div class="gh__title">
        <h3 class="gh__heading"><span class="gh__heading-num">03.1</span> {{ t({ id: 'Aktivitas GitHub', en: 'GitHub activity', ja: 'GitHubでの活動' }) }}</h3>
        <p class="gh__sub" aria-live="polite">
          <template v-if="status === 'ready'">{{ heading }}</template>
          <template v-else-if="status === 'loading'">{{ t({ id: 'Memuat kontribusi...', en: 'Loading contributions…', ja: 'コントリビューションを読み込み中…' }) }}</template>
          <template v-else>{{ t({ id: 'Kontribusi belum bisa dimuat.', en: 'Contributions could not be loaded.', ja: 'コントリビューションを読み込めませんでした。' }) }}</template>
        </p>
      </div>

      <div class="gh__tabs" role="tablist" :aria-label="t({ id: 'Pilih rentang waktu', en: 'Select time range', ja: '期間を選択' })">
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
          {{ t(range.label) }}
        </button>
      </div>
    </div>

    <dl v-if="status !== 'error'" ref="insightsEl" class="gh__insights" :class="{ 'is-loading': status !== 'ready' }">
      <div v-for="tile in insightTiles" :key="tile.key" class="gh__insight" :class="`gh__insight--${tile.key}`">
        <dt class="gh__insight-label">{{ tile.label }}</dt>
        <dd class="gh__insight-value">{{ tile.value }}</dd>
        <dd class="gh__insight-sub">{{ tile.sub }}</dd>
      </div>
    </dl>

    <section v-if="coding" class="gh__coding" :aria-label="t({ id: 'Waktu ngoding dari WakaTime', en: 'Coding time from WakaTime', ja: 'WakaTimeによるコーディング時間' })">
      <dl class="gh__coding-tiles">
        <div v-for="tile in codingTiles" :key="tile.key" class="gh__insight" :class="`gh__insight--${tile.key}`">
          <dt class="gh__insight-label">{{ tile.label }}</dt>
          <dd class="gh__insight-value">{{ tile.value }}</dd>
          <dd class="gh__insight-sub">{{ tile.sub }}</dd>
        </div>
      </dl>
      <div v-if="coding.languages.length" class="gh__coding-langs">
        <span class="gh__insight-label">{{ coding.mode === 'today'
          ? t({ id: 'Bahasa hari ini', en: 'Languages today', ja: '今日の言語' })
          : t({ id: 'Bahasa minggu ini', en: 'This week', ja: '今週の言語' }) }}</span>
        <div class="gh__coding-bar" aria-hidden="true">
          <span
            v-for="(lang, index) in coding.languages"
            :key="lang.name"
            :style="{ width: `${lang.percent}%`, '--tone': index }"
          ></span>
        </div>
        <ul class="gh__coding-list">
          <li v-for="(lang, index) in coding.languages" :key="lang.name" :style="{ '--tone': index }">
            {{ lang.name }} <span>{{ lang.percent }}%</span>
          </li>
        </ul>
      </div>
    </section>

    <div ref="graphEl" class="gh__graph" :class="{ 'is-loading': status === 'loading' }">
      <div v-if="status === 'error'" class="gh__error">
        <p>{{ t({ id: 'Coba muat ulang halaman, atau lihat langsung di profil GitHub saya.', en: 'Try reloading the page, or view my GitHub profile directly.', ja: 'ページを再読み込みするか、GitHubプロフィールを直接ご覧ください。' }) }}</p>
        <button type="button" class="gh__retry" @click="load(activeRange)">{{ t({ id: 'Coba lagi', en: 'Try again', ja: '再試行' }) }}</button>
      </div>

      <GithubSkyline
        v-else-if="view === '3d' && status === 'ready'"
        :weeks="weeks"
        :label="heading"
        @hover="onSkylineHover"
        @unsupported="onSkylineUnsupported"
      />

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
            <span v-for="(label, i) in t(DAY_LABELS)" :key="i">{{ label }}</span>
          </div>

          <div
            class="gh__grid"
            :class="{ 'is-ready': status === 'ready', 'is-focusing': focusLevel !== null }"
            role="img"
            :aria-label="heading || t({ id: 'Grafik kontribusi GitHub', en: 'GitHub contribution graph', ja: 'GitHubのコントリビューショングラフ' })"
          >
            <template v-if="status === 'ready'">
              <div v-for="(week, w) in weeks" :key="`${activeRange}-${w}`" class="gh__week" :style="{ '--w': w }">
                <span
                  v-for="(day, d) in week"
                  :key="d"
                  class="gh__cell"
                  :class="cellClass(day)"
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
        {{ formatDay(tooltip.day) }}
      </div>
    </div>

    <div class="gh__foot">
      <a :href="PROFILE_URL" class="gh__link" target="_blank" rel="noopener noreferrer">
        {{ t({ id: 'Lihat profil GitHub', en: 'View GitHub profile', ja: 'GitHubプロフィールを見る' }) }}
        <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </svg>
      </a>
      <div class="gh__foot-end">
      <div v-if="canUse3d" class="gh__view" role="group" :aria-label="t({ id: 'Tampilan grafik', en: 'Graph view', ja: 'グラフの表示' })">
        <button
          v-for="option in ['2d', '3d']"
          :key="option"
          type="button"
          class="gh__view-btn"
          :class="{ 'is-active': view === option }"
          :aria-pressed="view === option"
          @click="setView(option)"
        >
          {{ option.toUpperCase() }}
        </button>
      </div>
      <div class="gh__legend" :class="{ 'is-interactive': view === '2d' && status === 'ready' }" aria-hidden="true">
        <span>{{ t({ id: 'Sedikit', en: 'Less', ja: '少ない' }) }}</span>
        <span
          v-for="lv in 5"
          :key="lv"
          class="gh__cell"
          :class="[`lv-${lv - 1}`, { 'is-focused': focusLevel === lv - 1 }]"
          @mouseenter="view === '2d' && status === 'ready' && (focusLevel = lv - 1)"
          @mouseleave="focusLevel = null"
        ></span>
        <span>{{ t({ id: 'Banyak', en: 'More', ja: '多い' }) }}</span>
      </div>
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

.gh__insights {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0 0 1.75rem;
  border-top: 1px solid var(--color-rule);
  border-bottom: 1px solid var(--color-rule);
}

.gh__coding {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: 0 clamp(1rem, 3vw, 2.5rem);
  margin: -0.75rem 0 1.75rem;
  border-bottom: 1px solid var(--color-rule);
}

.gh__coding-tiles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
}

.gh__insight--lang .gh__insight-value {
  font-size: clamp(1.15rem, 1.9vw, 1.55rem);
  line-height: 1.25;
}

.gh__insight--total .gh__insight-value {
  color: var(--color-primary);
}

.gh__coding-langs {
  display: grid;
  align-content: center;
  gap: 0.55rem;
  padding: 0.85rem 0 0.95rem;
}

.gh__coding-bar {
  display: flex;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: var(--color-surface-soft);
}

.gh__coding-bar span,
.gh__coding-list li::before {
  background: color-mix(in srgb, var(--color-primary) calc(100% - var(--tone) * 22%), var(--color-surface-soft));
}

.gh__coding-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 0.9rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  color: var(--color-text);
}

.gh__coding-list li {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.gh__coding-list li::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 2px;
}

.gh__coding-list span {
  color: var(--color-text-soft);
}

@media (max-width: 720px) {
  .gh__coding {
    grid-template-columns: minmax(0, 1fr);
  }

  .gh__coding-tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.gh__insight {
  min-width: 0;
  padding: 0.85rem clamp(0.75rem, 2vw, 1.4rem) 0.95rem;
  border-left: 1px solid var(--color-rule);
}

.gh__insight:first-child {
  padding-left: 0;
  border-left: 0;
}

.gh__insight-label {
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.gh__insight-value {
  margin: 0.45rem 0 0;
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 2.6vw, 2.1rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gh__insight--streak .gh__insight-value,
.gh__insight--best .gh__insight-value {
  color: var(--color-accent);
}

.gh__insight--weekday .gh__insight-value {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--color-primary);
}

.gh__insight-sub {
  min-height: 1.1em;
  margin: 0.4rem 0 0;
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.04em;
  color: var(--color-text-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gh__insights.is-loading .gh__insight-value {
  color: var(--color-text-soft);
  animation: gh-pulse 1.4s ease-in-out infinite;
}

.gh__graph {
  position: relative;
  container-type: inline-size;
}

.gh__scroll {
  overflow-x: auto;
  padding: 4px 4px 0.35rem;
  scrollbar-width: thin;
}

.gh__calendar {
  --cell: clamp(11px, calc((100cqw - 3rem - (var(--weeks) - 1) * var(--gap)) / var(--weeks)), 18px);
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
  position: relative;
  width: var(--cell);
  height: var(--cell);
  border-radius: 2px;
  transition: transform 0.18s var(--ease-out), opacity 0.25s ease, box-shadow 0.2s ease;
}

.gh__grid .gh__cell:is(.lv-1, .lv-2, .lv-3, .lv-4) {
  box-shadow: inset 0 -1.5px 0 rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.14);
}

.gh__grid .gh__cell.lv-4 {
  box-shadow:
    inset 0 -1.5px 0 rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 0 9px -2px color-mix(in srgb, var(--color-accent) 75%, transparent);
}

.gh__grid.is-ready .gh__cell {
  animation: gh-pop 0.5s var(--ease-out) backwards;
  animation-delay: calc(var(--w, 0) * 12ms);
}

@keyframes gh-pop {
  from {
    opacity: 0;
    transform: scale(0.3);
  }
}

.gh__grid.is-ready .gh__cell:is(.lv-1, .lv-2, .lv-3, .lv-4) {
  animation:
    gh-pop 0.5s var(--ease-out) backwards,
    gh-shimmer 6s ease-in-out infinite;
  animation-delay:
    calc(var(--w, 0) * 12ms),
    calc(var(--w, 0) * 40ms + 1.4s);
}

@keyframes gh-shimmer {
  0%,
  9%,
  100% {
    filter: brightness(1);
  }
  4% {
    filter: brightness(1.55) saturate(1.15);
  }
}

@keyframes gh-fade {
  from {
    opacity: 0;
  }
}

@keyframes gh-ring-soft {
  50% {
    opacity: 0.3;
  }
}

.gh__grid .gh__cell:not(.is-empty):hover {
  z-index: 2;
  transform: scale(1.5);
  box-shadow:
    0 0 0 1.5px var(--color-bg),
    0 0 0 2.5px var(--color-text),
    0 4px 10px -2px rgba(0, 0, 0, 0.45);
}

.gh__cell.is-best::after {
  content: '';
  position: absolute;
  inset: -3px;
  border: 1.5px solid var(--color-accent);
  border-radius: 4px;
  animation: gh-ring 2.4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes gh-ring {
  50% {
    opacity: 0.35;
    transform: scale(1.15);
  }
}

.gh__cell.is-today {
  outline: 1.5px solid var(--color-text);
  outline-offset: 1px;
}

.gh__cell.is-dim {
  opacity: 0.15;
}

.gh__cell.is-dim::after {
  display: none;
}

.gh__cell.is-empty {
  visibility: hidden;
}

.lv-0 { background: var(--color-surface-soft); }
.lv-1 { background: color-mix(in srgb, var(--color-accent) 30%, var(--color-surface-soft)); }
.lv-2 { background: color-mix(in srgb, var(--color-accent) 55%, var(--color-surface-soft)); }
.lv-3 { background: color-mix(in srgb, var(--color-accent) 80%, var(--color-surface-soft)); }
.lv-4 { background: var(--color-accent); }

.gh__graph.is-loading .gh__grid {
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

.gh__foot-end {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
}

.gh__view {
  display: inline-flex;
  padding: 3px;
  border-radius: var(--radius-sm);
  background: var(--color-surface-soft);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.18);
}

.gh__view-btn {
  min-width: 2.6rem;
  min-height: 30px;
  padding: 0 0.6rem;
  border: 0;
  border-radius: calc(var(--radius-sm) - 2px);
  background: transparent;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
  cursor: pointer;
  transition: color 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.gh__view-btn:hover {
  color: var(--color-text);
}

.gh__view-btn.is-active {
  background: var(--btn-ghost-face), var(--color-surface);
  color: var(--color-text);
  box-shadow:
    inset 0 1px 0 var(--btn-highlight),
    0 2px 0 var(--btn-ghost-edge),
    0 7px 12px -7px var(--btn-ghost-shadow);
  transform: translateY(-1px);
}

.gh__view-btn:active {
  transform: translateY(1px);
  box-shadow: 0 0 0 var(--color-rule);
}

.gh__view-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.gh__legend {
  display: flex;
  align-items: center;
  gap: var(--gap);
  color: var(--color-text-soft);
}

.gh__legend.is-interactive .gh__cell {
  cursor: pointer;
  transition: transform 0.18s var(--ease-out), box-shadow 0.2s ease;
}

.gh__legend.is-interactive .gh__cell:hover,
.gh__legend .gh__cell.is-focused {
  transform: scale(1.35);
  box-shadow: 0 0 0 1.5px var(--color-bg), 0 0 0 2.5px var(--color-text);
}

.gh__legend span:first-child {
  margin-right: 0.35rem;
}

.gh__legend span:last-child {
  margin-left: 0.35rem;
}

@media (prefers-reduced-motion: reduce) {
  .gh__graph.is-loading .gh__grid,
  .gh__insights.is-loading .gh__insight-value {
    animation: none;
  }

  .gh__grid.is-ready .gh__cell {
    animation: gh-fade 0.6s ease backwards !important;
    animation-delay: calc(var(--w, 0) * 12ms) !important;
  }

  .gh__grid.is-ready .gh__cell:is(.lv-1, .lv-2, .lv-3, .lv-4) {
    animation:
      gh-fade 0.6s ease backwards,
      gh-shimmer 6s ease-in-out infinite !important;
    animation-delay:
      calc(var(--w, 0) * 12ms),
      calc(var(--w, 0) * 40ms + 1.4s) !important;
    animation-iteration-count: 1, infinite !important;
  }

  .gh__cell.is-best::after {
    animation: gh-ring-soft 2.4s ease-in-out infinite !important;
  }
}

@media (max-width: 640px) {
  .gh__insights {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .gh__insight:nth-child(3) {
    padding-left: 0;
    border-left: 0;
  }

  .gh__insight:nth-child(n + 3) {
    border-top: 1px solid var(--color-rule);
  }
}
</style>
