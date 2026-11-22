import { robotComponents, robotSlots } from '../data/robotLab.js'

export const componentById = Object.fromEntries(robotComponents.map(component => [component.id, component]))
export function emptyAssembly() { return { head: null, body: null, arms: null, legs: null } }

export function validateInstallation(assembly, componentId, slotId) {
  const part = componentById[componentId]
  const slot = robotSlots.find(item => item.id === slotId)
  if (!part || !slot) return { ok: false, message: 'Choose a component and a socket before installing.' }
  if (assembly[slotId] === componentId) return { ok: false, message: 'This component is already installed in that socket.' }
  if (part.slot !== slotId || part.port !== slot.port) return {
    ok: false, message: 'The socket declined this connection. Compare the component’s interface with the system specialist’s notes. Is high output the only thing that matters?'
  }
  if (slot.requires.some(required => !assembly[required])) return {
    ok: false, message: 'This socket is not ready yet. Ask the system specialist which supporting modules need to be installed first.'
  }
  return { ok: true, message: `${part.name} installed in ${slot.label}. A successful connection still needs a mission test.` }
}

// Acceptance tests intentionally provide observations, not a list of correct components.
export function assessRobot(assembly) {
  const parts = Object.fromEntries(robotSlots.map(slot => [slot.id, componentById[assembly[slot.id]]]))
  const complete = robotSlots.every(slot => parts[slot.id])
  const demand = ['head', 'arms', 'legs'].reduce((total, slot) => total + (parts[slot]?.draw ?? 0), 0)
  const checks = [
    { id: 'obstacles', label: 'Detect obstacles', ok: !!parts.head?.detectsObstacles, observation: 'The robot did not notice an obstacle. Does its control module detect the surroundings, or do something else?' },
    { id: 'movement', label: 'Move safely', ok: !!parts.legs?.safeMovement, observation: 'The robot stopped too abruptly. Discuss how the movement module handles delicate cargo.' },
    { id: 'cargo', label: 'Protect fragile cargo', ok: !!parts.arms?.fragileGrip, observation: 'The cargo shook inside the gripper. Could a different tool handle vibration more gently?' },
    { id: 'power', label: 'Maintain sufficient power', ok: complete && (parts.body?.capacity ?? 0) >= demand, observation: 'The system ran short of energy. Ask the component specialist to compare total demand with the supply.' }
  ]
  const interfacesValid = robotSlots.every(slot => parts[slot.id]?.slot === slot.id && parts[slot.id]?.port === slot.port)
  return { complete, checks, success: complete && interfacesValid && checks.every(check => check.ok) }
}
