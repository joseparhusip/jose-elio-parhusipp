import { ref, watch } from 'vue'

try {
  localStorage.removeItem('xmas')
} catch {
}

export const christmas = ref(false)

function apply(on) {
  document.documentElement.classList.toggle('is-christmas', on)
}

apply(christmas.value)

watch(christmas, apply)

export function toggleChristmas() {
  christmas.value = !christmas.value
}
