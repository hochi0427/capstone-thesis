export const tabs = [
  { id: 'repository', label: 'Repository', available: true },
  { id: 'research', label: 'Research Notes', available: true },
  { id: 'development', label: 'Development Log', available: false },
  { id: 'about', label: 'About', available: false }
]

export const researchPapers = [
  {
    citation:
      'Bartolomé, J., Idoya del Río, I., Martínez, A., Aranguren, A., Laña, I., & Alloza, S. (2025). Game on: Exploring the potential for soft skill development through video games. Information, 16(10), 918.',
    url: 'https://doi.org/10.3390/info16100918'
  },
  {
    citation:
      'Toups Dugas, P. O., Kerne, A., & Hamilton, W. (2009). Game design principles for engaging cooperative play: Core mechanics and interfaces for non-mimetic simulation of fire emergency response. In Proceedings of the 2009 ACM SIGGRAPH Symposium on Video Games.',
    url: 'https://ecologylab.net/research/publications/p71-toups.pdf'
  }
]

export const m1Content = {
  overview: [
    'Some of my favorite multiplayer game experiences are the moments when I realize I cannot solve something by myself. I might have information my teammate does not have, while they might be able to do something I cannot. Sometimes we have to explain what we see, sometimes we have to coordinate our timing, and sometimes we simply have to figure out what the other person is thinking.',
    'Games like It Takes Two and Overcooked create these moments through cooperation, while Among Us creates a very different kind of interaction by combining cooperation, competition, and incomplete information. Even though these games use very different mechanics, the interaction between players becomes an important part of the experience.',
    'This made me start thinking about what actually makes collaboration meaningful in a game. Simply putting two players on the same team does not necessarily mean they are solving problems together. In some games, players can work toward the same goal while still completing most tasks independently. I am more interested in situations where players need each other—where they have to share information, coordinate their actions, understand what their partner knows, and develop a solution together.',
    'For my capstone, I want to explore Collaborative Problem Solving (CPS) through the design of a two-player game. My goal is to create a game where collaboration is not just an option, but an important part of solving the challenges. I am currently interested in mechanics such as different player roles, information asymmetry, shared goals, and interdependent abilities.',
    'Through this project, I hope to explore how game design can create opportunities for players to practice collaborative problem-solving skills through play.'
  ],
  conceptMapIntro:
    'This concept map represents my current thinking about how different game mechanics could create interdependence between players and provide opportunities to practice collaborative problem solving.',
  directions: [
    { label: 'Learning Focus', items: ['Collaborative Problem Solving'] },
    { label: 'Game Format', items: ['Two-Player Multiplayer Game'] },
    { label: 'Core Principle', items: ['Neither player should be able to solve the problem alone.'] },
    {
      label: 'Possible Supporting Skills',
      items: ['Communication', 'Coordination', 'Perspective Taking']
    },
    {
      label: 'Possible Game Mechanics',
      items: [
        'Different Player Roles',
        'Information Asymmetry',
        'Shared Goals',
        'Interdependent Abilities'
      ]
    }
  ],
  spice: [
    {
      letter: 'S',
      category: 'Setting',
      description: 'Multiplayer game-based learning environment'
    },
    {
      letter: 'P',
      category: 'Perspective / Population',
      description: 'Two players; target age group is still to be determined'
    },
    {
      letter: 'I',
      category: 'Intervention / Innovation',
      description: 'A two-player game designed around interdependent collaborative problem solving'
    },
    {
      letter: 'C',
      category: 'Comparison',
      description: 'Still to be determined. A formal comparison may not be necessary for the design project.'
    },
    {
      letter: 'E',
      category: 'Evaluation',
      description: 'Observe collaborative problem-solving behaviors such as information sharing, joint strategy development, coordination, and decision making.'
    }
  ]
}

export const milestones = [
  {
    id: 1,
    short: 'M1',
    title: 'Early Ideas',
    semester: 'Semester 1',
    status: 'Current',
    description:
      'Initial exploration of my capstone direction, including my interests in multiplayer interaction, cooperation, competition, and learning through games.'
  },
  {
    id: 2,
    short: 'M2',
    title: 'Project Plan',
    semester: 'Semester 1',
    status: 'Upcoming',
    description:
      'Defining the scope of the project, target audience, learning goals, timeline, and overall development plan.'
  },
  {
    id: 3,
    short: 'M3',
    title: 'Research',
    semester: 'Semester 1',
    status: 'Upcoming',
    description:
      'Reviewing literature and existing games related to multiplayer learning, cooperation, competition, communication, and game-based learning.'
  },
  {
    id: 4,
    short: 'M4',
    title: 'Ideation',
    semester: 'Semester 1',
    status: 'Upcoming',
    description:
      'Generating and evaluating game concepts, interaction structures, mechanics, and possible learning experiences.'
  },
  {
    id: 5,
    short: 'M5',
    title: 'Prototype & Design Rationale',
    semester: 'Semester 1',
    status: 'Upcoming',
    description:
      'Developing an early Unity prototype and explaining the learning and game design decisions behind it.'
  },
  {
    id: 6,
    short: 'M6',
    title: 'Video Pitch & First Paper',
    semester: 'Semester 1',
    status: 'Upcoming',
    description:
      'Presenting the project direction and documenting the first major version of the thesis work.'
  },
  {
    id: 7,
    short: 'M7',
    title: 'Project Plan',
    semester: 'Semester 2',
    status: 'Upcoming',
    description:
      'Revising the development plan for the second semester based on feedback and progress.'
  },
  {
    id: 8,
    short: 'M8',
    title: 'Design, Development & Testing',
    semester: 'Semester 2',
    status: 'Upcoming',
    description:
      'Building the main version of the project, conducting playtests, collecting feedback, and iterating on the design.'
  },
  {
    id: 9,
    short: 'M9',
    title: 'EXPO & Final Paper',
    semester: 'Semester 2',
    status: 'Upcoming',
    description:
      'Presenting the final project and completing the thesis paper.'
  }
]
