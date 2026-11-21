import { watch, onBeforeUnmount } from 'vue'

let locks = 0

function lock() {
  locks += 1
  if (locks > 1) return
  const root = document.documentElement
  const gap = window.innerWidth - root.clientWidth
  root.style.overflow = 'hidden'
  root.style.overscrollBehavior = 'none'
  if (gap > 0) root.style.paddingRight = `${gap}px`
}

function unlock() {
  if (locks === 0) return
  locks -= 1
  if (locks > 0) return
  const root = document.documentElement
  root.style.overflow = ''
  root.style.overscrollBehavior = ''
  root.style.paddingRight = ''
}

export function useScrollLock(source) {
  let held = false
  const set = (on) => {
    if (on && !held) {
      held = true
      lock()
    } else if (!on && held) {
      held = false
      unlock()
    }
  }
  watch(source, (value) => set(Boolean(value)), { immediate: true })
  onBeforeUnmount(() => set(false))
}
