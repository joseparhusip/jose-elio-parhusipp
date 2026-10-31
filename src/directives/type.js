import { watch } from 'vue'
import { loaderDone } from '@/composables/useLoaderState'

/* ---------------------------------------------------------
   v-type: judul "diketik" huruf demi huruf saat pertama kali terlihat.

   Cara pakai:
     <h2 v-type="'tentang'">Saya membangun <span class="serif-accent">analitis</span></h2>
     Nilainya (string) adalah kunci unik judul.

   Perilaku:
   - Mengetik SEKALI per muat halaman (hanya maju, tidak dihapus balik).
     Kunci yang sudah diketik disimpan di level modul, jadi kalau komponen
     dipasang ulang (pindah halaman lalu kembali) judul langsung tampil
     utuh. Baru mengetik lagi setelah halaman di-reload.
   - Struktur di dalam judul tetap utuh (span biru, garis bawah, angka
     catatan kaki): yang diubah hanya isi teksnya.
   - Tidak menggeser layout: huruf yang belum diketik tetap memakan
     tempat tapi tidak terlihat (visibility: hidden), jadi tinggi judul
     sudah benar sejak awal dan konten di bawahnya tidak naik-turun.
   - Tanpa kursor "|": garis tegak yang menempel di huruf bertangkai
     (i, l, t, f) terlihat seperti dua garis "||".
   - Pembaca layar membaca kalimat lengkap lewat aria-label.
   - Tetap jalan walau "kurangi animasi" aktif: yang berubah hanya teks,
     tidak ada elemen yang bergerak (sama seperti teks peran di hero).
--------------------------------------------------------- */

const CHAR_MS = 32 // jeda per huruf
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

// Kumpulkan semua node teks yang berisi huruf, berurutan
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
  let start = 0

  const tick = (now) => {
    if (!start) start = now
    const shown = Math.min(total, Math.floor((now - start) / CHAR_MS))
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
        // Mulai saat judul sudah cukup masuk layar (bukan baru mengintip)
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
