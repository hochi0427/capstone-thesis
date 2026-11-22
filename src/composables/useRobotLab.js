import { computed, ref } from 'vue'
import { robotSlots } from '../data/robotLab.js'
import { assessRobot, componentById, emptyAssembly, validateInstallation } from '../game/robotLabLogic.js'

export function useRobotLab() {
  const player = ref('A')
  const assembly = ref(emptyAssembly())
  const selectedComponent = ref(null)
  const selectedSlot = ref(null)
  const completed = ref(false)
  const testResult = ref(null)
  const feedback = ref({ tone: 'neutral', message: 'The chassis is ready. Compare your notes, select a part, then choose a socket.' })
  const installedCount = computed(() => robotSlots.filter(slot => assembly.value[slot.id]).length)
  const selectedPart = computed(() => componentById[selectedComponent.value])
  const readyToTest = computed(() => installedCount.value === robotSlots.length)
  function clearTest() { completed.value = false; testResult.value = null }
  function switchPlayer(next) {
    player.value = next
    // Switching clears the private selection, not the shared build or test observations.
    selectedComponent.value = null
    selectedSlot.value = null
  }
  function install() {
    const result = validateInstallation(assembly.value, selectedComponent.value, selectedSlot.value)
    feedback.value = { tone: result.ok ? 'success' : 'caution', message: result.message }
    if (!result.ok) return
    clearTest()
    assembly.value = { ...assembly.value, [selectedSlot.value]: selectedComponent.value }
    selectedComponent.value = null
  }
  function remove(slot) {
    const part = componentById[assembly.value[slot]]
    if (!part) return
    clearTest()
    assembly.value = { ...assembly.value, [slot]: null }
    feedback.value = { tone: 'neutral', message: `${part.name} returned to inventory. The other installed modules remain in place; reconnect the required supports before adding new parts.` }
  }
  function runTest() {
    testResult.value = assessRobot(assembly.value)
    completed.value = testResult.value.success
    feedback.value = { tone: completed.value ? 'success' : 'caution', message: completed.value ? 'Mission Complete! Your robot delivered the fragile cargo safely.' : 'The field test found something to reconsider. Compare the observations below with both players’ notes.' }
  }
  function reset() {
    assembly.value = emptyAssembly()
    player.value = 'A'
    selectedComponent.value = null
    selectedSlot.value = null
    clearTest()
    feedback.value = { tone: 'neutral', message: 'Fresh chassis, fresh conversation. Compare your notes before building.' }
  }
  return { player, assembly, selectedComponent, selectedSlot, selectedPart, installedCount, readyToTest, completed, testResult, feedback, switchPlayer, install, remove, runTest, reset }
}
