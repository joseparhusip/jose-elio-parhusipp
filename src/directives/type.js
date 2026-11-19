import { watch } from 'vue'
import { loaderDone } from '@/composables/useLoaderState'

const CHAR_MS = 32
const MAX_TOTAL_MS = 1100
const START_DELAY = 120
const typedKeys = new Set()

let ready = loaderDone.value
const waiting = new Set()

if (!ready) {
  const stop = watch(loaderDone, (done) => {
    if (!done) return
    stop()
    ready = true
    waiting.forEach((fn) => fn())
    waiting.clear()
  })
}

function textNodesOf(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.data.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  })
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  return nodes
}

function prepare(el) {
  const parts = textNodesOf(el).map((node) => {
    const full = node.data
    const rest = document.createElement('span')
    rest.className = 'type-rest'
    rest.setAttribute('aria-hidden', 'true')
    rest.textContent = full
    node.data = ''
    node.after(rest)
    return { node, rest, full }
  })
  return { parts }
}

function finish(state) {
  state.parts.forEach(({ node, rest, full }) => {
    node.data = full
    rest.remove()
  })
}

function run(el, state) {
  const total = state.parts.reduce((sum, p) => sum + p.full.length, 0)
  const charMs = Math.min(CHAR_MS, MAX_TOTAL_MS / Math.max(1, total))
  let start = 0

  const tick = (now) => {
    if (!start) start = now
    const shown = Math.min(total, Math.floor((now - start) / charMs))
    let left = shown

    for (const p of state.parts) {
      const n = Math.max(0, Math.min(p.full.length, left))
      left -= p.full.length
      if (p.node.data.length !== n) {
        p.node.data = p.full.slice(0, n)
        p.rest.textContent = p.full.slice(n)
      }
    }

    if (shown < total) {
      el._typeFrame = requestAnimationFrame(tick)
    } else {
      finish(state)
    }
  }

  el._typeTimer = setTimeout(() => {
    el._typeFrame = requestAnimationFrame(tick)
  }, START_DELAY)
}

export const vType = {
  mounted(el, binding) {
    const key = binding.value || el.textContent.trim()
    if (typedKeys.has(key)) return

    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim())
    const state = prepare(el)

    const begin = () => {
      el._typeObserver = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return
          el._typeObserver.disconnect()
          typedKeys.add(key)
          run(el, state)
        },
        { threshold: 0.4, rootMargin: '0px 0px -10% 0px' },
      )
      el._typeObserver.observe(el)
    }

    el._typeState = state
    if (ready) begin()
    else waiting.add(begin)
  },

  unmounted(el) {
    el._typeObserver?.disconnect()
    cancelAnimationFrame(el._typeFrame)
    clearTimeout(el._typeTimer)
  },
}
