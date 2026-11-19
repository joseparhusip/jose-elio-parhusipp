import { ref, watch } from 'vue'

const STORAGE_KEY = 'xmas'

function seasonOf(date = new Date()) {
  const month = date.getMonth()
  const day = date.getDate()
  if (month === 10 && day >= 15) return date.getFullYear()
  if (month === 11) return date.getFullYear()
  if (month === 0 && day <= 6) return date.getFullYear() - 1
  return null
}

function initialState() {
  const season = seasonOf()
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved && saved.season === season) return Boolean(saved.on)
  } catch {
    return season !== null
  }
  return season !== null
}

export const christmas = ref(initialState())

function apply(on) {
  document.documentElement.classList.toggle('is-christmas', on)
}

apply(christmas.value)

watch(christmas, (on) => {
  apply(on)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ on, season: seasonOf() }))
  } catch {
    return
  }
})

export function toggleChristmas() {
  christmas.value = !christmas.value
}
