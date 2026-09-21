<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
const isLight = computed(() => theme.value === 'light')
</script>

<template>
  <button
    type="button"
    class="sw"
    :class="{ 'sw--light': isLight }"
    role="switch"
    :aria-checked="isLight"
    :aria-label="isLight ? 'Ganti ke mode gelap' : 'Ganti ke mode terang'"
    :title="isLight ? 'Mode terang' : 'Mode gelap'"
    @click="toggleTheme"
  >
    <!-- Track cekung (3D inset) -->
    <span class="sw__track">
      <!-- isi 3D: bintang (dark) -->
      <span class="sw__stars">
        <i class="star s1"></i>
        <i class="star s2"></i>
        <i class="star s3"></i>
        <i class="star s4"></i>
        <i class="star s5"></i>
      </span>

      <!-- isi 3D: awan (light) -->
      <span class="sw__clouds">
        <i class="cloud c1"></i>
        <i class="cloud c2"></i>
      </span>

      <span class="sw__gloss"></span>
    </span>

    <!-- Bola 3D: bulan <-> matahari -->
    <span class="sw__knob">
      <span class="sw__orb sw__orb--moon">
        <i class="crater cr1"></i>
        <i class="crater cr2"></i>
        <i class="crater cr3"></i>
      </span>
      <span class="sw__orb sw__orb--sun"></span>
    </span>
  </button>
</template>

<style scoped>
.sw {
  /* ===== ukuran ===== */
  --w: 76px;
  --h: 38px;
  --pad: 4px;
  --knob: calc(var(--h) - var(--pad) * 2);

  /* ===== warna DARK ===== */
  --track-a: #0a0d1a;
  --track-b: #1d2450;
  --track-edge: rgba(124, 111, 240, 0.55);
  --track-shadow: rgba(0, 0, 0, 0.75);
  --glow: rgba(124, 111, 240, 0.45);

  position: relative;
  flex: none;
  width: var(--w);
  height: var(--h);
  padding: 0;
  border: 0;
  background: none;
  border-radius: 999px;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  perspective: 300px;
  /* tombol "menonjol" dari navbar */
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.35));
  transition: transform 0.15s ease;
}

.sw:hover {
  transform: translateY(-1px);
}

.sw:active {
  transform: translateY(1px) scale(0.98);
}

.sw:focus-visible {
  box-shadow: 0 0 0 3px var(--color-primary-soft, rgba(124, 111, 240, 0.4));
}

/* ===== warna LIGHT ===== */
.sw--light {
  --track-a: #7fc4ff;
  --track-b: #d9efff;
  --track-edge: rgba(255, 255, 255, 0.95);
  --track-shadow: rgba(30, 70, 130, 0.45);
  --glow: rgba(255, 190, 70, 0.55);
  filter: drop-shadow(0 4px 6px rgba(30, 60, 110, 0.3));
}

/* ================= TRACK ================= */
.sw__track {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--track-a) 0%, var(--track-b) 100%);
  box-shadow:
    /* cekungan dalam */
    inset 0 5px 9px var(--track-shadow),
    inset 0 -3px 5px rgba(255, 255, 255, 0.12),
    inset 4px 0 8px rgba(0, 0, 0, 0.25),
    inset -4px 0 8px rgba(0, 0, 0, 0.2),
    /* bibir/bevel luar */
    0 0 0 2px var(--track-edge),
    0 1px 0 3px rgba(255, 255, 255, 0.08),
    0 0 14px var(--glow);
  transition: background 0.5s ease, box-shadow 0.5s ease;
}

/* kilau kaca di atas track */
.sw__gloss {
  position: absolute;
  top: 2px;
  left: 8%;
  width: 84%;
  height: 40%;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0));
  pointer-events: none;
}

/* ================= BINTANG (dark) ================= */
.sw__stars {
  position: absolute;
  inset: 0;
  transition: opacity 0.4s ease, transform 0.5s ease;
}

.sw--light .sw__stars {
  opacity: 0;
  transform: translateY(-10px);
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.85);
  animation: twinkle 2.6s ease-in-out infinite;
}

.s1 { right: 12px; top: 9px; }
.s2 { right: 24px; top: 20px; width: 2px; height: 2px; animation-delay: 0.6s; }
.s3 { right: 34px; top: 10px; width: 2px; height: 2px; animation-delay: 1.2s; }
.s4 { right: 16px; top: 26px; width: 2px; height: 2px; animation-delay: 1.8s; }
.s5 { right: 44px; top: 24px; width: 3px; height: 3px; animation-delay: 0.3s; }

@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.25; transform: scale(0.6); }
}

/* ================= AWAN (light) ================= */
.sw__clouds {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease, transform 0.5s ease;
}

.sw--light .sw__clouds {
  opacity: 1;
  transform: translateY(0);
}

.cloud {
  position: absolute;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(180deg, #ffffff, #e3f1ff);
  box-shadow: 0 3px 5px rgba(40, 90, 150, 0.35), inset 0 -2px 3px rgba(120, 170, 220, 0.4);
  animation: drift 6s ease-in-out infinite;
}

.cloud::before {
  content: '';
  position: absolute;
  left: 20%;
  top: -6px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #fff;
}

.c1 { left: 10px; bottom: 7px; width: 24px; }
.c2 { left: 26px; top: 8px; width: 18px; height: 8px; opacity: 0.9; animation-delay: 1.5s; }

@keyframes drift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}

/* ================= BOLA 3D ================= */
.sw__knob {
  position: absolute;
  top: var(--pad);
  left: var(--pad);
  width: var(--knob);
  height: var(--knob);
  transform: translateX(0);
  transition: transform 0.55s cubic-bezier(0.68, -0.35, 0.27, 1.35);
}

.sw--light .sw__knob {
  transform: translateX(calc(var(--w) - var(--knob) - var(--pad) * 2));
}

.sw__orb {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transition: opacity 0.35s ease, transform 0.55s ease;
}

/* --- BULAN 3D --- */
.sw__orb--moon {
  background:
    radial-gradient(circle at 32% 28%, #ffffff 0%, #e4e8f5 28%, #aab2cf 62%, #6d7595 100%);
  box-shadow:
    inset -4px -5px 8px rgba(40, 46, 90, 0.55),
    inset 3px 3px 6px rgba(255, 255, 255, 0.8),
    0 4px 8px rgba(0, 0, 0, 0.55),
    0 0 12px rgba(200, 210, 255, 0.45);
}

.crater {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 65% 70%, #8f97b8, #b9c0da);
  box-shadow: inset 1px 1px 2px rgba(50, 56, 100, 0.6), 0 1px 0 rgba(255, 255, 255, 0.5);
}

.cr1 { width: 8px; height: 8px; left: 6px; top: 7px; }
.cr2 { width: 5px; height: 5px; right: 6px; top: 13px; }
.cr3 { width: 6px; height: 6px; left: 12px; bottom: 5px; }

/* --- MATAHARI 3D --- */
.sw__orb--sun {
  background:
    radial-gradient(circle at 32% 28%, #fff9d6 0%, #ffd766 30%, #ffa41c 65%, #e26a00 100%);
  box-shadow:
    inset -4px -5px 8px rgba(190, 70, 0, 0.6),
    inset 3px 3px 6px rgba(255, 255, 255, 0.85),
    0 4px 8px rgba(120, 60, 0, 0.45),
    0 0 14px 3px rgba(255, 190, 60, 0.75),
    0 0 26px 8px rgba(255, 170, 40, 0.35);
  opacity: 0;
  transform: rotate(-120deg) scale(0.5);
}

.sw--light .sw__orb--sun {
  opacity: 1;
  transform: rotate(0) scale(1);
  animation: sun-pulse 3s ease-in-out infinite;
}

.sw--light .sw__orb--moon {
  opacity: 0;
  transform: rotate(120deg) scale(0.5);
}

@keyframes sun-pulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.12); }
}

/* efek pipih saat ditekan (tombol terasa fisik) */
.sw:active .sw__knob {
  scale: 1.06 0.94;
}

@media (prefers-reduced-motion: reduce) {
  .star,
  .cloud,
  .sw--light .sw__orb--sun {
    animation: none;
  }
}
</style>
