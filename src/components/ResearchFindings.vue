<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import KnowledgeFramework from './KnowledgeFramework.vue'
import { researchStatusLabels } from '../data/researchPlan'

const props = defineProps({
  stage: { type: Object, required: true },
  questionId: { type: String, required: true },
  showDirections: Boolean
})
const emit = defineEmits(['select', 'close', 'reference'])
const content = ref(null)
const view = ref('insights')
const hasFramework = computed(() => props.stage.id === 2)
const views = [{ id: 'insights', label: 'Research Insights' }, { id: 'framework', label: 'Conceptual Framework' }]
const index = computed(() => props.stage.questions.findIndex(q => q.id === props.questionId))
const question = computed(() => props.stage.questions[index.value])
const sections = computed(() => question.value.findings?.sections ?? [])

function navigate(offset) {
  const next = props.stage.questions[index.value + offset]
  if (next) emit('select', next.id)
}
watch(() => props.questionId, async () => {
  await nextTick()
  if (content.value) content.value.scrollTop = 0
})
</script>

<template>
  <section :id="`rp-findings-${stage.id}`" class="research-findings" :aria-labelledby="`rp-findings-title-${stage.id}`">
    <header class="findings-header">
      <div class="findings-heading-row">
        <p class="findings-label">RESEARCH FINDINGS</p>
        <button type="button" class="findings-button findings-close" aria-label="Close research findings" @click="emit('close')">×</button>
      </div>
      <h6 :id="`rp-findings-title-${stage.id}`" aria-live="polite">{{ question.id }}. {{ question.question }}</h6>
      <p class="findings-status">{{ researchStatusLabels[question.status] }}</p>
    </header>

    <nav v-if="hasFramework" class="findings-views" aria-label="Research findings views">
      <button v-for="item in views" :key="item.id" type="button" :aria-pressed="view === item.id"
        :aria-controls="`findings-${item.id}-${stage.id}`" @click="view = item.id">{{ item.label }}</button>
    </nav>
    <div v-show="!hasFramework || view === 'insights'" :id="`findings-insights-${stage.id}`" ref="content" class="findings-content" tabindex="0" role="region" :aria-label="`${question.id} research findings, scroll to read more`">
      <details v-if="showDirections" :key="question.id" class="findings-directions">
        <summary>Research directions</summary>
        <ul><li v-for="direction in question.directions" :key="direction">{{ direction }}</li></ul>
      </details>
      <template v-if="sections.length">
        <section v-for="(section, sectionIndex) in sections" :key="`${question.id}-${sectionIndex}`" :class="{ 'findings-reflection': section.reflection }" class="findings-section">
          <h6 v-if="section.heading">{{ section.heading }}</h6>
          <p v-for="(paragraph, paragraphIndex) in section.paragraphs" :key="paragraphIndex">{{ paragraph }}</p>
          <component :is="section.ordered ? 'ol' : 'ul'" v-if="section.bullets?.length"><li v-for="(bullet, bulletIndex) in section.bullets" :key="bulletIndex">{{ bullet }}</li></component>
          <p v-if="section.conclusion">{{ section.conclusion }}</p>
          <a v-if="section.cite" class="findings-citation" :href="`#research-note-${question.findings.referenceId}`" @click.prevent="emit('reference', question.findings.referenceId)">(Horn et al., 2023)</a>
        </section>
      </template>
      <div v-else class="findings-placeholder">
        <p class="findings-label">RESEARCH IN PROGRESS</p>
        <p>Research findings for this question will be added as the study progresses.</p>
      </div>
    </div>

    <div v-if="hasFramework" v-show="view === 'framework'" :id="`findings-framework-${stage.id}`" class="findings-content" tabindex="0" role="region" aria-label="Conceptual framework, scroll to explore">
      <KnowledgeFramework @reference="emit('reference', $event)" />
    </div>

    <footer class="findings-navigation" aria-label="Questions in this stage">
      <button type="button" class="findings-button" aria-label="Previous question in this stage" :disabled="index === 0" @click="navigate(-1)">←</button>
      <span :aria-label="`Question ${index + 1} of ${stage.questions.length} in this stage`">{{ question.id }} <span aria-hidden="true">/</span> {{ stage.questions.length }}</span>
      <button type="button" class="findings-button" aria-label="Next question in this stage" :disabled="index === stage.questions.length - 1" @click="navigate(1)">→</button>
    </footer>
  </section>
</template>

<style scoped>
.research-findings { position: absolute; inset: 0; display: flex; flex-direction: column; overflow: hidden; min-width: 0; border: 1px solid #e4d5c6; border-radius: 20px; background: #fffdf9; box-shadow: 0 8px 26px #783f2d08; color: #554138; }
.findings-views { display: flex; gap: 6px; padding: 10px 16px; border-bottom: 1px solid #eadccf; }
.findings-views button { flex: 1; min-width: 0; padding: 10px 6px; border: 1px solid #e4d5c6; border-radius: 10px; background: #fffaf4; color: #783f2d; font-size: 12px; cursor: pointer; }
.findings-views button[aria-pressed='true'] { background: #b86445; border-color: #b86445; color: #fff; }
.findings-views button:focus-visible { outline: 2px solid #783f2d; outline-offset: 2px; }
.findings-reflection { padding: 16px; border-left: 2px solid #d8b5a1; background: #f7f1e8; border-radius: 0 12px 12px 0; }
.findings-citation { color: #9d4b34; font-size: 12px; text-underline-offset: 3px; }
.findings-header { flex: 0 0 auto; padding: 20px 24px 16px; border-bottom: 1px solid #eadccf; }
.findings-heading-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.findings-label { margin: 0; color: #a6543a; font-size: 11px; font-weight: 600; letter-spacing: .13em; }
.findings-header h6 { margin: 10px 0; font: inherit; font-size: 15px; font-weight: 600; line-height: 1.5; }
.findings-status { margin: 0; font-size: 12px; color: #735f53; }
.findings-content { flex: 1 1 0; min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; scrollbar-color: #c6a78f #fffaf4; padding: 24px; font-size: 14px; line-height: 1.8; overflow-wrap: anywhere; }
.findings-section + .findings-section { margin-top: 26px; }
.findings-section h6 { margin: 0 0 12px; color: #783f2d; font-family: 'Playfair Display', serif; font-size: 18px; line-height: 1.4; }
.findings-section p { margin: 0 0 16px; }
.findings-section p:last-child { margin-bottom: 0; }
.findings-content ul { padding-left: 20px; }
.findings-content li + li { margin-top: 8px; }
.findings-navigation { flex: 0 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 12px 20px; border-top: 1px solid #eadccf; font-size: 13px; }
.findings-button { flex-shrink: 0; width: 40px; height: 40px; border: 1px solid #e4d5c6; border-radius: 50%; background: #fffaf4; color: #9d4b34; font-size: 20px; cursor: pointer; }
.findings-button:hover:not(:disabled) { background: #f1e5d8; }
.findings-button:disabled { opacity: .35; cursor: default; }
.findings-close { width: 32px; height: 32px; font-size: 24px; }
.findings-button:focus-visible, .findings-content:focus-visible, summary:focus-visible { outline: 2px solid #9d4b34; outline-offset: -3px; }
.findings-directions { margin-bottom: 24px; font-size: 13px; }
.findings-directions summary { color: #9d4b34; cursor: pointer; }
@media (max-width: 1000px) {
  .findings-header { padding: 16px; }
  .findings-content { padding: 16px; }
  .findings-navigation { padding: 10px 16px; }
}
@media (max-width: 760px) {
  .findings-header h6 { font-size: 14px; }
  .findings-heading-row { flex-wrap: wrap; }
  .findings-navigation { padding: 10px; }
}
</style>
