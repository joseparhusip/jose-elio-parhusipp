<script setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TheLoader from './components/TheLoader.vue'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import CustomCursor from './components/CustomCursor.vue'
import OfflineScreen from './components/OfflineScreen.vue'
import SnowFall from './components/SnowFall.vue'
import { christmas } from './composables/useChristmas'
import { useOffscreenPause } from './composables/useOffscreenPause'
import UpdateToast from './components/UpdateToast.vue'
import PaperPlaneFlight from './components/PaperPlaneFlight.vue'
import { useChatWidgetStore } from './stores/chatWidget'
import { privacyOpen } from './composables/usePrivacy'

const route = useRoute()
const isNotice = computed(() => Boolean(route.meta.notFound))

const ChatWidget = defineAsyncComponent(() => import('./components/ChatWidget.vue'))
const PrivacyDialog = defineAsyncComponent(() => import('./components/PrivacyDialog.vue'))

const chatStore = useChatWidgetStore()
const chatReady = ref(false)
const privacyReady = ref(false)

watch(
  () => chatStore.isOpen,
  (open) => {
    if (open) chatReady.value = true
  },
)
watch(privacyOpen, (open) => {
  if (open) privacyReady.value = true
})

watch(isNotice, (notice) => document.documentElement.classList.toggle('notice-page', notice), {
  immediate: true,
})

onMounted(() => {
  const whenIdle = window.requestIdleCallback || ((fn) => setTimeout(fn, 2000))
  whenIdle(() => (chatReady.value = true), { timeout: 4000 })
})

useOffscreenPause()
</script>

<template>
  <TheLoader />
  <ScrollProgress v-if="!isNotice" />
  <div class="app-stage">
    <TheNavbar v-if="!isNotice" />
    <RouterView />
    <TheFooter v-if="!isNotice" />
  </div>
  <ChatWidget v-if="!isNotice && chatReady" />
  <PrivacyDialog v-if="privacyReady" />
  <SnowFall v-if="christmas" />
  <OfflineScreen />
  <UpdateToast />
  <PaperPlaneFlight />
  <CustomCursor />
</template>
