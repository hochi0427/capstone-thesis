import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parse, compileScript } from '@vue/compiler-sfc'
import { createRenderer, nextTick } from 'vue'
import { playerRoles, robotComponents, reflectionQuestions } from '../src/data/robotLab.js'

// Mount the actual compiled Vue interface in a lightweight host. No browser or new dependency.
const moduleCache = new Map()
function componentUrl(file) {
  if (moduleCache.has(file)) return moduleCache.get(file)
  const { descriptor } = parse(readFileSync(file, 'utf8'), { filename: file })
  let code = compileScript(descriptor, { id: file, inlineTemplate: true }).content
  code = code.replaceAll('import.meta.env.BASE_URL', JSON.stringify('/capstone-thesis/'))
  for (const match of [...code.matchAll(/from\s+(['"])([^'"]+)\1/g)]) {
    const specifier = match[2]
    const target = specifier === 'vue' ? import.meta.resolve('vue') : specifier.endsWith('.vue') ? componentUrl(resolve(dirname(file), specifier)) : pathToFileURL(resolve(dirname(file), specifier)).href
    code = code.replace(match[0], `from ${JSON.stringify(target)}`)
  }
  const url = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
  moduleCache.set(file, url)
  return url
}
function createHost() {
  const node = (type, text = '') => ({
    type, text, children: [], props: {}, style: {}, parent: null,
    get options() { return this.children.filter(child => child.type === 'option') },
    addEventListener() {}, removeEventListener() {}, focus() {}, scrollIntoView() {}
  })
  const insert = (el, parent, anchor) => {
    if (el.parent) el.parent.children.splice(el.parent.children.indexOf(el), 1)
    el.parent = parent
    const index = parent.children.indexOf(anchor)
    parent.children.splice(index < 0 ? parent.children.length : index, 0, el)
  }
  const renderer = createRenderer({
    createElement: type => node(type), createText: text => node('#text', text), createComment: text => node('#comment', text),
    setText: (el, text) => { el.text = text }, setElementText: (el, text) => { el.text = text; el.children = [] },
    patchProp: (el, key, old, value) => { el.props[key] = value; if (key === 'value') el._value = value }, insert,
    remove(el) { el.parent?.children.splice(el.parent.children.indexOf(el), 1) }, parentNode: el => el.parent,
    nextSibling(el) { return el.parent?.children[el.parent.children.indexOf(el) + 1] }, querySelector: () => null, setScopeId() {},
    insertStaticContent(html, parent, anchor) { const el = node('#static', html); insert(el, parent, anchor); return [el, el] }
  })
  return { renderer, root: node('root') }
}

test('real Vue controls hide private notes, preserve shared progress, and complete the mission', async () => {
  const RobotLab = (await import(componentUrl(resolve('src/components/RobotLab.vue')))).default
  const { renderer, root } = createHost()
  globalThis.window = { matchMedia: () => ({ matches: true }) }
  globalThis.document = { title: 'Capstone Thesis' }
  const app = renderer.createApp(RobotLab)
  app.mount(root)
  assert.equal(document.title, 'Robot Lab — A Collaborative Robot Building Game')
  const all = el => [el, ...el.children.flatMap(all)]
  const find = predicate => all(root).find(predicate)
  const text = () => all(root).map(el => el.text).join(' ')
  const click = async predicate => { const button = find(predicate); assert(button, 'Expected control to exist'); assert(!button.props.disabled, 'Expected control to be enabled'); button.props.onClick(); await nextTick() }
  const switchRole = async role => click(el => el.type === 'button' && el.children.some(child => child.props.class === 'player-letter' && child.text === role))
  const selectPart = async id => {
    const name = robotComponents.find(part => part.id === id).name
    await click(el => el.props['aria-label'] === `Select ${name}`)
  }
  const selectSlot = async label => click(el => el.props.class === 'socket-button' && el.children.some(child => child.text === label))
  const install = async () => click(el => el.props.class === 'primary-button')
  assert(text().includes(playerRoles.A.intro))
  assert(!text().includes(playerRoles.B.notes[0]))
  await switchRole('B')
  assert(text().includes(playerRoles.B.notes[0]))
  for (const part of robotComponents) assert(!text().includes(part.function))
  await selectPart('zyron'); await selectSlot('Body / Power'); await install()
  assert(text().includes('socket declined this connection'))
  assert(find(el => el.props['aria-label'] === '0 of 4 modules installed'))
  await selectPart('volt'); await install()
  assert(find(el => el.props['aria-label'] === '1 of 4 modules installed'))
  await switchRole('A')
  assert(!text().includes(playerRoles.B.notes[0]))
  assert(find(el => el.props['aria-label'] === '1 of 4 modules installed'))
  for (const [part, slot] of [['orbi', 'Legs / Movement'], ['flux', 'Arms / Tools'], ['nexo', 'Head / Control']]) {
    await selectPart(part); await selectSlot(slot); await install()
  }
  assert(find(el => el.props['aria-label'] === '4 of 4 modules installed'))
  await click(el => el.props.class === 'test-button')
  assert(text().includes('Mission Complete!'))
  assert(find(el => el.props['aria-label'] === 'Your activated robot holding the fragile cargo'))
  for (const question of reflectionQuestions) assert(text().includes(question))
  await click(el => el.props['aria-label'] === 'Remove Nexo Sensor from Head / Control')
  assert(!find(el => el.props.class === 'completion-panel'))
  assert(find(el => el.props.class === 'test-button').props.disabled)
  app.unmount()
  assert.equal(document.title, 'Capstone Thesis')
})
