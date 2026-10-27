<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { researchStages, researchStatusLabels, stageResearchStatus } from '../data/researchPlan'
import ResearchFindings from './ResearchFindings.vue'

const root = ref(null)
const popup = ref(null)
const active = ref(null)
const selectedId = ref(null)
const selectedStage = computed(() => researchStages.find(stage => stage.questions.some(q => q.id === selectedId.value)))
function closeFindings(restoreFocus = false) {
  const id = selectedId.value
  // Keep selection set until focus is restored so focus does not reopen directions.
  if (restoreFocus && id) root.value?.querySelector(`#rp-question-${id}`)?.focus({ preventScroll: true })
  selectedId.value = null
  close()
}
function selectFinding(id) {
  close()
  selectedId.value = id
}
const inline = ref(false)
const position = ref({ visibility: 'hidden' })
const revealed = ref(new Set())
const inView = ref(new Set())
const observing = ref(false)
const question = computed(() => researchStages.flatMap(stage => stage.questions).find(q => q.id === active.value))
let anchor = null
let media
let observer
let closeTimer
let frame

function cancelClose() { clearTimeout(closeTimer) }
function close() {
  cancelClose()
  active.value = null
  anchor = null
}
function preview(q, event) {
  if (inline.value || selectedId.value || event.pointerType === 'touch') return
  cancelClose()
  anchor = event.currentTarget
  active.value = q.id
  schedulePosition()
}
function deferClose() {
  closeTimer = setTimeout(close, 180)
}
function toggle(q) {
  if (selectedId.value === q.id) return closeFindings()
  selectFinding(q.id)
}
function outside(event) {
  if (!event.target.closest?.('.rp-question, .rp-directions')) close()
}
function keydown(event) {
  if (event.key !== 'Escape') return
  if (selectedId.value) {
    const panelHasFocus = root.value?.querySelector('.rp-findings-slot')?.contains(document.activeElement)
    closeFindings(panelHasFocus)
  } else if (active.value) {
    if (popup.value?.contains(document.activeElement)) anchor?.focus({ preventScroll: true })
    close()
  }
}
function focusLeft(event) {
  if (!popup.value?.contains(event.relatedTarget)) deferClose()
}
function placePopup() {
  if (!popup.value || !anchor || inline.value) return
  const viewport = window.visualViewport
  const leftEdge = (viewport?.offsetLeft ?? 0) + 12
  const topEdge = (viewport?.offsetTop ?? 0) + 12
  const rightEdge = leftEdge + (viewport?.width ?? window.innerWidth) - 24
  const bottomEdge = topEdge + (viewport?.height ?? window.innerHeight) - 24
  const width = Math.min(360, rightEdge - leftEdge)
  popup.value.style.width = `${width}px`
  popup.value.style.maxHeight = `${bottomEdge - topEdge}px`
  const rect = anchor.getBoundingClientRect()
  const height = popup.value.getBoundingClientRect().height
  const gap = 12
  // Prefer the open space beside a card, then fall back to above/below.
  let left = rect.right + gap
  let top = rect.top
  if (left + width > rightEdge) {
    left = rect.left - gap - width
    if (left < leftEdge) {
      left = rect.left
      top = rect.bottom + gap
    }
  }
  if (top + height > bottomEdge) top = rect.top - gap - height
  position.value = {
    width: `${width}px`,
    maxHeight: `${bottomEdge - topEdge}px`,
    left: `${Math.max(leftEdge, Math.min(left, rightEdge - width))}px`,
    top: `${Math.max(topEdge, Math.min(top, bottomEdge - height))}px`,
    visibility: 'visible'
  }
}
function schedulePosition() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(placePopup)
}
watch(active, async () => {
  position.value = { visibility: 'hidden' }
  await nextTick()
  placePopup()
})
function syncMedia() {
  inline.value = media.matches
  close()
}
function explore() {
  root.value.querySelector('.rp-flow').scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'start'
  })
}
onMounted(() => {
  media = window.matchMedia('(max-width: 760px), (hover: none)')
  syncMedia()
  media.addEventListener('change', syncMedia)
  document.addEventListener('pointerdown', outside)
  document.addEventListener('keydown', keydown)
  window.addEventListener('scroll', schedulePosition, true)
  window.addEventListener('resize', schedulePosition)
  window.visualViewport?.addEventListener('resize', schedulePosition)
  window.visualViewport?.addEventListener('scroll', schedulePosition)
  if ('IntersectionObserver' in window) {
    observing.value = true
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const id = Number(entry.target.dataset.stage)
        if (entry.isIntersecting) {
          revealed.value.add(id)
          inView.value.add(id)
        } else inView.value.delete(id)
      }
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' })
    root.value.querySelectorAll('.rp-stage').forEach(el => observer.observe(el))
  }
})
onBeforeUnmount(() => {
  observer?.disconnect()
  cancelClose()
  cancelAnimationFrame(frame)
  media?.removeEventListener('change', syncMedia)
  document.removeEventListener('pointerdown', outside)
  document.removeEventListener('keydown', keydown)
  window.removeEventListener('scroll', schedulePosition, true)
  window.removeEventListener('resize', schedulePosition)
  window.visualViewport?.removeEventListener('resize', schedulePosition)
  window.visualViewport?.removeEventListener('scroll', schedulePosition)
})
</script>

<template>
  <div ref="root" class="research-plan" :class="{ 'rp-observing': observing }">
   

    <p class="rp-help">{{ inline ? 'Tap a question to read research findings and explore its directions.' : 'Hover or focus for research directions. Click or press Enter to read findings.' }}</p>
    <div class="rp-flow" aria-label="Six research stages">
      <template v-for="stage in researchStages" :key="stage.id">
        <p v-if="stage.id === 5" class="rp-transition"><span>From Research to Design Decisions</span></p>
        <section class="rp-stage" :data-stage="stage.id"
          :class="{ 'rp-right': stage.id % 2 === 0, 'rp-design': stage.id >= 5, 'rp-revealed': revealed.has(stage.id), 'rp-in-view': inView.has(stage.id) }"
          :aria-labelledby="`rp-stage-${stage.id}`">
          <span class="rp-node" aria-hidden="true">{{ String(stage.id).padStart(2, '0') }}</span>
          <div class="rp-card">
            <div class="rp-card-heading">
              <p class="rp-label">STAGE {{ String(stage.id).padStart(2, '0') }}</p>
              <span class="rp-status" :class="`rp-status-${stageResearchStatus(stage)}`">{{ researchStatusLabels[stageResearchStatus(stage)] }}</span>
            </div>
            <h5 :id="`rp-stage-${stage.id}`">{{ stage.title }}</h5>
            <p class="rp-description">{{ stage.description }}</p>
            <p class="rp-label rp-question-label">RESEARCH QUESTIONS</p>
            <div v-for="q in stage.questions" :key="q.id" class="rp-question-row">
              <button :id="`rp-question-${q.id}`" type="button" class="rp-question"
                :aria-expanded="selectedId === q.id" :aria-controls="selectedId === q.id ? `rp-findings-${stage.id}` : undefined"
                :aria-describedby="active === q.id ? `rp-directions-${q.id}` : undefined"
                @pointerenter="preview(q, $event)" @pointerleave="deferClose" @focus="preview(q, $event)"
                @blur="focusLeft" @click="toggle(q)">
                <span class="rp-q-number">{{ q.id }}.</span>
                <span class="rp-question-copy">{{ q.question }}<span class="rp-question-status" :class="`rp-status-${q.status}`">{{ researchStatusLabels[q.status] }}</span></span>
                <span class="rp-q-icon" aria-hidden="true">{{ selectedId === q.id ? '−' : '+' }}</span>
              </button>

            </div>
            <div class="rp-output">
              <p class="rp-label">EXPECTED OUTPUT</p>
              <p>{{ stage.expectedOutput }}</p>
            </div>
          </div>
          <div v-if="selectedStage?.id === stage.id" class="rp-findings-slot">
            <ResearchFindings :stage="stage" :question-id="selectedId" :show-directions="inline"
              @select="selectFinding" @close="closeFindings(true)" />
          </div>
        </section>
      </template>
    </div>

    <section class="rp-synthesis" aria-labelledby="rp-synthesis-title">
      <p class="rp-label">RESEARCH SYNTHESIS</p>
      <h4 id="rp-synthesis-title">From Research to Game Design</h4>
      <div class="rp-synthesis-flow">
        <p>Research Synthesis</p><span aria-hidden="true">→</span>
        <p>Target Audience Rationale<br><span>+</span> CPS Framework<br><span>+</span> Design Principles</p><span aria-hidden="true">→</span>
        <p>Learning Objectives<br><span>+</span> Evaluation Criteria</p>
      </div>
      <!-- <p class="rp-method-note">Successful cooperative gameplay does not necessarily demonstrate lasting improvement in CPS skills. Evaluation will distinguish opportunities for CPS practice from evidence of skill development or transfer.</p> -->
    </section>

    <Teleport to="body">
      <Transition name="rp-popup" :css="!selectedId">
        <div v-if="question && !inline && !selectedId" :id="`rp-directions-${question.id}`" ref="popup"
          class="rp-directions rp-floating" :style="position" role="region" :aria-labelledby="`rp-question-${question.id}`"
          tabindex="0" @pointerenter="cancelClose" @pointerleave="deferClose" @focusin="cancelClose" @focusout="focusLeft">
          <p class="rp-label">{{ question.id }} · RESEARCH DIRECTIONS</p>
          <ul><li v-for="direction in question.directions" :key="direction">{{ direction }}</li></ul>
          <p class="rp-popup-hint">Click the question to read research findings</p>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.research-plan { grid-column: 1 / -1; min-width: 0; color: #554138; line-height: 1.7; }
.rp-label { margin: 0 0 12px; color: #a6543a; font-size: 11px; font-weight: 600; letter-spacing: .13em; }
.rp-intro { max-width: 680px; margin: 12px auto 60px; text-align: center; }
.rp-intro h4, .rp-synthesis h4 { margin: 0 0 22px; font-family: 'Playfair Display', serif; color: #403029; font-size: clamp(30px, 4vw, 46px); line-height: 1.2; }
.rp-subtitle { font-size: 20px; line-height: 1.5; color: #783f2d; }
.rp-intro > p:not(.rp-label) { margin: 20px 0; }
.rp-audience { font-size: 13px; color: #735f53; }
.rp-explore { margin-top: 15px; padding: 12px; background: transparent; border: 0; color: #9d4b34; cursor: pointer; font-size: 13px; }
.rp-explore span { display: inline-block; margin-left: 12px; }
.rp-help { text-align: center; font-size: 12px; color: #735f53; margin-bottom: 36px; }
.rp-flow { position: relative; padding: 12px 0 48px; scroll-margin-top: 30px; }
.rp-flow::before { content: ''; position: absolute; top: 0; bottom: 0; left: calc(50% - .5px); width: 1px; background: #c6a78f; }
.rp-stage { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 80px minmax(0, 1fr); margin-bottom: 70px; }
.rp-stage:last-child { margin-bottom: 0; }
.rp-card { position: relative; grid-column: 1; grid-row: 1; min-width: 0; padding: 28px; background: #fffaf4; border: 1px solid #e4d5c6; border-radius: 20px; box-shadow: 0 8px 26px #783f2d08; transition: opacity .4s ease, transform .4s ease; }
.rp-right .rp-card { grid-column: 3; }
.rp-card::before { content: ''; position: absolute; top: 29px; left: 100%; width: 40px; height: 1px; background: #c6a78f; }
.rp-right .rp-card::before { left: auto; right: 100%; }
.rp-node { position: absolute; z-index: 1; top: 10px; left: calc(50% - 20px); display: grid; place-items: center; width: 40px; height: 40px; border: 5px solid #fffaf4; border-radius: 50%; background: #e9dccb; color: #554138; font-size: 11px; font-weight: 600; transition: box-shadow .3s ease, background .3s ease; }
.rp-in-view .rp-node { background: #d8b5a1; box-shadow: 0 0 0 1px #c6a78f; }
.rp-design .rp-node { background: #b86445; color: white; }
.rp-design.rp-in-view .rp-node { background: #9d4b34; box-shadow: 0 0 0 1px #b86445; }
.rp-card h5 { margin: 0; font-family: 'Playfair Display', serif; font-size: clamp(15px, 2vw, 20px); line-height: 1.25; color: #403029; }
.rp-description { font-size: 14px; margin: 16px 0 24px; }
.rp-question-label { margin-bottom: 6px; }
.rp-question-row { border-top: 1px solid #eadccf; }
.rp-question { display: flex; align-items: baseline; gap: 8px; width: 100%; padding: 15px 4px; border: 0; background: transparent; color: #554138; font-size: 14px; line-height: 1.6; text-align: left; cursor: pointer; border-radius: 6px; }
.rp-question:hover, .rp-question[aria-expanded='true'] { background: #f1e5d8; color: #783f2d; }
.rp-q-number { color: #9d4b34; font-size: 12px; flex-shrink: 0; }
.rp-q-icon { margin-left: auto; color: #9d4b34; }
.rp-question:focus-visible, .rp-explore:focus-visible, .rp-floating:focus-visible { outline: 2px solid #9d4b34; outline-offset: 3px; }
.rp-output { margin-top: 22px; padding-top: 18px; border-top: 1px solid #d8b5a1; }
.rp-output .rp-label { margin-bottom: 6px; }
.rp-output > p:last-child { margin: 0; font-size: 14px; }
.rp-transition { position: relative; z-index: 1; text-align: center; margin: 0 0 48px; font-size: 12px; color: #9d4b34; }
.rp-transition span { display: inline-block; padding: 8px 16px; background: #f7f1e8; border: 1px solid #e4d5c6; border-radius: 30px; }
.rp-synthesis { position: relative; margin-top: 0; padding: 40px 0 0; text-align: center; border-top: 1px solid #e4d5c6; }
.rp-synthesis h4 { font-size: 30px; }
.rp-synthesis-flow { display: flex; align-items: center; justify-content: center; gap: 24px; margin: 30px 0; }
.rp-synthesis-flow p { flex: 1; font-size: 15px; }
.rp-synthesis-flow span { color: #a6543a; }
.rp-method-note { max-width: 710px; margin: 36px auto 0; padding-top: 24px; border-top: 1px solid #eadccf; font-size: 13px; color: #735f53; }
.rp-directions { padding: 22px; border: 1px solid #e4d5c6; border-radius: 14px; background: #fff; color: #554138; font-size: 14px; line-height: 1.65; }
.rp-directions ul { margin: 0; padding-left: 18px; }
.rp-directions li + li { margin-top: 10px; }
.rp-floating { position: fixed; z-index: 1100; overflow: auto; overscroll-behavior: contain; box-shadow: 0 12px 40px #33272024; }
.rp-popup-hint { margin: 16px 0 0; padding-top: 12px; border-top: 1px solid #eadccf; color: #735f53; font-size: 11px; }
.rp-inline { margin: 0 0 16px; padding: 16px; }
.rp-popup-enter-active, .rp-popup-leave-active { transition: opacity .15s ease, transform .15s ease; }
.rp-popup-enter-from, .rp-popup-leave-to { opacity: 0; transform: translateY(5px); }
.rp-observing .rp-stage:not(.rp-revealed) .rp-card { opacity: 0; transform: translateY(12px); }
.rp-observing .rp-stage:focus-within .rp-card { opacity: 1; transform: none; }
@media (max-width: 1000px) {
  .rp-stage { grid-template-columns: minmax(0, 1fr) 60px minmax(0, 1fr); margin-bottom: 48px; }
  .rp-card { padding: 20px; }
  .rp-card::before { width: 30px; }
}
@media (max-width: 760px) {
  .rp-flow::before { left: 15px; }
  .rp-stage { display: block; padding-left: 46px; margin-bottom: 32px; }
  .rp-node { left: 0; width: 32px; height: 32px; top: 14px; border-width: 3px; }
  .rp-card::before, .rp-right .rp-card::before { left: auto; right: 100%; width: 30px; }
  .rp-card { padding: 20px 16px; }
  .rp-card h5 { font-size: 15px; }
  .rp-question { flex-wrap: wrap; gap: 4px; }
  .rp-question > span:nth-child(2) { flex: 1; min-width: 90px; }
  .rp-q-icon { display: none; }
  .rp-intro { margin-bottom: 38px; }
  .rp-subtitle { font-size: 18px; }
  .rp-transition { margin-left: 46px; text-align: left; }
  .rp-transition span { border-radius: 12px; }
  .rp-synthesis-flow { flex-direction: column; gap: 4px; }
  .rp-synthesis-flow > span { transform: rotate(90deg); }
  .rp-inline { padding: 12px; font-size: 13px; }
}
@media (prefers-reduced-motion: reduce) {
  .rp-card, .rp-node, .rp-popup-enter-active, .rp-popup-leave-active { transition: none; }
  .rp-observing .rp-stage:not(.rp-revealed) .rp-card { opacity: 1; transform: none; }
}

/* The absolutely positioned panel contributes no intrinsic row height.
   The stage card alone sizes the grid row; the opposite slot stretches to it. */
.rp-findings-slot { position: relative; grid-column: 3; grid-row: 1; min-height: 0; min-width: 0; }
.rp-right .rp-findings-slot { grid-column: 1; }
.rp-card-heading { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
.rp-card-heading .rp-label { margin: 0; }
.rp-status { padding: 3px 8px; border-radius: 999px; font-size: 10px; }
.rp-status-not-started { color: #6d6862; background: #edeae5; }
.rp-status-in-progress { color: #8d4935; background: #f1dfd2; }
.rp-status-completed { color: #4f6550; background: #e3eadf; }
.rp-question-copy { flex: 1; min-width: 0; }
.rp-question-status { display: table; margin-top: 5px; padding: 1px 6px; border-radius: 6px; font-size: 10px; }
@media (max-width: 760px) {
  .rp-findings-slot { height: clamp(460px, 75svh, 640px); margin-top: 18px; }
}
</style>
