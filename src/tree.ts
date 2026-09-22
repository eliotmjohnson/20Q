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
export const STORAGE_KEY = 'twentyq-tree-v4'
export const MAX_QUESTIONS = 20

/** Bump this whenever the seeded question order/content changes. */
export const SEED_VERSION = 4
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

/** Expanded seed (641 leaves, max depth 15). */
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
        text: "Are they from movies or TV?",
        yes: {
          kind: 'question',
          text: "Superhero or comic book?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"Iron Man\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Is it Batman?",
              yes: { kind: 'guess', name: "Batman" },
              no: {
                kind: 'question',
                text: "Is it Black Panther?",
                yes: { kind: 'guess', name: "Black Panther" },
                no: {
                  kind: 'question',
                  text: "Is it Captain America?",
                  yes: { kind: 'guess', name: "Captain America" },
                  no: {
                    kind: 'question',
                    text: "Is it Deadpool?",
                    yes: { kind: 'guess', name: "Deadpool" },
                    no: {
                      kind: 'question',
                      text: "Is it Harley Quinn?",
                      yes: { kind: 'guess', name: "Harley Quinn" },
                      no: { kind: 'guess', name: "Hulk" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"Superman\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Iron Man?",
                yes: { kind: 'guess', name: "Iron Man" },
                no: {
                  kind: 'question',
                  text: "Is it Joker?",
                  yes: { kind: 'guess', name: "Joker" },
                  no: { kind: 'guess', name: "Spider-Man" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Superman?",
                yes: { kind: 'guess', name: "Superman" },
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
          },
          no: {
            kind: 'question',
            text: "Star Wars or Star Trek?",
            yes: {
              kind: 'question',
              text: "Star Wars?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Luke Skywalker\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it Baby Yoda?",
                  yes: { kind: 'guess', name: "Baby Yoda" },
                  no: {
                    kind: 'question',
                    text: "Is it Chewbacca?",
                    yes: { kind: 'guess', name: "Chewbacca" },
                    no: {
                      kind: 'question',
                      text: "Is it Darth Vader?",
                      yes: { kind: 'guess', name: "Darth Vader" },
                      no: { kind: 'guess', name: "Han Solo" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Luke Skywalker?",
                  yes: { kind: 'guess', name: "Luke Skywalker" },
                  no: {
                    kind: 'question',
                    text: "Is it Princess Leia?",
                    yes: { kind: 'guess', name: "Princess Leia" },
                    no: {
                      kind: 'question',
                      text: "Is it R2-D2?",
                      yes: { kind: 'guess', name: "R2-D2" },
                      no: { kind: 'guess', name: "Yoda" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Captain Kirk?",
                yes: { kind: 'guess', name: "Captain Kirk" },
                no: {
                  kind: 'question',
                  text: "Is it Spock?",
                  yes: { kind: 'guess', name: "Spock" },
                  no: {
                    kind: 'question',
                    text: "Is it Jean-Luc Picard?",
                    yes: { kind: 'guess', name: "Jean-Luc Picard" },
                    no: {
                      kind: 'question',
                      text: "Is it Data?",
                      yes: { kind: 'guess', name: "Data" },
                      no: { kind: 'guess', name: "Uhura" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Animated / Disney / cartoon?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Mickey Mouse\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Buzz Lightyear\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Ash Ketchum?",
                    yes: { kind: 'guess', name: "Ash Ketchum" },
                    no: {
                      kind: 'question',
                      text: "Is it Bart Simpson?",
                      yes: { kind: 'guess', name: "Bart Simpson" },
                      no: { kind: 'guess', name: "Bugs Bunny" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Buzz Lightyear?",
                    yes: { kind: 'guess', name: "Buzz Lightyear" },
                    no: {
                      kind: 'question',
                      text: "Is it Donkey?",
                      yes: { kind: 'guess', name: "Donkey" },
                      no: {
                        kind: 'question',
                        text: "Is it Elsa?",
                        yes: { kind: 'guess', name: "Elsa" },
                        no: { kind: 'guess', name: "Homer Simpson" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Shrek\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Mickey Mouse?",
                    yes: { kind: 'guess', name: "Mickey Mouse" },
                    no: {
                      kind: 'question',
                      text: "Is it Patrick Star?",
                      yes: { kind: 'guess', name: "Patrick Star" },
                      no: {
                        kind: 'question',
                        text: "Is it Pikachu?",
                        yes: { kind: 'guess', name: "Pikachu" },
                        no: { kind: 'guess', name: "Scooby-Doo" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Shrek?",
                    yes: { kind: 'guess', name: "Shrek" },
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
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"Indiana Jones\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"Gandalf\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Arya Stark?",
                    yes: { kind: 'guess', name: "Arya Stark" },
                    no: {
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
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Gandalf?",
                    yes: { kind: 'guess', name: "Gandalf" },
                    no: {
                      kind: 'question',
                      text: "Is it Gollum?",
                      yes: { kind: 'guess', name: "Gollum" },
                      no: {
                        kind: 'question',
                        text: "Is it Harry Potter?",
                        yes: { kind: 'guess', name: "Harry Potter" },
                        no: { kind: 'guess', name: "Hermione Granger" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Katniss Everdeen\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Indiana Jones?",
                    yes: { kind: 'guess', name: "Indiana Jones" },
                    no: {
                      kind: 'question',
                      text: "Is it Jack Sparrow?",
                      yes: { kind: 'guess', name: "Jack Sparrow" },
                      no: {
                        kind: 'question',
                        text: "Is it James Bond?",
                        yes: { kind: 'guess', name: "James Bond" },
                        no: { kind: 'guess', name: "Jon Snow" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Katniss Everdeen?",
                    yes: { kind: 'guess', name: "Katniss Everdeen" },
                    no: {
                      kind: 'question',
                      text: "Is it Ron Weasley?",
                      yes: { kind: 'guess', name: "Ron Weasley" },
                      no: {
                        kind: 'question',
                        text: "Is it Sherlock Holmes?",
                        yes: { kind: 'guess', name: "Sherlock Holmes" },
                        no: { kind: 'guess', name: "Watson" },
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
          text: "Video game character?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"Mario\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Kratos\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Bowser?",
                yes: { kind: 'guess', name: "Bowser" },
                no: {
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
              },
              no: {
                kind: 'question',
                text: "Is it Kratos?",
                yes: { kind: 'guess', name: "Kratos" },
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
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"Samus\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Mario?",
                yes: { kind: 'guess', name: "Mario" },
                no: {
                  kind: 'question',
                  text: "Is it Master Chief?",
                  yes: { kind: 'guess', name: "Master Chief" },
                  no: {
                    kind: 'question',
                    text: "Is it Pac-Man?",
                    yes: { kind: 'guess', name: "Pac-Man" },
                    no: { kind: 'guess', name: "Princess Peach" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Samus?",
                yes: { kind: 'guess', name: "Samus" },
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
            text: "Does its name come before \"Merlin\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Is it Alice in Wonderland?",
              yes: { kind: 'guess', name: "Alice in Wonderland" },
              no: {
                kind: 'question',
                text: "Is it Cinderella?",
                yes: { kind: 'guess', name: "Cinderella" },
                no: {
                  kind: 'question',
                  text: "Is it Dracula?",
                  yes: { kind: 'guess', name: "Dracula" },
                  no: {
                    kind: 'question',
                    text: "Is it Frankenstein's monster?",
                    yes: { kind: 'guess', name: "Frankenstein's monster" },
                    no: { kind: 'guess', name: "King Arthur" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it Merlin?",
              yes: { kind: 'guess', name: "Merlin" },
              no: {
                kind: 'question',
                text: "Is it Peter Pan?",
                yes: { kind: 'guess', name: "Peter Pan" },
                no: {
                  kind: 'question',
                  text: "Is it Robin Hood?",
                  yes: { kind: 'guess', name: "Robin Hood" },
                  no: {
                    kind: 'question',
                    text: "Is it Snow White?",
                    yes: { kind: 'guess', name: "Snow White" },
                    no: { kind: 'guess', name: "Tinker Bell" },
                  },
                },
              },
            },
          },
        },
      },
      no: {
        kind: 'question',
        text: "Known mainly for music?",
        yes: {
          kind: 'question',
          text: "Mostly active after 2000?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"Dua Lipa\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Beyoncé\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Adele?",
                yes: { kind: 'guess', name: "Adele" },
                no: {
                  kind: 'question',
                  text: "Is it Ariana Grande?",
                  yes: { kind: 'guess', name: "Ariana Grande" },
                  no: { kind: 'guess', name: "Bad Bunny" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Beyoncé?",
                yes: { kind: 'guess', name: "Beyoncé" },
                no: {
                  kind: 'question',
                  text: "Is it Billie Eilish?",
                  yes: { kind: 'guess', name: "Billie Eilish" },
                  no: {
                    kind: 'question',
                    text: "Is it Bruno Mars?",
                    yes: { kind: 'guess', name: "Bruno Mars" },
                    no: { kind: 'guess', name: "Drake" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"Lady Gaga\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Dua Lipa?",
                yes: { kind: 'guess', name: "Dua Lipa" },
                no: {
                  kind: 'question',
                  text: "Is it Ed Sheeran?",
                  yes: { kind: 'guess', name: "Ed Sheeran" },
                  no: { kind: 'guess', name: "Justin Bieber" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Lady Gaga?",
                yes: { kind: 'guess', name: "Lady Gaga" },
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
          },
          no: {
            kind: 'question',
            text: "Does its name come before \"Johnny Cash\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Elton John\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Aretha Franklin?",
                yes: { kind: 'guess', name: "Aretha Franklin" },
                no: {
                  kind: 'question',
                  text: "Is it Bob Dylan?",
                  yes: { kind: 'guess', name: "Bob Dylan" },
                  no: { kind: 'guess', name: "David Bowie" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Elton John?",
                yes: { kind: 'guess', name: "Elton John" },
                no: {
                  kind: 'question',
                  text: "Is it Elvis Presley?",
                  yes: { kind: 'guess', name: "Elvis Presley" },
                  no: {
                    kind: 'question',
                    text: "Is it Freddie Mercury?",
                    yes: { kind: 'guess', name: "Freddie Mercury" },
                    no: { kind: 'guess', name: "John Lennon" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"Paul McCartney\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Johnny Cash?",
                yes: { kind: 'guess', name: "Johnny Cash" },
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
                  no: {
                    kind: 'question',
                    text: "Is it Stevie Wonder?",
                    yes: { kind: 'guess', name: "Stevie Wonder" },
                    no: { kind: 'guess', name: "Whitney Houston" },
                  },
                },
              },
            },
          },
        },
        no: {
          kind: 'question',
          text: "Historical figure (famous before ~1990)?",
          yes: {
            kind: 'question',
            text: "US president?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"George Washington\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Abraham Lincoln?",
                yes: { kind: 'guess', name: "Abraham Lincoln" },
                no: {
                  kind: 'question',
                  text: "Is it Barack Obama?",
                  yes: { kind: 'guess', name: "Barack Obama" },
                  no: {
                    kind: 'question',
                    text: "Is it Bill Clinton?",
                    yes: { kind: 'guess', name: "Bill Clinton" },
                    no: {
                      kind: 'question',
                      text: "Is it Donald Trump?",
                      yes: { kind: 'guess', name: "Donald Trump" },
                      no: {
                        kind: 'question',
                        text: "Is it Franklin D. Roosevelt?",
                        yes: { kind: 'guess', name: "Franklin D. Roosevelt" },
                        no: { kind: 'guess', name: "George W. Bush" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it George Washington?",
                yes: { kind: 'guess', name: "George Washington" },
                no: {
                  kind: 'question',
                  text: "Is it Joe Biden?",
                  yes: { kind: 'guess', name: "Joe Biden" },
                  no: {
                    kind: 'question',
                    text: "Is it John F. Kennedy?",
                    yes: { kind: 'guess', name: "John F. Kennedy" },
                    no: {
                      kind: 'question',
                      text: "Is it Ronald Reagan?",
                      yes: { kind: 'guess', name: "Ronald Reagan" },
                      no: {
                        kind: 'question',
                        text: "Is it Theodore Roosevelt?",
                        yes: { kind: 'guess', name: "Theodore Roosevelt" },
                        no: { kind: 'guess', name: "Thomas Jefferson" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Scientist or inventor?",
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
                      no: {
                        kind: 'question',
                        text: "Is it Charles Darwin?",
                        yes: { kind: 'guess', name: "Charles Darwin" },
                        no: { kind: 'guess', name: "Galileo" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Isaac Newton?",
                  yes: { kind: 'guess', name: "Isaac Newton" },
                  no: {
                    kind: 'question',
                    text: "Is it Leonardo da Vinci?",
                    yes: { kind: 'guess', name: "Leonardo da Vinci" },
                    no: {
                      kind: 'question',
                      text: "Is it Marie Curie?",
                      yes: { kind: 'guess', name: "Marie Curie" },
                      no: {
                        kind: 'question',
                        text: "Is it Nikola Tesla?",
                        yes: { kind: 'guess', name: "Nikola Tesla" },
                        no: {
                          kind: 'question',
                          text: "Is it Stephen Hawking?",
                          yes: { kind: 'guess', name: "Stephen Hawking" },
                          no: { kind: 'guess', name: "Thomas Edison" },
                        },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"Mahatma Gandhi\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it Alexander the Great?",
                  yes: { kind: 'guess', name: "Alexander the Great" },
                  no: {
                    kind: 'question',
                    text: "Is it Anne Frank?",
                    yes: { kind: 'guess', name: "Anne Frank" },
                    no: {
                      kind: 'question',
                      text: "Is it Cleopatra?",
                      yes: { kind: 'guess', name: "Cleopatra" },
                      no: {
                        kind: 'question',
                        text: "Is it Helen Keller?",
                        yes: { kind: 'guess', name: "Helen Keller" },
                        no: {
                          kind: 'question',
                          text: "Is it Joan of Arc?",
                          yes: { kind: 'guess', name: "Joan of Arc" },
                          no: { kind: 'guess', name: "Julius Caesar" },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"Nelson Mandela\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it Mahatma Gandhi?",
                    yes: { kind: 'guess', name: "Mahatma Gandhi" },
                    no: {
                      kind: 'question',
                      text: "Is it Martin Luther King Jr.?",
                      yes: { kind: 'guess', name: "Martin Luther King Jr." },
                      no: { kind: 'guess', name: "Napoleon" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Nelson Mandela?",
                    yes: { kind: 'guess', name: "Nelson Mandela" },
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
          },
          no: {
            kind: 'question',
            text: "Athlete?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"Muhammad Ali\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Babe Ruth?",
                yes: { kind: 'guess', name: "Babe Ruth" },
                no: {
                  kind: 'question',
                  text: "Is it Cristiano Ronaldo?",
                  yes: { kind: 'guess', name: "Cristiano Ronaldo" },
                  no: {
                    kind: 'question',
                    text: "Is it LeBron James?",
                    yes: { kind: 'guess', name: "LeBron James" },
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
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"Simone Biles\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it Muhammad Ali?",
                  yes: { kind: 'guess', name: "Muhammad Ali" },
                  no: {
                    kind: 'question',
                    text: "Is it Serena Williams?",
                    yes: { kind: 'guess', name: "Serena Williams" },
                    no: { kind: 'guess', name: "Shohei Ohtani" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Simone Biles?",
                  yes: { kind: 'guess', name: "Simone Biles" },
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
            },
            no: {
              kind: 'question',
              text: "Actor or entertainer?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"Meryl Streep\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it Audrey Hepburn?",
                  yes: { kind: 'guess', name: "Audrey Hepburn" },
                  no: {
                    kind: 'question',
                    text: "Is it Dwayne Johnson?",
                    yes: { kind: 'guess', name: "Dwayne Johnson" },
                    no: {
                      kind: 'question',
                      text: "Is it Jennifer Lawrence?",
                      yes: { kind: 'guess', name: "Jennifer Lawrence" },
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
                      text: "Is it Scarlett Johansson?",
                      yes: { kind: 'guess', name: "Scarlett Johansson" },
                      no: {
                        kind: 'question',
                        text: "Is it Tom Hanks?",
                        yes: { kind: 'guess', name: "Tom Hanks" },
                        no: { kind: 'guess', name: "Will Smith" },
                      },
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
                      no: {
                        kind: 'question',
                        text: "Is it Jeff Bezos?",
                        yes: { kind: 'guess', name: "Jeff Bezos" },
                        no: { kind: 'guess', name: "Kim Kardashian" },
                      },
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
                      no: {
                        kind: 'question',
                        text: "Is it Pope Francis?",
                        yes: { kind: 'guess', name: "Pope Francis" },
                        no: { kind: 'guess', name: "Steve Jobs" },
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
              text: "Is it a beluga?",
              yes: { kind: 'guess', name: "a beluga" },
              no: {
                kind: 'question',
                text: "Is it a dolphin?",
                yes: { kind: 'guess', name: "a dolphin" },
                no: {
                  kind: 'question',
                  text: "Is it a manatee?",
                  yes: { kind: 'guess', name: "a manatee" },
                  no: {
                    kind: 'question',
                    text: "Is it a narwhal?",
                    yes: { kind: 'guess', name: "a narwhal" },
                    no: { kind: 'guess', name: "an orca" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it an otter?",
              yes: { kind: 'guess', name: "an otter" },
              no: {
                kind: 'question',
                text: "Is it a sea lion?",
                yes: { kind: 'guess', name: "a sea lion" },
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
          },
          no: {
            kind: 'question',
            text: "Has a hard shell?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a sea turtle\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a clam?",
                yes: { kind: 'guess', name: "a clam" },
                no: {
                  kind: 'question',
                  text: "Is it a crab?",
                  yes: { kind: 'guess', name: "a crab" },
                  no: {
                    kind: 'question',
                    text: "Is it a lobster?",
                    yes: { kind: 'guess', name: "a lobster" },
                    no: { kind: 'guess', name: "an oyster" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a sea turtle?",
                yes: { kind: 'guess', name: "a sea turtle" },
                no: {
                  kind: 'question',
                  text: "Is it a shrimp?",
                  yes: { kind: 'guess', name: "a shrimp" },
                  no: {
                    kind: 'question',
                    text: "Is it a snail?",
                    yes: { kind: 'guess', name: "a snail" },
                    no: {
                      kind: 'question',
                      text: "Is it a tortoise?",
                      yes: { kind: 'guess', name: "a tortoise" },
                      no: { kind: 'guess', name: "a turtle" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Shark or ray?",
              yes: {
                kind: 'question',
                text: "Is it a great white shark?",
                yes: { kind: 'guess', name: "a great white shark" },
                no: {
                  kind: 'question',
                  text: "Is it a hammerhead shark?",
                  yes: { kind: 'guess', name: "a hammerhead shark" },
                  no: {
                    kind: 'question',
                    text: "Is it a stingray?",
                    yes: { kind: 'guess', name: "a stingray" },
                    no: {
                      kind: 'question',
                      text: "Is it a manta ray?",
                      yes: { kind: 'guess', name: "a manta ray" },
                      no: { kind: 'guess', name: "an eel" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a piranha\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a cod\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a bass?",
                    yes: { kind: 'guess', name: "a bass" },
                    no: {
                      kind: 'question',
                      text: "Is it a catfish?",
                      yes: { kind: 'guess', name: "a catfish" },
                      no: { kind: 'guess', name: "a clownfish" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a cod?",
                    yes: { kind: 'guess', name: "a cod" },
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
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a starfish\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a piranha?",
                    yes: { kind: 'guess', name: "a piranha" },
                    no: {
                      kind: 'question',
                      text: "Is it a salmon?",
                      yes: { kind: 'guess', name: "a salmon" },
                      no: {
                        kind: 'question',
                        text: "Is it a seahorse?",
                        yes: { kind: 'guess', name: "a seahorse" },
                        no: { kind: 'guess', name: "a squid" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a starfish?",
                    yes: { kind: 'guess', name: "a starfish" },
                    no: {
                      kind: 'question',
                      text: "Is it a swordfish?",
                      yes: { kind: 'guess', name: "a swordfish" },
                      no: {
                        kind: 'question',
                        text: "Is it a trout?",
                        yes: { kind: 'guess', name: "a trout" },
                        no: { kind: 'guess', name: "a tuna" },
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
          text: "Can it fly (or glide)?",
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
                    no: {
                      kind: 'question',
                      text: "Is it a falcon?",
                      yes: { kind: 'guess', name: "a falcon" },
                      no: { kind: 'guess', name: "a vulture" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Farm or food bird?",
                yes: {
                  kind: 'question',
                  text: "Is it a chicken?",
                  yes: { kind: 'guess', name: "a chicken" },
                  no: {
                    kind: 'question',
                    text: "Is it a rooster?",
                    yes: { kind: 'guess', name: "a rooster" },
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
                },
                no: {
                  kind: 'question',
                  text: "Pet or talking bird?",
                  yes: {
                    kind: 'question',
                    text: "Is it a parrot?",
                    yes: { kind: 'guess', name: "a parrot" },
                    no: {
                      kind: 'question',
                      text: "Is it a budgie?",
                      yes: { kind: 'guess', name: "a budgie" },
                      no: {
                        kind: 'question',
                        text: "Is it a canary?",
                        yes: { kind: 'guess', name: "a canary" },
                        no: {
                          kind: 'question',
                          text: "Is it a cockatiel?",
                          yes: { kind: 'guess', name: "a cockatiel" },
                          no: { kind: 'guess', name: "a macaw" },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a penguin\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"a hummingbird\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a blue jay?",
                        yes: { kind: 'guess', name: "a blue jay" },
                        no: {
                          kind: 'question',
                          text: "Is it a cardinal?",
                          yes: { kind: 'guess', name: "a cardinal" },
                          no: {
                            kind: 'question',
                            text: "Is it a crow?",
                            yes: { kind: 'guess', name: "a crow" },
                            no: { kind: 'guess', name: "a flamingo" },
                          },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a hummingbird?",
                        yes: { kind: 'guess', name: "a hummingbird" },
                        no: {
                          kind: 'question',
                          text: "Is it an ostrich?",
                          yes: { kind: 'guess', name: "an ostrich" },
                          no: {
                            kind: 'question',
                            text: "Is it a peacock?",
                            yes: { kind: 'guess', name: "a peacock" },
                            no: { kind: 'guess', name: "a pelican" },
                          },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a sparrow\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Is it a penguin?",
                        yes: { kind: 'guess', name: "a penguin" },
                        no: {
                          kind: 'question',
                          text: "Is it a pigeon?",
                          yes: { kind: 'guess', name: "a pigeon" },
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
                        text: "Is it a sparrow?",
                        yes: { kind: 'guess', name: "a sparrow" },
                        no: {
                          kind: 'question',
                          text: "Is it a swan?",
                          yes: { kind: 'guess', name: "a swan" },
                          no: {
                            kind: 'question',
                            text: "Is it a toucan?",
                            yes: { kind: 'guess', name: "a toucan" },
                            no: { kind: 'guess', name: "a woodpecker" },
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
              text: "Does its name come before \"a grasshopper\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a bat?",
                yes: { kind: 'guess', name: "a bat" },
                no: {
                  kind: 'question',
                  text: "Is it a bee?",
                  yes: { kind: 'guess', name: "a bee" },
                  no: {
                    kind: 'question',
                    text: "Is it a butterfly?",
                    yes: { kind: 'guess', name: "a butterfly" },
                    no: {
                      kind: 'question',
                      text: "Is it a cricket?",
                      yes: { kind: 'guess', name: "a cricket" },
                      no: {
                        kind: 'question',
                        text: "Is it a dragonfly?",
                        yes: { kind: 'guess', name: "a dragonfly" },
                        no: { kind: 'guess', name: "a firefly" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a grasshopper?",
                yes: { kind: 'guess', name: "a grasshopper" },
                no: {
                  kind: 'question',
                  text: "Is it a housefly?",
                  yes: { kind: 'guess', name: "a housefly" },
                  no: {
                    kind: 'question',
                    text: "Is it a ladybug?",
                    yes: { kind: 'guess', name: "a ladybug" },
                    no: {
                      kind: 'question',
                      text: "Is it a mosquito?",
                      yes: { kind: 'guess', name: "a mosquito" },
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
            },
          },
          no: {
            kind: 'question',
            text: "Common household pet?",
            yes: {
              kind: 'question',
              text: "Cat or dog?",
              yes: {
                kind: 'question',
                text: "Cat?",
                yes: { kind: 'guess', name: "a cat" },
                no: { kind: 'guess', name: "a dog" },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a hamster\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a ferret?",
                  yes: { kind: 'guess', name: "a ferret" },
                  no: {
                    kind: 'question',
                    text: "Is it a gerbil?",
                    yes: { kind: 'guess', name: "a gerbil" },
                    no: { kind: 'guess', name: "a guinea pig" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a hamster?",
                  yes: { kind: 'guess', name: "a hamster" },
                  no: {
                    kind: 'question',
                    text: "Is it a mouse?",
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
            no: {
              kind: 'question',
              text: "Farm animal?",
              yes: {
                kind: 'question',
                text: "Cow, pig, or horse?",
                yes: {
                  kind: 'question',
                  text: "Cow?",
                  yes: { kind: 'guess', name: "a cow" },
                  no: {
                    kind: 'question',
                    text: "Pig?",
                    yes: { kind: 'guess', name: "a pig" },
                    no: { kind: 'guess', name: "a horse" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a sheep?",
                  yes: { kind: 'guess', name: "a sheep" },
                  no: {
                    kind: 'question',
                    text: "Is it a goat?",
                    yes: { kind: 'guess', name: "a goat" },
                    no: {
                      kind: 'question',
                      text: "Is it a donkey?",
                      yes: { kind: 'guess', name: "a donkey" },
                      no: {
                        kind: 'question',
                        text: "Is it a llama?",
                        yes: { kind: 'guess', name: "a llama" },
                        no: { kind: 'guess', name: "an alpaca" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Big wild cat?",
                yes: {
                  kind: 'question',
                  text: "Has a mane?",
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
                        no: {
                          kind: 'question',
                          text: "Is it a jaguar?",
                          yes: { kind: 'guess', name: "a jaguar" },
                          no: {
                            kind: 'question',
                            text: "Is it a cougar?",
                            yes: { kind: 'guess', name: "a cougar" },
                            no: { kind: 'guess', name: "a lynx" },
                          },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Elephant, giraffe, or bear?",
                  yes: {
                    kind: 'question',
                    text: "Elephant?",
                    yes: { kind: 'guess', name: "an elephant" },
                    no: {
                      kind: 'question',
                      text: "Giraffe?",
                      yes: { kind: 'guess', name: "a giraffe" },
                      no: {
                        kind: 'question',
                        text: "Is it a bear?",
                        yes: { kind: 'guess', name: "a bear" },
                        no: {
                          kind: 'question',
                          text: "Is it a polar bear?",
                          yes: { kind: 'guess', name: "a polar bear" },
                          no: {
                            kind: 'question',
                            text: "Is it a grizzly bear?",
                            yes: { kind: 'guess', name: "a grizzly bear" },
                            no: { kind: 'guess', name: "a panda" },
                          },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name come before \"a lizard\" alphabetically?",
                    yes: {
                      kind: 'question',
                      text: "Does its name come before \"an elk\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a camel\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it an alligator?",
                          yes: { kind: 'guess', name: "an alligator" },
                          no: {
                            kind: 'question',
                            text: "Is it an ant?",
                            yes: { kind: 'guess', name: "an ant" },
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
                          text: "Is it a camel?",
                          yes: { kind: 'guess', name: "a camel" },
                          no: {
                            kind: 'question',
                            text: "Is it a chimpanzee?",
                            yes: { kind: 'guess', name: "a chimpanzee" },
                            no: {
                              kind: 'question',
                              text: "Is it a crocodile?",
                              yes: { kind: 'guess', name: "a crocodile" },
                              no: { kind: 'guess', name: "a deer" },
                            },
                          },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a hippo\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it an elk?",
                          yes: { kind: 'guess', name: "an elk" },
                          no: {
                            kind: 'question',
                            text: "Is it a fox?",
                            yes: { kind: 'guess', name: "a fox" },
                            no: {
                              kind: 'question',
                              text: "Is it a frog?",
                              yes: { kind: 'guess', name: "a frog" },
                              no: { kind: 'guess', name: "a gorilla" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a hippo?",
                          yes: { kind: 'guess', name: "a hippo" },
                          no: {
                            kind: 'question',
                            text: "Is it an iguana?",
                            yes: { kind: 'guess', name: "an iguana" },
                            no: {
                              kind: 'question',
                              text: "Is it a kangaroo?",
                              yes: { kind: 'guess', name: "a kangaroo" },
                              no: { kind: 'guess', name: "a koala" },
                            },
                          },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Does its name come before \"a sloth\" alphabetically?",
                      yes: {
                        kind: 'question',
                        text: "Does its name come before \"a raccoon\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it a lizard?",
                          yes: { kind: 'guess', name: "a lizard" },
                          no: {
                            kind: 'question',
                            text: "Is it a monkey?",
                            yes: { kind: 'guess', name: "a monkey" },
                            no: {
                              kind: 'question',
                              text: "Is it a moose?",
                              yes: { kind: 'guess', name: "a moose" },
                              no: { kind: 'guess', name: "a porcupine" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a raccoon?",
                          yes: { kind: 'guess', name: "a raccoon" },
                          no: {
                            kind: 'question',
                            text: "Is it a rhino?",
                            yes: { kind: 'guess', name: "a rhino" },
                            no: {
                              kind: 'question',
                              text: "Is it a scorpion?",
                              yes: { kind: 'guess', name: "a scorpion" },
                              no: { kind: 'guess', name: "a skunk" },
                            },
                          },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Does its name come before \"a toad\" alphabetically?",
                        yes: {
                          kind: 'question',
                          text: "Is it a sloth?",
                          yes: { kind: 'guess', name: "a sloth" },
                          no: {
                            kind: 'question',
                            text: "Is it a snake?",
                            yes: { kind: 'guess', name: "a snake" },
                            no: {
                              kind: 'question',
                              text: "Is it a spider?",
                              yes: { kind: 'guess', name: "a spider" },
                              no: { kind: 'guess', name: "a squirrel" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a toad?",
                          yes: { kind: 'guess', name: "a toad" },
                          no: {
                            kind: 'question',
                            text: "Is it a wolf?",
                            yes: { kind: 'guess', name: "a wolf" },
                            no: {
                              kind: 'question',
                              text: "Is it a worm?",
                              yes: { kind: 'guess', name: "a worm" },
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
            text: "Does its name come before \"an oak tree\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Is it an apple tree?",
              yes: { kind: 'guess', name: "an apple tree" },
              no: {
                kind: 'question',
                text: "Is it a bamboo?",
                yes: { kind: 'guess', name: "a bamboo" },
                no: {
                  kind: 'question',
                  text: "Is it a birch?",
                  yes: { kind: 'guess', name: "a birch" },
                  no: {
                    kind: 'question',
                    text: "Is it a cedar?",
                    yes: { kind: 'guess', name: "a cedar" },
                    no: {
                      kind: 'question',
                      text: "Is it a cherry tree?",
                      yes: { kind: 'guess', name: "a cherry tree" },
                      no: { kind: 'guess', name: "a maple tree" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it an oak tree?",
              yes: { kind: 'guess', name: "an oak tree" },
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
                    no: {
                      kind: 'question',
                      text: "Is it a spruce?",
                      yes: { kind: 'guess', name: "a spruce" },
                      no: { kind: 'guess', name: "a willow" },
                    },
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
              text: "Does its name come before \"a lily\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a daffodil?",
                yes: { kind: 'guess', name: "a daffodil" },
                no: {
                  kind: 'question',
                  text: "Is it a daisy?",
                  yes: { kind: 'guess', name: "a daisy" },
                  no: {
                    kind: 'question',
                    text: "Is it a dandelion?",
                    yes: { kind: 'guess', name: "a dandelion" },
                    no: {
                      kind: 'question',
                      text: "Is it a hibiscus?",
                      yes: { kind: 'guess', name: "a hibiscus" },
                      no: { kind: 'guess', name: "a lavender" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a lily?",
                yes: { kind: 'guess', name: "a lily" },
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
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a moss\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a cactus?",
                yes: { kind: 'guess', name: "a cactus" },
                no: {
                  kind: 'question',
                  text: "Is it a corn stalk?",
                  yes: { kind: 'guess', name: "a corn stalk" },
                  no: {
                    kind: 'question',
                    text: "Is it a fern?",
                    yes: { kind: 'guess', name: "a fern" },
                    no: {
                      kind: 'question',
                      text: "Is it a grass?",
                      yes: { kind: 'guess', name: "a grass" },
                      no: { kind: 'guess', name: "an ivy" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a moss?",
                yes: { kind: 'guess', name: "a moss" },
                no: {
                  kind: 'question',
                  text: "Is it a mushroom?",
                  yes: { kind: 'guess', name: "a mushroom" },
                  no: {
                    kind: 'question',
                    text: "Is it a strawberry plant?",
                    yes: { kind: 'guess', name: "a strawberry plant" },
                    no: {
                      kind: 'question',
                      text: "Is it a tomato plant?",
                      yes: { kind: 'guess', name: "a tomato plant" },
                      no: {
                        kind: 'question',
                        text: "Is it a venus flytrap?",
                        yes: { kind: 'guess', name: "a venus flytrap" },
                        no: { kind: 'guess', name: "a wheat" },
                      },
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
    text: "Is it bigger than a breadbox?",
    yes: {
      kind: 'question',
      text: "Vehicle?",
      yes: {
        kind: 'question',
        text: "Flies?",
        yes: {
          kind: 'question',
          text: "Does its name come before \"a hot air balloon\" alphabetically?",
          yes: {
            kind: 'question',
            text: "Is it an airplane?",
            yes: { kind: 'guess', name: "an airplane" },
            no: {
              kind: 'question',
              text: "Is it a drone?",
              yes: { kind: 'guess', name: "a drone" },
              no: {
                kind: 'question',
                text: "Is it a fighter jet?",
                yes: { kind: 'guess', name: "a fighter jet" },
                no: { kind: 'guess', name: "a helicopter" },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Is it a hot air balloon?",
            yes: { kind: 'guess', name: "a hot air balloon" },
            no: {
              kind: 'question',
              text: "Is it a jet?",
              yes: { kind: 'guess', name: "a jet" },
              no: {
                kind: 'question',
                text: "Is it a rocket?",
                yes: { kind: 'guess', name: "a rocket" },
                no: { kind: 'guess', name: "a spaceship" },
              },
            },
          },
        },
        no: {
          kind: 'question',
          text: "Goes on water?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"a kayak\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Is it a boat?",
              yes: { kind: 'guess', name: "a boat" },
              no: {
                kind: 'question',
                text: "Is it a canoe?",
                yes: { kind: 'guess', name: "a canoe" },
                no: {
                  kind: 'question',
                  text: "Is it a cruise ship?",
                  yes: { kind: 'guess', name: "a cruise ship" },
                  no: { kind: 'guess', name: "a ferry" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a kayak?",
              yes: { kind: 'guess', name: "a kayak" },
              no: {
                kind: 'question',
                text: "Is it a sailboat?",
                yes: { kind: 'guess', name: "a sailboat" },
                no: {
                  kind: 'question',
                  text: "Is it a ship?",
                  yes: { kind: 'guess', name: "a ship" },
                  no: {
                    kind: 'question',
                    text: "Is it a submarine?",
                    yes: { kind: 'guess', name: "a submarine" },
                    no: { kind: 'guess', name: "a yacht" },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Does its name come before \"a school bus\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a car\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it an ambulance?",
                yes: { kind: 'guess', name: "an ambulance" },
                no: {
                  kind: 'question',
                  text: "Is it a bicycle?",
                  yes: { kind: 'guess', name: "a bicycle" },
                  no: {
                    kind: 'question',
                    text: "Is it a bulldozer?",
                    yes: { kind: 'guess', name: "a bulldozer" },
                    no: { kind: 'guess', name: "a bus" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a car?",
                yes: { kind: 'guess', name: "a car" },
                no: {
                  kind: 'question',
                  text: "Is it a fire truck?",
                  yes: { kind: 'guess', name: "a fire truck" },
                  no: {
                    kind: 'question',
                    text: "Is it a motorcycle?",
                    yes: { kind: 'guess', name: "a motorcycle" },
                    no: {
                      kind: 'question',
                      text: "Is it a police car?",
                      yes: { kind: 'guess', name: "a police car" },
                      no: { kind: 'guess', name: "RV" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a tank\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a school bus?",
                yes: { kind: 'guess', name: "a school bus" },
                no: {
                  kind: 'question',
                  text: "Is it a scooter?",
                  yes: { kind: 'guess', name: "a scooter" },
                  no: {
                    kind: 'question',
                    text: "Is it a skateboard?",
                    yes: { kind: 'guess', name: "a skateboard" },
                    no: {
                      kind: 'question',
                      text: "Is it a subway train?",
                      yes: { kind: 'guess', name: "a subway train" },
                      no: { kind: 'guess', name: "SUV" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a tank?",
                yes: { kind: 'guess', name: "a tank" },
                no: {
                  kind: 'question',
                  text: "Is it a taxi?",
                  yes: { kind: 'guess', name: "a taxi" },
                  no: {
                    kind: 'question',
                    text: "Is it a tractor?",
                    yes: { kind: 'guess', name: "a tractor" },
                    no: {
                      kind: 'question',
                      text: "Is it a train?",
                      yes: { kind: 'guess', name: "a train" },
                      no: { kind: 'guess', name: "a truck" },
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
            text: "In Europe?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"the Colosseum\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Big Ben?",
                yes: { kind: 'guess', name: "Big Ben" },
                no: {
                  kind: 'question',
                  text: "Is it Buckingham Palace?",
                  yes: { kind: 'guess', name: "Buckingham Palace" },
                  no: { kind: 'guess', name: "Stonehenge" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it the Colosseum?",
                yes: { kind: 'guess', name: "the Colosseum" },
                no: {
                  kind: 'question',
                  text: "Is it the Eiffel Tower?",
                  yes: { kind: 'guess', name: "the Eiffel Tower" },
                  no: {
                    kind: 'question',
                    text: "Is it the Leaning Tower of Pisa?",
                    yes: { kind: 'guess', name: "the Leaning Tower of Pisa" },
                    no: { kind: 'guess', name: "the Louvre" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"the Golden Gate Bridge\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it Christ the Redeemer?",
                yes: { kind: 'guess', name: "Christ the Redeemer" },
                no: {
                  kind: 'question',
                  text: "Is it Machu Picchu?",
                  yes: { kind: 'guess', name: "Machu Picchu" },
                  no: {
                    kind: 'question',
                    text: "Is it Mount Rushmore?",
                    yes: { kind: 'guess', name: "Mount Rushmore" },
                    no: {
                      kind: 'question',
                      text: "Is it Niagara Falls?",
                      yes: { kind: 'guess', name: "Niagara Falls" },
                      no: {
                        kind: 'question',
                        text: "Is it Sydney Opera House?",
                        yes: { kind: 'guess', name: "Sydney Opera House" },
                        no: { kind: 'guess', name: "Taj Mahal" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it the Golden Gate Bridge?",
                yes: { kind: 'guess', name: "the Golden Gate Bridge" },
                no: {
                  kind: 'question',
                  text: "Is it the Grand Canyon?",
                  yes: { kind: 'guess', name: "the Grand Canyon" },
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
            },
          },
          no: {
            kind: 'question',
            text: "Somewhere people live?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a mansion\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a cabin?",
                yes: { kind: 'guess', name: "a cabin" },
                no: {
                  kind: 'question',
                  text: "Is it a castle?",
                  yes: { kind: 'guess', name: "a castle" },
                  no: { kind: 'guess', name: "a house" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a mansion?",
                yes: { kind: 'guess', name: "a mansion" },
                no: {
                  kind: 'question',
                  text: "Is it a tent?",
                  yes: { kind: 'guess', name: "a tent" },
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
              text: "Does its name come before \"a mall\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a forest\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a church\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a barn?",
                    yes: { kind: 'guess', name: "a barn" },
                    no: {
                      kind: 'question',
                      text: "Is it a beach?",
                      yes: { kind: 'guess', name: "a beach" },
                      no: {
                        kind: 'question',
                        text: "Is it a bridge?",
                        yes: { kind: 'guess', name: "a bridge" },
                        no: { kind: 'guess', name: "a cave" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a church?",
                    yes: { kind: 'guess', name: "a church" },
                    no: {
                      kind: 'question',
                      text: "Is it a city?",
                      yes: { kind: 'guess', name: "a city" },
                      no: {
                        kind: 'question',
                        text: "Is it a desert?",
                        yes: { kind: 'guess', name: "a desert" },
                        no: {
                          kind: 'question',
                          text: "Is it a factory?",
                          yes: { kind: 'guess', name: "a factory" },
                          no: { kind: 'guess', name: "a farm" },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a hospital\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a forest?",
                    yes: { kind: 'guess', name: "a forest" },
                    no: {
                      kind: 'question',
                      text: "Is it a garage?",
                      yes: { kind: 'guess', name: "a garage" },
                      no: {
                        kind: 'question',
                        text: "Is it a garden?",
                        yes: { kind: 'guess', name: "a garden" },
                        no: { kind: 'guess', name: "a gym" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a hospital?",
                    yes: { kind: 'guess', name: "a hospital" },
                    no: {
                      kind: 'question',
                      text: "Is it a hotel?",
                      yes: { kind: 'guess', name: "a hotel" },
                      no: {
                        kind: 'question',
                        text: "Is it a lake?",
                        yes: { kind: 'guess', name: "a lake" },
                        no: {
                          kind: 'question',
                          text: "Is it a library?",
                          yes: { kind: 'guess', name: "a library" },
                          no: { kind: 'guess', name: "a lighthouse" },
                        },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a theater\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a restaurant\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a mall?",
                    yes: { kind: 'guess', name: "a mall" },
                    no: {
                      kind: 'question',
                      text: "Is it a mountain?",
                      yes: { kind: 'guess', name: "a mountain" },
                      no: {
                        kind: 'question',
                        text: "Is it a museum?",
                        yes: { kind: 'guess', name: "a museum" },
                        no: { kind: 'guess', name: "a park" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a restaurant?",
                    yes: { kind: 'guess', name: "a restaurant" },
                    no: {
                      kind: 'question',
                      text: "Is it a river?",
                      yes: { kind: 'guess', name: "a river" },
                      no: {
                        kind: 'question',
                        text: "Is it a school?",
                        yes: { kind: 'guess', name: "a school" },
                        no: {
                          kind: 'question',
                          text: "Is it a skyscraper?",
                          yes: { kind: 'guess', name: "a skyscraper" },
                          no: { kind: 'guess', name: "a stadium" },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a zoo\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a theater?",
                    yes: { kind: 'guess', name: "a theater" },
                    no: {
                      kind: 'question',
                      text: "Is it a train station?",
                      yes: { kind: 'guess', name: "a train station" },
                      no: {
                        kind: 'question',
                        text: "Is it a volcano?",
                        yes: { kind: 'guess', name: "a volcano" },
                        no: { kind: 'guess', name: "a waterfall" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a zoo?",
                    yes: { kind: 'guess', name: "a zoo" },
                    no: {
                      kind: 'question',
                      text: "Is it an airport?",
                      yes: { kind: 'guess', name: "an airport" },
                      no: {
                        kind: 'question',
                        text: "Is it an aquarium?",
                        yes: { kind: 'guess', name: "an aquarium" },
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
        },
        no: {
          kind: 'question',
          text: "Furniture?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"a lamp\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a coffee table\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a bed?",
                yes: { kind: 'guess', name: "a bed" },
                no: {
                  kind: 'question',
                  text: "Is it a bench?",
                  yes: { kind: 'guess', name: "a bench" },
                  no: {
                    kind: 'question',
                    text: "Is it a blanket?",
                    yes: { kind: 'guess', name: "a blanket" },
                    no: {
                      kind: 'question',
                      text: "Is it a bookshelf?",
                      yes: { kind: 'guess', name: "a bookshelf" },
                      no: { kind: 'guess', name: "a chair" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a coffee table?",
                yes: { kind: 'guess', name: "a coffee table" },
                no: {
                  kind: 'question',
                  text: "Is it a couch?",
                  yes: { kind: 'guess', name: "a couch" },
                  no: {
                    kind: 'question',
                    text: "Is it a curtain?",
                    yes: { kind: 'guess', name: "a curtain" },
                    no: {
                      kind: 'question',
                      text: "Is it a desk?",
                      yes: { kind: 'guess', name: "a desk" },
                      no: { kind: 'guess', name: "a dresser" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a recliner\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a lamp?",
                yes: { kind: 'guess', name: "a lamp" },
                no: {
                  kind: 'question',
                  text: "Is it a mattress?",
                  yes: { kind: 'guess', name: "a mattress" },
                  no: {
                    kind: 'question',
                    text: "Is it a mirror?",
                    yes: { kind: 'guess', name: "a mirror" },
                    no: {
                      kind: 'question',
                      text: "Is it a nightstand?",
                      yes: { kind: 'guess', name: "a nightstand" },
                      no: { kind: 'guess', name: "a pillow" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a recliner?",
                yes: { kind: 'guess', name: "a recliner" },
                no: {
                  kind: 'question',
                  text: "Is it a rug?",
                  yes: { kind: 'guess', name: "a rug" },
                  no: {
                    kind: 'question',
                    text: "Is it a sofa?",
                    yes: { kind: 'guess', name: "a sofa" },
                    no: {
                      kind: 'question',
                      text: "Is it a stool?",
                      yes: { kind: 'guess', name: "a stool" },
                      no: {
                        kind: 'question',
                        text: "Is it a table?",
                        yes: { kind: 'guess', name: "a table" },
                        no: { kind: 'guess', name: "a wardrobe" },
                      },
                    },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "In the sky or outer space?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a lightning\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a cloud?",
                yes: { kind: 'guess', name: "a cloud" },
                no: {
                  kind: 'question',
                  text: "Is it a comet?",
                  yes: { kind: 'guess', name: "a comet" },
                  no: {
                    kind: 'question',
                    text: "Is it a planet?",
                    yes: { kind: 'guess', name: "a planet" },
                    no: {
                      kind: 'question',
                      text: "Is it a rainbow?",
                      yes: { kind: 'guess', name: "a rainbow" },
                      no: {
                        kind: 'question',
                        text: "Is it a star?",
                        yes: { kind: 'guess', name: "a star" },
                        no: { kind: 'guess', name: "Jupiter" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a lightning?",
                yes: { kind: 'guess', name: "a lightning" },
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
                      text: "Is it the Milky Way?",
                      yes: { kind: 'guess', name: "the Milky Way" },
                      no: {
                        kind: 'question',
                        text: "Is it the Moon?",
                        yes: { kind: 'guess', name: "the Moon" },
                        no: { kind: 'guess', name: "the Sun" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"an iceberg\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a boulder?",
                yes: { kind: 'guess', name: "a boulder" },
                no: {
                  kind: 'question',
                  text: "Is it a cliff?",
                  yes: { kind: 'guess', name: "a cliff" },
                  no: {
                    kind: 'question',
                    text: "Is it a hurricane?",
                    yes: { kind: 'guess', name: "a hurricane" },
                    no: {
                      kind: 'question',
                      text: "Is it a mountain?",
                      yes: { kind: 'guess', name: "a mountain" },
                      no: { kind: 'guess', name: "a tornado" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it an iceberg?",
                yes: { kind: 'guess', name: "an iceberg" },
                no: {
                  kind: 'question',
                  text: "Is it a fire?",
                  yes: { kind: 'guess', name: "a fire" },
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
      },
    },
    no: {
      kind: 'question',
      text: "Electronic?",
      yes: {
        kind: 'question',
        text: "Phone or tablet?",
        yes: {
          kind: 'question',
          text: "Phone?",
          yes: { kind: 'guess', name: "a smartphone" },
          no: {
            kind: 'question',
            text: "Is it a tablet?",
            yes: { kind: 'guess', name: "a tablet" },
            no: {
              kind: 'question',
              text: "Is it an iPad?",
              yes: { kind: 'guess', name: "an iPad" },
              no: { kind: 'guess', name: "Kindle" },
            },
          },
        },
        no: {
          kind: 'question',
          text: "Audio or wearable?",
          yes: {
            kind: 'question',
            text: "Is it a headphones?",
            yes: { kind: 'guess', name: "a headphones" },
            no: {
              kind: 'question',
              text: "Is it an earbuds?",
              yes: { kind: 'guess', name: "an earbuds" },
              no: {
                kind: 'question',
                text: "Is it AirPods?",
                yes: { kind: 'guess', name: "AirPods" },
                no: {
                  kind: 'question',
                  text: "Is it a smartwatch?",
                  yes: { kind: 'guess', name: "a smartwatch" },
                  no: {
                    kind: 'question',
                    text: "Is it Fitbit?",
                    yes: { kind: 'guess', name: "Fitbit" },
                    no: { kind: 'guess', name: "VR headset" },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Does its name come before \"a monitor\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Does its name come before \"a game controller\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a calculator?",
                yes: { kind: 'guess', name: "a calculator" },
                no: {
                  kind: 'question',
                  text: "Is it a camera?",
                  yes: { kind: 'guess', name: "a camera" },
                  no: {
                    kind: 'question',
                    text: "Is it a charger?",
                    yes: { kind: 'guess', name: "a charger" },
                    no: { kind: 'guess', name: "a flashlight" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a game controller?",
                yes: { kind: 'guess', name: "a game controller" },
                no: {
                  kind: 'question',
                  text: "Is it a keyboard?",
                  yes: { kind: 'guess', name: "a keyboard" },
                  no: {
                    kind: 'question',
                    text: "Is it a laptop?",
                    yes: { kind: 'guess', name: "a laptop" },
                    no: { kind: 'guess', name: "a microphone" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a remote control\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a monitor?",
                yes: { kind: 'guess', name: "a monitor" },
                no: {
                  kind: 'question',
                  text: "Is it a mouse?",
                  yes: { kind: 'guess', name: "a mouse" },
                  no: {
                    kind: 'question',
                    text: "Is it Nintendo Switch?",
                    yes: { kind: 'guess', name: "Nintendo Switch" },
                    no: { kind: 'guess', name: "a power bank" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a remote control?",
                yes: { kind: 'guess', name: "a remote control" },
                no: {
                  kind: 'question',
                  text: "Is it a router?",
                  yes: { kind: 'guess', name: "a router" },
                  no: {
                    kind: 'question',
                    text: "Is it a speaker?",
                    yes: { kind: 'guess', name: "a speaker" },
                    no: {
                      kind: 'question',
                      text: "Is it USB drive?",
                      yes: { kind: 'guess', name: "USB drive" },
                      no: { kind: 'guess', name: "a webcam" },
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
            text: "Does its name come before \"a milk\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Is it a beer?",
              yes: { kind: 'guess', name: "a beer" },
              no: {
                kind: 'question',
                text: "Is it a coffee?",
                yes: { kind: 'guess', name: "a coffee" },
                no: {
                  kind: 'question',
                  text: "Is it a hot chocolate?",
                  yes: { kind: 'guess', name: "a hot chocolate" },
                  no: {
                    kind: 'question',
                    text: "Is it a juice?",
                    yes: { kind: 'guess', name: "a juice" },
                    no: { kind: 'guess', name: "a lemonade" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a milk?",
              yes: { kind: 'guess', name: "a milk" },
              no: {
                kind: 'question',
                text: "Is it a smoothie?",
                yes: { kind: 'guess', name: "a smoothie" },
                no: {
                  kind: 'question',
                  text: "Is it a soda?",
                  yes: { kind: 'guess', name: "a soda" },
                  no: {
                    kind: 'question',
                    text: "Is it a tea?",
                    yes: { kind: 'guess', name: "a tea" },
                    no: {
                      kind: 'question',
                      text: "Is it a water?",
                      yes: { kind: 'guess', name: "a water" },
                      no: { kind: 'guess', name: "a wine" },
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
              text: "Does its name come before \"a cupcake\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Is it a brownie?",
                yes: { kind: 'guess', name: "a brownie" },
                no: {
                  kind: 'question',
                  text: "Is it a cake?",
                  yes: { kind: 'guess', name: "a cake" },
                  no: {
                    kind: 'question',
                    text: "Is it a candy?",
                    yes: { kind: 'guess', name: "a candy" },
                    no: {
                      kind: 'question',
                      text: "Is it a chocolate bar?",
                      yes: { kind: 'guess', name: "a chocolate bar" },
                      no: { kind: 'guess', name: "a cookie" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a cupcake?",
                yes: { kind: 'guess', name: "a cupcake" },
                no: {
                  kind: 'question',
                  text: "Is it a donut?",
                  yes: { kind: 'guess', name: "a donut" },
                  no: {
                    kind: 'question',
                    text: "Is it an ice cream?",
                    yes: { kind: 'guess', name: "an ice cream" },
                    no: {
                      kind: 'question',
                      text: "Is it a muffin?",
                      yes: { kind: 'guess', name: "a muffin" },
                      no: { kind: 'guess', name: "a pie" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name come before \"a hot dog\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a carrot\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it an apple?",
                  yes: { kind: 'guess', name: "an apple" },
                  no: {
                    kind: 'question',
                    text: "Is it a bagel?",
                    yes: { kind: 'guess', name: "a bagel" },
                    no: {
                      kind: 'question',
                      text: "Is it a banana?",
                      yes: { kind: 'guess', name: "a banana" },
                      no: {
                        kind: 'question',
                        text: "Is it a bread?",
                        yes: { kind: 'guess', name: "a bread" },
                        no: {
                          kind: 'question',
                          text: "Is it a broccoli?",
                          yes: { kind: 'guess', name: "a broccoli" },
                          no: { kind: 'guess', name: "a burrito" },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"an egg\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a carrot?",
                    yes: { kind: 'guess', name: "a carrot" },
                    no: {
                      kind: 'question',
                      text: "Is it a cereal?",
                      yes: { kind: 'guess', name: "a cereal" },
                      no: { kind: 'guess', name: "a cheese" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it an egg?",
                    yes: { kind: 'guess', name: "an egg" },
                    no: {
                      kind: 'question',
                      text: "Is it a french fries?",
                      yes: { kind: 'guess', name: "a french fries" },
                      no: {
                        kind: 'question',
                        text: "Is it a grape?",
                        yes: { kind: 'guess', name: "a grape" },
                        no: { kind: 'guess', name: "a hamburger" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a salad\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a hot dog?",
                  yes: { kind: 'guess', name: "a hot dog" },
                  no: {
                    kind: 'question',
                    text: "Is it an orange?",
                    yes: { kind: 'guess', name: "an orange" },
                    no: {
                      kind: 'question',
                      text: "Is it a pasta?",
                      yes: { kind: 'guess', name: "a pasta" },
                      no: {
                        kind: 'question',
                        text: "Is it a pizza?",
                        yes: { kind: 'guess', name: "a pizza" },
                        no: {
                          kind: 'question',
                          text: "Is it a popcorn?",
                          yes: { kind: 'guess', name: "a popcorn" },
                          no: { kind: 'guess', name: "a potato chips" },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a strawberry\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a salad?",
                    yes: { kind: 'guess', name: "a salad" },
                    no: {
                      kind: 'question',
                      text: "Is it a sandwich?",
                      yes: { kind: 'guess', name: "a sandwich" },
                      no: { kind: 'guess', name: "a soup" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a strawberry?",
                    yes: { kind: 'guess', name: "a strawberry" },
                    no: {
                      kind: 'question',
                      text: "Is it a sushi?",
                      yes: { kind: 'guess', name: "a sushi" },
                      no: {
                        kind: 'question',
                        text: "Is it a taco?",
                        yes: { kind: 'guess', name: "a taco" },
                        no: { kind: 'guess', name: "a yogurt" },
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
          text: "Used for writing, reading, or school?",
          yes: {
            kind: 'question',
            text: "Does its name come before \"a notebook\" alphabetically?",
            yes: {
              kind: 'question',
              text: "Is it a backpack?",
              yes: { kind: 'guess', name: "a backpack" },
              no: {
                kind: 'question',
                text: "Is it a book?",
                yes: { kind: 'guess', name: "a book" },
                no: {
                  kind: 'question',
                  text: "Is it a crayon?",
                  yes: { kind: 'guess', name: "a crayon" },
                  no: {
                    kind: 'question',
                    text: "Is it an eraser?",
                    yes: { kind: 'guess', name: "an eraser" },
                    no: { kind: 'guess', name: "a marker" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a notebook?",
              yes: { kind: 'guess', name: "a notebook" },
              no: {
                kind: 'question',
                text: "Is it a pen?",
                yes: { kind: 'guess', name: "a pen" },
                no: {
                  kind: 'question',
                  text: "Is it a pencil?",
                  yes: { kind: 'guess', name: "a pencil" },
                  no: {
                    kind: 'question',
                    text: "Is it a ruler?",
                    yes: { kind: 'guess', name: "a ruler" },
                    no: {
                      kind: 'question',
                      text: "Is it a scissors?",
                      yes: { kind: 'guess', name: "a scissors" },
                      no: { kind: 'guess', name: "a stapler" },
                    },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Clothing or accessory you wear?",
            yes: {
              kind: 'question',
              text: "Shoes or socks?",
              yes: {
                kind: 'question',
                text: "Is it a sneakers?",
                yes: { kind: 'guess', name: "a sneakers" },
                no: {
                  kind: 'question',
                  text: "Is it a boots?",
                  yes: { kind: 'guess', name: "a boots" },
                  no: {
                    kind: 'question',
                    text: "Is it a sandals?",
                    yes: { kind: 'guess', name: "a sandals" },
                    no: {
                      kind: 'question',
                      text: "Is it a heels?",
                      yes: { kind: 'guess', name: "a heels" },
                      no: {
                        kind: 'question',
                        text: "Is it a slippers?",
                        yes: { kind: 'guess', name: "a slippers" },
                        no: { kind: 'guess', name: "a socks" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a pants\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Does its name come before \"a gloves\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a baseball cap?",
                    yes: { kind: 'guess', name: "a baseball cap" },
                    no: {
                      kind: 'question',
                      text: "Is it a beanie?",
                      yes: { kind: 'guess', name: "a beanie" },
                      no: {
                        kind: 'question',
                        text: "Is it a belt?",
                        yes: { kind: 'guess', name: "a belt" },
                        no: {
                          kind: 'question',
                          text: "Is it a dress?",
                          yes: { kind: 'guess', name: "a dress" },
                          no: { kind: 'guess', name: "a glasses" },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a gloves?",
                    yes: { kind: 'guess', name: "a gloves" },
                    no: {
                      kind: 'question',
                      text: "Is it a hat?",
                      yes: { kind: 'guess', name: "a hat" },
                      no: {
                        kind: 'question',
                        text: "Is it a hoodie?",
                        yes: { kind: 'guess', name: "a hoodie" },
                        no: {
                          kind: 'question',
                          text: "Is it a jacket?",
                          yes: { kind: 'guess', name: "a jacket" },
                          no: {
                            kind: 'question',
                            text: "Is it a jeans?",
                            yes: { kind: 'guess', name: "a jeans" },
                            no: { kind: 'guess', name: "a necklace" },
                          },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a sweater\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a pants?",
                    yes: { kind: 'guess', name: "a pants" },
                    no: {
                      kind: 'question',
                      text: "Is it a purse?",
                      yes: { kind: 'guess', name: "a purse" },
                      no: {
                        kind: 'question',
                        text: "Is it a ring?",
                        yes: { kind: 'guess', name: "a ring" },
                        no: {
                          kind: 'question',
                          text: "Is it a scarf?",
                          yes: { kind: 'guess', name: "a scarf" },
                          no: {
                            kind: 'question',
                            text: "Is it a shorts?",
                            yes: { kind: 'guess', name: "a shorts" },
                            no: { kind: 'guess', name: "a sunglasses" },
                          },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a sweater?",
                    yes: { kind: 'guess', name: "a sweater" },
                    no: {
                      kind: 'question',
                      text: "Is it a t-shirt?",
                      yes: { kind: 'guess', name: "a t-shirt" },
                      no: {
                        kind: 'question',
                        text: "Is it a tie?",
                        yes: { kind: 'guess', name: "a tie" },
                        no: {
                          kind: 'question',
                          text: "Is it an umbrella?",
                          yes: { kind: 'guess', name: "an umbrella" },
                          no: {
                            kind: 'question',
                            text: "Is it a wallet?",
                            yes: { kind: 'guess', name: "a wallet" },
                            no: { kind: 'guess', name: "a watch" },
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
              text: "Does its name come before \"a key\" alphabetically?",
              yes: {
                kind: 'question',
                text: "Does its name come before \"a credit card\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it an action figure?",
                  yes: { kind: 'guess', name: "an action figure" },
                  no: {
                    kind: 'question',
                    text: "Is it a ball?",
                    yes: { kind: 'guess', name: "a ball" },
                    no: {
                      kind: 'question',
                      text: "Is it a basketball?",
                      yes: { kind: 'guess', name: "a basketball" },
                      no: {
                        kind: 'question',
                        text: "Is it a bowl?",
                        yes: { kind: 'guess', name: "a bowl" },
                        no: {
                          kind: 'question',
                          text: "Is it a candle?",
                          yes: { kind: 'guess', name: "a candle" },
                          no: { kind: 'guess', name: "a coin" },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a credit card?",
                  yes: { kind: 'guess', name: "a credit card" },
                  no: {
                    kind: 'question',
                    text: "Is it a cup?",
                    yes: { kind: 'guess', name: "a cup" },
                    no: {
                      kind: 'question',
                      text: "Is it a dice?",
                      yes: { kind: 'guess', name: "a dice" },
                      no: {
                        kind: 'question',
                        text: "Is it a football?",
                        yes: { kind: 'guess', name: "a football" },
                        no: {
                          kind: 'question',
                          text: "Is it a fork?",
                          yes: { kind: 'guess', name: "a fork" },
                          no: { kind: 'guess', name: "a frisbee" },
                        },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name come before \"a playing cards\" alphabetically?",
                yes: {
                  kind: 'question',
                  text: "Is it a key?",
                  yes: { kind: 'guess', name: "a key" },
                  no: {
                    kind: 'question',
                    text: "Is it a knife?",
                    yes: { kind: 'guess', name: "a knife" },
                    no: {
                      kind: 'question',
                      text: "Is it LEGO brick?",
                      yes: { kind: 'guess', name: "LEGO brick" },
                      no: {
                        kind: 'question',
                        text: "Is it a lighter?",
                        yes: { kind: 'guess', name: "a lighter" },
                        no: {
                          kind: 'question',
                          text: "Is it a mug?",
                          yes: { kind: 'guess', name: "a mug" },
                          no: { kind: 'guess', name: "a plate" },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name come before \"a spoon\" alphabetically?",
                  yes: {
                    kind: 'question',
                    text: "Is it a playing cards?",
                    yes: { kind: 'guess', name: "a playing cards" },
                    no: {
                      kind: 'question',
                      text: "Is it a soap?",
                      yes: { kind: 'guess', name: "a soap" },
                      no: { kind: 'guess', name: "a soccer ball" },
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
