<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { vReveal } from '@/directives/reveal'
import { lang } from '@/composables/useLang'

const LanyardCard = defineAsyncComponent(() => import('@/components/LanyardCard.vue'))

const route = useRoute()

const wantedPath = computed(() => {
  const path = decodeURIComponent(route.fullPath || '/')
  return path.length > 48 ? `${path.slice(0, 45)}…` : path
})
</script>

<template>
  <main class="notfound">
    <div class="container">
      <div class="notfound__body">
        <div class="notfound__hang">
          <LanyardCard variant="notfound" :path="wantedPath" />
        </div>

        <div class="notfound__text">
          <h1 v-reveal.clip="140" class="notfound__title">
            <template v-if="lang === 'en'">This page <span class="serif-accent">got lost</span>.</template>
            <template v-else-if="lang === 'ja'">このページは<span class="serif-accent">迷子</span>になりました。</template>
            <template v-else>Halaman ini <span class="serif-accent">tersesat</span>.</template>
          </h1>
          <p v-reveal="220" class="notfound__lead">
            <template v-if="lang === 'en'">
              The address <code class="notfound__path">{{ wantedPath }}</code> does not exist or
              has been moved. Try starting again from the
              <RouterLink to="/" class="notfound__home">home page</RouterLink>.
            </template>
            <template v-else-if="lang === 'ja'">
              お探しのページ<code class="notfound__path">{{ wantedPath }}</code>は存在しないか、移動した可能性があります。<RouterLink to="/" class="notfound__home">ホーム</RouterLink>からもう一度お試しください。
            </template>
            <template v-else>
              Alamat <code class="notfound__path">{{ wantedPath }}</code> tidak ada atau
              sudah dipindahkan. Coba mulai lagi dari
              <RouterLink to="/" class="notfound__home">beranda</RouterLink>.
            </template>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.notfound {
  box-sizing: border-box;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  padding: clamp(1.25rem, 3vw, 2rem) 0;
}

.notfound > .container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.notfound__body {
  --top-gap: clamp(1.25rem, 3vw, 2rem);
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 5vw, 4.5rem);
  align-items: center;
}

.notfound__hang {
  --lanyard-max-scale: 1.22;
  align-self: start;
  width: min(250px, 100%);
  height: 640px;
  margin: calc(-1 * var(--top-gap)) auto 0;
}

.notfound__text {
  padding-bottom: 0.5rem;
}

.notfound__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4.2vw, 3.4rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.notfound__lead {
  max-width: 30rem;
  margin: 1rem 0 0;
  font-size: 1.02rem;
  line-height: 1.7;
  color: var(--color-text-soft);
}

.notfound__path {
  padding: 0.1em 0.4em;
  border-radius: 4px;
  background: var(--color-surface-soft);
  font-family: var(--font-mono);
  font-size: 0.86em;
  color: var(--color-text);
  word-break: break-all;
}

.notfound__home {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}

.notfound__home:hover {
  text-decoration-thickness: 2px;
}

@media (max-width: 860px) {
  .notfound__body {
    grid-template-columns: 1fr;
    align-content: start;
    justify-items: center;
    gap: 0;
    text-align: center;
  }

  .notfound__hang {
    --lanyard-max-scale: 0.92;
    width: min(200px, 70%, 21dvh);
    height: min(470px, 56dvh);
  }

  .notfound__text {
    padding-bottom: 1rem;
  }

  .notfound__lead {
    max-width: 26rem;
    margin-inline: auto;
    text-align: justify;
    text-align-last: center;
    hyphens: auto;
  }
}
</style>
