<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
const isLight = computed(() => theme.value === 'light')

// delay & durasi dari desain tombol asli (layer gradient yang berputar)
const layers = [
  { delay: '0s', duration: '25s' },
  { delay: '0.15s', duration: '15.9s' },
  { delay: '0.53s', duration: '26.4s' },
  { delay: '0.45s', duration: '17.8s' },
  { delay: '1.6s', duration: '19.2s' },
]
</script>

<template>
  <button
    type="button"
    class="tswitch"
    :class="{ 'tswitch--light': isLight }"
    role="switch"
    :aria-checked="isLight"
    :aria-label="isLight ? 'Ganti ke mode gelap' : 'Ganti ke mode terang'"
    :title="isLight ? 'Mode terang' : 'Mode gelap'"
    @click="toggleTheme"
  >
    <span class="tswitch__track">
      <span
        v-for="(l, i) in layers"
        :key="i"
        class="tswitch__layer"
        :style="{ animationDelay: l.delay, animationDuration: l.duration }"
      ></span>
      <span class="tswitch__light"></span>
    </span>

    <svg class="tswitch__hint tswitch__hint--sun" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
    <svg class="tswitch__hint tswitch__hint--moon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>

    <span class="tswitch__knob">
      <svg v-if="isLight" viewBox="0 0 24 24" aria-hidden="true" class="tswitch__icon tswitch__icon--sun">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true" class="tswitch__icon tswitch__icon--moon">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </span>
  </button>
</template>

<style scoped>
.tswitch {
  --sw-border: rgba(124, 111, 240, 0.65);
  --sw-layer-a: #7c6ff0;
  --sw-layer-b: #1b2140;
  --sw-glow: rgba(79, 214, 192, 0.45);
  --sw-knob-bg: #e7eaf6;
  --sw-knob-fg: #5e52d6;
  --sw-hint: rgba(231, 234, 246, 0.55);

  --sw-w: 68px;
  --sw-h: 34px;
  --sw-pad: 3px;
  --sw-knob: calc(var(--sw-h) - var(--sw-pad) * 2 - 4px);

  position: relative;
  flex: none;
  width: var(--sw-w);
  height: var(--sw-h);
  padding: 0;
  border: 0;
  background: none;
  border-radius: 999px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.tswitch--light {
  --sw-border: rgba(94, 82, 214, 0.35);
  --sw-layer-a: #ffffff;
  --sw-layer-b: #c9d2f5;
  --sw-glow: rgba(255, 196, 87, 0.55);
  --sw-knob-bg: #ffffff;
  --sw-knob-fg: #e08a00;
  --sw-hint: rgba(27, 34, 56, 0.45);
}

.tswitch:focus-visible {
  box-shadow: 0 0 0 3px var(--color-primary-soft, rgba(124, 111, 240, 0.4));
}

.tswitch__track {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 999px;
  border: 2px solid var(--sw-border);
  background: var(--sw-layer-b);
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.25), 0 4px 14px -6px var(--sw-glow);
  transition: border-color 0.4s ease, background 0.4s ease, box-shadow 0.4s ease;
}

.tswitch__layer {
  position: absolute;
  left: -60px;
  top: -20px;
  width: 400%;
  aspect-ratio: 1;
  pointer-events: none;
  opacity: 0.5;
  background: radial-gradient(
    ellipse at 65% 180%,
    var(--sw-layer-a),
    var(--sw-layer-b),
    var(--sw-layer-a),
    var(--sw-layer-b),
    var(--sw-layer-a),
    var(--sw-layer-b),
    var(--sw-layer-a)
  );
  animation: tswitch-rotate 8s linear infinite;
}

.tswitch--light .tswitch__layer {
  opacity: 0.65;
}

.tswitch__light {
  position: absolute;
  top: 3px;
  left: 10%;
  width: 80%;
  height: 8px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.3);
  filter: blur(3px);
  pointer-events: none;
  animation: tswitch-pulse 3s ease-in-out infinite;
}

.tswitch__hint {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  transform: translateY(-50%);
  fill: none;
  stroke: var(--sw-hint);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.tswitch__hint--sun {
  right: 10px;
}

.tswitch__hint--moon {
  left: 10px;
}

.tswitch--light .tswitch__hint--sun {
  opacity: 0;
}

.tswitch:not(.tswitch--light) .tswitch__hint--moon {
  opacity: 0;
}

.tswitch__knob {
  position: absolute;
  top: 50%;
  left: calc(var(--sw-pad) + 2px);
  width: var(--sw-knob);
  height: var(--sw-knob);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--sw-knob-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35), inset 0 -2px 3px rgba(0, 0, 0, 0.12);
  transform: translateY(-50%);
  transition: transform 0.4s cubic-bezier(0.68, -0.4, 0.27, 1.4), background 0.3s ease;
}

.tswitch--light .tswitch__knob {
  transform: translate(calc(var(--sw-w) - var(--sw-knob) - var(--sw-pad) * 2 - 4px), -50%);
}

.tswitch:hover .tswitch__knob {
  box-shadow: 0 2px 12px var(--sw-glow), inset 0 -2px 3px rgba(0, 0, 0, 0.12);
}

.tswitch__icon {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: var(--sw-knob-fg);
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: tswitch-pop 0.4s ease;
}

.tswitch__icon--moon {
  fill: var(--sw-knob-fg);
}

@keyframes tswitch-rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes tswitch-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}

@keyframes tswitch-pop {
  from {
    transform: scale(0.4) rotate(-90deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tswitch__layer,
  .tswitch__light,
  .tswitch__icon {
    animation: none;
  }
}
</style>
