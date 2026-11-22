<script setup>
import { nextTick, ref } from 'vue'
import { brainstormingContent, brainstormingIdeas, designPrinciples, howMightWe, ideationContent, potentialGameThemes, supportingTheories } from '../data/ideation'

const steps = ['Design Foundation', 'Design Challenges', 'Theory & Evidence', 'Ideation']
const process = ['Research Insights', 'Design Principles', 'How Might We', 'Theory & Evidence', 'Ideation']
const activeStep = ref(0)
const activeIdea = ref(null)
const stepButtons = ref([])
const stepNavigation = ref(null)
const principlesById = Object.fromEntries(designPrinciples.map(principle => [principle.id, principle]))

async function selectStep(index, focus = false, scroll = false) {
  if (index < 0 || index >= steps.length) return
  activeStep.value = index
  await nextTick()
  if (focus) {
    stepButtons.value[index]?.focus({ preventScroll: true })
    stepButtons.value[index]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' })
  }
  if (scroll) stepNavigation.value?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}
function navigateSteps(event) {
  let index = activeStep.value
  if (event.key === 'ArrowRight') index = (index + 1) % steps.length
  else if (event.key === 'ArrowLeft') index = (index + steps.length - 1) % steps.length
  else if (event.key === 'Home') index = 0
  else if (event.key === 'End') index = steps.length - 1
  else return
  event.preventDefault()
  selectStep(index, true)
}
</script>

<template>
  <div class="ideation">
    <p class="ideation-intro">{{ ideationContent.principlesIntro }}</p>

    <ol class="ideation-process" aria-label="From research to design exploration">
      <li v-for="(item, index) in process" :key="item"><span v-if="index" class="process-link" aria-hidden="true">→</span>{{ item }}</li>
    </ol>

    <div ref="stepNavigation" class="ideation-step-navigation" role="tablist" aria-label="Milestone 4 exploration steps" @keydown="navigateSteps">
      <button v-for="(step, index) in steps" :id="`ideation-step-${index}`" :key="step" :ref="el => stepButtons[index] = el"
        type="button" role="tab" class="ideation-step" :aria-selected="activeStep === index" :aria-controls="`ideation-panel-${index}`"
        :tabindex="activeStep === index ? 0 : -1" @click="selectStep(index)">
        <span class="step-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span><span>{{ step }}</span>
      </button>
    </div>

    <section v-show="activeStep === 0" id="ideation-panel-0" class="ideation-panel" role="tabpanel" aria-labelledby="ideation-step-0" tabindex="0">
      <header class="panel-heading"><h4>Design Principles</h4><p>6 Preliminary Principles</p></header>
      <div class="ideation-grid">
        <details v-for="principle in designPrinciples" :key="principle.id" :id="`ideation-principle-${principle.id}`" class="ideation-disclosure">
          <summary><span class="item-number">{{ principle.id }}</span><h5>{{ principle.title }}</h5><span class="disclosure-indicator" aria-hidden="true"></span></summary>
          <div class="disclosure-content">
            <p>{{ principle.description }}</p>
            <p class="detail-label-small">Research Connection</p>
            <div class="connection-tags"><span v-for="connection in principle.connections" :key="connection">{{ connection }}</span></div>
          </div>
        </details>
      </div>
    </section>

    <section v-show="activeStep === 1" id="ideation-panel-1" class="ideation-panel" role="tabpanel" aria-labelledby="ideation-step-1" tabindex="0">
      <header class="panel-heading"><h4>How Might We</h4><p>3 Design Challenges</p></header>
      <details class="context-disclosure"><summary>About these challenges</summary><p>{{ ideationContent.hmwIntro }}</p></details>
      <div class="hmw-grid">
        <article v-for="hmw in howMightWe" :key="hmw.id" class="hmw-card">
          <p class="ideation-kicker">HMW {{ hmw.id }} — {{ hmw.title }}</p>
          <h5>{{ hmw.question }}</h5>
          <details class="related-principles">
            <summary>Related Principles</summary>
            <ul><li v-for="id in hmw.principleIds" :key="id">{{ id }} — {{ principlesById[id].title }}</li></ul>
          </details>
        </article>
      </div>
    </section>

    <section v-show="activeStep === 2" id="ideation-panel-2" class="ideation-panel" role="tabpanel" aria-labelledby="ideation-step-2" tabindex="0">
      <header class="panel-heading"><h4>Relevant Theory, Evidence &amp; Approaches</h4><p>Potential Supporting Theories <span class="ideation-badge">Preliminary</span></p></header>
      <div class="ideation-grid">
        <article v-for="theory in supportingTheories" :key="theory.id" class="theory-card">
          <div class="theory-heading"><p class="ideation-kicker">Theory {{ theory.id }}</p><span class="ideation-badge">{{ theory.status }}</span></div>
          <h5>{{ theory.title }}</h5>
          <dl><dt>Focus</dt><dd>{{ theory.focus }}</dd></dl>
          <details class="related-principles"><summary>Potential Connection</summary><p>{{ theory.connection }}</p></details>
        </article>
      </div>
    </section>

    <section v-show="activeStep === 3" id="ideation-panel-3" class="ideation-panel" role="tabpanel" aria-labelledby="ideation-step-3" tabindex="0">
      <header class="panel-heading"><h4>Initial Brainstorming Ideas</h4><p><span class="ideation-badge">Preliminary</span></p></header>
      <p class="section-intro">{{ brainstormingContent.intro }}</p>
      <div class="idea-choices" aria-label="Initial brainstorming ideas">
        <button v-for="idea in brainstormingIdeas" :key="idea.id" type="button" class="idea-choice"
          :aria-expanded="activeIdea === idea.id" :aria-controls="`idea-description-${idea.id}`"
          @click="activeIdea = activeIdea === idea.id ? null : idea.id">
          <span class="item-number">{{ idea.id }}</span>{{ idea.title }}
        </button>
      </div>
      <div v-for="idea in brainstormingIdeas" v-show="activeIdea === idea.id" :id="`idea-description-${idea.id}`" :key="idea.id" class="idea-description" role="region" :aria-label="idea.title">
        <p>{{ idea.description }}</p>
      </div>

      <section class="learning-approach" aria-labelledby="ideation-learning-title">
        <h5 id="ideation-learning-title">Potential Learning Approach</h5>
        <details><summary>{{ brainstormingContent.learningApproach.title }}</summary><p>{{ brainstormingContent.learningApproach.description }}</p></details>
      </section>

      <section aria-labelledby="ideation-themes-title">
        <div class="themes-heading"><h5 id="ideation-themes-title">Potential Game Themes</h5><span class="ideation-badge">Exploratory</span></div>
        <details class="context-disclosure"><summary>About these themes</summary><p>{{ brainstormingContent.themesIntro }}</p></details>
        <div class="theme-grid">
          <details v-for="theme in potentialGameThemes" :key="theme.id" class="ideation-disclosure">
            <summary><span class="item-number">{{ theme.id }}</span><h6>{{ theme.title }}</h6><span class="disclosure-indicator" aria-hidden="true"></span></summary>
            <div class="disclosure-content"><p>{{ theme.description }}</p></div>
          </details>
        </div>
      </section>
    </section>

    <footer class="ideation-footer" aria-label="Navigate ideation steps">
      <button type="button" :disabled="activeStep === 0" @click="selectStep(activeStep - 1, true, true)">Previous</button>
      <span aria-live="polite">Step {{ activeStep + 1 }} of {{ steps.length }}</span>
      <button type="button" :disabled="activeStep === steps.length - 1" @click="selectStep(activeStep + 1, true, true)">Next</button>
    </footer>
  </div>
</template>

<style scoped>
.ideation { grid-column: 1 / -1; min-width: 0; color: #665249; font-size: 1rem; line-height: 1.65; }
.ideation-intro { margin: 0 0 18px; max-width: 850px; }
.ideation-process { display: flex; flex-wrap: wrap; gap: 6px 10px; list-style: none; margin: 0 0 24px; padding: 0; color: #8b5440; font-size: .8125rem; }
.ideation-process li { display: flex; align-items: center; gap: 10px; }
.process-link { color: #b78d75; }
.ideation-step-navigation { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; padding: 6px; border: 1px solid #e4d5c6; border-radius: 15px; background: #fffaf4; scroll-margin-top: 24px; }
.ideation-step { display: flex; align-items: center; justify-content: center; gap: 9px; min-width: 0; min-height: 52px; padding: 10px; border: 0; border-radius: 10px; background: transparent; color: #735f53; font: inherit; font-size: .875rem; line-height: 1.4; text-align: left; cursor: pointer; transition: background .16s ease, color .16s ease; }
.step-number { display: grid; place-items: center; flex: 0 0 26px; height: 26px; border-radius: 50%; background: #efe3d6; color: #9d4b34; font-size: .75rem; }
.ideation-step:hover { background: #f1e5d8; }
.ideation-step[aria-selected='true'] { background: #b86445; color: #fff; }
.ideation-step[aria-selected='true'] .step-number { background: #ffffff24; color: #fff; }
.ideation-panel { padding: 26px 0 8px; animation: ideation-enter .16s ease; }
.panel-heading { margin-bottom: 18px; }
.panel-heading h4 { margin: 0; color: #403029; font: 600 clamp(1.5rem, 3vw, 2rem)/1.25 'Playfair Display', serif; }
.panel-heading > p { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin: 8px 0 0; color: #a6543a; font-size: .875rem; }
.ideation-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; align-items: start; }
.ideation h5, .ideation h6 { margin: 0; color: #554138; font: 600 1.125rem/1.4 'Playfair Display', serif; }
.ideation-disclosure { min-width: 0; border: 1px solid #e4d5c6; border-radius: 13px; background: #fffaf4; overflow-wrap: anywhere; }
.ideation-disclosure > summary { display: flex; align-items: baseline; gap: 10px; min-height: 64px; padding: 16px; list-style: none; cursor: pointer; }
.ideation-disclosure > summary::-webkit-details-marker { display: none; }
.ideation-disclosure > summary h5, .ideation-disclosure > summary h6 { flex: 1; font-size: 1rem; }
.item-number { flex-shrink: 0; color: #a6543a; font-size: .8125rem; font-weight: 600; }
.disclosure-indicator { margin-left: auto; color: #9d4b34; }
.disclosure-indicator::after { content: '+'; }
details[open] > summary .disclosure-indicator::after { content: '−'; }
.disclosure-content { padding: 0 16px 16px; font-size: .9375rem; }
p { overflow-wrap: anywhere; }
.disclosure-content > p { margin: 0; }
.disclosure-content .detail-label-small { margin: 16px 0 8px; font-size: .8125rem; font-weight: 600; color: #9d4b34; }
.connection-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.connection-tags span { padding: 4px 8px; border-radius: 8px; background: #f1e5d8; font-size: .8125rem; }
.ideation-badge { display: inline-block; flex-shrink: 0; padding: 4px 9px; border-radius: 999px; background: #f1e5d8; color: #783f2d; font-size: .8125rem; line-height: 1.5; }
.context-disclosure { margin: 0 0 18px; font-size: .875rem; }
.context-disclosure > p { margin: 8px 0 0; }
summary { cursor: pointer; color: #9d4b34; }
.hmw-grid, .theme-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; align-items: start; }
.hmw-card, .theory-card { min-width: 0; padding: 18px; border: 1px solid #e4d5c6; border-radius: 13px; background: #fffaf4; overflow-wrap: anywhere; }
.hmw-card { border-top: 3px solid #b86445; }
.ideation-kicker { margin: 0 0 10px; color: #a6543a; font-size: .8125rem; font-weight: 600; }
.hmw-card h5 { font-size: 1.0625rem; }
.related-principles { margin-top: 16px; padding-top: 12px; border-top: 1px solid #eadbcd; font-size: .875rem; }
.related-principles ul { margin: 10px 0 0; padding-left: 18px; }
.related-principles li + li { margin-top: 6px; }
.related-principles p { margin: 10px 0 0; }
.theory-heading { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
.theory-heading .ideation-kicker { margin: 0; }
.theory-card dl { margin: 12px 0 0; }
.theory-card dt { font-size: .8125rem; font-weight: 600; color: #783f2d; }
.theory-card dd { margin: 4px 0 0; font-size: .9375rem; }
.section-intro { margin: 0 0 16px; font-size: .9375rem; }
.idea-choices { display: flex; flex-wrap: wrap; gap: 8px; }
.idea-choice { display: flex; align-items: baseline; gap: 8px; padding: 10px 12px; min-height: 44px; max-width: 100%; border: 1px solid #e4d5c6; border-radius: 10px; background: #fffaf4; color: #554138; font: inherit; font-size: .875rem; text-align: left; cursor: pointer; }
.idea-choice:hover { background: #f1e5d8; }
.idea-choice[aria-expanded='true'] { background: #f1e5d8; border-color: #b86445; }
.idea-description { margin-top: 12px; padding: 12px 16px; border-left: 2px solid #b86445; border-radius: 0 10px 10px 0; background: #fffaf4; }
.idea-description p { margin: 0; font-size: .9375rem; }
.learning-approach { margin: 24px 0; padding: 14px 16px; border-radius: 12px; background: #eee2d4; }
.learning-approach > h5 { margin-bottom: 8px; font: 600 .8125rem/1.5 'DM Sans', sans-serif; color: #783f2d; }
.learning-approach details { font-size: .9375rem; }
.learning-approach p { margin: 8px 0 0; }
.themes-heading { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
.ideation-footer { display: flex; flex-direction: row; justify-content: space-between; align-items: center; gap: 12px; margin-top: 24px; padding: 18px 0 0; border-top: 1px solid #e4d5c6; color: #735f53; font-size: .8125rem; }
.ideation-footer button { min-height: 44px; padding: 9px 16px; border: 1px solid #e4d5c6; border-radius: 10px; background: #fffaf4; color: #783f2d; font: inherit; font-size: .875rem; cursor: pointer; }
.ideation-footer button:hover:not(:disabled) { background: #f1e5d8; }
.ideation-footer button:disabled { opacity: .4; cursor: default; }
.ideation button:focus-visible, .ideation summary:focus-visible, .ideation-panel:focus-visible { outline: 2px solid #9d4b34; outline-offset: 3px; border-radius: 6px; }
@keyframes ideation-enter { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 1000px) { .hmw-grid { grid-template-columns: 1fr; } }
@media (max-width: 700px) {
  .ideation-step-navigation { display: flex; overflow-x: auto; scrollbar-width: thin; scroll-snap-type: x proximity; }
  .ideation-step { flex: 0 0 148px; justify-content: flex-start; scroll-snap-align: start; }
  .ideation-grid, .theme-grid { grid-template-columns: 1fr; }
  .ideation-panel { padding-top: 22px; }
}
@media (prefers-reduced-motion: reduce) { .ideation-panel { animation: none; } .ideation-step { transition: none; } }
</style>
