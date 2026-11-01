<script setup>
import { lang, setLang, LANGS } from '@/composables/useLang'
</script>

<template>
  <!-- Pilihan bahasa: kenop yang meluncur ke bahasa aktif, setinggi ThemeSwitch -->
  <div class="lang" :class="`lang--${lang}`" role="group" aria-label="Bahasa / Language">
    <span class="lang__knob" aria-hidden="true"></span>
    <button
      v-for="code in LANGS"
      :key="code"
      type="button"
      class="lang__opt"
      :class="{ 'lang__opt--active': lang === code }"
      :aria-pressed="lang === code"
      :aria-label="code === 'id' ? 'Bahasa Indonesia' : 'English'"
      :lang="code"
      @click="setLang(code)"
    >
      {{ code.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.lang {
  --h: 38px;
  --pad: 4px;
  --seg: 34px;
  position: relative;
  flex: none;
  display: inline-flex;
  align-items: center;
  height: var(--h);
  padding: 0 var(--pad);
  box-sizing: border-box;
  border: 1px solid var(--color-rule);
  border-radius: 999px;
  background: var(--color-surface);
}

/* Kenop timbul (sisi bawah tebal seperti tombol 3D) */
.lang__knob {
  position: absolute;
  top: var(--pad);
  left: var(--pad);
  width: var(--seg);
  height: calc(var(--h) - var(--pad) * 2 - 4px);
  border-radius: 999px;
  background: var(--color-text);
  box-shadow: 0 2px 0 color-mix(in srgb, var(--color-text) 45%, var(--color-bg));
  transition: translate 0.35s var(--ease-out);
}

.lang--en .lang__knob {
  translate: var(--seg) 0;
}

.lang__opt {
  position: relative;
  z-index: 1;
  width: var(--seg);
  height: 100%;
  padding: 0 0 3px;
  border: 0;
  background: none;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--color-text-soft);
  cursor: pointer;
  transition: color 0.25s ease;
}

.lang__opt:hover {
  color: var(--color-text);
}

.lang__opt--active,
.lang__opt--active:hover {
  color: var(--color-bg);
}

.lang__opt:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 999px;
}
</style>
