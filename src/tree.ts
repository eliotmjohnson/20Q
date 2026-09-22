/** Binary decision tree: questions branch; leaves are guesses. */

export type QuestionNode = {
  kind: 'question'
  text: string
  yes: TreeNode
  no: TreeNode
}

export type GuessNode = {
  kind: 'guess'
  name: string
}

export type TreeNode = QuestionNode | GuessNode

/** Bumped so seed-tune early splits replace old localStorage trees. */
export const STORAGE_KEY = 'twentyq-tree-v2'
export const MAX_QUESTIONS = 20

/** Bump this whenever the seeded question order/content changes. */
export const SEED_VERSION = 3
export const SEED_VERSION_KEY = 'twentyq-seed-version'
export const SESSION_KEY = 'twentyq-session'

export type GameSession = {
  seedVersion: number
  phase: string
  path: Array<'yes' | 'no'>
  count: number
  correctName: string
  distQ: string
  lastGuess: string
  /** Serialized node path is enough with path+tree; we keep phase/count/guess fields. */
}

/** If the shipped seed changed, drop learned tree + mid-game session. */
export function ensureSeedVersion(): boolean {
  try {
    const prev = localStorage.getItem(SEED_VERSION_KEY)
    if (prev === String(SEED_VERSION)) return false
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    localStorage.setItem(SEED_VERSION_KEY, String(SEED_VERSION))
    return true
  } catch {
    return false
  }
}

export function loadSession(): GameSession | null {
  try {
    ensureSeedVersion()
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as GameSession
    if (!parsed || parsed.seedVersion !== SEED_VERSION) {
      sessionStorage.removeItem(SESSION_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function saveSession(session: GameSession): void {
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ ...session, seedVersion: SEED_VERSION }),
    )
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

const personTree: TreeNode = {
  kind: 'question',
  text: 'Is it a fictional character?',
  yes: {
    kind: 'question',
    text: 'Are they from a movie or TV show?',
    yes: {
      kind: 'question',
      text: 'Are they a superhero?',
      yes: { kind: 'guess', name: 'Spider-Man' },
      no: { kind: 'guess', name: 'Harry Potter' },
    },
    no: {
      kind: 'question',
      text: 'Are they from a video game?',
      yes: { kind: 'guess', name: 'Mario' },
      no: { kind: 'guess', name: 'Sherlock Holmes' },
    },
  },
  no: {
    kind: 'question',
    text: 'Are they known for music?',
    yes: { kind: 'guess', name: 'Taylor Swift' },
    no: {
      kind: 'question',
      text: 'Are they a historical figure?',
      yes: {
        kind: 'question',
        text: 'Were they a US president?',
        yes: { kind: 'guess', name: 'Abraham Lincoln' },
        no: { kind: 'guess', name: 'Albert Einstein' },
      },
      no: {
        kind: 'question',
        text: 'Are they an athlete?',
        yes: { kind: 'guess', name: 'Michael Jordan' },
        no: { kind: 'guess', name: 'Oprah Winfrey' },
      },
    },
  },
}

const animalTree: TreeNode = {
  kind: 'question',
  text: 'Does it live in water?',
  yes: {
    kind: 'question',
    text: 'Is it a mammal?',
    yes: { kind: 'guess', name: 'a dolphin' },
    no: {
      kind: 'question',
      text: 'Does it have a shell?',
      yes: { kind: 'guess', name: 'a turtle' },
      no: {
        kind: 'question',
        text: 'Is it a fish people often eat?',
        yes: { kind: 'guess', name: 'a salmon' },
        no: { kind: 'guess', name: 'a shark' },
      },
    },
  },
  no: {
    kind: 'question',
    text: 'Does it fly?',
    yes: {
      kind: 'question',
      text: 'Is it a bird?',
      yes: {
        kind: 'question',
        text: 'Is it a bird of prey?',
        yes: { kind: 'guess', name: 'an eagle' },
        no: {
          kind: 'question',
          text: 'Does it talk or mimic speech?',
          yes: { kind: 'guess', name: 'a parrot' },
          no: { kind: 'guess', name: 'a pigeon' },
        },
      },
      no: { kind: 'guess', name: 'a bat' },
    },
    no: {
      kind: 'question',
      text: 'Is it a pet?',
      yes: {
        kind: 'question',
        text: 'Does it meow?',
        yes: { kind: 'guess', name: 'a cat' },
        no: {
          kind: 'question',
          text: 'Does it bark?',
          yes: { kind: 'guess', name: 'a dog' },
          no: { kind: 'guess', name: 'a hamster' },
        },
      },
      no: {
        kind: 'question',
        text: 'Is it a farm animal?',
        yes: {
          kind: 'question',
          text: 'Does it say moo?',
          yes: { kind: 'guess', name: 'a cow' },
          no: {
            kind: 'question',
            text: 'Does it have a snout and say oink?',
            yes: { kind: 'guess', name: 'a pig' },
            no: { kind: 'guess', name: 'a horse' },
          },
        },
        no: {
          kind: 'question',
          text: 'Is it a big cat?',
          yes: {
            kind: 'question',
            text: 'Does it have a mane?',
            yes: { kind: 'guess', name: 'a lion' },
            no: { kind: 'guess', name: 'a tiger' },
          },
          no: {
            kind: 'question',
            text: 'Is it an elephant?',
            yes: { kind: 'guess', name: 'an elephant' },
            no: {
              kind: 'question',
              text: 'Does it hop?',
              yes: { kind: 'guess', name: 'a kangaroo' },
              no: { kind: 'guess', name: 'a bear' },
            },
          },
        },
      },
    },
  },
}

const plantTree: TreeNode = {
  kind: 'question',
  text: 'Is it a tree?',
  yes: { kind: 'guess', name: 'an oak tree' },
  no: {
    kind: 'question',
    text: 'Is it a flower?',
    yes: { kind: 'guess', name: 'a rose' },
    no: { kind: 'guess', name: 'grass' },
  },
}

const handheldTree: TreeNode = {
  kind: 'question',
  text: 'Is it electronic?',
  yes: {
    kind: 'question',
    text: 'Is it a phone?',
    yes: { kind: 'guess', name: 'a smartphone' },
    no: {
      kind: 'question',
      text: 'Do you wear it or put it on your head?',
      yes: { kind: 'guess', name: 'headphones' },
      no: {
        kind: 'question',
        text: 'Is it used for typing?',
        yes: { kind: 'guess', name: 'a laptop' },
        no: { kind: 'guess', name: 'a remote control' },
      },
    },
  },
  no: {
    kind: 'question',
    text: 'Is it food or drink?',
    yes: {
      kind: 'question',
      text: 'Is it a drink?',
      yes: {
        kind: 'question',
        text: 'Is it coffee?',
        yes: { kind: 'guess', name: 'coffee' },
        no: { kind: 'guess', name: 'water' },
      },
      no: {
        kind: 'question',
        text: 'Is it sweet?',
        yes: { kind: 'guess', name: 'a cookie' },
        no: { kind: 'guess', name: 'a sandwich' },
      },
    },
    no: {
      kind: 'question',
      text: 'Is it used for writing?',
      yes: { kind: 'guess', name: 'a pen' },
      no: {
        kind: 'question',
        text: 'Is it made of paper?',
        yes: { kind: 'guess', name: 'a book' },
        no: {
          kind: 'question',
          text: 'Do you wear it?',
          yes: {
            kind: 'question',
            text: 'Is it footwear?',
            yes: { kind: 'guess', name: 'sneakers' },
            no: { kind: 'guess', name: 'a hat' },
          },
          no: {
            kind: 'question',
            text: 'Is it a key?',
            yes: { kind: 'guess', name: 'a key' },
            no: { kind: 'guess', name: 'a coin' },
          },
        },
      },
    },
  },
}

const bigThingsTree: TreeNode = {
  kind: 'question',
  text: 'Is it a vehicle?',
  yes: {
    kind: 'question',
    text: 'Does it fly?',
    yes: { kind: 'guess', name: 'an airplane' },
    no: {
      kind: 'question',
      text: 'Does it travel on water?',
      yes: { kind: 'guess', name: 'a boat' },
      no: {
        kind: 'question',
        text: 'Is it a car?',
        yes: { kind: 'guess', name: 'a car' },
        no: { kind: 'guess', name: 'a bicycle' },
      },
    },
  },
  no: {
    kind: 'question',
    text: 'Is it a building or place?',
    yes: {
      kind: 'question',
      text: 'Is it a famous landmark?',
      yes: {
        kind: 'question',
        text: 'Is it in France?',
        yes: { kind: 'guess', name: 'the Eiffel Tower' },
        no: { kind: 'guess', name: 'the Statue of Liberty' },
      },
      no: {
        kind: 'question',
        text: 'Do people live there?',
        yes: { kind: 'guess', name: 'a house' },
        no: { kind: 'guess', name: 'a school' },
      },
    },
    no: {
      kind: 'question',
      text: 'Is it furniture?',
      yes: {
        kind: 'question',
        text: 'Do you sit on it?',
        yes: { kind: 'guess', name: 'a chair' },
        no: { kind: 'guess', name: 'a table' },
      },
      no: {
        kind: 'question',
        text: 'Is it in the sky / space?',
        yes: {
          kind: 'question',
          text: 'Is it the Sun?',
          yes: { kind: 'guess', name: 'the Sun' },
          no: { kind: 'guess', name: 'the Moon' },
        },
        no: {
          kind: 'question',
          text: 'Is it a mountain?',
          yes: { kind: 'guess', name: 'a mountain' },
          no: { kind: 'guess', name: 'the ocean' },
        },
      },
    },
  },
}

/**
 * Seed order (PO seed tune):
 * 1) Living?
 * 2) Living yes → Person? before animal/plant
 * 3) Living no → Bigger than a breadbox?
 * 4) Living + not person → Animal? then thin plant leftover
 * 5) Not living → breadbox yes = vehicle/place/furniture; no = hand-held
 */
export const seedTree: TreeNode = {
  kind: 'question',
  text: 'Is it a living thing?',
  yes: {
    kind: 'question',
    text: 'Is it a person (real or fictional)?',
    yes: personTree,
    no: {
      kind: 'question',
      text: 'Is it an animal?',
      yes: animalTree,
      no: {
        kind: 'question',
        text: 'Is it a plant?',
        yes: plantTree,
        no: { kind: 'guess', name: 'a bacterium' },
      },
    },
  },
  no: {
    kind: 'question',
    text: 'Is it bigger than a breadbox?',
    yes: bigThingsTree,
    no: handheldTree,
  },
}

export function cloneTree(node: TreeNode): TreeNode {
  if (node.kind === 'guess') return { kind: 'guess', name: node.name }
  return {
    kind: 'question',
    text: node.text,
    yes: cloneTree(node.yes),
    no: cloneTree(node.no),
  }
}

export function loadTree(): TreeNode {
  try {
    ensureSeedVersion()
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return cloneTree(seedTree)
    const parsed = JSON.parse(raw) as TreeNode
    if (!parsed || (parsed.kind !== 'question' && parsed.kind !== 'guess')) {
      return cloneTree(seedTree)
    }
    return parsed
  } catch {
    return cloneTree(seedTree)
  }
}

export function saveTree(tree: TreeNode): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tree))
}

/**
 * Replace a wrong guess leaf with a new question that distinguishes
 * the correct answer from the previous guess.
 * answerYes means: for the new question, the correct answer answers Yes.
 */
export function learn(
  root: TreeNode,
  path: Array<'yes' | 'no'>,
  wrongGuess: string,
  correctName: string,
  distinguishingQuestion: string,
  correctAnswersYes: boolean,
): TreeNode {
  const tree = cloneTree(root)
  let parent: QuestionNode | null = null
  let branch: 'yes' | 'no' | null = null
  let node: TreeNode = tree

  for (const step of path) {
    if (node.kind !== 'question') break
    parent = node
    branch = step
    node = node[step]
  }

  const newLeaf: GuessNode = { kind: 'guess', name: correctName }
  const oldLeaf: GuessNode = { kind: 'guess', name: wrongGuess }
  const replacement: QuestionNode = {
    kind: 'question',
    text: distinguishingQuestion,
    yes: correctAnswersYes ? newLeaf : oldLeaf,
    no: correctAnswersYes ? oldLeaf : newLeaf,
  }

  if (!parent || !branch) {
    return replacement
  }
  parent[branch] = replacement
  return tree
}
