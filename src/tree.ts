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
export const STORAGE_KEY = 'twentyq-tree-v13'
export const MAX_QUESTIONS = 20

/** Bump this whenever the seeded question order/content changes. */
export const SEED_VERSION = 13
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
  /** Hybrid model fields (optional for older sessions; unused on live). */
  qaHistory?: Array<{ question: string; answer: 'yes' | 'no' | 'maybe' }>
  inModelMode?: boolean
  modelAttempts?: number
  modelQuestion?: string
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

/** Seed v13: classic 20Q attribute questions only; names only on final guess. */
export const seedTree: TreeNode = {
  kind: 'question',
  text: "Is it a living thing?",
  yes: {
    kind: 'question',
    text: "Is it a person (real or fictional)?",
    yes: {
      kind: 'question',
      text: "Is it a fictional character?",
      yes: {
        kind: 'question',
        text: "From movies or TV?",
        yes: {
          kind: 'question',
          text: "Superhero or comic character?",
          yes: {
            kind: 'question',
            text: "Typically associated with Marvel (not DC)?",
            yes: {
              kind: 'question',
              text: "Usually wears a cape in classic depictions?",
              yes: { kind: 'guess', name: "Thor" },
              no: {
                kind: 'question',
                text: "Often depicted as armored / wearing a metal suit?",
                yes: { kind: 'guess', name: "Iron Man" },
                no: {
                  kind: 'question',
                  text: "A woman?",
                  yes: { kind: 'guess', name: "Black Widow" },
                  no: {
                    kind: 'question',
                    text: "Usually portrayed with animal-like claws or regeneration?",
                    yes: { kind: 'guess', name: "Wolverine" },
                    no: {
                      kind: 'question',
                      text: "Is it mainly associated with great physical strength?",
                      yes: { kind: 'guess', name: "Hulk" },
                      no: {
                        kind: 'question',
                        text: "Associated with a patriotic shield?",
                        yes: { kind: 'guess', name: "Captain America" },
                        no: { kind: 'guess', name: "Spider-Man" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Usually wears a cape in classic depictions?",
              yes: {
                kind: 'question',
                text: "A woman?",
                yes: { kind: 'guess', name: "Wonder Woman" },
                no: {
                  kind: 'question',
                  text: "Is it mainly associated with great physical strength?",
                  yes: { kind: 'guess', name: "Superman" },
                  no: { kind: 'guess', name: "Batman" },
                },
              },
              no: {
                kind: 'question',
                text: "Primarily a villain rather than a hero?",
                yes: { kind: 'guess', name: "Joker" },
                no: { kind: 'guess', name: "Flash" },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Associated with Star Wars?",
            yes: {
              kind: 'question',
              text: "A droid / robot?",
              yes: {
                kind: 'question',
                text: "Primarily gold-colored?",
                yes: { kind: 'guess', name: "C-3PO" },
                no: { kind: 'guess', name: "R2-D2" },
              },
              no: {
                kind: 'question',
                text: "A furry non-human?",
                yes: { kind: 'guess', name: "Chewbacca" },
                no: {
                  kind: 'question',
                  text: "Often associated with the dark side?",
                  yes: { kind: 'guess', name: "Darth Vader" },
                  no: {
                    kind: 'question',
                    text: "A small, green Force user?",
                    yes: { kind: 'guess', name: "Yoda" },
                    no: {
                      kind: 'question',
                      text: "A woman?",
                      yes: { kind: 'guess', name: "Princess Leia" },
                      no: {
                        kind: 'question',
                        text: "A smuggler / pilot type?",
                        yes: { kind: 'guess', name: "Han Solo" },
                        no: { kind: 'guess', name: "Luke Skywalker" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Animated / cartoon?",
              yes: {
                kind: 'question',
                text: "A Disney or Pixar character?",
                yes: {
                  kind: 'question',
                  text: "A princess with ice powers?",
                  yes: { kind: 'guess', name: "Elsa" },
                  no: {
                    kind: 'question',
                    text: "A toy / action-figure character?",
                    yes: { kind: 'guess', name: "Buzz Lightyear" },
                    no: { kind: 'guess', name: "Mickey Mouse" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "From anime or Japanese games originally?",
                  yes: { kind: 'guess', name: "Pikachu" },
                  no: {
                    kind: 'question',
                    text: "From The Simpsons?",
                    yes: { kind: 'guess', name: "Homer Simpson" },
                    no: {
                      kind: 'question',
                      text: "Lives underwater in a cartoon?",
                      yes: { kind: 'guess', name: "SpongeBob" },
                      no: {
                        kind: 'question',
                        text: "A green ogre?",
                        yes: { kind: 'guess', name: "Shrek" },
                        no: {
                          kind: 'question',
                          text: "A plumber from video games?",
                          yes: { kind: 'guess', name: "Mario" },
                          no: {
                            kind: 'question',
                            text: "A mystery-solving dog?",
                            yes: { kind: 'guess', name: "Scooby-Doo" },
                            no: { kind: 'guess', name: "Bugs Bunny" },
                          },
                        },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "A mythical / fantasy creature rather than a named person?",
                yes: {
                  kind: 'question',
                  text: "Typically undead or a spirit?",
                  yes: {
                    kind: 'question',
                    text: "Associated with drinking blood in fiction?",
                    yes: { kind: 'guess', name: "Vampire" },
                    no: {
                      kind: 'question',
                      text: "A walking corpse in horror fiction?",
                      yes: { kind: 'guess', name: "Zombie" },
                      no: { kind: 'guess', name: "Ghost" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "A fire-breathing reptile?",
                    yes: { kind: 'guess', name: "Dragon" },
                    no: {
                      kind: 'question',
                      text: "A horse-like creature with a single horn?",
                      yes: { kind: 'guess', name: "Unicorn" },
                      no: { kind: 'guess', name: "Wizard" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Uses magic spells as a profession?",
                  yes: { kind: 'guess', name: "Gandalf" },
                  no: {
                    kind: 'question',
                    text: "Associated with Christmas?",
                    yes: { kind: 'guess', name: "Santa Claus" },
                    no: {
                      kind: 'question',
                      text: "From Harry Potter?",
                      yes: { kind: 'guess', name: "Harry Potter" },
                      no: { kind: 'guess', name: "Sherlock Holmes" },
                    },
                  },
                },
              },
            },
          },
        },
        no: {
          kind: 'question',
          text: "Primarily from a video game?",
          yes: {
            kind: 'question',
            text: "A yellow round creature that eats dots?",
            yes: { kind: 'guess', name: "Pac-Man" },
            no: { kind: 'guess', name: "Link" },
          },
          no: {
            kind: 'question',
            text: "From Greek mythology?",
            yes: { kind: 'guess', name: "Zeus" },
            no: {
              kind: 'question',
              text: "A cryptid people claim to have seen?",
              yes: { kind: 'guess', name: "Bigfoot" },
              no: {
                kind: 'question',
                text: "A boy who can fly and will not grow up?",
                yes: { kind: 'guess', name: "Peter Pan" },
                no: { kind: 'guess', name: "Robin Hood" },
              },
            },
          },
        },
      },
      no: {
        kind: 'question',
        text: "Is it mainly a job or occupation?",
        yes: {
          kind: 'question',
          text: "A first responder or public-safety role?",
          yes: {
            kind: 'question',
            text: "Puts out fires?",
            yes: { kind: 'guess', name: "a firefighter" },
            no: {
              kind: 'question',
              text: "Serves in the armed forces?",
              yes: { kind: 'guess', name: "a soldier" },
              no: { kind: 'guess', name: "a police officer" },
            },
          },
          no: {
            kind: 'question',
            text: "Works in a skilled trade with tools?",
            yes: {
              kind: 'question',
              text: "Works with water pipes?",
              yes: { kind: 'guess', name: "a plumber" },
              no: {
                kind: 'question',
                text: "Works with electrical wiring?",
                yes: { kind: 'guess', name: "an electrician" },
                no: { kind: 'guess', name: "a mechanic" },
              },
            },
            no: {
              kind: 'question',
              text: "A creative / entertainment profession?",
              yes: {
                kind: 'question',
                text: "Performs music?",
                yes: { kind: 'guess', name: "a musician" },
                no: {
                  kind: 'question',
                  text: "Acts in films or theater?",
                  yes: { kind: 'guess', name: "an actor" },
                  no: { kind: 'guess', name: "a writer" },
                },
              },
              no: {
                kind: 'question',
                text: "Works mainly in medicine or health care?",
                yes: {
                  kind: 'question',
                  text: "Typically assists physicians in a hospital?",
                  yes: { kind: 'guess', name: "a nurse" },
                  no: { kind: 'guess', name: "a doctor" },
                },
                no: {
                  kind: 'question',
                  text: "Flies aircraft or spacecraft?",
                  yes: {
                    kind: 'question',
                    text: "Travels to space?",
                    yes: { kind: 'guess', name: "an astronaut" },
                    no: { kind: 'guess', name: "a pilot" },
                  },
                  no: {
                    kind: 'question',
                    text: "Works with food professionally?",
                    yes: { kind: 'guess', name: "a chef" },
                    no: {
                      kind: 'question',
                      text: "A legal profession?",
                      yes: { kind: 'guess', name: "a lawyer" },
                      no: {
                        kind: 'question',
                        text: "Works in education?",
                        yes: { kind: 'guess', name: "a teacher" },
                        no: {
                          kind: 'question',
                          text: "Works on a farm?",
                          yes: { kind: 'guess', name: "a farmer" },
                          no: {
                            kind: 'question',
                            text: "Does scientific research?",
                            yes: { kind: 'guess', name: "a scientist" },
                            no: { kind: 'guess', name: "an engineer" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        no: {
          kind: 'question',
          text: "Is it a famous real person?",
          yes: {
            kind: 'question',
            text: "Still alive today (as of the 2020s)?",
            yes: {
              kind: 'question',
              text: "Is it mainly a musician / singer?",
              yes: { kind: 'guess', name: "Beyoncé" },
              no: {
                kind: 'question',
                text: "A woman?",
                yes: { kind: 'guess', name: "Serena Williams" },
                no: { kind: 'guess', name: "Barack Obama" },
              },
            },
            no: {
              kind: 'question',
              text: "Is it associated with technology, invention, or physics?",
              yes: {
                kind: 'question',
                text: "A woman?",
                yes: { kind: 'guess', name: "Marie Curie" },
                no: {
                  kind: 'question',
                  text: "Is it associated with science or scientific discoveries?",
                  yes: {
                    kind: 'question',
                    text: "Associated with electricity inventions?",
                    yes: { kind: 'guess', name: "Nikola Tesla" },
                    no: { kind: 'guess', name: "Albert Einstein" },
                  },
                  no: { kind: 'guess', name: "Steve Jobs" },
                },
              },
              no: {
                kind: 'question',
                text: "A political leader or activist?",
                yes: {
                  kind: 'question',
                  text: "A U.S. president?",
                  yes: { kind: 'guess', name: "Abraham Lincoln" },
                  no: { kind: 'guess', name: "Martin Luther King Jr." },
                },
                no: {
                  kind: 'question',
                  text: "Is it mainly a musician / singer?",
                  yes: { kind: 'guess', name: "Elvis Presley" },
                  no: { kind: 'guess', name: "Michael Jordan" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Under 18 years old (typically)?",
            yes: {
              kind: 'question',
              text: "A newborn or infant?",
              yes: { kind: 'guess', name: "a baby" },
              no: {
                kind: 'question',
                text: "In the teen years?",
                yes: { kind: 'guess', name: "a teenager" },
                no: { kind: 'guess', name: "a child" },
              },
            },
            no: {
              kind: 'question',
              text: "Notably old / senior?",
              yes: { kind: 'guess', name: "an elderly person" },
              no: { kind: 'guess', name: "an adult" },
            },
          },
        },
      },
    },
    no: {
      kind: 'question',
      text: "Is it an animal?",
      yes: {
        kind: 'question',
        text: "Does it live mostly in water?",
        yes: {
          kind: 'question',
          text: "Is it a mammal?",
          yes: {
            kind: 'question',
            text: "Among the largest animals on Earth?",
            yes: { kind: 'guess', name: "a whale" },
            no: {
              kind: 'question',
              text: "Often seen floating on its back?",
              yes: { kind: 'guess', name: "an otter" },
              no: {
                kind: 'question',
                text: "Has flippers and spends time on ice or shore?",
                yes: { kind: 'guess', name: "a seal" },
                no: { kind: 'guess', name: "a dolphin" },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Does it have a hard shell or exoskeleton?",
            yes: {
              kind: 'question',
              text: "Is it a reptile?",
              yes: { kind: 'guess', name: "a turtle" },
              no: {
                kind: 'question',
                text: "Typically lives in a two-part shell?",
                yes: { kind: 'guess', name: "a clam" },
                no: {
                  kind: 'question',
                  text: "Has large claws?",
                  yes: { kind: 'guess', name: "a lobster" },
                  no: { kind: 'guess', name: "a crab" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does it have tentacles?",
              yes: {
                kind: 'question',
                text: "Is it soft and gelatinous?",
                yes: { kind: 'guess', name: "a jellyfish" },
                no: { kind: 'guess', name: "an octopus" },
              },
              no: {
                kind: 'question',
                text: "Is it a common pet fish?",
                yes: { kind: 'guess', name: "a goldfish" },
                no: { kind: 'guess', name: "a shark" },
              },
            },
          },
        },
        no: {
          kind: 'question',
          text: "Can it fly under its own power?",
          yes: {
            kind: 'question',
            text: "Is it a bird?",
            yes: {
              kind: 'question',
              text: "Is it a bird of prey?",
              yes: {
                kind: 'question',
                text: "Is it primarily nocturnal?",
                yes: { kind: 'guess', name: "an owl" },
                no: { kind: 'guess', name: "an eagle" },
              },
              no: {
                kind: 'question',
                text: "Is it commonly raised on a farm?",
                yes: { kind: 'guess', name: "a chicken" },
                no: {
                  kind: 'question',
                  text: "Can it not fly well, but swim?",
                  yes: { kind: 'guess', name: "a penguin" },
                  no: {
                    kind: 'question',
                    text: "Is it often kept as a talking pet?",
                    yes: { kind: 'guess', name: "a parrot" },
                    no: { kind: 'guess', name: "a crow" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a mammal?",
              yes: { kind: 'guess', name: "a bat" },
              no: {
                kind: 'question',
                text: "Does it produce honey?",
                yes: { kind: 'guess', name: "a bee" },
                no: {
                  kind: 'question',
                  text: "Does it have large colorful wings?",
                  yes: { kind: 'guess', name: "a butterfly" },
                  no: {
                    kind: 'question',
                    text: "Does it feed on blood?",
                    yes: { kind: 'guess', name: "a mosquito" },
                    no: { kind: 'guess', name: "a fly" },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Is it a common household pet?",
            yes: {
              kind: 'question',
              text: "Is it a mammal?",
              yes: {
                kind: 'question',
                text: "Is it a feline or canine?",
                yes: {
                  kind: 'question',
                  text: "Is it a feline?",
                  yes: { kind: 'guess', name: "a cat" },
                  no: { kind: 'guess', name: "a dog" },
                },
                no: {
                  kind: 'question',
                  text: "Does it hop with long ears?",
                  yes: { kind: 'guess', name: "a rabbit" },
                  no: {
                    kind: 'question',
                    text: "Does it store food in its cheeks?",
                    yes: { kind: 'guess', name: "a hamster" },
                    no: { kind: 'guess', name: "a guinea pig" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does it live in water as a pet?",
                yes: { kind: 'guess', name: "a goldfish" },
                no: {
                  kind: 'question',
                  text: "Is it a bird?",
                  yes: { kind: 'guess', name: "a parrot" },
                  no: {
                    kind: 'question',
                    text: "Does it have a shell?",
                    yes: { kind: 'guess', name: "a turtle" },
                    no: { kind: 'guess', name: "a snake" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a farm animal?",
              yes: {
                kind: 'question',
                text: "Is it used mainly for riding?",
                yes: { kind: 'guess', name: "a horse" },
                no: {
                  kind: 'question',
                  text: "Does it produce wool?",
                  yes: { kind: 'guess', name: "a sheep" },
                  no: {
                    kind: 'question',
                    text: "Is it a bird?",
                    yes: { kind: 'guess', name: "a chicken" },
                    no: {
                      kind: 'question',
                      text: "Is it typically raised for milk?",
                      yes: { kind: 'guess', name: "a cow" },
                      no: {
                        kind: 'question',
                        text: "Is it typically raised for pork?",
                        yes: { kind: 'guess', name: "a pig" },
                        no: { kind: 'guess', name: "a goat" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a big cat (lion, tiger, etc.)?",
                yes: {
                  kind: 'question',
                  text: "Do adult males usually have a mane?",
                  yes: { kind: 'guess', name: "a lion" },
                  no: {
                    kind: 'question',
                    text: "Does it have black stripes on orange fur?",
                    yes: { kind: 'guess', name: "a tiger" },
                    no: {
                      kind: 'question',
                      text: "Is it the fastest land animal?",
                      yes: { kind: 'guess', name: "a cheetah" },
                      no: { kind: 'guess', name: "a leopard" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it an insect?",
                  yes: {
                    kind: 'question',
                    text: "Does it have a trunk?",
                    yes: { kind: 'guess', name: "an elephant" },
                    no: { kind: 'guess', name: "an ant" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it an arachnid?",
                    yes: { kind: 'guess', name: "a spider" },
                    no: {
                      kind: 'question',
                      text: "Is it an amphibian?",
                      yes: { kind: 'guess', name: "a frog" },
                      no: {
                        kind: 'question',
                        text: "Does it have a very long neck?",
                        yes: { kind: 'guess', name: "a giraffe" },
                        no: {
                          kind: 'question',
                          text: "Does it have black and white stripes?",
                          yes: { kind: 'guess', name: "a zebra" },
                          no: {
                            kind: 'question',
                            text: "Is it a primate?",
                            yes: { kind: 'guess', name: "a monkey" },
                            no: {
                              kind: 'question',
                              text: "Does it usually live and hunt in packs?",
                              yes: { kind: 'guess', name: "a wolf" },
                              no: {
                                kind: 'question',
                                text: "Do males often have antlers?",
                                yes: { kind: 'guess', name: "a deer" },
                                no: { kind: 'guess', name: "a bear" },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      no: {
        kind: 'question',
        text: "Is it a plant?",
        yes: {
          kind: 'question',
          text: "Is it a tree?",
          yes: {
            kind: 'question',
            text: "Does it produce edible fruit commonly eaten raw?",
            yes: { kind: 'guess', name: "an apple tree" },
            no: {
              kind: 'question',
              text: "Is it an evergreen with needles?",
              yes: { kind: 'guess', name: "a pine tree" },
              no: {
                kind: 'question',
                text: "Is it associated with tropical climates and fronds?",
                yes: { kind: 'guess', name: "a palm tree" },
                no: {
                  kind: 'question',
                  text: "Is it often associated with fall color or syrup?",
                  yes: { kind: 'guess', name: "a maple tree" },
                  no: { kind: 'guess', name: "an oak tree" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Is it a flower?",
            yes: {
              kind: 'question',
              text: "Is it typically associated with romance?",
              yes: { kind: 'guess', name: "a rose" },
              no: {
                kind: 'question',
                text: "Does it have a large yellow head?",
                yes: { kind: 'guess', name: "a sunflower" },
                no: {
                  kind: 'question',
                  text: "Is it a spring bulb flower?",
                  yes: { kind: 'guess', name: "a tulip" },
                  no: { kind: 'guess', name: "a daisy" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a fungus rather than a green plant?",
              yes: { kind: 'guess', name: "a mushroom" },
              no: {
                kind: 'question',
                text: "Does it have spines and store water?",
                yes: { kind: 'guess', name: "a cactus" },
                no: {
                  kind: 'question',
                  text: "Does it have feathery fronds and no flowers?",
                  yes: { kind: 'guess', name: "a fern" },
                  no: { kind: 'guess', name: "grass" },
                },
              },
            },
          },
        },
        no: { kind: 'guess', name: "a bacterium" },
      },
    },
  },
  no: {
    kind: 'question',
    text: "Is it commonly found in a typical house?",
    yes: {
      kind: 'question',
      text: "Does it use electricity?",
      yes: {
        kind: 'question',
        text: "Is it attached to a wall or building?",
        yes: {
          kind: 'question',
          text: "Is it mainly used to turn lights or power on and off?",
          yes: { kind: 'guess', name: "a light switch" },
          no: {
            kind: 'question',
            text: "Does it produce light itself?",
            yes: { kind: 'guess', name: "a light bulb" },
            no: {
              kind: 'question',
              text: "Does it provide sockets for plugs?",
              yes: { kind: 'guess', name: "an outlet" },
              no: { kind: 'guess', name: "a thermostat" },
            },
          },
        },
        no: {
          kind: 'question',
          text: "Is it a large kitchen or laundry appliance?",
          yes: {
            kind: 'question',
            text: "Does it keep food cold?",
            yes: { kind: 'guess', name: "a refrigerator" },
            no: {
              kind: 'question',
              text: "Is it used for cooking on burners?",
              yes: { kind: 'guess', name: "a stove" },
              no: {
                kind: 'question',
                text: "Is it an enclosed box that bakes?",
                yes: { kind: 'guess', name: "an oven" },
                no: {
                  kind: 'question',
                  text: "Does it heat food very quickly?",
                  yes: { kind: 'guess', name: "a microwave" },
                  no: {
                    kind: 'question',
                    text: "Does it wash dishes?",
                    yes: { kind: 'guess', name: "a dishwasher" },
                    no: {
                      kind: 'question',
                      text: "Does it wash clothes?",
                      yes: { kind: 'guess', name: "a washing machine" },
                      no: {
                        kind: 'question',
                        text: "Does it dry clothes?",
                        yes: { kind: 'guess', name: "a dryer" },
                        no: { kind: 'guess', name: "a vacuum cleaner" },
                      },
                    },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Does it have a screen?",
            yes: {
              kind: 'question',
              text: "Is it portable (meant to be carried around)?",
              yes: {
                kind: 'question',
                text: "Is it small enough to fit in a typical pocket?",
                yes: { kind: 'guess', name: "a smartphone" },
                no: {
                  kind: 'question',
                  text: "Does it have a built-in physical keyboard that folds shut?",
                  yes: { kind: 'guess', name: "a laptop" },
                  no: { kind: 'guess', name: "a tablet" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it mainly used as a general-purpose computer for work or browsing?",
                yes: { kind: 'guess', name: "a computer" },
                no: {
                  kind: 'question',
                  text: "Is it mainly for watching shows from across a room?",
                  yes: { kind: 'guess', name: "a TV" },
                  no: { kind: 'guess', name: "a monitor" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it worn on the body?",
              yes: {
                kind: 'question',
                text: "Is it worn on the wrist?",
                yes: {
                  kind: 'question',
                  text: "Is it mainly for health / step tracking?",
                  yes: { kind: 'guess', name: "a fitness tracker" },
                  no: { kind: 'guess', name: "a smartwatch" },
                },
                no: {
                  kind: 'question',
                  text: "Do the cups sit over the ears rather than in them?",
                  yes: { kind: 'guess', name: "headphones" },
                  no: { kind: 'guess', name: "earbuds" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it held to play video games?",
                yes: {
                  kind: 'question',
                  text: "Is it a whole game system for a TV?",
                  yes: { kind: 'guess', name: "a gaming console" },
                  no: { kind: 'guess', name: "a game controller" },
                },
                no: {
                  kind: 'question',
                  text: "Is it mainly used to control another device from a distance?",
                  yes: { kind: 'guess', name: "a remote control" },
                  no: {
                    kind: 'question',
                    text: "Is it used for typing?",
                    yes: { kind: 'guess', name: "a keyboard" },
                    no: {
                      kind: 'question',
                      text: "Does it control a pointer on a screen?",
                      yes: { kind: 'guess', name: "a computer mouse" },
                      no: {
                        kind: 'question',
                        text: "Does it print on paper?",
                        yes: { kind: 'guess', name: "a printer" },
                        no: {
                          kind: 'question',
                          text: "Does it produce sound for a room?",
                          yes: { kind: 'guess', name: "a speaker" },
                          no: {
                            kind: 'question',
                            text: "Does it provide a home Wi-Fi network?",
                            yes: { kind: 'guess', name: "a router" },
                            no: {
                              kind: 'question',
                              text: "Is it mainly for taking photos or video?",
                              yes: { kind: 'guess', name: "a camera" },
                              no: {
                                kind: 'question',
                                text: "Does it store electrical energy in a cell or pack?",
                                yes: { kind: 'guess', name: "a battery" },
                                no: {
                                  kind: 'question',
                                  text: "Is it a small stick for storing files?",
                                  yes: { kind: 'guess', name: "a USB drive" },
                                  no: { kind: 'guess', name: "a charger" },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      no: {
        kind: 'question',
        text: "Is it attached to a door or wall?",
        yes: {
          kind: 'question',
          text: "Is it used to open or close a door?",
          yes: { kind: 'guess', name: "a doorknob" },
          no: {
            kind: 'question',
            text: "Does it show a reflection?",
            yes: { kind: 'guess', name: "a mirror" },
            no: { kind: 'guess', name: "a picture frame" },
          },
        },
        no: {
          kind: 'question',
          text: "Is it furniture?",
          yes: {
            kind: 'question',
            text: "Is it meant for sleeping?",
            yes: { kind: 'guess', name: "a bed" },
            no: {
              kind: 'question',
              text: "Is it meant for sitting by more than one person?",
              yes: { kind: 'guess', name: "a couch" },
              no: {
                kind: 'question',
                text: "Is it meant for sitting by one person?",
                yes: { kind: 'guess', name: "a chair" },
                no: {
                  kind: 'question',
                  text: "Is it a work surface with drawers?",
                  yes: { kind: 'guess', name: "a desk" },
                  no: {
                    kind: 'question',
                    text: "Is it a flat surface for dining or placing things?",
                    yes: { kind: 'guess', name: "a table" },
                    no: {
                      kind: 'question',
                      text: "Does it provide light?",
                      yes: { kind: 'guess', name: "a lamp" },
                      no: {
                        kind: 'question',
                        text: "Does it hold books?",
                        yes: { kind: 'guess', name: "a bookshelf" },
                        no: { kind: 'guess', name: "a rug" },
                      },
                    },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Does it open locks?",
            yes: { kind: 'guess', name: "a key" },
            no: {
              kind: 'question',
              text: "Is it used for drying off?",
              yes: { kind: 'guess', name: "a towel" },
              no: {
                kind: 'question',
                text: "Is it used for washing hands or body?",
                yes: { kind: 'guess', name: "soap" },
                no: {
                  kind: 'question',
                  text: "Is it used to clean teeth?",
                  yes: { kind: 'guess', name: "a toothbrush" },
                  no: {
                    kind: 'question',
                    text: "Is it made of wax and burned for light?",
                    yes: { kind: 'guess', name: "a candle" },
                    no: { kind: 'guess', name: "a clock" },
                  },
                },
              },
            },
          },
        },
      },
    },
    no: {
      kind: 'question',
      text: "Is it bigger than a breadbox?",
      yes: {
        kind: 'question',
        text: "Is it a vehicle?",
        yes: {
          kind: 'question',
          text: "Does it fly?",
          yes: {
            kind: 'question',
            text: "Does it have spinning rotors on top?",
            yes: { kind: 'guess', name: "a helicopter" },
            no: {
              kind: 'question',
              text: "Is it unmanned / remotely piloted?",
              yes: { kind: 'guess', name: "a drone" },
              no: {
                kind: 'question',
                text: "Does it go to space?",
                yes: { kind: 'guess', name: "a rocket" },
                no: {
                  kind: 'question',
                  text: "Is it inflated with hot air?",
                  yes: { kind: 'guess', name: "a hot air balloon" },
                  no: { kind: 'guess', name: "an airplane" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Does it go on water?",
            yes: {
              kind: 'question',
              text: "Is it paddled while sitting?",
              yes: {
                kind: 'question',
                text: "Does it typically use a double-bladed paddle?",
                yes: { kind: 'guess', name: "a kayak" },
                no: { kind: 'guess', name: "a canoe" },
              },
              no: {
                kind: 'question',
                text: "Does it travel underwater?",
                yes: { kind: 'guess', name: "a submarine" },
                no: {
                  kind: 'question',
                  text: "Is it powered mainly by sails?",
                  yes: { kind: 'guess', name: "a sailboat" },
                  no: { kind: 'guess', name: "a cruise ship" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does it have two wheels?",
              yes: {
                kind: 'question',
                text: "Is it pedaled by the rider?",
                yes: { kind: 'guess', name: "a bicycle" },
                no: {
                  kind: 'question',
                  text: "Is it motorized and straddled like a bike?",
                  yes: { kind: 'guess', name: "a motorcycle" },
                  no: { kind: 'guess', name: "a scooter" },
                },
              },
              no: {
                kind: 'question',
                text: "Does it run on rails?",
                yes: { kind: 'guess', name: "a train" },
                no: {
                  kind: 'question',
                  text: "Is it an emergency vehicle?",
                  yes: { kind: 'guess', name: "an ambulance" },
                  no: {
                    kind: 'question',
                    text: "Does it carry many passengers on a city route?",
                    yes: { kind: 'guess', name: "a bus" },
                    no: {
                      kind: 'question',
                      text: "Is it used on a farm?",
                      yes: { kind: 'guess', name: "a tractor" },
                      no: {
                        kind: 'question',
                        text: "Is it larger than a car and used for hauling cargo?",
                        yes: { kind: 'guess', name: "a truck" },
                        no: { kind: 'guess', name: "a car" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        no: {
          kind: 'question',
          text: "Is it a natural outdoor place (not a building)?",
          yes: {
            kind: 'question',
            text: "Is it covered in sand beside water?",
            yes: { kind: 'guess', name: "a beach" },
            no: {
              kind: 'question',
              text: "Is it a large body of salt water?",
              yes: { kind: 'guess', name: "an ocean" },
              no: {
                kind: 'question',
                text: "Is it dense with trees?",
                yes: { kind: 'guess', name: "a forest" },
                no: {
                  kind: 'question',
                  text: "Is it a high landform?",
                  yes: { kind: 'guess', name: "a mountain" },
                  no: { kind: 'guess', name: "a park" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Is it a home / dwelling?",
            yes: {
              kind: 'question',
              text: "Is it one unit in a multi-unit building?",
              yes: { kind: 'guess', name: "an apartment" },
              no: { kind: 'guess', name: "a house" },
            },
            no: {
              kind: 'question',
              text: "Where do kids go to learn?",
              yes: { kind: 'guess', name: "a school" },
              no: {
                kind: 'question',
                text: "Where are sick people treated?",
                yes: { kind: 'guess', name: "a hospital" },
                no: { kind: 'guess', name: "a library" },
              },
            },
          },
        },
      },
      no: {
        kind: 'question',
        text: "Is it food or drink?",
        yes: {
          kind: 'question',
          text: "Is it a drink?",
          yes: {
            kind: 'question',
            text: "Is it alcoholic?",
            yes: {
              kind: 'question',
              text: "Is it made from grapes?",
              yes: { kind: 'guess', name: "wine" },
              no: { kind: 'guess', name: "beer" },
            },
            no: {
              kind: 'question',
              text: "Is it typically served hot?",
              yes: {
                kind: 'question',
                text: "Is it made from roasted beans?",
                yes: { kind: 'guess', name: "coffee" },
                no: { kind: 'guess', name: "tea" },
              },
              no: {
                kind: 'question',
                text: "Does it commonly come from cows?",
                yes: { kind: 'guess', name: "milk" },
                no: {
                  kind: 'question',
                  text: "Is it carbonated and sweet?",
                  yes: { kind: 'guess', name: "soda" },
                  no: {
                    kind: 'question',
                    text: "Is it made from oranges?",
                    yes: { kind: 'guess', name: "orange juice" },
                    no: { kind: 'guess', name: "water" },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Is it a fruit or vegetable?",
            yes: {
              kind: 'question',
              text: "Is it a fruit?",
              yes: {
                kind: 'question',
                text: "Is it yellow and curved?",
                yes: { kind: 'guess', name: "a banana" },
                no: {
                  kind: 'question',
                  text: "Is it citrus?",
                  yes: { kind: 'guess', name: "an orange" },
                  no: {
                    kind: 'question',
                    text: "Is it very large and mostly red inside?",
                    yes: { kind: 'guess', name: "a watermelon" },
                    no: {
                      kind: 'question',
                      text: "Does it grow in small bunches?",
                      yes: { kind: 'guess', name: "a grape" },
                      no: {
                        kind: 'question',
                        text: "Does it have seeds on the outside?",
                        yes: { kind: 'guess', name: "a strawberry" },
                        no: { kind: 'guess', name: "an apple" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it orange and grows underground?",
                yes: { kind: 'guess', name: "a carrot" },
                no: {
                  kind: 'question',
                  text: "Is it a leafy green?",
                  yes: { kind: 'guess', name: "lettuce" },
                  no: {
                    kind: 'question',
                    text: "Does it look like green florets?",
                    yes: { kind: 'guess', name: "broccoli" },
                    no: {
                      kind: 'question',
                      text: "Is it a starchy tuber?",
                      yes: { kind: 'guess', name: "a potato" },
                      no: {
                        kind: 'question',
                        text: "Does cutting it often make people cry?",
                        yes: { kind: 'guess', name: "an onion" },
                        no: { kind: 'guess', name: "a tomato" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it typically a dessert / sweet?",
              yes: { kind: 'guess', name: "ice cream" },
              no: {
                kind: 'question',
                text: "Is it round and often topped with cheese?",
                yes: { kind: 'guess', name: "a pizza" },
                no: {
                  kind: 'question',
                  text: "Is it a patty in a bun?",
                  yes: { kind: 'guess', name: "a hamburger" },
                  no: {
                    kind: 'question',
                    text: "Is it in a tortilla?",
                    yes: { kind: 'guess', name: "a taco" },
                    no: {
                      kind: 'question',
                      text: "Is it bread with fillings?",
                      yes: { kind: 'guess', name: "a sandwich" },
                      no: {
                        kind: 'question',
                        text: "Is it a liquid dish eaten with a spoon?",
                        yes: { kind: 'guess', name: "soup" },
                        no: {
                          kind: 'question',
                          text: "Is it dairy, often sliced or shredded?",
                          yes: { kind: 'guess', name: "cheese" },
                          no: {
                            kind: 'question',
                            text: "Is it a baked staple made from flour?",
                            yes: { kind: 'guess', name: "bread" },
                            no: {
                              kind: 'question',
                              text: "Is it noodles?",
                              yes: { kind: 'guess', name: "pasta" },
                              no: { kind: 'guess', name: "an egg" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        no: {
          kind: 'question',
          text: "Do you wear it?",
          yes: {
            kind: 'question',
            text: "Is it worn on the feet?",
            yes: {
              kind: 'question',
              text: "Is it a soft covering worn inside shoes?",
              yes: { kind: 'guess', name: "socks" },
              no: {
                kind: 'question',
                text: "Is it taller / sturdier footwear?",
                yes: { kind: 'guess', name: "boots" },
                no: { kind: 'guess', name: "sneakers" },
              },
            },
            no: {
              kind: 'question',
              text: "Is it worn on the head?",
              yes: { kind: 'guess', name: "a hat" },
              no: {
                kind: 'question',
                text: "Is it worn on the hands?",
                yes: { kind: 'guess', name: "gloves" },
                no: {
                  kind: 'question',
                  text: "Does it help you see?",
                  yes: { kind: 'guess', name: "glasses" },
                  no: {
                    kind: 'question',
                    text: "Does it tell time on the wrist?",
                    yes: { kind: 'guess', name: "a watch" },
                    no: {
                      kind: 'question',
                      text: "Are they denim pants?",
                      yes: { kind: 'guess', name: "jeans" },
                      no: {
                        kind: 'question',
                        text: "Is it an outer garment for warmth?",
                        yes: { kind: 'guess', name: "a jacket" },
                        no: { kind: 'guess', name: "a t-shirt" },
                      },
                    },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Is it a tool?",
            yes: {
              kind: 'question',
              text: "Is it used for pounding nails?",
              yes: { kind: 'guess', name: "a hammer" },
              no: {
                kind: 'question',
                text: "Is it used for turning screws?",
                yes: { kind: 'guess', name: "a screwdriver" },
                no: {
                  kind: 'question',
                  text: "Is it used for cutting paper?",
                  yes: { kind: 'guess', name: "scissors" },
                  no: {
                    kind: 'question',
                    text: "Does it produce a beam of light?",
                    yes: { kind: 'guess', name: "a flashlight" },
                    no: { kind: 'guess', name: "a knife" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it used for eating?",
              yes: {
                kind: 'question',
                text: "Is it a drinking vessel?",
                yes: { kind: 'guess', name: "a mug" },
                no: {
                  kind: 'question',
                  text: "Is it a flat dish?",
                  yes: { kind: 'guess', name: "a plate" },
                  no: {
                    kind: 'question',
                    text: "Does it have tines / prongs?",
                    yes: { kind: 'guess', name: "a fork" },
                    no: { kind: 'guess', name: "a spoon" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it used for writing?",
                yes: { kind: 'guess', name: "a pen" },
                no: {
                  kind: 'question',
                  text: "Is it a round play object?",
                  yes: { kind: 'guess', name: "a ball" },
                  no: {
                    kind: 'question',
                    text: "Does it have pages to read?",
                    yes: { kind: 'guess', name: "a book" },
                    no: {
                      kind: 'question',
                      text: "Is it used to carry other items?",
                      yes: { kind: 'guess', name: "a backpack" },
                      no: { kind: 'guess', name: "a coin" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
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
