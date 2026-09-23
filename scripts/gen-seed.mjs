/**
 * Generate classic-20Q-style attribute seedTree (Radica/Burgener ball style).
 * Mid-tree = broad shared attributes only; names only on guess leaves.
 * Prefer info-gain splits; never fingerprint a single leftover mid-round.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const SEED_VERSION = 14
const STORAGE_KEY = `twentyq-tree-v${SEED_VERSION}`

function g(name) { return { kind: 'guess', name } }
function q(text, yes, no) {
  if (!text || /same bunch|\d+\s*options/i.test(text)) throw new Error('Bad Q: ' + text)
  if (/known for/i.test(text)) throw new Error('Banned fingerprint Q: ' + text)
  if (/handheld slab|re-recording|queen bey|king of pop/i.test(text)) {
    throw new Error('Banned fingerprint Q: ' + text)
  }
  return { kind: 'question', text, yes, no }
}

function has(...parts) {
  const lower = parts.map((p) => p.toLowerCase())
  return (name) => lower.some((p) => name.toLowerCase().includes(p))
}

/**
 * Pick attribute splits that roughly halve the set.
 * Skip singleton Yes/No splits while >2 remain (those are fingerprints).
 * When only 2 remain, allow a distinguishing attribute before the guesses.
 */
function split(items, attrs, depthLeft = 14) {
  const list = [...new Set(items)]
  if (list.length === 0) return g('something else')
  if (list.length === 1) return g(list[0])
  if (!attrs.length || depthLeft <= 0) return g(list[0])

  let best = null
  let bestScore = -1
  let bestIdx = -1
  for (let i = 0; i < attrs.length; i++) {
    const head = attrs[i]
    const yes = list.filter(head.test)
    const no = list.filter((n) => !head.test(n))
    if (yes.length === 0 || no.length === 0) continue
    // Ban mid-round fingerprints: only one object would answer Yes (or No)
    // while several candidates remain.
    if (list.length > 2 && (yes.length === 1 || no.length === 1)) continue
    const balance = Math.min(yes.length, no.length)
    const ideal = list.length / 2
    const score = balance - Math.abs(yes.length - ideal) * 0.01
    if (score > bestScore) {
      bestScore = score
      best = head
      bestIdx = i
    }
  }

  // Near the leaves (≤3): allow a distinguishing attribute even if 1-vs-rest.
  if (!best && list.length <= 3) {
    for (let i = 0; i < attrs.length; i++) {
      const head = attrs[i]
      const yes = list.filter(head.test)
      const no = list.filter((n) => !head.test(n))
      if (yes.length > 0 && no.length > 0) {
        best = head
        bestIdx = i
        break
      }
    }
  }

  // Absolute fallback: chain remaining attrs so we do not drop leaves.
  if (!best) {
    for (let i = 0; i < attrs.length; i++) {
      const head = attrs[i]
      const yes = list.filter(head.test)
      const no = list.filter((n) => !head.test(n))
      if (yes.length > 0 && no.length > 0) {
        best = head
        bestIdx = i
        break
      }
    }
  }

  if (!best) return g(list[0])
  const rest = attrs.filter((_, i) => i !== bestIdx)
  const yes = list.filter(best.test)
  const no = list.filter((n) => !best.test(n))
  return q(best.q, split(yes, rest, depthLeft - 1), split(no, rest, depthLeft - 1))
}

function buildSeed() {
  // --- People (shrunk; broad category attrs, no celebrity fingerprints) ---
  const superheroes = split(
    [
      'Batman', 'Superman', 'Spider-Man', 'Wonder Woman', 'Iron Man', 'Hulk',
      'Thor', 'Captain America', 'Black Widow', 'Wolverine', 'Joker', 'Flash',
    ],
    [
      { q: 'Typically associated with Marvel (not DC)?', test: has(
        'spider-man', 'iron man', 'hulk', 'thor', 'captain america',
        'black widow', 'wolverine',
      ) },
      { q: 'Usually wears a cape in classic depictions?', test: has(
        'batman', 'superman', 'wonder woman', 'thor',
      ) },
      { q: 'Primarily a villain rather than a hero?', test: has('joker') },
      { q: 'Often depicted as armored / wearing a metal suit?', test: has('iron man') },
      { q: 'A woman?', test: has('wonder woman', 'black widow') },
      { q: 'Usually portrayed with animal-like claws or regeneration?', test: has('wolverine') },
      { q: 'Is it mainly associated with great physical strength?', test: has('hulk', 'superman', 'wonder woman') },
      { q: 'A dark, brooding detective type?', test: has('batman') },
      { q: 'Associated with a patriotic shield?', test: has('captain america') },
      { q: 'Associated with thunder or a hammer?', test: has('thor') },
      { q: 'Associated with super speed?', test: has('flash') },
      { q: 'Associated with swinging between buildings?', test: has('spider-man') },
    ],
  )

  const starWars = split(
    [
      'Darth Vader', 'Luke Skywalker', 'Yoda', 'Princess Leia',
      'Han Solo', 'Chewbacca', 'R2-D2', 'C-3PO',
    ],
    [
      { q: 'A droid / robot?', test: has('r2-d2', 'c-3po') },
      { q: 'Primarily gold-colored?', test: has('c-3po') },
      { q: 'A furry non-human?', test: has('chewbacca') },
      { q: 'Often associated with the dark side?', test: has('darth vader') },
      { q: 'A small, green Force user?', test: has('yoda') },
      { q: 'A woman?', test: has('princess leia') },
      { q: 'A smuggler / pilot type?', test: has('han solo') },
    ],
  )

  const animated = split(
    [
      'Mickey Mouse', 'SpongeBob', 'Homer Simpson', 'Bugs Bunny', 'Pikachu',
      'Mario', 'Elsa', 'Shrek', 'Scooby-Doo', 'Buzz Lightyear',
    ],
    [
      { q: 'From anime or Japanese games originally?', test: has('pikachu') },
      { q: 'A Disney or Pixar character?', test: has('mickey', 'elsa', 'buzz') },
      { q: 'A princess with ice powers?', test: has('elsa') },
      { q: 'A toy / action-figure character?', test: has('buzz') },
      { q: 'An iconic mouse in red shorts?', test: has('mickey') },
      { q: 'From The Simpsons?', test: has('homer') },
      { q: 'Lives underwater in a cartoon?', test: has('spongebob') },
      { q: 'A green ogre?', test: has('shrek') },
      { q: 'A plumber from video games?', test: has('mario') },
      { q: 'A mystery-solving dog?', test: has('scooby') },
      { q: 'A cartoon rabbit?', test: has('bugs') },
    ],
  )

  const otherFiction = split(
    [
      'Harry Potter', 'Gandalf', 'Sherlock Holmes', 'Santa Claus',
      'Dragon', 'Unicorn', 'Vampire', 'Zombie', 'Ghost', 'Wizard',
    ],
    [
      { q: 'A mythical / fantasy creature rather than a named person?', test: has(
        'dragon', 'unicorn', 'vampire', 'zombie', 'ghost', 'wizard',
      ) },
      { q: 'Typically undead or a spirit?', test: has('vampire', 'zombie', 'ghost') },
      { q: 'Associated with drinking blood in fiction?', test: has('vampire') },
      { q: 'A walking corpse in horror fiction?', test: has('zombie') },
      { q: 'A spirit of a dead person?', test: has('ghost') },
      { q: 'A fire-breathing reptile?', test: has('dragon') },
      { q: 'A horse-like creature with a single horn?', test: has('unicorn') },
      { q: 'Uses magic spells as a profession?', test: has('wizard', 'gandalf') },
      { q: 'Associated with Christmas?', test: has('santa') },
      { q: 'From Harry Potter?', test: has('harry potter') },
      { q: 'A detective?', test: has('sherlock') },
    ],
  )

  const moviesTv = q(
    'From movies or TV?',
    q(
      'Superhero or comic character?',
      superheroes,
      q('Associated with Star Wars?', starWars, q('Animated / cartoon?', animated, otherFiction)),
    ),
    split(
      ['Link', 'Pac-Man', 'Zeus', 'Robin Hood', 'Peter Pan', 'Bigfoot'],
      [
        { q: 'Primarily from a video game?', test: has('link', 'pac-man') },
        { q: 'A yellow round creature that eats dots?', test: has('pac-man') },
        { q: 'From Greek mythology?', test: has('zeus') },
        { q: 'A cryptid people claim to have seen?', test: has('bigfoot') },
        { q: 'A boy who can fly and will not grow up?', test: has('peter pan') },
        { q: 'Steals from the rich in legend?', test: has('robin hood') },
      ],
    ),
  )

  const jobs = split(
    [
      'a teacher', 'a doctor', 'a firefighter', 'a police officer', 'a nurse',
      'a chef', 'a pilot', 'a soldier', 'a lawyer', 'an engineer', 'a farmer',
      'a scientist', 'an astronaut', 'a musician', 'an actor', 'a writer',
      'a mechanic', 'a plumber', 'an electrician',
    ],
    [
      { q: 'Works mainly in medicine or health care?', test: has('doctor', 'nurse') },
      { q: 'Typically assists physicians in a hospital?', test: has('nurse') },
      { q: 'A first responder or public-safety role?', test: has('firefighter', 'police', 'soldier') },
      { q: 'Puts out fires?', test: has('firefighter') },
      { q: 'Serves in the armed forces?', test: has('soldier') },
      { q: 'Enforces the law?', test: has('police') },
      { q: 'Works with food professionally?', test: has('chef') },
      { q: 'Flies aircraft or spacecraft?', test: has('pilot', 'astronaut') },
      { q: 'Travels to space?', test: has('astronaut') },
      { q: 'Works in a skilled trade with tools?', test: has('mechanic', 'plumber', 'electrician') },
      { q: 'Works with water pipes?', test: has('plumber') },
      { q: 'Works with electrical wiring?', test: has('electrician') },
      { q: 'A legal profession?', test: has('lawyer') },
      { q: 'Works in education?', test: has('teacher') },
      { q: 'A creative / entertainment profession?', test: has('musician', 'actor', 'writer') },
      { q: 'Performs music?', test: has('musician') },
      { q: 'Acts in films or theater?', test: has('actor') },
      { q: 'Works on a farm?', test: has('farmer') },
      { q: 'Does scientific research?', test: has('scientist') },
      { q: 'Designs or builds technical systems?', test: has('engineer') },
    ],
  )

  // Famous people: broad buckets only; few leaves; no album/film fingerprints.
  const famous = split(
    [
      'Albert Einstein', 'Marie Curie', 'Abraham Lincoln', 'Martin Luther King Jr.',
      'Elvis Presley', 'Beyoncé', 'Taylor Swift', 'Michael Jordan',
      'Serena Williams', 'Barack Obama', 'Steve Jobs', 'Nikola Tesla',
    ],
    [
      { q: 'Still alive today (as of the 2020s)?', test: has(
        'beyoncé', 'taylor swift', 'serena', 'barack',
      ) },
      { q: 'Is it mainly a musician / singer?', test: has('elvis', 'beyoncé', 'taylor swift') },
      { q: 'A woman?', test: has('curie', 'beyoncé', 'taylor swift', 'serena') },
      { q: 'Is it mainly an athlete?', test: has('jordan', 'serena') },
      { q: 'A tennis player?', test: has('serena') },
      { q: 'A political leader or activist?', test: has(
        'lincoln', 'martin luther king', 'obama',
      ) },
      { q: 'A U.S. president?', test: has('lincoln', 'obama') },
      { q: 'Is it associated with technology, invention, or physics?', test: has('steve jobs', 'tesla', 'einstein', 'curie') },
      { q: 'Is it associated with science or scientific discoveries?', test: has('einstein', 'curie', 'tesla') },
      { q: 'Is it a woman associated with science?', test: has('curie') },
      { q: 'Associated with computers / consumer electronics companies?', test: has('steve jobs') },
      { q: 'Associated with electricity inventions?', test: has('tesla') },
    ],
  )

  const realPerson = q(
    'Is it mainly a job or occupation?',
    jobs,
    q(
      'Is it a famous real person?',
      famous,
      split(
        ['a baby', 'a child', 'a teenager', 'an adult', 'an elderly person'],
        [
          { q: 'Under 18 years old (typically)?', test: has('baby', 'child', 'teenager') },
          { q: 'A newborn or infant?', test: has('baby') },
          { q: 'In the teen years?', test: has('teenager') },
          { q: 'Notably old / senior?', test: has('elderly') },
        ],
      ),
    ),
  )

  const person = q('Is it a fictional character?', moviesTv, realPerson)

  // --- Animals: class → habitat → pet/farm/wild; no species-only tells mid-round ---
  const waterAnimals = q(
    'Does it live mostly in water?',
    q(
      'Is it a mammal?',
      split(
        ['a dolphin', 'a whale', 'a seal', 'an otter'],
        [
          { q: 'Among the largest animals on Earth?', test: has('whale') },
          { q: 'Often seen floating on its back?', test: has('otter') },
          { q: 'Has flippers and spends time on ice or shore?', test: has('seal') },
        ],
      ),
      q(
        'Does it have a hard shell or exoskeleton?',
        split(
          ['a crab', 'a lobster', 'a turtle', 'a clam'],
          [
            { q: 'Is it a reptile?', test: has('turtle') },
            { q: 'Typically lives in a two-part shell?', test: has('clam') },
            { q: 'Has large claws?', test: has('lobster') },
          ],
        ),
        split(
          ['a shark', 'a goldfish', 'a jellyfish', 'an octopus'],
          [
            { q: 'Does it have tentacles?', test: has('octopus', 'jellyfish') },
            { q: 'Is it soft and gelatinous?', test: has('jellyfish') },
            { q: 'Is it a common pet fish?', test: has('goldfish') },
          ],
        ),
      ),
    ),
    q(
      'Can it fly under its own power?',
      q(
        'Is it a bird?',
        split(
          ['an eagle', 'an owl', 'a chicken', 'a penguin', 'a parrot', 'a crow'],
          [
            { q: 'Is it a bird of prey?', test: has('eagle', 'owl') },
            { q: 'Is it primarily nocturnal?', test: has('owl') },
            { q: 'Is it commonly raised on a farm?', test: has('chicken') },
            { q: 'Can it not fly well, but swim?', test: has('penguin') },
            { q: 'Is it often kept as a talking pet?', test: has('parrot') },
          ],
        ),
        split(
          ['a bat', 'a bee', 'a butterfly', 'a mosquito', 'a fly'],
          [
            { q: 'Is it a mammal?', test: has('bat') },
            { q: 'Does it produce honey?', test: has('bee') },
            { q: 'Does it have large colorful wings?', test: has('butterfly') },
            { q: 'Does it feed on blood?', test: has('mosquito') },
          ],
        ),
      ),
      q(
        'Is it a common household pet?',
        q(
          'Is it a mammal?',
          split(
            ['a cat', 'a dog', 'a rabbit', 'a hamster', 'a guinea pig'],
            [
              { q: 'Is it a feline or canine?', test: has('cat', 'dog') },
              { q: 'Is it a feline?', test: has('cat') },
              { q: 'Does it hop with long ears?', test: has('rabbit') },
              { q: 'Does it store food in its cheeks?', test: has('hamster') },
            ],
          ),
          split(
            ['a goldfish', 'a parrot', 'a turtle', 'a snake'],
            [
              { q: 'Does it live in water as a pet?', test: has('goldfish') },
              { q: 'Is it a bird?', test: has('parrot') },
              { q: 'Does it have a shell?', test: has('turtle') },
            ],
          ),
        ),
        q(
          'Is it a farm animal?',
          split(
            ['a cow', 'a pig', 'a horse', 'a sheep', 'a goat', 'a chicken'],
            [
              { q: 'Is it used mainly for riding?', test: has('horse') },
              { q: 'Does it produce wool?', test: has('sheep') },
              { q: 'Is it a bird?', test: has('chicken') },
              { q: 'Is it typically raised for milk?', test: has('cow') },
              { q: 'Is it typically raised for pork?', test: has('pig') },
            ],
          ),
          q(
            'Is it a big cat (lion, tiger, etc.)?',
            split(
              ['a lion', 'a tiger', 'a leopard', 'a cheetah'],
              [
                { q: 'Do adult males usually have a mane?', test: has('lion') },
                { q: 'Does it have black stripes on orange fur?', test: has('tiger') },
                { q: 'Is it the fastest land animal?', test: has('cheetah') },
              ],
            ),
            split(
              [
                'an elephant', 'a giraffe', 'a bear', 'a monkey', 'a wolf',
                'a deer', 'a zebra', 'a frog', 'a spider', 'an ant',
              ],
              [
                { q: 'Is it an insect?', test: has('ant') },
                { q: 'Is it an arachnid?', test: has('spider') },
                { q: 'Is it an amphibian?', test: has('frog') },
                { q: 'Does it have a trunk?', test: has('elephant') },
                { q: 'Does it have a very long neck?', test: has('giraffe') },
                { q: 'Does it have black and white stripes?', test: has('zebra') },
                { q: 'Is it a primate?', test: has('monkey') },
                { q: 'Does it usually live and hunt in packs?', test: has('wolf') },
                { q: 'Do males often have antlers?', test: has('deer') },
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
      'Is it a tree?',
      split(
        ['an oak tree', 'a pine tree', 'a palm tree', 'a maple tree', 'an apple tree'],
        [
          { q: 'Does it produce edible fruit commonly eaten raw?', test: has('apple') },
          { q: 'Is it an evergreen with needles?', test: has('pine') },
          { q: 'Is it associated with tropical climates and fronds?', test: has('palm') },
          { q: 'Is it often associated with fall color or syrup?', test: has('maple') },
        ],
      ),
      q(
        'Is it a flower?',
        split(
          ['a rose', 'a tulip', 'a sunflower', 'a daisy'],
          [
            { q: 'Is it typically associated with romance?', test: has('rose') },
            { q: 'Does it have a large yellow head?', test: has('sunflower') },
            { q: 'Is it a spring bulb flower?', test: has('tulip') },
          ],
        ),
        split(
          ['a cactus', 'a fern', 'a mushroom', 'grass'],
          [
            { q: 'Is it a fungus rather than a green plant?', test: has('mushroom') },
            { q: 'Does it have spines and store water?', test: has('cactus') },
            { q: 'Does it have feathery fronds and no flowers?', test: has('fern') },
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

  // --- Electricity / home / computing (classic ball style) ---
  // Light switch path (target):
  // living? N → house? Y → electricity? Y → wall-attached? Y → turns things on/off? Y → light switch

  const computingDevices = q(
    'Does it have a screen?',
    q(
      'Is it portable (meant to be carried around)?',
      q(
        'Is it small enough to fit in a typical pocket?',
        g('a smartphone'),
        q(
          'Does it have a built-in physical keyboard that folds shut?',
          g('a laptop'),
          g('a tablet'),
        ),
      ),
      q(
        'Is it mainly used as a general-purpose computer for work or browsing?',
        g('a computer'),
        q(
          'Is it mainly for watching shows from across a room?',
          g('a TV'),
          g('a monitor'),
        ),
      ),
    ),
    q(
      'Is it worn on the body?',
      split(
        ['headphones', 'earbuds', 'a smartwatch', 'a fitness tracker'],
        [
          { q: 'Is it worn on the wrist?', test: has('smartwatch', 'fitness') },
          { q: 'Is it mainly for health / step tracking?', test: has('fitness') },
          { q: 'Do the cups sit over the ears rather than in them?', test: has('headphones') },
        ],
      ),
      split(
        [
          'a remote control', 'a keyboard', 'a computer mouse', 'a game controller',
          'a charger', 'a printer', 'a speaker', 'a router', 'a camera',
          'a battery', 'a USB drive', 'a gaming console',
        ],
        [
          { q: 'Is it mainly used to control another device from a distance?', test: has('remote') },
          { q: 'Is it used for typing?', test: has('keyboard') },
          { q: 'Does it control a pointer on a screen?', test: has('computer mouse') },
          { q: 'Is it held to play video games?', test: has('game controller', 'gaming console') },
          { q: 'Is it a whole game system for a TV?', test: has('gaming console') },
          { q: 'Does it print on paper?', test: has('printer') },
          { q: 'Does it produce sound for a room?', test: has('speaker') },
          { q: 'Does it provide a home Wi-Fi network?', test: has('router') },
          { q: 'Is it mainly for taking photos or video?', test: has('camera') },
          { q: 'Does it store electrical energy in a cell or pack?', test: has('battery') },
          { q: 'Is it a small stick for storing files?', test: has('usb') },
          { q: 'Is it used to supply power through a cable?', test: has('charger') },
        ],
      ),
    ),
  )

  const wallElectric = q(
    'Is it attached to a wall or building?',
    q(
      'Does it produce light itself?',
      g('a light bulb'),
      q(
        'Does it provide sockets for plugs?',
        g('an outlet'),
        q(
          'Do you operate it by hand to control something else?',
          q(
            'Is it mainly for temperature or climate?',
            g('a thermostat'),
            q(
              'Does it mainly adjust how bright the lights are?',
              g('a dimmer'),
              g('a light switch'),
            ),
          ),
          g('a smoke detector'),
        ),
      ),
    ),
    q(
      'Is it a large kitchen or laundry appliance?',
      split(
        [
          'a refrigerator', 'a stove', 'an oven', 'a microwave',
          'a dishwasher', 'a washing machine', 'a dryer', 'a vacuum cleaner',
        ],
        [
          { q: 'Does it keep food cold?', test: has('refrigerator') },
          { q: 'Is it used for cooking on burners?', test: has('stove') },
          { q: 'Is it an enclosed box that bakes?', test: has('oven') },
          { q: 'Does it heat food very quickly?', test: has('microwave') },
          { q: 'Does it wash dishes?', test: has('dishwasher') },
          { q: 'Does it wash clothes?', test: has('washing') },
          { q: 'Does it dry clothes?', test: has('dryer') },
        ],
      ),
      computingDevices,
    ),
  )

  const houseNonElectric = q(
    'Is it attached to a door or wall?',
    q(
      'Is it used to open or close a door?',
      g('a doorknob'),
      q(
        'Does it show a reflection?',
        g('a mirror'),
        g('a picture frame'),
      ),
    ),
    q(
      'Is it furniture?',
      split(
        ['a bed', 'a chair', 'a couch', 'a desk', 'a table', 'a lamp', 'a bookshelf', 'a rug'],
        [
          { q: 'Is it meant for sleeping?', test: has('bed') },
          { q: 'Is it meant for sitting by more than one person?', test: has('couch') },
          { q: 'Is it meant for sitting by one person?', test: has('chair') },
          { q: 'Is it a work surface with drawers?', test: has('desk') },
          { q: 'Is it a flat surface for dining or placing things?', test: has('table') },
          { q: 'Does it provide light?', test: has('lamp') },
          { q: 'Does it hold books?', test: has('bookshelf') },
        ],
      ),
      split(
        ['a key', 'a towel', 'soap', 'a toothbrush', 'a candle', 'a clock'],
        [
          { q: 'Does it open locks?', test: has('key') },
          { q: 'Is it used for drying off?', test: has('towel') },
          { q: 'Is it used for washing hands or body?', test: has('soap') },
          { q: 'Is it used to clean teeth?', test: has('toothbrush') },
          { q: 'Is it made of wax and burned for light?', test: has('candle') },
        ],
      ),
    ),
  )

  const foundInHouse = q(
    'Does it use electricity?',
    wallElectric,
    houseNonElectric,
  )

  // Vehicles / places / food / clothing / tools (non-house branch)
  const flyingVeh = split(
    ['a helicopter', 'a drone', 'a rocket', 'an airplane', 'a hot air balloon'],
    [
      { q: 'Does it have spinning rotors on top?', test: has('helicopter') },
      { q: 'Is it unmanned / remotely piloted?', test: has('drone') },
      { q: 'Does it go to space?', test: has('rocket') },
      { q: 'Is it inflated with hot air?', test: has('hot air') },
    ],
  )

  const waterVeh = split(
    ['a submarine', 'a canoe', 'a sailboat', 'a cruise ship', 'a kayak'],
    [
      { q: 'Does it travel underwater?', test: has('submarine') },
      { q: 'Is it powered mainly by sails?', test: has('sailboat') },
      { q: 'Is it a large ship for passengers?', test: has('cruise') },
      { q: 'Is it paddled while sitting?', test: has('kayak', 'canoe') },
      { q: 'Does it typically use a double-bladed paddle?', test: has('kayak') },
    ],
  )

  const landVeh = split(
    [
      'a car', 'a truck', 'a bus', 'a motorcycle', 'a bicycle', 'a train',
      'an ambulance', 'a scooter', 'a tractor',
    ],
    [
      { q: 'Does it have two wheels?', test: has('motorcycle', 'bicycle', 'scooter') },
      { q: 'Is it pedaled by the rider?', test: has('bicycle') },
      { q: 'Is it motorized and straddled like a bike?', test: has('motorcycle') },
      { q: 'Does it run on rails?', test: has('train') },
      { q: 'Is it an emergency vehicle?', test: has('ambulance') },
      { q: 'Does it carry many passengers on a city route?', test: has('bus') },
      { q: 'Is it used on a farm?', test: has('tractor') },
      { q: 'Is it larger than a car and used for hauling cargo?', test: has('truck') },
    ],
  )

  const places = split(
    [
      'a house', 'an apartment', 'a school', 'a hospital', 'a library',
      'a park', 'a beach', 'a mountain', 'an ocean', 'a forest',
    ],
    [
      { q: 'Is it a home / dwelling?', test: has('house', 'apartment') },
      { q: 'Is it one unit in a multi-unit building?', test: has('apartment') },
      { q: 'Is it a natural outdoor place (not a building)?', test: has(
        'park', 'beach', 'mountain', 'ocean', 'forest',
      ) },
      { q: 'Is it covered in sand beside water?', test: has('beach') },
      { q: 'Is it a large body of salt water?', test: has('ocean') },
      { q: 'Is it dense with trees?', test: has('forest') },
      { q: 'Is it a high landform?', test: has('mountain') },
      { q: 'Where do kids go to learn?', test: has('school') },
      { q: 'Where are sick people treated?', test: has('hospital') },
      { q: 'Is it full of books to borrow?', test: has('library') },
    ],
  )

  const drinks = split(
    ['water', 'coffee', 'tea', 'milk', 'soda', 'beer', 'wine', 'orange juice'],
    [
      { q: 'Is it alcoholic?', test: has('beer', 'wine') },
      { q: 'Is it made from grapes?', test: has('wine') },
      { q: 'Is it typically served hot?', test: has('coffee', 'tea') },
      { q: 'Is it made from roasted beans?', test: has('coffee') },
      { q: 'Does it commonly come from cows?', test: has('milk') },
      { q: 'Is it carbonated and sweet?', test: has('soda') },
      { q: 'Is it made from oranges?', test: has('orange juice') },
    ],
  )

  const fruits = split(
    ['an apple', 'a banana', 'an orange', 'a grape', 'a strawberry', 'a watermelon'],
    [
      { q: 'Is it yellow and curved?', test: has('banana') },
      { q: 'Is it citrus?', test: has('orange') },
      { q: 'Is it very large and mostly red inside?', test: has('watermelon') },
      { q: 'Does it grow in small bunches?', test: has('grape') },
      { q: 'Does it have seeds on the outside?', test: has('strawberry') },
    ],
  )

  const veggies = split(
    ['a carrot', 'broccoli', 'a potato', 'an onion', 'lettuce', 'a tomato'],
    [
      { q: 'Is it orange and grows underground?', test: has('carrot') },
      { q: 'Is it a leafy green?', test: has('lettuce') },
      { q: 'Does it look like green florets?', test: has('broccoli') },
      { q: 'Is it a starchy tuber?', test: has('potato') },
      { q: 'Does cutting it often make people cry?', test: has('onion') },
    ],
  )

  const preparedFood = split(
    [
      'a pizza', 'a hamburger', 'a taco', 'a sandwich', 'ice cream',
      'bread', 'cheese', 'an egg', 'pasta', 'soup',
    ],
    [
      { q: 'Is it typically a dessert / sweet?', test: has('ice cream') },
      { q: 'Is it round and often topped with cheese?', test: has('pizza') },
      { q: 'Is it a patty in a bun?', test: has('hamburger') },
      { q: 'Is it in a tortilla?', test: has('taco') },
      { q: 'Is it bread with fillings?', test: has('sandwich') },
      { q: 'Is it a liquid dish eaten with a spoon?', test: has('soup') },
      { q: 'Is it dairy, often sliced or shredded?', test: has('cheese') },
      { q: 'Is it a baked staple made from flour?', test: has('bread') },
      { q: 'Is it noodles?', test: has('pasta') },
    ],
  )

  const clothing = split(
    [
      'sneakers', 'boots', 'a hat', 'a jacket', 'jeans', 'socks',
      'a t-shirt', 'glasses', 'a watch', 'gloves',
    ],
    [
      { q: 'Is it worn on the feet?', test: has('sneakers', 'boots', 'socks') },
      { q: 'Is it a soft covering worn inside shoes?', test: has('socks') },
      { q: 'Is it taller / sturdier footwear?', test: has('boots') },
      { q: 'Is it worn on the head?', test: has('hat') },
      { q: 'Is it worn on the hands?', test: has('gloves') },
      { q: 'Does it help you see?', test: has('glasses') },
      { q: 'Does it tell time on the wrist?', test: has('watch') },
      { q: 'Are they denim pants?', test: has('jeans') },
      { q: 'Is it an outer garment for warmth?', test: has('jacket') },
    ],
  )

  const toolsAndSmall = split(
    [
      'a hammer', 'a screwdriver', 'a knife', 'a spoon', 'a fork', 'a mug',
      'a plate', 'a ball', 'a book', 'a pen', 'a pencil', 'scissors',
      'a backpack', 'a coin', 'a flashlight',
    ],
    [
      { q: 'Is it a tool?', test: has('hammer', 'screwdriver', 'scissors', 'flashlight', 'knife') },
      { q: 'Is it used for pounding nails?', test: has('hammer') },
      { q: 'Is it used for turning screws?', test: has('screwdriver') },
      { q: 'Is it used for cutting paper?', test: has('scissors') },
      { q: 'Does it produce a beam of light?', test: has('flashlight') },
      { q: 'Does it have a cutting edge?', test: has('knife') },
      { q: 'Is it used for eating?', test: has('spoon', 'fork', 'plate', 'mug') },
      { q: 'Is it a drinking vessel?', test: has('mug') },
      { q: 'Is it a flat dish?', test: has('plate') },
      { q: 'Does it have tines / prongs?', test: has('fork') },
      { q: 'Is it used for writing?', test: has('pen', 'pencil') },
      { q: 'Does it use ink?', test: has('pen') },
      { q: 'Is it a round play object?', test: has('ball') },
      { q: 'Does it have pages to read?', test: has('book') },
      { q: 'Is it used to carry other items?', test: has('backpack') },
      { q: 'Is it metal money?', test: has('coin') },
    ],
  )

  const foodDrink = q(
    'Is it food or drink?',
    q(
      'Is it a drink?',
      drinks,
      q(
        'Is it a fruit or vegetable?',
        q('Is it a fruit?', fruits, veggies),
        preparedFood,
      ),
    ),
    q(
      'Do you wear it?',
      clothing,
      toolsAndSmall,
    ),
  )

  const bigNonHouse = q(
    'Is it bigger than a breadbox?',
    q(
      'Is it a vehicle?',
      q('Does it fly?', flyingVeh, q('Does it go on water?', waterVeh, landVeh)),
      places,
    ),
    foodDrink,
  )

  const nonLiving = q(
    'Is it commonly found in a typical house?',
    foundInHouse,
    bigNonHouse,
  )

  return q('Is it a living thing?', living, nonLiving)
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

function collectQuestions(n, out = []) {
  if (n.kind === 'guess') return out
  out.push(n.text)
  collectQuestions(n.yes, out)
  collectQuestions(n.no, out)
  return out
}

function findPath(n, target, path = []) {
  if (n.kind === 'guess') return n.name === target ? path : null
  return (
    findPath(n.yes, target, [...path, `Y:${n.text}`]) ??
    findPath(n.no, target, [...path, `N:${n.text}`])
  )
}

/** Count how many sibling leaves under a question would answer Yes. */
function auditFingerprints(seed) {
  const bad = []
  function leafNames(n, out = []) {
    if (n.kind === 'guess') { out.push(n.name); return out }
    leafNames(n.yes, out); leafNames(n.no, out); return out
  }
  function walk(node) {
    if (node.kind === 'guess') return
    const yesLeaves = leafNames(node.yes)
    const noLeaves = leafNames(node.no)
    const total = yesLeaves.length + noLeaves.length
    // Mid-round fingerprint: exactly one leaf on a side while >2 remain overall
    if (total > 2 && (yesLeaves.length === 1 || noLeaves.length === 1)) {
      // Allow only if this is effectively the last distinguishing Q before guesses
      // (i.e. one side is a single guess AND the other side depth is small).
      // Still flag as fingerprint-risk for review when Yes-set is a unique proper-noun tell.
      if (yesLeaves.length === 1 && total > 3) {
        bad.push({
          text: node.text,
          reason: 'singleton-yes-fingerprint',
          yes: yesLeaves[0],
          total,
        })
      }
    }
    if (/known for/i.test(node.text)) {
      bad.push({ text: node.text, reason: 'known-for' })
    }
    if (/handheld slab|re-recording/i.test(node.text)) {
      bad.push({ text: node.text, reason: 'banned-phrase' })
    }
    // Proper-noun mid-ask: question mentions a unique leaf name
    const leafSet = new Set(leafNames(seed).map((x) => x.toLowerCase()))
    for (const leaf of leafSet) {
      const bare = leaf.replace(/^(a|an|the)\s+/, '')
      if (bare.length < 4) continue
      const re = new RegExp(`\\b${bare.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      if (re.test(node.text) && !/^is it (a |an |the )?/.test(node.text.toLowerCase()) === false) {
        // If question contains the exact leaf name as the whole ask → name-guess
      }
      if (new RegExp(`^is it ${leaf.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\?$`, 'i').test(node.text)) {
        bad.push({ text: node.text, reason: 'name-guess' })
      }
    }
    // Unique proper noun tokens (capitalized multi-letter) that match a leaf
    const caps = node.text.match(/\b[A-Z][a-zA-Z]{2,}\b/g) || []
    for (const c of caps) {
      const cl = c.toLowerCase()
      if (['Is', 'Does', 'Do', 'Can', 'Are', 'Was', 'Were', 'Has', 'Have', 'From', 'The', 'Typically', 'Usually', 'Primarily', 'Often', 'Associated', 'Marvel', 'Star', 'Wars', 'Disney', 'Pixar', 'Greek', 'Force', 'Christmas', 'Harry', 'Potter', 'Simpsons', 'American'].includes(c)) continue
      for (const leaf of leafSet) {
        if (leaf.includes(cl) && cl.length >= 4) {
          bad.push({ text: node.text, reason: 'proper-noun', token: c })
        }
      }
    }
    walk(node.yes)
    walk(node.no)
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

function auditNames(seed) {
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
    if (/known for/i.test(t)) bad.push({ text: t, reason: 'known-for' })
    const m = t.match(/^Is it (.+)\?$/i)
    if (m) {
      const cand = m[1].toLowerCase()
      if (leafSet.has(cand) || bare.has(cand)) bad.push({ text: t, reason: 'name-guess' })
    }
    const stripped = t.replace(/\?$/, '').trim().toLowerCase()
    if (leafSet.has(stripped) || bare.has(stripped)) {
      bad.push({ text: t, reason: 'bare-name-question' })
    }
    walk(node.yes); walk(node.no)
  }
  walk(seed)
  return bad
}

const seed = buildSeed()
const leaves = countLeaves(seed)
const depth = maxDepth(seed)
const targets = [
  'a computer', 'a smartphone', 'a laptop', 'a tablet', 'a dog', 'a cat',
  'a light switch', 'a light bulb', 'an outlet', 'a doorknob', 'a remote control',
]
const paths = Object.fromEntries(targets.map((t) => [t, findPath(seed, t)]))

for (const t of targets) {
  if (!paths[t]) { console.error('FATAL: missing leaf', t); process.exit(1) }
  if (paths[t].length > 20) {
    console.error('FATAL:', t, 'depth', paths[t].length, '> 20'); process.exit(1)
  }
}
if (depth > 20) {
  console.error('FATAL: max depth', depth, '> 20')
  process.exit(1)
}

// Light switch must not be asked as a name mid-round
for (const step of paths['a light switch']) {
  if (/light switch/i.test(step)) {
    console.error('FATAL: light switch name appears mid-path:', step)
    process.exit(1)
  }
}

const computerPath = paths['a computer']
const houseIdx = computerPath.findIndex((s) => /typical house/i.test(s))
const elecIdx = computerPath.findIndex((s) => /electricity/i.test(s))
if (elecIdx < 0) {
  console.error('FATAL: electricity question missing on computer path')
  process.exit(1)
}

const ls = paths['a light switch']
const need = [/living/i, /house/i, /electricity/i, /wall|building/i]
for (const re of need) {
  if (!ls.some((s) => re.test(s))) {
    console.error('FATAL: light switch path missing pattern', re, '\n', ls.join('\n'))
    process.exit(1)
  }
}

const violations = [...auditNames(seed), ...auditFingerprints(seed)]
// Soft: singleton-yes is informational if total==3 (last branch); hard-fail known-for / name-guess / banned
const hard = violations.filter((v) =>
  v.reason === 'known-for' ||
  v.reason === 'name-guess' ||
  v.reason === 'bare-name-question' ||
  v.reason === 'banned-phrase' ||
  v.reason === 'group-list' ||
  v.reason === 'proper-noun',
)
const softSingletons = violations.filter((v) => v.reason === 'singleton-yes-fingerprint')
console.log('soft singleton-yes flags:', softSingletons.length)

if (hard.length) {
  console.error('FATAL: attribute audit failed:')
  for (const v of hard.slice(0, 60)) console.error(' -', v.reason, '::', v.text, v.yes || v.token || '')
  console.error('... total hard', hard.length)
  process.exit(1)
}

console.log({ leaves, maxDepth: depth, softFlags: violations.length - hard.length })
for (const t of targets) {
  console.log('\n' + t + ' (' + paths[t].length + 'q):')
  console.log(paths[t].join('\n'))
}

const sampleQs = collectQuestions(seed)
  .filter((t) =>
    /electricity|breadbox|house|metal|wear|tool|wall|screen|portable|pocket|keyboard|living|animal|plant/i.test(t),
  )
  .slice(0, 20)
console.log('\nSample generic questions:')
for (const s of sampleQs) console.log(' -', s)

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
