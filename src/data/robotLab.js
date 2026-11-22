// Fictional mission data. Functions/energy belong to A; interfaces/rules belong to B.
export const robotSlots = [
  { id: 'head', label: 'Head / Control', short: 'Control', port: 'C2', requires: ['body', 'arms'] },
  { id: 'body', label: 'Body / Power', short: 'Power', port: 'P2', requires: [] },
  { id: 'arms', label: 'Arms / Tools', short: 'Tools', port: 'T3', requires: ['body', 'legs'] },
  { id: 'legs', label: 'Legs / Movement', short: 'Movement', port: 'M2', requires: ['body'] }
]

export const robotComponents = [
  { id: 'zyron', name: 'Zyron Core', icon: 'power', slot: 'body', port: 'P1', capacity: 12,
    function: 'A high-output energy source. Supplies 12 energy units.',
    note: 'Its impressive output makes it tempting. Ask whether its connector fits this chassis.' },
  { id: 'volt', name: 'Volt Cell', icon: 'power', slot: 'body', port: 'P2', capacity: 8,
    function: 'A compact energy source. Supplies 8 energy units.',
    note: 'Compare its supply with the combined energy demand of your chosen modules.' },
  { id: 'luma', name: 'Luma Capsule', icon: 'power', slot: 'body', port: 'P2', capacity: 4,
    function: 'A small energy source. Supplies 4 energy units.',
    note: 'A source can fit a chassis and still be too weak to power the whole robot.' },
  { id: 'nexo', name: 'Nexo Sensor', icon: 'control', slot: 'head', port: 'C2', draw: 2, detectsObstacles: true,
    function: 'Detects nearby obstacles. Uses 2 energy units.',
    note: 'It notices objects in the robot’s path, even when those objects do not send a signal.' },
  { id: 'halo', name: 'Halo Beacon', icon: 'control', slot: 'head', port: 'C2', draw: 1,
    function: 'Broadcasts the robot’s location. Uses 1 energy unit.',
    note: 'Helping others find the robot is different from helping the robot detect an obstacle.' },
  { id: 'flux', name: 'Flux Stabilizer', icon: 'tools', slot: 'arms', port: 'T3', draw: 3, fragileGrip: true,
    function: 'A cushioned grip that absorbs vibration and protects delicate cargo. Uses 3 energy units.',
    note: 'Stabilization means keeping the cargo steady, rather than simply gripping it harder.' },
  { id: 'axion', name: 'Axion Joint', icon: 'tools', slot: 'arms', port: 'T3', draw: 2,
    function: 'A strong, rigid gripper for heavy objects. Uses 2 energy units.',
    note: 'More grip strength does not necessarily protect a fragile object from vibration.' },
  { id: 'orbi', name: 'Orbi Motor', icon: 'movement', slot: 'legs', port: 'M2', draw: 2, safeMovement: true,
    function: 'Slow, controlled movement with gentle braking. Uses 2 energy units.',
    note: 'A gentle stop can matter as much as a gentle start when carrying delicate cargo.' },
  { id: 'vela', name: 'Vela Drive', icon: 'movement', slot: 'legs', port: 'M2', draw: 4,
    function: 'Fast movement with abrupt braking. Uses 4 energy units.',
    note: 'Speed can be useful, but consider what happens to fragile cargo when the robot stops.' }
]

export const playerRoles = {
  A: {
    name: 'Component Specialist', label: 'Functions & energy',
    intro: 'You know what the parts do. Your partner knows how the system fits together.',
    notes: [
      'Choose parts that can sense obstacles, move gently, and protect delicate cargo.',
      'Add the energy used by the control, tools, and movement modules. The energy source must supply at least that total.',
      'Your notes do not include connector types or installation dependencies. Ask your partner before committing to a part.'
    ]
  },
  B: {
    name: 'System Specialist', label: 'Interfaces & assembly',
    intro: 'You know how the system fits together. Your partner knows what each part actually does.',
    notes: [
      'This chassis accepts P2 at Body / Power, M2 at Legs / Movement, T3 at Arms / Tools, and C2 at Head / Control.',
      'Connect the power source first. Install movement before tools, and tools before control. Several parts fit each socket; fitting is not the same as meeting the mission.',
      'Your notes do not include functions, power supply, or energy demand. Ask your partner which compatible parts can protect the cargo and power the whole robot.'
    ]
  }
}

export const discussionPrompts = [
  'What do you know about this component?',
  'Why do you think this will work?',
  'What information are we missing?',
  'Is there another possible solution?'
]

export const reflectionQuestions = [
  'What information did you need from your partner?',
  'Did you change your initial idea after discussing it?',
  'How did you combine your knowledge to complete the robot?'
]
