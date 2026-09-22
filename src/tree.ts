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
export const STORAGE_KEY = 'twentyq-tree-v10'
export const MAX_QUESTIONS = 20

/** Bump this whenever the seeded question order/content changes. */
export const SEED_VERSION = 10
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

/** Seed v10: Tablet before computer under electronics; Electronic before breadbox; live path has no model fallback. */
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
            text: "Does its name come before \"Hawkeye\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Captain America\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Batman\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it Ant-Man?",
                  yes: { kind: 'guess', name: "Ant-Man" },
                  no: { kind: 'guess', name: "Aquaman" },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Black Panther\" alphabetically?",
                  yes: { kind: 'guess', name: "Batman" },
                  no: {
                    kind: 'question',
                    text: "Is it Black Panther?",
                    yes: { kind: 'guess', name: "Black Panther" },
                    no: { kind: 'guess', name: "Black Widow" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"Doctor Strange\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Captain Marvel\" alphabetically?",
                  yes: { kind: 'guess', name: "Captain America" },
                  no: {
                    kind: 'question',
                    text: "Is it Captain Marvel?",
                    yes: { kind: 'guess', name: "Captain Marvel" },
                    no: { kind: 'guess', name: "Deadpool" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Flash\" alphabetically?",
                  yes: { kind: 'guess', name: "Doctor Strange" },
                  no: {
                    kind: 'question',
                    text: "Is it Flash?",
                    yes: { kind: 'guess', name: "Flash" },
                    no: { kind: 'guess', name: "Green Lantern" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"Spider-Man\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Iron Man\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it Hawkeye?",
                  yes: { kind: 'guess', name: "Hawkeye" },
                  no: { kind: 'guess', name: "Hulk" },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Joker\" alphabetically?",
                  yes: { kind: 'guess', name: "Iron Man" },
                  no: {
                    kind: 'question',
                    text: "Is it Joker?",
                    yes: { kind: 'guess', name: "Joker" },
                    no: { kind: 'guess', name: "Scarlet Witch" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"Venom\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Superman\" alphabetically?",
                  yes: { kind: 'guess', name: "Spider-Man" },
                  no: {
                    kind: 'question',
                    text: "Is it Superman?",
                    yes: { kind: 'guess', name: "Superman" },
                    no: { kind: 'guess', name: "Thor" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Wolverine\" alphabetically?",
                  yes: { kind: 'guess', name: "Venom" },
                  no: {
                    kind: 'question',
                    text: "Is it Wolverine?",
                    yes: { kind: 'guess', name: "Wolverine" },
                    no: { kind: 'guess', name: "Wonder Woman" },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Star Wars?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Luke Skywalker\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Chewbacca\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Boba Fett\" alphabetically?",
                  yes: { kind: 'guess', name: "Baby Yoda" },
                  no: {
                    kind: 'question',
                    text: "Is it Boba Fett?",
                    yes: { kind: 'guess', name: "Boba Fett" },
                    no: { kind: 'guess', name: "C-3PO" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Han Solo\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Chewbacca?",
                    yes: { kind: 'guess', name: "Chewbacca" },
                    no: { kind: 'guess', name: "Darth Vader" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Han Solo?",
                    yes: { kind: 'guess', name: "Han Solo" },
                    no: { kind: 'guess', name: "Kylo Ren" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"Princess Leia\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Obi-Wan Kenobi\" alphabetically?",
                  yes: { kind: 'guess', name: "Luke Skywalker" },
                  no: {
                    kind: 'question',
                    text: "Is it Obi-Wan Kenobi?",
                    yes: { kind: 'guess', name: "Obi-Wan Kenobi" },
                    no: { kind: 'guess', name: "Padmé Amidala" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Rey\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Princess Leia?",
                    yes: { kind: 'guess', name: "Princess Leia" },
                    no: { kind: 'guess', name: "R2-D2" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Rey?",
                    yes: { kind: 'guess', name: "Rey" },
                    no: { kind: 'guess', name: "Yoda" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Animated / Disney / cartoon?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Mario\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Dora the Explorer\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Bugs Bunny\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Bart Simpson\" alphabetically?",
                      yes: { kind: 'guess', name: "Ash Ketchum" },
                      no: {
                        kind: 'question',
                        text: "Is it Bart Simpson?",
                        yes: { kind: 'guess', name: "Bart Simpson" },
                        no: { kind: 'guess', name: "Bluey" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Buzz Lightyear\" alphabetically?",
                      yes: { kind: 'guess', name: "Bugs Bunny" },
                      no: {
                        kind: 'question',
                        text: "Is it Buzz Lightyear?",
                        yes: { kind: 'guess', name: "Buzz Lightyear" },
                        no: { kind: 'guess', name: "Donald Duck" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Goofy\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Elsa\" alphabetically?",
                      yes: { kind: 'guess', name: "Dora the Explorer" },
                      no: {
                        kind: 'question',
                        text: "Is it Elsa?",
                        yes: { kind: 'guess', name: "Elsa" },
                        no: { kind: 'guess', name: "Goku" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Hello Kitty\" alphabetically?",
                      yes: { kind: 'guess', name: "Goofy" },
                      no: {
                        kind: 'question',
                        text: "Is it Hello Kitty?",
                        yes: { kind: 'guess', name: "Hello Kitty" },
                        no: { kind: 'guess', name: "Homer Simpson" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Scooby-Doo\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Naruto\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Mickey Mouse\" alphabetically?",
                      yes: { kind: 'guess', name: "Mario" },
                      no: {
                        kind: 'question',
                        text: "Is it Mickey Mouse?",
                        yes: { kind: 'guess', name: "Mickey Mouse" },
                        no: { kind: 'guess', name: "Minion" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Peppa Pig\" alphabetically?",
                      yes: { kind: 'guess', name: "Naruto" },
                      no: {
                        kind: 'question',
                        text: "Is it Peppa Pig?",
                        yes: { kind: 'guess', name: "Peppa Pig" },
                        no: { kind: 'guess', name: "Pikachu" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Sonic the Hedgehog\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Shrek\" alphabetically?",
                      yes: { kind: 'guess', name: "Scooby-Doo" },
                      no: {
                        kind: 'question',
                        text: "Is it Shrek?",
                        yes: { kind: 'guess', name: "Shrek" },
                        no: { kind: 'guess', name: "Simba" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Winnie the Pooh\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it Sonic the Hedgehog?",
                        yes: { kind: 'guess', name: "Sonic the Hedgehog" },
                        no: { kind: 'guess', name: "SpongeBob" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Winnie the Pooh?",
                        yes: { kind: 'guess', name: "Winnie the Pooh" },
                        no: { kind: 'guess', name: "Woody" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"King Kong\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Genie\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"E.T.\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Cinderella\" alphabetically?",
                      yes: { kind: 'guess', name: "Aladdin" },
                      no: {
                        kind: 'question',
                        text: "Is it Cinderella?",
                        yes: { kind: 'guess', name: "Cinderella" },
                        no: { kind: 'guess', name: "Doc Brown" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Ethan Hunt\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it E.T.?",
                        yes: { kind: 'guess', name: "E.T." },
                        no: { kind: 'guess', name: "Ellen Ripley" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Ethan Hunt?",
                        yes: { kind: 'guess', name: "Ethan Hunt" },
                        no: { kind: 'guess', name: "Forrest Gump" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Jack Sparrow\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Gollum (movie)\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it Genie?",
                        yes: { kind: 'guess', name: "Genie" },
                        no: { kind: 'guess', name: "Godzilla" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Gollum (movie)?",
                        yes: { kind: 'guess', name: "Gollum (movie)" },
                        no: { kind: 'guess', name: "Indiana Jones" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Jason Bourne\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it Jack Sparrow?",
                        yes: { kind: 'guess', name: "Jack Sparrow" },
                        no: { kind: 'guess', name: "James Bond" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Jason Bourne?",
                        yes: { kind: 'guess', name: "Jason Bourne" },
                        no: { kind: 'guess', name: "John Wick" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Rocky Balboa\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Mary Poppins\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Luke Cage\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it King Kong?",
                        yes: { kind: 'guess', name: "King Kong" },
                        no: { kind: 'guess', name: "Lara Croft (movie)" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Luke Cage?",
                        yes: { kind: 'guess', name: "Luke Cage" },
                        no: { kind: 'guess', name: "Marty McFly" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Mulan\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it Mary Poppins?",
                        yes: { kind: 'guess', name: "Mary Poppins" },
                        no: { kind: 'guess', name: "Moana" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Mulan?",
                        yes: { kind: 'guess', name: "Mulan" },
                        no: { kind: 'guess', name: "Neo" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"The Terminator\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Snow White\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it Rocky Balboa?",
                        yes: { kind: 'guess', name: "Rocky Balboa" },
                        no: { kind: 'guess', name: "Sarah Connor" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Snow White?",
                        yes: { kind: 'guess', name: "Snow White" },
                        no: { kind: 'guess', name: "Tarzan" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Trinity\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it The Terminator?",
                        yes: { kind: 'guess', name: "The Terminator" },
                        no: { kind: 'guess', name: "Tony Montana" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Trinity?",
                        yes: { kind: 'guess', name: "Trinity" },
                        no: { kind: 'guess', name: "Willy Wonka" },
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
          text: "From a book, myth, or video game?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"Loki (mythology)\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Frankenstein\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Cupid\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Aslan\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Apollo\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Alice in Wonderland?",
                      yes: { kind: 'guess', name: "Alice in Wonderland" },
                      no: { kind: 'guess', name: "Aloy" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Apollo?",
                      yes: { kind: 'guess', name: "Apollo" },
                      no: { kind: 'guess', name: "Aragorn" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Bilbo Baggins\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Aslan?",
                      yes: { kind: 'guess', name: "Aslan" },
                      no: { kind: 'guess', name: "Athena" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Cloud Strife\" alphabetically?",
                      yes: { kind: 'guess', name: "Bilbo Baggins" },
                      no: {
                        kind: 'question',
                        text: "Is it Cloud Strife?",
                        yes: { kind: 'guess', name: "Cloud Strife" },
                        no: { kind: 'guess', name: "Cowardly Lion" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Dragon\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Dorothy Gale\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Cupid?",
                      yes: { kind: 'guess', name: "Cupid" },
                      no: { kind: 'guess', name: "Donkey Kong" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Dorothy Gale?",
                      yes: { kind: 'guess', name: "Dorothy Gale" },
                      no: { kind: 'guess', name: "Dracula" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Easter Bunny\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Dragon?",
                      yes: { kind: 'guess', name: "Dragon" },
                      no: { kind: 'guess', name: "Dwarf" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Elf\" alphabetically?",
                      yes: { kind: 'guess', name: "Easter Bunny" },
                      no: {
                        kind: 'question',
                        text: "Is it Elf?",
                        yes: { kind: 'guess', name: "Elf" },
                        no: { kind: 'guess', name: "Fairy" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"Hera\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Ghost\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Gandalf\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Frankenstein?",
                      yes: { kind: 'guess', name: "Frankenstein" },
                      no: { kind: 'guess', name: "Frodo" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Gandalf?",
                      yes: { kind: 'guess', name: "Gandalf" },
                      no: { kind: 'guess', name: "Geralt of Rivia" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Gollum\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Ghost?",
                      yes: { kind: 'guess', name: "Ghost" },
                      no: { kind: 'guess', name: "Goblin" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Hades\" alphabetically?",
                      yes: { kind: 'guess', name: "Gollum" },
                      no: {
                        kind: 'question',
                        text: "Is it Hades?",
                        yes: { kind: 'guess', name: "Hades" },
                        no: { kind: 'guess', name: "Harry Potter" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Kirby\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Hermione Granger\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Hera?",
                      yes: { kind: 'guess', name: "Hera" },
                      no: { kind: 'guess', name: "Hercules" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Katniss Everdeen\" alphabetically?",
                      yes: { kind: 'guess', name: "Hermione Granger" },
                      no: {
                        kind: 'question',
                        text: "Is it Katniss Everdeen?",
                        yes: { kind: 'guess', name: "Katniss Everdeen" },
                        no: { kind: 'guess', name: "King Arthur" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Lara Croft\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Kirby?",
                      yes: { kind: 'guess', name: "Kirby" },
                      no: { kind: 'guess', name: "Kratos" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Legolas\" alphabetically?",
                      yes: { kind: 'guess', name: "Lara Croft" },
                      no: {
                        kind: 'question',
                        text: "Is it Legolas?",
                        yes: { kind: 'guess', name: "Legolas" },
                        no: { kind: 'guess', name: "Link" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"Scarecrow\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Orc\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Medusa\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Luigi\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Loki (mythology)?",
                      yes: { kind: 'guess', name: "Loki (mythology)" },
                      no: { kind: 'guess', name: "Lucy Pevensie" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Luigi?",
                      yes: { kind: 'guess', name: "Luigi" },
                      no: { kind: 'guess', name: "Master Chief" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Mermaid\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Medusa?",
                      yes: { kind: 'guess', name: "Medusa" },
                      no: { kind: 'guess', name: "Merlin" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Mummy\" alphabetically?",
                      yes: { kind: 'guess', name: "Mermaid" },
                      no: {
                        kind: 'question',
                        text: "Is it Mummy?",
                        yes: { kind: 'guess', name: "Mummy" },
                        no: { kind: 'guess', name: "Odin" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Phoenix\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Pegasus\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Orc?",
                      yes: { kind: 'guess', name: "Orc" },
                      no: { kind: 'guess', name: "Pac-Man" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Percy Jackson\" alphabetically?",
                      yes: { kind: 'guess', name: "Pegasus" },
                      no: {
                        kind: 'question',
                        text: "Is it Percy Jackson?",
                        yes: { kind: 'guess', name: "Percy Jackson" },
                        no: { kind: 'guess', name: "Peter Pan" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Princess Peach\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Phoenix?",
                      yes: { kind: 'guess', name: "Phoenix" },
                      no: { kind: 'guess', name: "Poseidon" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Robin Hood\" alphabetically?",
                      yes: { kind: 'guess', name: "Princess Peach" },
                      no: {
                        kind: 'question',
                        text: "Is it Robin Hood?",
                        yes: { kind: 'guess', name: "Robin Hood" },
                        no: { kind: 'guess', name: "Santa Claus" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"Unicorn\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Thor (mythology)\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Sherlock Holmes\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Scarecrow?",
                      yes: { kind: 'guess', name: "Scarecrow" },
                      no: { kind: 'guess', name: "Sephiroth" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Sherlock Holmes?",
                      yes: { kind: 'guess', name: "Sherlock Holmes" },
                      no: { kind: 'guess', name: "The Grinch" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Tinker Bell\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Thor (mythology)?",
                      yes: { kind: 'guess', name: "Thor (mythology)" },
                      no: { kind: 'guess', name: "Tin Man" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Tooth Fairy\" alphabetically?",
                      yes: { kind: 'guess', name: "Tinker Bell" },
                      no: {
                        kind: 'question',
                        text: "Is it Tooth Fairy?",
                        yes: { kind: 'guess', name: "Tooth Fairy" },
                        no: { kind: 'guess', name: "Troll" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Witch\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Voldemort\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Unicorn?",
                      yes: { kind: 'guess', name: "Unicorn" },
                      no: { kind: 'guess', name: "Vampire" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Werewolf\" alphabetically?",
                      yes: { kind: 'guess', name: "Voldemort" },
                      no: {
                        kind: 'question',
                        text: "Is it Werewolf?",
                        yes: { kind: 'guess', name: "Werewolf" },
                        no: { kind: 'guess', name: "Wicked Witch" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Zelda\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Witch?",
                      yes: { kind: 'guess', name: "Witch" },
                      no: { kind: 'guess', name: "Wizard" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Zeus\" alphabetically?",
                      yes: { kind: 'guess', name: "Zelda" },
                      no: {
                        kind: 'question',
                        text: "Is it Zeus?",
                        yes: { kind: 'guess', name: "Zeus" },
                        no: { kind: 'guess', name: "Zombie" },
                      },
                    },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Does its name come before \"a superhero sidekick\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a mascot\" alphabetically?",
              yes: { kind: 'guess', name: "a cryptid" },
              no: {
                kind: 'question',
                text: "Is it a mascot?",
                yes: { kind: 'guess', name: "a mascot" },
                no: { kind: 'guess', name: "a meme character" },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"Bigfoot\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a superhero sidekick?",
                yes: { kind: 'guess', name: "a superhero sidekick" },
                no: { kind: 'guess', name: "an OC / original character" },
              },
              no: {
                kind: 'question',
                text: "Is it Bigfoot?",
                yes: { kind: 'guess', name: "Bigfoot" },
                no: { kind: 'guess', name: "the Loch Ness Monster" },
              },
            },
          },
        },
      },
      no: {
        kind: 'question',
        text: "Is it mainly a job or occupation (like teacher, doctor, firefighter)?",
        yes: {
          kind: 'question',
          text: "Does its name come before \"a paramedic\" alphabetically?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"a farmer\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a chef\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a carpenter\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a barber\" alphabetically?",
                  yes: { kind: 'guess', name: "a banker" },
                  no: {
                    kind: 'question',
                    text: "Is it a barber?",
                    yes: { kind: 'guess', name: "a barber" },
                    no: { kind: 'guess', name: "a bus driver" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a cashier\" alphabetically?",
                  yes: { kind: 'guess', name: "a carpenter" },
                  no: {
                    kind: 'question',
                    text: "Is it a cashier?",
                    yes: { kind: 'guess', name: "a cashier" },
                    no: { kind: 'guess', name: "a CEO" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a dancer\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a coach\" alphabetically?",
                  yes: { kind: 'guess', name: "a chef" },
                  no: {
                    kind: 'question',
                    text: "Is it a coach?",
                    yes: { kind: 'guess', name: "a coach" },
                    no: { kind: 'guess', name: "a construction worker" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a dentist\" alphabetically?",
                  yes: { kind: 'guess', name: "a dancer" },
                  no: {
                    kind: 'question',
                    text: "Is it a dentist?",
                    yes: { kind: 'guess', name: "a dentist" },
                    no: { kind: 'guess', name: "a doctor" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a lawyer\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a janitor\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a firefighter\" alphabetically?",
                  yes: { kind: 'guess', name: "a farmer" },
                  no: {
                    kind: 'question',
                    text: "Is it a firefighter?",
                    yes: { kind: 'guess', name: "a firefighter" },
                    no: { kind: 'guess', name: "a hairdresser" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a journalist\" alphabetically?",
                  yes: { kind: 'guess', name: "a janitor" },
                  no: {
                    kind: 'question',
                    text: "Is it a journalist?",
                    yes: { kind: 'guess', name: "a journalist" },
                    no: { kind: 'guess', name: "a judge" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a mailman\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a librarian\" alphabetically?",
                  yes: { kind: 'guess', name: "a lawyer" },
                  no: {
                    kind: 'question',
                    text: "Is it a librarian?",
                    yes: { kind: 'guess', name: "a librarian" },
                    no: { kind: 'guess', name: "a lifeguard" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a musician\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a mailman?",
                    yes: { kind: 'guess', name: "a mailman" },
                    no: { kind: 'guess', name: "a mechanic" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a musician?",
                    yes: { kind: 'guess', name: "a musician" },
                    no: { kind: 'guess', name: "a nurse" },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Does its name come before \"a soldier\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a politician\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a pilot\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a pharmacist\" alphabetically?",
                  yes: { kind: 'guess', name: "a paramedic" },
                  no: {
                    kind: 'question',
                    text: "Is it a pharmacist?",
                    yes: { kind: 'guess', name: "a pharmacist" },
                    no: { kind: 'guess', name: "a photographer" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a plumber\" alphabetically?",
                  yes: { kind: 'guess', name: "a pilot" },
                  no: {
                    kind: 'question',
                    text: "Is it a plumber?",
                    yes: { kind: 'guess', name: "a plumber" },
                    no: { kind: 'guess', name: "a police officer" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a scientist\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a realtor\" alphabetically?",
                  yes: { kind: 'guess', name: "a politician" },
                  no: {
                    kind: 'question',
                    text: "Is it a realtor?",
                    yes: { kind: 'guess', name: "a realtor" },
                    no: { kind: 'guess', name: "a referee" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a security guard\" alphabetically?",
                  yes: { kind: 'guess', name: "a scientist" },
                  no: {
                    kind: 'question',
                    text: "Is it a security guard?",
                    yes: { kind: 'guess', name: "a security guard" },
                    no: { kind: 'guess', name: "a software developer" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a writer\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a truck driver\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a taxi driver\" alphabetically?",
                  yes: { kind: 'guess', name: "a soldier" },
                  no: {
                    kind: 'question',
                    text: "Is it a taxi driver?",
                    yes: { kind: 'guess', name: "a taxi driver" },
                    no: { kind: 'guess', name: "a teacher" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a vet\" alphabetically?",
                  yes: { kind: 'guess', name: "a truck driver" },
                  no: {
                    kind: 'question',
                    text: "Is it a vet?",
                    yes: { kind: 'guess', name: "a vet" },
                    no: { kind: 'guess', name: "a waiter" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"an artist\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"an accountant\" alphabetically?",
                  yes: { kind: 'guess', name: "a writer" },
                  no: {
                    kind: 'question',
                    text: "Is it an accountant?",
                    yes: { kind: 'guess', name: "an accountant" },
                    no: { kind: 'guess', name: "an actor" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"an electrician\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it an artist?",
                    yes: { kind: 'guess', name: "an artist" },
                    no: { kind: 'guess', name: "an astronaut" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it an electrician?",
                    yes: { kind: 'guess', name: "an electrician" },
                    no: { kind: 'guess', name: "an engineer" },
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
            text: "Does its name come before \"Lionel Messi\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Dwayne Johnson\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Beyoncé\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Angelina Jolie\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Alexander the Great\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Albert Einstein\" alphabetically?",
                      yes: { kind: 'guess', name: "Abraham Lincoln" },
                      no: {
                        kind: 'question',
                        text: "Is it Albert Einstein?",
                        yes: { kind: 'guess', name: "Albert Einstein" },
                        no: { kind: 'guess', name: "Alexander Graham Bell" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Amelia Earhart\" alphabetically?",
                      yes: { kind: 'guess', name: "Alexander the Great" },
                      no: {
                        kind: 'question',
                        text: "Is it Amelia Earhart?",
                        yes: { kind: 'guess', name: "Amelia Earhart" },
                        no: { kind: 'guess', name: "Andy Warhol" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Babe Ruth\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Anne Frank\" alphabetically?",
                      yes: { kind: 'guess', name: "Angelina Jolie" },
                      no: {
                        kind: 'question',
                        text: "Is it Anne Frank?",
                        yes: { kind: 'guess', name: "Anne Frank" },
                        no: { kind: 'guess', name: "Aristotle" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Barack Obama\" alphabetically?",
                      yes: { kind: 'guess', name: "Babe Ruth" },
                      no: {
                        kind: 'question',
                        text: "Is it Barack Obama?",
                        yes: { kind: 'guess', name: "Barack Obama" },
                        no: { kind: 'guess', name: "Beethoven" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Cleopatra\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Buddha\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Bill Gates\" alphabetically?",
                      yes: { kind: 'guess', name: "Beyoncé" },
                      no: {
                        kind: 'question',
                        text: "Is it Bill Gates?",
                        yes: { kind: 'guess', name: "Bill Gates" },
                        no: { kind: 'guess', name: "Brad Pitt" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Charles Darwin\" alphabetically?",
                      yes: { kind: 'guess', name: "Buddha" },
                      no: {
                        kind: 'question',
                        text: "Is it Charles Darwin?",
                        yes: { kind: 'guess', name: "Charles Darwin" },
                        no: { kind: 'guess', name: "Chris Hemsworth" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Dalai Lama\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Confucius\" alphabetically?",
                      yes: { kind: 'guess', name: "Cleopatra" },
                      no: {
                        kind: 'question',
                        text: "Is it Confucius?",
                        yes: { kind: 'guess', name: "Confucius" },
                        no: { kind: 'guess', name: "Cristiano Ronaldo" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Donald Trump\" alphabetically?",
                      yes: { kind: 'guess', name: "Dalai Lama" },
                      no: {
                        kind: 'question',
                        text: "Is it Donald Trump?",
                        yes: { kind: 'guess', name: "Donald Trump" },
                        no: { kind: 'guess', name: "Drake" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"Helen Keller\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Frederick Douglass\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Elon Musk\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Ed Sheeran\" alphabetically?",
                      yes: { kind: 'guess', name: "Dwayne Johnson" },
                      no: {
                        kind: 'question',
                        text: "Is it Ed Sheeran?",
                        yes: { kind: 'guess', name: "Ed Sheeran" },
                        no: { kind: 'guess', name: "Ellen DeGeneres" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Elvis Presley\" alphabetically?",
                      yes: { kind: 'guess', name: "Elon Musk" },
                      no: {
                        kind: 'question',
                        text: "Is it Elvis Presley?",
                        yes: { kind: 'guess', name: "Elvis Presley" },
                        no: { kind: 'guess', name: "Franklin D. Roosevelt" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"George Washington\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Frida Kahlo\" alphabetically?",
                      yes: { kind: 'guess', name: "Frederick Douglass" },
                      no: {
                        kind: 'question',
                        text: "Is it Frida Kahlo?",
                        yes: { kind: 'guess', name: "Frida Kahlo" },
                        no: { kind: 'guess', name: "Genghis Khan" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Greta Thunberg\" alphabetically?",
                      yes: { kind: 'guess', name: "George Washington" },
                      no: {
                        kind: 'question',
                        text: "Is it Greta Thunberg?",
                        yes: { kind: 'guess', name: "Greta Thunberg" },
                        no: { kind: 'guess', name: "Harriet Tubman" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Joe Biden\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Jennifer Lawrence\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Isaac Newton\" alphabetically?",
                      yes: { kind: 'guess', name: "Helen Keller" },
                      no: {
                        kind: 'question',
                        text: "Is it Isaac Newton?",
                        yes: { kind: 'guess', name: "Isaac Newton" },
                        no: { kind: 'guess', name: "Jeff Bezos" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Jesus\" alphabetically?",
                      yes: { kind: 'guess', name: "Jennifer Lawrence" },
                      no: {
                        kind: 'question',
                        text: "Is it Jesus?",
                        yes: { kind: 'guess', name: "Jesus" },
                        no: { kind: 'guess', name: "Joan of Arc" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Kamala Harris\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"John F. Kennedy\" alphabetically?",
                      yes: { kind: 'guess', name: "Joe Biden" },
                      no: {
                        kind: 'question',
                        text: "Is it John F. Kennedy?",
                        yes: { kind: 'guess', name: "John F. Kennedy" },
                        no: { kind: 'guess', name: "Julius Caesar" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Leonardo da Vinci\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it Kamala Harris?",
                        yes: { kind: 'guess', name: "Kamala Harris" },
                        no: { kind: 'guess', name: "LeBron James" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Leonardo da Vinci?",
                        yes: { kind: 'guess', name: "Leonardo da Vinci" },
                        no: { kind: 'guess', name: "Leonardo DiCaprio" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"Queen Elizabeth II\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Mozart\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Mark Zuckerberg\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Malala Yousafzai\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Madonna\" alphabetically?",
                      yes: { kind: 'guess', name: "Lionel Messi" },
                      no: {
                        kind: 'question',
                        text: "Is it Madonna?",
                        yes: { kind: 'guess', name: "Madonna" },
                        no: { kind: 'guess', name: "Mahatma Gandhi" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Marie Curie\" alphabetically?",
                      yes: { kind: 'guess', name: "Malala Yousafzai" },
                      no: {
                        kind: 'question',
                        text: "Is it Marie Curie?",
                        yes: { kind: 'guess', name: "Marie Curie" },
                        no: { kind: 'guess', name: "Marilyn Monroe" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Michael Jackson\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Martin Luther King Jr.\" alphabetically?",
                      yes: { kind: 'guess', name: "Mark Zuckerberg" },
                      no: {
                        kind: 'question',
                        text: "Is it Martin Luther King Jr.?",
                        yes: { kind: 'guess', name: "Martin Luther King Jr." },
                        no: { kind: 'guess', name: "Meryl Streep" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Michael Jordan\" alphabetically?",
                      yes: { kind: 'guess', name: "Michael Jackson" },
                      no: {
                        kind: 'question',
                        text: "Is it Michael Jordan?",
                        yes: { kind: 'guess', name: "Michael Jordan" },
                        no: { kind: 'guess', name: "Moses" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Nikola Tesla\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Napoleon\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Muhammad\" alphabetically?",
                      yes: { kind: 'guess', name: "Mozart" },
                      no: {
                        kind: 'question',
                        text: "Is it Muhammad?",
                        yes: { kind: 'guess', name: "Muhammad" },
                        no: { kind: 'guess', name: "Muhammad Ali" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Neil Armstrong\" alphabetically?",
                      yes: { kind: 'guess', name: "Napoleon" },
                      no: {
                        kind: 'question',
                        text: "Is it Neil Armstrong?",
                        yes: { kind: 'guess', name: "Neil Armstrong" },
                        no: { kind: 'guess', name: "Nelson Mandela" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Pelé\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Oprah Winfrey\" alphabetically?",
                      yes: { kind: 'guess', name: "Nikola Tesla" },
                      no: {
                        kind: 'question',
                        text: "Is it Oprah Winfrey?",
                        yes: { kind: 'guess', name: "Oprah Winfrey" },
                        no: { kind: 'guess', name: "Pablo Picasso" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Pope Francis\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it Pelé?",
                        yes: { kind: 'guess', name: "Pelé" },
                        no: { kind: 'guess', name: "Plato" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Pope Francis?",
                        yes: { kind: 'guess', name: "Pope Francis" },
                        no: { kind: 'guess', name: "Princess Diana" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"The Beatles\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Shakespeare\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Rosa Parks\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Rihanna\" alphabetically?",
                      yes: { kind: 'guess', name: "Queen Elizabeth II" },
                      no: {
                        kind: 'question',
                        text: "Is it Rihanna?",
                        yes: { kind: 'guess', name: "Rihanna" },
                        no: { kind: 'guess', name: "Robert Downey Jr." },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Scarlett Johansson\" alphabetically?",
                      yes: { kind: 'guess', name: "Rosa Parks" },
                      no: {
                        kind: 'question',
                        text: "Is it Scarlett Johansson?",
                        yes: { kind: 'guess', name: "Scarlett Johansson" },
                        no: { kind: 'guess', name: "Serena Williams" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Stephen Hawking\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Simone Biles\" alphabetically?",
                      yes: { kind: 'guess', name: "Shakespeare" },
                      no: {
                        kind: 'question',
                        text: "Is it Simone Biles?",
                        yes: { kind: 'guess', name: "Simone Biles" },
                        no: { kind: 'guess', name: "Socrates" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Steve Jobs\" alphabetically?",
                      yes: { kind: 'guess', name: "Stephen Hawking" },
                      no: {
                        kind: 'question',
                        text: "Is it Steve Jobs?",
                        yes: { kind: 'guess', name: "Steve Jobs" },
                        no: { kind: 'guess', name: "Taylor Swift" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Usain Bolt\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Tiger Woods\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Theodore Roosevelt\" alphabetically?",
                      yes: { kind: 'guess', name: "The Beatles" },
                      no: {
                        kind: 'question',
                        text: "Is it Theodore Roosevelt?",
                        yes: { kind: 'guess', name: "Theodore Roosevelt" },
                        no: { kind: 'guess', name: "Thomas Edison" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Tom Brady\" alphabetically?",
                      yes: { kind: 'guess', name: "Tiger Woods" },
                      no: {
                        kind: 'question',
                        text: "Is it Tom Brady?",
                        yes: { kind: 'guess', name: "Tom Brady" },
                        no: { kind: 'guess', name: "Tom Hanks" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Will Smith\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"Vincent van Gogh\" alphabetically?",
                      yes: { kind: 'guess', name: "Usain Bolt" },
                      no: {
                        kind: 'question',
                        text: "Is it Vincent van Gogh?",
                        yes: { kind: 'guess', name: "Vincent van Gogh" },
                        no: { kind: 'guess', name: "Vladimir Putin" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"Wright brothers\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it Will Smith?",
                        yes: { kind: 'guess', name: "Will Smith" },
                        no: { kind: 'guess', name: "Winston Churchill" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Wright brothers?",
                        yes: { kind: 'guess', name: "Wright brothers" },
                        no: { kind: 'guess', name: "Xi Jinping" },
                      },
                    },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Does its name come before \"a teenager\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a neighbor\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a baby?",
                yes: { kind: 'guess', name: "a baby" },
                no: { kind: 'guess', name: "a child" },
              },
              no: {
                kind: 'question',
                text: "Is it a neighbor?",
                yes: { kind: 'guess', name: "a neighbor" },
                no: { kind: 'guess', name: "a stranger" },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"an adult\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a teenager?",
                yes: { kind: 'guess', name: "a teenager" },
                no: { kind: 'guess', name: "a twin" },
              },
              no: {
                kind: 'question',
                text: "Is it an adult?",
                yes: { kind: 'guess', name: "an adult" },
                no: { kind: 'guess', name: "an elderly person" },
              },
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
          text: "Mammal?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"a sea lion\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a manatee\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a beluga?",
                yes: { kind: 'guess', name: "a beluga" },
                no: { kind: 'guess', name: "a dolphin" },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a narwhal\" alphabetically?",
                yes: { kind: 'guess', name: "a manatee" },
                no: {
                  kind: 'question',
                  text: "Is it a narwhal?",
                  yes: { kind: 'guess', name: "a narwhal" },
                  no: { kind: 'guess', name: "a porpoise" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a whale\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a seal\" alphabetically?",
                yes: { kind: 'guess', name: "a sea lion" },
                no: {
                  kind: 'question',
                  text: "Is it a seal?",
                  yes: { kind: 'guess', name: "a seal" },
                  no: { kind: 'guess', name: "a walrus" },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"an orca\" alphabetically?",
                yes: { kind: 'guess', name: "a whale" },
                no: {
                  kind: 'question',
                  text: "Is it an orca?",
                  yes: { kind: 'guess', name: "an orca" },
                  no: { kind: 'guess', name: "an otter" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Hard shell?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a mussel\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a crayfish\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a clam?",
                  yes: { kind: 'guess', name: "a clam" },
                  no: { kind: 'guess', name: "a crab" },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a hermit crab\" alphabetically?",
                  yes: { kind: 'guess', name: "a crayfish" },
                  no: {
                    kind: 'question',
                    text: "Is it a hermit crab?",
                    yes: { kind: 'guess', name: "a hermit crab" },
                    no: { kind: 'guess', name: "a lobster" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a snail\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a mussel?",
                  yes: { kind: 'guess', name: "a mussel" },
                  no: { kind: 'guess', name: "a shrimp" },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a turtle\" alphabetically?",
                  yes: { kind: 'guess', name: "a snail" },
                  no: {
                    kind: 'question',
                    text: "Is it a turtle?",
                    yes: { kind: 'guess', name: "a turtle" },
                    no: { kind: 'guess', name: "an oyster" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a sea urchin\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a jellyfish\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a clownfish\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a bass\" alphabetically?",
                    yes: { kind: 'guess', name: "a barracuda" },
                    no: {
                      kind: 'question',
                      text: "Is it a bass?",
                      yes: { kind: 'guess', name: "a bass" },
                      no: { kind: 'guess', name: "a catfish" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a coral\" alphabetically?",
                    yes: { kind: 'guess', name: "a clownfish" },
                    no: {
                      kind: 'question',
                      text: "Is it a coral?",
                      yes: { kind: 'guess', name: "a coral" },
                      no: { kind: 'guess', name: "a goldfish" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a ray\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a plankton\" alphabetically?",
                    yes: { kind: 'guess', name: "a jellyfish" },
                    no: {
                      kind: 'question',
                      text: "Is it a plankton?",
                      yes: { kind: 'guess', name: "a plankton" },
                      no: { kind: 'guess', name: "a pufferfish" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a salmon\" alphabetically?",
                    yes: { kind: 'guess', name: "a ray" },
                    no: {
                      kind: 'question',
                      text: "Is it a salmon?",
                      yes: { kind: 'guess', name: "a salmon" },
                      no: { kind: 'guess', name: "a sea cucumber" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a swordfish\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a squid\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a seahorse\" alphabetically?",
                    yes: { kind: 'guess', name: "a sea urchin" },
                    no: {
                      kind: 'question',
                      text: "Is it a seahorse?",
                      yes: { kind: 'guess', name: "a seahorse" },
                      no: { kind: 'guess', name: "a shark" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a starfish\" alphabetically?",
                    yes: { kind: 'guess', name: "a squid" },
                    no: {
                      kind: 'question',
                      text: "Is it a starfish?",
                      yes: { kind: 'guess', name: "a starfish" },
                      no: { kind: 'guess', name: "a stingray" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"an angelfish\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a trout\" alphabetically?",
                    yes: { kind: 'guess', name: "a swordfish" },
                    no: {
                      kind: 'question',
                      text: "Is it a trout?",
                      yes: { kind: 'guess', name: "a trout" },
                      no: { kind: 'guess', name: "a tuna" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"an eel\" alphabetically?",
                    yes: { kind: 'guess', name: "an angelfish" },
                    no: {
                      kind: 'question',
                      text: "Is it an eel?",
                      yes: { kind: 'guess', name: "an eel" },
                      no: { kind: 'guess', name: "an octopus" },
                    },
                  },
                },
              },
            },
          },
        },
        no: {
          kind: 'question',
          text: "Can it fly?",
          yes: {
            kind: 'question',
            text: "Bird?",
            yes: {
              kind: 'question',
              text: "Bird of prey?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"an eagle\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a hawk\" alphabetically?",
                  yes: { kind: 'guess', name: "a falcon" },
                  no: {
                    kind: 'question',
                    text: "Is it a hawk?",
                    yes: { kind: 'guess', name: "a hawk" },
                    no: { kind: 'guess', name: "a vulture" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"an osprey\" alphabetically?",
                  yes: { kind: 'guess', name: "an eagle" },
                  no: {
                    kind: 'question',
                    text: "Is it an osprey?",
                    yes: { kind: 'guess', name: "an osprey" },
                    no: { kind: 'guess', name: "an owl" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Farm bird?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a hen\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a duck\" alphabetically?",
                    yes: { kind: 'guess', name: "a chicken" },
                    no: {
                      kind: 'question',
                      text: "Is it a duck?",
                      yes: { kind: 'guess', name: "a duck" },
                      no: { kind: 'guess', name: "a goose" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a rooster\" alphabetically?",
                    yes: { kind: 'guess', name: "a hen" },
                    no: {
                      kind: 'question',
                      text: "Is it a rooster?",
                      yes: { kind: 'guess', name: "a rooster" },
                      no: { kind: 'guess', name: "a turkey" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a peacock\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a crow\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a chickadee\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a canary\" alphabetically?",
                        yes: { kind: 'guess', name: "a blue jay" },
                        no: {
                          kind: 'question',
                          text: "Is it a canary?",
                          yes: { kind: 'guess', name: "a canary" },
                          no: { kind: 'guess', name: "a cardinal" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a cockatoo\" alphabetically?",
                        yes: { kind: 'guess', name: "a chickadee" },
                        no: {
                          kind: 'question',
                          text: "Is it a cockatoo?",
                          yes: { kind: 'guess', name: "a cockatoo" },
                          no: { kind: 'guess', name: "a crane" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a hummingbird\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a dove\" alphabetically?",
                        yes: { kind: 'guess', name: "a crow" },
                        no: {
                          kind: 'question',
                          text: "Is it a dove?",
                          yes: { kind: 'guess', name: "a dove" },
                          no: { kind: 'guess', name: "a flamingo" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a macaw\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it a hummingbird?",
                          yes: { kind: 'guess', name: "a hummingbird" },
                          no: { kind: 'guess', name: "a kiwi bird" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a macaw?",
                          yes: { kind: 'guess', name: "a macaw" },
                          no: { kind: 'guess', name: "a parrot" },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a sparrow\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a pigeon\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a pelican\" alphabetically?",
                        yes: { kind: 'guess', name: "a peacock" },
                        no: {
                          kind: 'question',
                          text: "Is it a pelican?",
                          yes: { kind: 'guess', name: "a pelican" },
                          no: { kind: 'guess', name: "a penguin" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a robin\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it a pigeon?",
                          yes: { kind: 'guess', name: "a pigeon" },
                          no: { kind: 'guess', name: "a raven" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a robin?",
                          yes: { kind: 'guess', name: "a robin" },
                          no: { kind: 'guess', name: "a seagull" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a toucan\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a stork\" alphabetically?",
                        yes: { kind: 'guess', name: "a sparrow" },
                        no: {
                          kind: 'question',
                          text: "Is it a stork?",
                          yes: { kind: 'guess', name: "a stork" },
                          no: { kind: 'guess', name: "a swan" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"an emu\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it a toucan?",
                          yes: { kind: 'guess', name: "a toucan" },
                          no: { kind: 'guess', name: "a woodpecker" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it an emu?",
                          yes: { kind: 'guess', name: "an emu" },
                          no: { kind: 'guess', name: "an ostrich" },
                        },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a firefly\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a butterfly\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a beetle\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a bat?",
                    yes: { kind: 'guess', name: "a bat" },
                    no: { kind: 'guess', name: "a bee" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a beetle?",
                    yes: { kind: 'guess', name: "a beetle" },
                    no: { kind: 'guess', name: "a bumblebee" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a cricket\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a butterfly?",
                    yes: { kind: 'guess', name: "a butterfly" },
                    no: { kind: 'guess', name: "a cicada" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a cricket?",
                    yes: { kind: 'guess', name: "a cricket" },
                    no: { kind: 'guess', name: "a dragonfly" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a ladybug\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a grasshopper\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a firefly?",
                    yes: { kind: 'guess', name: "a firefly" },
                    no: { kind: 'guess', name: "a fly" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a grasshopper?",
                    yes: { kind: 'guess', name: "a grasshopper" },
                    no: { kind: 'guess', name: "a hornet" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a moth\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a ladybug?",
                    yes: { kind: 'guess', name: "a ladybug" },
                    no: { kind: 'guess', name: "a mosquito" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a moth?",
                    yes: { kind: 'guess', name: "a moth" },
                    no: { kind: 'guess', name: "a wasp" },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Common pet?",
            yes: {
              kind: 'question',
              text: "Cat?",
              yes: { kind: 'guess', name: "a cat" },
              no: {
                kind: 'question',
                text: "Dog?",
                yes: { kind: 'guess', name: "a dog" },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a hamster\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a gerbil\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a chinchilla?",
                      yes: { kind: 'guess', name: "a chinchilla" },
                      no: { kind: 'guess', name: "a ferret" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a gerbil?",
                      yes: { kind: 'guess', name: "a gerbil" },
                      no: { kind: 'guess', name: "a guinea pig" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a mouse\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a hamster?",
                      yes: { kind: 'guess', name: "a hamster" },
                      no: { kind: 'guess', name: "a hedgehog" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a rabbit\" alphabetically?",
                      yes: { kind: 'guess', name: "a mouse" },
                      no: {
                        kind: 'question',
                        text: "Is it a rabbit?",
                        yes: { kind: 'guess', name: "a rabbit" },
                        no: { kind: 'guess', name: "a rat" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Farm animal?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a mule\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a goat\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a cow?",
                    yes: { kind: 'guess', name: "a cow" },
                    no: { kind: 'guess', name: "a donkey" },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a horse\" alphabetically?",
                    yes: { kind: 'guess', name: "a goat" },
                    no: {
                      kind: 'question',
                      text: "Is it a horse?",
                      yes: { kind: 'guess', name: "a horse" },
                      no: { kind: 'guess', name: "a llama" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a pony\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a mule?",
                    yes: { kind: 'guess', name: "a mule" },
                    no: { kind: 'guess', name: "a pig" },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a sheep\" alphabetically?",
                    yes: { kind: 'guess', name: "a pony" },
                    no: {
                      kind: 'question',
                      text: "Is it a sheep?",
                      yes: { kind: 'guess', name: "a sheep" },
                      no: { kind: 'guess', name: "an alpaca" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Big cat?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a lion\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a jaguar\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a cheetah?",
                      yes: { kind: 'guess', name: "a cheetah" },
                      no: { kind: 'guess', name: "a cougar" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a jaguar?",
                      yes: { kind: 'guess', name: "a jaguar" },
                      no: { kind: 'guess', name: "a leopard" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a panther\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a lion?",
                      yes: { kind: 'guess', name: "a lion" },
                      no: { kind: 'guess', name: "a lynx" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a panther?",
                      yes: { kind: 'guess', name: "a panther" },
                      no: { kind: 'guess', name: "a tiger" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a platypus\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a gazelle\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a chameleon\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a boar\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Does its name come before \"a bear\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Is it a baboon?",
                            yes: { kind: 'guess', name: "a baboon" },
                            no: { kind: 'guess', name: "a badger" },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a beaver\" alphabetically?",
                            yes: { kind: 'guess', name: "a bear" },
                            no: {
                              kind: 'question',
                              text: "Is it a beaver?",
                              yes: { kind: 'guess', name: "a beaver" },
                              no: { kind: 'guess', name: "a bison" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Does its name come before \"a buffalo\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Is it a boar?",
                            yes: { kind: 'guess', name: "a boar" },
                            no: { kind: 'guess', name: "a bobcat" },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a camel\" alphabetically?",
                            yes: { kind: 'guess', name: "a buffalo" },
                            no: {
                              kind: 'question',
                              text: "Is it a camel?",
                              yes: { kind: 'guess', name: "a camel" },
                              no: { kind: 'guess', name: "a centipede" },
                            },
                          },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a coyote\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Does its name come before \"a chipmunk\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Is it a chameleon?",
                            yes: { kind: 'guess', name: "a chameleon" },
                            no: { kind: 'guess', name: "a chimpanzee" },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a cobra\" alphabetically?",
                            yes: { kind: 'guess', name: "a chipmunk" },
                            no: {
                              kind: 'question',
                              text: "Is it a cobra?",
                              yes: { kind: 'guess', name: "a cobra" },
                              no: { kind: 'guess', name: "a cockroach" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Does its name come before \"a flea\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Does its name come before \"a crocodile\" alphabetically?",
                            yes: { kind: 'guess', name: "a coyote" },
                            no: {
                              kind: 'question',
                              text: "Is it a crocodile?",
                              yes: { kind: 'guess', name: "a crocodile" },
                              no: { kind: 'guess', name: "a deer" },
                            },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a fox\" alphabetically?",
                            yes: { kind: 'guess', name: "a flea" },
                            no: {
                              kind: 'question',
                              text: "Is it a fox?",
                              yes: { kind: 'guess', name: "a fox" },
                              no: { kind: 'guess', name: "a frog" },
                            },
                          },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a komodo dragon\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a grizzly bear\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Does its name come before \"a gibbon\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Is it a gazelle?",
                            yes: { kind: 'guess', name: "a gazelle" },
                            no: { kind: 'guess', name: "a gecko" },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a giraffe\" alphabetically?",
                            yes: { kind: 'guess', name: "a gibbon" },
                            no: {
                              kind: 'question',
                              text: "Is it a giraffe?",
                              yes: { kind: 'guess', name: "a giraffe" },
                              no: { kind: 'guess', name: "a gorilla" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Does its name come before \"a hyena\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Does its name come before \"a groundhog\" alphabetically?",
                            yes: { kind: 'guess', name: "a grizzly bear" },
                            no: {
                              kind: 'question',
                              text: "Is it a groundhog?",
                              yes: { kind: 'guess', name: "a groundhog" },
                              no: { kind: 'guess', name: "a hippo" },
                            },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a kangaroo\" alphabetically?",
                            yes: { kind: 'guess', name: "a hyena" },
                            no: {
                              kind: 'question',
                              text: "Is it a kangaroo?",
                              yes: { kind: 'guess', name: "a kangaroo" },
                              no: { kind: 'guess', name: "a koala" },
                            },
                          },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a millipede\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Does its name come before \"a lizard\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Is it a komodo dragon?",
                            yes: { kind: 'guess', name: "a komodo dragon" },
                            no: { kind: 'guess', name: "a lemur" },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a mandrill\" alphabetically?",
                            yes: { kind: 'guess', name: "a lizard" },
                            no: {
                              kind: 'question',
                              text: "Is it a mandrill?",
                              yes: { kind: 'guess', name: "a mandrill" },
                              no: { kind: 'guess', name: "a meerkat" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Does its name come before \"a moose\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Does its name come before \"a mole\" alphabetically?",
                            yes: { kind: 'guess', name: "a millipede" },
                            no: {
                              kind: 'question',
                              text: "Is it a mole?",
                              yes: { kind: 'guess', name: "a mole" },
                              no: { kind: 'guess', name: "a monkey" },
                            },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a newt\" alphabetically?",
                            yes: { kind: 'guess', name: "a moose" },
                            no: {
                              kind: 'question',
                              text: "Is it a newt?",
                              yes: { kind: 'guess', name: "a newt" },
                              no: { kind: 'guess', name: "a panda" },
                            },
                          },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a tick\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a shrew\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a raccoon\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Does its name come before \"a porcupine\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Is it a platypus?",
                            yes: { kind: 'guess', name: "a platypus" },
                            no: { kind: 'guess', name: "a polar bear" },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a prairie dog\" alphabetically?",
                            yes: { kind: 'guess', name: "a porcupine" },
                            no: {
                              kind: 'question',
                              text: "Is it a prairie dog?",
                              yes: { kind: 'guess', name: "a prairie dog" },
                              no: { kind: 'guess', name: "a python" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Does its name come before \"a rhino\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Does its name come before \"a rattlesnake\" alphabetically?",
                            yes: { kind: 'guess', name: "a raccoon" },
                            no: {
                              kind: 'question',
                              text: "Is it a rattlesnake?",
                              yes: { kind: 'guess', name: "a rattlesnake" },
                              no: { kind: 'guess', name: "a reindeer" },
                            },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a salamander\" alphabetically?",
                            yes: { kind: 'guess', name: "a rhino" },
                            no: {
                              kind: 'question',
                              text: "Is it a salamander?",
                              yes: { kind: 'guess', name: "a salamander" },
                              no: { kind: 'guess', name: "a scorpion" },
                            },
                          },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a spider\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Does its name come before \"a sloth\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Is it a shrew?",
                            yes: { kind: 'guess', name: "a shrew" },
                            no: { kind: 'guess', name: "a skunk" },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a slug\" alphabetically?",
                            yes: { kind: 'guess', name: "a sloth" },
                            no: {
                              kind: 'question',
                              text: "Is it a slug?",
                              yes: { kind: 'guess', name: "a slug" },
                              no: { kind: 'guess', name: "a snake" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Does its name come before \"a tarantula\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Does its name come before \"a squirrel\" alphabetically?",
                            yes: { kind: 'guess', name: "a spider" },
                            no: {
                              kind: 'question',
                              text: "Is it a squirrel?",
                              yes: { kind: 'guess', name: "a squirrel" },
                              no: { kind: 'guess', name: "a tapir" },
                            },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a tasmanian devil\" alphabetically?",
                            yes: { kind: 'guess', name: "a tarantula" },
                            no: {
                              kind: 'question',
                              text: "Is it a tasmanian devil?",
                              yes: { kind: 'guess', name: "a tasmanian devil" },
                              no: { kind: 'guess', name: "a termite" },
                            },
                          },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a zebra\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a wildcat\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Does its name come before \"a warthog\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Is it a tick?",
                            yes: { kind: 'guess', name: "a tick" },
                            no: { kind: 'guess', name: "a toad" },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a water buffalo\" alphabetically?",
                            yes: { kind: 'guess', name: "a warthog" },
                            no: {
                              kind: 'question',
                              text: "Is it a water buffalo?",
                              yes: { kind: 'guess', name: "a water buffalo" },
                              no: { kind: 'guess', name: "a weasel" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Does its name come before \"a wombat\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Does its name come before \"a wildebeest\" alphabetically?",
                            yes: { kind: 'guess', name: "a wildcat" },
                            no: {
                              kind: 'question',
                              text: "Is it a wildebeest?",
                              yes: { kind: 'guess', name: "a wildebeest" },
                              no: { kind: 'guess', name: "a wolf" },
                            },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"a worm\" alphabetically?",
                            yes: { kind: 'guess', name: "a wombat" },
                            no: {
                              kind: 'question',
                              text: "Is it a worm?",
                              yes: { kind: 'guess', name: "a worm" },
                              no: { kind: 'guess', name: "a yak" },
                            },
                          },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"an earthworm\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Does its name come before \"an ant\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Is it a zebra?",
                            yes: { kind: 'guess', name: "a zebra" },
                            no: { kind: 'guess', name: "an alligator" },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"an antelope\" alphabetically?",
                            yes: { kind: 'guess', name: "an ant" },
                            no: {
                              kind: 'question',
                              text: "Is it an antelope?",
                              yes: { kind: 'guess', name: "an antelope" },
                              no: { kind: 'guess', name: "an armadillo" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Does its name come before \"an iguana\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Does its name come before \"an elephant\" alphabetically?",
                            yes: { kind: 'guess', name: "an earthworm" },
                            no: {
                              kind: 'question',
                              text: "Is it an elephant?",
                              yes: { kind: 'guess', name: "an elephant" },
                              no: { kind: 'guess', name: "an elk" },
                            },
                          },
                          no: {
                            kind: 'question',
                            text: "Does its name come before \"an opossum\" alphabetically?",
                            yes: { kind: 'guess', name: "an iguana" },
                            no: {
                              kind: 'question',
                              text: "Is it an opossum?",
                              yes: { kind: 'guess', name: "an opossum" },
                              no: { kind: 'guess', name: "an orangutan" },
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
          text: "Tree?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"a maple tree\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a cherry tree\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a bonsai tree\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a baobab?",
                  yes: { kind: 'guess', name: "a baobab" },
                  no: { kind: 'guess', name: "a birch" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a bonsai tree?",
                  yes: { kind: 'guess', name: "a bonsai tree" },
                  no: { kind: 'guess', name: "a cedar" },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a dogwood\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a cherry tree?",
                  yes: { kind: 'guess', name: "a cherry tree" },
                  no: { kind: 'guess', name: "a Christmas tree" },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a fir\" alphabetically?",
                  yes: { kind: 'guess', name: "a dogwood" },
                  no: {
                    kind: 'question',
                    text: "Is it a fir?",
                    yes: { kind: 'guess', name: "a fir" },
                    no: { kind: 'guess', name: "a magnolia" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a sequoia\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a pine tree\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a maple tree?",
                  yes: { kind: 'guess', name: "a maple tree" },
                  no: { kind: 'guess', name: "a palm tree" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a pine tree?",
                  yes: { kind: 'guess', name: "a pine tree" },
                  no: { kind: 'guess', name: "a redwood" },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"an apple tree\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a sequoia?",
                  yes: { kind: 'guess', name: "a sequoia" },
                  no: { kind: 'guess', name: "a willow" },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"an elm\" alphabetically?",
                  yes: { kind: 'guess', name: "an apple tree" },
                  no: {
                    kind: 'question',
                    text: "Is it an elm?",
                    yes: { kind: 'guess', name: "an elm" },
                    no: { kind: 'guess', name: "an oak tree" },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Flower?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a marigold\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a dandelion\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a daffodil\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a carnation?",
                    yes: { kind: 'guess', name: "a carnation" },
                    no: { kind: 'guess', name: "a chrysanthemum" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a daffodil?",
                    yes: { kind: 'guess', name: "a daffodil" },
                    no: { kind: 'guess', name: "a daisy" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a jasmine\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a dandelion?",
                    yes: { kind: 'guess', name: "a dandelion" },
                    no: { kind: 'guess', name: "a hibiscus" },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a lavender\" alphabetically?",
                    yes: { kind: 'guess', name: "a jasmine" },
                    no: {
                      kind: 'question',
                      text: "Is it a lavender?",
                      yes: { kind: 'guess', name: "a lavender" },
                      no: { kind: 'guess', name: "a lily" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a sunflower\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a poppy\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a marigold?",
                    yes: { kind: 'guess', name: "a marigold" },
                    no: { kind: 'guess', name: "a peony" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a poppy?",
                    yes: { kind: 'guess', name: "a poppy" },
                    no: { kind: 'guess', name: "a rose" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a violet\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a sunflower?",
                    yes: { kind: 'guess', name: "a sunflower" },
                    no: { kind: 'guess', name: "a tulip" },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"an iris\" alphabetically?",
                    yes: { kind: 'guess', name: "a violet" },
                    no: {
                      kind: 'question',
                      text: "Is it an iris?",
                      yes: { kind: 'guess', name: "an iris" },
                      no: { kind: 'guess', name: "an orchid" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a succulent\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a hedge\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a cactus\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a bonsai\" alphabetically?",
                    yes: { kind: 'guess', name: "a bamboo" },
                    no: {
                      kind: 'question',
                      text: "Is it a bonsai?",
                      yes: { kind: 'guess', name: "a bonsai" },
                      no: { kind: 'guess', name: "a bush" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a fern\" alphabetically?",
                    yes: { kind: 'guess', name: "a cactus" },
                    no: {
                      kind: 'question',
                      text: "Is it a fern?",
                      yes: { kind: 'guess', name: "a fern" },
                      no: { kind: 'guess', name: "a grass" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a pitcher plant\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a moss\" alphabetically?",
                    yes: { kind: 'guess', name: "a hedge" },
                    no: {
                      kind: 'question',
                      text: "Is it a moss?",
                      yes: { kind: 'guess', name: "a moss" },
                      no: { kind: 'guess', name: "a mushroom" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a shrub\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a pitcher plant?",
                      yes: { kind: 'guess', name: "a pitcher plant" },
                      no: { kind: 'guess', name: "a pumpkin plant" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a shrub?",
                      yes: { kind: 'guess', name: "a shrub" },
                      no: { kind: 'guess', name: "a strawberry plant" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"corn plant\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a vine\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a tomato plant\" alphabetically?",
                    yes: { kind: 'guess', name: "a succulent" },
                    no: {
                      kind: 'question',
                      text: "Is it a tomato plant?",
                      yes: { kind: 'guess', name: "a tomato plant" },
                      no: { kind: 'guess', name: "a Venus flytrap" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"basil\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a vine?",
                      yes: { kind: 'guess', name: "a vine" },
                      no: { kind: 'guess', name: "algae" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it basil?",
                      yes: { kind: 'guess', name: "basil" },
                      no: { kind: 'guess', name: "clover" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"mint\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"ivy\" alphabetically?",
                    yes: { kind: 'guess', name: "corn plant" },
                    no: {
                      kind: 'question',
                      text: "Is it ivy?",
                      yes: { kind: 'guess', name: "ivy" },
                      no: { kind: 'guess', name: "kelp" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"seaweed\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it mint?",
                      yes: { kind: 'guess', name: "mint" },
                      no: { kind: 'guess', name: "rosemary" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it seaweed?",
                      yes: { kind: 'guess', name: "seaweed" },
                      no: { kind: 'guess', name: "wheat" },
                    },
                  },
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
    text: "Electronic?",
    yes: {
      kind: 'question',
      text: "Phone / smartphone?",
      yes: { kind: 'guess', name: "a smartphone" },
      no: {
        kind: 'question',
        text: "Tablet?",
        yes: { kind: 'guess', name: "a tablet" },
        no: {
          kind: 'question',
          text: "Is it a computer (laptop, desktop, or PC)?",
          yes: {
            kind: 'question',
            text: "Laptop?",
            yes: { kind: 'guess', name: "a laptop" },
            no: {
              kind: 'question',
              text: "Desktop / PC?",
              yes: { kind: 'guess', name: "a computer" },
              no: { kind: 'guess', name: "a computer" },
            },
          },
          no: {
            kind: 'question',
            text: "Headphones or earbuds?",
            yes: {
              kind: 'question',
              text: "Headphones (over-ear)?",
              yes: { kind: 'guess', name: "headphones" },
              no: { kind: 'guess', name: "earbuds" },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a PlayStation\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a gaming console\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a computer mouse\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a camera\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a battery?",
                      yes: { kind: 'guess', name: "a battery" },
                      no: { kind: 'guess', name: "a Bluetooth speaker" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a camera?",
                      yes: { kind: 'guess', name: "a camera" },
                      no: { kind: 'guess', name: "a charger" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a fitness tracker\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a computer mouse?",
                      yes: { kind: 'guess', name: "a computer mouse" },
                      no: { kind: 'guess', name: "a drone controller" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a fitness tracker?",
                      yes: { kind: 'guess', name: "a fitness tracker" },
                      no: { kind: 'guess', name: "a game controller" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a Kindle\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a hard drive\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a gaming console?",
                      yes: { kind: 'guess', name: "a gaming console" },
                      no: { kind: 'guess', name: "a Google Nest" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a hard drive?",
                      yes: { kind: 'guess', name: "a hard drive" },
                      no: { kind: 'guess', name: "a keyboard" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a monitor\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a Kindle?",
                      yes: { kind: 'guess', name: "a Kindle" },
                      no: { kind: 'guess', name: "a microphone" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a monitor?",
                      yes: { kind: 'guess', name: "a monitor" },
                      no: { kind: 'guess', name: "a Nintendo Switch" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a TV\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a router\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a printer\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a PlayStation?",
                      yes: { kind: 'guess', name: "a PlayStation" },
                      no: { kind: 'guess', name: "a power bank" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a printer?",
                      yes: { kind: 'guess', name: "a printer" },
                      no: { kind: 'guess', name: "a remote control" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a smartwatch\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a router?",
                      yes: { kind: 'guess', name: "a router" },
                      no: { kind: 'guess', name: "a smart home hub" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a smartwatch?",
                      yes: { kind: 'guess', name: "a smartwatch" },
                      no: { kind: 'guess', name: "a speaker" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"AirPods\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a VR headset\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a TV?",
                      yes: { kind: 'guess', name: "a TV" },
                      no: { kind: 'guess', name: "a USB drive" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a VR headset?",
                      yes: { kind: 'guess', name: "a VR headset" },
                      no: { kind: 'guess', name: "a webcam" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"an e-reader\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it AirPods?",
                      yes: { kind: 'guess', name: "AirPods" },
                      no: { kind: 'guess', name: "an Amazon Echo" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it an e-reader?",
                      yes: { kind: 'guess', name: "an e-reader" },
                      no: { kind: 'guess', name: "an Xbox" },
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
      text: "Is it bigger than a breadbox?",
      yes: {
        kind: 'question',
        text: "Vehicle?",
        yes: {
          kind: 'question',
          text: "Does it fly?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"a jet\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a glider\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a drone\" alphabetically?",
                yes: { kind: 'guess', name: "a blimp" },
                no: {
                  kind: 'question',
                  text: "Is it a drone?",
                  yes: { kind: 'guess', name: "a drone" },
                  no: { kind: 'guess', name: "a fighter jet" },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a helicopter\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a glider?",
                  yes: { kind: 'guess', name: "a glider" },
                  no: { kind: 'guess', name: "a hang glider" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a helicopter?",
                  yes: { kind: 'guess', name: "a helicopter" },
                  no: { kind: 'guess', name: "a hot air balloon" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a seaplane\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a parachute\" alphabetically?",
                yes: { kind: 'guess', name: "a jet" },
                no: {
                  kind: 'question',
                  text: "Is it a parachute?",
                  yes: { kind: 'guess', name: "a parachute" },
                  no: { kind: 'guess', name: "a rocket" },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a spaceship\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a seaplane?",
                  yes: { kind: 'guess', name: "a seaplane" },
                  no: { kind: 'guess', name: "a space shuttle" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a spaceship?",
                  yes: { kind: 'guess', name: "a spaceship" },
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
              text: "Does its name come before \"a raft\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a ferry\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a canoe\" alphabetically?",
                  yes: { kind: 'guess', name: "a battleship" },
                  no: {
                    kind: 'question',
                    text: "Is it a canoe?",
                    yes: { kind: 'guess', name: "a canoe" },
                    no: { kind: 'guess', name: "a cruise ship" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a kayak\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a ferry?",
                    yes: { kind: 'guess', name: "a ferry" },
                    no: { kind: 'guess', name: "a jet ski" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a kayak?",
                    yes: { kind: 'guess', name: "a kayak" },
                    no: { kind: 'guess', name: "a paddleboard" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a submarine\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a sailboat\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a raft?",
                    yes: { kind: 'guess', name: "a raft" },
                    no: { kind: 'guess', name: "a rowboat" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a sailboat?",
                    yes: { kind: 'guess', name: "a sailboat" },
                    no: { kind: 'guess', name: "a speedboat" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a yacht\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a submarine?",
                    yes: { kind: 'guess', name: "a submarine" },
                    no: { kind: 'guess', name: "a tugboat" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a yacht?",
                    yes: { kind: 'guess', name: "a yacht" },
                    no: { kind: 'guess', name: "an aircraft carrier" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a rickshaw\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a forklift\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a cement mixer\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a bus\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a bicycle?",
                      yes: { kind: 'guess', name: "a bicycle" },
                      no: { kind: 'guess', name: "a bulldozer" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a bus?",
                      yes: { kind: 'guess', name: "a bus" },
                      no: { kind: 'guess', name: "a car" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a double-decker bus\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a cement mixer?",
                      yes: { kind: 'guess', name: "a cement mixer" },
                      no: { kind: 'guess', name: "a convertible" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a dump truck\" alphabetically?",
                      yes: { kind: 'guess', name: "a double-decker bus" },
                      no: {
                        kind: 'question',
                        text: "Is it a dump truck?",
                        yes: { kind: 'guess', name: "a dump truck" },
                        no: { kind: 'guess', name: "a fire truck" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a limousine\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a golf cart\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a forklift?",
                      yes: { kind: 'guess', name: "a forklift" },
                      no: { kind: 'guess', name: "a Formula 1 car" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a golf cart?",
                      yes: { kind: 'guess', name: "a golf cart" },
                      no: { kind: 'guess', name: "a horse carriage" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a pickup truck\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a limousine?",
                      yes: { kind: 'guess', name: "a limousine" },
                      no: { kind: 'guess', name: "a motorcycle" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a police car\" alphabetically?",
                      yes: { kind: 'guess', name: "a pickup truck" },
                      no: {
                        kind: 'question',
                        text: "Is it a police car?",
                        yes: { kind: 'guess', name: "a police car" },
                        no: { kind: 'guess', name: "a race car" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a tractor\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a skateboard\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a scooter\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a rickshaw?",
                      yes: { kind: 'guess', name: "a rickshaw" },
                      no: { kind: 'guess', name: "a school bus" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a scooter?",
                      yes: { kind: 'guess', name: "a scooter" },
                      no: { kind: 'guess', name: "a Segway" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a subway\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a skateboard?",
                      yes: { kind: 'guess', name: "a skateboard" },
                      no: { kind: 'guess', name: "a snowmobile" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a tank\" alphabetically?",
                      yes: { kind: 'guess', name: "a subway" },
                      no: {
                        kind: 'question',
                        text: "Is it a tank?",
                        yes: { kind: 'guess', name: "a tank" },
                        no: { kind: 'guess', name: "a taxi" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a unicycle\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a tram\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a tractor?",
                      yes: { kind: 'guess', name: "a tractor" },
                      no: { kind: 'guess', name: "a train" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a tram?",
                      yes: { kind: 'guess', name: "a tram" },
                      no: { kind: 'guess', name: "a truck" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"an ambulance\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a unicycle?",
                      yes: { kind: 'guess', name: "a unicycle" },
                      no: { kind: 'guess', name: "a van" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"an ATV\" alphabetically?",
                      yes: { kind: 'guess', name: "an ambulance" },
                      no: {
                        kind: 'question',
                        text: "Is it an ATV?",
                        yes: { kind: 'guess', name: "an ATV" },
                        no: { kind: 'guess', name: "an SUV" },
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
          text: "Building, landmark, or place?",
          yes: {
            kind: 'question',
            text: "Famous landmark?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Stonehenge\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Hollywood Sign\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Burj Khalifa\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Big Ben\" alphabetically?",
                    yes: { kind: 'guess', name: "Angkor Wat" },
                    no: {
                      kind: 'question',
                      text: "Is it Big Ben?",
                      yes: { kind: 'guess', name: "Big Ben" },
                      no: { kind: 'guess', name: "Buckingham Palace" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Christ the Redeemer\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Burj Khalifa?",
                      yes: { kind: 'guess', name: "Burj Khalifa" },
                      no: { kind: 'guess', name: "Chichen Itza" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Christ the Redeemer?",
                      yes: { kind: 'guess', name: "Christ the Redeemer" },
                      no: { kind: 'guess', name: "CN Tower" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Mount Rushmore\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Machu Picchu\" alphabetically?",
                    yes: { kind: 'guess', name: "Hollywood Sign" },
                    no: {
                      kind: 'question',
                      text: "Is it Machu Picchu?",
                      yes: { kind: 'guess', name: "Machu Picchu" },
                      no: { kind: 'guess', name: "Mount Everest" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Petra\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Mount Rushmore?",
                      yes: { kind: 'guess', name: "Mount Rushmore" },
                      no: { kind: 'guess', name: "Niagara Falls" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Petra?",
                      yes: { kind: 'guess', name: "Petra" },
                      no: { kind: 'guess', name: "Space Needle" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"the Grand Canyon\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"the Colosseum\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Sydney Opera House\" alphabetically?",
                    yes: { kind: 'guess', name: "Stonehenge" },
                    no: {
                      kind: 'question',
                      text: "Is it Sydney Opera House?",
                      yes: { kind: 'guess', name: "Sydney Opera House" },
                      no: { kind: 'guess', name: "Taj Mahal" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"the Empire State Building\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it the Colosseum?",
                      yes: { kind: 'guess', name: "the Colosseum" },
                      no: { kind: 'guess', name: "the Eiffel Tower" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it the Empire State Building?",
                      yes: { kind: 'guess', name: "the Empire State Building" },
                      no: { kind: 'guess', name: "the Golden Gate Bridge" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"the Pyramids of Giza\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"the Louvre\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it the Grand Canyon?",
                      yes: { kind: 'guess', name: "the Grand Canyon" },
                      no: { kind: 'guess', name: "the Great Wall of China" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it the Louvre?",
                      yes: { kind: 'guess', name: "the Louvre" },
                      no: { kind: 'guess', name: "the Pentagon" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"the White House\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it the Pyramids of Giza?",
                      yes: { kind: 'guess', name: "the Pyramids of Giza" },
                      no: { kind: 'guess', name: "the Statue of Liberty" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it the White House?",
                      yes: { kind: 'guess', name: "the White House" },
                      no: { kind: 'guess', name: "Times Square" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Home / dwelling?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a mobile home\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a condo\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a cabin\" alphabetically?",
                    yes: { kind: 'guess', name: "a bungalow" },
                    no: {
                      kind: 'question',
                      text: "Is it a cabin?",
                      yes: { kind: 'guess', name: "a cabin" },
                      no: { kind: 'guess', name: "a castle" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a house\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a condo?",
                      yes: { kind: 'guess', name: "a condo" },
                      no: { kind: 'guess', name: "a dorm room" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a house?",
                      yes: { kind: 'guess', name: "a house" },
                      no: { kind: 'guess', name: "a mansion" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a treehouse\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a penthouse\" alphabetically?",
                    yes: { kind: 'guess', name: "a mobile home" },
                    no: {
                      kind: 'question',
                      text: "Is it a penthouse?",
                      yes: { kind: 'guess', name: "a penthouse" },
                      no: { kind: 'guess', name: "a tent" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"an apartment\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a treehouse?",
                      yes: { kind: 'guess', name: "a treehouse" },
                      no: { kind: 'guess', name: "a yurt" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it an apartment?",
                      yes: { kind: 'guess', name: "an apartment" },
                      no: { kind: 'guess', name: "an igloo" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a mountain\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a factory\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a cemetery\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a bridge\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a bank?",
                        yes: { kind: 'guess', name: "a bank" },
                        no: { kind: 'guess', name: "a beach" },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a canyon\" alphabetically?",
                        yes: { kind: 'guess', name: "a bridge" },
                        no: {
                          kind: 'question',
                          text: "Is it a canyon?",
                          yes: { kind: 'guess', name: "a canyon" },
                          no: { kind: 'guess', name: "a cave" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a cinema\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a cemetery?",
                        yes: { kind: 'guess', name: "a cemetery" },
                        no: { kind: 'guess', name: "a church" },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a city\" alphabetically?",
                        yes: { kind: 'guess', name: "a cinema" },
                        no: {
                          kind: 'question',
                          text: "Is it a city?",
                          yes: { kind: 'guess', name: "a city" },
                          no: { kind: 'guess', name: "a desert" },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a hospital\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a forest\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a factory?",
                        yes: { kind: 'guess', name: "a factory" },
                        no: { kind: 'guess', name: "a farm" },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a gym\" alphabetically?",
                        yes: { kind: 'guess', name: "a forest" },
                        no: {
                          kind: 'question',
                          text: "Is it a gym?",
                          yes: { kind: 'guess', name: "a gym" },
                          no: { kind: 'guess', name: "a highway" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a library\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a hotel\" alphabetically?",
                        yes: { kind: 'guess', name: "a hospital" },
                        no: {
                          kind: 'question',
                          text: "Is it a hotel?",
                          yes: { kind: 'guess', name: "a hotel" },
                          no: { kind: 'guess', name: "a lake" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a mall\" alphabetically?",
                        yes: { kind: 'guess', name: "a library" },
                        no: {
                          kind: 'question',
                          text: "Is it a mall?",
                          yes: { kind: 'guess', name: "a mall" },
                          no: { kind: 'guess', name: "a meadow" },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a swamp\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a prison\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a park\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a mountain?",
                        yes: { kind: 'guess', name: "a mountain" },
                        no: { kind: 'guess', name: "a museum" },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a parking lot\" alphabetically?",
                        yes: { kind: 'guess', name: "a park" },
                        no: {
                          kind: 'question',
                          text: "Is it a parking lot?",
                          yes: { kind: 'guess', name: "a parking lot" },
                          no: { kind: 'guess', name: "a playground" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a school\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a restaurant\" alphabetically?",
                        yes: { kind: 'guess', name: "a prison" },
                        no: {
                          kind: 'question',
                          text: "Is it a restaurant?",
                          yes: { kind: 'guess', name: "a restaurant" },
                          no: { kind: 'guess', name: "a river" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a stadium\" alphabetically?",
                        yes: { kind: 'guess', name: "a school" },
                        no: {
                          kind: 'question',
                          text: "Is it a stadium?",
                          yes: { kind: 'guess', name: "a stadium" },
                          no: { kind: 'guess', name: "a supermarket" },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a warehouse\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a tunnel\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a swamp?",
                        yes: { kind: 'guess', name: "a swamp" },
                        no: { kind: 'guess', name: "a theater" },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a valley\" alphabetically?",
                        yes: { kind: 'guess', name: "a tunnel" },
                        no: {
                          kind: 'question',
                          text: "Is it a valley?",
                          yes: { kind: 'guess', name: "a valley" },
                          no: { kind: 'guess', name: "a volcano" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"an airport\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a waterfall\" alphabetically?",
                        yes: { kind: 'guess', name: "a warehouse" },
                        no: {
                          kind: 'question',
                          text: "Is it a waterfall?",
                          yes: { kind: 'guess', name: "a waterfall" },
                          no: { kind: 'guess', name: "a zoo" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"an island\" alphabetically?",
                        yes: { kind: 'guess', name: "an airport" },
                        no: {
                          kind: 'question',
                          text: "Is it an island?",
                          yes: { kind: 'guess', name: "an island" },
                          no: { kind: 'guess', name: "an ocean" },
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
            text: "Furniture?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a mattress\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a couch\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a cabinet\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a blanket\" alphabetically?",
                    yes: { kind: 'guess', name: "a bed" },
                    no: {
                      kind: 'question',
                      text: "Is it a blanket?",
                      yes: { kind: 'guess', name: "a blanket" },
                      no: { kind: 'guess', name: "a bookshelf" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a chair\" alphabetically?",
                    yes: { kind: 'guess', name: "a cabinet" },
                    no: {
                      kind: 'question',
                      text: "Is it a chair?",
                      yes: { kind: 'guess', name: "a chair" },
                      no: { kind: 'guess', name: "a coffee table" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a dining table\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a curtain\" alphabetically?",
                    yes: { kind: 'guess', name: "a couch" },
                    no: {
                      kind: 'question',
                      text: "Is it a curtain?",
                      yes: { kind: 'guess', name: "a curtain" },
                      no: { kind: 'guess', name: "a desk" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a dresser\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a dining table?",
                      yes: { kind: 'guess', name: "a dining table" },
                      no: { kind: 'guess', name: "a drawer" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a dresser?",
                      yes: { kind: 'guess', name: "a dresser" },
                      no: { kind: 'guess', name: "a lamp" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a rug\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a pillow\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a mirror\" alphabetically?",
                    yes: { kind: 'guess', name: "a mattress" },
                    no: {
                      kind: 'question',
                      text: "Is it a mirror?",
                      yes: { kind: 'guess', name: "a mirror" },
                      no: { kind: 'guess', name: "a nightstand" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a recliner\" alphabetically?",
                    yes: { kind: 'guess', name: "a pillow" },
                    no: {
                      kind: 'question',
                      text: "Is it a recliner?",
                      yes: { kind: 'guess', name: "a recliner" },
                      no: { kind: 'guess', name: "a rocking chair" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a stool\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a shelf\" alphabetically?",
                    yes: { kind: 'guess', name: "a rug" },
                    no: {
                      kind: 'question',
                      text: "Is it a shelf?",
                      yes: { kind: 'guess', name: "a shelf" },
                      no: { kind: 'guess', name: "a sofa" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a wardrobe\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a stool?",
                      yes: { kind: 'guess', name: "a stool" },
                      no: { kind: 'guess', name: "a table" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a wardrobe?",
                      yes: { kind: 'guess', name: "a wardrobe" },
                      no: { kind: 'guess', name: "curtains" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Large appliance?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a stove\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a furnace\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a dryer\" alphabetically?",
                    yes: { kind: 'guess', name: "a dishwasher" },
                    no: {
                      kind: 'question',
                      text: "Is it a dryer?",
                      yes: { kind: 'guess', name: "a dryer" },
                      no: { kind: 'guess', name: "a freezer" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a microwave\" alphabetically?",
                    yes: { kind: 'guess', name: "a furnace" },
                    no: {
                      kind: 'question',
                      text: "Is it a microwave?",
                      yes: { kind: 'guess', name: "a microwave" },
                      no: { kind: 'guess', name: "a refrigerator" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a water heater\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a vacuum cleaner\" alphabetically?",
                    yes: { kind: 'guess', name: "a stove" },
                    no: {
                      kind: 'question',
                      text: "Is it a vacuum cleaner?",
                      yes: { kind: 'guess', name: "a vacuum cleaner" },
                      no: { kind: 'guess', name: "a washing machine" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"an air conditioner\" alphabetically?",
                    yes: { kind: 'guess', name: "a water heater" },
                    no: {
                      kind: 'question',
                      text: "Is it an air conditioner?",
                      yes: { kind: 'guess', name: "an air conditioner" },
                      no: { kind: 'guess', name: "an oven" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a statue\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a generator\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a fire hydrant\" alphabetically?",
                    yes: { kind: 'guess', name: "a billboard" },
                    no: {
                      kind: 'question',
                      text: "Is it a fire hydrant?",
                      yes: { kind: 'guess', name: "a fire hydrant" },
                      no: { kind: 'guess', name: "a fountain" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a satellite dish\" alphabetically?",
                    yes: { kind: 'guess', name: "a generator" },
                    no: {
                      kind: 'question',
                      text: "Is it a satellite dish?",
                      yes: { kind: 'guess', name: "a satellite dish" },
                      no: { kind: 'guess', name: "a solar panel" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a vending machine\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a streetlight\" alphabetically?",
                    yes: { kind: 'guess', name: "a statue" },
                    no: {
                      kind: 'question',
                      text: "Is it a streetlight?",
                      yes: { kind: 'guess', name: "a streetlight" },
                      no: { kind: 'guess', name: "a traffic light" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a wind turbine\" alphabetically?",
                    yes: { kind: 'guess', name: "a vending machine" },
                    no: {
                      kind: 'question',
                      text: "Is it a wind turbine?",
                      yes: { kind: 'guess', name: "a wind turbine" },
                      no: { kind: 'guess', name: "an ATM" },
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
        text: "Food or drink?",
        yes: {
          kind: 'question',
          text: "Drink?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"milk\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"energy drink\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"champagne\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"beer\" alphabetically?",
                  yes: { kind: 'guess', name: "apple juice" },
                  no: {
                    kind: 'question',
                    text: "Is it beer?",
                    yes: { kind: 'guess', name: "beer" },
                    no: { kind: 'guess', name: "cappuccino" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"coconut water\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it champagne?",
                    yes: { kind: 'guess', name: "champagne" },
                    no: { kind: 'guess', name: "Coca-Cola" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it coconut water?",
                    yes: { kind: 'guess', name: "coconut water" },
                    no: { kind: 'guess', name: "coffee" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"kombucha\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"hot chocolate\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it energy drink?",
                    yes: { kind: 'guess', name: "energy drink" },
                    no: { kind: 'guess', name: "espresso" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it hot chocolate?",
                    yes: { kind: 'guess', name: "hot chocolate" },
                    no: { kind: 'guess', name: "iced tea" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"lemonade\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it kombucha?",
                    yes: { kind: 'guess', name: "kombucha" },
                    no: { kind: 'guess', name: "latte" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it lemonade?",
                    yes: { kind: 'guess', name: "lemonade" },
                    no: { kind: 'guess', name: "matcha" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"soda\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"orange juice\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"milkshake\" alphabetically?",
                  yes: { kind: 'guess', name: "milk" },
                  no: {
                    kind: 'question',
                    text: "Is it milkshake?",
                    yes: { kind: 'guess', name: "milkshake" },
                    no: { kind: 'guess', name: "mocha" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"root beer\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it orange juice?",
                    yes: { kind: 'guess', name: "orange juice" },
                    no: { kind: 'guess', name: "Pepsi" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it root beer?",
                    yes: { kind: 'guess', name: "root beer" },
                    no: { kind: 'guess', name: "smoothie" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"vodka\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Sprite\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it soda?",
                    yes: { kind: 'guess', name: "soda" },
                    no: { kind: 'guess', name: "sports drink" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Sprite?",
                    yes: { kind: 'guess', name: "Sprite" },
                    no: { kind: 'guess', name: "tea" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"whiskey\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it vodka?",
                    yes: { kind: 'guess', name: "vodka" },
                    no: { kind: 'guess', name: "water" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it whiskey?",
                    yes: { kind: 'guess', name: "whiskey" },
                    no: { kind: 'guess', name: "wine" },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Fruit or vegetable?",
            yes: {
              kind: 'question',
              text: "Fruit?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a mango\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a fig\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a cantaloupe\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a blackberry\" alphabetically?",
                      yes: { kind: 'guess', name: "a banana" },
                      no: {
                        kind: 'question',
                        text: "Is it a blackberry?",
                        yes: { kind: 'guess', name: "a blackberry" },
                        no: { kind: 'guess', name: "a blueberry" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a coconut\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a cantaloupe?",
                        yes: { kind: 'guess', name: "a cantaloupe" },
                        no: { kind: 'guess', name: "a cherry" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a coconut?",
                        yes: { kind: 'guess', name: "a coconut" },
                        no: { kind: 'guess', name: "a date" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a honeydew\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a grape\" alphabetically?",
                      yes: { kind: 'guess', name: "a fig" },
                      no: {
                        kind: 'question',
                        text: "Is it a grape?",
                        yes: { kind: 'guess', name: "a grape" },
                        no: { kind: 'guess', name: "a grapefruit" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a lemon\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a honeydew?",
                        yes: { kind: 'guess', name: "a honeydew" },
                        no: { kind: 'guess', name: "a kiwi" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a lemon?",
                        yes: { kind: 'guess', name: "a lemon" },
                        no: { kind: 'guess', name: "a lime" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a raspberry\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a pear\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a papaya\" alphabetically?",
                      yes: { kind: 'guess', name: "a mango" },
                      no: {
                        kind: 'question',
                        text: "Is it a papaya?",
                        yes: { kind: 'guess', name: "a papaya" },
                        no: { kind: 'guess', name: "a peach" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a plum\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a pear?",
                        yes: { kind: 'guess', name: "a pear" },
                        no: { kind: 'guess', name: "a pineapple" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a plum?",
                        yes: { kind: 'guess', name: "a plum" },
                        no: { kind: 'guess', name: "a pomegranate" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"an apple\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a tomato\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a raspberry?",
                        yes: { kind: 'guess', name: "a raspberry" },
                        no: { kind: 'guess', name: "a strawberry" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a tomato?",
                        yes: { kind: 'guess', name: "a tomato" },
                        no: { kind: 'guess', name: "a watermelon" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"an avocado\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it an apple?",
                        yes: { kind: 'guess', name: "an apple" },
                        no: { kind: 'guess', name: "an apricot" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it an avocado?",
                        yes: { kind: 'guess', name: "an avocado" },
                        no: { kind: 'guess', name: "an orange" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"cauliflower\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a radish\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a cucumber\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a bell pepper\" alphabetically?",
                      yes: { kind: 'guess', name: "a beet" },
                      no: {
                        kind: 'question',
                        text: "Is it a bell pepper?",
                        yes: { kind: 'guess', name: "a bell pepper" },
                        no: { kind: 'guess', name: "a carrot" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a pepper\" alphabetically?",
                      yes: { kind: 'guess', name: "a cucumber" },
                      no: {
                        kind: 'question',
                        text: "Is it a pepper?",
                        yes: { kind: 'guess', name: "a pepper" },
                        no: { kind: 'guess', name: "a potato" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"an onion\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a sweet potato\" alphabetically?",
                      yes: { kind: 'guess', name: "a radish" },
                      no: {
                        kind: 'question',
                        text: "Is it a sweet potato?",
                        yes: { kind: 'guess', name: "a sweet potato" },
                        no: { kind: 'guess', name: "a turnip" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"broccoli\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it an onion?",
                        yes: { kind: 'guess', name: "an onion" },
                        no: { kind: 'guess', name: "asparagus" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it broccoli?",
                        yes: { kind: 'guess', name: "broccoli" },
                        no: { kind: 'guess', name: "cabbage" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"kale\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"eggplant\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"celery\" alphabetically?",
                      yes: { kind: 'guess', name: "cauliflower" },
                      no: {
                        kind: 'question',
                        text: "Is it celery?",
                        yes: { kind: 'guess', name: "celery" },
                        no: { kind: 'guess', name: "corn" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"ginger\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it eggplant?",
                        yes: { kind: 'guess', name: "eggplant" },
                        no: { kind: 'guess', name: "garlic" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it ginger?",
                        yes: { kind: 'guess', name: "ginger" },
                        no: { kind: 'guess', name: "green beans" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"peas\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"lettuce\" alphabetically?",
                      yes: { kind: 'guess', name: "kale" },
                      no: {
                        kind: 'question',
                        text: "Is it lettuce?",
                        yes: { kind: 'guess', name: "lettuce" },
                        no: { kind: 'guess', name: "mushrooms" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"squash\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it peas?",
                        yes: { kind: 'guess', name: "peas" },
                        no: { kind: 'guess', name: "spinach" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it squash?",
                        yes: { kind: 'guess', name: "squash" },
                        no: { kind: 'guess', name: "zucchini" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Pizza, burger, taco, or similar takeout?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a wrap\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a quesadilla\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a hot dog\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a burrito?",
                      yes: { kind: 'guess', name: "a burrito" },
                      no: { kind: 'guess', name: "a hamburger" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a hot dog?",
                      yes: { kind: 'guess', name: "a hot dog" },
                      no: { kind: 'guess', name: "a pizza" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a smoothie bowl\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a quesadilla?",
                      yes: { kind: 'guess', name: "a quesadilla" },
                      no: { kind: 'guess', name: "a sandwich" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a smoothie bowl?",
                      yes: { kind: 'guess', name: "a smoothie bowl" },
                      no: { kind: 'guess', name: "a taco" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"nachos\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"french fries\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a wrap?",
                      yes: { kind: 'guess', name: "a wrap" },
                      no: { kind: 'guess', name: "chicken nuggets" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it french fries?",
                      yes: { kind: 'guess', name: "french fries" },
                      no: { kind: 'guess', name: "fried chicken" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"pho\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it nachos?",
                      yes: { kind: 'guess', name: "nachos" },
                      no: { kind: 'guess', name: "onion rings" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"poke bowl\" alphabetically?",
                      yes: { kind: 'guess', name: "pho" },
                      no: {
                        kind: 'question',
                        text: "Is it poke bowl?",
                        yes: { kind: 'guess', name: "poke bowl" },
                        no: { kind: 'guess', name: "ramen" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"granola\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a muffin\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a casserole\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a brownie\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a baguette\" alphabetically?",
                        yes: { kind: 'guess', name: "a bagel" },
                        no: {
                          kind: 'question',
                          text: "Is it a baguette?",
                          yes: { kind: 'guess', name: "a baguette" },
                          no: { kind: 'guess', name: "a biscuit" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a burrito bowl\" alphabetically?",
                        yes: { kind: 'guess', name: "a brownie" },
                        no: {
                          kind: 'question',
                          text: "Is it a burrito bowl?",
                          yes: { kind: 'guess', name: "a burrito bowl" },
                          no: { kind: 'guess', name: "a cake" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a croissant\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a cookie\" alphabetically?",
                        yes: { kind: 'guess', name: "a casserole" },
                        no: {
                          kind: 'question',
                          text: "Is it a cookie?",
                          yes: { kind: 'guess', name: "a cookie" },
                          no: { kind: 'guess', name: "a cracker" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a donut\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it a croissant?",
                          yes: { kind: 'guess', name: "a croissant" },
                          no: { kind: 'guess', name: "a cupcake" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a donut?",
                          yes: { kind: 'guess', name: "a donut" },
                          no: { kind: 'guess', name: "a meatloaf" },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"bread\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a salad\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a pancake\" alphabetically?",
                        yes: { kind: 'guess', name: "a muffin" },
                        no: {
                          kind: 'question',
                          text: "Is it a pancake?",
                          yes: { kind: 'guess', name: "a pancake" },
                          no: { kind: 'guess', name: "a pretzel" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"an egg\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it a salad?",
                          yes: { kind: 'guess', name: "a salad" },
                          no: { kind: 'guess', name: "a waffle" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it an egg?",
                          yes: { kind: 'guess', name: "an egg" },
                          no: { kind: 'guess', name: "bacon" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"cereal\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"butter\" alphabetically?",
                        yes: { kind: 'guess', name: "bread" },
                        no: {
                          kind: 'question',
                          text: "Is it butter?",
                          yes: { kind: 'guess', name: "butter" },
                          no: { kind: 'guess', name: "candy" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"chicken\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it cereal?",
                          yes: { kind: 'guess', name: "cereal" },
                          no: { kind: 'guess', name: "cheese" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it chicken?",
                          yes: { kind: 'guess', name: "chicken" },
                          no: { kind: 'guess', name: "chocolate" },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"pasta\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"ketchup\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"honey\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"guacamole\" alphabetically?",
                        yes: { kind: 'guess', name: "granola" },
                        no: {
                          kind: 'question',
                          text: "Is it guacamole?",
                          yes: { kind: 'guess', name: "guacamole" },
                          no: { kind: 'guess', name: "ham" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"ice cream\" alphabetically?",
                        yes: { kind: 'guess', name: "honey" },
                        no: {
                          kind: 'question',
                          text: "Is it ice cream?",
                          yes: { kind: 'guess', name: "ice cream" },
                          no: { kind: 'guess', name: "jelly" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"mayonnaise\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"lasagna\" alphabetically?",
                        yes: { kind: 'guess', name: "ketchup" },
                        no: {
                          kind: 'question',
                          text: "Is it lasagna?",
                          yes: { kind: 'guess', name: "lasagna" },
                          no: { kind: 'guess', name: "mac and cheese" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"mustard\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it mayonnaise?",
                          yes: { kind: 'guess', name: "mayonnaise" },
                          no: { kind: 'guess', name: "meatballs" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it mustard?",
                          yes: { kind: 'guess', name: "mustard" },
                          no: { kind: 'guess', name: "oatmeal" },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"sausage\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"potato chips\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"peanut butter\" alphabetically?",
                        yes: { kind: 'guess', name: "pasta" },
                        no: {
                          kind: 'question',
                          text: "Is it peanut butter?",
                          yes: { kind: 'guess', name: "peanut butter" },
                          no: { kind: 'guess', name: "popcorn" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"rice\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it potato chips?",
                          yes: { kind: 'guess', name: "potato chips" },
                          no: { kind: 'guess', name: "ravioli" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it rice?",
                          yes: { kind: 'guess', name: "rice" },
                          no: { kind: 'guess', name: "salsa" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"steak\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"soup\" alphabetically?",
                        yes: { kind: 'guess', name: "sausage" },
                        no: {
                          kind: 'question',
                          text: "Is it soup?",
                          yes: { kind: 'guess', name: "soup" },
                          no: { kind: 'guess', name: "spaghetti" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"turkey meat\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it steak?",
                          yes: { kind: 'guess', name: "steak" },
                          no: { kind: 'guess', name: "sushi" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it turkey meat?",
                          yes: { kind: 'guess', name: "turkey meat" },
                          no: { kind: 'guess', name: "yogurt" },
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
          text: "Writing or school supply?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"a pencil\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a folder\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a book\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a backpack?",
                  yes: { kind: 'guess', name: "a backpack" },
                  no: { kind: 'guess', name: "a binder" },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a calculator\" alphabetically?",
                  yes: { kind: 'guess', name: "a book" },
                  no: {
                    kind: 'question',
                    text: "Is it a calculator?",
                    yes: { kind: 'guess', name: "a calculator" },
                    no: { kind: 'guess', name: "a crayon" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a marker\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a folder?",
                  yes: { kind: 'guess', name: "a folder" },
                  no: { kind: 'guess', name: "a highlighter" },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a notebook\" alphabetically?",
                  yes: { kind: 'guess', name: "a marker" },
                  no: {
                    kind: 'question',
                    text: "Is it a notebook?",
                    yes: { kind: 'guess', name: "a notebook" },
                    no: { kind: 'guess', name: "a pen" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"an eraser\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a ruler\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a pencil?",
                  yes: { kind: 'guess', name: "a pencil" },
                  no: { kind: 'guess', name: "a pencil case" },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a stapler\" alphabetically?",
                  yes: { kind: 'guess', name: "a ruler" },
                  no: {
                    kind: 'question',
                    text: "Is it a stapler?",
                    yes: { kind: 'guess', name: "a stapler" },
                    no: { kind: 'guess', name: "a whiteboard" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"index cards\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"chalk\" alphabetically?",
                  yes: { kind: 'guess', name: "an eraser" },
                  no: {
                    kind: 'question',
                    text: "Is it chalk?",
                    yes: { kind: 'guess', name: "chalk" },
                    no: { kind: 'guess', name: "glue" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"scissors\" alphabetically?",
                  yes: { kind: 'guess', name: "index cards" },
                  no: {
                    kind: 'question',
                    text: "Is it scissors?",
                    yes: { kind: 'guess', name: "scissors" },
                    no: { kind: 'guess', name: "tape" },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Clothing you wear?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a tie\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a jacket\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a coat\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a belt\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a baseball cap?",
                      yes: { kind: 'guess', name: "a baseball cap" },
                      no: { kind: 'guess', name: "a beanie" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a bra\" alphabetically?",
                      yes: { kind: 'guess', name: "a belt" },
                      no: {
                        kind: 'question',
                        text: "Is it a bra?",
                        yes: { kind: 'guess', name: "a bra" },
                        no: { kind: 'guess', name: "a bracelet" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a hat\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a coat?",
                      yes: { kind: 'guess', name: "a coat" },
                      no: { kind: 'guess', name: "a dress" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a helmet\" alphabetically?",
                      yes: { kind: 'guess', name: "a hat" },
                      no: {
                        kind: 'question',
                        text: "Is it a helmet?",
                        yes: { kind: 'guess', name: "a helmet" },
                        no: { kind: 'guess', name: "a hoodie" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a skirt\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a purse\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a jacket?",
                      yes: { kind: 'guess', name: "a jacket" },
                      no: { kind: 'guess', name: "a necklace" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a ring\" alphabetically?",
                      yes: { kind: 'guess', name: "a purse" },
                      no: {
                        kind: 'question',
                        text: "Is it a ring?",
                        yes: { kind: 'guess', name: "a ring" },
                        no: { kind: 'guess', name: "a scarf" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a sweater\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a skirt?",
                      yes: { kind: 'guess', name: "a skirt" },
                      no: { kind: 'guess', name: "a suit" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a swimsuit\" alphabetically?",
                      yes: { kind: 'guess', name: "a sweater" },
                      no: {
                        kind: 'question',
                        text: "Is it a swimsuit?",
                        yes: { kind: 'guess', name: "a swimsuit" },
                        no: { kind: 'guess', name: "a t-shirt" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"jeans\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"earrings\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a watch\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a tie?",
                      yes: { kind: 'guess', name: "a tie" },
                      no: { kind: 'guess', name: "a wallet" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"an umbrella\" alphabetically?",
                      yes: { kind: 'guess', name: "a watch" },
                      no: {
                        kind: 'question',
                        text: "Is it an umbrella?",
                        yes: { kind: 'guess', name: "an umbrella" },
                        no: { kind: 'guess', name: "boots" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"glasses\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it earrings?",
                      yes: { kind: 'guess', name: "earrings" },
                      no: { kind: 'guess', name: "flip-flops" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"gloves\" alphabetically?",
                      yes: { kind: 'guess', name: "glasses" },
                      no: {
                        kind: 'question',
                        text: "Is it gloves?",
                        yes: { kind: 'guess', name: "gloves" },
                        no: { kind: 'guess', name: "heels" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"sandals\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"knee pads\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it jeans?",
                      yes: { kind: 'guess', name: "jeans" },
                      no: { kind: 'guess', name: "jewelry" },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"pajamas\" alphabetically?",
                      yes: { kind: 'guess', name: "knee pads" },
                      no: {
                        kind: 'question',
                        text: "Is it pajamas?",
                        yes: { kind: 'guess', name: "pajamas" },
                        no: { kind: 'guess', name: "pants" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"socks\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"shorts\" alphabetically?",
                      yes: { kind: 'guess', name: "sandals" },
                      no: {
                        kind: 'question',
                        text: "Is it shorts?",
                        yes: { kind: 'guess', name: "shorts" },
                        no: { kind: 'guess', name: "sneakers" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"sunglasses\" alphabetically?",
                      yes: { kind: 'guess', name: "socks" },
                      no: {
                        kind: 'question',
                        text: "Is it sunglasses?",
                        yes: { kind: 'guess', name: "sunglasses" },
                        no: { kind: 'guess', name: "underwear" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a puzzle\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a glass\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a clock\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a board game\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a baseball\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a ball?",
                        yes: { kind: 'guess', name: "a ball" },
                        no: { kind: 'guess', name: "a bandage" },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a baseball bat\" alphabetically?",
                        yes: { kind: 'guess', name: "a baseball" },
                        no: {
                          kind: 'question',
                          text: "Is it a baseball bat?",
                          yes: { kind: 'guess', name: "a baseball bat" },
                          no: { kind: 'guess', name: "a basketball" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a button\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a bowl\" alphabetically?",
                        yes: { kind: 'guess', name: "a board game" },
                        no: {
                          kind: 'question',
                          text: "Is it a bowl?",
                          yes: { kind: 'guess', name: "a bowl" },
                          no: { kind: 'guess', name: "a broom" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a calendar\" alphabetically?",
                        yes: { kind: 'guess', name: "a button" },
                        no: {
                          kind: 'question',
                          text: "Is it a calendar?",
                          yes: { kind: 'guess', name: "a calendar" },
                          no: { kind: 'guess', name: "a candle" },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a drill\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a credit card\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a coin\" alphabetically?",
                        yes: { kind: 'guess', name: "a clock" },
                        no: {
                          kind: 'question',
                          text: "Is it a coin?",
                          yes: { kind: 'guess', name: "a coin" },
                          no: { kind: 'guess', name: "a compass" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a cup\" alphabetically?",
                        yes: { kind: 'guess', name: "a credit card" },
                        no: {
                          kind: 'question',
                          text: "Is it a cup?",
                          yes: { kind: 'guess', name: "a cup" },
                          no: { kind: 'guess', name: "a doll" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a football\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a dustpan\" alphabetically?",
                        yes: { kind: 'guess', name: "a drill" },
                        no: {
                          kind: 'question',
                          text: "Is it a dustpan?",
                          yes: { kind: 'guess', name: "a dustpan" },
                          no: { kind: 'guess', name: "a flashlight" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a fork\" alphabetically?",
                        yes: { kind: 'guess', name: "a football" },
                        no: {
                          kind: 'question',
                          text: "Is it a fork?",
                          yes: { kind: 'guess', name: "a fork" },
                          no: { kind: 'guess', name: "a Frisbee" },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a map\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a keychain\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a hammer\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a glass?",
                        yes: { kind: 'guess', name: "a glass" },
                        no: { kind: 'guess', name: "a golf club" },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a jump rope\" alphabetically?",
                        yes: { kind: 'guess', name: "a hammer" },
                        no: {
                          kind: 'question',
                          text: "Is it a jump rope?",
                          yes: { kind: 'guess', name: "a jump rope" },
                          no: { kind: 'guess', name: "a key" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a lighter\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a knife\" alphabetically?",
                        yes: { kind: 'guess', name: "a keychain" },
                        no: {
                          kind: 'question',
                          text: "Is it a knife?",
                          yes: { kind: 'guess', name: "a knife" },
                          no: { kind: 'guess', name: "a ladder" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a lock\" alphabetically?",
                        yes: { kind: 'guess', name: "a lighter" },
                        no: {
                          kind: 'question',
                          text: "Is it a lock?",
                          yes: { kind: 'guess', name: "a lock" },
                          no: { kind: 'guess', name: "a magnet" },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a needle\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a mug\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a match\" alphabetically?",
                        yes: { kind: 'guess', name: "a map" },
                        no: {
                          kind: 'question',
                          text: "Is it a match?",
                          yes: { kind: 'guess', name: "a match" },
                          no: { kind: 'guess', name: "a microscope" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a nail\" alphabetically?",
                        yes: { kind: 'guess', name: "a mug" },
                        no: {
                          kind: 'question',
                          text: "Is it a nail?",
                          yes: { kind: 'guess', name: "a nail" },
                          no: { kind: 'guess', name: "a napkin" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a phone case\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a padlock\" alphabetically?",
                        yes: { kind: 'guess', name: "a needle" },
                        no: {
                          kind: 'question',
                          text: "Is it a padlock?",
                          yes: { kind: 'guess', name: "a padlock" },
                          no: { kind: 'guess', name: "a paperclip" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a pillowcase\" alphabetically?",
                        yes: { kind: 'guess', name: "a phone case" },
                        no: {
                          kind: 'question',
                          text: "Is it a pillowcase?",
                          yes: { kind: 'guess', name: "a pillowcase" },
                          no: { kind: 'guess', name: "a plate" },
                        },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a zipper\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a sticker\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a screwdriver\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a rubber band\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a puzzle?",
                        yes: { kind: 'guess', name: "a puzzle" },
                        no: { kind: 'guess', name: "a quilt" },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a saw\" alphabetically?",
                        yes: { kind: 'guess', name: "a rubber band" },
                        no: {
                          kind: 'question',
                          text: "Is it a saw?",
                          yes: { kind: 'guess', name: "a saw" },
                          no: { kind: 'guess', name: "a screw" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a soccer ball\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a sewing machine\" alphabetically?",
                        yes: { kind: 'guess', name: "a screwdriver" },
                        no: {
                          kind: 'question',
                          text: "Is it a sewing machine?",
                          yes: { kind: 'guess', name: "a sewing machine" },
                          no: { kind: 'guess', name: "a sheet" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a sponge\" alphabetically?",
                        yes: { kind: 'guess', name: "a soccer ball" },
                        no: {
                          kind: 'question',
                          text: "Is it a sponge?",
                          yes: { kind: 'guess', name: "a sponge" },
                          no: { kind: 'guess', name: "a spoon" },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a tissues box\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a telescope\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a suitcase\" alphabetically?",
                        yes: { kind: 'guess', name: "a sticker" },
                        no: {
                          kind: 'question',
                          text: "Is it a suitcase?",
                          yes: { kind: 'guess', name: "a suitcase" },
                          no: { kind: 'guess', name: "a teddy bear" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a tennis ball\" alphabetically?",
                        yes: { kind: 'guess', name: "a telescope" },
                        no: {
                          kind: 'question',
                          text: "Is it a tennis ball?",
                          yes: { kind: 'guess', name: "a tennis ball" },
                          no: { kind: 'guess', name: "a tennis racket" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a water bottle\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a toothbrush\" alphabetically?",
                        yes: { kind: 'guess', name: "a tissues box" },
                        no: {
                          kind: 'question',
                          text: "Is it a toothbrush?",
                          yes: { kind: 'guess', name: "a toothbrush" },
                          no: { kind: 'guess', name: "a towel" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a wrench\" alphabetically?",
                        yes: { kind: 'guess', name: "a water bottle" },
                        no: {
                          kind: 'question',
                          text: "Is it a wrench?",
                          yes: { kind: 'guess', name: "a wrench" },
                          no: { kind: 'guess', name: "a yoga mat" },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"perfume\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"dice\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"binoculars\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"an action figure\" alphabetically?",
                        yes: { kind: 'guess', name: "a zipper" },
                        no: {
                          kind: 'question',
                          text: "Is it an action figure?",
                          yes: { kind: 'guess', name: "an action figure" },
                          no: { kind: 'guess', name: "an alarm clock" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"conditioner\" alphabetically?",
                        yes: { kind: 'guess', name: "binoculars" },
                        no: {
                          kind: 'question',
                          text: "Is it conditioner?",
                          yes: { kind: 'guess', name: "conditioner" },
                          no: { kind: 'guess', name: "deodorant" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"lotion\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"dumbbells\" alphabetically?",
                        yes: { kind: 'guess', name: "dice" },
                        no: {
                          kind: 'question',
                          text: "Is it dumbbells?",
                          yes: { kind: 'guess', name: "dumbbells" },
                          no: { kind: 'guess', name: "Lego" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"luggage\" alphabetically?",
                        yes: { kind: 'guess', name: "lotion" },
                        no: {
                          kind: 'question',
                          text: "Is it luggage?",
                          yes: { kind: 'guess', name: "luggage" },
                          no: { kind: 'guess', name: "medicine" },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"thread\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"shampoo\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"playing cards\" alphabetically?",
                        yes: { kind: 'guess', name: "perfume" },
                        no: {
                          kind: 'question',
                          text: "Is it playing cards?",
                          yes: { kind: 'guess', name: "playing cards" },
                          no: { kind: 'guess', name: "pliers" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"soap\" alphabetically?",
                        yes: { kind: 'guess', name: "shampoo" },
                        no: {
                          kind: 'question',
                          text: "Is it soap?",
                          yes: { kind: 'guess', name: "soap" },
                          no: { kind: 'guess', name: "sunscreen" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"toothpaste\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"tissue\" alphabetically?",
                        yes: { kind: 'guess', name: "thread" },
                        no: {
                          kind: 'question',
                          text: "Is it tissue?",
                          yes: { kind: 'guess', name: "tissue" },
                          no: { kind: 'guess', name: "toilet paper" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"vitamins\" alphabetically?",
                        yes: { kind: 'guess', name: "toothpaste" },
                        no: {
                          kind: 'question',
                          text: "Is it vitamins?",
                          yes: { kind: 'guess', name: "vitamins" },
                          no: { kind: 'guess', name: "yarn" },
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
