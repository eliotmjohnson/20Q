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
export const STORAGE_KEY = 'twentyq-tree-v11'
export const MAX_QUESTIONS = 20

/** Bump this whenever the seeded question order/content changes. */
export const SEED_VERSION = 11
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
/** Seed v11: alphabet / comes-before questions removed; balanced group splits. */
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
            text: "Does its name have more than one word?",
            yes: {
              kind: 'question',
              text: "Is it Black Panther, Black Widow, or Captain America, or something else in that same bunch (5 options)?",
              yes: {
                kind: 'question',
                text: "Is it Black Panther, Black Widow, or Captain America?",
                yes: {
                  kind: 'question',
                  text: "Is it Black Panther or Black Widow?",
                  yes: {
                    kind: 'question',
                    text: "Is it Black Panther?",
                    yes: { kind: 'guess', name: "Black Panther" },
                    no: { kind: 'guess', name: "Black Widow" },
                  },
                  no: { kind: 'guess', name: "Captain America" },
                },
                no: {
                  kind: 'question',
                  text: "Is it Captain Marvel?",
                  yes: { kind: 'guess', name: "Captain Marvel" },
                  no: { kind: 'guess', name: "Doctor Strange" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Green Lantern or Iron Man?",
                yes: {
                  kind: 'question',
                  text: "Is it Green Lantern?",
                  yes: { kind: 'guess', name: "Green Lantern" },
                  no: { kind: 'guess', name: "Iron Man" },
                },
                no: {
                  kind: 'question',
                  text: "Is it Scarlet Witch?",
                  yes: { kind: 'guess', name: "Scarlet Witch" },
                  no: { kind: 'guess', name: "Wonder Woman" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it Ant-Man, Aquaman, or Batman, or something else in that same bunch (7 options)?",
              yes: {
                kind: 'question',
                text: "Is it Ant-Man, Aquaman, Batman, or Deadpool?",
                yes: {
                  kind: 'question',
                  text: "Is it Ant-Man or Aquaman?",
                  yes: {
                    kind: 'question',
                    text: "Is it Ant-Man?",
                    yes: { kind: 'guess', name: "Ant-Man" },
                    no: { kind: 'guess', name: "Aquaman" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Batman?",
                    yes: { kind: 'guess', name: "Batman" },
                    no: { kind: 'guess', name: "Deadpool" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Flash or Hawkeye?",
                  yes: {
                    kind: 'question',
                    text: "Is it Flash?",
                    yes: { kind: 'guess', name: "Flash" },
                    no: { kind: 'guess', name: "Hawkeye" },
                  },
                  no: { kind: 'guess', name: "Hulk" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Joker, Spider-Man, or Superman?",
                yes: {
                  kind: 'question',
                  text: "Is it Joker or Spider-Man?",
                  yes: {
                    kind: 'question',
                    text: "Is it Joker?",
                    yes: { kind: 'guess', name: "Joker" },
                    no: { kind: 'guess', name: "Spider-Man" },
                  },
                  no: { kind: 'guess', name: "Superman" },
                },
                no: {
                  kind: 'question',
                  text: "Is it Thor or Venom?",
                  yes: {
                    kind: 'question',
                    text: "Is it Thor?",
                    yes: { kind: 'guess', name: "Thor" },
                    no: { kind: 'guess', name: "Venom" },
                  },
                  no: { kind: 'guess', name: "Wolverine" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Star Wars?",
            yes: {
              kind: 'question',
              text: "Does its name have more than one word?",
              yes: {
                kind: 'question',
                text: "Is it Baby Yoda, Boba Fett, or Darth Vader, or something else in that same bunch (5 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it Baby Yoda, Boba Fett, or Darth Vader?",
                  yes: {
                    kind: 'question',
                    text: "Is it Baby Yoda or Boba Fett?",
                    yes: {
                      kind: 'question',
                      text: "Is it Baby Yoda?",
                      yes: { kind: 'guess', name: "Baby Yoda" },
                      no: { kind: 'guess', name: "Boba Fett" },
                    },
                    no: { kind: 'guess', name: "Darth Vader" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Han Solo?",
                    yes: { kind: 'guess', name: "Han Solo" },
                    no: { kind: 'guess', name: "Kylo Ren" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Luke Skywalker or Obi-Wan Kenobi?",
                  yes: {
                    kind: 'question',
                    text: "Is it Luke Skywalker?",
                    yes: { kind: 'guess', name: "Luke Skywalker" },
                    no: { kind: 'guess', name: "Obi-Wan Kenobi" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Padmé Amidala?",
                    yes: { kind: 'guess', name: "Padmé Amidala" },
                    no: { kind: 'guess', name: "Princess Leia" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it C-3PO, Chewbacca, or R2-D2?",
                yes: {
                  kind: 'question',
                  text: "Is it C-3PO or Chewbacca?",
                  yes: {
                    kind: 'question',
                    text: "Is it C-3PO?",
                    yes: { kind: 'guess', name: "C-3PO" },
                    no: { kind: 'guess', name: "Chewbacca" },
                  },
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
            no: {
              kind: 'question',
              text: "Animated / Disney / cartoon?",
              yes: {
                kind: 'question',
                text: "Does its name have more than one word?",
                yes: {
                  kind: 'question',
                  text: "Is it Ash Ketchum, Bart Simpson, or Bugs Bunny, or something else in that same bunch (6 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it Ash Ketchum, Bart Simpson, or Bugs Bunny?",
                    yes: {
                      kind: 'question',
                      text: "Is it Ash Ketchum or Bart Simpson?",
                      yes: {
                        kind: 'question',
                        text: "Is it Ash Ketchum?",
                        yes: { kind: 'guess', name: "Ash Ketchum" },
                        no: { kind: 'guess', name: "Bart Simpson" },
                      },
                      no: { kind: 'guess', name: "Bugs Bunny" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Buzz Lightyear or Donald Duck?",
                      yes: {
                        kind: 'question',
                        text: "Is it Buzz Lightyear?",
                        yes: { kind: 'guess', name: "Buzz Lightyear" },
                        no: { kind: 'guess', name: "Donald Duck" },
                      },
                      no: { kind: 'guess', name: "Dora the Explorer" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Hello Kitty, Homer Simpson, or Mickey Mouse?",
                    yes: {
                      kind: 'question',
                      text: "Is it Hello Kitty or Homer Simpson?",
                      yes: {
                        kind: 'question',
                        text: "Is it Hello Kitty?",
                        yes: { kind: 'guess', name: "Hello Kitty" },
                        no: { kind: 'guess', name: "Homer Simpson" },
                      },
                      no: { kind: 'guess', name: "Mickey Mouse" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Peppa Pig or Sonic the Hedgehog?",
                      yes: {
                        kind: 'question',
                        text: "Is it Peppa Pig?",
                        yes: { kind: 'guess', name: "Peppa Pig" },
                        no: { kind: 'guess', name: "Sonic the Hedgehog" },
                      },
                      no: { kind: 'guess', name: "Winnie the Pooh" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Bluey, Elsa, or Goku, or something else in that same bunch (7 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it Bluey, Elsa, Goku, or Goofy?",
                    yes: {
                      kind: 'question',
                      text: "Is it Bluey or Elsa?",
                      yes: {
                        kind: 'question',
                        text: "Is it Bluey?",
                        yes: { kind: 'guess', name: "Bluey" },
                        no: { kind: 'guess', name: "Elsa" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Goku?",
                        yes: { kind: 'guess', name: "Goku" },
                        no: { kind: 'guess', name: "Goofy" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Mario or Minion?",
                      yes: {
                        kind: 'question',
                        text: "Is it Mario?",
                        yes: { kind: 'guess', name: "Mario" },
                        no: { kind: 'guess', name: "Minion" },
                      },
                      no: { kind: 'guess', name: "Naruto" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Pikachu, Scooby-Doo, or Shrek?",
                    yes: {
                      kind: 'question',
                      text: "Is it Pikachu or Scooby-Doo?",
                      yes: {
                        kind: 'question',
                        text: "Is it Pikachu?",
                        yes: { kind: 'guess', name: "Pikachu" },
                        no: { kind: 'guess', name: "Scooby-Doo" },
                      },
                      no: { kind: 'guess', name: "Shrek" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Simba or SpongeBob?",
                      yes: {
                        kind: 'question',
                        text: "Is it Simba?",
                        yes: { kind: 'guess', name: "Simba" },
                        no: { kind: 'guess', name: "SpongeBob" },
                      },
                      no: { kind: 'guess', name: "Woody" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name have more than one word?",
                yes: {
                  kind: 'question',
                  text: "Is it Doc Brown, Ellen Ripley, or Ethan Hunt, or something else in that same bunch (11 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it Doc Brown, Ellen Ripley, or Ethan Hunt, or something else in that same bunch (6 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it Doc Brown, Ellen Ripley, or Ethan Hunt?",
                      yes: {
                        kind: 'question',
                        text: "Is it Doc Brown or Ellen Ripley?",
                        yes: {
                          kind: 'question',
                          text: "Is it Doc Brown?",
                          yes: { kind: 'guess', name: "Doc Brown" },
                          no: { kind: 'guess', name: "Ellen Ripley" },
                        },
                        no: { kind: 'guess', name: "Ethan Hunt" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Forrest Gump or Gollum (movie)?",
                        yes: {
                          kind: 'question',
                          text: "Is it Forrest Gump?",
                          yes: { kind: 'guess', name: "Forrest Gump" },
                          no: { kind: 'guess', name: "Gollum (movie)" },
                        },
                        no: { kind: 'guess', name: "Indiana Jones" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Jack Sparrow, James Bond, or Jason Bourne?",
                      yes: {
                        kind: 'question',
                        text: "Is it Jack Sparrow or James Bond?",
                        yes: {
                          kind: 'question',
                          text: "Is it Jack Sparrow?",
                          yes: { kind: 'guess', name: "Jack Sparrow" },
                          no: { kind: 'guess', name: "James Bond" },
                        },
                        no: { kind: 'guess', name: "Jason Bourne" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it John Wick?",
                        yes: { kind: 'guess', name: "John Wick" },
                        no: { kind: 'guess', name: "King Kong" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Lara Croft (movie), Luke Cage, or Marty McFly, or something else in that same bunch (5 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it Lara Croft (movie), Luke Cage, or Marty McFly?",
                      yes: {
                        kind: 'question',
                        text: "Is it Lara Croft (movie) or Luke Cage?",
                        yes: {
                          kind: 'question',
                          text: "Is it Lara Croft (movie)?",
                          yes: { kind: 'guess', name: "Lara Croft (movie)" },
                          no: { kind: 'guess', name: "Luke Cage" },
                        },
                        no: { kind: 'guess', name: "Marty McFly" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Mary Poppins?",
                        yes: { kind: 'guess', name: "Mary Poppins" },
                        no: { kind: 'guess', name: "Rocky Balboa" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Sarah Connor, Snow White, or The Terminator?",
                      yes: {
                        kind: 'question',
                        text: "Is it Sarah Connor or Snow White?",
                        yes: {
                          kind: 'question',
                          text: "Is it Sarah Connor?",
                          yes: { kind: 'guess', name: "Sarah Connor" },
                          no: { kind: 'guess', name: "Snow White" },
                        },
                        no: { kind: 'guess', name: "The Terminator" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Tony Montana?",
                        yes: { kind: 'guess', name: "Tony Montana" },
                        no: { kind: 'guess', name: "Willy Wonka" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Aladdin, Cinderella, or E.T., or something else in that same bunch (5 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it Aladdin, Cinderella, or E.T.?",
                    yes: {
                      kind: 'question',
                      text: "Is it Aladdin or Cinderella?",
                      yes: {
                        kind: 'question',
                        text: "Is it Aladdin?",
                        yes: { kind: 'guess', name: "Aladdin" },
                        no: { kind: 'guess', name: "Cinderella" },
                      },
                      no: { kind: 'guess', name: "E.T." },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Genie?",
                      yes: { kind: 'guess', name: "Genie" },
                      no: { kind: 'guess', name: "Godzilla" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Moana, Mulan, or Neo?",
                    yes: {
                      kind: 'question',
                      text: "Is it Moana or Mulan?",
                      yes: {
                        kind: 'question',
                        text: "Is it Moana?",
                        yes: { kind: 'guess', name: "Moana" },
                        no: { kind: 'guess', name: "Mulan" },
                      },
                      no: { kind: 'guess', name: "Neo" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Tarzan?",
                      yes: { kind: 'guess', name: "Tarzan" },
                      no: { kind: 'guess', name: "Trinity" },
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
            text: "Does its name have more than one word?",
            yes: {
              kind: 'question',
              text: "Is it Alice in Wonderland, Bilbo Baggins, or Cloud Strife, or something else in that same bunch (14 options)?",
              yes: {
                kind: 'question',
                text: "Is it Alice in Wonderland, Bilbo Baggins, or Cloud Strife, or something else in that same bunch (7 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it Alice in Wonderland, Bilbo Baggins, Cloud Strife, or Cowardly Lion?",
                  yes: {
                    kind: 'question',
                    text: "Is it Alice in Wonderland or Bilbo Baggins?",
                    yes: {
                      kind: 'question',
                      text: "Is it Alice in Wonderland?",
                      yes: { kind: 'guess', name: "Alice in Wonderland" },
                      no: { kind: 'guess', name: "Bilbo Baggins" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Cloud Strife?",
                      yes: { kind: 'guess', name: "Cloud Strife" },
                      no: { kind: 'guess', name: "Cowardly Lion" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Donkey Kong or Dorothy Gale?",
                    yes: {
                      kind: 'question',
                      text: "Is it Donkey Kong?",
                      yes: { kind: 'guess', name: "Donkey Kong" },
                      no: { kind: 'guess', name: "Dorothy Gale" },
                    },
                    no: { kind: 'guess', name: "Easter Bunny" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Geralt of Rivia, Harry Potter, Hermione Granger, or Katniss Everdeen?",
                  yes: {
                    kind: 'question',
                    text: "Is it Geralt of Rivia or Harry Potter?",
                    yes: {
                      kind: 'question',
                      text: "Is it Geralt of Rivia?",
                      yes: { kind: 'guess', name: "Geralt of Rivia" },
                      no: { kind: 'guess', name: "Harry Potter" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Hermione Granger?",
                      yes: { kind: 'guess', name: "Hermione Granger" },
                      no: { kind: 'guess', name: "Katniss Everdeen" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it King Arthur or Lara Croft?",
                    yes: {
                      kind: 'question',
                      text: "Is it King Arthur?",
                      yes: { kind: 'guess', name: "King Arthur" },
                      no: { kind: 'guess', name: "Lara Croft" },
                    },
                    no: { kind: 'guess', name: "Loki (mythology)" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Lucy Pevensie, Master Chief, or Percy Jackson, or something else in that same bunch (7 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it Lucy Pevensie, Master Chief, Percy Jackson, or Peter Pan?",
                  yes: {
                    kind: 'question',
                    text: "Is it Lucy Pevensie or Master Chief?",
                    yes: {
                      kind: 'question',
                      text: "Is it Lucy Pevensie?",
                      yes: { kind: 'guess', name: "Lucy Pevensie" },
                      no: { kind: 'guess', name: "Master Chief" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Percy Jackson?",
                      yes: { kind: 'guess', name: "Percy Jackson" },
                      no: { kind: 'guess', name: "Peter Pan" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Princess Peach or Robin Hood?",
                    yes: {
                      kind: 'question',
                      text: "Is it Princess Peach?",
                      yes: { kind: 'guess', name: "Princess Peach" },
                      no: { kind: 'guess', name: "Robin Hood" },
                    },
                    no: { kind: 'guess', name: "Santa Claus" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Sherlock Holmes, The Grinch, Thor (mythology), or Tin Man?",
                  yes: {
                    kind: 'question',
                    text: "Is it Sherlock Holmes or The Grinch?",
                    yes: {
                      kind: 'question',
                      text: "Is it Sherlock Holmes?",
                      yes: { kind: 'guess', name: "Sherlock Holmes" },
                      no: { kind: 'guess', name: "The Grinch" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Thor (mythology)?",
                      yes: { kind: 'guess', name: "Thor (mythology)" },
                      no: { kind: 'guess', name: "Tin Man" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Tinker Bell or Tooth Fairy?",
                    yes: {
                      kind: 'question',
                      text: "Is it Tinker Bell?",
                      yes: { kind: 'guess', name: "Tinker Bell" },
                      no: { kind: 'guess', name: "Tooth Fairy" },
                    },
                    no: { kind: 'guess', name: "Wicked Witch" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it Aloy, Apollo, or Aragorn, or something else in that same bunch (24 options)?",
              yes: {
                kind: 'question',
                text: "Is it Aloy, Apollo, or Aragorn, or something else in that same bunch (12 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it Aloy, Apollo, or Aragorn, or something else in that same bunch (6 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it Aloy, Apollo, or Aragorn?",
                    yes: {
                      kind: 'question',
                      text: "Is it Aloy or Apollo?",
                      yes: {
                        kind: 'question',
                        text: "Is it Aloy?",
                        yes: { kind: 'guess', name: "Aloy" },
                        no: { kind: 'guess', name: "Apollo" },
                      },
                      no: { kind: 'guess', name: "Aragorn" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Aslan or Athena?",
                      yes: {
                        kind: 'question',
                        text: "Is it Aslan?",
                        yes: { kind: 'guess', name: "Aslan" },
                        no: { kind: 'guess', name: "Athena" },
                      },
                      no: { kind: 'guess', name: "Cupid" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Dracula, Dragon, or Dwarf?",
                    yes: {
                      kind: 'question',
                      text: "Is it Dracula or Dragon?",
                      yes: {
                        kind: 'question',
                        text: "Is it Dracula?",
                        yes: { kind: 'guess', name: "Dracula" },
                        no: { kind: 'guess', name: "Dragon" },
                      },
                      no: { kind: 'guess', name: "Dwarf" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Elf or Fairy?",
                      yes: {
                        kind: 'question',
                        text: "Is it Elf?",
                        yes: { kind: 'guess', name: "Elf" },
                        no: { kind: 'guess', name: "Fairy" },
                      },
                      no: { kind: 'guess', name: "Frankenstein" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Frodo, Gandalf, or Ghost, or something else in that same bunch (6 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it Frodo, Gandalf, or Ghost?",
                    yes: {
                      kind: 'question',
                      text: "Is it Frodo or Gandalf?",
                      yes: {
                        kind: 'question',
                        text: "Is it Frodo?",
                        yes: { kind: 'guess', name: "Frodo" },
                        no: { kind: 'guess', name: "Gandalf" },
                      },
                      no: { kind: 'guess', name: "Ghost" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Goblin or Gollum?",
                      yes: {
                        kind: 'question',
                        text: "Is it Goblin?",
                        yes: { kind: 'guess', name: "Goblin" },
                        no: { kind: 'guess', name: "Gollum" },
                      },
                      no: { kind: 'guess', name: "Hades" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Hera, Hercules, or Kirby?",
                    yes: {
                      kind: 'question',
                      text: "Is it Hera or Hercules?",
                      yes: {
                        kind: 'question',
                        text: "Is it Hera?",
                        yes: { kind: 'guess', name: "Hera" },
                        no: { kind: 'guess', name: "Hercules" },
                      },
                      no: { kind: 'guess', name: "Kirby" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Kratos or Legolas?",
                      yes: {
                        kind: 'question',
                        text: "Is it Kratos?",
                        yes: { kind: 'guess', name: "Kratos" },
                        no: { kind: 'guess', name: "Legolas" },
                      },
                      no: { kind: 'guess', name: "Link" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Luigi, Medusa, or Merlin, or something else in that same bunch (12 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it Luigi, Medusa, or Merlin, or something else in that same bunch (6 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it Luigi, Medusa, or Merlin?",
                    yes: {
                      kind: 'question',
                      text: "Is it Luigi or Medusa?",
                      yes: {
                        kind: 'question',
                        text: "Is it Luigi?",
                        yes: { kind: 'guess', name: "Luigi" },
                        no: { kind: 'guess', name: "Medusa" },
                      },
                      no: { kind: 'guess', name: "Merlin" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Mermaid or Mummy?",
                      yes: {
                        kind: 'question',
                        text: "Is it Mermaid?",
                        yes: { kind: 'guess', name: "Mermaid" },
                        no: { kind: 'guess', name: "Mummy" },
                      },
                      no: { kind: 'guess', name: "Odin" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Orc, Pac-Man, or Pegasus?",
                    yes: {
                      kind: 'question',
                      text: "Is it Orc or Pac-Man?",
                      yes: {
                        kind: 'question',
                        text: "Is it Orc?",
                        yes: { kind: 'guess', name: "Orc" },
                        no: { kind: 'guess', name: "Pac-Man" },
                      },
                      no: { kind: 'guess', name: "Pegasus" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Phoenix or Poseidon?",
                      yes: {
                        kind: 'question',
                        text: "Is it Phoenix?",
                        yes: { kind: 'guess', name: "Phoenix" },
                        no: { kind: 'guess', name: "Poseidon" },
                      },
                      no: { kind: 'guess', name: "Scarecrow" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Sephiroth, Troll, or Unicorn, or something else in that same bunch (6 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it Sephiroth, Troll, or Unicorn?",
                    yes: {
                      kind: 'question',
                      text: "Is it Sephiroth or Troll?",
                      yes: {
                        kind: 'question',
                        text: "Is it Sephiroth?",
                        yes: { kind: 'guess', name: "Sephiroth" },
                        no: { kind: 'guess', name: "Troll" },
                      },
                      no: { kind: 'guess', name: "Unicorn" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Vampire or Voldemort?",
                      yes: {
                        kind: 'question',
                        text: "Is it Vampire?",
                        yes: { kind: 'guess', name: "Vampire" },
                        no: { kind: 'guess', name: "Voldemort" },
                      },
                      no: { kind: 'guess', name: "Werewolf" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Witch, Wizard, or Zelda?",
                    yes: {
                      kind: 'question',
                      text: "Is it Witch or Wizard?",
                      yes: {
                        kind: 'question',
                        text: "Is it Witch?",
                        yes: { kind: 'guess', name: "Witch" },
                        no: { kind: 'guess', name: "Wizard" },
                      },
                      no: { kind: 'guess', name: "Zelda" },
                    },
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
          no: {
            kind: 'question',
            text: "Is it a cryptid, a mascot, a meme character, or a superhero sidekick?",
            yes: {
              kind: 'question',
              text: "Is it a cryptid or a mascot?",
              yes: {
                kind: 'question',
                text: "Is it a cryptid?",
                yes: { kind: 'guess', name: "a cryptid" },
                no: { kind: 'guess', name: "a mascot" },
              },
              no: {
                kind: 'question',
                text: "Is it a meme character?",
                yes: { kind: 'guess', name: "a meme character" },
                no: { kind: 'guess', name: "a superhero sidekick" },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name have more than one word?",
              yes: {
                kind: 'question',
                text: "Is it an OC / original character?",
                yes: { kind: 'guess', name: "an OC / original character" },
                no: { kind: 'guess', name: "the Loch Ness Monster" },
              },
              no: { kind: 'guess', name: "Bigfoot" },
            },
          },
        },
      },
      no: {
        kind: 'question',
        text: "Is it mainly a job or occupation (like teacher, doctor, firefighter)?",
        yes: {
          kind: 'question',
          text: "Is it a banker, a barber, or a bus driver, or something else in that same bunch (25 options)?",
          yes: {
            kind: 'question',
            text: "Is it a banker, a barber, or a bus driver, or something else in that same bunch (13 options)?",
            yes: {
              kind: 'question',
              text: "Is it a banker, a barber, or a bus driver, or something else in that same bunch (7 options)?",
              yes: {
                kind: 'question',
                text: "Is it a banker, a barber, a bus driver, or a carpenter?",
                yes: {
                  kind: 'question',
                  text: "Is it a banker or a barber?",
                  yes: {
                    kind: 'question',
                    text: "Is it a banker?",
                    yes: { kind: 'guess', name: "a banker" },
                    no: { kind: 'guess', name: "a barber" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a bus driver?",
                    yes: { kind: 'guess', name: "a bus driver" },
                    no: { kind: 'guess', name: "a carpenter" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a cashier or a CEO?",
                  yes: {
                    kind: 'question',
                    text: "Is it a cashier?",
                    yes: { kind: 'guess', name: "a cashier" },
                    no: { kind: 'guess', name: "a CEO" },
                  },
                  no: { kind: 'guess', name: "a chef" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a coach, a construction worker, or a dancer?",
                yes: {
                  kind: 'question',
                  text: "Is it a coach or a construction worker?",
                  yes: {
                    kind: 'question',
                    text: "Is it a coach?",
                    yes: { kind: 'guess', name: "a coach" },
                    no: { kind: 'guess', name: "a construction worker" },
                  },
                  no: { kind: 'guess', name: "a dancer" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a dentist or a doctor?",
                  yes: {
                    kind: 'question',
                    text: "Is it a dentist?",
                    yes: { kind: 'guess', name: "a dentist" },
                    no: { kind: 'guess', name: "a doctor" },
                  },
                  no: { kind: 'guess', name: "a farmer" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a firefighter, a hairdresser, or a janitor, or something else in that same bunch (6 options)?",
              yes: {
                kind: 'question',
                text: "Is it a firefighter, a hairdresser, or a janitor?",
                yes: {
                  kind: 'question',
                  text: "Is it a firefighter or a hairdresser?",
                  yes: {
                    kind: 'question',
                    text: "Is it a firefighter?",
                    yes: { kind: 'guess', name: "a firefighter" },
                    no: { kind: 'guess', name: "a hairdresser" },
                  },
                  no: { kind: 'guess', name: "a janitor" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a journalist or a judge?",
                  yes: {
                    kind: 'question',
                    text: "Is it a journalist?",
                    yes: { kind: 'guess', name: "a journalist" },
                    no: { kind: 'guess', name: "a judge" },
                  },
                  no: { kind: 'guess', name: "a lawyer" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a librarian, a lifeguard, or a mailman?",
                yes: {
                  kind: 'question',
                  text: "Is it a librarian or a lifeguard?",
                  yes: {
                    kind: 'question',
                    text: "Is it a librarian?",
                    yes: { kind: 'guess', name: "a librarian" },
                    no: { kind: 'guess', name: "a lifeguard" },
                  },
                  no: { kind: 'guess', name: "a mailman" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a mechanic or a musician?",
                  yes: {
                    kind: 'question',
                    text: "Is it a mechanic?",
                    yes: { kind: 'guess', name: "a mechanic" },
                    no: { kind: 'guess', name: "a musician" },
                  },
                  no: { kind: 'guess', name: "a nurse" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Is it a paramedic, a pharmacist, or a photographer, or something else in that same bunch (13 options)?",
            yes: {
              kind: 'question',
              text: "Is it a paramedic, a pharmacist, or a photographer, or something else in that same bunch (7 options)?",
              yes: {
                kind: 'question',
                text: "Is it a paramedic, a pharmacist, a photographer, or a pilot?",
                yes: {
                  kind: 'question',
                  text: "Is it a paramedic or a pharmacist?",
                  yes: {
                    kind: 'question',
                    text: "Is it a paramedic?",
                    yes: { kind: 'guess', name: "a paramedic" },
                    no: { kind: 'guess', name: "a pharmacist" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a photographer?",
                    yes: { kind: 'guess', name: "a photographer" },
                    no: { kind: 'guess', name: "a pilot" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a plumber or a police officer?",
                  yes: {
                    kind: 'question',
                    text: "Is it a plumber?",
                    yes: { kind: 'guess', name: "a plumber" },
                    no: { kind: 'guess', name: "a police officer" },
                  },
                  no: { kind: 'guess', name: "a politician" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a realtor, a referee, or a scientist?",
                yes: {
                  kind: 'question',
                  text: "Is it a realtor or a referee?",
                  yes: {
                    kind: 'question',
                    text: "Is it a realtor?",
                    yes: { kind: 'guess', name: "a realtor" },
                    no: { kind: 'guess', name: "a referee" },
                  },
                  no: { kind: 'guess', name: "a scientist" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a security guard or a software developer?",
                  yes: {
                    kind: 'question',
                    text: "Is it a security guard?",
                    yes: { kind: 'guess', name: "a security guard" },
                    no: { kind: 'guess', name: "a software developer" },
                  },
                  no: { kind: 'guess', name: "a soldier" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a taxi driver, a teacher, or a truck driver, or something else in that same bunch (6 options)?",
              yes: {
                kind: 'question',
                text: "Is it a taxi driver, a teacher, or a truck driver?",
                yes: {
                  kind: 'question',
                  text: "Is it a taxi driver or a teacher?",
                  yes: {
                    kind: 'question',
                    text: "Is it a taxi driver?",
                    yes: { kind: 'guess', name: "a taxi driver" },
                    no: { kind: 'guess', name: "a teacher" },
                  },
                  no: { kind: 'guess', name: "a truck driver" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a vet or a waiter?",
                  yes: {
                    kind: 'question',
                    text: "Is it a vet?",
                    yes: { kind: 'guess', name: "a vet" },
                    no: { kind: 'guess', name: "a waiter" },
                  },
                  no: { kind: 'guess', name: "a writer" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it an accountant, an actor, or an artist?",
                yes: {
                  kind: 'question',
                  text: "Is it an accountant or an actor?",
                  yes: {
                    kind: 'question',
                    text: "Is it an accountant?",
                    yes: { kind: 'guess', name: "an accountant" },
                    no: { kind: 'guess', name: "an actor" },
                  },
                  no: { kind: 'guess', name: "an artist" },
                },
                no: {
                  kind: 'question',
                  text: "Is it an astronaut or an electrician?",
                  yes: {
                    kind: 'question',
                    text: "Is it an astronaut?",
                    yes: { kind: 'guess', name: "an astronaut" },
                    no: { kind: 'guess', name: "an electrician" },
                  },
                  no: { kind: 'guess', name: "an engineer" },
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
            text: "Is it Abraham Lincoln, Albert Einstein, or Alexander Graham Bell, or something else in that same bunch (50 options)?",
            yes: {
              kind: 'question',
              text: "Is it Abraham Lincoln, Albert Einstein, or Alexander Graham Bell, or something else in that same bunch (25 options)?",
              yes: {
                kind: 'question',
                text: "Is it Abraham Lincoln, Albert Einstein, or Alexander Graham Bell, or something else in that same bunch (13 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it Abraham Lincoln, Albert Einstein, or Alexander Graham Bell, or something else in that same bunch (7 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it Abraham Lincoln, Albert Einstein, Alexander Graham Bell, or Alexander the Great?",
                    yes: {
                      kind: 'question',
                      text: "Is it Abraham Lincoln or Albert Einstein?",
                      yes: {
                        kind: 'question',
                        text: "Is it Abraham Lincoln?",
                        yes: { kind: 'guess', name: "Abraham Lincoln" },
                        no: { kind: 'guess', name: "Albert Einstein" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Alexander Graham Bell?",
                        yes: { kind: 'guess', name: "Alexander Graham Bell" },
                        no: { kind: 'guess', name: "Alexander the Great" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Amelia Earhart or Andy Warhol?",
                      yes: {
                        kind: 'question',
                        text: "Is it Amelia Earhart?",
                        yes: { kind: 'guess', name: "Amelia Earhart" },
                        no: { kind: 'guess', name: "Andy Warhol" },
                      },
                      no: { kind: 'guess', name: "Angelina Jolie" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name have more than one word?",
                    yes: {
                      kind: 'question',
                      text: "Is it Anne Frank or Babe Ruth?",
                      yes: {
                        kind: 'question',
                        text: "Is it Anne Frank?",
                        yes: { kind: 'guess', name: "Anne Frank" },
                        no: { kind: 'guess', name: "Babe Ruth" },
                      },
                      no: { kind: 'guess', name: "Barack Obama" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Aristotle or Beethoven?",
                      yes: {
                        kind: 'question',
                        text: "Is it Aristotle?",
                        yes: { kind: 'guess', name: "Aristotle" },
                        no: { kind: 'guess', name: "Beethoven" },
                      },
                      no: { kind: 'guess', name: "Beyoncé" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name have more than one word?",
                  yes: {
                    kind: 'question',
                    text: "Is it Bill Gates, Brad Pitt, Charles Darwin, or Chris Hemsworth?",
                    yes: {
                      kind: 'question',
                      text: "Is it Bill Gates or Brad Pitt?",
                      yes: {
                        kind: 'question',
                        text: "Is it Bill Gates?",
                        yes: { kind: 'guess', name: "Bill Gates" },
                        no: { kind: 'guess', name: "Brad Pitt" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Charles Darwin?",
                        yes: { kind: 'guess', name: "Charles Darwin" },
                        no: { kind: 'guess', name: "Chris Hemsworth" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Cristiano Ronaldo or Dalai Lama?",
                      yes: {
                        kind: 'question',
                        text: "Is it Cristiano Ronaldo?",
                        yes: { kind: 'guess', name: "Cristiano Ronaldo" },
                        no: { kind: 'guess', name: "Dalai Lama" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Donald Trump?",
                        yes: { kind: 'guess', name: "Donald Trump" },
                        no: { kind: 'guess', name: "Dwayne Johnson" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Buddha or Cleopatra?",
                    yes: {
                      kind: 'question',
                      text: "Is it Buddha?",
                      yes: { kind: 'guess', name: "Buddha" },
                      no: { kind: 'guess', name: "Cleopatra" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Confucius?",
                      yes: { kind: 'guess', name: "Confucius" },
                      no: { kind: 'guess', name: "Drake" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Ed Sheeran, Ellen DeGeneres, or Elon Musk, or something else in that same bunch (13 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it Ed Sheeran, Ellen DeGeneres, or Elon Musk, or something else in that same bunch (7 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it Ed Sheeran, Ellen DeGeneres, Elon Musk, or Elvis Presley?",
                    yes: {
                      kind: 'question',
                      text: "Is it Ed Sheeran or Ellen DeGeneres?",
                      yes: {
                        kind: 'question',
                        text: "Is it Ed Sheeran?",
                        yes: { kind: 'guess', name: "Ed Sheeran" },
                        no: { kind: 'guess', name: "Ellen DeGeneres" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Elon Musk?",
                        yes: { kind: 'guess', name: "Elon Musk" },
                        no: { kind: 'guess', name: "Elvis Presley" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Franklin D. Roosevelt or Frederick Douglass?",
                      yes: {
                        kind: 'question',
                        text: "Is it Franklin D. Roosevelt?",
                        yes: { kind: 'guess', name: "Franklin D. Roosevelt" },
                        no: { kind: 'guess', name: "Frederick Douglass" },
                      },
                      no: { kind: 'guess', name: "Frida Kahlo" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Genghis Khan, George Washington, or Greta Thunberg?",
                    yes: {
                      kind: 'question',
                      text: "Is it Genghis Khan or George Washington?",
                      yes: {
                        kind: 'question',
                        text: "Is it Genghis Khan?",
                        yes: { kind: 'guess', name: "Genghis Khan" },
                        no: { kind: 'guess', name: "George Washington" },
                      },
                      no: { kind: 'guess', name: "Greta Thunberg" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Harriet Tubman or Helen Keller?",
                      yes: {
                        kind: 'question',
                        text: "Is it Harriet Tubman?",
                        yes: { kind: 'guess', name: "Harriet Tubman" },
                        no: { kind: 'guess', name: "Helen Keller" },
                      },
                      no: { kind: 'guess', name: "Isaac Newton" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Jeff Bezos, Jennifer Lawrence, or Jesus, or something else in that same bunch (6 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it Jeff Bezos, Jennifer Lawrence, or Jesus?",
                    yes: {
                      kind: 'question',
                      text: "Does its name have more than one word?",
                      yes: {
                        kind: 'question',
                        text: "Is it Jeff Bezos?",
                        yes: { kind: 'guess', name: "Jeff Bezos" },
                        no: { kind: 'guess', name: "Jennifer Lawrence" },
                      },
                      no: { kind: 'guess', name: "Jesus" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Joan of Arc or Joe Biden?",
                      yes: {
                        kind: 'question',
                        text: "Is it Joan of Arc?",
                        yes: { kind: 'guess', name: "Joan of Arc" },
                        no: { kind: 'guess', name: "Joe Biden" },
                      },
                      no: { kind: 'guess', name: "John F. Kennedy" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Julius Caesar, Kamala Harris, or LeBron James?",
                    yes: {
                      kind: 'question',
                      text: "Is it Julius Caesar or Kamala Harris?",
                      yes: {
                        kind: 'question',
                        text: "Is it Julius Caesar?",
                        yes: { kind: 'guess', name: "Julius Caesar" },
                        no: { kind: 'guess', name: "Kamala Harris" },
                      },
                      no: { kind: 'guess', name: "LeBron James" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Leonardo da Vinci or Leonardo DiCaprio?",
                      yes: {
                        kind: 'question',
                        text: "Is it Leonardo da Vinci?",
                        yes: { kind: 'guess', name: "Leonardo da Vinci" },
                        no: { kind: 'guess', name: "Leonardo DiCaprio" },
                      },
                      no: { kind: 'guess', name: "Lionel Messi" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it Madonna, Mahatma Gandhi, or Malala Yousafzai, or something else in that same bunch (25 options)?",
              yes: {
                kind: 'question',
                text: "Is it Madonna, Mahatma Gandhi, or Malala Yousafzai, or something else in that same bunch (13 options)?",
                yes: {
                  kind: 'question',
                  text: "Does its name have more than one word?",
                  yes: {
                    kind: 'question',
                    text: "Is it Mahatma Gandhi, Malala Yousafzai, or Marie Curie, or something else in that same bunch (5 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it Mahatma Gandhi, Malala Yousafzai, or Marie Curie?",
                      yes: {
                        kind: 'question',
                        text: "Is it Mahatma Gandhi or Malala Yousafzai?",
                        yes: {
                          kind: 'question',
                          text: "Is it Mahatma Gandhi?",
                          yes: { kind: 'guess', name: "Mahatma Gandhi" },
                          no: { kind: 'guess', name: "Malala Yousafzai" },
                        },
                        no: { kind: 'guess', name: "Marie Curie" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Marilyn Monroe?",
                        yes: { kind: 'guess', name: "Marilyn Monroe" },
                        no: { kind: 'guess', name: "Mark Zuckerberg" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Martin Luther King Jr. or Meryl Streep?",
                      yes: {
                        kind: 'question',
                        text: "Is it Martin Luther King Jr.?",
                        yes: { kind: 'guess', name: "Martin Luther King Jr." },
                        no: { kind: 'guess', name: "Meryl Streep" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Michael Jackson?",
                        yes: { kind: 'guess', name: "Michael Jackson" },
                        no: { kind: 'guess', name: "Michael Jordan" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Madonna or Moses?",
                    yes: {
                      kind: 'question',
                      text: "Is it Madonna?",
                      yes: { kind: 'guess', name: "Madonna" },
                      no: { kind: 'guess', name: "Moses" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Mozart?",
                      yes: { kind: 'guess', name: "Mozart" },
                      no: { kind: 'guess', name: "Muhammad" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Muhammad Ali, Napoleon, or Neil Armstrong, or something else in that same bunch (6 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it Muhammad Ali, Napoleon, or Neil Armstrong?",
                    yes: {
                      kind: 'question',
                      text: "Does its name have more than one word?",
                      yes: {
                        kind: 'question',
                        text: "Is it Muhammad Ali?",
                        yes: { kind: 'guess', name: "Muhammad Ali" },
                        no: { kind: 'guess', name: "Neil Armstrong" },
                      },
                      no: { kind: 'guess', name: "Napoleon" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Nelson Mandela or Nikola Tesla?",
                      yes: {
                        kind: 'question',
                        text: "Is it Nelson Mandela?",
                        yes: { kind: 'guess', name: "Nelson Mandela" },
                        no: { kind: 'guess', name: "Nikola Tesla" },
                      },
                      no: { kind: 'guess', name: "Oprah Winfrey" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name have more than one word?",
                    yes: {
                      kind: 'question',
                      text: "Is it Pablo Picasso or Pope Francis?",
                      yes: {
                        kind: 'question',
                        text: "Is it Pablo Picasso?",
                        yes: { kind: 'guess', name: "Pablo Picasso" },
                        no: { kind: 'guess', name: "Pope Francis" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Princess Diana?",
                        yes: { kind: 'guess', name: "Princess Diana" },
                        no: { kind: 'guess', name: "Queen Elizabeth II" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Pelé?",
                      yes: { kind: 'guess', name: "Pelé" },
                      no: { kind: 'guess', name: "Plato" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Rihanna, Robert Downey Jr., or Rosa Parks, or something else in that same bunch (12 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it Rihanna, Robert Downey Jr., or Rosa Parks, or something else in that same bunch (6 options)?",
                  yes: {
                    kind: 'question',
                    text: "Does its name have more than one word?",
                    yes: {
                      kind: 'question',
                      text: "Is it Robert Downey Jr. or Rosa Parks?",
                      yes: {
                        kind: 'question',
                        text: "Is it Robert Downey Jr.?",
                        yes: { kind: 'guess', name: "Robert Downey Jr." },
                        no: { kind: 'guess', name: "Rosa Parks" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it Scarlett Johansson?",
                        yes: { kind: 'guess', name: "Scarlett Johansson" },
                        no: { kind: 'guess', name: "Serena Williams" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Rihanna?",
                      yes: { kind: 'guess', name: "Rihanna" },
                      no: { kind: 'guess', name: "Shakespeare" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Simone Biles, Socrates, or Stephen Hawking?",
                    yes: {
                      kind: 'question',
                      text: "Does its name have more than one word?",
                      yes: {
                        kind: 'question',
                        text: "Is it Simone Biles?",
                        yes: { kind: 'guess', name: "Simone Biles" },
                        no: { kind: 'guess', name: "Stephen Hawking" },
                      },
                      no: { kind: 'guess', name: "Socrates" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Steve Jobs or Taylor Swift?",
                      yes: {
                        kind: 'question',
                        text: "Is it Steve Jobs?",
                        yes: { kind: 'guess', name: "Steve Jobs" },
                        no: { kind: 'guess', name: "Taylor Swift" },
                      },
                      no: { kind: 'guess', name: "The Beatles" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Theodore Roosevelt, Thomas Edison, or Tiger Woods, or something else in that same bunch (6 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it Theodore Roosevelt, Thomas Edison, or Tiger Woods?",
                    yes: {
                      kind: 'question',
                      text: "Is it Theodore Roosevelt or Thomas Edison?",
                      yes: {
                        kind: 'question',
                        text: "Is it Theodore Roosevelt?",
                        yes: { kind: 'guess', name: "Theodore Roosevelt" },
                        no: { kind: 'guess', name: "Thomas Edison" },
                      },
                      no: { kind: 'guess', name: "Tiger Woods" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Tom Brady or Tom Hanks?",
                      yes: {
                        kind: 'question',
                        text: "Is it Tom Brady?",
                        yes: { kind: 'guess', name: "Tom Brady" },
                        no: { kind: 'guess', name: "Tom Hanks" },
                      },
                      no: { kind: 'guess', name: "Usain Bolt" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Vincent van Gogh, Vladimir Putin, or Will Smith?",
                    yes: {
                      kind: 'question',
                      text: "Is it Vincent van Gogh or Vladimir Putin?",
                      yes: {
                        kind: 'question',
                        text: "Is it Vincent van Gogh?",
                        yes: { kind: 'guess', name: "Vincent van Gogh" },
                        no: { kind: 'guess', name: "Vladimir Putin" },
                      },
                      no: { kind: 'guess', name: "Will Smith" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Winston Churchill or Wright brothers?",
                      yes: {
                        kind: 'question',
                        text: "Is it Winston Churchill?",
                        yes: { kind: 'guess', name: "Winston Churchill" },
                        no: { kind: 'guess', name: "Wright brothers" },
                      },
                      no: { kind: 'guess', name: "Xi Jinping" },
                    },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Is it a baby, a child, a neighbor, or a stranger?",
            yes: {
              kind: 'question',
              text: "Is it a baby or a child?",
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
              text: "Is it a teenager or a twin?",
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
            text: "Is it a beluga, a dolphin, or a manatee, or something else in that same bunch (6 options)?",
            yes: {
              kind: 'question',
              text: "Is it a beluga, a dolphin, or a manatee?",
              yes: {
                kind: 'question',
                text: "Is it a beluga or a dolphin?",
                yes: {
                  kind: 'question',
                  text: "Is it a beluga?",
                  yes: { kind: 'guess', name: "a beluga" },
                  no: { kind: 'guess', name: "a dolphin" },
                },
                no: { kind: 'guess', name: "a manatee" },
              },
              no: {
                kind: 'question',
                text: "Is it a narwhal or a porpoise?",
                yes: {
                  kind: 'question',
                  text: "Is it a narwhal?",
                  yes: { kind: 'guess', name: "a narwhal" },
                  no: { kind: 'guess', name: "a porpoise" },
                },
                no: { kind: 'guess', name: "a sea lion" },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a seal, a walrus, or a whale?",
              yes: {
                kind: 'question',
                text: "Is it a seal or a walrus?",
                yes: {
                  kind: 'question',
                  text: "Is it a seal?",
                  yes: { kind: 'guess', name: "a seal" },
                  no: { kind: 'guess', name: "a walrus" },
                },
                no: { kind: 'guess', name: "a whale" },
              },
              no: {
                kind: 'question',
                text: "Is it an orca?",
                yes: { kind: 'guess', name: "an orca" },
                no: { kind: 'guess', name: "an otter" },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Hard shell?",
            yes: {
              kind: 'question',
              text: "Is it a clam, a crab, or a crayfish, or something else in that same bunch (5 options)?",
              yes: {
                kind: 'question',
                text: "Is it a clam, a crab, or a crayfish?",
                yes: {
                  kind: 'question',
                  text: "Is it a clam or a crab?",
                  yes: {
                    kind: 'question',
                    text: "Is it a clam?",
                    yes: { kind: 'guess', name: "a clam" },
                    no: { kind: 'guess', name: "a crab" },
                  },
                  no: { kind: 'guess', name: "a crayfish" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a hermit crab?",
                  yes: { kind: 'guess', name: "a hermit crab" },
                  no: { kind: 'guess', name: "a lobster" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a mussel, a shrimp, or a snail?",
                yes: {
                  kind: 'question',
                  text: "Is it a mussel or a shrimp?",
                  yes: {
                    kind: 'question',
                    text: "Is it a mussel?",
                    yes: { kind: 'guess', name: "a mussel" },
                    no: { kind: 'guess', name: "a shrimp" },
                  },
                  no: { kind: 'guess', name: "a snail" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a turtle?",
                  yes: { kind: 'guess', name: "a turtle" },
                  no: { kind: 'guess', name: "an oyster" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a barracuda, a bass, or a catfish, or something else in that same bunch (12 options)?",
              yes: {
                kind: 'question',
                text: "Is it a barracuda, a bass, or a catfish, or something else in that same bunch (6 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a barracuda, a bass, or a catfish?",
                  yes: {
                    kind: 'question',
                    text: "Is it a barracuda or a bass?",
                    yes: {
                      kind: 'question',
                      text: "Is it a barracuda?",
                      yes: { kind: 'guess', name: "a barracuda" },
                      no: { kind: 'guess', name: "a bass" },
                    },
                    no: { kind: 'guess', name: "a catfish" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a clownfish or a coral?",
                    yes: {
                      kind: 'question',
                      text: "Is it a clownfish?",
                      yes: { kind: 'guess', name: "a clownfish" },
                      no: { kind: 'guess', name: "a coral" },
                    },
                    no: { kind: 'guess', name: "a goldfish" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a jellyfish, a plankton, or a pufferfish?",
                  yes: {
                    kind: 'question',
                    text: "Is it a jellyfish or a plankton?",
                    yes: {
                      kind: 'question',
                      text: "Is it a jellyfish?",
                      yes: { kind: 'guess', name: "a jellyfish" },
                      no: { kind: 'guess', name: "a plankton" },
                    },
                    no: { kind: 'guess', name: "a pufferfish" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a ray or a salmon?",
                    yes: {
                      kind: 'question',
                      text: "Is it a ray?",
                      yes: { kind: 'guess', name: "a ray" },
                      no: { kind: 'guess', name: "a salmon" },
                    },
                    no: { kind: 'guess', name: "a sea cucumber" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a sea urchin, a seahorse, or a shark, or something else in that same bunch (6 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a sea urchin, a seahorse, or a shark?",
                  yes: {
                    kind: 'question',
                    text: "Is it a sea urchin or a seahorse?",
                    yes: {
                      kind: 'question',
                      text: "Is it a sea urchin?",
                      yes: { kind: 'guess', name: "a sea urchin" },
                      no: { kind: 'guess', name: "a seahorse" },
                    },
                    no: { kind: 'guess', name: "a shark" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a squid or a starfish?",
                    yes: {
                      kind: 'question',
                      text: "Is it a squid?",
                      yes: { kind: 'guess', name: "a squid" },
                      no: { kind: 'guess', name: "a starfish" },
                    },
                    no: { kind: 'guess', name: "a stingray" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a swordfish, a trout, or a tuna?",
                  yes: {
                    kind: 'question',
                    text: "Is it a swordfish or a trout?",
                    yes: {
                      kind: 'question',
                      text: "Is it a swordfish?",
                      yes: { kind: 'guess', name: "a swordfish" },
                      no: { kind: 'guess', name: "a trout" },
                    },
                    no: { kind: 'guess', name: "a tuna" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it an angelfish or an eel?",
                    yes: {
                      kind: 'question',
                      text: "Is it an angelfish?",
                      yes: { kind: 'guess', name: "an angelfish" },
                      no: { kind: 'guess', name: "an eel" },
                    },
                    no: { kind: 'guess', name: "an octopus" },
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
                text: "Is it a falcon, a hawk, or a vulture?",
                yes: {
                  kind: 'question',
                  text: "Is it a falcon or a hawk?",
                  yes: {
                    kind: 'question',
                    text: "Is it a falcon?",
                    yes: { kind: 'guess', name: "a falcon" },
                    no: { kind: 'guess', name: "a hawk" },
                  },
                  no: { kind: 'guess', name: "a vulture" },
                },
                no: {
                  kind: 'question',
                  text: "Is it an eagle or an osprey?",
                  yes: {
                    kind: 'question',
                    text: "Is it an eagle?",
                    yes: { kind: 'guess', name: "an eagle" },
                    no: { kind: 'guess', name: "an osprey" },
                  },
                  no: { kind: 'guess', name: "an owl" },
                },
              },
              no: {
                kind: 'question',
                text: "Farm bird?",
                yes: {
                  kind: 'question',
                  text: "Is it a chicken, a duck, or a goose?",
                  yes: {
                    kind: 'question',
                    text: "Is it a chicken or a duck?",
                    yes: {
                      kind: 'question',
                      text: "Is it a chicken?",
                      yes: { kind: 'guess', name: "a chicken" },
                      no: { kind: 'guess', name: "a duck" },
                    },
                    no: { kind: 'guess', name: "a goose" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a hen or a rooster?",
                    yes: {
                      kind: 'question',
                      text: "Is it a hen?",
                      yes: { kind: 'guess', name: "a hen" },
                      no: { kind: 'guess', name: "a rooster" },
                    },
                    no: { kind: 'guess', name: "a turkey" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a blue jay, a canary, or a cardinal, or something else in that same bunch (14 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a blue jay, a canary, or a cardinal, or something else in that same bunch (7 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a blue jay, a canary, a cardinal, or a chickadee?",
                      yes: {
                        kind: 'question',
                        text: "Is it a blue jay or a canary?",
                        yes: {
                          kind: 'question',
                          text: "Is it a blue jay?",
                          yes: { kind: 'guess', name: "a blue jay" },
                          no: { kind: 'guess', name: "a canary" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a cardinal?",
                          yes: { kind: 'guess', name: "a cardinal" },
                          no: { kind: 'guess', name: "a chickadee" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a cockatoo or a crane?",
                        yes: {
                          kind: 'question',
                          text: "Is it a cockatoo?",
                          yes: { kind: 'guess', name: "a cockatoo" },
                          no: { kind: 'guess', name: "a crane" },
                        },
                        no: { kind: 'guess', name: "a crow" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a dove, a flamingo, a hummingbird, or a kiwi bird?",
                      yes: {
                        kind: 'question',
                        text: "Is it a dove or a flamingo?",
                        yes: {
                          kind: 'question',
                          text: "Is it a dove?",
                          yes: { kind: 'guess', name: "a dove" },
                          no: { kind: 'guess', name: "a flamingo" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a hummingbird?",
                          yes: { kind: 'guess', name: "a hummingbird" },
                          no: { kind: 'guess', name: "a kiwi bird" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a macaw or a parrot?",
                        yes: {
                          kind: 'question',
                          text: "Is it a macaw?",
                          yes: { kind: 'guess', name: "a macaw" },
                          no: { kind: 'guess', name: "a parrot" },
                        },
                        no: { kind: 'guess', name: "a peacock" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a pelican, a penguin, or a pigeon, or something else in that same bunch (7 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a pelican, a penguin, a pigeon, or a raven?",
                      yes: {
                        kind: 'question',
                        text: "Is it a pelican or a penguin?",
                        yes: {
                          kind: 'question',
                          text: "Is it a pelican?",
                          yes: { kind: 'guess', name: "a pelican" },
                          no: { kind: 'guess', name: "a penguin" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a pigeon?",
                          yes: { kind: 'guess', name: "a pigeon" },
                          no: { kind: 'guess', name: "a raven" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a robin or a seagull?",
                        yes: {
                          kind: 'question',
                          text: "Is it a robin?",
                          yes: { kind: 'guess', name: "a robin" },
                          no: { kind: 'guess', name: "a seagull" },
                        },
                        no: { kind: 'guess', name: "a sparrow" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a stork, a swan, or a toucan?",
                      yes: {
                        kind: 'question',
                        text: "Is it a stork or a swan?",
                        yes: {
                          kind: 'question',
                          text: "Is it a stork?",
                          yes: { kind: 'guess', name: "a stork" },
                          no: { kind: 'guess', name: "a swan" },
                        },
                        no: { kind: 'guess', name: "a toucan" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a woodpecker or an emu?",
                        yes: {
                          kind: 'question',
                          text: "Is it a woodpecker?",
                          yes: { kind: 'guess', name: "a woodpecker" },
                          no: { kind: 'guess', name: "an emu" },
                        },
                        no: { kind: 'guess', name: "an ostrich" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a bat, a bee, or a beetle, or something else in that same bunch (8 options)?",
              yes: {
                kind: 'question',
                text: "Is it a bat, a bee, a beetle, or a bumblebee?",
                yes: {
                  kind: 'question',
                  text: "Is it a bat or a bee?",
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
                  text: "Is it a butterfly or a cicada?",
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
                text: "Is it a firefly, a fly, a grasshopper, or a hornet?",
                yes: {
                  kind: 'question',
                  text: "Is it a firefly or a fly?",
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
                  text: "Is it a ladybug or a mosquito?",
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
                  text: "Is it a chinchilla, a ferret, or a gerbil, or something else in that same bunch (5 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a chinchilla, a ferret, or a gerbil?",
                    yes: {
                      kind: 'question',
                      text: "Is it a chinchilla or a ferret?",
                      yes: {
                        kind: 'question',
                        text: "Is it a chinchilla?",
                        yes: { kind: 'guess', name: "a chinchilla" },
                        no: { kind: 'guess', name: "a ferret" },
                      },
                      no: { kind: 'guess', name: "a gerbil" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a guinea pig?",
                      yes: { kind: 'guess', name: "a guinea pig" },
                      no: { kind: 'guess', name: "a hamster" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a hedgehog or a mouse?",
                    yes: {
                      kind: 'question',
                      text: "Is it a hedgehog?",
                      yes: { kind: 'guess', name: "a hedgehog" },
                      no: { kind: 'guess', name: "a mouse" },
                    },
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
                text: "Is it a cow, a donkey, or a goat, or something else in that same bunch (5 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a cow, a donkey, or a goat?",
                  yes: {
                    kind: 'question',
                    text: "Is it a cow or a donkey?",
                    yes: {
                      kind: 'question',
                      text: "Is it a cow?",
                      yes: { kind: 'guess', name: "a cow" },
                      no: { kind: 'guess', name: "a donkey" },
                    },
                    no: { kind: 'guess', name: "a goat" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a horse?",
                    yes: { kind: 'guess', name: "a horse" },
                    no: { kind: 'guess', name: "a llama" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a mule, a pig, or a pony?",
                  yes: {
                    kind: 'question',
                    text: "Is it a mule or a pig?",
                    yes: {
                      kind: 'question',
                      text: "Is it a mule?",
                      yes: { kind: 'guess', name: "a mule" },
                      no: { kind: 'guess', name: "a pig" },
                    },
                    no: { kind: 'guess', name: "a pony" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a sheep?",
                    yes: { kind: 'guess', name: "a sheep" },
                    no: { kind: 'guess', name: "an alpaca" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Big cat?",
                yes: {
                  kind: 'question',
                  text: "Is it a cheetah, a cougar, a jaguar, or a leopard?",
                  yes: {
                    kind: 'question',
                    text: "Is it a cheetah or a cougar?",
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
                    text: "Is it a lion or a lynx?",
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
                  text: "Is it a baboon, a badger, or a bear, or something else in that same bunch (44 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a baboon, a badger, or a bear, or something else in that same bunch (22 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a baboon, a badger, or a bear, or something else in that same bunch (11 options)?",
                      yes: {
                        kind: 'question',
                        text: "Is it a baboon, a badger, or a bear, or something else in that same bunch (6 options)?",
                        yes: {
                          kind: 'question',
                          text: "Is it a baboon, a badger, or a bear?",
                          yes: {
                            kind: 'question',
                            text: "Is it a baboon or a badger?",
                            yes: {
                              kind: 'question',
                              text: "Is it a baboon?",
                              yes: { kind: 'guess', name: "a baboon" },
                              no: { kind: 'guess', name: "a badger" },
                            },
                            no: { kind: 'guess', name: "a bear" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a beaver or a bison?",
                            yes: {
                              kind: 'question',
                              text: "Is it a beaver?",
                              yes: { kind: 'guess', name: "a beaver" },
                              no: { kind: 'guess', name: "a bison" },
                            },
                            no: { kind: 'guess', name: "a boar" },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a bobcat, a buffalo, or a camel?",
                          yes: {
                            kind: 'question',
                            text: "Is it a bobcat or a buffalo?",
                            yes: {
                              kind: 'question',
                              text: "Is it a bobcat?",
                              yes: { kind: 'guess', name: "a bobcat" },
                              no: { kind: 'guess', name: "a buffalo" },
                            },
                            no: { kind: 'guess', name: "a camel" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a centipede?",
                            yes: { kind: 'guess', name: "a centipede" },
                            no: { kind: 'guess', name: "a chameleon" },
                          },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a chimpanzee, a chipmunk, or a cobra, or something else in that same bunch (6 options)?",
                        yes: {
                          kind: 'question',
                          text: "Is it a chimpanzee, a chipmunk, or a cobra?",
                          yes: {
                            kind: 'question',
                            text: "Is it a chimpanzee or a chipmunk?",
                            yes: {
                              kind: 'question',
                              text: "Is it a chimpanzee?",
                              yes: { kind: 'guess', name: "a chimpanzee" },
                              no: { kind: 'guess', name: "a chipmunk" },
                            },
                            no: { kind: 'guess', name: "a cobra" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a cockroach or a coyote?",
                            yes: {
                              kind: 'question',
                              text: "Is it a cockroach?",
                              yes: { kind: 'guess', name: "a cockroach" },
                              no: { kind: 'guess', name: "a coyote" },
                            },
                            no: { kind: 'guess', name: "a crocodile" },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a deer, a flea, or a fox?",
                          yes: {
                            kind: 'question',
                            text: "Is it a deer or a flea?",
                            yes: {
                              kind: 'question',
                              text: "Is it a deer?",
                              yes: { kind: 'guess', name: "a deer" },
                              no: { kind: 'guess', name: "a flea" },
                            },
                            no: { kind: 'guess', name: "a fox" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a frog?",
                            yes: { kind: 'guess', name: "a frog" },
                            no: { kind: 'guess', name: "a gazelle" },
                          },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a gecko, a gibbon, or a giraffe, or something else in that same bunch (11 options)?",
                      yes: {
                        kind: 'question',
                        text: "Is it a gecko, a gibbon, or a giraffe, or something else in that same bunch (6 options)?",
                        yes: {
                          kind: 'question',
                          text: "Is it a gecko, a gibbon, or a giraffe?",
                          yes: {
                            kind: 'question',
                            text: "Is it a gecko or a gibbon?",
                            yes: {
                              kind: 'question',
                              text: "Is it a gecko?",
                              yes: { kind: 'guess', name: "a gecko" },
                              no: { kind: 'guess', name: "a gibbon" },
                            },
                            no: { kind: 'guess', name: "a giraffe" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a gorilla or a grizzly bear?",
                            yes: {
                              kind: 'question',
                              text: "Is it a gorilla?",
                              yes: { kind: 'guess', name: "a gorilla" },
                              no: { kind: 'guess', name: "a grizzly bear" },
                            },
                            no: { kind: 'guess', name: "a groundhog" },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a hippo, a hyena, or a kangaroo?",
                          yes: {
                            kind: 'question',
                            text: "Is it a hippo or a hyena?",
                            yes: {
                              kind: 'question',
                              text: "Is it a hippo?",
                              yes: { kind: 'guess', name: "a hippo" },
                              no: { kind: 'guess', name: "a hyena" },
                            },
                            no: { kind: 'guess', name: "a kangaroo" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a koala?",
                            yes: { kind: 'guess', name: "a koala" },
                            no: { kind: 'guess', name: "a komodo dragon" },
                          },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a lemur, a lizard, or a mandrill, or something else in that same bunch (6 options)?",
                        yes: {
                          kind: 'question',
                          text: "Is it a lemur, a lizard, or a mandrill?",
                          yes: {
                            kind: 'question',
                            text: "Is it a lemur or a lizard?",
                            yes: {
                              kind: 'question',
                              text: "Is it a lemur?",
                              yes: { kind: 'guess', name: "a lemur" },
                              no: { kind: 'guess', name: "a lizard" },
                            },
                            no: { kind: 'guess', name: "a mandrill" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a meerkat or a millipede?",
                            yes: {
                              kind: 'question',
                              text: "Is it a meerkat?",
                              yes: { kind: 'guess', name: "a meerkat" },
                              no: { kind: 'guess', name: "a millipede" },
                            },
                            no: { kind: 'guess', name: "a mole" },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a monkey, a moose, or a newt?",
                          yes: {
                            kind: 'question',
                            text: "Is it a monkey or a moose?",
                            yes: {
                              kind: 'question',
                              text: "Is it a monkey?",
                              yes: { kind: 'guess', name: "a monkey" },
                              no: { kind: 'guess', name: "a moose" },
                            },
                            no: { kind: 'guess', name: "a newt" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a panda?",
                            yes: { kind: 'guess', name: "a panda" },
                            no: { kind: 'guess', name: "a platypus" },
                          },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a polar bear, a porcupine, or a prairie dog, or something else in that same bunch (22 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a polar bear, a porcupine, or a prairie dog, or something else in that same bunch (11 options)?",
                      yes: {
                        kind: 'question',
                        text: "Is it a polar bear, a porcupine, or a prairie dog, or something else in that same bunch (6 options)?",
                        yes: {
                          kind: 'question',
                          text: "Is it a polar bear, a porcupine, or a prairie dog?",
                          yes: {
                            kind: 'question',
                            text: "Is it a polar bear or a porcupine?",
                            yes: {
                              kind: 'question',
                              text: "Is it a polar bear?",
                              yes: { kind: 'guess', name: "a polar bear" },
                              no: { kind: 'guess', name: "a porcupine" },
                            },
                            no: { kind: 'guess', name: "a prairie dog" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a python or a raccoon?",
                            yes: {
                              kind: 'question',
                              text: "Is it a python?",
                              yes: { kind: 'guess', name: "a python" },
                              no: { kind: 'guess', name: "a raccoon" },
                            },
                            no: { kind: 'guess', name: "a rattlesnake" },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a reindeer, a rhino, or a salamander?",
                          yes: {
                            kind: 'question',
                            text: "Is it a reindeer or a rhino?",
                            yes: {
                              kind: 'question',
                              text: "Is it a reindeer?",
                              yes: { kind: 'guess', name: "a reindeer" },
                              no: { kind: 'guess', name: "a rhino" },
                            },
                            no: { kind: 'guess', name: "a salamander" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a scorpion?",
                            yes: { kind: 'guess', name: "a scorpion" },
                            no: { kind: 'guess', name: "a shrew" },
                          },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a skunk, a sloth, or a slug, or something else in that same bunch (6 options)?",
                        yes: {
                          kind: 'question',
                          text: "Is it a skunk, a sloth, or a slug?",
                          yes: {
                            kind: 'question',
                            text: "Is it a skunk or a sloth?",
                            yes: {
                              kind: 'question',
                              text: "Is it a skunk?",
                              yes: { kind: 'guess', name: "a skunk" },
                              no: { kind: 'guess', name: "a sloth" },
                            },
                            no: { kind: 'guess', name: "a slug" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a snake or a spider?",
                            yes: {
                              kind: 'question',
                              text: "Is it a snake?",
                              yes: { kind: 'guess', name: "a snake" },
                              no: { kind: 'guess', name: "a spider" },
                            },
                            no: { kind: 'guess', name: "a squirrel" },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a tapir, a tarantula, or a tasmanian devil?",
                          yes: {
                            kind: 'question',
                            text: "Is it a tapir or a tarantula?",
                            yes: {
                              kind: 'question',
                              text: "Is it a tapir?",
                              yes: { kind: 'guess', name: "a tapir" },
                              no: { kind: 'guess', name: "a tarantula" },
                            },
                            no: { kind: 'guess', name: "a tasmanian devil" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a termite?",
                            yes: { kind: 'guess', name: "a termite" },
                            no: { kind: 'guess', name: "a tick" },
                          },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a toad, a warthog, or a water buffalo, or something else in that same bunch (11 options)?",
                      yes: {
                        kind: 'question',
                        text: "Is it a toad, a warthog, or a water buffalo, or something else in that same bunch (6 options)?",
                        yes: {
                          kind: 'question',
                          text: "Is it a toad, a warthog, or a water buffalo?",
                          yes: {
                            kind: 'question',
                            text: "Is it a toad or a warthog?",
                            yes: {
                              kind: 'question',
                              text: "Is it a toad?",
                              yes: { kind: 'guess', name: "a toad" },
                              no: { kind: 'guess', name: "a warthog" },
                            },
                            no: { kind: 'guess', name: "a water buffalo" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a weasel or a wildcat?",
                            yes: {
                              kind: 'question',
                              text: "Is it a weasel?",
                              yes: { kind: 'guess', name: "a weasel" },
                              no: { kind: 'guess', name: "a wildcat" },
                            },
                            no: { kind: 'guess', name: "a wildebeest" },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a wolf, a wombat, or a worm?",
                          yes: {
                            kind: 'question',
                            text: "Is it a wolf or a wombat?",
                            yes: {
                              kind: 'question',
                              text: "Is it a wolf?",
                              yes: { kind: 'guess', name: "a wolf" },
                              no: { kind: 'guess', name: "a wombat" },
                            },
                            no: { kind: 'guess', name: "a worm" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it a yak?",
                            yes: { kind: 'guess', name: "a yak" },
                            no: { kind: 'guess', name: "a zebra" },
                          },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it an alligator, an ant, or an antelope, or something else in that same bunch (5 options)?",
                        yes: {
                          kind: 'question',
                          text: "Is it an alligator, an ant, or an antelope?",
                          yes: {
                            kind: 'question',
                            text: "Is it an alligator or an ant?",
                            yes: {
                              kind: 'question',
                              text: "Is it an alligator?",
                              yes: { kind: 'guess', name: "an alligator" },
                              no: { kind: 'guess', name: "an ant" },
                            },
                            no: { kind: 'guess', name: "an antelope" },
                          },
                          no: {
                            kind: 'question',
                            text: "Is it an armadillo?",
                            yes: { kind: 'guess', name: "an armadillo" },
                            no: { kind: 'guess', name: "an earthworm" },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it an elephant, an elk, or an iguana?",
                          yes: {
                            kind: 'question',
                            text: "Is it an elephant or an elk?",
                            yes: {
                              kind: 'question',
                              text: "Is it an elephant?",
                              yes: { kind: 'guess', name: "an elephant" },
                              no: { kind: 'guess', name: "an elk" },
                            },
                            no: { kind: 'guess', name: "an iguana" },
                          },
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
      no: {
        kind: 'question',
        text: "Is it a plant?",
        yes: {
          kind: 'question',
          text: "Tree?",
          yes: {
            kind: 'question',
            text: "Is it a baobab, a birch, or a bonsai tree, or something else in that same bunch (9 options)?",
            yes: {
              kind: 'question',
              text: "Is it a baobab, a birch, or a bonsai tree, or something else in that same bunch (5 options)?",
              yes: {
                kind: 'question',
                text: "Is it a baobab, a birch, or a bonsai tree?",
                yes: {
                  kind: 'question',
                  text: "Is it a baobab or a birch?",
                  yes: {
                    kind: 'question',
                    text: "Is it a baobab?",
                    yes: { kind: 'guess', name: "a baobab" },
                    no: { kind: 'guess', name: "a birch" },
                  },
                  no: { kind: 'guess', name: "a bonsai tree" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a cedar?",
                  yes: { kind: 'guess', name: "a cedar" },
                  no: { kind: 'guess', name: "a cherry tree" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a Christmas tree or a dogwood?",
                yes: {
                  kind: 'question',
                  text: "Is it a Christmas tree?",
                  yes: { kind: 'guess', name: "a Christmas tree" },
                  no: { kind: 'guess', name: "a dogwood" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a fir?",
                  yes: { kind: 'guess', name: "a fir" },
                  no: { kind: 'guess', name: "a magnolia" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a maple tree, a palm tree, or a pine tree, or something else in that same bunch (5 options)?",
              yes: {
                kind: 'question',
                text: "Is it a maple tree, a palm tree, or a pine tree?",
                yes: {
                  kind: 'question',
                  text: "Is it a maple tree or a palm tree?",
                  yes: {
                    kind: 'question',
                    text: "Is it a maple tree?",
                    yes: { kind: 'guess', name: "a maple tree" },
                    no: { kind: 'guess', name: "a palm tree" },
                  },
                  no: { kind: 'guess', name: "a pine tree" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a redwood?",
                  yes: { kind: 'guess', name: "a redwood" },
                  no: { kind: 'guess', name: "a sequoia" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a willow or an apple tree?",
                yes: {
                  kind: 'question',
                  text: "Is it a willow?",
                  yes: { kind: 'guess', name: "a willow" },
                  no: { kind: 'guess', name: "an apple tree" },
                },
                no: {
                  kind: 'question',
                  text: "Is it an elm?",
                  yes: { kind: 'guess', name: "an elm" },
                  no: { kind: 'guess', name: "an oak tree" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Flower?",
            yes: {
              kind: 'question',
              text: "Is it a carnation, a chrysanthemum, or a daffodil, or something else in that same bunch (9 options)?",
              yes: {
                kind: 'question',
                text: "Is it a carnation, a chrysanthemum, or a daffodil, or something else in that same bunch (5 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a carnation, a chrysanthemum, or a daffodil?",
                  yes: {
                    kind: 'question',
                    text: "Is it a carnation or a chrysanthemum?",
                    yes: {
                      kind: 'question',
                      text: "Is it a carnation?",
                      yes: { kind: 'guess', name: "a carnation" },
                      no: { kind: 'guess', name: "a chrysanthemum" },
                    },
                    no: { kind: 'guess', name: "a daffodil" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a daisy?",
                    yes: { kind: 'guess', name: "a daisy" },
                    no: { kind: 'guess', name: "a dandelion" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a hibiscus or a jasmine?",
                  yes: {
                    kind: 'question',
                    text: "Is it a hibiscus?",
                    yes: { kind: 'guess', name: "a hibiscus" },
                    no: { kind: 'guess', name: "a jasmine" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a lavender?",
                    yes: { kind: 'guess', name: "a lavender" },
                    no: { kind: 'guess', name: "a lily" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a marigold, a peony, or a poppy, or something else in that same bunch (5 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a marigold, a peony, or a poppy?",
                  yes: {
                    kind: 'question',
                    text: "Is it a marigold or a peony?",
                    yes: {
                      kind: 'question',
                      text: "Is it a marigold?",
                      yes: { kind: 'guess', name: "a marigold" },
                      no: { kind: 'guess', name: "a peony" },
                    },
                    no: { kind: 'guess', name: "a poppy" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a rose?",
                    yes: { kind: 'guess', name: "a rose" },
                    no: { kind: 'guess', name: "a sunflower" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a tulip or a violet?",
                  yes: {
                    kind: 'question',
                    text: "Is it a tulip?",
                    yes: { kind: 'guess', name: "a tulip" },
                    no: { kind: 'guess', name: "a violet" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it an iris?",
                    yes: { kind: 'guess', name: "an iris" },
                    no: { kind: 'guess', name: "an orchid" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name have more than one word?",
              yes: {
                kind: 'question',
                text: "Is it a bamboo, a bonsai, or a bush, or something else in that same bunch (9 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a bamboo, a bonsai, or a bush, or something else in that same bunch (5 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a bamboo, a bonsai, or a bush?",
                    yes: {
                      kind: 'question',
                      text: "Is it a bamboo or a bonsai?",
                      yes: {
                        kind: 'question',
                        text: "Is it a bamboo?",
                        yes: { kind: 'guess', name: "a bamboo" },
                        no: { kind: 'guess', name: "a bonsai" },
                      },
                      no: { kind: 'guess', name: "a bush" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a cactus?",
                      yes: { kind: 'guess', name: "a cactus" },
                      no: { kind: 'guess', name: "a fern" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a grass or a hedge?",
                    yes: {
                      kind: 'question',
                      text: "Is it a grass?",
                      yes: { kind: 'guess', name: "a grass" },
                      no: { kind: 'guess', name: "a hedge" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a moss?",
                      yes: { kind: 'guess', name: "a moss" },
                      no: { kind: 'guess', name: "a mushroom" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a pitcher plant, a pumpkin plant, or a shrub, or something else in that same bunch (5 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a pitcher plant, a pumpkin plant, or a shrub?",
                    yes: {
                      kind: 'question',
                      text: "Is it a pitcher plant or a pumpkin plant?",
                      yes: {
                        kind: 'question',
                        text: "Is it a pitcher plant?",
                        yes: { kind: 'guess', name: "a pitcher plant" },
                        no: { kind: 'guess', name: "a pumpkin plant" },
                      },
                      no: { kind: 'guess', name: "a shrub" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a strawberry plant?",
                      yes: { kind: 'guess', name: "a strawberry plant" },
                      no: { kind: 'guess', name: "a succulent" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a tomato plant or a Venus flytrap?",
                    yes: {
                      kind: 'question',
                      text: "Is it a tomato plant?",
                      yes: { kind: 'guess', name: "a tomato plant" },
                      no: { kind: 'guess', name: "a Venus flytrap" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a vine?",
                      yes: { kind: 'guess', name: "a vine" },
                      no: { kind: 'guess', name: "corn plant" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it algae, basil, or clover, or something else in that same bunch (5 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it algae, basil, or clover?",
                  yes: {
                    kind: 'question',
                    text: "Is it algae or basil?",
                    yes: {
                      kind: 'question',
                      text: "Is it algae?",
                      yes: { kind: 'guess', name: "algae" },
                      no: { kind: 'guess', name: "basil" },
                    },
                    no: { kind: 'guess', name: "clover" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it ivy?",
                    yes: { kind: 'guess', name: "ivy" },
                    no: { kind: 'guess', name: "kelp" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it mint or rosemary?",
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
              text: "Is it a battery, a Bluetooth speaker, or a camera, or something else in that same bunch (16 options)?",
              yes: {
                kind: 'question',
                text: "Is it a battery, a Bluetooth speaker, or a camera, or something else in that same bunch (8 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a battery, a Bluetooth speaker, a camera, or a charger?",
                  yes: {
                    kind: 'question',
                    text: "Is it a battery or a Bluetooth speaker?",
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
                    text: "Is it a computer mouse or a drone controller?",
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
                  text: "Is it a gaming console, a Google Nest, a hard drive, or a keyboard?",
                  yes: {
                    kind: 'question',
                    text: "Is it a gaming console or a Google Nest?",
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
                    text: "Is it a Kindle or a microphone?",
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
                text: "Is it a PlayStation, a power bank, or a printer, or something else in that same bunch (8 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a PlayStation, a power bank, a printer, or a remote control?",
                  yes: {
                    kind: 'question',
                    text: "Is it a PlayStation or a power bank?",
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
                    text: "Is it a router or a smart home hub?",
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
                  text: "Is it a TV, a USB drive, a VR headset, or a webcam?",
                  yes: {
                    kind: 'question',
                    text: "Is it a TV or a USB drive?",
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
                    text: "Is it AirPods or an Amazon Echo?",
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
            text: "Is it a blimp, a drone, or a fighter jet, or something else in that same bunch (7 options)?",
            yes: {
              kind: 'question',
              text: "Is it a blimp, a drone, a fighter jet, or a glider?",
              yes: {
                kind: 'question',
                text: "Is it a blimp or a drone?",
                yes: {
                  kind: 'question',
                  text: "Is it a blimp?",
                  yes: { kind: 'guess', name: "a blimp" },
                  no: { kind: 'guess', name: "a drone" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a fighter jet?",
                  yes: { kind: 'guess', name: "a fighter jet" },
                  no: { kind: 'guess', name: "a glider" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a hang glider or a helicopter?",
                yes: {
                  kind: 'question',
                  text: "Is it a hang glider?",
                  yes: { kind: 'guess', name: "a hang glider" },
                  no: { kind: 'guess', name: "a helicopter" },
                },
                no: { kind: 'guess', name: "a hot air balloon" },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a jet, a parachute, a rocket, or a seaplane?",
              yes: {
                kind: 'question',
                text: "Is it a jet or a parachute?",
                yes: {
                  kind: 'question',
                  text: "Is it a jet?",
                  yes: { kind: 'guess', name: "a jet" },
                  no: { kind: 'guess', name: "a parachute" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a rocket?",
                  yes: { kind: 'guess', name: "a rocket" },
                  no: { kind: 'guess', name: "a seaplane" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a space shuttle or a spaceship?",
                yes: {
                  kind: 'question',
                  text: "Is it a space shuttle?",
                  yes: { kind: 'guess', name: "a space shuttle" },
                  no: { kind: 'guess', name: "a spaceship" },
                },
                no: { kind: 'guess', name: "an airplane" },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Does it go on water?",
            yes: {
              kind: 'question',
              text: "Is it a battleship, a canoe, or a cruise ship, or something else in that same bunch (8 options)?",
              yes: {
                kind: 'question',
                text: "Is it a battleship, a canoe, a cruise ship, or a ferry?",
                yes: {
                  kind: 'question',
                  text: "Is it a battleship or a canoe?",
                  yes: {
                    kind: 'question',
                    text: "Is it a battleship?",
                    yes: { kind: 'guess', name: "a battleship" },
                    no: { kind: 'guess', name: "a canoe" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a cruise ship?",
                    yes: { kind: 'guess', name: "a cruise ship" },
                    no: { kind: 'guess', name: "a ferry" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a jet ski or a kayak?",
                  yes: {
                    kind: 'question',
                    text: "Is it a jet ski?",
                    yes: { kind: 'guess', name: "a jet ski" },
                    no: { kind: 'guess', name: "a kayak" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a paddleboard?",
                    yes: { kind: 'guess', name: "a paddleboard" },
                    no: { kind: 'guess', name: "a raft" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a rowboat, a sailboat, a speedboat, or a submarine?",
                yes: {
                  kind: 'question',
                  text: "Is it a rowboat or a sailboat?",
                  yes: {
                    kind: 'question',
                    text: "Is it a rowboat?",
                    yes: { kind: 'guess', name: "a rowboat" },
                    no: { kind: 'guess', name: "a sailboat" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a speedboat?",
                    yes: { kind: 'guess', name: "a speedboat" },
                    no: { kind: 'guess', name: "a submarine" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a tugboat or a yacht?",
                  yes: {
                    kind: 'question',
                    text: "Is it a tugboat?",
                    yes: { kind: 'guess', name: "a tugboat" },
                    no: { kind: 'guess', name: "a yacht" },
                  },
                  no: { kind: 'guess', name: "an aircraft carrier" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Is it a bicycle, a bulldozer, or a bus, or something else in that same bunch (18 options)?",
              yes: {
                kind: 'question',
                text: "Is it a bicycle, a bulldozer, or a bus, or something else in that same bunch (9 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a bicycle, a bulldozer, or a bus, or something else in that same bunch (5 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a bicycle, a bulldozer, or a bus?",
                    yes: {
                      kind: 'question',
                      text: "Is it a bicycle or a bulldozer?",
                      yes: {
                        kind: 'question',
                        text: "Is it a bicycle?",
                        yes: { kind: 'guess', name: "a bicycle" },
                        no: { kind: 'guess', name: "a bulldozer" },
                      },
                      no: { kind: 'guess', name: "a bus" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a car?",
                      yes: { kind: 'guess', name: "a car" },
                      no: { kind: 'guess', name: "a cement mixer" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a convertible or a double-decker bus?",
                    yes: {
                      kind: 'question',
                      text: "Is it a convertible?",
                      yes: { kind: 'guess', name: "a convertible" },
                      no: { kind: 'guess', name: "a double-decker bus" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a dump truck?",
                      yes: { kind: 'guess', name: "a dump truck" },
                      no: { kind: 'guess', name: "a fire truck" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a forklift, a Formula 1 car, or a golf cart, or something else in that same bunch (5 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a forklift, a Formula 1 car, or a golf cart?",
                    yes: {
                      kind: 'question',
                      text: "Is it a forklift or a Formula 1 car?",
                      yes: {
                        kind: 'question',
                        text: "Is it a forklift?",
                        yes: { kind: 'guess', name: "a forklift" },
                        no: { kind: 'guess', name: "a Formula 1 car" },
                      },
                      no: { kind: 'guess', name: "a golf cart" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a horse carriage?",
                      yes: { kind: 'guess', name: "a horse carriage" },
                      no: { kind: 'guess', name: "a limousine" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a motorcycle or a pickup truck?",
                    yes: {
                      kind: 'question',
                      text: "Is it a motorcycle?",
                      yes: { kind: 'guess', name: "a motorcycle" },
                      no: { kind: 'guess', name: "a pickup truck" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a police car?",
                      yes: { kind: 'guess', name: "a police car" },
                      no: { kind: 'guess', name: "a race car" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a rickshaw, a school bus, or a scooter, or something else in that same bunch (9 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a rickshaw, a school bus, or a scooter, or something else in that same bunch (5 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a rickshaw, a school bus, or a scooter?",
                    yes: {
                      kind: 'question',
                      text: "Is it a rickshaw or a school bus?",
                      yes: {
                        kind: 'question',
                        text: "Is it a rickshaw?",
                        yes: { kind: 'guess', name: "a rickshaw" },
                        no: { kind: 'guess', name: "a school bus" },
                      },
                      no: { kind: 'guess', name: "a scooter" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a Segway?",
                      yes: { kind: 'guess', name: "a Segway" },
                      no: { kind: 'guess', name: "a skateboard" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a snowmobile or a subway?",
                    yes: {
                      kind: 'question',
                      text: "Is it a snowmobile?",
                      yes: { kind: 'guess', name: "a snowmobile" },
                      no: { kind: 'guess', name: "a subway" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a tank?",
                      yes: { kind: 'guess', name: "a tank" },
                      no: { kind: 'guess', name: "a taxi" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a tractor, a train, or a tram, or something else in that same bunch (5 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a tractor, a train, or a tram?",
                    yes: {
                      kind: 'question',
                      text: "Is it a tractor or a train?",
                      yes: {
                        kind: 'question',
                        text: "Is it a tractor?",
                        yes: { kind: 'guess', name: "a tractor" },
                        no: { kind: 'guess', name: "a train" },
                      },
                      no: { kind: 'guess', name: "a tram" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a truck?",
                      yes: { kind: 'guess', name: "a truck" },
                      no: { kind: 'guess', name: "a unicycle" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a van or an ambulance?",
                    yes: {
                      kind: 'question',
                      text: "Is it a van?",
                      yes: { kind: 'guess', name: "a van" },
                      no: { kind: 'guess', name: "an ambulance" },
                    },
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
        no: {
          kind: 'question',
          text: "Building, landmark, or place?",
          yes: {
            kind: 'question',
            text: "Famous landmark?",
            yes: {
              kind: 'question',
              text: "Is it Angkor Wat, Big Ben, or Buckingham Palace, or something else in that same bunch (15 options)?",
              yes: {
                kind: 'question',
                text: "Is it Angkor Wat, Big Ben, or Buckingham Palace, or something else in that same bunch (8 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it Angkor Wat, Big Ben, Buckingham Palace, or Burj Khalifa?",
                  yes: {
                    kind: 'question',
                    text: "Is it Angkor Wat or Big Ben?",
                    yes: {
                      kind: 'question',
                      text: "Is it Angkor Wat?",
                      yes: { kind: 'guess', name: "Angkor Wat" },
                      no: { kind: 'guess', name: "Big Ben" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Buckingham Palace?",
                      yes: { kind: 'guess', name: "Buckingham Palace" },
                      no: { kind: 'guess', name: "Burj Khalifa" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Chichen Itza or Christ the Redeemer?",
                    yes: {
                      kind: 'question',
                      text: "Is it Chichen Itza?",
                      yes: { kind: 'guess', name: "Chichen Itza" },
                      no: { kind: 'guess', name: "Christ the Redeemer" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it CN Tower?",
                      yes: { kind: 'guess', name: "CN Tower" },
                      no: { kind: 'guess', name: "Hollywood Sign" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Machu Picchu, Mount Everest, Mount Rushmore, or Niagara Falls?",
                  yes: {
                    kind: 'question',
                    text: "Is it Machu Picchu or Mount Everest?",
                    yes: {
                      kind: 'question',
                      text: "Is it Machu Picchu?",
                      yes: { kind: 'guess', name: "Machu Picchu" },
                      no: { kind: 'guess', name: "Mount Everest" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Mount Rushmore?",
                      yes: { kind: 'guess', name: "Mount Rushmore" },
                      no: { kind: 'guess', name: "Niagara Falls" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name have more than one word?",
                    yes: { kind: 'guess', name: "Space Needle" },
                    no: {
                      kind: 'question',
                      text: "Is it Petra?",
                      yes: { kind: 'guess', name: "Petra" },
                      no: { kind: 'guess', name: "Stonehenge" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it Sydney Opera House, Taj Mahal, or the Colosseum, or something else in that same bunch (7 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it Sydney Opera House, Taj Mahal, the Colosseum, or the Eiffel Tower?",
                  yes: {
                    kind: 'question',
                    text: "Is it Sydney Opera House or Taj Mahal?",
                    yes: {
                      kind: 'question',
                      text: "Is it Sydney Opera House?",
                      yes: { kind: 'guess', name: "Sydney Opera House" },
                      no: { kind: 'guess', name: "Taj Mahal" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it the Colosseum?",
                      yes: { kind: 'guess', name: "the Colosseum" },
                      no: { kind: 'guess', name: "the Eiffel Tower" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it the Empire State Building or the Golden Gate Bridge?",
                    yes: {
                      kind: 'question',
                      text: "Is it the Empire State Building?",
                      yes: { kind: 'guess', name: "the Empire State Building" },
                      no: { kind: 'guess', name: "the Golden Gate Bridge" },
                    },
                    no: { kind: 'guess', name: "the Grand Canyon" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it the Great Wall of China, the Louvre, the Pentagon, or the Pyramids of Giza?",
                  yes: {
                    kind: 'question',
                    text: "Is it the Great Wall of China or the Louvre?",
                    yes: {
                      kind: 'question',
                      text: "Is it the Great Wall of China?",
                      yes: { kind: 'guess', name: "the Great Wall of China" },
                      no: { kind: 'guess', name: "the Louvre" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it the Pentagon?",
                      yes: { kind: 'guess', name: "the Pentagon" },
                      no: { kind: 'guess', name: "the Pyramids of Giza" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it the Statue of Liberty or the White House?",
                    yes: {
                      kind: 'question',
                      text: "Is it the Statue of Liberty?",
                      yes: { kind: 'guess', name: "the Statue of Liberty" },
                      no: { kind: 'guess', name: "the White House" },
                    },
                    no: { kind: 'guess', name: "Times Square" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Home / dwelling?",
              yes: {
                kind: 'question',
                text: "Is it a bungalow, a cabin, or a castle, or something else in that same bunch (7 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a bungalow, a cabin, a castle, or a condo?",
                  yes: {
                    kind: 'question',
                    text: "Is it a bungalow or a cabin?",
                    yes: {
                      kind: 'question',
                      text: "Is it a bungalow?",
                      yes: { kind: 'guess', name: "a bungalow" },
                      no: { kind: 'guess', name: "a cabin" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a castle?",
                      yes: { kind: 'guess', name: "a castle" },
                      no: { kind: 'guess', name: "a condo" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a dorm room or a house?",
                    yes: {
                      kind: 'question',
                      text: "Is it a dorm room?",
                      yes: { kind: 'guess', name: "a dorm room" },
                      no: { kind: 'guess', name: "a house" },
                    },
                    no: { kind: 'guess', name: "a mansion" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a mobile home, a penthouse, a tent, or a treehouse?",
                  yes: {
                    kind: 'question',
                    text: "Is it a mobile home or a penthouse?",
                    yes: {
                      kind: 'question',
                      text: "Is it a mobile home?",
                      yes: { kind: 'guess', name: "a mobile home" },
                      no: { kind: 'guess', name: "a penthouse" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a tent?",
                      yes: { kind: 'guess', name: "a tent" },
                      no: { kind: 'guess', name: "a treehouse" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a yurt or an apartment?",
                    yes: {
                      kind: 'question',
                      text: "Is it a yurt?",
                      yes: { kind: 'guess', name: "a yurt" },
                      no: { kind: 'guess', name: "an apartment" },
                    },
                    no: { kind: 'guess', name: "an igloo" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a bank, a beach, or a bridge, or something else in that same bunch (22 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a bank, a beach, or a bridge, or something else in that same bunch (11 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a bank, a beach, or a bridge, or something else in that same bunch (6 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a bank, a beach, or a bridge?",
                      yes: {
                        kind: 'question',
                        text: "Is it a bank or a beach?",
                        yes: {
                          kind: 'question',
                          text: "Is it a bank?",
                          yes: { kind: 'guess', name: "a bank" },
                          no: { kind: 'guess', name: "a beach" },
                        },
                        no: { kind: 'guess', name: "a bridge" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a canyon or a cave?",
                        yes: {
                          kind: 'question',
                          text: "Is it a canyon?",
                          yes: { kind: 'guess', name: "a canyon" },
                          no: { kind: 'guess', name: "a cave" },
                        },
                        no: { kind: 'guess', name: "a cemetery" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a church, a cinema, or a city?",
                      yes: {
                        kind: 'question',
                        text: "Is it a church or a cinema?",
                        yes: {
                          kind: 'question',
                          text: "Is it a church?",
                          yes: { kind: 'guess', name: "a church" },
                          no: { kind: 'guess', name: "a cinema" },
                        },
                        no: { kind: 'guess', name: "a city" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a desert?",
                        yes: { kind: 'guess', name: "a desert" },
                        no: { kind: 'guess', name: "a factory" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a farm, a forest, or a gym, or something else in that same bunch (6 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a farm, a forest, or a gym?",
                      yes: {
                        kind: 'question',
                        text: "Is it a farm or a forest?",
                        yes: {
                          kind: 'question',
                          text: "Is it a farm?",
                          yes: { kind: 'guess', name: "a farm" },
                          no: { kind: 'guess', name: "a forest" },
                        },
                        no: { kind: 'guess', name: "a gym" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a highway or a hospital?",
                        yes: {
                          kind: 'question',
                          text: "Is it a highway?",
                          yes: { kind: 'guess', name: "a highway" },
                          no: { kind: 'guess', name: "a hospital" },
                        },
                        no: { kind: 'guess', name: "a hotel" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a lake, a library, or a mall?",
                      yes: {
                        kind: 'question',
                        text: "Is it a lake or a library?",
                        yes: {
                          kind: 'question',
                          text: "Is it a lake?",
                          yes: { kind: 'guess', name: "a lake" },
                          no: { kind: 'guess', name: "a library" },
                        },
                        no: { kind: 'guess', name: "a mall" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a meadow?",
                        yes: { kind: 'guess', name: "a meadow" },
                        no: { kind: 'guess', name: "a mountain" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a museum, a park, or a parking lot, or something else in that same bunch (11 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a museum, a park, or a parking lot, or something else in that same bunch (6 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a museum, a park, or a parking lot?",
                      yes: {
                        kind: 'question',
                        text: "Is it a museum or a park?",
                        yes: {
                          kind: 'question',
                          text: "Is it a museum?",
                          yes: { kind: 'guess', name: "a museum" },
                          no: { kind: 'guess', name: "a park" },
                        },
                        no: { kind: 'guess', name: "a parking lot" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a playground or a prison?",
                        yes: {
                          kind: 'question',
                          text: "Is it a playground?",
                          yes: { kind: 'guess', name: "a playground" },
                          no: { kind: 'guess', name: "a prison" },
                        },
                        no: { kind: 'guess', name: "a restaurant" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a river, a school, or a stadium?",
                      yes: {
                        kind: 'question',
                        text: "Is it a river or a school?",
                        yes: {
                          kind: 'question',
                          text: "Is it a river?",
                          yes: { kind: 'guess', name: "a river" },
                          no: { kind: 'guess', name: "a school" },
                        },
                        no: { kind: 'guess', name: "a stadium" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a supermarket?",
                        yes: { kind: 'guess', name: "a supermarket" },
                        no: { kind: 'guess', name: "a swamp" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a theater, a tunnel, or a valley, or something else in that same bunch (5 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a theater, a tunnel, or a valley?",
                      yes: {
                        kind: 'question',
                        text: "Is it a theater or a tunnel?",
                        yes: {
                          kind: 'question',
                          text: "Is it a theater?",
                          yes: { kind: 'guess', name: "a theater" },
                          no: { kind: 'guess', name: "a tunnel" },
                        },
                        no: { kind: 'guess', name: "a valley" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a volcano?",
                        yes: { kind: 'guess', name: "a volcano" },
                        no: { kind: 'guess', name: "a warehouse" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a waterfall, a zoo, or an airport?",
                      yes: {
                        kind: 'question',
                        text: "Is it a waterfall or a zoo?",
                        yes: {
                          kind: 'question',
                          text: "Is it a waterfall?",
                          yes: { kind: 'guess', name: "a waterfall" },
                          no: { kind: 'guess', name: "a zoo" },
                        },
                        no: { kind: 'guess', name: "an airport" },
                      },
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
          no: {
            kind: 'question',
            text: "Furniture?",
            yes: {
              kind: 'question',
              text: "Is it a bed, a blanket, or a bookshelf, or something else in that same bunch (13 options)?",
              yes: {
                kind: 'question',
                text: "Is it a bed, a blanket, or a bookshelf, or something else in that same bunch (7 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a bed, a blanket, a bookshelf, or a cabinet?",
                  yes: {
                    kind: 'question',
                    text: "Is it a bed or a blanket?",
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
                      no: { kind: 'guess', name: "a cabinet" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a chair or a coffee table?",
                    yes: {
                      kind: 'question',
                      text: "Is it a chair?",
                      yes: { kind: 'guess', name: "a chair" },
                      no: { kind: 'guess', name: "a coffee table" },
                    },
                    no: { kind: 'guess', name: "a couch" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a curtain, a desk, or a dining table?",
                  yes: {
                    kind: 'question',
                    text: "Is it a curtain or a desk?",
                    yes: {
                      kind: 'question',
                      text: "Is it a curtain?",
                      yes: { kind: 'guess', name: "a curtain" },
                      no: { kind: 'guess', name: "a desk" },
                    },
                    no: { kind: 'guess', name: "a dining table" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a drawer or a dresser?",
                    yes: {
                      kind: 'question',
                      text: "Is it a drawer?",
                      yes: { kind: 'guess', name: "a drawer" },
                      no: { kind: 'guess', name: "a dresser" },
                    },
                    no: { kind: 'guess', name: "a lamp" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a mattress, a mirror, or a nightstand, or something else in that same bunch (7 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a mattress, a mirror, a nightstand, or a pillow?",
                  yes: {
                    kind: 'question',
                    text: "Is it a mattress or a mirror?",
                    yes: {
                      kind: 'question',
                      text: "Is it a mattress?",
                      yes: { kind: 'guess', name: "a mattress" },
                      no: { kind: 'guess', name: "a mirror" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a nightstand?",
                      yes: { kind: 'guess', name: "a nightstand" },
                      no: { kind: 'guess', name: "a pillow" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a recliner or a rocking chair?",
                    yes: {
                      kind: 'question',
                      text: "Is it a recliner?",
                      yes: { kind: 'guess', name: "a recliner" },
                      no: { kind: 'guess', name: "a rocking chair" },
                    },
                    no: { kind: 'guess', name: "a rug" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a shelf, a sofa, or a stool?",
                  yes: {
                    kind: 'question',
                    text: "Is it a shelf or a sofa?",
                    yes: {
                      kind: 'question',
                      text: "Is it a shelf?",
                      yes: { kind: 'guess', name: "a shelf" },
                      no: { kind: 'guess', name: "a sofa" },
                    },
                    no: { kind: 'guess', name: "a stool" },
                  },
                  no: {
                    kind: 'question',
                    text: "Does its name have more than one word?",
                    yes: {
                      kind: 'question',
                      text: "Is it a table?",
                      yes: { kind: 'guess', name: "a table" },
                      no: { kind: 'guess', name: "a wardrobe" },
                    },
                    no: { kind: 'guess', name: "curtains" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Large appliance?",
              yes: {
                kind: 'question',
                text: "Is it a dishwasher, a dryer, or a freezer, or something else in that same bunch (6 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a dishwasher, a dryer, or a freezer?",
                  yes: {
                    kind: 'question',
                    text: "Is it a dishwasher or a dryer?",
                    yes: {
                      kind: 'question',
                      text: "Is it a dishwasher?",
                      yes: { kind: 'guess', name: "a dishwasher" },
                      no: { kind: 'guess', name: "a dryer" },
                    },
                    no: { kind: 'guess', name: "a freezer" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a furnace or a microwave?",
                    yes: {
                      kind: 'question',
                      text: "Is it a furnace?",
                      yes: { kind: 'guess', name: "a furnace" },
                      no: { kind: 'guess', name: "a microwave" },
                    },
                    no: { kind: 'guess', name: "a refrigerator" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a stove, a vacuum cleaner, or a washing machine?",
                  yes: {
                    kind: 'question',
                    text: "Is it a stove or a vacuum cleaner?",
                    yes: {
                      kind: 'question',
                      text: "Is it a stove?",
                      yes: { kind: 'guess', name: "a stove" },
                      no: { kind: 'guess', name: "a vacuum cleaner" },
                    },
                    no: { kind: 'guess', name: "a washing machine" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a water heater or an air conditioner?",
                    yes: {
                      kind: 'question',
                      text: "Is it a water heater?",
                      yes: { kind: 'guess', name: "a water heater" },
                      no: { kind: 'guess', name: "an air conditioner" },
                    },
                    no: { kind: 'guess', name: "an oven" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a billboard, a fire hydrant, or a fountain, or something else in that same bunch (6 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a billboard, a fire hydrant, or a fountain?",
                  yes: {
                    kind: 'question',
                    text: "Is it a billboard or a fire hydrant?",
                    yes: {
                      kind: 'question',
                      text: "Is it a billboard?",
                      yes: { kind: 'guess', name: "a billboard" },
                      no: { kind: 'guess', name: "a fire hydrant" },
                    },
                    no: { kind: 'guess', name: "a fountain" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a generator or a satellite dish?",
                    yes: {
                      kind: 'question',
                      text: "Is it a generator?",
                      yes: { kind: 'guess', name: "a generator" },
                      no: { kind: 'guess', name: "a satellite dish" },
                    },
                    no: { kind: 'guess', name: "a solar panel" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a statue, a streetlight, or a traffic light?",
                  yes: {
                    kind: 'question',
                    text: "Is it a statue or a streetlight?",
                    yes: {
                      kind: 'question',
                      text: "Is it a statue?",
                      yes: { kind: 'guess', name: "a statue" },
                      no: { kind: 'guess', name: "a streetlight" },
                    },
                    no: { kind: 'guess', name: "a traffic light" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a vending machine or a wind turbine?",
                    yes: {
                      kind: 'question',
                      text: "Is it a vending machine?",
                      yes: { kind: 'guess', name: "a vending machine" },
                      no: { kind: 'guess', name: "a wind turbine" },
                    },
                    no: { kind: 'guess', name: "an ATM" },
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
            text: "Is it apple juice, beer, or cappuccino, or something else in that same bunch (15 options)?",
            yes: {
              kind: 'question',
              text: "Does its name have more than one word?",
              yes: {
                kind: 'question',
                text: "Is it apple juice, coconut water, or energy drink?",
                yes: {
                  kind: 'question',
                  text: "Is it apple juice or coconut water?",
                  yes: {
                    kind: 'question',
                    text: "Is it apple juice?",
                    yes: { kind: 'guess', name: "apple juice" },
                    no: { kind: 'guess', name: "coconut water" },
                  },
                  no: { kind: 'guess', name: "energy drink" },
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
                text: "Is it beer, cappuccino, or champagne, or something else in that same bunch (5 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it beer, cappuccino, or champagne?",
                  yes: {
                    kind: 'question',
                    text: "Is it beer or cappuccino?",
                    yes: {
                      kind: 'question',
                      text: "Is it beer?",
                      yes: { kind: 'guess', name: "beer" },
                      no: { kind: 'guess', name: "cappuccino" },
                    },
                    no: { kind: 'guess', name: "champagne" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it Coca-Cola?",
                    yes: { kind: 'guess', name: "Coca-Cola" },
                    no: { kind: 'guess', name: "coffee" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it espresso, kombucha, or latte?",
                  yes: {
                    kind: 'question',
                    text: "Is it espresso or kombucha?",
                    yes: {
                      kind: 'question',
                      text: "Is it espresso?",
                      yes: { kind: 'guess', name: "espresso" },
                      no: { kind: 'guess', name: "kombucha" },
                    },
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
              text: "Is it milk, milkshake, or mocha, or something else in that same bunch (8 options)?",
              yes: {
                kind: 'question',
                text: "Is it milk, milkshake, mocha, or orange juice?",
                yes: {
                  kind: 'question',
                  text: "Is it milk or milkshake?",
                  yes: {
                    kind: 'question',
                    text: "Is it milk?",
                    yes: { kind: 'guess', name: "milk" },
                    no: { kind: 'guess', name: "milkshake" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it mocha?",
                    yes: { kind: 'guess', name: "mocha" },
                    no: { kind: 'guess', name: "orange juice" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it Pepsi or root beer?",
                  yes: {
                    kind: 'question',
                    text: "Is it Pepsi?",
                    yes: { kind: 'guess', name: "Pepsi" },
                    no: { kind: 'guess', name: "root beer" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it smoothie?",
                    yes: { kind: 'guess', name: "smoothie" },
                    no: { kind: 'guess', name: "soda" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it sports drink, Sprite, tea, or vodka?",
                yes: {
                  kind: 'question',
                  text: "Is it sports drink or Sprite?",
                  yes: {
                    kind: 'question',
                    text: "Is it sports drink?",
                    yes: { kind: 'guess', name: "sports drink" },
                    no: { kind: 'guess', name: "Sprite" },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it tea?",
                    yes: { kind: 'guess', name: "tea" },
                    no: { kind: 'guess', name: "vodka" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it water or whiskey?",
                  yes: {
                    kind: 'question',
                    text: "Is it water?",
                    yes: { kind: 'guess', name: "water" },
                    no: { kind: 'guess', name: "whiskey" },
                  },
                  no: { kind: 'guess', name: "wine" },
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
                text: "Is it a banana, a blackberry, or a blueberry, or something else in that same bunch (15 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a banana, a blackberry, or a blueberry, or something else in that same bunch (8 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a banana, a blackberry, a blueberry, or a cantaloupe?",
                    yes: {
                      kind: 'question',
                      text: "Is it a banana or a blackberry?",
                      yes: {
                        kind: 'question',
                        text: "Is it a banana?",
                        yes: { kind: 'guess', name: "a banana" },
                        no: { kind: 'guess', name: "a blackberry" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a blueberry?",
                        yes: { kind: 'guess', name: "a blueberry" },
                        no: { kind: 'guess', name: "a cantaloupe" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a cherry or a coconut?",
                      yes: {
                        kind: 'question',
                        text: "Is it a cherry?",
                        yes: { kind: 'guess', name: "a cherry" },
                        no: { kind: 'guess', name: "a coconut" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a date?",
                        yes: { kind: 'guess', name: "a date" },
                        no: { kind: 'guess', name: "a fig" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a grape, a grapefruit, a honeydew, or a kiwi?",
                    yes: {
                      kind: 'question',
                      text: "Is it a grape or a grapefruit?",
                      yes: {
                        kind: 'question',
                        text: "Is it a grape?",
                        yes: { kind: 'guess', name: "a grape" },
                        no: { kind: 'guess', name: "a grapefruit" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a honeydew?",
                        yes: { kind: 'guess', name: "a honeydew" },
                        no: { kind: 'guess', name: "a kiwi" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a lemon or a lime?",
                      yes: {
                        kind: 'question',
                        text: "Is it a lemon?",
                        yes: { kind: 'guess', name: "a lemon" },
                        no: { kind: 'guess', name: "a lime" },
                      },
                      no: { kind: 'guess', name: "a mango" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a papaya, a peach, or a pear, or something else in that same bunch (7 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a papaya, a peach, a pear, or a pineapple?",
                    yes: {
                      kind: 'question',
                      text: "Is it a papaya or a peach?",
                      yes: {
                        kind: 'question',
                        text: "Is it a papaya?",
                        yes: { kind: 'guess', name: "a papaya" },
                        no: { kind: 'guess', name: "a peach" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a pear?",
                        yes: { kind: 'guess', name: "a pear" },
                        no: { kind: 'guess', name: "a pineapple" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a plum or a pomegranate?",
                      yes: {
                        kind: 'question',
                        text: "Is it a plum?",
                        yes: { kind: 'guess', name: "a plum" },
                        no: { kind: 'guess', name: "a pomegranate" },
                      },
                      no: { kind: 'guess', name: "a raspberry" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a strawberry, a tomato, a watermelon, or an apple?",
                    yes: {
                      kind: 'question',
                      text: "Is it a strawberry or a tomato?",
                      yes: {
                        kind: 'question',
                        text: "Is it a strawberry?",
                        yes: { kind: 'guess', name: "a strawberry" },
                        no: { kind: 'guess', name: "a tomato" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a watermelon?",
                        yes: { kind: 'guess', name: "a watermelon" },
                        no: { kind: 'guess', name: "an apple" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it an apricot or an avocado?",
                      yes: {
                        kind: 'question',
                        text: "Is it an apricot?",
                        yes: { kind: 'guess', name: "an apricot" },
                        no: { kind: 'guess', name: "an avocado" },
                      },
                      no: { kind: 'guess', name: "an orange" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name have more than one word?",
                yes: {
                  kind: 'question',
                  text: "Is it a beet, a bell pepper, or a carrot, or something else in that same bunch (6 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a beet, a bell pepper, or a carrot?",
                    yes: {
                      kind: 'question',
                      text: "Is it a beet or a bell pepper?",
                      yes: {
                        kind: 'question',
                        text: "Is it a beet?",
                        yes: { kind: 'guess', name: "a beet" },
                        no: { kind: 'guess', name: "a bell pepper" },
                      },
                      no: { kind: 'guess', name: "a carrot" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a cucumber or a pepper?",
                      yes: {
                        kind: 'question',
                        text: "Is it a cucumber?",
                        yes: { kind: 'guess', name: "a cucumber" },
                        no: { kind: 'guess', name: "a pepper" },
                      },
                      no: { kind: 'guess', name: "a potato" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a radish, a sweet potato, or a turnip?",
                    yes: {
                      kind: 'question',
                      text: "Is it a radish or a sweet potato?",
                      yes: {
                        kind: 'question',
                        text: "Is it a radish?",
                        yes: { kind: 'guess', name: "a radish" },
                        no: { kind: 'guess', name: "a sweet potato" },
                      },
                      no: { kind: 'guess', name: "a turnip" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it an onion?",
                      yes: { kind: 'guess', name: "an onion" },
                      no: { kind: 'guess', name: "green beans" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it asparagus, broccoli, or cabbage, or something else in that same bunch (8 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it asparagus, broccoli, cabbage, or cauliflower?",
                    yes: {
                      kind: 'question',
                      text: "Is it asparagus or broccoli?",
                      yes: {
                        kind: 'question',
                        text: "Is it asparagus?",
                        yes: { kind: 'guess', name: "asparagus" },
                        no: { kind: 'guess', name: "broccoli" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it cabbage?",
                        yes: { kind: 'guess', name: "cabbage" },
                        no: { kind: 'guess', name: "cauliflower" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it celery or corn?",
                      yes: {
                        kind: 'question',
                        text: "Is it celery?",
                        yes: { kind: 'guess', name: "celery" },
                        no: { kind: 'guess', name: "corn" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it eggplant?",
                        yes: { kind: 'guess', name: "eggplant" },
                        no: { kind: 'guess', name: "garlic" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it ginger, kale, lettuce, or mushrooms?",
                    yes: {
                      kind: 'question',
                      text: "Is it ginger or kale?",
                      yes: {
                        kind: 'question',
                        text: "Is it ginger?",
                        yes: { kind: 'guess', name: "ginger" },
                        no: { kind: 'guess', name: "kale" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it lettuce?",
                        yes: { kind: 'guess', name: "lettuce" },
                        no: { kind: 'guess', name: "mushrooms" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it peas or spinach?",
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
                text: "Is it a burrito, a hamburger, or a hot dog, or something else in that same bunch (9 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a burrito, a hamburger, or a hot dog, or something else in that same bunch (5 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a burrito, a hamburger, or a hot dog?",
                    yes: {
                      kind: 'question',
                      text: "Is it a burrito or a hamburger?",
                      yes: {
                        kind: 'question',
                        text: "Is it a burrito?",
                        yes: { kind: 'guess', name: "a burrito" },
                        no: { kind: 'guess', name: "a hamburger" },
                      },
                      no: { kind: 'guess', name: "a hot dog" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a pizza?",
                      yes: { kind: 'guess', name: "a pizza" },
                      no: { kind: 'guess', name: "a quesadilla" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a sandwich or a smoothie bowl?",
                    yes: {
                      kind: 'question',
                      text: "Is it a sandwich?",
                      yes: { kind: 'guess', name: "a sandwich" },
                      no: { kind: 'guess', name: "a smoothie bowl" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a taco?",
                      yes: { kind: 'guess', name: "a taco" },
                      no: { kind: 'guess', name: "a wrap" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Does its name have more than one word?",
                  yes: {
                    kind: 'question',
                    text: "Is it chicken nuggets, french fries, or fried chicken?",
                    yes: {
                      kind: 'question',
                      text: "Is it chicken nuggets or french fries?",
                      yes: {
                        kind: 'question',
                        text: "Is it chicken nuggets?",
                        yes: { kind: 'guess', name: "chicken nuggets" },
                        no: { kind: 'guess', name: "french fries" },
                      },
                      no: { kind: 'guess', name: "fried chicken" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it onion rings?",
                      yes: { kind: 'guess', name: "onion rings" },
                      no: { kind: 'guess', name: "poke bowl" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it nachos or pho?",
                    yes: {
                      kind: 'question',
                      text: "Is it nachos?",
                      yes: { kind: 'guess', name: "nachos" },
                      no: { kind: 'guess', name: "pho" },
                    },
                    no: { kind: 'guess', name: "ramen" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name have more than one word?",
                yes: {
                  kind: 'question',
                  text: "Is it a bagel, a baguette, or a biscuit, or something else in that same bunch (12 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a bagel, a baguette, or a biscuit, or something else in that same bunch (6 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a bagel, a baguette, or a biscuit?",
                      yes: {
                        kind: 'question',
                        text: "Is it a bagel or a baguette?",
                        yes: {
                          kind: 'question',
                          text: "Is it a bagel?",
                          yes: { kind: 'guess', name: "a bagel" },
                          no: { kind: 'guess', name: "a baguette" },
                        },
                        no: { kind: 'guess', name: "a biscuit" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a brownie or a burrito bowl?",
                        yes: {
                          kind: 'question',
                          text: "Is it a brownie?",
                          yes: { kind: 'guess', name: "a brownie" },
                          no: { kind: 'guess', name: "a burrito bowl" },
                        },
                        no: { kind: 'guess', name: "a cake" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a casserole, a cookie, or a cracker?",
                      yes: {
                        kind: 'question',
                        text: "Is it a casserole or a cookie?",
                        yes: {
                          kind: 'question',
                          text: "Is it a casserole?",
                          yes: { kind: 'guess', name: "a casserole" },
                          no: { kind: 'guess', name: "a cookie" },
                        },
                        no: { kind: 'guess', name: "a cracker" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a croissant or a cupcake?",
                        yes: {
                          kind: 'question',
                          text: "Is it a croissant?",
                          yes: { kind: 'guess', name: "a croissant" },
                          no: { kind: 'guess', name: "a cupcake" },
                        },
                        no: { kind: 'guess', name: "a donut" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a meatloaf, a muffin, or a pancake, or something else in that same bunch (6 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a meatloaf, a muffin, or a pancake?",
                      yes: {
                        kind: 'question',
                        text: "Is it a meatloaf or a muffin?",
                        yes: {
                          kind: 'question',
                          text: "Is it a meatloaf?",
                          yes: { kind: 'guess', name: "a meatloaf" },
                          no: { kind: 'guess', name: "a muffin" },
                        },
                        no: { kind: 'guess', name: "a pancake" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a pretzel or a salad?",
                        yes: {
                          kind: 'question',
                          text: "Is it a pretzel?",
                          yes: { kind: 'guess', name: "a pretzel" },
                          no: { kind: 'guess', name: "a salad" },
                        },
                        no: { kind: 'guess', name: "a waffle" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it an egg, ice cream, or mac and cheese?",
                      yes: {
                        kind: 'question',
                        text: "Is it an egg or ice cream?",
                        yes: {
                          kind: 'question',
                          text: "Is it an egg?",
                          yes: { kind: 'guess', name: "an egg" },
                          no: { kind: 'guess', name: "ice cream" },
                        },
                        no: { kind: 'guess', name: "mac and cheese" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it peanut butter or potato chips?",
                        yes: {
                          kind: 'question',
                          text: "Is it peanut butter?",
                          yes: { kind: 'guess', name: "peanut butter" },
                          no: { kind: 'guess', name: "potato chips" },
                        },
                        no: { kind: 'guess', name: "turkey meat" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it bacon, bread, or butter, or something else in that same bunch (15 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it bacon, bread, or butter, or something else in that same bunch (8 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it bacon, bread, butter, or candy?",
                      yes: {
                        kind: 'question',
                        text: "Is it bacon or bread?",
                        yes: {
                          kind: 'question',
                          text: "Is it bacon?",
                          yes: { kind: 'guess', name: "bacon" },
                          no: { kind: 'guess', name: "bread" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it butter?",
                          yes: { kind: 'guess', name: "butter" },
                          no: { kind: 'guess', name: "candy" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it cereal or cheese?",
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
                    no: {
                      kind: 'question',
                      text: "Is it granola, guacamole, ham, or honey?",
                      yes: {
                        kind: 'question',
                        text: "Is it granola or guacamole?",
                        yes: {
                          kind: 'question',
                          text: "Is it granola?",
                          yes: { kind: 'guess', name: "granola" },
                          no: { kind: 'guess', name: "guacamole" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it ham?",
                          yes: { kind: 'guess', name: "ham" },
                          no: { kind: 'guess', name: "honey" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it jelly or ketchup?",
                        yes: {
                          kind: 'question',
                          text: "Is it jelly?",
                          yes: { kind: 'guess', name: "jelly" },
                          no: { kind: 'guess', name: "ketchup" },
                        },
                        no: { kind: 'guess', name: "lasagna" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it mayonnaise, meatballs, or mustard, or something else in that same bunch (8 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it mayonnaise, meatballs, mustard, or oatmeal?",
                      yes: {
                        kind: 'question',
                        text: "Is it mayonnaise or meatballs?",
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
                      no: {
                        kind: 'question',
                        text: "Is it pasta or popcorn?",
                        yes: {
                          kind: 'question',
                          text: "Is it pasta?",
                          yes: { kind: 'guess', name: "pasta" },
                          no: { kind: 'guess', name: "popcorn" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it ravioli?",
                          yes: { kind: 'guess', name: "ravioli" },
                          no: { kind: 'guess', name: "rice" },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it salsa, sausage, soup, or spaghetti?",
                      yes: {
                        kind: 'question',
                        text: "Is it salsa or sausage?",
                        yes: {
                          kind: 'question',
                          text: "Is it salsa?",
                          yes: { kind: 'guess', name: "salsa" },
                          no: { kind: 'guess', name: "sausage" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it soup?",
                          yes: { kind: 'guess', name: "soup" },
                          no: { kind: 'guess', name: "spaghetti" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it steak or sushi?",
                        yes: {
                          kind: 'question',
                          text: "Is it steak?",
                          yes: { kind: 'guess', name: "steak" },
                          no: { kind: 'guess', name: "sushi" },
                        },
                        no: { kind: 'guess', name: "yogurt" },
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
            text: "Is it a backpack, a binder, or a book, or something else in that same bunch (11 options)?",
            yes: {
              kind: 'question',
              text: "Is it a backpack, a binder, or a book, or something else in that same bunch (6 options)?",
              yes: {
                kind: 'question',
                text: "Is it a backpack, a binder, or a book?",
                yes: {
                  kind: 'question',
                  text: "Is it a backpack or a binder?",
                  yes: {
                    kind: 'question',
                    text: "Is it a backpack?",
                    yes: { kind: 'guess', name: "a backpack" },
                    no: { kind: 'guess', name: "a binder" },
                  },
                  no: { kind: 'guess', name: "a book" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a calculator or a crayon?",
                  yes: {
                    kind: 'question',
                    text: "Is it a calculator?",
                    yes: { kind: 'guess', name: "a calculator" },
                    no: { kind: 'guess', name: "a crayon" },
                  },
                  no: { kind: 'guess', name: "a folder" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it a highlighter, a marker, or a notebook?",
                yes: {
                  kind: 'question',
                  text: "Is it a highlighter or a marker?",
                  yes: {
                    kind: 'question',
                    text: "Is it a highlighter?",
                    yes: { kind: 'guess', name: "a highlighter" },
                    no: { kind: 'guess', name: "a marker" },
                  },
                  no: { kind: 'guess', name: "a notebook" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a pen?",
                  yes: { kind: 'guess', name: "a pen" },
                  no: { kind: 'guess', name: "a pencil" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Does its name have more than one word?",
              yes: {
                kind: 'question',
                text: "Is it a pencil case, a ruler, or a stapler?",
                yes: {
                  kind: 'question',
                  text: "Is it a pencil case or a ruler?",
                  yes: {
                    kind: 'question',
                    text: "Is it a pencil case?",
                    yes: { kind: 'guess', name: "a pencil case" },
                    no: { kind: 'guess', name: "a ruler" },
                  },
                  no: { kind: 'guess', name: "a stapler" },
                },
                no: {
                  kind: 'question',
                  text: "Is it a whiteboard or an eraser?",
                  yes: {
                    kind: 'question',
                    text: "Is it a whiteboard?",
                    yes: { kind: 'guess', name: "a whiteboard" },
                    no: { kind: 'guess', name: "an eraser" },
                  },
                  no: { kind: 'guess', name: "index cards" },
                },
              },
              no: {
                kind: 'question',
                text: "Is it chalk or glue?",
                yes: {
                  kind: 'question',
                  text: "Is it chalk?",
                  yes: { kind: 'guess', name: "chalk" },
                  no: { kind: 'guess', name: "glue" },
                },
                no: {
                  kind: 'question',
                  text: "Is it scissors?",
                  yes: { kind: 'guess', name: "scissors" },
                  no: { kind: 'guess', name: "tape" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Clothing you wear?",
            yes: {
              kind: 'question',
              text: "Does its name have more than one word?",
              yes: {
                kind: 'question',
                text: "Is it a baseball cap, a beanie, or a belt, or something else in that same bunch (13 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a baseball cap, a beanie, or a belt, or something else in that same bunch (7 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a baseball cap, a beanie, a belt, or a bra?",
                    yes: {
                      kind: 'question',
                      text: "Is it a baseball cap or a beanie?",
                      yes: {
                        kind: 'question',
                        text: "Is it a baseball cap?",
                        yes: { kind: 'guess', name: "a baseball cap" },
                        no: { kind: 'guess', name: "a beanie" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a belt?",
                        yes: { kind: 'guess', name: "a belt" },
                        no: { kind: 'guess', name: "a bra" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a bracelet or a coat?",
                      yes: {
                        kind: 'question',
                        text: "Is it a bracelet?",
                        yes: { kind: 'guess', name: "a bracelet" },
                        no: { kind: 'guess', name: "a coat" },
                      },
                      no: { kind: 'guess', name: "a dress" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a hat, a helmet, or a hoodie?",
                    yes: {
                      kind: 'question',
                      text: "Is it a hat or a helmet?",
                      yes: {
                        kind: 'question',
                        text: "Is it a hat?",
                        yes: { kind: 'guess', name: "a hat" },
                        no: { kind: 'guess', name: "a helmet" },
                      },
                      no: { kind: 'guess', name: "a hoodie" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a jacket or a necklace?",
                      yes: {
                        kind: 'question',
                        text: "Is it a jacket?",
                        yes: { kind: 'guess', name: "a jacket" },
                        no: { kind: 'guess', name: "a necklace" },
                      },
                      no: { kind: 'guess', name: "a purse" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a ring, a scarf, or a skirt, or something else in that same bunch (6 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a ring, a scarf, or a skirt?",
                    yes: {
                      kind: 'question',
                      text: "Is it a ring or a scarf?",
                      yes: {
                        kind: 'question',
                        text: "Is it a ring?",
                        yes: { kind: 'guess', name: "a ring" },
                        no: { kind: 'guess', name: "a scarf" },
                      },
                      no: { kind: 'guess', name: "a skirt" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a suit or a sweater?",
                      yes: {
                        kind: 'question',
                        text: "Is it a suit?",
                        yes: { kind: 'guess', name: "a suit" },
                        no: { kind: 'guess', name: "a sweater" },
                      },
                      no: { kind: 'guess', name: "a swimsuit" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a t-shirt, a tie, or a wallet?",
                    yes: {
                      kind: 'question',
                      text: "Is it a t-shirt or a tie?",
                      yes: {
                        kind: 'question',
                        text: "Is it a t-shirt?",
                        yes: { kind: 'guess', name: "a t-shirt" },
                        no: { kind: 'guess', name: "a tie" },
                      },
                      no: { kind: 'guess', name: "a wallet" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a watch or an umbrella?",
                      yes: {
                        kind: 'question',
                        text: "Is it a watch?",
                        yes: { kind: 'guess', name: "a watch" },
                        no: { kind: 'guess', name: "an umbrella" },
                      },
                      no: { kind: 'guess', name: "knee pads" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Is it boots, earrings, or flip-flops, or something else in that same bunch (8 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it boots, earrings, flip-flops, or glasses?",
                  yes: {
                    kind: 'question',
                    text: "Is it boots or earrings?",
                    yes: {
                      kind: 'question',
                      text: "Is it boots?",
                      yes: { kind: 'guess', name: "boots" },
                      no: { kind: 'guess', name: "earrings" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it flip-flops?",
                      yes: { kind: 'guess', name: "flip-flops" },
                      no: { kind: 'guess', name: "glasses" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it gloves or heels?",
                    yes: {
                      kind: 'question',
                      text: "Is it gloves?",
                      yes: { kind: 'guess', name: "gloves" },
                      no: { kind: 'guess', name: "heels" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it jeans?",
                      yes: { kind: 'guess', name: "jeans" },
                      no: { kind: 'guess', name: "jewelry" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it pajamas, pants, sandals, or shorts?",
                  yes: {
                    kind: 'question',
                    text: "Is it pajamas or pants?",
                    yes: {
                      kind: 'question',
                      text: "Is it pajamas?",
                      yes: { kind: 'guess', name: "pajamas" },
                      no: { kind: 'guess', name: "pants" },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it sandals?",
                      yes: { kind: 'guess', name: "sandals" },
                      no: { kind: 'guess', name: "shorts" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it sneakers or socks?",
                    yes: {
                      kind: 'question',
                      text: "Is it sneakers?",
                      yes: { kind: 'guess', name: "sneakers" },
                      no: { kind: 'guess', name: "socks" },
                    },
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
            no: {
              kind: 'question',
              text: "Is it a ball, a bandage, or a baseball, or something else in that same bunch (47 options)?",
              yes: {
                kind: 'question',
                text: "Is it a ball, a bandage, or a baseball, or something else in that same bunch (24 options)?",
                yes: {
                  kind: 'question',
                  text: "Is it a ball, a bandage, or a baseball, or something else in that same bunch (12 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a ball, a bandage, or a baseball, or something else in that same bunch (6 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a ball, a bandage, or a baseball?",
                      yes: {
                        kind: 'question',
                        text: "Is it a ball or a bandage?",
                        yes: {
                          kind: 'question',
                          text: "Is it a ball?",
                          yes: { kind: 'guess', name: "a ball" },
                          no: { kind: 'guess', name: "a bandage" },
                        },
                        no: { kind: 'guess', name: "a baseball" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a baseball bat or a basketball?",
                        yes: {
                          kind: 'question',
                          text: "Is it a baseball bat?",
                          yes: { kind: 'guess', name: "a baseball bat" },
                          no: { kind: 'guess', name: "a basketball" },
                        },
                        no: { kind: 'guess', name: "a board game" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a bowl, a broom, or a button?",
                      yes: {
                        kind: 'question',
                        text: "Is it a bowl or a broom?",
                        yes: {
                          kind: 'question',
                          text: "Is it a bowl?",
                          yes: { kind: 'guess', name: "a bowl" },
                          no: { kind: 'guess', name: "a broom" },
                        },
                        no: { kind: 'guess', name: "a button" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a calendar or a candle?",
                        yes: {
                          kind: 'question',
                          text: "Is it a calendar?",
                          yes: { kind: 'guess', name: "a calendar" },
                          no: { kind: 'guess', name: "a candle" },
                        },
                        no: { kind: 'guess', name: "a clock" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a coin, a compass, or a credit card, or something else in that same bunch (6 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a coin, a compass, or a credit card?",
                      yes: {
                        kind: 'question',
                        text: "Is it a coin or a compass?",
                        yes: {
                          kind: 'question',
                          text: "Is it a coin?",
                          yes: { kind: 'guess', name: "a coin" },
                          no: { kind: 'guess', name: "a compass" },
                        },
                        no: { kind: 'guess', name: "a credit card" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a cup or a doll?",
                        yes: {
                          kind: 'question',
                          text: "Is it a cup?",
                          yes: { kind: 'guess', name: "a cup" },
                          no: { kind: 'guess', name: "a doll" },
                        },
                        no: { kind: 'guess', name: "a drill" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a dustpan, a flashlight, or a football?",
                      yes: {
                        kind: 'question',
                        text: "Is it a dustpan or a flashlight?",
                        yes: {
                          kind: 'question',
                          text: "Is it a dustpan?",
                          yes: { kind: 'guess', name: "a dustpan" },
                          no: { kind: 'guess', name: "a flashlight" },
                        },
                        no: { kind: 'guess', name: "a football" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a fork or a Frisbee?",
                        yes: {
                          kind: 'question',
                          text: "Is it a fork?",
                          yes: { kind: 'guess', name: "a fork" },
                          no: { kind: 'guess', name: "a Frisbee" },
                        },
                        no: { kind: 'guess', name: "a glass" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it a golf club, a hammer, or a jump rope, or something else in that same bunch (12 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a golf club, a hammer, or a jump rope, or something else in that same bunch (6 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a golf club, a hammer, or a jump rope?",
                      yes: {
                        kind: 'question',
                        text: "Is it a golf club or a hammer?",
                        yes: {
                          kind: 'question',
                          text: "Is it a golf club?",
                          yes: { kind: 'guess', name: "a golf club" },
                          no: { kind: 'guess', name: "a hammer" },
                        },
                        no: { kind: 'guess', name: "a jump rope" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a key or a keychain?",
                        yes: {
                          kind: 'question',
                          text: "Is it a key?",
                          yes: { kind: 'guess', name: "a key" },
                          no: { kind: 'guess', name: "a keychain" },
                        },
                        no: { kind: 'guess', name: "a knife" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a ladder, a lighter, or a lock?",
                      yes: {
                        kind: 'question',
                        text: "Is it a ladder or a lighter?",
                        yes: {
                          kind: 'question',
                          text: "Is it a ladder?",
                          yes: { kind: 'guess', name: "a ladder" },
                          no: { kind: 'guess', name: "a lighter" },
                        },
                        no: { kind: 'guess', name: "a lock" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a magnet or a map?",
                        yes: {
                          kind: 'question',
                          text: "Is it a magnet?",
                          yes: { kind: 'guess', name: "a magnet" },
                          no: { kind: 'guess', name: "a map" },
                        },
                        no: { kind: 'guess', name: "a match" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a microscope, a mug, or a nail, or something else in that same bunch (6 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a microscope, a mug, or a nail?",
                      yes: {
                        kind: 'question',
                        text: "Is it a microscope or a mug?",
                        yes: {
                          kind: 'question',
                          text: "Is it a microscope?",
                          yes: { kind: 'guess', name: "a microscope" },
                          no: { kind: 'guess', name: "a mug" },
                        },
                        no: { kind: 'guess', name: "a nail" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a napkin or a needle?",
                        yes: {
                          kind: 'question',
                          text: "Is it a napkin?",
                          yes: { kind: 'guess', name: "a napkin" },
                          no: { kind: 'guess', name: "a needle" },
                        },
                        no: { kind: 'guess', name: "a padlock" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a paperclip, a phone case, or a pillowcase?",
                      yes: {
                        kind: 'question',
                        text: "Is it a paperclip or a phone case?",
                        yes: {
                          kind: 'question',
                          text: "Is it a paperclip?",
                          yes: { kind: 'guess', name: "a paperclip" },
                          no: { kind: 'guess', name: "a phone case" },
                        },
                        no: { kind: 'guess', name: "a pillowcase" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a plate?",
                        yes: { kind: 'guess', name: "a plate" },
                        no: { kind: 'guess', name: "a puzzle" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Does its name have more than one word?",
                yes: {
                  kind: 'question',
                  text: "Is it a quilt, a rubber band, or a saw, or something else in that same bunch (14 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it a quilt, a rubber band, or a saw, or something else in that same bunch (7 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a quilt, a rubber band, a saw, or a screw?",
                      yes: {
                        kind: 'question',
                        text: "Is it a quilt or a rubber band?",
                        yes: {
                          kind: 'question',
                          text: "Is it a quilt?",
                          yes: { kind: 'guess', name: "a quilt" },
                          no: { kind: 'guess', name: "a rubber band" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a saw?",
                          yes: { kind: 'guess', name: "a saw" },
                          no: { kind: 'guess', name: "a screw" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a screwdriver or a sewing machine?",
                        yes: {
                          kind: 'question',
                          text: "Is it a screwdriver?",
                          yes: { kind: 'guess', name: "a screwdriver" },
                          no: { kind: 'guess', name: "a sewing machine" },
                        },
                        no: { kind: 'guess', name: "a sheet" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a soccer ball, a sponge, a spoon, or a sticker?",
                      yes: {
                        kind: 'question',
                        text: "Is it a soccer ball or a sponge?",
                        yes: {
                          kind: 'question',
                          text: "Is it a soccer ball?",
                          yes: { kind: 'guess', name: "a soccer ball" },
                          no: { kind: 'guess', name: "a sponge" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a spoon?",
                          yes: { kind: 'guess', name: "a spoon" },
                          no: { kind: 'guess', name: "a sticker" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a suitcase or a teddy bear?",
                        yes: {
                          kind: 'question',
                          text: "Is it a suitcase?",
                          yes: { kind: 'guess', name: "a suitcase" },
                          no: { kind: 'guess', name: "a teddy bear" },
                        },
                        no: { kind: 'guess', name: "a telescope" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it a tennis ball, a tennis racket, or a tissues box, or something else in that same bunch (7 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it a tennis ball, a tennis racket, a tissues box, or a toothbrush?",
                      yes: {
                        kind: 'question',
                        text: "Is it a tennis ball or a tennis racket?",
                        yes: {
                          kind: 'question',
                          text: "Is it a tennis ball?",
                          yes: { kind: 'guess', name: "a tennis ball" },
                          no: { kind: 'guess', name: "a tennis racket" },
                        },
                        no: {
                          kind: 'question',
                          text: "Is it a tissues box?",
                          yes: { kind: 'guess', name: "a tissues box" },
                          no: { kind: 'guess', name: "a toothbrush" },
                        },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it a towel or a water bottle?",
                        yes: {
                          kind: 'question',
                          text: "Is it a towel?",
                          yes: { kind: 'guess', name: "a towel" },
                          no: { kind: 'guess', name: "a water bottle" },
                        },
                        no: { kind: 'guess', name: "a wrench" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it a yoga mat, a zipper, or an action figure?",
                      yes: {
                        kind: 'question',
                        text: "Is it a yoga mat or a zipper?",
                        yes: {
                          kind: 'question',
                          text: "Is it a yoga mat?",
                          yes: { kind: 'guess', name: "a yoga mat" },
                          no: { kind: 'guess', name: "a zipper" },
                        },
                        no: { kind: 'guess', name: "an action figure" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it an alarm clock or playing cards?",
                        yes: {
                          kind: 'question',
                          text: "Is it an alarm clock?",
                          yes: { kind: 'guess', name: "an alarm clock" },
                          no: { kind: 'guess', name: "playing cards" },
                        },
                        no: { kind: 'guess', name: "toilet paper" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Is it binoculars, conditioner, or deodorant, or something else in that same bunch (10 options)?",
                  yes: {
                    kind: 'question',
                    text: "Is it binoculars, conditioner, or deodorant, or something else in that same bunch (5 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it binoculars, conditioner, or deodorant?",
                      yes: {
                        kind: 'question',
                        text: "Is it binoculars or conditioner?",
                        yes: {
                          kind: 'question',
                          text: "Is it binoculars?",
                          yes: { kind: 'guess', name: "binoculars" },
                          no: { kind: 'guess', name: "conditioner" },
                        },
                        no: { kind: 'guess', name: "deodorant" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it dice?",
                        yes: { kind: 'guess', name: "dice" },
                        no: { kind: 'guess', name: "dumbbells" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it Lego, lotion, or luggage?",
                      yes: {
                        kind: 'question',
                        text: "Is it Lego or lotion?",
                        yes: {
                          kind: 'question',
                          text: "Is it Lego?",
                          yes: { kind: 'guess', name: "Lego" },
                          no: { kind: 'guess', name: "lotion" },
                        },
                        no: { kind: 'guess', name: "luggage" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it medicine?",
                        yes: { kind: 'guess', name: "medicine" },
                        no: { kind: 'guess', name: "perfume" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Is it pliers, shampoo, or soap, or something else in that same bunch (5 options)?",
                    yes: {
                      kind: 'question',
                      text: "Is it pliers, shampoo, or soap?",
                      yes: {
                        kind: 'question',
                        text: "Is it pliers or shampoo?",
                        yes: {
                          kind: 'question',
                          text: "Is it pliers?",
                          yes: { kind: 'guess', name: "pliers" },
                          no: { kind: 'guess', name: "shampoo" },
                        },
                        no: { kind: 'guess', name: "soap" },
                      },
                      no: {
                        kind: 'question',
                        text: "Is it sunscreen?",
                        yes: { kind: 'guess', name: "sunscreen" },
                        no: { kind: 'guess', name: "thread" },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Is it tissue or toothpaste?",
                      yes: {
                        kind: 'question',
                        text: "Is it tissue?",
                        yes: { kind: 'guess', name: "tissue" },
                        no: { kind: 'guess', name: "toothpaste" },
                      },
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
