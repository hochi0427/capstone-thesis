import test from 'node:test'
import assert from 'node:assert/strict'
import { assessRobot, emptyAssembly, validateInstallation } from '../src/game/robotLabLogic.js'
import { useRobotLab } from '../src/composables/useRobotLab.js'

const workingRobot = { head: 'nexo', body: 'volt', arms: 'flux', legs: 'orbi' }

test('an empty chassis cannot complete the mission', () => {
  const result = assessRobot(emptyAssembly())
  assert.equal(result.complete, false)
  assert.equal(result.success, false)
})

test('connector compatibility and build order require system knowledge', () => {
  assert.equal(validateInstallation(emptyAssembly(), 'zyron', 'body').ok, false)
  assert.equal(validateInstallation(emptyAssembly(), 'volt', 'head').ok, false)
  assert.equal(validateInstallation(emptyAssembly(), 'orbi', 'legs').ok, false)
  assert.equal(validateInstallation({ ...emptyAssembly(), body: 'volt' }, 'nexo', 'head').ok, false)
  const assembly = emptyAssembly()
  for (const [slot, part] of [['body', 'volt'], ['legs', 'orbi'], ['arms', 'flux'], ['head', 'nexo']]) {
    assert.equal(validateInstallation(assembly, part, slot).ok, true)
    assembly[slot] = part
  }
  assert.equal(assessRobot(assembly).success, true)
})

test('compatible decoys install but fail the relevant mission requirement', () => {
  for (const [slot, part, check] of [['head', 'halo', 'obstacles'], ['legs', 'vela', 'movement'], ['arms', 'axion', 'cargo'], ['body', 'luma', 'power']]) {
    const assembly = { ...workingRobot, [slot]: null }
    assert.equal(validateInstallation(assembly, part, slot).ok, true)
    const result = assessRobot({ ...workingRobot, [slot]: part })
    assert.equal(result.success, false)
    assert.equal(result.checks.find(item => item.id === check).ok, false)
  }
})

test('only one complete configuration satisfies both roles’ requirements', () => {
  const solutions = []
  for (const body of ['zyron', 'volt', 'luma']) for (const head of ['nexo', 'halo']) for (const arms of ['flux', 'axion']) for (const legs of ['orbi', 'vela']) {
    const assembly = { body, head, arms, legs }
    if (assessRobot(assembly).success) solutions.push(assembly)
  }
  assert.deepEqual(solutions, [{ body: 'volt', head: 'nexo', arms: 'flux', legs: 'orbi' }])
})

test('shared assembly survives role switches, rejected installs do not mutate it', () => {
  const lab = useRobotLab()
  lab.selectedComponent.value = 'volt'
  lab.selectedSlot.value = 'body'
  lab.install()
  lab.switchPlayer('B')
  assert.equal(lab.assembly.value.body, 'volt')
  assert.equal(lab.installedCount.value, 1)
  assert.equal(lab.selectedComponent.value, null)
  lab.selectedComponent.value = 'nexo'
  lab.selectedSlot.value = 'head'
  lab.install()
  assert.deepEqual(lab.assembly.value, { ...emptyAssembly(), body: 'volt' })
  assert.equal(lab.feedback.value.tone, 'caution')
})

test('replacing a weak source repairs the mission; removal and restart clear completion', () => {
  const lab = useRobotLab()
  for (const [slot, part] of [['body', 'luma'], ['legs', 'orbi'], ['arms', 'flux'], ['head', 'nexo']]) {
    lab.selectedComponent.value = part
    lab.selectedSlot.value = slot
    lab.install()
  }
  lab.runTest()
  assert.equal(lab.completed.value, false)
  assert.equal(lab.testResult.value.checks.find(item => item.id === 'power').ok, false)
  lab.selectedComponent.value = 'volt'
  lab.selectedSlot.value = 'body'
  lab.install()
  assert.equal(lab.testResult.value, null)
  lab.runTest()
  assert.equal(lab.completed.value, true)
  lab.remove('head')
  assert.equal(lab.completed.value, false)
  assert.equal(lab.readyToTest.value, false)
  assert.equal(lab.assembly.value.body, 'volt')
  lab.reset()
  assert.deepEqual(lab.assembly.value, emptyAssembly())
  assert.equal(lab.player.value, 'A')
  assert.equal(lab.installedCount.value, 0)
})
