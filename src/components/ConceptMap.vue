<script setup>
import { nextTick, onBeforeUnmount, ref } from 'vue'

defineProps({ src: { type: String, required: true } })

const isEnlarged = ref(false)
const trigger = ref(null)
const closeButton = ref(null)
let previousBodyOverflow = ''

async function openImage() {
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  isEnlarged.value = true
  window.addEventListener('keydown', handleKeydown)
  await nextTick()
  closeButton.value?.focus()
}

function closeImage() {
  isEnlarged.value = false
  document.body.style.overflow = previousBodyOverflow
  window.removeEventListener('keydown', handleKeydown)
  trigger.value?.focus()
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeImage()
  else if (event.key === 'Tab') {
    event.preventDefault()
    closeButton.value?.focus()
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (isEnlarged.value) document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <button
    ref="trigger"
    class="design-process-image-trigger concept-map-trigger"
    type="button"
    aria-label="Open the Collaborative Problem Solving concept map in an enlarged view"
    aria-haspopup="dialog"
    @click="openImage"
  >
    <img class="concept-map-image" :src="src" alt="Collaborative Problem Solving concept map">
    <span class="image-enlarge-hint" aria-hidden="true">Click to enlarge</span>
  </button>

  <Teleport to="body">
    <div
      v-if="isEnlarged"
      class="design-process-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged Collaborative Problem Solving concept map"
      @click.self="closeImage"
    >
      <div class="lightbox-canvas" @click.stop>
        <button
          ref="closeButton"
          class="lightbox-close"
          type="button"
          aria-label="Close enlarged concept map"
          @click="closeImage"
        >×</button>
        <div class="lightbox-image-scroll">
          <img class="lightbox-image" :src="src" alt="Enlarged Collaborative Problem Solving concept map">
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.concept-map-trigger { width: 100%; max-width: 380px; margin: 0 auto; }
.concept-map-trigger:hover .concept-map-image { opacity: 0.94; }
</style>
