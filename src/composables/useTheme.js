import { ref, watch } from 'vue'

const STORAGE_KEY = 'theme'

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // localStorage tidak tersedia (mis. mode privat) -> pakai default
  }
  // Default: dark (tema asli website). Ganti ke matchMedia kalau mau ikut sistem.
  return 'dark'
}

// state global (satu instance dipakai semua komponen)
const theme = ref(getInitialTheme())

function applyTheme(value) {
  document.documentElement.setAttribute('data-theme', value)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', value === 'light' ? '#F4F6FB' : '#0B0E17')
}

if (typeof document !== 'undefined') {
  applyTheme(theme.value)
  watch(theme, (v) => {
    applyTheme(v)
    try {
      localStorage.setItem(STORAGE_KEY, v)
    } catch {
      // gagal menyimpan (storage penuh/diblokir) -> abaikan, tema tetap jalan
    }
  })
}

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  return { theme, toggleTheme }
}
