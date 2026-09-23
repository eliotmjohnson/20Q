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
export const STORAGE_KEY = 'twentyq-tree-v12'
export const MAX_QUESTIONS = 20

/** Bump this whenever the seeded question order/content changes. */
export const SEED_VERSION = 12
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

/** Seed v12: classic 20Q attribute questions only; names only on final guess. */
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
              yes: {
                kind: 'question',
                text: "A woman?",
                yes: {
                  kind: 'question',
                  text: "Associated with witchcraft or chaos magic?",
                  yes: { kind: 'guess', name: "Scarlet Witch" },
                  no: { kind: 'guess', name: "Captain Marvel" },
                },
                no: {
                  kind: 'question',
                  text: "Associated with a mystical eye / magical artifacts?",
                  yes: { kind: 'guess', name: "Doctor Strange" },
                  no: { kind: 'guess', name: "Thor" },
                },
              },
              no: {
                kind: 'question',
                text: "Primarily a villain rather than a hero?",
                yes: { kind: 'guess', name: "Venom" },
                no: {
                  kind: 'question',
                  text: "Known for using a bow and arrows?",
                  yes: { kind: 'guess', name: "Hawkeye" },
                  no: {
                    kind: 'question',
                    text: "Known for great strength more than gadgets?",
                    yes: { kind: 'guess', name: "Hulk" },
                    no: {
                      kind: 'question',
                      text: "Often depicted as armored / wearing a metal suit?",
                      yes: { kind: 'guess', name: "Iron Man" },
                      no: {
                        kind: 'question',
                        text: "Known for swinging between buildings?",
                        yes: { kind: 'guess', name: "Spider-Man" },
                        no: {
                          kind: 'question',
                          text: "Associated with an African kingdom in the comics?",
                          yes: { kind: 'guess', name: "Black Panther" },
                          no: {
                            kind: 'question',
                            text: "Known for regenerating from almost any injury?",
                            yes: {
                              kind: 'question',
                              text: "Usually portrayed as funny / quippy in recent films?",
                              yes: { kind: 'guess', name: "Deadpool" },
                              no: { kind: 'guess', name: "Wolverine" },
                            },
                            no: {
                              kind: 'question',
                              text: "A woman?",
                              yes: { kind: 'guess', name: "Black Widow" },
                              no: { kind: 'guess', name: "Captain America" },
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
              text: "Usually wears a cape in classic depictions?",
              yes: {
                kind: 'question',
                text: "Known for great strength more than gadgets?",
                yes: {
                  kind: 'question',
                  text: "A woman?",
                  yes: { kind: 'guess', name: "Wonder Woman" },
                  no: { kind: 'guess', name: "Superman" },
                },
                no: { kind: 'guess', name: "Batman" },
              },
              no: {
                kind: 'question',
                text: "Primarily a villain rather than a hero?",
                yes: { kind: 'guess', name: "Joker" },
                no: {
                  kind: 'question',
                  text: "Associated with underwater settings?",
                  yes: { kind: 'guess', name: "Aquaman" },
                  no: {
                    kind: 'question',
                    text: "Known for super speed?",
                    yes: { kind: 'guess', name: "Flash" },
                    no: { kind: 'guess', name: "Green Lantern" },
                  },
                },
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
                text: "Primarily known as a gold-colored protocol droid?",
                yes: { kind: 'guess', name: "C-3PO" },
                no: { kind: 'guess', name: "R2-D2" },
              },
              no: {
                kind: 'question',
                text: "A Wookiee or similarly furry non-human?",
                yes: { kind: 'guess', name: "Chewbacca" },
                no: {
                  kind: 'question',
                  text: "Often associated with the dark side / Sith?",
                  yes: {
                    kind: 'question',
                    text: "Wears a shiny black helmet and cape in classic films?",
                    yes: { kind: 'guess', name: "Darth Vader" },
                    no: { kind: 'guess', name: "Kylo Ren" },
                  },
                  no: {
                    kind: 'question',
                    text: "A bounty hunter?",
                    yes: { kind: 'guess', name: "Boba Fett" },
                    no: {
                      kind: 'question',
                      text: "A small, green, long-eared Force user?",
                      yes: {
                        kind: 'question',
                        text: "A child / toddler version of that species?",
                        yes: { kind: 'guess', name: "Baby Yoda" },
                        no: { kind: 'guess', name: "Yoda" },
                      },
                      no: {
                        kind: 'question',
                        text: "A woman?",
                        yes: {
                          kind: 'question',
                          text: "A queen / senator from Naboo in the prequels?",
                          yes: { kind: 'guess', name: "Padmé Amidala" },
                          no: {
                            kind: 'question',
                            text: "A scavenger who becomes a Jedi in the sequels?",
                            yes: { kind: 'guess', name: "Rey" },
                            no: { kind: 'guess', name: "Princess Leia" },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "A smuggler / pilot of the Millennium Falcon?",
                          yes: { kind: 'guess', name: "Han Solo" },
                          no: {
                            kind: 'question',
                            text: "A Jedi master who trained Anakin?",
                            yes: { kind: 'guess', name: "Obi-Wan Kenobi" },
                            no: { kind: 'guess', name: "Luke Skywalker" },
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
              text: "Animated / Disney / cartoon?",
              yes: {
                kind: 'question',
                text: "From anime or Japanese games/manga originally?",
                yes: {
                  kind: 'question',
                  text: "A Pokémon or Pokémon trainer?",
                  yes: {
                    kind: 'question',
                    text: "An electric mouse-like creature?",
                    yes: { kind: 'guess', name: "Pikachu" },
                    no: { kind: 'guess', name: "Ash Ketchum" },
                  },
                  no: {
                    kind: 'question',
                    text: "Known for super speed and blue spines?",
                    yes: { kind: 'guess', name: "Sonic the Hedgehog" },
                    no: {
                      kind: 'question',
                      text: "A martial artist who can go Super Saiyan?",
                      yes: { kind: 'guess', name: "Goku" },
                      no: { kind: 'guess', name: "Naruto" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "A Disney or Pixar character?",
                  yes: {
                    kind: 'question',
                    text: "A princess with ice powers?",
                    yes: { kind: 'guess', name: "Elsa" },
                    no: {
                      kind: 'question',
                      text: "A lion cub who becomes king in an animated film?",
                      yes: { kind: 'guess', name: "Simba" },
                      no: {
                        kind: 'question',
                        text: "A toy cowboy or space ranger?",
                        yes: {
                          kind: 'question',
                          text: "A space ranger action figure?",
                          yes: { kind: 'guess', name: "Buzz Lightyear" },
                          no: { kind: 'guess', name: "Woody" },
                        },
                        no: {
                          kind: 'question',
                          text: "A bear who loves honey?",
                          yes: { kind: 'guess', name: "Winnie the Pooh" },
                          no: {
                            kind: 'question',
                            text: "A classic Disney duck character?",
                            yes: { kind: 'guess', name: "Donald Duck" },
                            no: {
                              kind: 'question',
                              text: "A dog that walks and talks like a person?",
                              yes: { kind: 'guess', name: "Goofy" },
                              no: { kind: 'guess', name: "Mickey Mouse" },
                            },
                          },
                        },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "From The Simpsons?",
                    yes: {
                      kind: 'question',
                      text: "A child rather than an adult?",
                      yes: { kind: 'guess', name: "Bart Simpson" },
                      no: { kind: 'guess', name: "Homer Simpson" },
                    },
                    no: {
                      kind: 'question',
                      text: "A child rather than an adult?",
                      yes: {
                        kind: 'question',
                        text: "A talking pig from a British kids TV show?",
                        yes: { kind: 'guess', name: "Peppa Pig" },
                        no: { kind: 'guess', name: "Bluey" },
                      },
                      no: {
                        kind: 'question',
                        text: "Lives in a pineapple under the sea?",
                        yes: { kind: 'guess', name: "SpongeBob" },
                        no: {
                          kind: 'question',
                          text: "A great dane that solves mysteries?",
                          yes: { kind: 'guess', name: "Scooby-Doo" },
                          no: {
                            kind: 'question',
                            text: "A green ogre?",
                            yes: { kind: 'guess', name: "Shrek" },
                            no: {
                              kind: 'question',
                              text: "A plumber from Nintendo games?",
                              yes: { kind: 'guess', name: "Mario" },
                              no: {
                                kind: 'question',
                                text: "A small yellow henchman creature?",
                                yes: { kind: 'guess', name: "Minion" },
                                no: {
                                  kind: 'question',
                                  text: "A white cat with a bow, from Sanrio?",
                                  yes: { kind: 'guess', name: "Hello Kitty" },
                                  no: { kind: 'guess', name: "Bugs Bunny" },
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
                text: "A mythical / fantasy creature rather than a named person?",
                yes: {
                  kind: 'question',
                  text: "Typically undead or associated with death?",
                  yes: {
                    kind: 'question',
                    text: "Known for drinking blood?",
                    yes: { kind: 'guess', name: "Vampire" },
                    no: {
                      kind: 'question',
                      text: "A mindless walking corpse in horror fiction?",
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
                      no: {
                        kind: 'question',
                        text: "Half human, half fish?",
                        yes: { kind: 'guess', name: "Mermaid" },
                        no: {
                          kind: 'question',
                          text: "A pointed-eared forest dweller?",
                          yes: { kind: 'guess', name: "Elf" },
                          no: { kind: 'guess', name: "Wizard" },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Uses magic spells as a profession?",
                  yes: { kind: 'guess', name: "Gandalf" },
                  no: {
                    kind: 'question',
                    text: "A giant movie monster?",
                    yes: {
                      kind: 'question',
                      text: "A giant ape?",
                      yes: { kind: 'guess', name: "King Kong" },
                      no: { kind: 'guess', name: "Godzilla" },
                    },
                    no: {
                      kind: 'question',
                      text: "Associated with Christmas?",
                      yes: { kind: 'guess', name: "Santa Claus" },
                      no: {
                        kind: 'question',
                        text: "From Lord of the Rings / Tolkien?",
                        yes: { kind: 'guess', name: "Frodo" },
                        no: {
                          kind: 'question',
                          text: "From Harry Potter?",
                          yes: {
                            kind: 'question',
                            text: "A witch / female student of magic?",
                            yes: { kind: 'guess', name: "Hermione Granger" },
                            no: { kind: 'guess', name: "Harry Potter" },
                          },
                          no: {
                            kind: 'question',
                            text: "A detective who wears a deerstalker?",
                            yes: { kind: 'guess', name: "Sherlock Holmes" },
                            no: {
                              kind: 'question',
                              text: "A pirate?",
                              yes: { kind: 'guess', name: "Jack Sparrow" },
                              no: {
                                kind: 'question',
                                text: "An archaeologist who uses a whip?",
                                yes: { kind: 'guess', name: "Indiana Jones" },
                                no: { kind: 'guess', name: "James Bond" },
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
          text: "From a book, myth, or video game?",
          yes: {
            kind: 'question',
            text: "Primarily from a video game?",
            yes: {
              kind: 'question',
              text: "A yellow round creature that eats dots?",
              yes: { kind: 'guess', name: "Pac-Man" },
              no: {
                kind: 'question',
                text: "A pink puffball that inhales enemies?",
                yes: { kind: 'guess', name: "Kirby" },
                no: {
                  kind: 'question',
                  text: "A Spartan warrior in futuristic armor?",
                  yes: { kind: 'guess', name: "Master Chief" },
                  no: {
                    kind: 'question',
                    text: "A god of war in the game series?",
                    yes: { kind: 'guess', name: "Kratos" },
                    no: {
                      kind: 'question',
                      text: "A princess of Hyrule?",
                      yes: { kind: 'guess', name: "Zelda" },
                      no: { kind: 'guess', name: "Link" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "From Greek / Roman mythology?",
              yes: {
                kind: 'question',
                text: "Ruler of the underworld?",
                yes: { kind: 'guess', name: "Hades" },
                no: {
                  kind: 'question',
                  text: "Has snakes for hair?",
                  yes: { kind: 'guess', name: "Medusa" },
                  no: {
                    kind: 'question',
                    text: "King of the gods?",
                    yes: { kind: 'guess', name: "Zeus" },
                    no: { kind: 'guess', name: "Hercules" },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "A holiday or folklore gift-bringer / visitor?",
                yes: {
                  kind: 'question',
                  text: "Steals Christmas in a Dr. Seuss story?",
                  yes: { kind: 'guess', name: "The Grinch" },
                  no: {
                    kind: 'question',
                    text: "Associated with Valentine's Day?",
                    yes: { kind: 'guess', name: "Cupid" },
                    no: {
                      kind: 'question',
                      text: "Collects lost teeth?",
                      yes: { kind: 'guess', name: "Tooth Fairy" },
                      no: { kind: 'guess', name: "Easter Bunny" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "A classic horror character?",
                  yes: {
                    kind: 'question',
                    text: "A vampire count?",
                    yes: { kind: 'guess', name: "Dracula" },
                    no: { kind: 'guess', name: "Frankenstein" },
                  },
                  no: {
                    kind: 'question',
                    text: "Steals from the rich to give to the poor?",
                    yes: { kind: 'guess', name: "Robin Hood" },
                    no: {
                      kind: 'question',
                      text: "A legendary British king with a round table?",
                      yes: { kind: 'guess', name: "King Arthur" },
                      no: { kind: 'guess', name: "Peter Pan" },
                    },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "A cryptid / legendary creature people claim to have seen?",
            yes: {
              kind: 'question',
              text: "A large ape-like creature of the Pacific Northwest?",
              yes: { kind: 'guess', name: "Bigfoot" },
              no: { kind: 'guess', name: "the Loch Ness Monster" },
            },
            no: {
              kind: 'question',
              text: "Mainly known from internet jokes / memes?",
              yes: { kind: 'guess', name: "a meme character" },
              no: { kind: 'guess', name: "a mascot" },
            },
          },
        },
      },
      no: {
        kind: 'question',
        text: "Is it mainly a job or occupation (like teacher, doctor, firefighter)?",
        yes: {
          kind: 'question',
          text: "Works mainly in medicine or animal health?",
          yes: {
            kind: 'question',
            text: "Treats animals?",
            yes: { kind: 'guess', name: "a vet" },
            no: {
              kind: 'question',
              text: "Focuses on teeth?",
              yes: { kind: 'guess', name: "a dentist" },
              no: {
                kind: 'question',
                text: "Typically works in a hospital assisting physicians?",
                yes: { kind: 'guess', name: "a nurse" },
                no: { kind: 'guess', name: "a doctor" },
              },
            },
          },
          no: {
            kind: 'question',
            text: "A first responder or public safety role?",
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
              text: "Works with food professionally?",
              yes: { kind: 'guess', name: "a chef" },
              no: {
                kind: 'question',
                text: "Flies aircraft?",
                yes: {
                  kind: 'question',
                  text: "Travels to space?",
                  yes: { kind: 'guess', name: "an astronaut" },
                  no: { kind: 'guess', name: "a pilot" },
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
                      no: {
                        kind: 'question',
                        text: "Works with wood / building frames?",
                        yes: { kind: 'guess', name: "a carpenter" },
                        no: { kind: 'guess', name: "a mechanic" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "A legal / courtroom profession?",
                    yes: {
                      kind: 'question',
                      text: "Presides over a court?",
                      yes: { kind: 'guess', name: "a judge" },
                      no: { kind: 'guess', name: "a lawyer" },
                    },
                    no: {
                      kind: 'question',
                      text: "Works in education or coaching?",
                      yes: {
                        kind: 'question',
                        text: "Works in a library?",
                        yes: { kind: 'guess', name: "a librarian" },
                        no: {
                          kind: 'question',
                          text: "Trains athletes or a team?",
                          yes: { kind: 'guess', name: "a coach" },
                          no: { kind: 'guess', name: "a teacher" },
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
                            no: {
                              kind: 'question',
                              text: "Takes photographs professionally?",
                              yes: { kind: 'guess', name: "a photographer" },
                              no: { kind: 'guess', name: "a writer" },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "Writes books or articles as a primary craft?",
                          yes: { kind: 'guess', name: "a journalist" },
                          no: {
                            kind: 'question',
                            text: "Works on a farm?",
                            yes: { kind: 'guess', name: "a farmer" },
                            no: {
                              kind: 'question',
                              text: "Writes software / code?",
                              yes: { kind: 'guess', name: "a software developer" },
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
              text: "Known mainly as a musician / singer?",
              yes: {
                kind: 'question',
                text: "A country / pop singer-songwriter known for re-recording albums?",
                yes: { kind: 'guess', name: "Taylor Swift" },
                no: { kind: 'guess', name: "Beyoncé" },
              },
              no: {
                kind: 'question',
                text: "Known mainly as an athlete?",
                yes: {
                  kind: 'question',
                  text: "A soccer / football player?",
                  yes: { kind: 'guess', name: "Lionel Messi" },
                  no: { kind: 'guess', name: "Serena Williams" },
                },
                no: {
                  kind: 'question',
                  text: "Known mainly as an actor / entertainer?",
                  yes: {
                    kind: 'question',
                    text: "A talk-show host and media mogul?",
                    yes: { kind: 'guess', name: "Oprah Winfrey" },
                    no: {
                      kind: 'question',
                      text: "Also known as a professional wrestler?",
                      yes: { kind: 'guess', name: "Dwayne Johnson" },
                      no: {
                        kind: 'question',
                        text: "Starred in Forrest Gump?",
                        yes: { kind: 'guess', name: "Tom Hanks" },
                        no: { kind: 'guess', name: "Leonardo DiCaprio" },
                      },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "A political leader or activist?",
                    yes: { kind: 'guess', name: "Barack Obama" },
                    no: {
                      kind: 'question',
                      text: "Co-founded Microsoft?",
                      yes: { kind: 'guess', name: "Bill Gates" },
                      no: { kind: 'guess', name: "Elon Musk" },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Known mainly as a musician / singer?",
              yes: {
                kind: 'question',
                text: "Known as the King of Pop?",
                yes: { kind: 'guess', name: "Michael Jackson" },
                no: { kind: 'guess', name: "Elvis Presley" },
              },
              no: {
                kind: 'question',
                text: "Known mainly as an athlete?",
                yes: {
                  kind: 'question',
                  text: "A basketball legend?",
                  yes: { kind: 'guess', name: "Michael Jordan" },
                  no: {
                    kind: 'question',
                    text: "A boxer?",
                    yes: { kind: 'guess', name: "Muhammad Ali" },
                    no: { kind: 'guess', name: "Babe Ruth" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Known mainly as an actor / entertainer?",
                  yes: { kind: 'guess', name: "Marilyn Monroe" },
                  no: {
                    kind: 'question',
                    text: "A political leader or activist?",
                    yes: {
                      kind: 'question',
                      text: "An ancient Egyptian ruler?",
                      yes: { kind: 'guess', name: "Cleopatra" },
                      no: {
                        kind: 'question',
                        text: "A French emperor?",
                        yes: { kind: 'guess', name: "Napoleon" },
                        no: {
                          kind: 'question',
                          text: "A U.S. president?",
                          yes: { kind: 'guess', name: "Abraham Lincoln" },
                          no: {
                            kind: 'question',
                            text: "Led India's independence movement with nonviolence?",
                            yes: { kind: 'guess', name: "Mahatma Gandhi" },
                            no: {
                              kind: 'question',
                              text: "Fought apartheid in South Africa?",
                              yes: { kind: 'guess', name: "Nelson Mandela" },
                              no: {
                                kind: 'question',
                                text: "A civil rights leader known for the \"I Have a Dream\" speech?",
                                yes: { kind: 'guess', name: "Martin Luther King Jr." },
                                no: { kind: 'guess', name: "Rosa Parks" },
                              },
                            },
                          },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "A tech entrepreneur?",
                      yes: { kind: 'guess', name: "Steve Jobs" },
                      no: {
                        kind: 'question',
                        text: "A scientist or inventor?",
                        yes: {
                          kind: 'question',
                          text: "First person on the Moon?",
                          yes: { kind: 'guess', name: "Neil Armstrong" },
                          no: {
                            kind: 'question',
                            text: "A woman who researched radioactivity?",
                            yes: { kind: 'guess', name: "Marie Curie" },
                            no: {
                              kind: 'question',
                              text: "Known for relativity?",
                              yes: { kind: 'guess', name: "Albert Einstein" },
                              no: {
                                kind: 'question',
                                text: "Known for AC electricity inventions?",
                                yes: { kind: 'guess', name: "Nikola Tesla" },
                                no: { kind: 'guess', name: "Leonardo da Vinci" },
                              },
                            },
                          },
                        },
                        no: {
                          kind: 'question',
                          text: "A painter?",
                          yes: {
                            kind: 'question',
                            text: "A Mexican painter known for self-portraits?",
                            yes: { kind: 'guess', name: "Frida Kahlo" },
                            no: { kind: 'guess', name: "Vincent van Gogh" },
                          },
                          no: { kind: 'guess', name: "Shakespeare" },
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
              text: "One of a pair born at the same time?",
              yes: { kind: 'guess', name: "a twin" },
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
            text: "Known for using echolocation and often performing in shows?",
            yes: { kind: 'guess', name: "a dolphin" },
            no: {
              kind: 'question',
              text: "The largest animals on Earth?",
              yes: { kind: 'guess', name: "a whale" },
              no: {
                kind: 'question',
                text: "A black-and-white predatory whale?",
                yes: { kind: 'guess', name: "an orca" },
                no: {
                  kind: 'question',
                  text: "Has large tusks?",
                  yes: { kind: 'guess', name: "a walrus" },
                  no: {
                    kind: 'question',
                    text: "A gentle sea cow / slow herbivore?",
                    yes: { kind: 'guess', name: "a manatee" },
                    no: {
                      kind: 'question',
                      text: "Often seen floating on its back cracking shellfish?",
                      yes: { kind: 'guess', name: "an otter" },
                      no: { kind: 'guess', name: "a seal" },
                    },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "Hard shell or exoskeleton?",
            yes: {
              kind: 'question',
              text: "A reptile with a shell?",
              yes: { kind: 'guess', name: "a turtle" },
              no: {
                kind: 'question',
                text: "Typically lives in a bivalve shell (two halves)?",
                yes: {
                  kind: 'question',
                  text: "Often eaten raw on the half shell?",
                  yes: { kind: 'guess', name: "an oyster" },
                  no: { kind: 'guess', name: "a clam" },
                },
                no: {
                  kind: 'question',
                  text: "Has large claws and is often served steamed?",
                  yes: { kind: 'guess', name: "a lobster" },
                  no: {
                    kind: 'question',
                    text: "Walks sideways?",
                    yes: { kind: 'guess', name: "a crab" },
                    no: { kind: 'guess', name: "a shrimp" },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "Has tentacles?",
              yes: {
                kind: 'question',
                text: "A soft, stinging gelatinous animal?",
                yes: { kind: 'guess', name: "a jellyfish" },
                no: { kind: 'guess', name: "an octopus" },
              },
              no: {
                kind: 'question',
                text: "A predator with fins and lots of teeth?",
                yes: { kind: 'guess', name: "a shark" },
                no: {
                  kind: 'question',
                  text: "Shaped like a horse's head?",
                  yes: { kind: 'guess', name: "a seahorse" },
                  no: {
                    kind: 'question',
                    text: "Has five arms / radial symmetry?",
                    yes: { kind: 'guess', name: "a starfish" },
                    no: {
                      kind: 'question',
                      text: "Long and snake-like?",
                      yes: { kind: 'guess', name: "an eel" },
                      no: { kind: 'guess', name: "a goldfish" },
                    },
                  },
                },
              },
            },
          },
        },
        no: {
          kind: 'question',
          text: "Can it fly (under its own power)?",
          yes: {
            kind: 'question',
            text: "Bird?",
            yes: {
              kind: 'question',
              text: "Bird of prey?",
              yes: {
                kind: 'question',
                text: "Primarily nocturnal?",
                yes: { kind: 'guess', name: "an owl" },
                no: {
                  kind: 'question',
                  text: "Known for eating carrion / bald head?",
                  yes: { kind: 'guess', name: "a vulture" },
                  no: {
                    kind: 'question',
                    text: "A national symbol of the United States?",
                    yes: { kind: 'guess', name: "an eagle" },
                    no: {
                      kind: 'question',
                      text: "Famous for incredible diving speed?",
                      yes: { kind: 'guess', name: "a falcon" },
                      no: { kind: 'guess', name: "a hawk" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Farm bird / commonly raised for food?",
                yes: {
                  kind: 'question',
                  text: "A male chicken known for crowing?",
                  yes: { kind: 'guess', name: "a rooster" },
                  no: {
                    kind: 'question',
                    text: "Associated with Thanksgiving in the U.S.?",
                    yes: { kind: 'guess', name: "a turkey" },
                    no: {
                      kind: 'question',
                      text: "Has a flat bill and often swims?",
                      yes: { kind: 'guess', name: "a duck" },
                      no: {
                        kind: 'question',
                        text: "Larger than a duck, often hissing?",
                        yes: { kind: 'guess', name: "a goose" },
                        no: { kind: 'guess', name: "a chicken" },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Cannot fly, but swims well?",
                  yes: {
                    kind: 'question',
                    text: "Lives in cold / polar regions?",
                    yes: { kind: 'guess', name: "a penguin" },
                    no: { kind: 'guess', name: "an ostrich" },
                  },
                  no: {
                    kind: 'question',
                    text: "Bright pink?",
                    yes: { kind: 'guess', name: "a flamingo" },
                    no: {
                      kind: 'question',
                      text: "Known for mimicking speech?",
                      yes: { kind: 'guess', name: "a parrot" },
                      no: {
                        kind: 'question',
                        text: "Tiny and hovers while feeding on nectar?",
                        yes: { kind: 'guess', name: "a hummingbird" },
                        no: {
                          kind: 'question',
                          text: "Often seen in cities, gray?",
                          yes: { kind: 'guess', name: "a pigeon" },
                          no: {
                            kind: 'question',
                            text: "All black and known for being clever?",
                            yes: { kind: 'guess', name: "a crow" },
                            no: { kind: 'guess', name: "a swan" },
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
              text: "A mammal?",
              yes: { kind: 'guess', name: "a bat" },
              no: {
                kind: 'question',
                text: "Produces honey?",
                yes: { kind: 'guess', name: "a bee" },
                no: {
                  kind: 'question',
                  text: "Known for colorful wings and metamorphosis from a caterpillar?",
                  yes: { kind: 'guess', name: "a butterfly" },
                  no: {
                    kind: 'question',
                    text: "Bites / sucks blood?",
                    yes: { kind: 'guess', name: "a mosquito" },
                    no: {
                      kind: 'question',
                      text: "Active mainly at night, duller wings than a butterfly?",
                      yes: { kind: 'guess', name: "a moth" },
                      no: {
                        kind: 'question',
                        text: "Has spots and is considered lucky?",
                        yes: { kind: 'guess', name: "a ladybug" },
                        no: {
                          kind: 'question',
                          text: "Has four long wings and hunts other insects?",
                          yes: { kind: 'guess', name: "a dragonfly" },
                          no: { kind: 'guess', name: "a fly" },
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
            text: "Common household pet?",
            yes: {
              kind: 'question',
              text: "A mammal commonly kept indoors?",
              yes: {
                kind: 'question',
                text: "Known for purring and meowing?",
                yes: { kind: 'guess', name: "a cat" },
                no: {
                  kind: 'question',
                  text: "Known for barking?",
                  yes: { kind: 'guess', name: "a dog" },
                  no: {
                    kind: 'question',
                    text: "Has spines / quills?",
                    yes: { kind: 'guess', name: "a hedgehog" },
                    no: {
                      kind: 'question',
                      text: "Long-bodied and often kept for hunting rodents?",
                      yes: { kind: 'guess', name: "a ferret" },
                      no: {
                        kind: 'question',
                        text: "Has long ears and hops?",
                        yes: { kind: 'guess', name: "a rabbit" },
                        no: {
                          kind: 'question',
                          text: "Larger than a hamster, often squeaks, no tail?",
                          yes: { kind: 'guess', name: "a guinea pig" },
                          no: {
                            kind: 'question',
                            text: "Stores food in cheek pouches?",
                            yes: { kind: 'guess', name: "a hamster" },
                            no: {
                              kind: 'question',
                              text: "Larger than a typical house mouse, longer tail?",
                              yes: { kind: 'guess', name: "a rat" },
                              no: { kind: 'guess', name: "a mouse" },
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
                text: "Lives in water as a pet?",
                yes: { kind: 'guess', name: "a goldfish" },
                no: {
                  kind: 'question',
                  text: "A bird?",
                  yes: { kind: 'guess', name: "a parrot" },
                  no: {
                    kind: 'question',
                    text: "Has a shell?",
                    yes: { kind: 'guess', name: "a turtle" },
                    no: {
                      kind: 'question',
                      text: "Limbless reptile?",
                      yes: { kind: 'guess', name: "a snake" },
                      no: { kind: 'guess', name: "a lizard" },
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
                text: "Used mainly for riding or pulling?",
                yes: {
                  kind: 'question',
                  text: "Has long ears and is known for braying?",
                  yes: { kind: 'guess', name: "a donkey" },
                  no: { kind: 'guess', name: "a horse" },
                },
                no: {
                  kind: 'question',
                  text: "Produces wool?",
                  yes: { kind: 'guess', name: "a sheep" },
                  no: {
                    kind: 'question',
                    text: "Known for milk and \"moo\"?",
                    yes: { kind: 'guess', name: "a cow" },
                    no: {
                      kind: 'question',
                      text: "Known for oinking / bacon?",
                      yes: { kind: 'guess', name: "a pig" },
                      no: {
                        kind: 'question',
                        text: "Has horns and will eat almost anything?",
                        yes: { kind: 'guess', name: "a goat" },
                        no: { kind: 'guess', name: "a llama" },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "Big cat (lion, tiger, etc.)?",
                yes: {
                  kind: 'question',
                  text: "Known as the king of the jungle / has a mane (male)?",
                  yes: { kind: 'guess', name: "a lion" },
                  no: {
                    kind: 'question',
                    text: "Has black stripes on orange fur?",
                    yes: { kind: 'guess', name: "a tiger" },
                    no: {
                      kind: 'question',
                      text: "The fastest land animal?",
                      yes: { kind: 'guess', name: "a cheetah" },
                      no: {
                        kind: 'question',
                        text: "Often associated with solid black coat in popular usage?",
                        yes: { kind: 'guess', name: "a panther" },
                        no: {
                          kind: 'question',
                          text: "Spotted and found in the Americas?",
                          yes: { kind: 'guess', name: "a jaguar" },
                          no: { kind: 'guess', name: "a leopard" },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "An insect?",
                  yes: {
                    kind: 'question',
                    text: "Has a trunk?",
                    yes: { kind: 'guess', name: "an elephant" },
                    no: { kind: 'guess', name: "an ant" },
                  },
                  no: {
                    kind: 'question',
                    text: "An arachnid with eight legs?",
                    yes: { kind: 'guess', name: "a spider" },
                    no: {
                      kind: 'question',
                      text: "An amphibian?",
                      yes: { kind: 'guess', name: "a frog" },
                      no: {
                        kind: 'question',
                        text: "A reptile?",
                        yes: { kind: 'guess', name: "a crocodile" },
                        no: {
                          kind: 'question',
                          text: "Has a very long neck?",
                          yes: { kind: 'guess', name: "a giraffe" },
                          no: {
                            kind: 'question',
                            text: "Has black and white stripes?",
                            yes: { kind: 'guess', name: "a zebra" },
                            no: {
                              kind: 'question',
                              text: "A marsupial that hops?",
                              yes: { kind: 'guess', name: "a kangaroo" },
                              no: {
                                kind: 'question',
                                text: "A marsupial that eats eucalyptus?",
                                yes: { kind: 'guess', name: "a koala" },
                                no: {
                                  kind: 'question',
                                  text: "Black and white and eats bamboo?",
                                  yes: { kind: 'guess', name: "a panda" },
                                  no: {
                                    kind: 'question',
                                    text: "A great ape, larger than a monkey?",
                                    yes: { kind: 'guess', name: "a gorilla" },
                                    no: {
                                      kind: 'question',
                                      text: "A primate smaller than an ape?",
                                      yes: { kind: 'guess', name: "a monkey" },
                                      no: {
                                        kind: 'question',
                                        text: "Spends a lot of time in water, very large mouth?",
                                        yes: { kind: 'guess', name: "a hippo" },
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
            },
          },
        },
      },
      no: {
        kind: 'question',
        text: "Is it a plant?",
        yes: {
          kind: 'question',
          text: "A tree?",
          yes: {
            kind: 'question',
            text: "Produces edible fruit commonly eaten raw?",
            yes: { kind: 'guess', name: "an apple tree" },
            no: {
              kind: 'question',
              text: "An evergreen with needles / cones?",
              yes: {
                kind: 'question',
                text: "Commonly used as a holiday tree indoors?",
                yes: { kind: 'guess', name: "a Christmas tree" },
                no: {
                  kind: 'question',
                  text: "Among the tallest living trees?",
                  yes: { kind: 'guess', name: "a redwood" },
                  no: { kind: 'guess', name: "a pine tree" },
                },
              },
              no: {
                kind: 'question',
                text: "Has a tropically associated crown of fronds?",
                yes: { kind: 'guess', name: "a palm tree" },
                no: {
                  kind: 'question',
                  text: "Known for maple syrup / fall color?",
                  yes: { kind: 'guess', name: "a maple tree" },
                  no: {
                    kind: 'question',
                    text: "Has long drooping branches?",
                    yes: { kind: 'guess', name: "a willow" },
                    no: { kind: 'guess', name: "an oak tree" },
                  },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "A flower?",
            yes: {
              kind: 'question',
              text: "Typically red and associated with romance?",
              yes: { kind: 'guess', name: "a rose" },
              no: {
                kind: 'question',
                text: "Has a very large yellow head that follows the sun?",
                yes: { kind: 'guess', name: "a sunflower" },
                no: {
                  kind: 'question',
                  text: "A common \"weed\" with puffball seeds?",
                  yes: { kind: 'guess', name: "a dandelion" },
                  no: {
                    kind: 'question',
                    text: "A spring bulb often associated with the Netherlands?",
                    yes: { kind: 'guess', name: "a tulip" },
                    no: {
                      kind: 'question',
                      text: "Often grown as an exotic houseplant with unusual blooms?",
                      yes: { kind: 'guess', name: "an orchid" },
                      no: {
                        kind: 'question',
                        text: "A simple white petal flower with a yellow center?",
                        yes: { kind: 'guess', name: "a daisy" },
                        no: { kind: 'guess', name: "a lily" },
                      },
                    },
                  },
                },
              },
            },
            no: {
              kind: 'question',
              text: "A fungus rather than a green plant?",
              yes: { kind: 'guess', name: "a mushroom" },
              no: {
                kind: 'question',
                text: "Grows in the ocean?",
                yes: { kind: 'guess', name: "seaweed" },
                no: {
                  kind: 'question',
                  text: "Has spines and stores water?",
                  yes: { kind: 'guess', name: "a cactus" },
                  no: {
                    kind: 'question',
                    text: "Eats insects?",
                    yes: { kind: 'guess', name: "a Venus flytrap" },
                    no: {
                      kind: 'question',
                      text: "A tall woody grass used in construction?",
                      yes: { kind: 'guess', name: "bamboo" },
                      no: {
                        kind: 'question',
                        text: "Has feathery fronds, no flowers?",
                        yes: { kind: 'guess', name: "a fern" },
                        no: { kind: 'guess', name: "grass" },
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
    text: "Electronic?",
    yes: {
      kind: 'question',
      text: "Small enough to fit comfortably in a pocket?",
      yes: {
        kind: 'question',
        text: "Primarily used for calls, texts, and pocket apps?",
        yes: { kind: 'guess', name: "a smartphone" },
        no: {
          kind: 'question',
          text: "Worn on the body?",
          yes: {
            kind: 'question',
            text: "Worn on the wrist?",
            yes: {
              kind: 'question',
              text: "Primarily tracks steps / health metrics?",
              yes: { kind: 'guess', name: "a fitness tracker" },
              no: { kind: 'guess', name: "a smartwatch" },
            },
            no: {
              kind: 'question',
              text: "A headset that covers the eyes for virtual reality?",
              yes: { kind: 'guess', name: "a VR headset" },
              no: {
                kind: 'question',
                text: "Over-ear cups rather than in-ear buds?",
                yes: { kind: 'guess', name: "headphones" },
                no: {
                  kind: 'question',
                  text: "Apple-branded wireless earbuds?",
                  yes: { kind: 'guess', name: "AirPods" },
                  no: { kind: 'guess', name: "earbuds" },
                },
              },
            },
          },
          no: {
            kind: 'question',
            text: "A game system you play on a TV?",
            yes: {
              kind: 'question',
              text: "Made by Sony?",
              yes: { kind: 'guess', name: "a PlayStation" },
              no: {
                kind: 'question',
                text: "Made by Microsoft?",
                yes: { kind: 'guess', name: "an Xbox" },
                no: {
                  kind: 'question',
                  text: "A hybrid handheld that also docks to a TV?",
                  yes: { kind: 'guess', name: "a Nintendo Switch" },
                  no: { kind: 'guess', name: "a gaming console" },
                },
              },
            },
            no: {
              kind: 'question',
              text: "A display you watch shows on from across the room?",
              yes: {
                kind: 'question',
                text: "Typically used as a computer display on a desk?",
                yes: { kind: 'guess', name: "a monitor" },
                no: { kind: 'guess', name: "a TV" },
              },
              no: {
                kind: 'question',
                text: "Used mainly to take photographs or video?",
                yes: {
                  kind: 'question',
                  text: "Clips to or sits atop a computer for video calls?",
                  yes: { kind: 'guess', name: "a webcam" },
                  no: { kind: 'guess', name: "a camera" },
                },
                no: {
                  kind: 'question',
                  text: "Used to control a TV from the couch?",
                  yes: { kind: 'guess', name: "a remote control" },
                  no: {
                    kind: 'question',
                    text: "Used for typing?",
                    yes: { kind: 'guess', name: "a keyboard" },
                    no: {
                      kind: 'question',
                      text: "Moved by hand to control a pointer on screen?",
                      yes: { kind: 'guess', name: "a computer mouse" },
                      no: {
                        kind: 'question',
                        text: "Held in hands to play video games?",
                        yes: { kind: 'guess', name: "a game controller" },
                        no: {
                          kind: 'question',
                          text: "Produces sound for a room?",
                          yes: {
                            kind: 'question',
                            text: "A smart speaker you talk to by name?",
                            yes: { kind: 'guess', name: "an Amazon Echo" },
                            no: { kind: 'guess', name: "a speaker" },
                          },
                          no: {
                            kind: 'question',
                            text: "Prints on paper?",
                            yes: { kind: 'guess', name: "a printer" },
                            no: {
                              kind: 'question',
                              text: "Provides Wi-Fi to a home network?",
                              yes: { kind: 'guess', name: "a router" },
                              no: {
                                kind: 'question',
                                text: "Stores files on a small stick you plug in?",
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
      no: {
        kind: 'question',
        text: "A handheld slab with a large touchscreen and no hinged keyboard?",
        yes: { kind: 'guess', name: "a tablet" },
        no: {
          kind: 'question',
          text: "Is it a general-purpose computer (for typing, browsing, apps)?",
          yes: {
            kind: 'question',
            text: "Is it portable and does it fold shut with a built-in keyboard?",
            yes: { kind: 'guess', name: "a laptop" },
            no: { kind: 'guess', name: "a computer" },
          },
          no: {
            kind: 'question',
            text: "Worn on the ears / used mainly for listening to audio?",
            yes: {
              kind: 'question',
              text: "Over-ear cups (not small buds that go in the ear canal)?",
              yes: { kind: 'guess', name: "headphones" },
              no: { kind: 'guess', name: "earbuds" },
            },
            no: {
              kind: 'question',
              text: "Worn on the body?",
              yes: {
                kind: 'question',
                text: "Worn on the wrist?",
                yes: {
                  kind: 'question',
                  text: "Primarily tracks steps / health metrics?",
                  yes: { kind: 'guess', name: "a fitness tracker" },
                  no: { kind: 'guess', name: "a smartwatch" },
                },
                no: {
                  kind: 'question',
                  text: "A headset that covers the eyes for virtual reality?",
                  yes: { kind: 'guess', name: "a VR headset" },
                  no: {
                    kind: 'question',
                    text: "Over-ear cups rather than in-ear buds?",
                    yes: { kind: 'guess', name: "headphones" },
                    no: {
                      kind: 'question',
                      text: "Apple-branded wireless earbuds?",
                      yes: { kind: 'guess', name: "AirPods" },
                      no: { kind: 'guess', name: "earbuds" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "A game system you play on a TV?",
                yes: {
                  kind: 'question',
                  text: "Made by Sony?",
                  yes: { kind: 'guess', name: "a PlayStation" },
                  no: {
                    kind: 'question',
                    text: "Made by Microsoft?",
                    yes: { kind: 'guess', name: "an Xbox" },
                    no: {
                      kind: 'question',
                      text: "A hybrid handheld that also docks to a TV?",
                      yes: { kind: 'guess', name: "a Nintendo Switch" },
                      no: { kind: 'guess', name: "a gaming console" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "A display you watch shows on from across the room?",
                  yes: {
                    kind: 'question',
                    text: "Typically used as a computer display on a desk?",
                    yes: { kind: 'guess', name: "a monitor" },
                    no: { kind: 'guess', name: "a TV" },
                  },
                  no: {
                    kind: 'question',
                    text: "Used mainly to take photographs or video?",
                    yes: {
                      kind: 'question',
                      text: "Clips to or sits atop a computer for video calls?",
                      yes: { kind: 'guess', name: "a webcam" },
                      no: { kind: 'guess', name: "a camera" },
                    },
                    no: {
                      kind: 'question',
                      text: "Used to control a TV from the couch?",
                      yes: { kind: 'guess', name: "a remote control" },
                      no: {
                        kind: 'question',
                        text: "Used for typing?",
                        yes: { kind: 'guess', name: "a keyboard" },
                        no: {
                          kind: 'question',
                          text: "Moved by hand to control a pointer on screen?",
                          yes: { kind: 'guess', name: "a computer mouse" },
                          no: {
                            kind: 'question',
                            text: "Held in hands to play video games?",
                            yes: { kind: 'guess', name: "a game controller" },
                            no: {
                              kind: 'question',
                              text: "Produces sound for a room?",
                              yes: {
                                kind: 'question',
                                text: "A smart speaker you talk to by name?",
                                yes: { kind: 'guess', name: "an Amazon Echo" },
                                no: { kind: 'guess', name: "a speaker" },
                              },
                              no: {
                                kind: 'question',
                                text: "Prints on paper?",
                                yes: { kind: 'guess', name: "a printer" },
                                no: {
                                  kind: 'question',
                                  text: "Provides Wi-Fi to a home network?",
                                  yes: { kind: 'guess', name: "a router" },
                                  no: {
                                    kind: 'question',
                                    text: "Stores files on a small stick you plug in?",
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
            text: "Has spinning rotors on top?",
            yes: { kind: 'guess', name: "a helicopter" },
            no: {
              kind: 'question',
              text: "Unmanned / remotely piloted?",
              yes: { kind: 'guess', name: "a drone" },
              no: {
                kind: 'question',
                text: "Goes to space?",
                yes: { kind: 'guess', name: "a rocket" },
                no: {
                  kind: 'question',
                  text: "A military fast jet?",
                  yes: { kind: 'guess', name: "a fighter jet" },
                  no: {
                    kind: 'question',
                    text: "Inflated with hot air?",
                    yes: { kind: 'guess', name: "a hot air balloon" },
                    no: {
                      kind: 'question',
                      text: "A large gas-filled airship?",
                      yes: { kind: 'guess', name: "a blimp" },
                      no: {
                        kind: 'question',
                        text: "Has no engine (unpowered flight)?",
                        yes: {
                          kind: 'question',
                          text: "Worn by a person to slow a fall?",
                          yes: { kind: 'guess', name: "a parachute" },
                          no: { kind: 'guess', name: "a glider" },
                        },
                        no: { kind: 'guess', name: "an airplane" },
                      },
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
              text: "Travels underwater?",
              yes: { kind: 'guess', name: "a submarine" },
              no: {
                kind: 'question',
                text: "Powered mainly by sails?",
                yes: { kind: 'guess', name: "a sailboat" },
                no: {
                  kind: 'question',
                  text: "A large ship for vacation passengers?",
                  yes: { kind: 'guess', name: "a cruise ship" },
                  no: {
                    kind: 'question',
                    text: "Carries cars / commuters on a short water route?",
                    yes: { kind: 'guess', name: "a ferry" },
                    no: {
                      kind: 'question',
                      text: "A luxury personal boat?",
                      yes: { kind: 'guess', name: "a yacht" },
                      no: {
                        kind: 'question',
                        text: "A small fast motorboat?",
                        yes: { kind: 'guess', name: "a speedboat" },
                        no: {
                          kind: 'question',
                          text: "Ridden standing / straddling like a motorcycle on water?",
                          yes: { kind: 'guess', name: "a jet ski" },
                          no: {
                            kind: 'question',
                            text: "Paddled while sitting with a double-bladed paddle?",
                            yes: { kind: 'guess', name: "a kayak" },
                            no: { kind: 'guess', name: "a canoe" },
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
              text: "Has two wheels?",
              yes: {
                kind: 'question',
                text: "Pedaled by the rider?",
                yes: { kind: 'guess', name: "a bicycle" },
                no: {
                  kind: 'question',
                  text: "Motorized and straddled like a bike?",
                  yes: { kind: 'guess', name: "a motorcycle" },
                  no: { kind: 'guess', name: "a scooter" },
                },
              },
              no: {
                kind: 'question',
                text: "Runs on rails?",
                yes: { kind: 'guess', name: "a train" },
                no: {
                  kind: 'question',
                  text: "An emergency / public-safety vehicle?",
                  yes: {
                    kind: 'question',
                    text: "Puts out fires?",
                    yes: { kind: 'guess', name: "a fire truck" },
                    no: {
                      kind: 'question',
                      text: "Takes people to the hospital?",
                      yes: { kind: 'guess', name: "an ambulance" },
                      no: { kind: 'guess', name: "a police car" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "Carries many passengers on a city route?",
                    yes: { kind: 'guess', name: "a bus" },
                    no: {
                      kind: 'question',
                      text: "A military armored vehicle with treads?",
                      yes: { kind: 'guess', name: "a tank" },
                      no: {
                        kind: 'question',
                        text: "Used on a farm?",
                        yes: { kind: 'guess', name: "a tractor" },
                        no: {
                          kind: 'question',
                          text: "A board you stand on with wheels?",
                          yes: { kind: 'guess', name: "a skateboard" },
                          no: {
                            kind: 'question',
                            text: "Hired to drive you somewhere for a fare?",
                            yes: { kind: 'guess', name: "a taxi" },
                            no: {
                              kind: 'question',
                              text: "Larger than a car, used for hauling cargo?",
                              yes: { kind: 'guess', name: "a truck" },
                              no: {
                                kind: 'question',
                                text: "Built higher off the ground for rough roads / family hauling?",
                                yes: { kind: 'guess', name: "an SUV" },
                                no: { kind: 'guess', name: "a car" },
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
          text: "Building, landmark, or place?",
          yes: {
            kind: 'question',
            text: "Famous landmark?",
            yes: {
              kind: 'question',
              text: "A natural landform (not man-made)?",
              yes: {
                kind: 'question',
                text: "The tallest mountain on Earth?",
                yes: { kind: 'guess', name: "Mount Everest" },
                no: { kind: 'guess', name: "the Grand Canyon" },
              },
              no: {
                kind: 'question',
                text: "In Paris?",
                yes: { kind: 'guess', name: "the Eiffel Tower" },
                no: {
                  kind: 'question',
                  text: "In New York Harbor?",
                  yes: { kind: 'guess', name: "the Statue of Liberty" },
                  no: {
                    kind: 'question',
                    text: "In Egypt?",
                    yes: { kind: 'guess', name: "the Pyramids of Giza" },
                    no: {
                      kind: 'question',
                      text: "In China?",
                      yes: { kind: 'guess', name: "the Great Wall of China" },
                      no: {
                        kind: 'question',
                        text: "A famous clock tower in London?",
                        yes: { kind: 'guess', name: "Big Ben" },
                        no: {
                          kind: 'question',
                          text: "An ancient Roman amphitheater?",
                          yes: { kind: 'guess', name: "the Colosseum" },
                          no: {
                            kind: 'question',
                            text: "A white marble mausoleum in India?",
                            yes: { kind: 'guess', name: "Taj Mahal" },
                            no: {
                              kind: 'question',
                              text: "The U.S. president's residence?",
                              yes: { kind: 'guess', name: "the White House" },
                              no: {
                                kind: 'question',
                                text: "A bridge in San Francisco?",
                                yes: { kind: 'guess', name: "the Golden Gate Bridge" },
                                no: { kind: 'guess', name: "Stonehenge" },
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
              text: "Home / dwelling?",
              yes: {
                kind: 'question',
                text: "Made mainly of ice / snow?",
                yes: { kind: 'guess', name: "an igloo" },
                no: {
                  kind: 'question',
                  text: "Built in a tree?",
                  yes: { kind: 'guess', name: "a treehouse" },
                  no: {
                    kind: 'question',
                    text: "Portable fabric shelter?",
                    yes: { kind: 'guess', name: "a tent" },
                    no: {
                      kind: 'question',
                      text: "A fortified medieval residence?",
                      yes: { kind: 'guess', name: "a castle" },
                      no: {
                        kind: 'question',
                        text: "A very large luxurious home?",
                        yes: { kind: 'guess', name: "a mansion" },
                        no: {
                          kind: 'question',
                          text: "A small wooden house, often in the woods?",
                          yes: { kind: 'guess', name: "a cabin" },
                          no: {
                            kind: 'question',
                            text: "One unit in a multi-unit building?",
                            yes: { kind: 'guess', name: "an apartment" },
                            no: { kind: 'guess', name: "a house" },
                          },
                        },
                      },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "A natural outdoor geography (not a building)?",
                yes: {
                  kind: 'question',
                  text: "Covered in sand beside the sea?",
                  yes: { kind: 'guess', name: "a beach" },
                  no: {
                    kind: 'question',
                    text: "A very large body of salt water?",
                    yes: { kind: 'guess', name: "an ocean" },
                    no: {
                      kind: 'question',
                      text: "A dry sandy region?",
                      yes: { kind: 'guess', name: "a desert" },
                      no: {
                        kind: 'question',
                        text: "Dense with trees?",
                        yes: { kind: 'guess', name: "a forest" },
                        no: {
                          kind: 'question',
                          text: "A high landform?",
                          yes: { kind: 'guess', name: "a mountain" },
                          no: {
                            kind: 'question',
                            text: "Where crops / livestock are raised?",
                            yes: { kind: 'guess', name: "a farm" },
                            no: { kind: 'guess', name: "a park" },
                          },
                        },
                      },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Where kids go to learn?",
                  yes: { kind: 'guess', name: "a school" },
                  no: {
                    kind: 'question',
                    text: "Where sick people are treated?",
                    yes: { kind: 'guess', name: "a hospital" },
                    no: {
                      kind: 'question',
                      text: "Full of books to borrow?",
                      yes: { kind: 'guess', name: "a library" },
                      no: {
                        kind: 'question',
                        text: "Where you order cooked meals?",
                        yes: { kind: 'guess', name: "a restaurant" },
                        no: {
                          kind: 'question',
                          text: "Where airplanes take off?",
                          yes: { kind: 'guess', name: "an airport" },
                          no: {
                            kind: 'question',
                            text: "Displays art or historical objects?",
                            yes: { kind: 'guess', name: "a museum" },
                            no: {
                              kind: 'question',
                              text: "Keeps animals for public viewing?",
                              yes: { kind: 'guess', name: "a zoo" },
                              no: {
                                kind: 'question',
                                text: "Where sports are played before a big crowd?",
                                yes: { kind: 'guess', name: "a stadium" },
                                no: { kind: 'guess', name: "a church" },
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
            text: "Furniture?",
            yes: {
              kind: 'question',
              text: "Meant for sleeping?",
              yes: { kind: 'guess', name: "a bed" },
              no: {
                kind: 'question',
                text: "Meant for sitting, soft and multi-person?",
                yes: { kind: 'guess', name: "a couch" },
                no: {
                  kind: 'question',
                  text: "Meant for sitting, usually one person?",
                  yes: { kind: 'guess', name: "a chair" },
                  no: {
                    kind: 'question',
                    text: "A work surface, often with drawers?",
                    yes: { kind: 'guess', name: "a desk" },
                    no: {
                      kind: 'question',
                      text: "A flat surface for dining or placing things?",
                      yes: { kind: 'guess', name: "a table" },
                      no: {
                        kind: 'question',
                        text: "Provides light?",
                        yes: { kind: 'guess', name: "a lamp" },
                        no: {
                          kind: 'question',
                          text: "Holds books upright?",
                          yes: { kind: 'guess', name: "a bookshelf" },
                          no: {
                            kind: 'question',
                            text: "Shows a reflection?",
                            yes: { kind: 'guess', name: "a mirror" },
                            no: { kind: 'guess', name: "a rug" },
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
              text: "Large appliance?",
              yes: {
                kind: 'question',
                text: "Keeps food cold?",
                yes: { kind: 'guess', name: "a refrigerator" },
                no: {
                  kind: 'question',
                  text: "Used for cooking with burners / heat from below?",
                  yes: { kind: 'guess', name: "a stove" },
                  no: {
                    kind: 'question',
                    text: "An enclosed box that bakes with dry heat?",
                    yes: { kind: 'guess', name: "an oven" },
                    no: {
                      kind: 'question',
                      text: "Heats food quickly with electromagnetic waves?",
                      yes: { kind: 'guess', name: "a microwave" },
                      no: {
                        kind: 'question',
                        text: "Washes dishes automatically?",
                        yes: { kind: 'guess', name: "a dishwasher" },
                        no: {
                          kind: 'question',
                          text: "Washes clothes?",
                          yes: { kind: 'guess', name: "a washing machine" },
                          no: {
                            kind: 'question',
                            text: "Dries clothes?",
                            yes: { kind: 'guess', name: "a dryer" },
                            no: { kind: 'guess', name: "a vacuum cleaner" },
                          },
                        },
                      },
                    },
                  },
                },
              },
              no: { kind: 'guess', name: "a statue" },
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
              text: "Made from grapes / often served with dinner?",
              yes: { kind: 'guess', name: "wine" },
              no: { kind: 'guess', name: "beer" },
            },
            no: {
              kind: 'question',
              text: "Typically served hot?",
              yes: {
                kind: 'question',
                text: "Made from roasted beans?",
                yes: { kind: 'guess', name: "coffee" },
                no: {
                  kind: 'question',
                  text: "Made from leaves steeped in water?",
                  yes: { kind: 'guess', name: "tea" },
                  no: { kind: 'guess', name: "hot chocolate" },
                },
              },
              no: {
                kind: 'question',
                text: "Comes from cows (commonly)?",
                yes: { kind: 'guess', name: "milk" },
                no: {
                  kind: 'question',
                  text: "Made from oranges?",
                  yes: { kind: 'guess', name: "orange juice" },
                  no: {
                    kind: 'question',
                    text: "Carbonated and sweet?",
                    yes: { kind: 'guess', name: "soda" },
                    no: {
                      kind: 'question',
                      text: "Blended with fruit?",
                      yes: { kind: 'guess', name: "smoothie" },
                      no: {
                        kind: 'question',
                        text: "Tart, yellow, often homemade from citrus?",
                        yes: { kind: 'guess', name: "lemonade" },
                        no: { kind: 'guess', name: "water" },
                      },
                    },
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
                text: "Yellow and curved?",
                yes: { kind: 'guess', name: "a banana" },
                no: {
                  kind: 'question',
                  text: "Typically red or green and crunchy, grows on trees in temperate climates?",
                  yes: {
                    kind: 'question',
                    text: "Has a spiky exterior?",
                    yes: { kind: 'guess', name: "a pineapple" },
                    no: { kind: 'guess', name: "an apple" },
                  },
                  no: {
                    kind: 'question',
                    text: "Citrus?",
                    yes: {
                      kind: 'question',
                      text: "Distinctly sour / yellow citrus?",
                      yes: { kind: 'guess', name: "a lemon" },
                      no: { kind: 'guess', name: "an orange" },
                    },
                    no: {
                      kind: 'question',
                      text: "Very large and mostly red inside?",
                      yes: { kind: 'guess', name: "a watermelon" },
                      no: {
                        kind: 'question',
                        text: "Has a hard brown shell with water inside?",
                        yes: { kind: 'guess', name: "a coconut" },
                        no: {
                          kind: 'question',
                          text: "Grows in bunches on vines, small and round?",
                          yes: { kind: 'guess', name: "a grape" },
                          no: {
                            kind: 'question',
                            text: "Small, red, and has seeds on the outside?",
                            yes: { kind: 'guess', name: "a strawberry" },
                            no: {
                              kind: 'question',
                              text: "Small and blue/purple?",
                              yes: { kind: 'guess', name: "a blueberry" },
                              no: {
                                kind: 'question',
                                text: "Small, red, with a pit, often on desserts?",
                                yes: { kind: 'guess', name: "a cherry" },
                                no: {
                                  kind: 'question',
                                  text: "Fuzzy skin and a pit?",
                                  yes: { kind: 'guess', name: "a peach" },
                                  no: { kind: 'guess', name: "a mango" },
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
                text: "Orange and grows underground?",
                yes: { kind: 'guess', name: "a carrot" },
                no: {
                  kind: 'question',
                  text: "A leafy green?",
                  yes: {
                    kind: 'question',
                    text: "Often used in salads as the base, mild leaves?",
                    yes: { kind: 'guess', name: "lettuce" },
                    no: { kind: 'guess', name: "spinach" },
                  },
                  no: {
                    kind: 'question',
                    text: "Looks like a small tree / green florets?",
                    yes: { kind: 'guess', name: "broccoli" },
                    no: {
                      kind: 'question',
                      text: "A starchy tuber, often fried or mashed?",
                      yes: { kind: 'guess', name: "a potato" },
                      no: {
                        kind: 'question',
                        text: "Makes you cry when cut?",
                        yes: { kind: 'guess', name: "an onion" },
                        no: {
                          kind: 'question',
                          text: "A strong bulb used for seasoning, smaller than an onion?",
                          yes: { kind: 'guess', name: "garlic" },
                          no: {
                            kind: 'question',
                            text: "Yellow kernels on a cob?",
                            yes: { kind: 'guess', name: "corn" },
                            no: {
                              kind: 'question',
                              text: "Long, green, and watery?",
                              yes: { kind: 'guess', name: "a cucumber" },
                              no: { kind: 'guess', name: "a tomato" },
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
              text: "Typically ordered as takeout / fast food?",
              yes: {
                kind: 'question',
                text: "Round and typically topped with cheese and sauce?",
                yes: { kind: 'guess', name: "a pizza" },
                no: {
                  kind: 'question',
                  text: "A patty in a bun?",
                  yes: { kind: 'guess', name: "a hamburger" },
                  no: {
                    kind: 'question',
                    text: "In a soft or hard tortilla folded in half?",
                    yes: { kind: 'guess', name: "a taco" },
                    no: {
                      kind: 'question',
                      text: "A large wrapped tortilla cylinder?",
                      yes: { kind: 'guess', name: "a burrito" },
                      no: {
                        kind: 'question',
                        text: "A sausage in a long bun?",
                        yes: { kind: 'guess', name: "a hot dog" },
                        no: {
                          kind: 'question',
                          text: "Fried strips of potato?",
                          yes: { kind: 'guess', name: "french fries" },
                          no: {
                            kind: 'question',
                            text: "Raw fish / rice / seaweed cuisine?",
                            yes: { kind: 'guess', name: "sushi" },
                            no: {
                              kind: 'question',
                              text: "Japanese noodle soup?",
                              yes: { kind: 'guess', name: "ramen" },
                              no: {
                                kind: 'question',
                                text: "Bread with fillings between slices?",
                                yes: { kind: 'guess', name: "a sandwich" },
                                no: { kind: 'guess', name: "fried chicken" },
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
                text: "A dessert / sweet?",
                yes: {
                  kind: 'question',
                  text: "Frozen and scooped?",
                  yes: { kind: 'guess', name: "ice cream" },
                  no: {
                    kind: 'question',
                    text: "Baked, flat, and often has chips?",
                    yes: { kind: 'guess', name: "a cookie" },
                    no: {
                      kind: 'question',
                      text: "A layered celebration dessert?",
                      yes: { kind: 'guess', name: "a cake" },
                      no: { kind: 'guess', name: "chocolate" },
                    },
                  },
                },
                no: {
                  kind: 'question',
                  text: "A breakfast staple in a bowl with milk?",
                  yes: { kind: 'guess', name: "cereal" },
                  no: {
                    kind: 'question',
                    text: "A liquid dish eaten with a spoon?",
                    yes: { kind: 'guess', name: "soup" },
                    no: {
                      kind: 'question',
                      text: "Mostly greens / raw vegetables?",
                      yes: { kind: 'guess', name: "salad" },
                      no: {
                        kind: 'question',
                        text: "From an animal, often fried for breakfast?",
                        yes: {
                          kind: 'question',
                          text: "Cured strips of pork?",
                          yes: { kind: 'guess', name: "bacon" },
                          no: { kind: 'guess', name: "an egg" },
                        },
                        no: {
                          kind: 'question',
                          text: "A cut of beef?",
                          yes: { kind: 'guess', name: "steak" },
                          no: {
                            kind: 'question',
                            text: "Dairy, often sliced or shredded?",
                            yes: { kind: 'guess', name: "cheese" },
                            no: {
                              kind: 'question',
                              text: "A baked staple made from flour?",
                              yes: { kind: 'guess', name: "bread" },
                              no: {
                                kind: 'question',
                                text: "Italian noodles?",
                                yes: { kind: 'guess', name: "pasta" },
                                no: { kind: 'guess', name: "rice" },
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
          text: "Writing or school supply?",
          yes: {
            kind: 'question',
            text: "Used for writing or drawing marks?",
            yes: {
              kind: 'question',
              text: "Uses ink?",
              yes: {
                kind: 'question',
                text: "Has graphite and can be erased?",
                yes: { kind: 'guess', name: "a pencil" },
                no: { kind: 'guess', name: "a pen" },
              },
              no: { kind: 'guess', name: "a crayon" },
            },
            no: {
              kind: 'question',
              text: "Removes pencil marks?",
              yes: { kind: 'guess', name: "an eraser" },
              no: {
                kind: 'question',
                text: "Used to carry other school items?",
                yes: { kind: 'guess', name: "a backpack" },
                no: {
                  kind: 'question',
                  text: "Has pages of text to read?",
                  yes: {
                    kind: 'question',
                    text: "Blank pages for writing notes?",
                    yes: { kind: 'guess', name: "a notebook" },
                    no: { kind: 'guess', name: "a book" },
                  },
                  no: {
                    kind: 'question',
                    text: "Used for cutting paper?",
                    yes: { kind: 'guess', name: "scissors" },
                    no: {
                      kind: 'question',
                      text: "Used for measuring length?",
                      yes: { kind: 'guess', name: "a ruler" },
                      no: {
                        kind: 'question',
                        text: "Fastens papers together with metal?",
                        yes: { kind: 'guess', name: "a stapler" },
                        no: {
                          kind: 'question',
                          text: "Does arithmetic electronically?",
                          yes: { kind: 'guess', name: "a calculator" },
                          no: { kind: 'guess', name: "glue" },
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
            text: "Clothing or accessory you wear?",
            yes: {
              kind: 'question',
              text: "Worn on the feet?",
              yes: {
                kind: 'question',
                text: "Soft coverings for feet inside shoes?",
                yes: { kind: 'guess', name: "socks" },
                no: {
                  kind: 'question',
                  text: "Taller / sturdier footwear, often for weather or work?",
                  yes: { kind: 'guess', name: "boots" },
                  no: { kind: 'guess', name: "sneakers" },
                },
              },
              no: {
                kind: 'question',
                text: "Worn on the head?",
                yes: { kind: 'guess', name: "a hat" },
                no: {
                  kind: 'question',
                  text: "Worn on the hands?",
                  yes: { kind: 'guess', name: "gloves" },
                  no: {
                    kind: 'question',
                    text: "Worn around the neck for warmth?",
                    yes: { kind: 'guess', name: "a scarf" },
                    no: {
                      kind: 'question',
                      text: "Helps you see / corrective lenses?",
                      yes: { kind: 'guess', name: "glasses" },
                      no: {
                        kind: 'question',
                        text: "Tells time, worn on the wrist?",
                        yes: { kind: 'guess', name: "a watch" },
                        no: {
                          kind: 'question',
                          text: "Blocks rain but is not clothing?",
                          yes: { kind: 'guess', name: "an umbrella" },
                          no: {
                            kind: 'question',
                            text: "Worn for swimming?",
                            yes: { kind: 'guess', name: "a swimsuit" },
                            no: {
                              kind: 'question',
                              text: "A one-piece garment typically worn by women?",
                              yes: { kind: 'guess', name: "a dress" },
                              no: {
                                kind: 'question',
                                text: "Denim pants?",
                                yes: { kind: 'guess', name: "jeans" },
                                no: {
                                  kind: 'question',
                                  text: "A heavy outer garment for cold weather?",
                                  yes: { kind: 'guess', name: "a jacket" },
                                  no: {
                                    kind: 'question',
                                    text: "Has a hood and is casual / sweatshirt-like?",
                                    yes: { kind: 'guess', name: "a hoodie" },
                                    no: { kind: 'guess', name: "a t-shirt" },
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
              text: "Used for eating?",
              yes: {
                kind: 'question',
                text: "A drinking vessel, often with a handle?",
                yes: { kind: 'guess', name: "a mug" },
                no: {
                  kind: 'question',
                  text: "A flat dish for food?",
                  yes: { kind: 'guess', name: "a plate" },
                  no: {
                    kind: 'question',
                    text: "Has a cutting edge?",
                    yes: { kind: 'guess', name: "a knife" },
                    no: {
                      kind: 'question',
                      text: "Has tines / prongs?",
                      yes: { kind: 'guess', name: "a fork" },
                      no: { kind: 'guess', name: "a spoon" },
                    },
                  },
                },
              },
              no: {
                kind: 'question',
                text: "A tool?",
                yes: {
                  kind: 'question',
                  text: "Opens locks?",
                  yes: { kind: 'guess', name: "a key" },
                  no: {
                    kind: 'question',
                    text: "Used for pounding nails?",
                    yes: { kind: 'guess', name: "a hammer" },
                    no: { kind: 'guess', name: "a flashlight" },
                  },
                },
                no: {
                  kind: 'question',
                  text: "Used in the bathroom for hygiene?",
                  yes: {
                    kind: 'question',
                    text: "Cleans teeth?",
                    yes: { kind: 'guess', name: "a toothbrush" },
                    no: {
                      kind: 'question',
                      text: "Used for washing hands / body?",
                      yes: { kind: 'guess', name: "soap" },
                      no: { kind: 'guess', name: "a towel" },
                    },
                  },
                  no: {
                    kind: 'question',
                    text: "A toy?",
                    yes: {
                      kind: 'question',
                      text: "A stuffed animal?",
                      yes: { kind: 'guess', name: "a teddy bear" },
                      no: {
                        kind: 'question',
                        text: "Interlocking plastic bricks?",
                        yes: { kind: 'guess', name: "Lego" },
                        no: {
                          kind: 'question',
                          text: "Cubical and used in board games?",
                          yes: { kind: 'guess', name: "dice" },
                          no: {
                            kind: 'question',
                            text: "An American oval ball sport?",
                            yes: { kind: 'guess', name: "a football" },
                            no: {
                              kind: 'question',
                              text: "An orange ball with lines, bounced on a court?",
                              yes: { kind: 'guess', name: "a basketball" },
                              no: { kind: 'guess', name: "a ball" },
                            },
                          },
                        },
                      },
                    },
                    no: {
                      kind: 'question',
                      text: "Made of wax and provides flame light?",
                      yes: { kind: 'guess', name: "a candle" },
                      no: {
                        kind: 'question',
                        text: "Metal money?",
                        yes: { kind: 'guess', name: "a coin" },
                        no: {
                          kind: 'question',
                          text: "Tells time on a wall or nightstand?",
                          yes: { kind: 'guess', name: "a clock" },
                          no: { kind: 'guess', name: "a suitcase" },
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
