/**
 * Generate classic-20Q-style attribute seedTree.
 * Mid-tree = attributes only; names only on guess leaves.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const SEED_VERSION = 12
const STORAGE_KEY = `twentyq-tree-v${SEED_VERSION}`

function g(name) { return { kind: 'guess', name } }
function q(text, yes, no) {
  if (!text || /same bunch|\d+\s*options/i.test(text)) throw new Error('Bad Q: ' + text)
  return { kind: 'question', text, yes, no }
}
function split(items, attrs, depthLeft = 12) {
  const list = [...new Set(items)]
  if (list.length === 0) return g('something else')
  if (list.length === 1) return g(list[0])
  if (!attrs.length || depthLeft <= 0) return g(list[0])
  const [head, ...rest] = attrs
  const yes = list.filter(head.test)
  const no = list.filter((n) => !head.test(n))
  if (yes.length === 0) return split(no, rest, depthLeft)
  if (no.length === 0) return split(yes, rest, depthLeft)
  return q(head.q, split(yes, rest, depthLeft - 1), split(no, rest, depthLeft - 1))
}
function has(...parts) {
  const lower = parts.map((p) => p.toLowerCase())
  return (name) => lower.some((p) => name.toLowerCase().includes(p))
}

function buildSeed() {
  const superheroes = split(
    [
      'Batman', 'Superman', 'Spider-Man', 'Wonder Woman', 'Iron Man', 'Hulk',
      'Thor', 'Captain America', 'Black Panther', 'Black Widow', 'Wolverine',
      'Deadpool', 'Joker', 'Flash', 'Aquaman', 'Doctor Strange', 'Scarlet Witch',
      'Green Lantern', 'Hawkeye', 'Ant-Man', 'Captain Marvel', 'Venom',
    ],
    [
      { q: 'Typically associated with Marvel (not DC)?', test: has(
        'spider-man', 'iron man', 'hulk', 'thor', 'captain america', 'black panther',
        'black widow', 'wolverine', 'deadpool', 'doctor strange', 'scarlet witch',
        'hawkeye', 'ant-man', 'captain marvel', 'venom',
      ) },
      { q: 'Usually wears a cape in classic depictions?', test: has(
        'batman', 'superman', 'wonder woman', 'thor', 'doctor strange', 'scarlet witch',
        'captain marvel',
      ) },
      { q: 'Primarily a villain rather than a hero?', test: has('joker', 'venom') },
      { q: 'Known for using a bow and arrows?', test: has('hawkeye') },
      { q: 'Known for great strength more than gadgets?', test: has('hulk', 'superman', 'wonder woman') },
      { q: 'Often depicted as armored / wearing a metal suit?', test: has('iron man', 'ant-man') },
      { q: 'Associated with underwater settings?', test: has('aquaman') },
      { q: 'Known for swinging between buildings?', test: has('spider-man') },
      { q: 'Associated with an African kingdom in the comics?', test: has('black panther') },
      { q: 'Known for regenerating from almost any injury?', test: has('wolverine', 'deadpool') },
      { q: 'Usually portrayed as funny / quippy in recent films?', test: has('deadpool') },
      { q: 'A woman?', test: has('wonder woman', 'black widow', 'scarlet witch', 'captain marvel') },
      { q: 'Associated with witchcraft or chaos magic?', test: has('scarlet witch') },
      { q: 'Associated with a mystical eye / magical artifacts?', test: has('doctor strange') },
      { q: 'Known for super speed?', test: has('flash') },
      { q: 'Associated with a power ring?', test: has('green lantern') },
      { q: 'A dark, brooding detective type?', test: has('batman') },
      { q: 'Wields a hammer in classic depictions?', test: has('thor') },
      { q: 'Carries a patriotic shield?', test: has('captain america') },
    ],
  )

  const starWars = split(
    [
      'Darth Vader', 'Luke Skywalker', 'Yoda', 'Baby Yoda', 'Princess Leia',
      'Han Solo', 'Chewbacca', 'R2-D2', 'C-3PO', 'Obi-Wan Kenobi', 'Rey',
      'Kylo Ren', 'Boba Fett', 'Padmé Amidala',
    ],
    [
      { q: 'A droid / robot?', test: has('r2-d2', 'c-3po') },
      { q: 'Primarily known as a gold-colored protocol droid?', test: has('c-3po') },
      { q: 'A Wookiee or similarly furry non-human?', test: has('chewbacca') },
      { q: 'Often associated with the dark side / Sith?', test: has('darth vader', 'kylo ren') },
      { q: 'Wears a shiny black helmet and cape in classic films?', test: has('darth vader') },
      { q: 'A bounty hunter?', test: has('boba fett') },
      { q: 'A small, green, long-eared Force user?', test: has('yoda', 'baby yoda') },
      { q: 'A child / toddler version of that species?', test: has('baby yoda') },
      { q: 'A woman?', test: has('princess leia', 'rey', 'padmé') },
      { q: 'A queen / senator from Naboo in the prequels?', test: has('padmé') },
      { q: 'A scavenger who becomes a Jedi in the sequels?', test: has('rey') },
      { q: 'Known as a princess and rebel leader?', test: has('princess leia') },
      { q: 'A smuggler / pilot of the Millennium Falcon?', test: has('han solo') },
      { q: 'A Jedi master who trained Anakin?', test: has('obi-wan') },
    ],
  )

  const animated = split(
    [
      'Mickey Mouse', 'SpongeBob', 'Homer Simpson', 'Bugs Bunny', 'Pikachu',
      'Mario', 'Elsa', 'Shrek', 'Scooby-Doo', 'Bart Simpson', 'Donald Duck',
      'Goofy', 'Winnie the Pooh', 'Simba', 'Woody', 'Buzz Lightyear',
      'Minion', 'Hello Kitty', 'Sonic the Hedgehog', 'Goku', 'Naruto',
      'Ash Ketchum', 'Peppa Pig', 'Bluey',
    ],
    [
      { q: 'From anime or Japanese games/manga originally?', test: has(
        'pikachu', 'goku', 'naruto', 'ash ketchum', 'sonic',
      ) },
      { q: 'A Pokémon or Pokémon trainer?', test: has('pikachu', 'ash') },
      { q: 'An electric mouse-like creature?', test: has('pikachu') },
      { q: 'Known for super speed and blue spines?', test: has('sonic') },
      { q: 'A martial artist who can go Super Saiyan?', test: has('goku') },
      { q: 'A young ninja from a hidden village?', test: has('naruto') },
      { q: 'A Disney or Pixar character?', test: has(
        'mickey', 'donald', 'goofy', 'elsa', 'simba', 'woody', 'buzz', 'winnie',
      ) },
      { q: 'A princess with ice powers?', test: has('elsa') },
      { q: 'A lion cub who becomes king in an animated film?', test: has('simba') },
      { q: 'A toy cowboy or space ranger?', test: has('woody', 'buzz') },
      { q: 'A space ranger action figure?', test: has('buzz') },
      { q: 'A bear who loves honey?', test: has('winnie') },
      { q: 'A classic Disney duck character?', test: has('donald') },
      { q: 'A dog that walks and talks like a person?', test: has('goofy') },
      { q: 'An iconic mouse in red shorts?', test: has('mickey') },
      { q: 'From The Simpsons?', test: has('homer', 'bart') },
      { q: 'A child rather than an adult?', test: has('bart', 'peppa', 'bluey', 'ash') },
      { q: 'A talking pig from a British kids TV show?', test: has('peppa') },
      { q: 'A blue heeler dog from an Australian kids show?', test: has('bluey') },
      { q: 'Lives in a pineapple under the sea?', test: has('spongebob') },
      { q: 'A great dane that solves mysteries?', test: has('scooby') },
      { q: 'A green ogre?', test: has('shrek') },
      { q: 'A plumber from Nintendo games?', test: has('mario') },
      { q: 'A small yellow henchman creature?', test: has('minion') },
      { q: 'A white cat with a bow, from Sanrio?', test: has('hello kitty') },
      { q: 'A cartoon rabbit who says "What\'s up, Doc?"?', test: has('bugs') },
    ],
  )

  const otherFiction = split(
    [
      'James Bond', 'Indiana Jones', 'Jack Sparrow', 'Harry Potter',
      'Hermione Granger', 'Frodo', 'Gandalf', 'Sherlock Holmes',
      'Santa Claus', 'Vampire', 'Zombie', 'Dragon', 'Unicorn', 'Mermaid',
      'Wizard', 'Elf', 'Ghost', 'Godzilla', 'King Kong',
    ],
    [
      { q: 'A mythical / fantasy creature rather than a named person?', test: has(
        'vampire', 'zombie', 'dragon', 'unicorn', 'mermaid', 'wizard', 'elf', 'ghost',
      ) },
      { q: 'Typically undead or associated with death?', test: has('vampire', 'zombie', 'ghost') },
      { q: 'Known for drinking blood?', test: has('vampire') },
      { q: 'A mindless walking corpse in horror fiction?', test: has('zombie') },
      { q: 'A spirit of a dead person?', test: has('ghost') },
      { q: 'A fire-breathing reptile?', test: has('dragon') },
      { q: 'A horse-like creature with a single horn?', test: has('unicorn') },
      { q: 'Half human, half fish?', test: has('mermaid') },
      { q: 'A pointed-eared forest dweller?', test: has('elf') },
      { q: 'Uses magic spells as a profession?', test: has('wizard', 'gandalf') },
      { q: 'A giant movie monster?', test: has('godzilla', 'king kong') },
      { q: 'A giant ape?', test: has('king kong') },
      { q: 'Associated with Christmas?', test: has('santa') },
      { q: 'From Lord of the Rings / Tolkien?', test: has('frodo', 'gandalf') },
      { q: 'A hobbit who carries a ring?', test: has('frodo') },
      { q: 'From Harry Potter?', test: has('harry potter', 'hermione') },
      { q: 'A witch / female student of magic?', test: has('hermione') },
      { q: 'A detective who wears a deerstalker?', test: has('sherlock') },
      { q: 'A pirate?', test: has('jack sparrow') },
      { q: 'An archaeologist who uses a whip?', test: has('indiana') },
      { q: 'A secret agent with a license to kill?', test: has('james bond') },
    ],
  )

  const bookMythGame = split(
    [
      'Link', 'Zelda', 'Master Chief', 'Kratos', 'Pac-Man', 'Kirby',
      'Zeus', 'Hades', 'Medusa', 'Hercules', 'Dracula', 'Frankenstein',
      'Robin Hood', 'King Arthur', 'Peter Pan', 'Cupid', 'Easter Bunny',
      'Tooth Fairy', 'The Grinch',
    ],
    [
      { q: 'Primarily from a video game?', test: has(
        'link', 'zelda', 'master chief', 'kratos', 'pac-man', 'kirby',
      ) },
      { q: 'A yellow round creature that eats dots?', test: has('pac-man') },
      { q: 'A pink puffball that inhales enemies?', test: has('kirby') },
      { q: 'A Spartan warrior in futuristic armor?', test: has('master chief') },
      { q: 'A god of war in the game series?', test: has('kratos') },
      { q: 'A princess of Hyrule?', test: has('zelda') },
      { q: 'A hero who often wears a green tunic and hat?', test: has('link') },
      { q: 'From Greek / Roman mythology?', test: has('zeus', 'hades', 'medusa', 'hercules') },
      { q: 'Ruler of the underworld?', test: has('hades') },
      { q: 'Has snakes for hair?', test: has('medusa') },
      { q: 'King of the gods?', test: has('zeus') },
      { q: 'Known for incredible strength / twelve labors?', test: has('hercules') },
      { q: 'A holiday or folklore gift-bringer / visitor?', test: has(
        'easter bunny', 'tooth fairy', 'cupid', 'the grinch',
      ) },
      { q: 'Steals Christmas in a Dr. Seuss story?', test: has('grinch') },
      { q: 'Associated with Valentine\'s Day?', test: has('cupid') },
      { q: 'Collects lost teeth?', test: has('tooth fairy') },
      { q: 'Associated with Easter eggs?', test: has('easter bunny') },
      { q: 'A classic horror character?', test: has('dracula', 'frankenstein') },
      { q: 'A vampire count?', test: has('dracula') },
      { q: 'A monster stitched together by a scientist?', test: has('frankenstein') },
      { q: 'Steals from the rich to give to the poor?', test: has('robin hood') },
      { q: 'A legendary British king with a round table?', test: has('king arthur') },
      { q: 'A boy who can fly and won\'t grow up?', test: has('peter pan') },
    ],
  )

  const moviesTv = q(
    'From movies or TV?',
    q(
      'Superhero or comic character?',
      superheroes,
      q('Associated with Star Wars?', starWars, q('Animated / Disney / cartoon?', animated, otherFiction)),
    ),
    q(
      'From a book, myth, or video game?',
      bookMythGame,
      split(
        ['Bigfoot', 'the Loch Ness Monster', 'a mascot', 'a meme character'],
        [
          { q: 'A cryptid / legendary creature people claim to have seen?', test: has('bigfoot', 'loch ness') },
          { q: 'A large ape-like creature of the Pacific Northwest?', test: has('bigfoot') },
          { q: 'A lake monster?', test: has('loch ness') },
          { q: 'Mainly known from internet jokes / memes?', test: has('meme') },
        ],
      ),
    ),
  )

  const jobs = split(
    [
      'a teacher', 'a doctor', 'a firefighter', 'a police officer', 'a nurse',
      'a chef', 'a pilot', 'a soldier', 'a lawyer', 'an engineer', 'a farmer',
      'a scientist', 'an astronaut', 'a musician', 'an actor', 'a writer',
      'a judge', 'a mechanic', 'a plumber', 'an electrician', 'a carpenter',
      'a software developer', 'a photographer', 'a dentist', 'a vet',
      'a librarian', 'a coach', 'a journalist',
    ],
    [
      { q: 'Works mainly in medicine or animal health?', test: has('doctor', 'nurse', 'dentist', 'vet') },
      { q: 'Treats animals?', test: has('vet') },
      { q: 'Focuses on teeth?', test: has('dentist') },
      { q: 'Typically works in a hospital assisting physicians?', test: has('nurse') },
      { q: 'A first responder or public safety role?', test: has('firefighter', 'police', 'soldier') },
      { q: 'Puts out fires?', test: has('firefighter') },
      { q: 'Serves in the armed forces?', test: has('soldier') },
      { q: 'Enforces the law?', test: has('police') },
      { q: 'Works with food professionally?', test: has('chef') },
      { q: 'Flies aircraft?', test: has('pilot', 'astronaut') },
      { q: 'Travels to space?', test: has('astronaut') },
      { q: 'Works in a skilled trade with tools?', test: has('mechanic', 'plumber', 'electrician', 'carpenter') },
      { q: 'Works with water pipes?', test: has('plumber') },
      { q: 'Works with electrical wiring?', test: has('electrician') },
      { q: 'Works with wood / building frames?', test: has('carpenter') },
      { q: 'Fixes vehicles or engines?', test: has('mechanic') },
      { q: 'A legal / courtroom profession?', test: has('lawyer', 'judge') },
      { q: 'Presides over a court?', test: has('judge') },
      { q: 'Works in education or coaching?', test: has('teacher', 'coach', 'librarian') },
      { q: 'Works in a library?', test: has('librarian') },
      { q: 'Trains athletes or a team?', test: has('coach') },
      { q: 'A creative / entertainment profession?', test: has('musician', 'actor', 'writer', 'photographer') },
      { q: 'Performs music?', test: has('musician') },
      { q: 'Acts in films or theater?', test: has('actor') },
      { q: 'Takes photographs professionally?', test: has('photographer') },
      { q: 'Writes books or articles as a primary craft?', test: has('writer', 'journalist') },
      { q: 'Reports news?', test: has('journalist') },
      { q: 'Works on a farm?', test: has('farmer') },
      { q: 'Writes software / code?', test: has('software') },
      { q: 'Does scientific research?', test: has('scientist') },
      { q: 'Designs or builds technical systems?', test: has('engineer') },
    ],
  )

  const famous = split(
    [
      'Albert Einstein', 'Marie Curie', 'Leonardo da Vinci', 'Shakespeare',
      'Cleopatra', 'Napoleon', 'Abraham Lincoln', 'Martin Luther King Jr.',
      'Nelson Mandela', 'Mahatma Gandhi', 'Marilyn Monroe', 'Elvis Presley',
      'Michael Jackson', 'Beyoncé', 'Taylor Swift', 'Oprah Winfrey',
      'Tom Hanks', 'Leonardo DiCaprio', 'Dwayne Johnson', 'Michael Jordan',
      'Serena Williams', 'Lionel Messi', 'Babe Ruth', 'Muhammad Ali',
      'Steve Jobs', 'Bill Gates', 'Elon Musk', 'Barack Obama',
      'Neil Armstrong', 'Frida Kahlo', 'Vincent van Gogh', 'Nikola Tesla',
      'Rosa Parks',
    ],
    [
      { q: 'Still alive today (as of the 2020s)?', test: has(
        'beyoncé', 'taylor swift', 'oprah', 'tom hanks', 'leonardo dicaprio',
        'dwayne johnson', 'serena', 'messi', 'elon', 'barack', 'bill gates',
      ) },
      { q: 'Known mainly as a musician / singer?', test: has('elvis', 'michael jackson', 'beyoncé', 'taylor swift') },
      { q: 'Known as the King of Pop?', test: has('michael jackson') },
      { q: 'A country / pop singer-songwriter known for re-recording albums?', test: has('taylor') },
      { q: 'A powerful R&B / pop performer often called Queen Bey?', test: has('beyoncé') },
      { q: 'An early rock-and-roll icon from Memphis?', test: has('elvis') },
      { q: 'Known mainly as an athlete?', test: has('michael jordan', 'serena', 'messi', 'babe ruth', 'muhammad ali') },
      { q: 'A soccer / football player?', test: has('messi') },
      { q: 'A tennis champion?', test: has('serena') },
      { q: 'A basketball legend?', test: has('jordan') },
      { q: 'A boxer?', test: has('ali') },
      { q: 'A baseball legend?', test: has('babe ruth') },
      { q: 'Known mainly as an actor / entertainer?', test: has('marilyn', 'tom hanks', 'dicaprio', 'dwayne', 'oprah') },
      { q: 'A talk-show host and media mogul?', test: has('oprah') },
      { q: 'Also known as a professional wrestler?', test: has('dwayne') },
      { q: 'A blonde Hollywood icon of the 1950s?', test: has('marilyn') },
      { q: 'Starred in Forrest Gump?', test: has('tom hanks') },
      { q: 'Starred in Titanic?', test: has('dicaprio') },
      { q: 'A political leader or activist?', test: has(
        'lincoln', 'martin luther king', 'mandela', 'gandhi', 'obama', 'cleopatra',
        'napoleon', 'rosa parks',
      ) },
      { q: 'An ancient Egyptian ruler?', test: has('cleopatra') },
      { q: 'A French emperor?', test: has('napoleon') },
      { q: 'A U.S. president?', test: has('lincoln', 'obama') },
      { q: 'The first Black U.S. president?', test: has('obama') },
      { q: 'Led India\'s independence movement with nonviolence?', test: has('gandhi') },
      { q: 'Fought apartheid in South Africa?', test: has('mandela') },
      { q: 'A civil rights leader known for the "I Have a Dream" speech?', test: has('martin luther king') },
      { q: 'Refused to give up a bus seat in Montgomery?', test: has('rosa parks') },
      { q: 'A tech entrepreneur?', test: has('steve jobs', 'bill gates', 'elon') },
      { q: 'Co-founded Apple?', test: has('steve jobs') },
      { q: 'Co-founded Microsoft?', test: has('bill gates') },
      { q: 'Associated with Tesla and SpaceX?', test: has('elon') },
      { q: 'A scientist or inventor?', test: has('einstein', 'curie', 'tesla', 'neil armstrong', 'leonardo da vinci') },
      { q: 'First person on the Moon?', test: has('neil armstrong') },
      { q: 'A woman who researched radioactivity?', test: has('curie') },
      { q: 'Known for relativity?', test: has('einstein') },
      { q: 'Known for AC electricity inventions?', test: has('tesla') },
      { q: 'A Renaissance polymath who painted the Mona Lisa?', test: has('da vinci') },
      { q: 'A painter?', test: has('frida', 'van gogh') },
      { q: 'A Mexican painter known for self-portraits?', test: has('frida') },
      { q: 'A Dutch post-impressionist who painted Starry Night?', test: has('van gogh') },
      { q: 'An English playwright?', test: has('shakespeare') },
    ],
  )

  const realPerson = q(
    'Is it mainly a job or occupation (like teacher, doctor, firefighter)?',
    jobs,
    q(
      'Is it a famous real person?',
      famous,
      split(
        ['a baby', 'a child', 'a teenager', 'an adult', 'an elderly person', 'a twin'],
        [
          { q: 'Under 18 years old (typically)?', test: has('baby', 'child', 'teenager') },
          { q: 'A newborn or infant?', test: has('baby') },
          { q: 'In the teen years?', test: has('teenager') },
          { q: 'One of a pair born at the same time?', test: has('twin') },
          { q: 'Notably old / senior?', test: has('elderly') },
        ],
      ),
    ),
  )

  const person = q('Is it a fictional character?', moviesTv, realPerson)

  const waterAnimals = q(
    'Does it live mostly in water?',
    q(
      'Mammal?',
      split(
        ['a dolphin', 'a whale', 'a seal', 'a walrus', 'an otter', 'an orca', 'a manatee'],
        [
          { q: 'Known for using echolocation and often performing in shows?', test: has('dolphin') },
          { q: 'The largest animals on Earth?', test: has('whale') },
          { q: 'A black-and-white predatory whale?', test: has('orca') },
          { q: 'Has large tusks?', test: has('walrus') },
          { q: 'A gentle sea cow / slow herbivore?', test: has('manatee') },
          { q: 'Often seen floating on its back cracking shellfish?', test: has('otter') },
        ],
      ),
      q(
        'Hard shell or exoskeleton?',
        split(
          ['a crab', 'a lobster', 'a shrimp', 'a turtle', 'a clam', 'an oyster'],
          [
            { q: 'A reptile with a shell?', test: has('turtle') },
            { q: 'Typically lives in a bivalve shell (two halves)?', test: has('clam', 'oyster') },
            { q: 'Often eaten raw on the half shell?', test: has('oyster') },
            { q: 'Has large claws and is often served steamed?', test: has('lobster') },
            { q: 'Walks sideways?', test: has('crab') },
          ],
        ),
        split(
          ['a shark', 'a goldfish', 'a jellyfish', 'an octopus', 'a seahorse', 'a starfish', 'an eel'],
          [
            { q: 'Has tentacles?', test: has('octopus', 'jellyfish') },
            { q: 'A soft, stinging gelatinous animal?', test: has('jellyfish') },
            { q: 'Has eight arms and is very intelligent?', test: has('octopus') },
            { q: 'A predator with fins and lots of teeth?', test: has('shark') },
            { q: 'Shaped like a horse\'s head?', test: has('seahorse') },
            { q: 'Has five arms / radial symmetry?', test: has('starfish') },
            { q: 'Long and snake-like?', test: has('eel') },
            { q: 'A common pet fish, often orange?', test: has('goldfish') },
          ],
        ),
      ),
    ),
    q(
      'Can it fly (under its own power)?',
      q(
        'Bird?',
        q(
          'Bird of prey?',
          split(
            ['an eagle', 'a hawk', 'an owl', 'a falcon', 'a vulture'],
            [
              { q: 'Primarily nocturnal?', test: has('owl') },
              { q: 'Known for eating carrion / bald head?', test: has('vulture') },
              { q: 'A national symbol of the United States?', test: has('eagle') },
              { q: 'Famous for incredible diving speed?', test: has('falcon') },
            ],
          ),
          q(
            'Farm bird / commonly raised for food?',
            split(
              ['a chicken', 'a turkey', 'a duck', 'a goose', 'a rooster'],
              [
                { q: 'A male chicken known for crowing?', test: has('rooster') },
                { q: 'Associated with Thanksgiving in the U.S.?', test: has('turkey') },
                { q: 'Has a flat bill and often swims?', test: has('duck') },
                { q: 'Larger than a duck, often hissing?', test: has('goose') },
              ],
            ),
            split(
              ['a penguin', 'a parrot', 'a flamingo', 'an ostrich', 'a pigeon', 'a crow', 'a hummingbird', 'a swan'],
              [
                { q: 'Cannot fly, but swims well?', test: has('penguin', 'ostrich') },
                { q: 'Lives in cold / polar regions?', test: has('penguin') },
                { q: 'The largest living bird?', test: has('ostrich') },
                { q: 'Bright pink?', test: has('flamingo') },
                { q: 'Known for mimicking speech?', test: has('parrot') },
                { q: 'Tiny and hovers while feeding on nectar?', test: has('hummingbird') },
                { q: 'Often seen in cities, gray?', test: has('pigeon') },
                { q: 'All black and known for being clever?', test: has('crow') },
                { q: 'Large, white, and graceful on water?', test: has('swan') },
              ],
            ),
          ),
        ),
        split(
          ['a bat', 'a bee', 'a butterfly', 'a mosquito', 'a fly', 'a dragonfly', 'a ladybug', 'a moth'],
          [
            { q: 'A mammal?', test: has('bat') },
            { q: 'Produces honey?', test: has('bee') },
            { q: 'Known for colorful wings and metamorphosis from a caterpillar?', test: has('butterfly') },
            { q: 'Bites / sucks blood?', test: has('mosquito') },
            { q: 'Active mainly at night, duller wings than a butterfly?', test: has('moth') },
            { q: 'Has spots and is considered lucky?', test: has('ladybug') },
            { q: 'Has four long wings and hunts other insects?', test: has('dragonfly') },
          ],
        ),
      ),
      q(
        'Common household pet?',
        q(
          'A mammal commonly kept indoors?',
          q(
            'Known for purring and meowing?',
            g('a cat'),
            q(
              'Known for barking?',
              g('a dog'),
              split(
                ['a hamster', 'a rabbit', 'a guinea pig', 'a ferret', 'a mouse', 'a rat', 'a hedgehog'],
                [
                  { q: 'Has spines / quills?', test: has('hedgehog') },
                  { q: 'Long-bodied and often kept for hunting rodents?', test: has('ferret') },
                  { q: 'Has long ears and hops?', test: has('rabbit') },
                  { q: 'Larger than a hamster, often squeaks, no tail?', test: has('guinea pig') },
                  { q: 'Stores food in cheek pouches?', test: has('hamster') },
                  { q: 'Larger than a typical house mouse, longer tail?', test: has('rat') },
                ],
              ),
            ),
          ),
          split(
            ['a goldfish', 'a parrot', 'a turtle', 'a lizard', 'a snake'],
            [
              { q: 'Lives in water as a pet?', test: has('goldfish') },
              { q: 'A bird?', test: has('parrot') },
              { q: 'Has a shell?', test: has('turtle') },
              { q: 'Limbless reptile?', test: has('snake') },
            ],
          ),
        ),
        q(
          'Farm animal?',
          split(
            ['a cow', 'a pig', 'a horse', 'a sheep', 'a goat', 'a donkey', 'a llama'],
            [
              { q: 'Used mainly for riding or pulling?', test: has('horse', 'donkey') },
              { q: 'Has long ears and is known for braying?', test: has('donkey') },
              { q: 'Produces wool?', test: has('sheep') },
              { q: 'Known for milk and "moo"?', test: has('cow') },
              { q: 'Known for oinking / bacon?', test: has('pig') },
              { q: 'Has horns and will eat almost anything?', test: has('goat') },
              { q: 'A South American camelid used as a pack animal?', test: has('llama') },
            ],
          ),
          q(
            'Big cat (lion, tiger, etc.)?',
            split(
              ['a lion', 'a tiger', 'a leopard', 'a cheetah', 'a jaguar', 'a panther'],
              [
                { q: 'Known as the king of the jungle / has a mane (male)?', test: has('lion') },
                { q: 'Has black stripes on orange fur?', test: has('tiger') },
                { q: 'The fastest land animal?', test: has('cheetah') },
                { q: 'Often associated with solid black coat in popular usage?', test: has('panther') },
                { q: 'Spotted and found in the Americas?', test: has('jaguar') },
              ],
            ),
            split(
              [
                'an elephant', 'a giraffe', 'a bear', 'a monkey', 'a gorilla', 'a kangaroo',
                'a koala', 'a panda', 'a wolf', 'a fox', 'a deer', 'a zebra', 'a hippo',
                'a rhino', 'a crocodile', 'a frog', 'a spider', 'an ant',
              ],
              [
                { q: 'An insect?', test: has('ant') },
                { q: 'An arachnid with eight legs?', test: has('spider') },
                { q: 'An amphibian?', test: has('frog') },
                { q: 'A reptile?', test: has('crocodile') },
                { q: 'Has a trunk?', test: has('elephant') },
                { q: 'Has a very long neck?', test: has('giraffe') },
                { q: 'Has black and white stripes?', test: has('zebra') },
                { q: 'A marsupial that hops?', test: has('kangaroo') },
                { q: 'A marsupial that eats eucalyptus?', test: has('koala') },
                { q: 'Black and white and eats bamboo?', test: has('panda') },
                { q: 'A great ape, larger than a monkey?', test: has('gorilla') },
                { q: 'A primate smaller than an ape?', test: has('monkey') },
                { q: 'Spends a lot of time in water, very large mouth?', test: has('hippo') },
                { q: 'Has a horn on its nose?', test: has('rhino') },
                { q: 'Howls in packs?', test: has('wolf') },
                { q: 'Known for being cunning and having a bushy tail?', test: has('fox') },
                { q: 'Males often have antlers?', test: has('deer') },
                { q: 'A large omnivore that hibernates?', test: has('bear') },
              ],
            ),
          ),
        ),
      ),
    ),
  )

  const plants = q(
    'Is it a plant?',
    q(
      'A tree?',
      split(
        ['an oak tree', 'a pine tree', 'a palm tree', 'a maple tree', 'a willow', 'a redwood', 'an apple tree', 'a Christmas tree'],
        [
          { q: 'Produces edible fruit commonly eaten raw?', test: has('apple') },
          { q: 'An evergreen with needles / cones?', test: has('pine', 'christmas', 'redwood') },
          { q: 'Commonly used as a holiday tree indoors?', test: has('christmas') },
          { q: 'Among the tallest living trees?', test: has('redwood') },
          { q: 'Has a tropically associated crown of fronds?', test: has('palm') },
          { q: 'Known for maple syrup / fall color?', test: has('maple') },
          { q: 'Has long drooping branches?', test: has('willow') },
        ],
      ),
      q(
        'A flower?',
        split(
          ['a rose', 'a tulip', 'a sunflower', 'a daisy', 'a lily', 'an orchid', 'a dandelion'],
          [
            { q: 'Typically red and associated with romance?', test: has('rose') },
            { q: 'Has a very large yellow head that follows the sun?', test: has('sunflower') },
            { q: 'A common "weed" with puffball seeds?', test: has('dandelion') },
            { q: 'A spring bulb often associated with the Netherlands?', test: has('tulip') },
            { q: 'Often grown as an exotic houseplant with unusual blooms?', test: has('orchid') },
            { q: 'A simple white petal flower with a yellow center?', test: has('daisy') },
          ],
        ),
        split(
          ['a cactus', 'a fern', 'a mushroom', 'bamboo', 'a Venus flytrap', 'grass', 'seaweed'],
          [
            { q: 'A fungus rather than a green plant?', test: has('mushroom') },
            { q: 'Grows in the ocean?', test: has('seaweed') },
            { q: 'Has spines and stores water?', test: has('cactus') },
            { q: 'Eats insects?', test: has('venus') },
            { q: 'A tall woody grass used in construction?', test: has('bamboo') },
            { q: 'Has feathery fronds, no flowers?', test: has('fern') },
          ],
        ),
      ),
    ),
    g('a bacterium'),
  )

  const living = q(
    'Is it a person (real or fictional)?',
    person,
    q('Is it an animal?', waterAnimals, plants),
  )

  const otherElectronics = split(
    [
      'headphones', 'earbuds', 'a camera', 'a charger', 'a game controller',
      'a keyboard', 'a computer mouse', 'a remote control', 'a smartwatch',
      'a printer', 'a monitor', 'a speaker', 'a TV', 'a router',
      'a USB drive', 'a power bank', 'a VR headset', 'a gaming console',
      'a PlayStation', 'an Xbox', 'a Nintendo Switch', 'an e-reader',
      'a battery', 'a webcam', 'a microphone', 'AirPods',
      'an Amazon Echo', 'a fitness tracker',
    ],
    [
      { q: 'Worn on the body?', test: has(
        'headphones', 'earbuds', 'airpods', 'smartwatch', 'fitness', 'vr headset',
      ) },
      { q: 'Worn on the wrist?', test: has('smartwatch', 'fitness') },
      { q: 'Primarily tracks steps / health metrics?', test: has('fitness') },
      { q: 'A headset that covers the eyes for virtual reality?', test: has('vr') },
      { q: 'Goes in or over the ears for sound?', test: has('headphones', 'earbuds', 'airpods') },
      { q: 'Over-ear cups rather than in-ear buds?', test: has('headphones') },
      { q: 'Apple-branded wireless earbuds?', test: has('airpods') },
      { q: 'A game system you play on a TV?', test: has(
        'gaming console', 'playstation', 'xbox', 'nintendo switch',
      ) },
      { q: 'Made by Sony?', test: has('playstation') },
      { q: 'Made by Microsoft?', test: has('xbox') },
      { q: 'A hybrid handheld that also docks to a TV?', test: has('nintendo switch') },
      { q: 'A display you watch shows on from across the room?', test: has('tv', 'monitor') },
      { q: 'Typically used as a computer display on a desk?', test: has('monitor') },
      { q: 'Used mainly to take photographs or video?', test: has('camera', 'webcam') },
      { q: 'Clips to or sits atop a computer for video calls?', test: has('webcam') },
      { q: 'Used to control a TV from the couch?', test: has('remote') },
      { q: 'Used for typing?', test: has('keyboard') },
      { q: 'Moved by hand to control a pointer on screen?', test: has('computer mouse') },
      { q: 'Held in hands to play video games?', test: has('game controller') },
      { q: 'Produces sound for a room?', test: has('speaker', 'amazon echo') },
      { q: 'A smart speaker you talk to by name?', test: has('amazon echo') },
      { q: 'Prints on paper?', test: has('printer') },
      { q: 'Provides Wi-Fi to a home network?', test: has('router') },
      { q: 'Stores files on a small stick you plug in?', test: has('usb') },
      { q: 'Portable battery used to recharge phones?', test: has('power bank') },
      { q: 'A single-cell or pack that stores electrical energy?', test: has('battery') },
      { q: 'Used to record or amplify voice?', test: has('microphone') },
      { q: 'Made for reading digital books?', test: has('e-reader', 'kindle') },
      { q: 'Supplies power to charge devices via a cable?', test: has('charger') },
    ],
  )

  const computerBranch = q(
    'Is it a general-purpose computer (for typing, browsing, apps)?',
    q(
      'Is it portable and does it fold shut with a built-in keyboard?',
      g('a laptop'),
      g('a computer'),
    ),
    q(
      'Worn on the ears / used mainly for listening to audio?',
      q(
        'Over-ear cups (not small buds that go in the ear canal)?',
        g('headphones'),
        g('earbuds'),
      ),
      otherElectronics,
    ),
  )

  const electronics = q(
    'Electronic?',
    q(
      'Small enough to fit comfortably in a pocket?',
      q(
        'Primarily used for calls, texts, and pocket apps?',
        g('a smartphone'),
        otherElectronics,
      ),
      q(
        'A handheld slab with a large touchscreen and no hinged keyboard?',
        g('a tablet'),
        computerBranch,
      ),
    ),
    null,
  )

  const flyingVeh = split(
    [
      'a helicopter', 'a drone', 'a rocket', 'an airplane', 'a hot air balloon',
      'a fighter jet', 'a blimp', 'a glider', 'a parachute',
    ],
    [
      { q: 'Has spinning rotors on top?', test: has('helicopter') },
      { q: 'Unmanned / remotely piloted?', test: has('drone') },
      { q: 'Goes to space?', test: has('rocket') },
      { q: 'A military fast jet?', test: has('fighter') },
      { q: 'Inflated with hot air?', test: has('hot air') },
      { q: 'A large gas-filled airship?', test: has('blimp') },
      { q: 'Has no engine (unpowered flight)?', test: has('glider', 'parachute') },
      { q: 'Worn by a person to slow a fall?', test: has('parachute') },
    ],
  )

  const waterVeh = split(
    [
      'a submarine', 'a canoe', 'a sailboat', 'a cruise ship', 'a ferry',
      'a yacht', 'a speedboat', 'a kayak', 'a jet ski',
    ],
    [
      { q: 'Travels underwater?', test: has('submarine') },
      { q: 'Powered mainly by sails?', test: has('sailboat') },
      { q: 'A large ship for vacation passengers?', test: has('cruise') },
      { q: 'Carries cars / commuters on a short water route?', test: has('ferry') },
      { q: 'A luxury personal boat?', test: has('yacht') },
      { q: 'A small fast motorboat?', test: has('speedboat') },
      { q: 'Ridden standing / straddling like a motorcycle on water?', test: has('jet ski') },
      { q: 'Paddled while sitting with a double-bladed paddle?', test: has('kayak') },
      { q: 'An open paddle boat for 1–3 people?', test: has('canoe') },
    ],
  )

  const landVeh = split(
    [
      'a car', 'a truck', 'a bus', 'a motorcycle', 'a bicycle', 'a train',
      'an ambulance', 'a fire truck', 'a police car', 'a taxi', 'a scooter',
      'a tractor', 'a tank', 'a skateboard', 'an SUV',
    ],
    [
      { q: 'Has two wheels?', test: has('motorcycle', 'bicycle', 'scooter') },
      { q: 'Pedaled by the rider?', test: has('bicycle') },
      { q: 'Motorized and straddled like a bike?', test: has('motorcycle') },
      { q: 'Runs on rails?', test: has('train') },
      { q: 'An emergency / public-safety vehicle?', test: has('ambulance', 'fire truck', 'police') },
      { q: 'Puts out fires?', test: has('fire truck') },
      { q: 'Takes people to the hospital?', test: has('ambulance') },
      { q: 'Used by law enforcement?', test: has('police') },
      { q: 'Carries many passengers on a city route?', test: has('bus') },
      { q: 'A military armored vehicle with treads?', test: has('tank') },
      { q: 'Used on a farm?', test: has('tractor') },
      { q: 'A board you stand on with wheels?', test: has('skateboard') },
      { q: 'Hired to drive you somewhere for a fare?', test: has('taxi') },
      { q: 'Larger than a car, used for hauling cargo?', test: has('truck') },
      { q: 'Built higher off the ground for rough roads / family hauling?', test: has('suv') },
    ],
  )

  const landmarks = split(
    [
      'the Eiffel Tower', 'the Statue of Liberty', 'the Pyramids of Giza',
      'the Great Wall of China', 'Big Ben', 'the Colosseum', 'Taj Mahal',
      'Mount Everest', 'the Grand Canyon', 'the White House',
      'the Golden Gate Bridge', 'Stonehenge',
    ],
    [
      { q: 'A natural landform (not man-made)?', test: has('everest', 'grand canyon') },
      { q: 'The tallest mountain on Earth?', test: has('everest') },
      { q: 'In Paris?', test: has('eiffel') },
      { q: 'In New York Harbor?', test: has('statue of liberty') },
      { q: 'In Egypt?', test: has('pyramids') },
      { q: 'In China?', test: has('great wall') },
      { q: 'A famous clock tower in London?', test: has('big ben') },
      { q: 'An ancient Roman amphitheater?', test: has('colosseum') },
      { q: 'A white marble mausoleum in India?', test: has('taj mahal') },
      { q: 'The U.S. president\'s residence?', test: has('white house') },
      { q: 'A bridge in San Francisco?', test: has('golden gate') },
      { q: 'A prehistoric stone circle in England?', test: has('stonehenge') },
    ],
  )

  const homes = split(
    ['a house', 'an apartment', 'a castle', 'a tent', 'a cabin', 'a mansion', 'an igloo', 'a treehouse'],
    [
      { q: 'Made mainly of ice / snow?', test: has('igloo') },
      { q: 'Built in a tree?', test: has('treehouse') },
      { q: 'Portable fabric shelter?', test: has('tent') },
      { q: 'A fortified medieval residence?', test: has('castle') },
      { q: 'A very large luxurious home?', test: has('mansion') },
      { q: 'A small wooden house, often in the woods?', test: has('cabin') },
      { q: 'One unit in a multi-unit building?', test: has('apartment') },
    ],
  )

  const places = split(
    [
      'a beach', 'a school', 'a hospital', 'a library', 'a park', 'a restaurant',
      'an airport', 'a museum', 'a zoo', 'a stadium', 'a church', 'a mountain',
      'an ocean', 'a forest', 'a desert', 'a farm',
    ],
    [
      { q: 'A natural outdoor geography (not a building)?', test: has(
        'beach', 'park', 'mountain', 'ocean', 'forest', 'desert', 'farm',
      ) },
      { q: 'Covered in sand beside the sea?', test: has('beach') },
      { q: 'A very large body of salt water?', test: has('ocean') },
      { q: 'A dry sandy region?', test: has('desert') },
      { q: 'Dense with trees?', test: has('forest') },
      { q: 'A high landform?', test: has('mountain') },
      { q: 'Where crops / livestock are raised?', test: has('farm') },
      { q: 'A green public recreation area in a city?', test: has('park') },
      { q: 'Where kids go to learn?', test: has('school') },
      { q: 'Where sick people are treated?', test: has('hospital') },
      { q: 'Full of books to borrow?', test: has('library') },
      { q: 'Where you order cooked meals?', test: has('restaurant') },
      { q: 'Where airplanes take off?', test: has('airport') },
      { q: 'Displays art or historical objects?', test: has('museum') },
      { q: 'Keeps animals for public viewing?', test: has('zoo') },
      { q: 'Where sports are played before a big crowd?', test: has('stadium') },
      { q: 'A place of Christian worship?', test: has('church') },
    ],
  )

  const furniture = split(
    ['a bed', 'a chair', 'a couch', 'a desk', 'a table', 'a lamp', 'a bookshelf', 'a mirror', 'a rug'],
    [
      { q: 'Meant for sleeping?', test: has('bed') },
      { q: 'Meant for sitting, soft and multi-person?', test: has('couch') },
      { q: 'Meant for sitting, usually one person?', test: has('chair') },
      { q: 'A work surface, often with drawers?', test: has('desk') },
      { q: 'A flat surface for dining or placing things?', test: has('table') },
      { q: 'Provides light?', test: has('lamp') },
      { q: 'Holds books upright?', test: has('bookshelf') },
      { q: 'Shows a reflection?', test: has('mirror') },
    ],
  )

  const bigAppliances = split(
    [
      'a refrigerator', 'a stove', 'an oven', 'a microwave', 'a dishwasher',
      'a washing machine', 'a dryer', 'a vacuum cleaner',
    ],
    [
      { q: 'Keeps food cold?', test: has('refrigerator') },
      { q: 'Used for cooking with burners / heat from below?', test: has('stove') },
      { q: 'An enclosed box that bakes with dry heat?', test: has('oven') },
      { q: 'Heats food quickly with electromagnetic waves?', test: has('microwave') },
      { q: 'Washes dishes automatically?', test: has('dishwasher') },
      { q: 'Washes clothes?', test: has('washing') },
      { q: 'Dries clothes?', test: has('dryer') },
    ],
  )

  const buildings = q(
    'Building, landmark, or place?',
    q('Famous landmark?', landmarks, q('Home / dwelling?', homes, places)),
    q('Furniture?', furniture, q('Large appliance?', bigAppliances, g('a statue'))),
  )

  const drinks = split(
    [
      'water', 'coffee', 'tea', 'milk', 'orange juice', 'soda', 'beer', 'wine',
      'hot chocolate', 'lemonade', 'smoothie',
    ],
    [
      { q: 'Alcoholic?', test: has('beer', 'wine') },
      { q: 'Made from grapes / often served with dinner?', test: has('wine') },
      { q: 'Typically served hot?', test: has('coffee', 'tea', 'hot chocolate') },
      { q: 'Made from roasted beans?', test: has('coffee') },
      { q: 'Made from leaves steeped in water?', test: has('tea') },
      { q: 'Chocolate-flavored and milky?', test: has('hot chocolate') },
      { q: 'Comes from cows (commonly)?', test: has('milk') },
      { q: 'Made from oranges?', test: has('orange juice') },
      { q: 'Carbonated and sweet?', test: has('soda') },
      { q: 'Blended with fruit?', test: has('smoothie') },
      { q: 'Tart, yellow, often homemade from citrus?', test: has('lemonade') },
    ],
  )

  const fruits = split(
    [
      'an apple', 'a banana', 'an orange', 'a grape', 'a strawberry',
      'a watermelon', 'a pineapple', 'a mango', 'a lemon', 'a coconut',
      'a peach', 'a cherry', 'a blueberry',
    ],
    [
      { q: 'Yellow and curved?', test: has('banana') },
      { q: 'Typically red or green and crunchy, grows on trees in temperate climates?', test: has('apple') },
      { q: 'Citrus?', test: has('orange', 'lemon') },
      { q: 'Distinctly sour / yellow citrus?', test: has('lemon') },
      { q: 'Very large and mostly red inside?', test: has('watermelon') },
      { q: 'Has a spiky exterior?', test: has('pineapple') },
      { q: 'Has a hard brown shell with water inside?', test: has('coconut') },
      { q: 'Grows in bunches on vines, small and round?', test: has('grape') },
      { q: 'Small, red, and has seeds on the outside?', test: has('strawberry') },
      { q: 'Small and blue/purple?', test: has('blueberry') },
      { q: 'Small, red, with a pit, often on desserts?', test: has('cherry') },
      { q: 'Fuzzy skin and a pit?', test: has('peach') },
      { q: 'Tropical with orange flesh and a large flat pit?', test: has('mango') },
    ],
  )

  const veggies = split(
    [
      'a carrot', 'broccoli', 'a potato', 'an onion', 'lettuce', 'a tomato',
      'corn', 'a cucumber', 'garlic', 'spinach',
    ],
    [
      { q: 'Orange and grows underground?', test: has('carrot') },
      { q: 'A leafy green?', test: has('lettuce', 'spinach') },
      { q: 'Often used in salads as the base, mild leaves?', test: has('lettuce') },
      { q: 'Looks like a small tree / green florets?', test: has('broccoli') },
      { q: 'A starchy tuber, often fried or mashed?', test: has('potato') },
      { q: 'Makes you cry when cut?', test: has('onion') },
      { q: 'A strong bulb used for seasoning, smaller than an onion?', test: has('garlic') },
      { q: 'Yellow kernels on a cob?', test: has('corn') },
      { q: 'Long, green, and watery?', test: has('cucumber') },
      { q: 'Red (usually), used as a vegetable in cooking though botanically a fruit?', test: has('tomato') },
    ],
  )

  const takeout = split(
    [
      'a pizza', 'a hamburger', 'a taco', 'a burrito', 'a hot dog',
      'french fries', 'sushi', 'a sandwich', 'fried chicken', 'ramen',
    ],
    [
      { q: 'Round and typically topped with cheese and sauce?', test: has('pizza') },
      { q: 'A patty in a bun?', test: has('hamburger') },
      { q: 'In a soft or hard tortilla folded in half?', test: has('taco') },
      { q: 'A large wrapped tortilla cylinder?', test: has('burrito') },
      { q: 'A sausage in a long bun?', test: has('hot dog') },
      { q: 'Fried strips of potato?', test: has('french fries') },
      { q: 'Raw fish / rice / seaweed cuisine?', test: has('sushi') },
      { q: 'Japanese noodle soup?', test: has('ramen') },
      { q: 'Bread with fillings between slices?', test: has('sandwich') },
    ],
  )

  const otherFood = split(
    [
      'ice cream', 'a cookie', 'a cake', 'chocolate', 'bread', 'cheese',
      'an egg', 'pasta', 'rice', 'soup', 'cereal', 'bacon', 'steak', 'salad',
    ],
    [
      { q: 'A dessert / sweet?', test: has('ice cream', 'cookie', 'cake', 'chocolate') },
      { q: 'Frozen and scooped?', test: has('ice cream') },
      { q: 'Baked, flat, and often has chips?', test: has('cookie') },
      { q: 'A layered celebration dessert?', test: has('cake') },
      { q: 'Made from cacao?', test: has('chocolate') },
      { q: 'A breakfast staple in a bowl with milk?', test: has('cereal') },
      { q: 'A liquid dish eaten with a spoon?', test: has('soup') },
      { q: 'Mostly greens / raw vegetables?', test: has('salad') },
      { q: 'From an animal, often fried for breakfast?', test: has('egg', 'bacon') },
      { q: 'Cured strips of pork?', test: has('bacon') },
      { q: 'A cut of beef?', test: has('steak') },
      { q: 'Dairy, often sliced or shredded?', test: has('cheese') },
      { q: 'A baked staple made from flour?', test: has('bread') },
      { q: 'Italian noodles?', test: has('pasta') },
      { q: 'A grain staple, small white/brown grains?', test: has('rice') },
    ],
  )

  const school = split(
    [
      'a pen', 'a pencil', 'a backpack', 'a book', 'an eraser', 'a notebook',
      'scissors', 'a ruler', 'a stapler', 'a calculator', 'glue', 'a crayon',
    ],
    [
      { q: 'Used for writing or drawing marks?', test: has('pen', 'pencil', 'crayon') },
      { q: 'Uses ink?', test: has('pen') },
      { q: 'Has graphite and can be erased?', test: has('pencil') },
      { q: 'Made of colored wax?', test: has('crayon') },
      { q: 'Removes pencil marks?', test: has('eraser') },
      { q: 'Used to carry other school items?', test: has('backpack') },
      { q: 'Has pages of text to read?', test: has('book') },
      { q: 'Blank pages for writing notes?', test: has('notebook') },
      { q: 'Used for cutting paper?', test: has('scissors') },
      { q: 'Used for measuring length?', test: has('ruler') },
      { q: 'Fastens papers together with metal?', test: has('stapler') },
      { q: 'Does arithmetic electronically?', test: has('calculator') },
      { q: 'Sticky substance for paper crafts?', test: has('glue') },
    ],
  )

  const clothing = split(
    [
      'sneakers', 'boots', 'a hat', 'a hoodie', 'a jacket', 'jeans', 'socks',
      'a t-shirt', 'an umbrella', 'a watch', 'a dress', 'a coat', 'glasses',
      'a scarf', 'gloves', 'a swimsuit',
    ],
    [
      { q: 'Worn on the feet?', test: has('sneakers', 'boots', 'socks') },
      { q: 'Soft coverings for feet inside shoes?', test: has('socks') },
      { q: 'Taller / sturdier footwear, often for weather or work?', test: has('boots') },
      { q: 'Casual athletic shoes?', test: has('sneakers') },
      { q: 'Worn on the head?', test: has('hat') },
      { q: 'Worn on the hands?', test: has('gloves') },
      { q: 'Worn around the neck for warmth?', test: has('scarf') },
      { q: 'Helps you see / corrective lenses?', test: has('glasses') },
      { q: 'Tells time, worn on the wrist?', test: has('watch') },
      { q: 'Blocks rain but is not clothing?', test: has('umbrella') },
      { q: 'Worn for swimming?', test: has('swimsuit') },
      { q: 'A one-piece garment typically worn by women?', test: has('dress') },
      { q: 'Denim pants?', test: has('jeans') },
      { q: 'A heavy outer garment for cold weather?', test: has('coat', 'jacket') },
      { q: 'Has a hood and is casual / sweatshirt-like?', test: has('hoodie') },
      { q: 'A light short-sleeve top?', test: has('t-shirt') },
    ],
  )

  const smallObjects = split(
    [
      'a ball', 'a key', 'a knife', 'a spoon', 'a fork', 'a mug', 'a plate',
      'a toothbrush', 'soap', 'a hammer', 'a flashlight', 'a towel',
      'a candle', 'a coin', 'dice', 'a teddy bear', 'a clock', 'a suitcase',
      'a football', 'a basketball', 'Lego',
    ],
    [
      { q: 'Used for eating?', test: has('spoon', 'fork', 'knife', 'plate', 'mug') },
      { q: 'A drinking vessel, often with a handle?', test: has('mug') },
      { q: 'A flat dish for food?', test: has('plate') },
      { q: 'Has a cutting edge?', test: has('knife') },
      { q: 'Has tines / prongs?', test: has('fork') },
      { q: 'A tool?', test: has('hammer', 'flashlight', 'key') },
      { q: 'Opens locks?', test: has('key') },
      { q: 'Used for pounding nails?', test: has('hammer') },
      { q: 'Produces a beam of light?', test: has('flashlight') },
      { q: 'Used in the bathroom for hygiene?', test: has('toothbrush', 'soap', 'towel') },
      { q: 'Cleans teeth?', test: has('toothbrush') },
      { q: 'Used for washing hands / body?', test: has('soap') },
      { q: 'Used for drying off?', test: has('towel') },
      { q: 'A toy?', test: has('teddy', 'lego', 'dice', 'ball', 'football', 'basketball') },
      { q: 'A stuffed animal?', test: has('teddy') },
      { q: 'Interlocking plastic bricks?', test: has('lego') },
      { q: 'Cubical and used in board games?', test: has('dice') },
      { q: 'An American oval ball sport?', test: has('football') },
      { q: 'An orange ball with lines, bounced on a court?', test: has('basketball') },
      { q: 'A round play object?', test: has('ball') },
      { q: 'Made of wax and provides flame light?', test: has('candle') },
      { q: 'Metal money?', test: has('coin') },
      { q: 'Tells time on a wall or nightstand?', test: has('clock') },
      { q: 'Used for travel / packing clothes?', test: has('suitcase') },
    ],
  )

  const foodDrink = q(
    'Food or drink?',
    q(
      'Drink?',
      drinks,
      q(
        'Fruit or vegetable?',
        q('Fruit?', fruits, veggies),
        q('Typically ordered as takeout / fast food?', takeout, otherFood),
      ),
    ),
    q(
      'Writing or school supply?',
      school,
      q('Clothing or accessory you wear?', clothing, smallObjects),
    ),
  )

  const bigNonLiving = q(
    'Is it bigger than a breadbox?',
    q(
      'Vehicle?',
      q('Does it fly?', flyingVeh, q('Does it go on water?', waterVeh, landVeh)),
      buildings,
    ),
    foodDrink,
  )

  electronics.no = bigNonLiving
  return q('Is it a living thing?', living, electronics)
}

function emitNode(node, indent) {
  const pad = '  '.repeat(indent)
  if (node.kind === 'guess') {
    return `${pad}{ kind: 'guess', name: ${JSON.stringify(node.name)} }`
  }
  const yes = emitNode(node.yes, indent + 1)
  const no = emitNode(node.no, indent + 1)
  return [
    `${pad}{`,
    `${pad}  kind: 'question',`,
    `${pad}  text: ${JSON.stringify(node.text)},`,
    `${pad}  yes: ${yes.trimStart()},`,
    `${pad}  no: ${no.trimStart()},`,
    `${pad}}`,
  ].join('\n')
}

function countLeaves(n) {
  if (n.kind === 'guess') return 1
  return countLeaves(n.yes) + countLeaves(n.no)
}

function maxDepth(n, d = 0) {
  if (n.kind === 'guess') return d
  return Math.max(maxDepth(n.yes, d + 1), maxDepth(n.no, d + 1))
}

function collectLeaves(n, out = []) {
  if (n.kind === 'guess') { out.push(n.name); return out }
  collectLeaves(n.yes, out); collectLeaves(n.no, out); return out
}

function findPath(n, target, path = []) {
  if (n.kind === 'guess') return n.name === target ? path : null
  return (
    findPath(n.yes, target, [...path, `Y:${n.text}`]) ??
    findPath(n.no, target, [...path, `N:${n.text}`])
  )
}

function audit(seed) {
  const leaves = collectLeaves(seed)
  const leafSet = new Set(leaves.map((n) => n.toLowerCase()))
  const bare = new Set()
  for (const n of leaves) {
    bare.add(n.toLowerCase())
    bare.add(n.toLowerCase().replace(/^(a|an|the)\s+/, ''))
  }
  const bad = []
  function walk(node) {
    if (node.kind === 'guess') return
    const t = node.text
    if (/same bunch|\d+\s*options/i.test(t)) bad.push({ text: t, reason: 'group-list' })
    const m = t.match(/^Is it (.+)\?$/i)
    if (m) {
      const cand = m[1].toLowerCase()
      if (leafSet.has(cand) || bare.has(cand)) bad.push({ text: t, reason: 'name-guess' })
      if (/\bor\b/i.test(m[1])) {
        const parts = m[1].split(/\s*,\s*|\s+or\s+/i).map((s) => s.trim().toLowerCase())
        if (parts.filter((p) => leafSet.has(p) || bare.has(p)).length >= 2) {
          bad.push({ text: t, reason: 'group-list-names' })
        }
      }
    }
    const stripped = t.replace(/\?$/, '').trim().toLowerCase()
    if (leafSet.has(stripped) || bare.has(stripped)) {
      bad.push({ text: t, reason: 'bare-name-question' })
    }
    walk(node.yes); walk(node.no)
  }
  walk(seed)
  const seen = new Set()
  return bad.filter((b) => {
    const k = b.reason + '|' + b.text
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

const seed = buildSeed()
const leaves = countLeaves(seed)
const depth = maxDepth(seed)
const targets = ['a computer', 'a smartphone', 'a laptop', 'a tablet', 'a dog', 'a cat']
const paths = Object.fromEntries(targets.map((t) => [t, findPath(seed, t)]))

for (const t of targets) {
  if (!paths[t]) { console.error('FATAL: missing leaf', t); process.exit(1) }
  if (paths[t].length > 20) {
    console.error('FATAL:', t, 'depth', paths[t].length, '> 20'); process.exit(1)
  }
}
if (depth > 20) {
  function deepest(n, path = []) {
    if (n.kind === 'guess') return { d: path.length, path: [...path, n.name] }
    const y = deepest(n.yes, [...path, 'Y:' + n.text])
    const x = deepest(n.no, [...path, 'N:' + n.text])
    return y.d >= x.d ? y : x
  }
  const d = deepest(seed)
  console.error('FATAL: max depth', depth, '> 20')
  console.error('deepest sample:', d.path.join(' | '))
  process.exit(1)
}

const computerPath = paths['a computer']
const eIdx = computerPath.findIndex((s) => s.includes('Electronic?'))
const bIdx = computerPath.findIndex((s) => s.includes('breadbox'))
if (eIdx < 0) { console.error('FATAL: Electronic? missing on computer path'); process.exit(1) }
if (bIdx >= 0 && bIdx < eIdx) {
  console.error('FATAL: breadbox before Electronic on computer path'); process.exit(1)
}
if (paths['a tablet'].some((s) => s.includes('general-purpose computer'))) {
  console.error('FATAL: tablet under general-purpose computer'); process.exit(1)
}

const violations = audit(seed)
if (violations.length) {
  console.error('FATAL: attribute-only audit failed:')
  for (const v of violations.slice(0, 50)) console.error(' -', v.reason, '::', v.text)
  console.error('... total', violations.length)
  process.exit(1)
}

console.log({ leaves, maxDepth: depth, computerDepth: computerPath.length })
for (const t of targets) {
  console.log('\n' + t + ' (' + paths[t].length + 'q):')
  console.log(paths[t].join('\n'))
}

const preamble = `/** Binary decision tree: questions branch; leaves are guesses. */

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
export const STORAGE_KEY = '${STORAGE_KEY}'
export const MAX_QUESTIONS = 20

/** Bump this whenever the seeded question order/content changes. */
export const SEED_VERSION = ${SEED_VERSION}
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

/** Seed v${SEED_VERSION}: classic 20Q attribute questions only; names only on final guess. */
export const seedTree: TreeNode = `

const epilogue = `

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
`

const out = preamble + emitNode(seed, 0) + '\n' + epilogue
fs.writeFileSync(path.join(root, 'src/tree.ts'), out)
console.log('Wrote src/tree.ts', fs.statSync(path.join(root, 'src/tree.ts')).size, 'bytes')
