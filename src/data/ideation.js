export const ideationContent = {
  principlesIntro: "My research on CPS and interdisciplinary collaboration led me to these six design principles. I’ll use them as a starting point for exploring game ideas.",
  hmwIntro: 'These How Might We questions translate my research insights and design principles into open-ended design challenges. They will guide brainstorming without limiting the project to a specific game mechanic or solution.',
}

export const designPrinciples = [
  {
    id: '01',
    title: 'Create Meaningful Interdependence',
    description: "Players must rely on each other's contributions to solve shared problems.",
    connections: ['Collaborative Problem Solving', 'Shared Goals', 'Knowledge Integration']
  },
  {
    id: '02',
    title: 'Design Complementary Roles and Expertise',
    description: 'Players contribute different expertise while learning from one another.',
    connections: ['Contributory Expertise', 'Interactional Expertise', 'Relative Expertise']
  },
  {
    id: '03',
    title: 'Support Epistemic Stability and Adaptability',
    description: 'Encourage players to explain what they know and remain open to new perspectives.',
    connections: ['Expert and Non-expert Roles', 'Epistemic Competencies']
  },
  {
    id: '04',
    title: 'Encourage Constructive Questioning and Disagreement',
    description: 'Make questioning, uncertainty, and different opinions part of problem solving.',
    connections: ['Conformative Dynamics', 'Performative Dynamics']
  },
  {
    id: '05',
    title: 'Promote Knowledge Sharing and Integration',
    description: 'Encourage players to combine knowledge and build shared understanding.',
    connections: ['Knowledge Building', 'Shared Understanding', 'CPS']
  },
  {
    id: '06',
    title: 'Create a Supportive Collaborative Environment',
    description: 'Create a safe space for asking questions, making mistakes, and sharing ideas.',
    connections: ['Social Context', 'Supportive Team Environment', 'Psychological Safety']
  }
].map(principle => ({ ...principle, status: 'Preliminary' }))

export const howMightWe = [
  {
    id: '01',
    title: 'Collaborative Interdependence',
    question: 'How might we create learning experiences where people with different expertise genuinely depend on each other to solve problems?',
    principleIds: ['01', '02', '05']
  },
  {
    id: '02',
    title: 'Epistemic Engagement',
    question: 'How might we encourage learners to share their expertise, question assumptions, and explore unfamiliar perspectives?',
    principleIds: ['03', '04', '05']
  },
  {
    id: '03',
    title: 'Supportive Collaboration',
    question: 'How might we create a collaborative environment where learners feel comfortable acknowledging uncertainty and expressing different opinions?',
    principleIds: ['03', '04', '06']
  }
]

export const supportingTheories = [
  {
    id: '01',
    title: 'Social Constructivism',
    focus: 'Learning through social interaction, dialogue, and shared meaning-making.',
    connection: 'This perspective may help explain how learners develop understanding through communication, negotiation of meaning, and collaboration.',
    status: 'To Be Explored'
  },
  {
    id: '02',
    title: 'Social Interdependence Theory',
    focus: 'How the structure of goals and interdependence among group members influences collaborative behavior.',
    connection: 'This theory may inform the design of shared goals, complementary contributions, and cooperative learning activities.',
    status: 'To Be Explored'
  }
]

export const brainstormingContent = {
  intro: 'Based on my research findings and design principles, I have identified several initial ideas for creating meaningful collaborative problem-solving experiences.',
  learningApproach: {
    title: 'Game-Based Learning (GBL)',
    description: 'I plan to explore Game-Based Learning as a way to create interactive experiences where players can practice collaborative problem-solving through shared challenges, communication, and decision-making.'
  },
  themesIntro: 'These are three initial themes I am considering for the game. Each could provide a different context for players to collaborate and solve problems.'
}

export const brainstormingIdeas = [
  {
    id: '01',
    title: 'Complementary Player Roles',
    description: 'Design two player roles with different abilities and expertise, so each player contributes something unique.'
  },
  {
    id: '02',
    title: 'Required Communication and Knowledge Sharing',
    description: 'Create challenges where players need to communicate and exchange knowledge to solve problems together.'
  },
  {
    id: '03',
    title: 'Opportunities for Questioning and Disagreement',
    description: 'Create situations that encourage players to ask questions, challenge assumptions, and discuss different perspectives.'
  },
  {
    id: '04',
    title: 'Creating a Shared Outcome',
    description: 'Two players work together to create something, such as building a robot, developing a solution, or constructing an object.'
  },
  {
    id: '05',
    title: 'Fictional Technical Terminology',
    description: 'Use made-up technical terms to introduce unfamiliar knowledge without requiring players to have expertise in a specific academic discipline.'
  }
]

export const potentialGameThemes = [
  {
    id: '01',
    title: 'Building a Robot',
    description: 'Players combine different abilities and knowledge to build a functioning robot together.'
  },
  {
    id: '02',
    title: 'Finding a Solution',
    description: 'Players analyze information, discuss different perspectives, and develop a shared solution to a problem.'
  },
  {
    id: '03',
    title: 'Creating an Object',
    description: 'Players collaborate to design and create an object using complementary knowledge and abilities.'
  }
]
