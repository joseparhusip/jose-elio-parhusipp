<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { lang, setLang, LANGS } from '@/composables/useLang'

const NAMES = { id: 'Bahasa Indonesia', en: 'English', ja: '日本語' }
const LABEL = 'Bahasa / Language / 言語'

const open = ref(false)
const rootEl = ref(null)
const buttonEl = ref(null)
const optionEls = ref([])
const menuEl = ref(null)
const menuLeft = ref(null)

function placeMenu() {
  if (!menuEl.value || !buttonEl.value) return
  const button = buttonEl.value.getBoundingClientRect()
  const width = menuEl.value.offsetWidth
  const edge = 12
  let left = button.width / 2 - width / 2
  const absolute = button.left + left
  if (absolute < edge) left += edge - absolute
  if (absolute + width > window.innerWidth - edge) left -= absolute + width - (window.innerWidth - edge)
  menuLeft.value = Math.round(left)
}

function focusOption(index) {
  const count = LANGS.length
  optionEls.value[(index + count) % count]?.focus()
}

async function openMenu() {
  open.value = true
  await nextTick()
  placeMenu()
  focusOption(LANGS.indexOf(lang.value))
}

function closeMenu(returnFocus = false) {
  if (!open.value) return
  open.value = false
  if (returnFocus) buttonEl.value?.focus()
}

function toggleMenu() {
  if (open.value) closeMenu()
  else openMenu()
}

function choose(code) {
  setLang(code)
  closeMenu(true)
}

function onOptionKeydown(event, index) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusOption(index + 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    focusOption(index - 1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    focusOption(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    focusOption(LANGS.length - 1)
  } else if (event.key === 'Tab') {
    closeMenu()
  }
}

function onButtonKeydown(event) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    openMenu()
  }
}

function onDocumentPointer(event) {
  if (open.value && rootEl.value && !rootEl.value.contains(event.target)) closeMenu()
}

function onDocumentKeydown(event) {
  if (open.value && event.key === 'Escape') {
    event.preventDefault()
    closeMenu(true)
  }
}

function onResize() {
  closeMenu()
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  document.addEventListener('pointerdown', onDocumentPointer)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  document.removeEventListener('pointerdown', onDocumentPointer)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>

<template>
  <div ref="rootEl" class="lang-pick" :class="{ 'is-open': open }">
    <button
      ref="buttonEl"
      type="button"
      class="lang-pick__button"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-label="`${LABEL}: ${NAMES[lang]}`"
      @click="toggleMenu"
      @keydown="onButtonKeydown"
    >
      <span class="lang-pick__code">{{ lang.toUpperCase() }}</span>
      <svg class="lang-pick__chevron" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
        <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <Transition name="lang-pick">
      <div
        v-if="open"
        ref="menuEl"
        class="lang-pick__menu"
        role="menu"
        :aria-label="LABEL"
        :style="menuLeft !== null ? { left: `${menuLeft}px` } : null"
      >
        <button
          v-for="(code, index) in LANGS"
          :key="code"
          :ref="(el) => (optionEls[index] = el)"
          type="button"
          role="menuitemradio"
          class="lang-pick__option"
          :class="{ 'is-active': lang === code }"
          :aria-checked="lang === code"
          :lang="code"
          @click="choose(code)"
          @keydown="onOptionKeydown($event, index)"
        >
          <span class="lang-pick__badge">{{ code.toUpperCase() }}</span>
          <span class="lang-pick__name">{{ NAMES[code] }}</span>
          <svg v-if="lang === code" class="lang-pick__check" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.lang-pick {
  position: relative;
  flex: none;
}

.lang-pick__button {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  height: 38px;
  padding: 0 0.7rem 2px 0.8rem;
  border: 1px solid var(--color-rule);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 var(--btn-highlight),
    0 3px 0 var(--btn-ghost-edge);
  transform: translateY(-1px);
  transition:
    transform 0.18s var(--ease-out),
    box-shadow 0.18s var(--ease-out),
    border-color 0.2s ease;
}

.lang-pick__button:active,
.lang-pick.is-open .lang-pick__button {
  transform: translateY(1px);
  box-shadow:
    inset 0 1px 0 var(--btn-highlight),
    0 1px 0 var(--btn-ghost-edge);
}

.lang-pick__button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.lang-pick__code {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.lang-pick__chevron {
  color: var(--color-text-soft);
  transition: rotate 0.25s var(--ease-out);
}

.lang-pick.is-open .lang-pick__chevron {
  rotate: 180deg;
}

.lang-pick__menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  z-index: 30;
  display: grid;
  gap: 4px;
  min-width: 232px;
  padding: 6px;
  border: 1px solid var(--color-rule);
  border-radius: 14px;
  background: var(--color-surface);
  box-shadow:
    inset 0 1px 0 var(--btn-highlight),
    0 4px 0 var(--btn-ghost-edge),
    0 22px 40px -18px rgba(0, 0, 0, 0.55);
  transform-origin: top center;
}

.lang-pick__option {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.7rem;
  min-height: 44px;
  padding: 0 0.7rem 0 0.55rem;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 0.92rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.18s ease;
}

.lang-pick__option:hover,
.lang-pick__option:focus-visible {
  outline: none;
  background: var(--color-surface-soft);
}

.lang-pick__option.is-active {
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.lang-pick__badge {
  display: grid;
  place-items: center;
  min-width: 34px;
  height: 26px;
  padding: 0 0.35rem 1px;
  border-radius: 7px;
  background: var(--color-surface-soft);
  color: var(--color-text-soft);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  box-shadow: 0 2px 0 var(--btn-ghost-edge);
}

.lang-pick__option.is-active .lang-pick__badge {
  background: var(--color-text);
  color: var(--color-bg);
  box-shadow: 0 2px 0 color-mix(in srgb, var(--color-text) 45%, var(--color-bg));
}

.lang-pick__name {
  font-weight: 500;
  white-space: nowrap;
}

.lang-pick__check {
  color: var(--color-primary);
}

.lang-pick-enter-active,
.lang-pick-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.22s var(--ease-out);
}

.lang-pick-enter-from,
.lang-pick-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}
</style>
