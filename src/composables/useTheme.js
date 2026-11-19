import { ref, watch } from 'vue'

const STORAGE_KEY = 'theme'

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
  }
  return 'dark'
}

const theme = ref(getInitialTheme())

function applyTheme(value) {
  document.documentElement.setAttribute('data-theme', value)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', value === 'light' ? '#F4F4F1' : '#0E0F11')
}

if (typeof document !== 'undefined') {
  applyTheme(theme.value)
  watch(theme, (v) => {
    applyTheme(v)
    try {
      localStorage.setItem(STORAGE_KEY, v)
    } catch {
    }
  })
}

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  return { theme, toggleTheme }
}
