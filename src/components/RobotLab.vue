<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { discussionPrompts, playerRoles, reflectionQuestions, robotComponents, robotSlots } from '../data/robotLab.js'
import { componentById } from '../game/robotLabLogic.js'
import { useRobotLab } from '../composables/useRobotLab.js'
import RobotIllustration from './RobotIllustration.vue'
import RobotModuleIcon from './RobotModuleIcon.vue'

const { player, assembly, selectedComponent, selectedSlot, selectedPart, installedCount, readyToTest, completed, testResult, feedback, switchPlayer, install, remove, runTest, reset } = useRobotLab()
const role = computed(() => playerRoles[player.value])
const category = ref('all')
const visibleComponents = computed(() => robotComponents.filter(part => category.value === 'all' || part.slot === category.value))
const selectedSocket = computed(() => robotSlots.find(slot => slot.id === selectedSlot.value))
const completedPanel = ref(null)
const thesisUrl = `${import.meta.env.BASE_URL}?milestone=5`
let previousTitle
onMounted(() => { previousTitle = document.title; document.title = 'Robot Lab — A Collaborative Robot Building Game' })
onBeforeUnmount(() => { document.title = previousTitle })
function changePlayer(next) { switchPlayer(next); category.value = 'all' }
function startAgain() { reset(); category.value = 'all' }
function pickPart(part) { if (!Object.values(assembly.value).includes(part.id)) selectedComponent.value = part.id }
watch(completed, async value => {
  if (!value) return
  await nextTick()
  completedPanel.value?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' })
  completedPanel.value?.focus({ preventScroll: true })
})
</script>

<template>
  <main class="robot-lab" :class="`view-${player.toLowerCase()}`">
    <header class="lab-header">
      <a class="lab-brand" :href="thesisUrl" aria-label="Robot Lab, return to Milestone 5"><span class="brand-mark" aria-hidden="true"><RobotModuleIcon kind="control" /></span><span>ROBOT LAB<small>A collaborative building experiment</small></span></a>
      <span class="prototype-label">M5 · LOW-FIDELITY PROTOTYPE</span>
      <div class="lab-header-actions"><a :href="thesisUrl">Back to thesis</a><button type="button" class="quiet-button" @click="startAgain">Restart mission</button></div>
    </header>

    <section class="mission-banner" aria-labelledby="lab-mission-title">
      <div class="mission-number"><span>MISSION</span><strong>01</strong></div>
      <div class="mission-copy"><p class="lab-eyebrow">FRAGILE CARGO · COOPERATIVE ASSEMBLY</p><h1 id="lab-mission-title">Handle with care.</h1><p>Build a robot that can carry a fragile object.</p>
        <ul class="mission-goals"><li>Detect obstacles</li><li>Move safely</li><li>Protect fragile cargo</li><li>Maintain sufficient power</li></ul>
      </div>
      <svg class="cargo-illustration" viewBox="0 0 140 120" fill="none" aria-hidden="true"><ellipse cx="70" cy="104" rx="43" ry="8" fill="#d3b880" opacity=".3"/><path d="m31 40 39-21 39 21v45l-39 22-39-22z" fill="#ead49d" stroke="#ae8e54" stroke-width="2"/><path d="m31 40 39 22 39-22M70 62v45M50 30l40 22v20l-17 9V62L50 49z" stroke="#ae8e54" stroke-width="2"/><path d="m48 62 8 8-4 10 8 9" stroke="#ac7951" stroke-width="2.5" stroke-linecap="round"/><path d="M118 23v12M112 29h12M20 72v8M16 76h8" stroke="#bc9749" stroke-width="2" stroke-linecap="round"/></svg>
    </section>

    <div class="view-toolbar">
      <div class="player-switch" role="group" aria-label="Current player view"><button type="button" :aria-pressed="player === 'A'" @click="changePlayer('A')"><span class="player-letter">A</span>View as Player A</button><button type="button" :aria-pressed="player === 'B'" @click="changePlayer('B')"><span class="player-letter">B</span>View as Player B</button></div>
      <p>Each player has different knowledge. Discuss what you know before making decisions.</p>
      <div class="assembly-meter" :aria-label="`${installedCount} of 4 modules installed`"><span>{{ installedCount }}<small> / 4 installed</small></span><div class="meter-track"><span :style="{ width: `${installedCount * 25}%` }"></span></div></div>
    </div>

    <div class="lab-workspace">
      <aside class="lab-panel knowledge-panel" aria-labelledby="knowledge-title">
        <div class="panel-topline"><span class="lab-eyebrow">YOUR FIELD NOTES</span><span class="private-label">PLAYER {{ player }} ONLY</span></div>
        <div class="role-heading"><span class="role-avatar">{{ player }}</span><div><h2 id="knowledge-title">{{ role.name }}</h2><p>{{ role.label }}</p></div></div>
        <p class="role-intro">{{ role.intro }}</p>
        <ol class="knowledge-notes"><li v-for="note in role.notes" :key="note">{{ note }}</li></ol>
        <div v-if="selectedPart" :key="`${player}-${selectedPart.id}`" class="selected-note"><p class="lab-eyebrow">UNDER THE LENS</p><h3>{{ selectedPart.name }}</h3><template v-if="player === 'A'"><p>{{ selectedPart.function }}</p><p class="note-question">{{ selectedPart.note }}</p></template><template v-else><p>Interface <strong>{{ selectedPart.port }}</strong></p><p class="note-question">Compare this interface with the chassis rules. Ask your partner about its function and energy before choosing it.</p></template></div>
        <details class="discussion-card"><summary>Conversation starters</summary><ul><li v-for="prompt in discussionPrompts" :key="prompt">“{{ prompt }}”</li></ul></details>
        <p class="privacy-note">Single-device simulation: switch views to consult each role’s notes. Shared assembly stays in place.</p>
      </aside>

      <section class="lab-panel assembly-panel" aria-labelledby="assembly-title">
        <div class="assembly-panel-heading"><div><p class="lab-eyebrow">SHARED WORKBENCH</p><h2 id="assembly-title">Meet your work in progress.</h2></div><span class="build-status" :class="{ complete: completed }">{{ completed ? 'Activated' : readyToTest ? 'Ready to test' : 'Assembly in progress' }}</span></div>
        <div class="robot-stage"><span class="bench-label">CHASSIS R-01</span><RobotIllustration :assembly="assembly" :activated="completed" /><span class="bench-status"><span></span>{{ completed ? 'Cargo delivered safely' : 'Structural frame pre-assembled' }}</span></div>
        <div class="socket-heading"><h3>Choose a socket</h3><span>Select a part, then its destination.</span></div>
        <div class="socket-grid" role="group" aria-label="Robot assembly sockets">
          <div v-for="slot in robotSlots" :key="slot.id" class="socket-item" :class="{ filled: assembly[slot.id], chosen: selectedSlot === slot.id }">
            <button type="button" class="socket-button" :aria-pressed="selectedSlot === slot.id" @click="selectedSlot = slot.id"><span class="socket-name">{{ slot.label }}</span><span class="socket-value">{{ assembly[slot.id] ? componentById[assembly[slot.id]].name : 'Empty socket' }}</span><span v-if="player === 'B'" class="socket-port">{{ slot.port }}</span></button>
            <button v-if="assembly[slot.id]" type="button" class="remove-part" :aria-label="`Remove ${componentById[assembly[slot.id]].name} from ${slot.label}`" @click="remove(slot.id)">Remove</button>
          </div>
        </div>
        <div class="install-strip"><p><strong>{{ selectedPart?.name ?? 'No component selected' }}</strong><span>{{ selectedSocket ? `Destination: ${selectedSocket.label}` : 'Choose a socket above' }}</span></p><button type="button" class="primary-button" :disabled="!selectedComponent || !selectedSlot" @click="install">{{ selectedSlot && assembly[selectedSlot] ? 'Replace component' : 'Install component' }}<span aria-hidden="true">＋</span></button></div>
        <div class="assembly-feedback" :class="feedback.tone" role="status" aria-live="polite" aria-atomic="true"><span class="feedback-mark" aria-hidden="true">{{ feedback.tone === 'caution' ? '?' : feedback.tone === 'success' ? '✓' : 'i' }}</span><p>{{ feedback.message }}</p></div>
        <div class="test-strip"><div><h3>Ready for a gentle test run?</h3><p>Connections are one thing. Carrying the cargo is another.</p></div><button type="button" class="test-button" :disabled="!readyToTest || completed" @click="runTest">{{ completed ? 'Mission complete' : 'Activate & test' }}</button></div>
        <ul v-if="testResult && !completed" class="test-observations" aria-label="Field test observations"><li v-for="check in testResult.checks" :key="check.id" :class="{ passed: check.ok }"><strong>{{ check.ok ? '✓' : '•' }} {{ check.label }}</strong><p v-if="!check.ok">{{ check.observation }}</p></li></ul>
      </section>

      <aside class="lab-panel inventory-panel" aria-labelledby="inventory-title">
        <div class="panel-topline"><span class="lab-eyebrow">PARTS SHELF</span><span class="part-count">{{ robotComponents.length }} components</span></div><h2 id="inventory-title">Small parts. Big possibilities.</h2>
        <label class="inventory-filter">Browse components<select v-model="category"><option value="all">All components</option><option v-for="slot in robotSlots" :key="slot.id" :value="slot.id">{{ slot.label }}</option></select></label>
        <div class="parts-list"><article v-for="part in visibleComponents" :key="part.id" class="part-card" :class="{ selected: selectedComponent === part.id, installed: Object.values(assembly).includes(part.id) }"><div class="part-card-top"><span class="part-icon" :class="part.icon"><RobotModuleIcon :kind="part.icon" /></span><div><h3>{{ part.name }}</h3><span v-if="Object.values(assembly).includes(part.id)" class="part-installed">Installed</span></div><button type="button" :disabled="Object.values(assembly).includes(part.id)" :aria-pressed="selectedComponent === part.id" :aria-label="`Select ${part.name}`" @click="pickPart(part)">{{ Object.values(assembly).includes(part.id) ? '✓' : selectedComponent === part.id ? 'Selected' : 'Select' }}</button></div><p v-if="player === 'A'" class="part-description">{{ part.function }}</p><p v-else class="part-description">Interface <strong>{{ part.port }}</strong><span class="unknown-function">Function & energy: ask Player A</span></p></article></div>
        <p class="inventory-hint">Not every useful-looking part is right for this mission.</p>
      </aside>
    </div>

    <section v-if="completed" ref="completedPanel" class="completion-panel" tabindex="-1" aria-labelledby="completion-title"><span class="completion-seal" aria-hidden="true">✓</span><div class="completion-copy"><p class="lab-eyebrow">MISSION 01 · CARGO DELIVERED</p><h2 id="completion-title">Mission Complete!</h2><p>A steady grip, a gentle journey, and a little shared understanding.</p><h3>Before you leave the lab</h3><ol><li v-for="question in reflectionQuestions" :key="question">{{ question }}</li></ol><button type="button" class="quiet-button" @click="startAgain">Try another conversation</button></div></section>
    <div class="lab-footnote"><span>ROBOT LAB · MILESTONE 5</span><p>An early design prototype exploring opportunities for CPS practice. Mission completion is not evidence of CPS improvement.</p><span>One mission · Two perspectives</span></div>
  </main>
</template>

<style scoped>
.robot-lab { --lab-ink: #304c45; --lab-muted: #6b7970; --lab-teal: #386b5f; --lab-paper: #fffdf7; --lab-line: #e1dfd1; padding: 24px clamp(18px, 3vw, 52px) 18px; min-height: 100vh; background: radial-gradient(ellipse at 55% 30%, #f7edd5 0, transparent 55%), #f2efe5; color: var(--lab-ink); font: 400 1rem/1.55 'DM Sans', sans-serif; }
.robot-lab * { box-sizing: border-box; }
.robot-lab button, .robot-lab select, .robot-lab a { -webkit-tap-highlight-color: transparent; }
.robot-lab button { font: inherit; cursor: pointer; transition: background .15s ease, border-color .15s ease, box-shadow .15s ease; }
.robot-lab button:disabled { opacity: .4; cursor: default; }
.robot-lab button:focus-visible, .robot-lab a:focus-visible, .robot-lab select:focus-visible, .robot-lab summary:focus-visible, .completion-panel:focus-visible { outline: 3px solid #bd7552; outline-offset: 3px; }
.lab-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 18px; max-width: 1600px; margin: auto auto 24px; }
.lab-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--lab-ink); font-size: 1.35rem; font-weight: 600; letter-spacing: .09em; }
.lab-brand small { display: block; font-size: .75rem; letter-spacing: .01em; font-weight: 400; color: var(--lab-muted); }
.brand-mark { display: grid; place-items: center; width: 47px; height: 47px; border-radius: 14px; background: var(--lab-teal); color: #f5edca; }
.brand-mark svg { width: 31px; height: 31px; }
.prototype-label { font-size: .75rem; letter-spacing: .1em; color: #857a62; }
.lab-header-actions { display: flex; align-items: center; gap: 20px; }
.lab-header-actions a { font-size: .875rem; text-decoration: none; color: #69776a; }
.quiet-button { padding: 9px 14px; border: 1px solid #d6d8ca; border-radius: 9px; background: #fffdf780; color: #496457; font-size: .875rem !important; }
.quiet-button:hover { background: #e9e9db; }
.mission-banner { display: flex; align-items: center; gap: 24px; max-width: 1600px; margin: auto; padding: 25px 30px; border: 1px solid #ddd6c1; border-radius: 18px; background: #f5ecd7; }
.mission-number { align-self: stretch; display: flex; flex-direction: column; justify-content: center; border-right: 1px solid #dbcdad; padding-right: 26px; color: #9d7d43; }
.mission-number span { font-size: .75rem; letter-spacing: .13em; }
.mission-number strong { font: 600 3.2rem/1.2 'Playfair Display', serif; }
.lab-eyebrow { margin: 0; font-size: .75rem; letter-spacing: .11em; font-weight: 600; color: #6d8071; }
.mission-copy { flex: 1; }
.mission-copy .lab-eyebrow { color: #987a48; }
.mission-copy h1 { margin: 4px 0; font: 600 clamp(1.8rem, 3vw, 2.5rem)/1.15 'Playfair Display', serif; color: #354f43; }
.mission-copy > p:not(.lab-eyebrow) { margin: 8px 0 12px; color: #766c56; font-size: .9375rem; }
.mission-goals { display: flex; flex-wrap: wrap; gap: 7px 18px; padding: 0; margin: 0; list-style: none; font-size: .75rem; color: #6d7159; }
.mission-goals li::before { content: ''; display: inline-block; width: 5px; height: 5px; margin: 0 7px 2px 0; border-radius: 50%; background: #a48d56; }
.cargo-illustration { width: 135px; height: 110px; flex-shrink: 0; }
.view-toolbar { display: flex; align-items: center; gap: 25px; max-width: 1600px; margin: 22px auto; }
.player-switch { display: flex; gap: 4px; padding: 4px; border: 1px solid #dcded0; border-radius: 13px; background: #e7e8dc; flex-shrink: 0; }
.player-switch button { display: flex; align-items: center; gap: 8px; padding: 10px 12px; min-height: 44px; border: 0; border-radius: 9px; color: #758071; background: transparent; font-size: .8125rem; }
.player-letter { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 7px; background: #d9ded0; color: #6e7f6b; font-size: .75rem; font-weight: 600; }
.player-switch button[aria-pressed='true'] { background: #fffdf7; color: #315c50; box-shadow: 0 2px 6px #304c4510; }
.player-switch button[aria-pressed='true'] .player-letter { background: #386b5f; color: #fffdf7; }
.view-b .player-switch button[aria-pressed='true'] .player-letter { background: #b47452; }
.view-toolbar > p { flex: 1; max-width: 570px; margin: 0; font-size: .8125rem; color: #7b8275; }
.assembly-meter { margin-left: auto; min-width: 130px; text-align: right; font-weight: 600; }
.assembly-meter small { font-size: .75rem; font-weight: 400; color: #7b8275; }
.meter-track { margin-top: 5px; height: 5px; border-radius: 5px; background: #dde0d1; overflow: hidden; }
.meter-track span { display: block; height: 100%; border-radius: inherit; background: #759d86; transition: width .2s ease; }
.lab-workspace { display: grid; grid-template-columns: minmax(240px, .8fr) minmax(380px, 1.65fr) minmax(270px, .95fr); gap: 18px; max-width: 1600px; margin: auto; align-items: start; }
.lab-panel { min-width: 0; border: 1px solid var(--lab-line); border-radius: 17px; background: #fffdf9; box-shadow: 0 3px 18px #474b3204; }
.panel-topline { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 22px; }
.private-label { padding: 4px 6px; font-size: .75rem; letter-spacing: .04em; color: #7d9280; background: #eaf0e4; border-radius: 5px; white-space: nowrap; }
.knowledge-panel { padding: 22px; }
.role-heading { display: flex; align-items: center; gap: 11px; }
.role-avatar { display: grid; place-items: center; width: 42px; height: 42px; flex-shrink: 0; border-radius: 12px; background: #dce8d9; color: #386b5f; font-size: 1.15rem; font-weight: 600; }
.view-b .role-avatar { color: #9e6445; background: #f1dfcd; }
.robot-lab h2 { margin: 0; font-size: 1.05rem; font-weight: 600; line-height: 1.35; }
.role-heading p { margin: 4px 0 0; font-size: .75rem; color: #81907e; }
.role-intro { margin: 20px 0; font-size: .9375rem; color: #658071; }
.knowledge-notes { list-style: none; counter-reset: fieldnotes; padding: 0; margin: 0; }
.knowledge-notes li { position: relative; counter-increment: fieldnotes; padding: 14px 0 14px 24px; border-top: 1px solid #eaebdf; font-size: 1rem; color: #65766a; line-height: 1.65; }
.knowledge-notes li::before { content: counter(fieldnotes, decimal-leading-zero); position: absolute; left: 0; top: 17px; font-size: .75rem; color: #b1a58c; }
.selected-note { margin-top: 16px; padding: 16px; border-radius: 11px; background: #eef2e8; }
.selected-note h3 { margin: 7px 0; font-size: 1rem; }
.selected-note p:not(.lab-eyebrow) { font-size: .875rem; margin: 8px 0 0; color: #5a7463; }
.selected-note .note-question { padding-top: 9px; border-top: 1px solid #dbe4d5; }
.discussion-card { margin-top: 20px; border-top: 1px solid #e7e9dd; padding-top: 16px; font-size: .8125rem; color: #82907b; }
.discussion-card summary { cursor: pointer; color: #597762; }
.discussion-card ul { margin-bottom: 0; padding-left: 18px; }
.discussion-card li + li { margin-top: 8px; }
.privacy-note { margin: 20px 0 0; font-size: .75rem; color: #929586; line-height: 1.65; }
.assembly-panel { overflow: hidden; }
.assembly-panel-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 20px 22px 0; }
.assembly-panel-heading h2 { margin-top: 6px; font-size: 1rem; }
.build-status { white-space: nowrap; font-size: .75rem; color: #a38b60; padding: 5px 8px; background: #f6efdd; border-radius: 6px; }
.build-status.complete { background: #e2eedf; color: #47765e; }
.robot-stage { position: relative; height: clamp(300px, 29vw, 450px); margin: 16px 14px 0; background: #f1f4eacf; border-radius: 13px; overflow: hidden; }
.robot-stage :deep(svg) { max-width: 470px; margin: auto; }
.bench-label { position: absolute; left: 14px; top: 13px; font-size: .75rem; letter-spacing: .12em; color: #a2ac96; }
.bench-status { position: absolute; bottom: 10px; left: 0; right: 0; text-align: center; font-size: .75rem; color: #98a28b; }
.bench-status > span { display: inline-block; width: 5px; height: 5px; border-radius: 50%; margin-right: 6px; background: #8a9d7e; }
.socket-heading { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 4px; padding: 18px 22px 10px; }
.socket-heading h3 { margin: 0; font-size: .8125rem; font-weight: 600; }
.socket-heading > span { font-size: .75rem; color: #9aa08e; }
.socket-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; padding: 0 22px; }
.socket-item { position: relative; min-width: 0; border: 1px dashed #d4d9c7; border-radius: 9px; background: #f9faf4; }
.socket-item.filled { border: 1px solid #afc5af; background: #f0f5e9; }
.socket-item.chosen { outline: 2px solid #6a927c; outline-offset: 1px; }
.socket-button { display: block; width: 100%; padding: 11px 12px; border: 0; background: transparent; text-align: left; color: var(--lab-ink); }
.socket-name { display: block; font-size: .75rem; color: #6d7c63; }
.socket-value { display: block; margin-top: 3px; font-size: .875rem; }
.socket-port { position: absolute; top: 8px; right: 9px; font-size: .75rem; color: #b47452; }
.remove-part { display: block; margin: 0 12px 9px auto; padding: 2px 0; color: #9e775c; border: 0; border-bottom: 1px solid #cdb49d; background: transparent; font-size: .75rem !important; }
.install-strip { display: flex; align-items: center; gap: 10px; padding: 17px 22px 13px; }
.install-strip p { flex: 1; min-width: 0; margin: 0; font-size: .75rem; }
.install-strip p strong { font-weight: 500; overflow-wrap: anywhere; }
.install-strip p span { display: block; margin-top: 2px; font-size: .75rem; color: #9ba08e; }
.primary-button { display: flex; align-items: center; gap: 14px; border: 1px solid #386b5f; border-radius: 9px; padding: 11px 14px; background: #386b5f; color: #fffdf7; font-size: .75rem !important; }
.primary-button:hover:not(:disabled) { background: #285549; }
.primary-button span { font-size: 1rem; }
.assembly-feedback { display: flex; align-items: flex-start; gap: 10px; margin: 0 22px 18px; padding: 12px; border-radius: 9px; background: #f4f3eb; color: #67705b; }
.assembly-feedback p { margin: 0; font-size: .875rem; line-height: 1.65; }
.feedback-mark { display: grid; place-items: center; width: 18px; height: 18px; flex-shrink: 0; border: 1px solid currentColor; border-radius: 50%; font-size: .75rem; }
.assembly-feedback.caution { background: #f8eddc; color: #825b2b; }
.assembly-feedback.success { background: #eaf2e4; color: #466e43; }
.test-strip { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px 22px; border-top: 1px solid #e8e9dc; background: #fbfcf5; }
.test-strip h3 { margin: 0; font-size: .75rem; font-weight: 500; }
.test-strip p { margin: 4px 0 0; font-size: .75rem; color: #929d86; }
.test-button { flex-shrink: 0; border: 1px solid #b8bda6; background: #f0f0df; color: #476849; padding: 9px 12px; border-radius: 9px; font-size: .75rem !important; }
.test-button:hover:not(:disabled) { background: #e0e9d5; }
.test-observations { list-style: none; padding: 0 22px 16px; margin: 0; }
.test-observations li { margin-top: 10px; padding: 10px; border-radius: 8px; background: #faf0e0; font-size: .8125rem; color: #a17d50; }
.test-observations li.passed { background: #edf4e6; color: #66825b; }
.test-observations strong { font-weight: 500; }
.test-observations p { margin: 5px 0 0; font-size: .75rem; }
.inventory-panel { padding: 22px 16px 16px; }
.inventory-panel .panel-topline { padding: 0 4px; margin-bottom: 12px; }
.part-count { font-size: .75rem; color: #a2a28e; }
.inventory-panel > h2 { padding: 0 4px; font-size: 1rem; }
.inventory-filter { display: flex; align-items: center; gap: 8px; justify-content: space-between; padding: 16px 4px 13px; color: #9a9f8b; font-size: .75rem; }
.inventory-filter select { appearance: none; max-width: 145px; padding: 6px 24px 6px 8px; border: 1px solid #e1e3d5; border-radius: 6px; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='m1 1 4 4 4-4' fill='none' stroke='%23859079'/%3E%3C/svg%3E") right 8px center / 9px no-repeat #fcfcf7; color: #7c8a70; font: inherit; font-size: .75rem; }
.parts-list { max-height: 660px; overflow-y: auto; padding: 2px 4px; scrollbar-width: thin; scrollbar-color: #c7d0ba transparent; }
.part-card { padding: 12px 10px; border: 1px solid #e3e5d6; border-radius: 10px; background: #fdfdf8; }
.part-card + .part-card { margin-top: 9px; }
.part-card.selected { border-color: #789c81; background: #f0f5e9; box-shadow: 0 0 0 1px #789c81; }
.part-card.installed { background: #f1f3e9; }
.part-card-top { display: flex; align-items: center; gap: 8px; }
.part-icon { display: grid; place-items: center; flex-shrink: 0; width: 33px; height: 33px; border-radius: 8px; background: #f2e5c2; color: #b29855; }
.part-icon svg { width: 25px; height: 25px; }
.part-icon.control { color: #749781; background: #e3edda; }
.part-icon.tools { color: #b88a6d; background: #f1e0d0; }
.part-icon.movement { color: #8b98ac; background: #e6eaf0; }
.part-card h3 { margin: 0; font-size: .8125rem; font-weight: 500; }
.part-card-top > button { margin-left: auto; flex-shrink: 0; padding: 4px 7px; min-height: 36px; border: 1px solid #d5ddc9; border-radius: 6px; background: #f3f7ed; color: #4c6e43; font-size: .75rem; }
.part-card-top > button:hover:not(:disabled) { background: #dee9d3; }
.part-card-top > button[aria-pressed='true'] { background: #386b5f; color: white; border-color: #386b5f; }
.part-description { margin: 9px 0 0; font-size: .875rem; line-height: 1.65; color: #66765f; }
.part-installed { display: block; font-size: .75rem; color: #7d9670; }
.unknown-function { display: block; margin-top: 3px; color: #a4a993; font-size: .75rem; }
.inventory-hint { margin: 14px 4px 0; font-size: .75rem; line-height: 1.6; color: #7b806b; }
.completion-panel { display: flex; gap: 24px; max-width: 1000px; margin: 28px auto 0; padding: 32px; border: 1px solid #b1c7a8; border-radius: 18px; background: #eaf0de; }
.completion-seal { display: grid; place-items: center; flex-shrink: 0; width: 60px; height: 60px; border-radius: 50%; background: #6d9776; color: white; font-size: 1.8rem; }
.completion-copy h2 { margin: 5px 0 10px; font: 600 2rem/1.2 'Playfair Display', serif; }
.completion-copy > p:not(.lab-eyebrow) { margin: 0; }
.completion-copy h3 { margin: 24px 0 10px; font-size: 1rem; }
.completion-copy ol { margin: 0 0 20px; padding-left: 22px; }
.completion-copy li + li { margin-top: 6px; }
.lab-footnote { display: flex; justify-content: space-between; gap: 24px; align-items: center; max-width: 1600px; margin: 20px auto 0; color: #797a68; font-size: .75rem; }
.lab-footnote > span { flex-shrink: 0; letter-spacing: .06em; }
.lab-footnote p { margin: 0; text-align: center; }
@media (min-width: 1600px) { .robot-lab { padding-top: 30px; } .lab-workspace { gap: 24px; } }
@media (max-width: 1200px) {
  .prototype-label { display: none; }
  .lab-workspace { grid-template-columns: 245px minmax(350px, 1fr); }
  .inventory-panel { grid-column: 1 / -1; }
  .parts-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; max-height: 360px; }
  .part-card + .part-card { margin-top: 0; }
  .robot-stage { height: 360px; }
}
@media (max-width: 760px) {
  .robot-lab { padding: 18px 14px; }
  .lab-header { gap: 14px; }
  .lab-header-actions { gap: 12px; }
  .mission-banner { padding: 20px; gap: 15px; }
  .mission-number { padding-right: 14px; }
  .cargo-illustration { display: none; }
  .view-toolbar { flex-wrap: wrap; gap: 14px; }
  .view-toolbar > p { order: 3; flex-basis: 100%; }
  .assembly-meter { min-width: 100px; }
  .lab-workspace { grid-template-columns: 1fr; }
  .knowledge-panel { order: 0; }
  .assembly-panel { order: 1; }
  .inventory-panel { order: 2; }
  .parts-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .knowledge-notes li { font-size: .875rem; }
  .robot-stage { height: 350px; }
  .lab-footnote { flex-direction: column; gap: 8px; }
  .completion-panel { padding: 22px; gap: 14px; }
  .completion-seal { width: 40px; height: 40px; }
}
@media (max-width: 430px) {
  .player-switch button { padding: 8px; font-size: .75rem; }
  .assembly-meter { width: 100%; text-align: left; }
  .view-toolbar > p { order: initial; }
  .parts-list { grid-template-columns: 1fr; }
  .assembly-panel-heading { flex-wrap: wrap; }
  .install-strip, .test-strip { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) { .robot-lab button, .meter-track span { transition: none; } }
</style>
