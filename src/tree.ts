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
export const STORAGE_KEY = 'twentyq-tree-v7'
export const MAX_QUESTIONS = 20

/** Bump this whenever the seeded question order/content changes. */
export const SEED_VERSION = 7
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
  /** Hybrid model fields (optional for older sessions). */
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

/** Seed v7: computer leaf +  ask job/occupation before famous person. */
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
            text: "Does its name come before \"Joker\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Deadpool\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Batman?",
                yes: { kind: 'guess', name: "Batman" },
                no: {
                  kind: 'question',
                  text: "Is it Black Panther?",
                  yes: { kind: 'guess', name: "Black Panther" },
                  no: { kind: 'guess', name: "Captain America" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Deadpool?",
                yes: { kind: 'guess', name: "Deadpool" },
                no: {
                  kind: 'question',
                  text: "Is it Hulk?",
                  yes: { kind: 'guess', name: "Hulk" },
                  no: { kind: 'guess', name: "Iron Man" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"Thor\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Joker?",
                yes: { kind: 'guess', name: "Joker" },
                no: {
                  kind: 'question',
                  text: "Is it Spider-Man?",
                  yes: { kind: 'guess', name: "Spider-Man" },
                  no: { kind: 'guess', name: "Superman" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Thor?",
                yes: { kind: 'guess', name: "Thor" },
                no: {
                  kind: 'question',
                  text: "Is it Wolverine?",
                  yes: { kind: 'guess', name: "Wolverine" },
                  no: { kind: 'guess', name: "Wonder Woman" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Star Wars?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Han Solo\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Baby Yoda?",
                yes: { kind: 'guess', name: "Baby Yoda" },
                no: {
                  kind: 'question',
                  text: "Is it Chewbacca?",
                  yes: { kind: 'guess', name: "Chewbacca" },
                  no: { kind: 'guess', name: "Darth Vader" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Han Solo?",
                yes: { kind: 'guess', name: "Han Solo" },
                no: {
                  kind: 'question',
                  text: "Is it Luke Skywalker?",
                  yes: { kind: 'guess', name: "Luke Skywalker" },
                  no: {
                    kind: 'question',
                    text: "Is it Princess Leia?",
                    yes: { kind: 'guess', name: "Princess Leia" },
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
                text: "Does its name come before \"Pikachu\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Elsa\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Bugs Bunny?",
                    yes: { kind: 'guess', name: "Bugs Bunny" },
                    no: { kind: 'guess', name: "Buzz Lightyear" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Elsa?",
                    yes: { kind: 'guess', name: "Elsa" },
                    no: {
                      kind: 'question',
                      text: "Is it Homer Simpson?",
                      yes: { kind: 'guess', name: "Homer Simpson" },
                      no: { kind: 'guess', name: "Mickey Mouse" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Simba\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Pikachu?",
                    yes: { kind: 'guess', name: "Pikachu" },
                    no: {
                      kind: 'question',
                      text: "Is it Scooby-Doo?",
                      yes: { kind: 'guess', name: "Scooby-Doo" },
                      no: { kind: 'guess', name: "Shrek" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Simba?",
                    yes: { kind: 'guess', name: "Simba" },
                    no: {
                      kind: 'question',
                      text: "Is it SpongeBob?",
                      yes: { kind: 'guess', name: "SpongeBob" },
                      no: { kind: 'guess', name: "Woody" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"Indiana Jones\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Gandalf\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Daenerys?",
                    yes: { kind: 'guess', name: "Daenerys" },
                    no: {
                      kind: 'question',
                      text: "Is it Eleven?",
                      yes: { kind: 'guess', name: "Eleven" },
                      no: { kind: 'guess', name: "Frodo" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Gandalf?",
                    yes: { kind: 'guess', name: "Gandalf" },
                    no: {
                      kind: 'question',
                      text: "Is it Harry Potter?",
                      yes: { kind: 'guess', name: "Harry Potter" },
                      no: { kind: 'guess', name: "Hermione Granger" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Jon Snow\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Indiana Jones?",
                    yes: { kind: 'guess', name: "Indiana Jones" },
                    no: {
                      kind: 'question',
                      text: "Is it Jack Sparrow?",
                      yes: { kind: 'guess', name: "Jack Sparrow" },
                      no: { kind: 'guess', name: "James Bond" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Jon Snow?",
                    yes: { kind: 'guess', name: "Jon Snow" },
                    no: {
                      kind: 'question',
                      text: "Is it Katniss Everdeen?",
                      yes: { kind: 'guess', name: "Katniss Everdeen" },
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
          text: "Video game character?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"Mario\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Lara Croft\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Creeper?",
                yes: { kind: 'guess', name: "Creeper" },
                no: {
                  kind: 'question',
                  text: "Is it Donkey Kong?",
                  yes: { kind: 'guess', name: "Donkey Kong" },
                  no: { kind: 'guess', name: "Kirby" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Lara Croft?",
                yes: { kind: 'guess', name: "Lara Croft" },
                no: {
                  kind: 'question',
                  text: "Is it Link?",
                  yes: { kind: 'guess', name: "Link" },
                  no: { kind: 'guess', name: "Luigi" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"Princess Peach\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Mario?",
                yes: { kind: 'guess', name: "Mario" },
                no: {
                  kind: 'question',
                  text: "Is it Master Chief?",
                  yes: { kind: 'guess', name: "Master Chief" },
                  no: { kind: 'guess', name: "Pac-Man" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Princess Peach?",
                yes: { kind: 'guess', name: "Princess Peach" },
                no: {
                  kind: 'question',
                  text: "Is it Sonic?",
                  yes: { kind: 'guess', name: "Sonic" },
                  no: {
                    kind: 'question',
                    text: "Is it Steve from Minecraft?",
                    yes: { kind: 'guess', name: "Steve from Minecraft" },
                    no: { kind: 'guess', name: "Zelda" },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Does its name come before \"King Arthur\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Is it Alice?",
              yes: { kind: 'guess', name: "Alice" },
              no: {
                kind: 'question',
                text: "Is it Cinderella?",
                yes: { kind: 'guess', name: "Cinderella" },
                no: { kind: 'guess', name: "Dracula" },
              },
            },
            no: {
              kind: 'question',
              text: "Is it King Arthur?",
              yes: { kind: 'guess', name: "King Arthur" },
              no: {
                kind: 'question',
                text: "Is it Peter Pan?",
                yes: { kind: 'guess', name: "Peter Pan" },
                no: {
                  kind: 'question',
                  text: "Is it Robin Hood?",
                  yes: { kind: 'guess', name: "Robin Hood" },
                  no: { kind: 'guess', name: "Snow White" },
                },
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
          text: "Works in a school?",
          yes: {
            kind: 'question',
            text: "Teacher?",
            yes: { kind: 'guess', name: "a teacher" },
            no: {
              kind: 'question',
              text: "Principal?",
              yes: { kind: 'guess', name: "a principal" },
              no: { kind: 'guess', name: "a student" },
            },
          },
          no: {
            kind: 'question',
            text: "Works in healthcare?",
            yes: {
              kind: 'question',
              text: "Doctor?",
              yes: { kind: 'guess', name: "a doctor" },
              no: {
                kind: 'question',
                text: "Nurse?",
                yes: { kind: 'guess', name: "a nurse" },
                no: { kind: 'guess', name: "a dentist" },
              },
            },
            no: {
              kind: 'question',
              text: "Food service or store?",
              yes: {
                kind: 'question',
                text: "Chef / cook?",
                yes: { kind: 'guess', name: "a chef" },
                no: {
                  kind: 'question',
                  text: "Waiter / waitress?",
                  yes: { kind: 'guess', name: "a waiter" },
                  no: { kind: 'guess', name: "a cashier" },
                },
              },
              no: {
                kind: 'question',
                text: "Public safety or military?",
                yes: {
                  kind: 'question',
                  text: "Firefighter?",
                  yes: { kind: 'guess', name: "a firefighter" },
                  no: {
                    kind: 'question',
                    text: "Police officer?",
                    yes: { kind: 'guess', name: "a police officer" },
                    no: { kind: 'guess', name: "a soldier" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Farmer?",
                  yes: { kind: 'guess', name: "a farmer" },
                  no: {
                    kind: 'question',
                    text: "Pilot?",
                    yes: { kind: 'guess', name: "a pilot" },
                    no: {
                      kind: 'question',
                      text: "Lawyer?",
                      yes: { kind: 'guess', name: "a lawyer" },
                      no: {
                        kind: 'question',
                        text: "Engineer?",
                        yes: { kind: 'guess', name: "an engineer" },
                        no: { kind: 'guess', name: "a construction worker" },
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
          text: "Is it someone famous most people know by name (celebrity, historical figure, athlete)?",
          yes: {
          kind: 'question',
          text: "Known for music?",
          yes: {
            kind: 'question',
            text: "Mostly famous after 2000?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Drake\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Beyoncé\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it Adele?",
                  yes: { kind: 'guess', name: "Adele" },
                  no: { kind: 'guess', name: "Ariana Grande" },
                },
                no: {
                  kind: 'question',
                  text: "Is it Beyoncé?",
                  yes: { kind: 'guess', name: "Beyoncé" },
                  no: {
                    kind: 'question',
                    text: "Is it Billie Eilish?",
                    yes: { kind: 'guess', name: "Billie Eilish" },
                    no: { kind: 'guess', name: "Bruno Mars" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"Rihanna\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it Drake?",
                  yes: { kind: 'guess', name: "Drake" },
                  no: {
                    kind: 'question',
                    text: "Is it Ed Sheeran?",
                    yes: { kind: 'guess', name: "Ed Sheeran" },
                    no: { kind: 'guess', name: "Lady Gaga" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Rihanna?",
                  yes: { kind: 'guess', name: "Rihanna" },
                  no: {
                    kind: 'question',
                    text: "Is it Taylor Swift?",
                    yes: { kind: 'guess', name: "Taylor Swift" },
                    no: { kind: 'guess', name: "The Weeknd" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"John Lennon\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Elton John\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it Aretha Franklin?",
                  yes: { kind: 'guess', name: "Aretha Franklin" },
                  no: { kind: 'guess', name: "David Bowie" },
                },
                no: {
                  kind: 'question',
                  text: "Is it Elton John?",
                  yes: { kind: 'guess', name: "Elton John" },
                  no: {
                    kind: 'question',
                    text: "Is it Elvis Presley?",
                    yes: { kind: 'guess', name: "Elvis Presley" },
                    no: { kind: 'guess', name: "Freddie Mercury" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"Paul McCartney\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it John Lennon?",
                  yes: { kind: 'guess', name: "John Lennon" },
                  no: {
                    kind: 'question',
                    text: "Is it Madonna?",
                    yes: { kind: 'guess', name: "Madonna" },
                    no: { kind: 'guess', name: "Michael Jackson" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Paul McCartney?",
                  yes: { kind: 'guess', name: "Paul McCartney" },
                  no: {
                    kind: 'question',
                    text: "Is it Prince?",
                    yes: { kind: 'guess', name: "Prince" },
                    no: { kind: 'guess', name: "Whitney Houston" },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Historical or political figure?",
            yes: {
              kind: 'question',
              text: "US president?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"George Washington\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Bill Clinton\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Abraham Lincoln?",
                    yes: { kind: 'guess', name: "Abraham Lincoln" },
                    no: { kind: 'guess', name: "Barack Obama" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Bill Clinton?",
                    yes: { kind: 'guess', name: "Bill Clinton" },
                    no: {
                      kind: 'question',
                      text: "Is it Donald Trump?",
                      yes: { kind: 'guess', name: "Donald Trump" },
                      no: { kind: 'guess', name: "Franklin D. Roosevelt" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"John F. Kennedy\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it George Washington?",
                    yes: { kind: 'guess', name: "George Washington" },
                    no: { kind: 'guess', name: "Joe Biden" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it John F. Kennedy?",
                    yes: { kind: 'guess', name: "John F. Kennedy" },
                    no: {
                      kind: 'question',
                      text: "Is it Ronald Reagan?",
                      yes: { kind: 'guess', name: "Ronald Reagan" },
                      no: { kind: 'guess', name: "Thomas Jefferson" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Scientist?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Isaac Newton\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Ada Lovelace?",
                    yes: { kind: 'guess', name: "Ada Lovelace" },
                    no: {
                      kind: 'question',
                      text: "Is it Alan Turing?",
                      yes: { kind: 'guess', name: "Alan Turing" },
                      no: {
                        kind: 'question',
                        text: "Is it Albert Einstein?",
                        yes: { kind: 'guess', name: "Albert Einstein" },
                        no: { kind: 'guess', name: "Charles Darwin" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Marie Curie\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Isaac Newton?",
                      yes: { kind: 'guess', name: "Isaac Newton" },
                      no: { kind: 'guess', name: "Leonardo da Vinci" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Marie Curie?",
                      yes: { kind: 'guess', name: "Marie Curie" },
                      no: {
                        kind: 'question',
                        text: "Is it Nikola Tesla?",
                        yes: { kind: 'guess', name: "Nikola Tesla" },
                        no: { kind: 'guess', name: "Stephen Hawking" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Martin Luther King Jr.\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Joan of Arc\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Anne Frank?",
                      yes: { kind: 'guess', name: "Anne Frank" },
                      no: { kind: 'guess', name: "Cleopatra" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Joan of Arc?",
                      yes: { kind: 'guess', name: "Joan of Arc" },
                      no: {
                        kind: 'question',
                        text: "Is it Julius Caesar?",
                        yes: { kind: 'guess', name: "Julius Caesar" },
                        no: { kind: 'guess', name: "Mahatma Gandhi" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Queen Elizabeth II\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Martin Luther King Jr.?",
                      yes: { kind: 'guess', name: "Martin Luther King Jr." },
                      no: {
                        kind: 'question',
                        text: "Is it Napoleon?",
                        yes: { kind: 'guess', name: "Napoleon" },
                        no: { kind: 'guess', name: "Nelson Mandela" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Queen Elizabeth II?",
                      yes: { kind: 'guess', name: "Queen Elizabeth II" },
                      no: {
                        kind: 'question',
                        text: "Is it William Shakespeare?",
                        yes: { kind: 'guess', name: "William Shakespeare" },
                        no: { kind: 'guess', name: "Winston Churchill" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Athlete?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Muhammad Ali\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Lionel Messi\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Cristiano Ronaldo?",
                    yes: { kind: 'guess', name: "Cristiano Ronaldo" },
                    no: { kind: 'guess', name: "LeBron James" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Lionel Messi?",
                    yes: { kind: 'guess', name: "Lionel Messi" },
                    no: {
                      kind: 'question',
                      text: "Is it Michael Jordan?",
                      yes: { kind: 'guess', name: "Michael Jordan" },
                      no: { kind: 'guess', name: "Michael Phelps" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Tiger Woods\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Muhammad Ali?",
                    yes: { kind: 'guess', name: "Muhammad Ali" },
                    no: {
                      kind: 'question',
                      text: "Is it Serena Williams?",
                      yes: { kind: 'guess', name: "Serena Williams" },
                      no: { kind: 'guess', name: "Simone Biles" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Tiger Woods?",
                    yes: { kind: 'guess', name: "Tiger Woods" },
                    no: {
                      kind: 'question',
                      text: "Is it Tom Brady?",
                      yes: { kind: 'guess', name: "Tom Brady" },
                      no: { kind: 'guess', name: "Usain Bolt" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Actor or entertainer?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Meryl Streep\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"Keanu Reeves\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Audrey Hepburn?",
                      yes: { kind: 'guess', name: "Audrey Hepburn" },
                      no: { kind: 'guess', name: "Dwayne Johnson" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Keanu Reeves?",
                      yes: { kind: 'guess', name: "Keanu Reeves" },
                      no: {
                        kind: 'question',
                        text: "Is it Leonardo DiCaprio?",
                        yes: { kind: 'guess', name: "Leonardo DiCaprio" },
                        no: { kind: 'guess', name: "Marilyn Monroe" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"Robin Williams\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it Meryl Streep?",
                      yes: { kind: 'guess', name: "Meryl Streep" },
                      no: {
                        kind: 'question',
                        text: "Is it Morgan Freeman?",
                        yes: { kind: 'guess', name: "Morgan Freeman" },
                        no: { kind: 'guess', name: "Oprah Winfrey" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Robin Williams?",
                      yes: { kind: 'guess', name: "Robin Williams" },
                      no: {
                        kind: 'question',
                        text: "Is it Tom Hanks?",
                        yes: { kind: 'guess', name: "Tom Hanks" },
                        no: { kind: 'guess', name: "Will Smith" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Malala Yousafzai\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Bill Gates?",
                    yes: { kind: 'guess', name: "Bill Gates" },
                    no: {
                      kind: 'question',
                      text: "Is it Elon Musk?",
                      yes: { kind: 'guess', name: "Elon Musk" },
                      no: {
                        kind: 'question',
                        text: "Is it Greta Thunberg?",
                        yes: { kind: 'guess', name: "Greta Thunberg" },
                        no: { kind: 'guess', name: "Jeff Bezos" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Malala Yousafzai?",
                    yes: { kind: 'guess', name: "Malala Yousafzai" },
                    no: {
                      kind: 'question',
                      text: "Is it Mark Zuckerberg?",
                      yes: { kind: 'guess', name: "Mark Zuckerberg" },
                      no: {
                        kind: 'question',
                        text: "Is it MrBeast?",
                        yes: { kind: 'guess', name: "MrBeast" },
                        no: { kind: 'guess', name: "Steve Jobs" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
          no: { kind: 'guess', name: "a person" },
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
            text: "Does its name come before \"an otter\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Is it a dolphin?",
              yes: { kind: 'guess', name: "a dolphin" },
              no: {
                kind: 'question',
                text: "Is it a manatee?",
                yes: { kind: 'guess', name: "a manatee" },
                no: { kind: 'guess', name: "an orca" },
              },
            },
            no: {
              kind: 'question',
              text: "Is it an otter?",
              yes: { kind: 'guess', name: "an otter" },
              no: {
                kind: 'question',
                text: "Is it a seal?",
                yes: { kind: 'guess', name: "a seal" },
                no: {
                  kind: 'question',
                  text: "Is it a walrus?",
                  yes: { kind: 'guess', name: "a walrus" },
                  no: { kind: 'guess', name: "a whale" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Hard shell?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a shrimp\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a crab?",
                yes: { kind: 'guess', name: "a crab" },
                no: { kind: 'guess', name: "a lobster" },
              },
              no: {
                kind: 'question',
                text: "Is it a shrimp?",
                yes: { kind: 'guess', name: "a shrimp" },
                no: {
                  kind: 'question',
                  text: "Is it a snail?",
                  yes: { kind: 'guess', name: "a snail" },
                  no: { kind: 'guess', name: "a turtle" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Shark?",
              yes: { kind: 'guess', name: "a shark" },
              no: {
                kind: 'question',
                text: "Does its name come before \"a salmon\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a clownfish?",
                  yes: { kind: 'guess', name: "a clownfish" },
                  no: {
                    kind: 'question',
                    text: "Is it a goldfish?",
                    yes: { kind: 'guess', name: "a goldfish" },
                    no: {
                      kind: 'question',
                      text: "Is it a jellyfish?",
                      yes: { kind: 'guess', name: "a jellyfish" },
                      no: { kind: 'guess', name: "an octopus" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a salmon?",
                  yes: { kind: 'guess', name: "a salmon" },
                  no: {
                    kind: 'question',
                    text: "Is it a seahorse?",
                    yes: { kind: 'guess', name: "a seahorse" },
                    no: {
                      kind: 'question',
                      text: "Is it a starfish?",
                      yes: { kind: 'guess', name: "a starfish" },
                      no: { kind: 'guess', name: "a tuna" },
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
                text: "Is it an eagle?",
                yes: { kind: 'guess', name: "an eagle" },
                no: {
                  kind: 'question',
                  text: "Is it a hawk?",
                  yes: { kind: 'guess', name: "a hawk" },
                  no: {
                    kind: 'question',
                    text: "Is it an owl?",
                    yes: { kind: 'guess', name: "an owl" },
                    no: { kind: 'guess', name: "a falcon" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Farm bird?",
                yes: {
                  kind: 'question',
                  text: "Is it a chicken?",
                  yes: { kind: 'guess', name: "a chicken" },
                  no: {
                    kind: 'question',
                    text: "Is it a turkey?",
                    yes: { kind: 'guess', name: "a turkey" },
                    no: {
                      kind: 'question',
                      text: "Is it a duck?",
                      yes: { kind: 'guess', name: "a duck" },
                      no: { kind: 'guess', name: "a goose" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a peacock\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Does its name come before \"a hummingbird\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a crow?",
                      yes: { kind: 'guess', name: "a crow" },
                      no: { kind: 'guess', name: "a flamingo" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a hummingbird?",
                      yes: { kind: 'guess', name: "a hummingbird" },
                      no: {
                        kind: 'question',
                        text: "Is it an ostrich?",
                        yes: { kind: 'guess', name: "an ostrich" },
                        no: { kind: 'guess', name: "a parrot" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a robin\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Is it a peacock?",
                      yes: { kind: 'guess', name: "a peacock" },
                      no: {
                        kind: 'question',
                        text: "Is it a penguin?",
                        yes: { kind: 'guess', name: "a penguin" },
                        no: { kind: 'guess', name: "a pigeon" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a robin?",
                      yes: { kind: 'guess', name: "a robin" },
                      no: {
                        kind: 'question',
                        text: "Is it a sparrow?",
                        yes: { kind: 'guess', name: "a sparrow" },
                        no: { kind: 'guess', name: "a swan" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a dragonfly\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a bat?",
                yes: { kind: 'guess', name: "a bat" },
                no: {
                  kind: 'question',
                  text: "Is it a bee?",
                  yes: { kind: 'guess', name: "a bee" },
                  no: { kind: 'guess', name: "a butterfly" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a dragonfly?",
                yes: { kind: 'guess', name: "a dragonfly" },
                no: {
                  kind: 'question',
                  text: "Is it a ladybug?",
                  yes: { kind: 'guess', name: "a ladybug" },
                  no: { kind: 'guess', name: "a mosquito" },
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
                  text: "Is it a hamster?",
                  yes: { kind: 'guess', name: "a hamster" },
                  no: {
                    kind: 'question',
                    text: "Is it a rabbit?",
                    yes: { kind: 'guess', name: "a rabbit" },
                    no: { kind: 'guess', name: "a guinea pig" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Farm animal?",
              yes: {
                kind: 'question',
                text: "Cow?",
                yes: { kind: 'guess', name: "a cow" },
                no: {
                  kind: 'question',
                  text: "Pig?",
                  yes: { kind: 'guess', name: "a pig" },
                  no: {
                    kind: 'question',
                    text: "Horse?",
                    yes: { kind: 'guess', name: "a horse" },
                    no: {
                      kind: 'question',
                      text: "Is it a sheep?",
                      yes: { kind: 'guess', name: "a sheep" },
                      no: { kind: 'guess', name: "a goat" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Big cat?",
                yes: {
                  kind: 'question',
                  text: "Lion?",
                  yes: { kind: 'guess', name: "a lion" },
                  no: {
                    kind: 'question',
                    text: "Is it a tiger?",
                    yes: { kind: 'guess', name: "a tiger" },
                    no: {
                      kind: 'question',
                      text: "Is it a leopard?",
                      yes: { kind: 'guess', name: "a leopard" },
                      no: {
                        kind: 'question',
                        text: "Is it a cheetah?",
                        yes: { kind: 'guess', name: "a cheetah" },
                        no: { kind: 'guess', name: "a jaguar" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Elephant?",
                  yes: { kind: 'guess', name: "an elephant" },
                  no: {
                    kind: 'question',
                    text: "Giraffe?",
                    yes: { kind: 'guess', name: "a giraffe" },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a koala\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a fox\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it an ant?",
                          yes: { kind: 'guess', name: "an ant" },
                          no: {
                            kind: 'question',
                            text: "Is it a bear?",
                            yes: { kind: 'guess', name: "a bear" },
                            no: {
                              kind: 'question',
                              text: "Is it a crocodile?",
                              yes: { kind: 'guess', name: "a crocodile" },
                              no: { kind: 'guess', name: "a deer" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Does its name come before \"a gorilla\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Is it a fox?",
                            yes: { kind: 'guess', name: "a fox" },
                            no: { kind: 'guess', name: "a frog" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a gorilla?",
                            yes: { kind: 'guess', name: "a gorilla" },
                            no: {
                              kind: 'question',
                              text: "Is it a hippo?",
                              yes: { kind: 'guess', name: "a hippo" },
                              no: { kind: 'guess', name: "a kangaroo" },
                            },
                          },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a rhino\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it a koala?",
                          yes: { kind: 'guess', name: "a koala" },
                          no: {
                            kind: 'question',
                            text: "Is it a lizard?",
                            yes: { kind: 'guess', name: "a lizard" },
                            no: {
                              kind: 'question',
                              text: "Is it a monkey?",
                              yes: { kind: 'guess', name: "a monkey" },
                              no: { kind: 'guess', name: "a panda" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Does its name come before \"a spider\" alphabetically?",
                          yes: {
                            kind: 'question',
                            text: "Is it a rhino?",
                            yes: { kind: 'guess', name: "a rhino" },
                            no: { kind: 'guess', name: "a snake" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a spider?",
                            yes: { kind: 'guess', name: "a spider" },
                            no: {
                              kind: 'question',
                              text: "Is it a wolf?",
                              yes: { kind: 'guess', name: "a wolf" },
                              no: { kind: 'guess', name: "a zebra" },
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
            text: "Does its name come before \"a palm tree\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Is it an apple tree?",
              yes: { kind: 'guess', name: "an apple tree" },
              no: {
                kind: 'question',
                text: "Is it a cherry tree?",
                yes: { kind: 'guess', name: "a cherry tree" },
                no: {
                  kind: 'question',
                  text: "Is it a maple tree?",
                  yes: { kind: 'guess', name: "a maple tree" },
                  no: { kind: 'guess', name: "an oak tree" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a palm tree?",
              yes: { kind: 'guess', name: "a palm tree" },
              no: {
                kind: 'question',
                text: "Is it a pine tree?",
                yes: { kind: 'guess', name: "a pine tree" },
                no: {
                  kind: 'question',
                  text: "Is it a redwood?",
                  yes: { kind: 'guess', name: "a redwood" },
                  no: { kind: 'guess', name: "a willow" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Flower?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"an orchid\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a daisy?",
                yes: { kind: 'guess', name: "a daisy" },
                no: {
                  kind: 'question',
                  text: "Is it a lavender?",
                  yes: { kind: 'guess', name: "a lavender" },
                  no: { kind: 'guess', name: "a lily" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it an orchid?",
                yes: { kind: 'guess', name: "an orchid" },
                no: {
                  kind: 'question',
                  text: "Is it a rose?",
                  yes: { kind: 'guess', name: "a rose" },
                  no: {
                    kind: 'question',
                    text: "Is it a sunflower?",
                    yes: { kind: 'guess', name: "a sunflower" },
                    no: { kind: 'guess', name: "a tulip" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a grass\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a bamboo?",
                yes: { kind: 'guess', name: "a bamboo" },
                no: {
                  kind: 'question',
                  text: "Is it a cactus?",
                  yes: { kind: 'guess', name: "a cactus" },
                  no: { kind: 'guess', name: "a fern" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a grass?",
                yes: { kind: 'guess', name: "a grass" },
                no: {
                  kind: 'question',
                  text: "Is it a moss?",
                  yes: { kind: 'guess', name: "a moss" },
                  no: {
                    kind: 'question',
                    text: "Is it a mushroom?",
                    yes: { kind: 'guess', name: "a mushroom" },
                    no: { kind: 'guess', name: "a tomato plant" },
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
    text: "Is it bigger than a breadbox?",
    yes: {
      kind: 'question',
      text: "Vehicle?",
      yes: {
        kind: 'question',
        text: "Does it fly?",
        yes: {
          kind: 'question',
          text: "Helicopter?",
          yes: { kind: 'guess', name: "a helicopter" },
          no: {
            kind: 'question',
            text: "Drone?",
            yes: { kind: 'guess', name: "a drone" },
            no: {
              kind: 'question',
              text: "Spacecraft / rocket?",
              yes: {
                kind: 'question',
                text: "Rocket?",
                yes: { kind: 'guess', name: "a rocket" },
                no: { kind: 'guess', name: "a spaceship" },
              },
              no: {
                kind: 'question',
                text: "Hot air balloon?",
                yes: { kind: 'guess', name: "a hot air balloon" },
                no: {
                  kind: 'question',
                  text: "Fighter jet?",
                  yes: { kind: 'guess', name: "a fighter jet" },
                  no: {
                    kind: 'question',
                    text: "Jet airliner?",
                    yes: { kind: 'guess', name: "a jet" },
                    no: { kind: 'guess', name: "an airplane" },
                  },
                },
              },
            },
          },
        },
        no: {
          kind: 'question',
          text: "Does it go on water?",
          yes: {
            kind: 'question',
            text: "Submarine?",
            yes: { kind: 'guess', name: "a submarine" },
            no: {
              kind: 'question',
              text: "Small personal craft (canoe, kayak, sailboat)?",
              yes: {
                kind: 'question',
                text: "Canoe?",
                yes: { kind: 'guess', name: "a canoe" },
                no: {
                  kind: 'question',
                  text: "Kayak?",
                  yes: { kind: 'guess', name: "a kayak" },
                  no: { kind: 'guess', name: "a sailboat" },
                },
              },
              no: {
                kind: 'question',
                text: "Cruise ship?",
                yes: { kind: 'guess', name: "a cruise ship" },
                no: {
                  kind: 'question',
                  text: "Ferry?",
                  yes: { kind: 'guess', name: "a ferry" },
                  no: {
                    kind: 'question',
                    text: "Yacht?",
                    yes: { kind: 'guess', name: "a yacht" },
                    no: {
                      kind: 'question',
                      text: "Large ship?",
                      yes: { kind: 'guess', name: "a ship" },
                      no: { kind: 'guess', name: "a boat" },
                    },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Is it mainly for roads (car, bus, truck, bike)?",
            yes: {
              kind: 'question',
              text: "Is it a car or SUV (not a bus or truck)?",
              yes: {
                kind: 'question',
                text: "Emergency or police vehicle?",
                yes: {
                  kind: 'question',
                  text: "Police car?",
                  yes: { kind: 'guess', name: "a police car" },
                  no: {
                    kind: 'question',
                    text: "Ambulance?",
                    yes: { kind: 'guess', name: "an ambulance" },
                    no: { kind: 'guess', name: "a fire truck" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Taxi?",
                  yes: { kind: 'guess', name: "a taxi" },
                  no: {
                    kind: 'question',
                    text: "SUV?",
                    yes: { kind: 'guess', name: "an SUV" },
                    no: { kind: 'guess', name: "a car" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a truck?",
                yes: {
                  kind: 'question',
                  text: "Pickup truck?",
                  yes: { kind: 'guess', name: "a pickup truck" },
                  no: {
                    kind: 'question',
                    text: "Semi / 18-wheeler?",
                    yes: { kind: 'guess', name: "a semi truck" },
                    no: { kind: 'guess', name: "a truck" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Bus?",
                  yes: {
                    kind: 'question',
                    text: "School bus?",
                    yes: { kind: 'guess', name: "a school bus" },
                    no: { kind: 'guess', name: "a bus" },
                  },
                  no: {
                    kind: 'question',
                    text: "Motorcycle?",
                    yes: { kind: 'guess', name: "a motorcycle" },
                    no: {
                      kind: 'question',
                      text: "Bicycle?",
                      yes: { kind: 'guess', name: "a bicycle" },
                      no: {
                        kind: 'question',
                        text: "Scooter?",
                        yes: { kind: 'guess', name: "a scooter" },
                        no: { kind: 'guess', name: "an RV" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Runs on rails?",
              yes: {
                kind: 'question',
                text: "Subway / metro?",
                yes: { kind: 'guess', name: "a subway train" },
                no: {
                  kind: 'question',
                  text: "Train?",
                  yes: { kind: 'guess', name: "a train" },
                  no: { kind: 'guess', name: "a tram" },
                },
              },
              no: {
                kind: 'question',
                text: "Farm or construction?",
                yes: {
                  kind: 'question',
                  text: "Tractor?",
                  yes: { kind: 'guess', name: "a tractor" },
                  no: {
                    kind: 'question',
                    text: "Bulldozer?",
                    yes: { kind: 'guess', name: "a bulldozer" },
                    no: { kind: 'guess', name: "a tank" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Skateboard?",
                  yes: { kind: 'guess', name: "a skateboard" },
                  no: { kind: 'guess', name: "a golf cart" },
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
            text: "In Europe?",
            yes: {
              kind: 'question',
              text: "Is it the Eiffel Tower?",
              yes: { kind: 'guess', name: "the Eiffel Tower" },
              no: {
                kind: 'question',
                text: "Is it Big Ben?",
                yes: { kind: 'guess', name: "Big Ben" },
                no: {
                  kind: 'question',
                  text: "Is it the Colosseum?",
                  yes: { kind: 'guess', name: "the Colosseum" },
                  no: { kind: 'guess', name: "Stonehenge" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"the Great Wall of China\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Mount Rushmore?",
                yes: { kind: 'guess', name: "Mount Rushmore" },
                no: {
                  kind: 'question',
                  text: "Is it Taj Mahal?",
                  yes: { kind: 'guess', name: "Taj Mahal" },
                  no: {
                    kind: 'question',
                    text: "Is it the Golden Gate Bridge?",
                    yes: { kind: 'guess', name: "the Golden Gate Bridge" },
                    no: { kind: 'guess', name: "the Grand Canyon" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it the Great Wall of China?",
                yes: { kind: 'guess', name: "the Great Wall of China" },
                no: {
                  kind: 'question',
                  text: "Is it the Pyramids of Giza?",
                  yes: { kind: 'guess', name: "the Pyramids of Giza" },
                  no: {
                    kind: 'question',
                    text: "Is it the Statue of Liberty?",
                    yes: { kind: 'guess', name: "the Statue of Liberty" },
                    no: { kind: 'guess', name: "the White House" },
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
              text: "Does its name come before \"a house\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a cabin?",
                yes: { kind: 'guess', name: "a cabin" },
                no: { kind: 'guess', name: "a castle" },
              },
              no: {
                kind: 'question',
                text: "Is it a house?",
                yes: { kind: 'guess', name: "a house" },
                no: {
                  kind: 'question',
                  text: "Is it a tent?",
                  yes: { kind: 'guess', name: "a tent" },
                  no: { kind: 'guess', name: "an apartment" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a library\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a farm\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a beach?",
                  yes: { kind: 'guess', name: "a beach" },
                  no: {
                    kind: 'question',
                    text: "Is it a church?",
                    yes: { kind: 'guess', name: "a church" },
                    no: { kind: 'guess', name: "a city" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a farm?",
                  yes: { kind: 'guess', name: "a farm" },
                  no: {
                    kind: 'question',
                    text: "Is it a forest?",
                    yes: { kind: 'guess', name: "a forest" },
                    no: {
                      kind: 'question',
                      text: "Is it a hospital?",
                      yes: { kind: 'guess', name: "a hospital" },
                      no: { kind: 'guess', name: "a hotel" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a school\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a library?",
                  yes: { kind: 'guess', name: "a library" },
                  no: {
                    kind: 'question',
                    text: "Is it a mountain?",
                    yes: { kind: 'guess', name: "a mountain" },
                    no: {
                      kind: 'question',
                      text: "Is it a park?",
                      yes: { kind: 'guess', name: "a park" },
                      no: { kind: 'guess', name: "a restaurant" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a school?",
                  yes: { kind: 'guess', name: "a school" },
                  no: {
                    kind: 'question',
                    text: "Is it a stadium?",
                    yes: { kind: 'guess', name: "a stadium" },
                    no: {
                      kind: 'question',
                      text: "Is it an airport?",
                      yes: { kind: 'guess', name: "an airport" },
                      no: { kind: 'guess', name: "an ocean" },
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
            text: "Does its name come before \"a desk\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a bookshelf\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a bed?",
                yes: { kind: 'guess', name: "a bed" },
                no: { kind: 'guess', name: "a blanket" },
              },
              no: {
                kind: 'question',
                text: "Is it a bookshelf?",
                yes: { kind: 'guess', name: "a bookshelf" },
                no: {
                  kind: 'question',
                  text: "Is it a chair?",
                  yes: { kind: 'guess', name: "a chair" },
                  no: { kind: 'guess', name: "a couch" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a mirror\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a desk?",
                yes: { kind: 'guess', name: "a desk" },
                no: { kind: 'guess', name: "a lamp" },
              },
              no: {
                kind: 'question',
                text: "Is it a mirror?",
                yes: { kind: 'guess', name: "a mirror" },
                no: {
                  kind: 'question',
                  text: "Is it a pillow?",
                  yes: { kind: 'guess', name: "a pillow" },
                  no: { kind: 'guess', name: "a table" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Sky or space?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Mars\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a cloud?",
                yes: { kind: 'guess', name: "a cloud" },
                no: {
                  kind: 'question',
                  text: "Is it a rainbow?",
                  yes: { kind: 'guess', name: "a rainbow" },
                  no: { kind: 'guess', name: "a star" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Mars?",
                yes: { kind: 'guess', name: "Mars" },
                no: {
                  kind: 'question',
                  text: "Is it Saturn?",
                  yes: { kind: 'guess', name: "Saturn" },
                  no: {
                    kind: 'question',
                    text: "Is it the Moon?",
                    yes: { kind: 'guess', name: "the Moon" },
                    no: { kind: 'guess', name: "the Sun" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a rain\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a mountain?",
                yes: { kind: 'guess', name: "a mountain" },
                no: { kind: 'guess', name: "a fire" },
              },
              no: {
                kind: 'question',
                text: "Is it a rain?",
                yes: { kind: 'guess', name: "a rain" },
                no: {
                  kind: 'question',
                  text: "Is it a snow?",
                  yes: { kind: 'guess', name: "a snow" },
                  no: { kind: 'guess', name: "the ocean" },
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
          text: "Alcoholic?",
          yes: {
            kind: 'question',
            text: "Beer?",
            yes: { kind: 'guess', name: "beer" },
            no: { kind: 'guess', name: "wine" },
          },
          no: {
            kind: 'question',
            text: "Hot drink?",
            yes: {
              kind: 'question',
              text: "Coffee?",
              yes: { kind: 'guess', name: "coffee" },
              no: {
                kind: 'question',
                text: "Tea?",
                yes: { kind: 'guess', name: "tea" },
                no: { kind: 'guess', name: "hot chocolate" },
              },
            },
            no: {
              kind: 'question',
              text: "Soda / soft drink?",
              yes: { kind: 'guess', name: "soda" },
              no: {
                kind: 'question',
                text: "Juice?",
                yes: { kind: 'guess', name: "juice" },
                no: {
                  kind: 'question',
                  text: "Milk?",
                  yes: { kind: 'guess', name: "milk" },
                  no: {
                    kind: 'question',
                    text: "Smoothie?",
                    yes: { kind: 'guess', name: "a smoothie" },
                    no: {
                      kind: 'question',
                      text: "Water?",
                      yes: { kind: 'guess', name: "water" },
                      no: { kind: 'guess', name: "lemonade" },
                    },
                  },
                },
              },
            },
          },
        },
        no: {
          kind: 'question',
          text: "Sweet dessert?",
          yes: {
            kind: 'question',
            text: "Frozen?",
            yes: {
              kind: 'question',
              text: "Ice cream?",
              yes: { kind: 'guess', name: "ice cream" },
              no: { kind: 'guess', name: "a popsicle" },
            },
            no: {
              kind: 'question',
              text: "Baked sweet?",
              yes: {
                kind: 'question',
                text: "Cookie?",
                yes: { kind: 'guess', name: "a cookie" },
                no: {
                  kind: 'question',
                  text: "Cake?",
                  yes: { kind: 'guess', name: "a cake" },
                  no: {
                    kind: 'question',
                    text: "Pie?",
                    yes: { kind: 'guess', name: "a pie" },
                    no: {
                      kind: 'question',
                      text: "Donut?",
                      yes: { kind: 'guess', name: "a donut" },
                      no: { kind: 'guess', name: "a brownie" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Candy / chocolate?",
                yes: {
                  kind: 'question',
                  text: "Chocolate bar?",
                  yes: { kind: 'guess', name: "a chocolate bar" },
                  no: { kind: 'guess', name: "candy" },
                },
                no: {
                  kind: 'question',
                  text: "Cupcake?",
                  yes: { kind: 'guess', name: "a cupcake" },
                  no: { kind: 'guess', name: "a muffin" },
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
                text: "Apple?",
                yes: { kind: 'guess', name: "an apple" },
                no: {
                  kind: 'question',
                  text: "Banana?",
                  yes: { kind: 'guess', name: "a banana" },
                  no: {
                    kind: 'question',
                    text: "Orange?",
                    yes: { kind: 'guess', name: "an orange" },
                    no: {
                      kind: 'question',
                      text: "Grape?",
                      yes: { kind: 'guess', name: "a grape" },
                      no: {
                        kind: 'question',
                        text: "Strawberry?",
                        yes: { kind: 'guess', name: "a strawberry" },
                        no: { kind: 'guess', name: "a watermelon" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Carrot?",
                yes: { kind: 'guess', name: "a carrot" },
                no: {
                  kind: 'question',
                  text: "Broccoli?",
                  yes: { kind: 'guess', name: "broccoli" },
                  no: {
                    kind: 'question',
                    text: "Potato?",
                    yes: { kind: 'guess', name: "a potato" },
                    no: { kind: 'guess', name: "an avocado" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Pizza, burger, taco, or similar takeout?",
              yes: {
                kind: 'question',
                text: "Pizza?",
                yes: { kind: 'guess', name: "a pizza" },
                no: {
                  kind: 'question',
                  text: "Hamburger / cheeseburger?",
                  yes: { kind: 'guess', name: "a hamburger" },
                  no: {
                    kind: 'question',
                    text: "Taco?",
                    yes: { kind: 'guess', name: "a taco" },
                    no: {
                      kind: 'question',
                      text: "Burrito?",
                      yes: { kind: 'guess', name: "a burrito" },
                      no: {
                        kind: 'question',
                        text: "Hot dog?",
                        yes: { kind: 'guess', name: "a hot dog" },
                        no: {
                          kind: 'question',
                          text: "French fries?",
                          yes: { kind: 'guess', name: "french fries" },
                          no: { kind: 'guess', name: "chicken nuggets" },
                        },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Sandwich, salad, or soup?",
                yes: {
                  kind: 'question',
                  text: "Sandwich?",
                  yes: { kind: 'guess', name: "a sandwich" },
                  no: {
                    kind: 'question',
                    text: "Salad?",
                    yes: { kind: 'guess', name: "a salad" },
                    no: { kind: 'guess', name: "soup" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Pasta or sushi?",
                  yes: {
                    kind: 'question',
                    text: "Pasta / spaghetti?",
                    yes: { kind: 'guess', name: "pasta" },
                    no: {
                      kind: 'question',
                      text: "Sushi?",
                      yes: { kind: 'guess', name: "sushi" },
                      no: { kind: 'guess', name: "a bagel" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Yogurt, cheese, or egg?",
                    yes: {
                      kind: 'question',
                      text: "Yogurt?",
                      yes: { kind: 'guess', name: "yogurt" },
                      no: {
                        kind: 'question',
                        text: "Cheese?",
                        yes: { kind: 'guess', name: "cheese" },
                        no: { kind: 'guess', name: "an egg" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Bread?",
                      yes: { kind: 'guess', name: "bread" },
                      no: {
                        kind: 'question',
                        text: "Popcorn?",
                        yes: { kind: 'guess', name: "popcorn" },
                        no: {
                          kind: 'question',
                          text: "Chips?",
                          yes: { kind: 'guess', name: "potato chips" },
                          no: { kind: 'guess', name: "cereal" },
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
        text: "Electronic?",
        yes: {
          kind: 'question',
          text: "Phone / smartphone?",
          yes: { kind: 'guess', name: "a smartphone" },
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
                no: { kind: 'guess', name: "a tablet" },
              },
            },
            no: {
              kind: 'question',
              text: "Headphones?",
              yes: { kind: 'guess', name: "headphones" },
              no: {
                kind: 'question',
                text: "Tablet?",
                yes: { kind: 'guess', name: "a tablet" },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a mouse\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a camera?",
                    yes: { kind: 'guess', name: "a camera" },
                    no: {
                      kind: 'question',
                      text: "Is it a charger?",
                      yes: { kind: 'guess', name: "a charger" },
                      no: {
                        kind: 'question',
                        text: "Is it a game controller?",
                        yes: { kind: 'guess', name: "a game controller" },
                        no: { kind: 'guess', name: "a keyboard" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a mouse?",
                    yes: { kind: 'guess', name: "a mouse" },
                    no: {
                      kind: 'question',
                      text: "Is it a remote control?",
                      yes: { kind: 'guess', name: "a remote control" },
                      no: { kind: 'guess', name: "a smartwatch" },
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
            text: "Pen?",
            yes: { kind: 'guess', name: "a pen" },
            no: {
              kind: 'question',
              text: "Pencil?",
              yes: { kind: 'guess', name: "a pencil" },
              no: {
                kind: 'question',
                text: "Does its name come before \"an eraser\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a backpack?",
                  yes: { kind: 'guess', name: "a backpack" },
                  no: { kind: 'guess', name: "a book" },
                },
                no: {
                  kind: 'question',
                  text: "Is it an eraser?",
                  yes: { kind: 'guess', name: "an eraser" },
                  no: {
                    kind: 'question',
                    text: "Is it a notebook?",
                    yes: { kind: 'guess', name: "a notebook" },
                    no: { kind: 'guess', name: "a scissors" },
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
              text: "Shoes?",
              yes: {
                kind: 'question',
                text: "Is it a sneakers?",
                yes: { kind: 'guess', name: "a sneakers" },
                no: {
                  kind: 'question',
                  text: "Is it a boots?",
                  yes: { kind: 'guess', name: "a boots" },
                  no: { kind: 'guess', name: "a sandals" },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a pants\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a hoodie\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a glasses?",
                    yes: { kind: 'guess', name: "a glasses" },
                    no: { kind: 'guess', name: "a hat" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a hoodie?",
                    yes: { kind: 'guess', name: "a hoodie" },
                    no: {
                      kind: 'question',
                      text: "Is it a jacket?",
                      yes: { kind: 'guess', name: "a jacket" },
                      no: { kind: 'guess', name: "a jeans" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a t-shirt\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a pants?",
                    yes: { kind: 'guess', name: "a pants" },
                    no: { kind: 'guess', name: "a socks" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a t-shirt?",
                    yes: { kind: 'guess', name: "a t-shirt" },
                    no: {
                      kind: 'question',
                      text: "Is it an umbrella?",
                      yes: { kind: 'guess', name: "an umbrella" },
                      no: { kind: 'guess', name: "a watch" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a knife\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a credit card\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a ball?",
                  yes: { kind: 'guess', name: "a ball" },
                  no: {
                    kind: 'question',
                    text: "Is it a candle?",
                    yes: { kind: 'guess', name: "a candle" },
                    no: { kind: 'guess', name: "a coin" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a credit card?",
                  yes: { kind: 'guess', name: "a credit card" },
                  no: {
                    kind: 'question',
                    text: "Is it a dice?",
                    yes: { kind: 'guess', name: "a dice" },
                    no: {
                      kind: 'question',
                      text: "Is it a fork?",
                      yes: { kind: 'guess', name: "a fork" },
                      no: { kind: 'guess', name: "a key" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a spoon\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a knife?",
                  yes: { kind: 'guess', name: "a knife" },
                  no: {
                    kind: 'question',
                    text: "Is it a mug?",
                    yes: { kind: 'guess', name: "a mug" },
                    no: {
                      kind: 'question',
                      text: "Is it a playing cards?",
                      yes: { kind: 'guess', name: "a playing cards" },
                      no: { kind: 'guess', name: "a soap" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a spoon?",
                  yes: { kind: 'guess', name: "a spoon" },
                  no: {
                    kind: 'question',
                    text: "Is it a teddy bear?",
                    yes: { kind: 'guess', name: "a teddy bear" },
                    no: {
                      kind: 'question',
                      text: "Is it a toothbrush?",
                      yes: { kind: 'guess', name: "a toothbrush" },
                      no: { kind: 'guess', name: "a water bottle" },
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
};

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
