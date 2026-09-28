<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { milestone2Phases } from '../data/thesisData'
import PhaseDetailCard from './PhaseDetailCard.vue'

const selectedPhaseId = ref(milestone2Phases[0].id)
const isImageEnlarged = ref(false)
const imageTrigger = ref(null)
const closeButton = ref(null)
let previousBodyOverflow = ''

const selectedPhase = computed(() =>
  milestone2Phases.find((phase) => phase.id === selectedPhaseId.value)
)
const designProcessImage = `${import.meta.env.BASE_URL}images/milestone2/design-process.png`

function openImage() {
  previousBodyOverflow = document.body.style.overflow
  isImageEnlarged.value = true
}

function closeImage() {
  isImageEnlarged.value = false
  document.body.style.overflow = previousBodyOverflow
  imageTrigger.value?.focus()
}

function handleModalKeydown(event) {
  if (event.key === 'Escape' && isImageEnlarged.value) {
    closeImage()
  } else if (event.key === 'Tab' && isImageEnlarged.value) {
    event.preventDefault()
    closeButton.value?.focus()
  }
}

watch(isImageEnlarged, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeButton.value?.focus())
  }
})

onMounted(() => window.addEventListener('keydown', handleModalKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleModalKeydown)
  document.body.style.overflow = previousBodyOverflow
})

function selectPhase(phaseId) {
  selectedPhaseId.value = phaseId
}
</script>

<template>
  <section class="project-plan" aria-label="Milestone 2 project plan">
    <section class="design-process" aria-labelledby="design-process-title">
      <div class="plan-section-heading">
        <div>
          <p class="content-label">01</p>
          <h3 id="design-process-title">Design Process</h3>
        </div>
        <p class="design-process-intro">
          My design process adapts the Double Diamond framework to guide the project from research and problem definition to game development, iterative evaluation, and final delivery. The process moves through four phases: Discover, Define, Develop, and Deliver.
        </p>
      </div>

      <div class="diagram-controls-wrapper">
        <div class="design-process-image-scroll">
          <button
            ref="imageTrigger"
            class="design-process-image-trigger"
            type="button"
            aria-label="Open the design process diagram in an enlarged view"
            @click="openImage"
          >
            <img
              class="design-process-image"
              :src="designProcessImage"
              alt="Design process diagram showing four connected phases: Discover, Define, Develop, and Deliver."
              width="603"
              height="403"
            >
            <span class="image-enlarge-hint" aria-hidden="true">Click to enlarge</span>
          </button>
        </div>

        <nav class="phase-navigation" aria-label="Design process phases">
          <button
            v-for="phase in milestone2Phases"
            :key="phase.id"
            type="button"
            class="phase-navigation-button"
            :class="{ selected: selectedPhaseId === phase.id }"
            :aria-pressed="selectedPhaseId === phase.id"
            @click="selectPhase(phase.id)"
          >
            {{ phase.title }}
          </button>
        </nav>
      </div>

      <section
        class="phase-details"
        aria-labelledby="phase-details-title"
        aria-live="polite"
      >
        <div class="phase-details-heading">
          <div>
            <p class="content-label">02 · PHASE DETAILS</p>
            <h3 id="phase-details-title">{{ selectedPhase.title }}</h3>
          </div>
          <span class="phase-date">{{ selectedPhase.date }}</span>
        </div>

        <p class="phase-description">{{ selectedPhase.description }}</p>

        <div class="phase-detail-cards">
          <PhaseDetailCard heading="Goal" :text="selectedPhase.goal" />
          <PhaseDetailCard heading="Methods" :items="selectedPhase.methods" />
          <PhaseDetailCard heading="Artifacts" :items="selectedPhase.artifacts" />
        </div>
      </section>
    </section>

    <Teleport to="body">
      <div
        v-if="isImageEnlarged"
        class="design-process-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Enlarged design process diagram"
        @click.self="closeImage"
      >
        <div class="lightbox-canvas" @click.stop>
          <button
            ref="closeButton"
            class="lightbox-close"
            type="button"
            aria-label="Close enlarged diagram"
            @click="closeImage"
          >
            ×
          </button>
          <div class="lightbox-image-scroll">
            <img
              class="lightbox-image"
              :src="designProcessImage"
              alt="Enlarged design process diagram showing four connected phases: Discover, Define, Develop, and Deliver."
              width="603"
              height="403"
            >
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
