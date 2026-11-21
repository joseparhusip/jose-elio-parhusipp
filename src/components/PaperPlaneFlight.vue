<script setup>
import { watch } from 'vue'
import { planeFlight } from '@/composables/usePaperPlane'

let clearTimer = 0

watch(planeFlight, (flight) => {
  clearTimeout(clearTimer)
  if (flight) clearTimer = setTimeout(() => (planeFlight.value = null), 2200)
})
</script>

<template>
  <div
    v-if="planeFlight"
    :key="planeFlight.id"
    class="plane-layer"
    aria-hidden="true"
    :style="{ '--x': `${planeFlight.x}px`, '--y': `${planeFlight.y}px` }"
  >
    <svg class="plane-trail" viewBox="0 0 400 300" preserveAspectRatio="none">
      <path d="M8 292 C 80 250, 120 120, 210 150 S 330 120, 392 8" />
    </svg>
    <div class="plane-path">
      <div class="plane">
        <svg viewBox="0 0 64 48" width="64" height="48">
          <path class="plane__top" d="M2 22 62 2 26 30Z" />
          <path class="plane__wing" d="M26 30 62 2 34 44Z" />
          <path class="plane__fold" d="M26 30 30 42 34 44Z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plane-layer {
  position: fixed;
  inset: 0;
  z-index: 400;
  pointer-events: none;
  perspective: 900px;
  overflow: hidden;
}

.plane-trail {
  position: absolute;
  left: var(--x);
  top: calc(var(--y) - 300px);
  width: min(400px, 70vw);
  height: 300px;
  overflow: visible;
  translate: -4% 0;
}

.plane-trail path {
  fill: none;
  stroke: var(--color-primary);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-dasharray: 4 8;
  vector-effect: non-scaling-stroke;
  opacity: 0;
  animation: trail 1.9s ease-out forwards;
}

.plane-path {
  position: absolute;
  left: var(--x);
  top: var(--y);
  transform-style: preserve-3d;
  animation: fly 1.7s cubic-bezier(0.45, 0, 0.25, 1) forwards;
}

.plane {
  transform-style: preserve-3d;
  translate: -50% -50%;
  animation: bank 1.7s ease-in-out forwards;
  filter: drop-shadow(0 10px 12px rgba(0, 0, 0, 0.3));
}

.plane__top {
  fill: #ffffff;
  stroke: #c9d3df;
  stroke-width: 0.8;
  stroke-linejoin: round;
}

.plane__wing {
  fill: #dfe8f3;
  stroke: #c9d3df;
  stroke-width: 0.8;
  stroke-linejoin: round;
}

.plane__fold {
  fill: var(--color-primary);
}

@keyframes fly {
  0% {
    transform: translate3d(0, 0, 0) scale(0.4);
    opacity: 0;
  }
  12% {
    transform: translate3d(0, -10px, 40px) scale(1);
    opacity: 1;
  }
  45% {
    transform: translate3d(min(200px, 34vw), -150px, 120px) scale(1.15);
  }
  100% {
    transform: translate3d(min(560px, 90vw), -110vh, -200px) scale(0.6);
    opacity: 0;
  }
}

@keyframes bank {
  0% {
    transform: rotateX(30deg) rotateY(-30deg) rotateZ(-10deg);
  }
  40% {
    transform: rotateX(-15deg) rotateY(20deg) rotateZ(-28deg);
  }
  70% {
    transform: rotateX(25deg) rotateY(-12deg) rotateZ(-48deg);
  }
  100% {
    transform: rotateX(10deg) rotateY(30deg) rotateZ(-60deg);
  }
}

@keyframes trail {
  0% {
    opacity: 0;
    stroke-dashoffset: 120;
  }
  20% {
    opacity: 0.7;
  }
  100% {
    opacity: 0;
    stroke-dashoffset: 0;
  }
}
</style>
