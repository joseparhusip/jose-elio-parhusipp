<script setup>
import { christmas, toggleChristmas } from '@/composables/useChristmas'
import { t } from '@/composables/useLang'
</script>

<template>
  <button
    type="button"
    class="xmas-toggle"
    :class="{ 'is-on': christmas }"
    role="switch"
    :aria-checked="christmas"
    :aria-label="t({ id: 'Tema Natal', en: 'Holiday theme', ja: 'クリスマス演出' })"
    :title="
      christmas
        ? t({ id: 'Matikan tema Natal', en: 'Turn off holiday theme', ja: 'クリスマス演出をオフにする' })
        : t({ id: 'Nyalakan tema Natal', en: 'Turn on holiday theme', ja: 'クリスマス演出をオンにする' })
    "
    @click="toggleChristmas"
  >
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5" />
        <path d="m9.5 3.8 2.5 2.2 2.5-2.2M9.5 20.2l2.5-2.2 2.5 2.2" />
        <path d="m3.6 10.4 3.2.9-.7 3.3M20.4 13.6l-3.2-.9.7-3.3" />
        <path d="m5.4 4.6.7 3.3-3.2.9M18.6 19.4l-.7-3.3 3.2-.9" />
      </g>
    </svg>
  </button>
</template>

<style scoped>
.xmas-toggle {
  --size: 38px;
  position: relative;
  flex: none;
  display: grid;
  place-items: center;
  width: var(--size);
  height: var(--size);
  padding: 0 0 2px;
  border: 1px solid var(--color-rule);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-soft);
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 var(--btn-highlight),
    0 3px 0 var(--btn-ghost-edge);
  transform: translateY(-1px);
  transition:
    transform 0.18s var(--ease-out),
    box-shadow 0.18s var(--ease-out),
    color 0.25s ease,
    background-color 0.25s ease;
}

.xmas-toggle:hover {
  color: var(--color-text);
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 var(--btn-highlight),
    0 4px 0 var(--btn-ghost-edge);
}

.xmas-toggle:active {
  transform: translateY(1px);
  box-shadow: 0 1px 0 var(--btn-ghost-edge);
}

.xmas-toggle.is-on {
  border-color: transparent;
  background: linear-gradient(180deg, #e0303f, #b51d2b);
  color: #fff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    0 3px 0 #7d121c,
    0 8px 16px -8px rgba(200, 32, 47, 0.8);
}

.xmas-toggle.is-on svg {
  animation: xmas-spin 6s linear infinite;
}

.xmas-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

@keyframes xmas-spin {
  to {
    rotate: 360deg;
  }
}

@media (prefers-reduced-motion: reduce) {
  .xmas-toggle.is-on svg {
    animation: none;
  }
}

@media (max-width: 400px) {
  .xmas-toggle {
    --size: 34px;
  }
}
</style>
