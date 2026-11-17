<script setup>
import FrameworkConcept from './FrameworkConcept.vue'
defineEmits(['reference'])
const factors = [
  ['Individual Epistemic Competencies', 'How people explain their knowledge, recognize its limits, and engage with unfamiliar expertise.'],
  ['Shared Assumptions About Teamwork', 'Team expectations about agreement, expertise, and what it means to work together.'],
  ['Social Context', 'The interpersonal and educational setting can shape how safe it feels to question or acknowledge uncertainty.']
]
const productive = [
  ['Epistemic Stability', 'Explain your expertise and its limits. The article calls this epistemic steadiness.'],
  ['Epistemic Adaptability', 'Acknowledge not-knowing and remain curious about others’ expertise.'],
  ['Constructive Questioning', 'Ask questions to explore reasoning and assumptions together.'],
  ['Critical Engagement with Different Perspectives', 'Examine and connect different contributions rather than simply agreeing.']
]
const unproductive = [
  ['Conformative Dynamics', 'Quick agreement can leave important differences unexplored.'],
  ['Performative Dynamics', 'Appearing knowledgeable can take precedence over exploring uncertainty.'],
  ['Avoidance of Differences', 'Distinct disciplinary contributions can be ignored or smoothed over.'],
  ['Avoidance of Not-knowing', 'Concealing uncertainty can close opportunities to learn from others.']
]
</script>

<template>
  <section class="knowledge-framework" aria-labelledby="knowledge-framework-title">
    <h3 id="knowledge-framework-title">From Interdisciplinary Expertise to Knowledge Integration</h3>
    <p>Understanding how different expertise, epistemic competencies, and team dynamics shape interdisciplinary collaboration.</p>
    <p class="framework-note">My conceptual synthesis informed by one qualitative case study in Horn et al. (2023), rather than an official causal model. Arrows indicate conceptual relationships, not proven or deterministic causation.</p>
    <p class="framework-hint">Hover over a concept, or tap or press Enter to expand its explanation.</p>
    <div class="framework-stage">
      <p class="stage-label">Stage 1 — Collaboration Context</p>
      <h4>Interdisciplinary Master's Teams</h4>
      <p>Students bring different academic backgrounds, expertise, knowledge, and perspectives.</p>
    </div>
    <div class="framework-arrow" aria-hidden="true">↓</div>
    <div class="framework-stage">
      <p class="stage-label">Stage 2 — Collaborative Demands</p>
      <h4>Relative Expertise: Expert &amp; Non-expert Roles</h4>
      <p>Team members contribute their own expertise while engaging with and learning from the expertise of others.</p>
      <div class="concept-grid">
        <FrameworkConcept title="Contributory Expertise" explanation="Knowledge and skills that enable a person to contribute within their own discipline." />
        <FrameworkConcept title="Interactional Expertise" explanation="Understanding enough of another discipline’s language and reasoning to engage in meaningful discussion, without becoming a contributing specialist." />
      </div>
    </div>
    <div class="framework-arrow" aria-hidden="true">↓</div>
    <div class="framework-stage">
      <p class="stage-label">Stage 3 — Factors Shaping Team Interaction</p>
      <div class="factor-network">
        <template v-for="(factor, index) in factors" :key="factor[0]">
          <span v-if="index" class="factor-link" aria-label="interacts with">↔</span>
          <FrameworkConcept :title="factor[0]" :explanation="factor[1]" />
        </template>
      </div>
      <p>These factors interact and influence how team members contribute knowledge, respond to differences, and deal with uncertainty.</p>
    </div>
    <div class="framework-arrow" aria-hidden="true">↓</div>
    <div class="framework-stage">
      <p class="stage-label">Stage 4 — Team Interaction Dynamics</p>
      <p>Contrasting patterns, not fixed outcomes. Productive behaviors describe desired conditions; unproductive dynamics were observed in the study.</p>
      <div class="dynamics-grid">
        <section class="dynamics productive">
          <h4>Productive / Desired Behaviors</h4>
          <FrameworkConcept v-for="concept in productive" :key="concept[0]" :title="concept[0]" :explanation="concept[1]" />
        </section>
        <section class="dynamics unproductive">
          <h4>Unproductive / Observed Dynamics</h4>
          <FrameworkConcept v-for="concept in unproductive" :key="concept[0]" :title="concept[0]" :explanation="concept[1]" />
        </section>
      </div>
    </div>
    <div class="framework-arrow" aria-hidden="true">↓</div>
    <div class="framework-stage outcome">
      <p class="stage-label">Stage 5 — Desired Outcome</p>
      <h4>Meaningful Knowledge Integration</h4>
      <p>Team members build shared understanding by critically engaging with and integrating knowledge from different disciplines.</p>
      <p class="framework-note">Diverse expertise alone does not guarantee integration. The observed unproductive dynamics can impede it.</p>
    </div>
    <p class="framework-source">Conceptual synthesis based on <a href="#research-note-horn-2023" @click.prevent="$emit('reference', 'horn-2023')">Horn et al. (2023)</a>.</p>
  </section>
</template>

<style scoped>
.knowledge-framework { container-type: inline-size; }
h3 { margin: 0 0 12px; color: #783f2d; font: 600 22px/1.35 'Playfair Display', serif; }
h4 { margin: 8px 0; font-size: 14px; line-height: 1.5; color: #554138; }
p { margin: 10px 0; }
.framework-note, .framework-hint, .framework-source { font-size: 12px; line-height: 1.7; color: #735f53; }
.framework-note { padding-left: 12px; border-left: 2px solid #d8b5a1; }
.framework-hint { margin-bottom: 20px; }
.framework-stage { padding: 16px; border: 1px solid #e4d5c6; border-radius: 16px; background: #fffaf4; }
.stage-label { margin: 0; color: #9d4b34; font-size: 11px; font-weight: 600; }
.framework-arrow { text-align: center; color: #a6543a; font-size: 23px; line-height: 1.8; }
.concept-grid, .dynamics-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.factor-network { display: flex; flex-direction: column; margin-top: 12px; }
.factor-link { text-align: center; color: #9d4b34; line-height: 1.4; }
.dynamics { min-width: 0; padding: 12px; border: 1px solid; border-radius: 12px; }
.dynamics h4 { margin-top: 0; font-size: 12px; }
.dynamics :deep(details + details) { margin-top: 8px; }
.productive { background: #edf0e7; border-color: #cdd5c2; }
.unproductive { background: #f4e6dd; border-color: #e2c8b9; }
a { color: #9d4b34; text-underline-offset: 3px; }
@container (max-width: 360px) {
  .dynamics-grid, .concept-grid { grid-template-columns: 1fr; }
  .framework-stage { padding: 12px; }
}
</style>
