/**
 * Generate an expanded seedTree for 20Q under the existing early splits.
 * Preserves computer path:
 *   not living → not breadbox → not food/drink → electronic → not phone
 *   → computer (laptop/desktop/PC) → not laptop → desktop → "a computer"
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

/** @typedef {{ kind: 'guess', name: string }} Guess */
/** @typedef {{ kind: 'question', text: string, yes: Node, no: Node }} Question */
/** @typedef {Guess | Question} Node */

/** @param {string} name */
function g(name) {
  return { kind: 'guess', name }
}

/** @param {string} text @param {Node} yes @param {Node} no */
function q(text, yes, no) {
  return { kind: 'question', text, yes, no }
}

/** Balanced alphabetical binary tree over guess names. */
function alpha(names) {
  const sorted = [...new Set(names)].sort((a, b) => a.localeCompare(b))
  function build(list) {
    if (list.length === 0) throw new Error('empty alpha list')
    if (list.length === 1) return g(list[0])
    if (list.length === 2) {
      return q(`Is it ${list[0]}?`, g(list[0]), g(list[1]))
    }
    const mid = Math.floor(list.length / 2)
    const pivot = list[mid]
    const left = list.slice(0, mid)
    const right = list.slice(mid)
    // "before pivot" → left (strictly earlier names); else right (pivot + later)
    return q(
      `Does its name come before "${pivot}" alphabetically?`,
      build(left),
      build(right),
    )
  }
  return build(sorted)
}

/** Chain of direct "Is it X?" questions ending in last guess. */
function chain(names) {
  const uniq = [...new Set(names)]
  if (uniq.length === 0) throw new Error('empty chain')
  if (uniq.length === 1) return g(uniq[0])
  const [first, ...rest] = uniq
  return q(`Is it ${first}?`, g(first), chain(rest))
}

function uniq(...lists) {
  return [...new Set(lists.flat())]
}

// --- Expanded commons lists -------------------------------------------------

const SUPERHEROES = [
  'Batman', 'Black Panther', 'Captain America', 'Deadpool', 'Hulk', 'Iron Man',
  'Joker', 'Spider-Man', 'Superman', 'Thor', 'Wolverine', 'Wonder Woman',
  'Aquaman', 'Black Widow', 'Doctor Strange', 'Flash', 'Green Lantern',
  'Hawkeye', 'Scarlet Witch', 'Venom', 'Ant-Man', 'Captain Marvel',
]

const STAR_WARS = [
  'Baby Yoda', 'Chewbacca', 'Darth Vader', 'Han Solo', 'Luke Skywalker',
  'Princess Leia', 'Yoda', 'Obi-Wan Kenobi', 'R2-D2', 'C-3PO', 'Rey',
  'Kylo Ren', 'Boba Fett', 'Padmé Amidala',
]

const ANIMATED = [
  'Mickey Mouse', 'SpongeBob', 'Homer Simpson', 'Bugs Bunny', 'Pikachu',
  'Mario', 'Elsa', 'Shrek', 'Scooby-Doo', 'Bart Simpson', 'Donald Duck',
  'Goofy', 'Winnie the Pooh', 'Simba', 'Woody', 'Buzz Lightyear',
  'Minion', 'Hello Kitty', 'Sonic the Hedgehog', 'Goku', 'Naruto',
  'Ash Ketchum', 'Dora the Explorer', 'Peppa Pig', 'Bluey',
]

const OTHER_FICTION = [
  // Live-action / movie-TV characters not covered by superhero / Star Wars / animated
  'James Bond', 'Indiana Jones', 'Jack Sparrow', 'Luke Cage',
  'Tarzan', 'King Kong', 'Godzilla', 'John Wick', 'Neo', 'Trinity',
  'Ellen Ripley', 'Sarah Connor', 'Marty McFly', 'Doc Brown',
  'Forrest Gump', 'Tony Montana', 'The Terminator', 'Rocky Balboa',
  'Jason Bourne', 'Ethan Hunt', 'Lara Croft (movie)', 'Wonder Woman',
  'Moana', 'Mulan', 'Aladdin', 'Genie', 'Cinderella', 'Snow White',
  'Mary Poppins', 'Willy Wonka', 'E.T.', 'Gollum (movie)',
]

const JOBS = [
  'a teacher', 'a doctor', 'a firefighter', 'a police officer', 'a nurse',
  'a chef', 'a pilot', 'a soldier', 'a lawyer', 'an engineer', 'a farmer',
  'a waiter', 'a cashier', 'a construction worker', 'a dentist', 'a vet',
  'a scientist', 'an astronaut', 'a journalist', 'a librarian', 'a mechanic',
  'a plumber', 'an electrician', 'a carpenter', 'a barber', 'a hairdresser',
  'a mailman', 'a bus driver', 'a taxi driver', 'a truck driver',
  'a software developer', 'an artist', 'a musician', 'an actor', 'a dancer',
  'a photographer', 'a writer', 'a judge', 'a politician', 'a CEO',
  'a banker', 'an accountant', 'a realtor', 'a pharmacist', 'a paramedic',
  'a lifeguard', 'a coach', 'a referee', 'a security guard', 'a janitor',
]

const FAMOUS_PEOPLE = [
  'Albert Einstein', 'Marie Curie', 'Isaac Newton', 'Charles Darwin',
  'Leonardo da Vinci', 'Mozart', 'Beethoven', 'Shakespeare', 'Cleopatra',
  'Julius Caesar', 'Napoleon', 'George Washington', 'Abraham Lincoln',
  'Martin Luther King Jr.', 'Nelson Mandela', 'Mahatma Gandhi',
  'Queen Elizabeth II', 'Princess Diana', 'Marilyn Monroe', 'Elvis Presley',
  'Michael Jackson', 'Madonna', 'Beyoncé', 'Taylor Swift', 'Rihanna',
  'Drake', 'Ed Sheeran', 'The Beatles', 'Oprah Winfrey', 'Ellen DeGeneres',
  'Tom Hanks', 'Leonardo DiCaprio', 'Brad Pitt', 'Angelina Jolie',
  'Jennifer Lawrence', 'Dwayne Johnson', 'Will Smith', 'Chris Hemsworth',
  'Robert Downey Jr.', 'Scarlett Johansson', 'Meryl Streep',
  'Michael Jordan', 'LeBron James', 'Serena Williams', 'Tiger Woods',
  'Lionel Messi', 'Cristiano Ronaldo', 'Usain Bolt', 'Simone Biles',
  'Tom Brady', 'Babe Ruth', 'Muhammad Ali', 'Pelé',
  'Steve Jobs', 'Bill Gates', 'Elon Musk', 'Mark Zuckerberg',
  'Jeff Bezos', 'Oprah Winfrey', 'Barack Obama', 'Donald Trump',
  'Joe Biden', 'Kamala Harris', 'Vladimir Putin', 'Xi Jinping',
  'Pope Francis', 'Dalai Lama', 'Malala Yousafzai', 'Greta Thunberg',
  'Neil Armstrong', 'Amelia Earhart', 'Helen Keller', 'Anne Frank',
  'Frida Kahlo', 'Pablo Picasso', 'Vincent van Gogh', 'Andy Warhol',
  'Stephen Hawking', 'Nikola Tesla', 'Thomas Edison', 'Alexander Graham Bell',
  'Wright brothers', 'Rosa Parks', 'Harriet Tubman', 'Frederick Douglass',
  'Winston Churchill', 'Franklin D. Roosevelt', 'John F. Kennedy',
  'Theodore Roosevelt', 'Alexander the Great', 'Genghis Khan',
  'Joan of Arc', 'Socrates', 'Plato', 'Aristotle', 'Confucius',
  'Buddha', 'Jesus', 'Muhammad', 'Moses',
]

const WATER_MAMMALS = [
  'a dolphin', 'a manatee', 'an orca', 'an otter', 'a seal', 'a walrus',
  'a whale', 'a beluga', 'a narwhal', 'a sea lion', 'a porpoise',
]

const WATER_SHELL = [
  'a crab', 'a lobster', 'a shrimp', 'a snail', 'a turtle', 'a clam',
  'an oyster', 'a mussel', 'a crayfish', 'a hermit crab',
]

const WATER_OTHER = [
  'a shark', 'a clownfish', 'a goldfish', 'a jellyfish', 'an octopus',
  'a salmon', 'a seahorse', 'a starfish', 'a tuna', 'an eel', 'a ray',
  'a squid', 'a pufferfish', 'a swordfish', 'a catfish', 'a trout',
  'a bass', 'an angelfish', 'a barracuda', 'a stingray', 'a coral',
  'a sea cucumber', 'a sea urchin', 'a plankton',
]

const BIRDS_PREY = ['an eagle', 'a hawk', 'an owl', 'a falcon', 'a vulture', 'an osprey']
const BIRDS_FARM = ['a chicken', 'a turkey', 'a duck', 'a goose', 'a rooster', 'a hen']
const BIRDS_OTHER = [
  'a crow', 'a flamingo', 'a hummingbird', 'an ostrich', 'a parrot',
  'a peacock', 'a penguin', 'a pigeon', 'a robin', 'a sparrow', 'a swan',
  'a woodpecker', 'a pelican', 'a toucan', 'a seagull', 'a blue jay',
  'a cardinal', 'a raven', 'a canary', 'a dove', 'an emu', 'a kiwi bird',
  'a crane', 'a stork', 'a macaw', 'a cockatoo', 'a chickadee',
]

const FLYING_BUGS = [
  'a bat', 'a bee', 'a butterfly', 'a dragonfly', 'a ladybug', 'a mosquito',
  'a fly', 'a wasp', 'a moth', 'a firefly', 'a beetle', 'a grasshopper',
  'a cricket', 'a cicada', 'a hornet', 'a bumblebee',
]

const PETS = [
  'a cat', 'a dog', 'a hamster', 'a rabbit', 'a guinea pig', 'a ferret',
  'a gerbil', 'a goldfish', 'a parrot', 'a turtle', 'a lizard', 'a snake',
  'a mouse', 'a rat', 'a chinchilla', 'a hedgehog',
]

const FARM = [
  'a cow', 'a pig', 'a horse', 'a sheep', 'a goat', 'a donkey', 'a mule',
  'a pony', 'a llama', 'an alpaca', 'a chicken', 'a turkey', 'a duck',
  'a goose', 'a rooster',
]

const BIG_CATS = ['a lion', 'a tiger', 'a leopard', 'a cheetah', 'a jaguar', 'a cougar', 'a panther', 'a lynx']

const LAND_ANIMALS = [
  'an elephant', 'a giraffe', 'an ant', 'a bear', 'a crocodile', 'a deer',
  'a fox', 'a frog', 'a gorilla', 'a hippo', 'a kangaroo', 'a koala',
  'a lizard', 'a monkey', 'a panda', 'a rhino', 'a snake', 'a spider',
  'a wolf', 'a zebra', 'a camel', 'a moose', 'a bison', 'a buffalo',
  'a squirrel', 'a raccoon', 'a skunk', 'a beaver', 'a porcupine',
  'an armadillo', 'a chameleon', 'a scorpion', 'a worm', 'a slug',
  'a toad', 'a newt', 'a salamander', 'an iguana', 'a chimpanzee',
  'an orangutan', 'a baboon', 'a meerkat', 'a hyena', 'a warthog',
  'a wildebeest', 'an antelope', 'a gazelle', 'an elk', 'a reindeer',
  'a polar bear', 'a grizzly bear', 'a sloth', 'a tapir', 'a platypus',
  'a wombat', 'a tasmanian devil', 'a coyote', 'a bobcat', 'a badger',
  'a weasel', 'an opossum', 'a chipmunk', 'a groundhog', 'a prairie dog',
  'a mole', 'a shrew', 'a lemur', 'a gibbon', 'a mandrill',
  'an alligator', 'a komodo dragon', 'a gecko', 'a python', 'a cobra',
  'a rattlesnake', 'a centipede', 'a millipede', 'an earthworm',
  'a tarantula', 'a tick', 'a flea', 'a cockroach', 'a termite',
  'an antelope', 'a yak', 'a water buffalo', 'a boar', 'a wildcat',
]

const TREES = [
  'an apple tree', 'a cherry tree', 'a maple tree', 'an oak tree',
  'a palm tree', 'a pine tree', 'a redwood', 'a willow', 'a birch',
  'a cedar', 'an elm', 'a fir', 'a sequoia', 'a dogwood', 'a magnolia',
  'a baobab', 'a bonsai tree', 'a Christmas tree',
]

const FLOWERS = [
  'a daisy', 'a lavender', 'a lily', 'an orchid', 'a rose', 'a sunflower',
  'a tulip', 'a daisy', 'a carnation', 'a daisy', 'a dandelion',
  'a hibiscus', 'a jasmine', 'a marigold', 'a peony', 'a poppy',
  'a violet', 'a daisy', 'an iris', 'a chrysanthemum', 'a daffodil',
]

const OTHER_PLANTS = [
  'a bamboo', 'a cactus', 'a fern', 'a grass', 'a moss', 'a mushroom',
  'a tomato plant', 'ivy', 'a vine', 'seaweed', 'kelp', 'algae',
  'a shrub', 'a bush', 'a hedge', 'a bonsai', 'a succulent',
  'a Venus flytrap', 'a pitcher plant', 'clover', 'wheat', 'corn plant',
  'a pumpkin plant', 'a strawberry plant', 'basil', 'mint', 'rosemary',
]

const FLYING_VEHICLES = [
  'a helicopter', 'a drone', 'a rocket', 'a spaceship', 'a hot air balloon',
  'a fighter jet', 'a jet', 'an airplane', 'a blimp', 'a glider',
  'a seaplane', 'a parachute', 'a hang glider', 'a space shuttle',
]

const WATER_VEHICLES = [
  'a submarine', 'a canoe', 'a kayak', 'a sailboat', 'a cruise ship',
  'a ferry', 'a yacht', 'a speedboat', 'a rowboat', 'a raft',
  'an aircraft carrier', 'a battleship', 'a tugboat', 'a jet ski',
  'a paddleboard',
]

const LAND_VEHICLES = [
  'a car', 'a truck', 'a bus', 'a motorcycle', 'a bicycle', 'a scooter',
  'a train', 'a subway', 'a tram', 'an ambulance', 'a fire truck',
  'a police car', 'a taxi', 'a van', 'an SUV', 'a convertible',
  'a limousine', 'a race car', 'a Formula 1 car', 'a bulldozer',
  'a tractor', 'a tank', 'a skateboard', 'a golf cart', 'a forklift',
  'a dump truck', 'a cement mixer', 'a snowmobile', 'an ATV',
  'a Segway', 'a unicycle', 'a rickshaw', 'a horse carriage',
  'a school bus', 'a double-decker bus', 'a pickup truck',
]

const LANDMARKS = [
  'the Eiffel Tower', 'Big Ben', 'the Colosseum', 'Stonehenge',
  'Mount Rushmore', 'Taj Mahal', 'the Golden Gate Bridge', 'the Grand Canyon',
  'the Great Wall of China', 'the Pyramids of Giza', 'the Statue of Liberty',
  'the White House', 'the Empire State Building', 'Times Square',
  'Niagara Falls', 'Machu Picchu', 'Christ the Redeemer', 'Sydney Opera House',
  'Mount Everest', 'the Louvre', 'Buckingham Palace', 'the Pentagon',
  'Hollywood Sign', 'Space Needle', 'CN Tower', 'Burj Khalifa',
  'Angkor Wat', 'Petra', 'Chichen Itza', 'Stonehenge',
]

const HOMES = [
  'a cabin', 'a castle', 'a house', 'a tent', 'an apartment', 'a condo',
  'a mansion', 'a bungalow', 'a treehouse', 'an igloo', 'a yurt',
  'a mobile home', 'a dorm room', 'a penthouse',
]

const PLACES = [
  'a beach', 'a church', 'a city', 'a farm', 'a forest', 'a hospital',
  'a hotel', 'a library', 'a mountain', 'a park', 'a restaurant',
  'a school', 'a stadium', 'an airport', 'an ocean', 'a museum',
  'a zoo', 'a mall', 'a supermarket', 'a bank', 'a gym', 'a cinema',
  'a theater', 'a cemetery', 'a prison', 'a factory', 'a warehouse',
  'a bridge', 'a tunnel', 'a highway', 'a parking lot', 'a playground',
  'a lake', 'a river', 'a desert', 'an island', 'a cave', 'a volcano',
  'a waterfall', 'a canyon', 'a valley', 'a meadow', 'a swamp',
]

const FURNITURE = [
  'a bed', 'a blanket', 'a bookshelf', 'a chair', 'a couch', 'a desk',
  'a dresser', 'a lamp', 'a mattress', 'a mirror', 'a pillow', 'a rug',
  'a sofa', 'a stool', 'a table', 'a wardrobe', 'a nightstand',
  'a recliner', 'a rocking chair', 'a coffee table', 'a dining table',
  'curtains', 'a curtain', 'a shelf', 'a cabinet', 'a drawer',
]

const APPLIANCES_BIG = [
  'a refrigerator', 'a stove', 'an oven', 'a microwave', 'a dishwasher',
  'a washing machine', 'a dryer', 'a freezer', 'an air conditioner',
  'a furnace', 'a water heater', 'a vacuum cleaner',
]

const DRINKS = [
  'water', 'coffee', 'tea', 'milk', 'orange juice', 'apple juice',
  'soda', 'Coca-Cola', 'Pepsi', 'Sprite', 'lemonade', 'beer', 'wine',
  'champagne', 'whiskey', 'vodka', 'smoothie', 'milkshake', 'hot chocolate',
  'energy drink', 'sports drink', 'coconut water', 'iced tea', 'latte',
  'espresso', 'cappuccino', 'mocha', 'matcha', 'kombucha', 'root beer',
]

const FRUITS = [
  'an apple', 'a banana', 'an orange', 'a grape', 'a strawberry',
  'a watermelon', 'a pineapple', 'a mango', 'a peach', 'a pear',
  'a cherry', 'a blueberry', 'a raspberry', 'a blackberry', 'a kiwi',
  'a lemon', 'a lime', 'a grapefruit', 'a coconut', 'a papaya',
  'a pomegranate', 'a plum', 'an apricot', 'a cantaloupe', 'a honeydew',
  'a fig', 'a date', 'an avocado', 'a tomato', // botanical fruit
]

const VEGGIES = [
  'a carrot', 'broccoli', 'a potato', 'an onion', 'lettuce', 'spinach',
  'a cucumber', 'a pepper', 'a bell pepper', 'celery', 'corn', 'peas',
  'green beans', 'asparagus', 'cauliflower', 'cabbage', 'kale',
  'a radish', 'a beet', 'a turnip', 'a sweet potato', 'garlic',
  'ginger', 'mushrooms', 'zucchini', 'eggplant', 'squash',
]

const TAKEOUT = [
  'a pizza', 'a hamburger', 'a taco', 'a burrito', 'a hot dog',
  'french fries', 'chicken nuggets', 'a sandwich', 'a wrap',
  'fried chicken', 'a quesadilla', 'nachos', 'onion rings',
  'a smoothie bowl', 'poke bowl', 'ramen', 'pho',
]

const OTHER_FOOD = [
  'a salad', 'soup', 'pasta', 'sushi', 'a bagel', 'yogurt', 'cheese',
  'an egg', 'bread', 'popcorn', 'potato chips', 'cereal', 'rice',
  'steak', 'bacon', 'sausage', 'ham', 'turkey meat', 'chicken',
  'ice cream', 'a cookie', 'a cake', 'a cupcake', 'a brownie',
  'chocolate', 'candy', 'a donut', 'a muffin', 'a pancake', 'a waffle',
  'oatmeal', 'granola', 'butter', 'peanut butter', 'jelly', 'honey',
  'ketchup', 'mustard', 'mayonnaise', 'salsa', 'guacamole',
  'a burrito bowl', 'mac and cheese', 'lasagna', 'ravioli',
  'spaghetti', 'meatballs', 'a meatloaf', 'a casserole',
  'a pretzel', 'a cracker', 'a biscuit', 'a croissant', 'a baguette',
]

const ELECTRONICS_OTHER = [
  'headphones', 'earbuds', 'a camera', 'a charger', 'a game controller',
  'a keyboard', 'a computer mouse', 'a remote control', 'a smartwatch',
  'a printer', 'a monitor', 'a speaker', 'a TV', 'a router',
  'a USB drive', 'a power bank', 'a VR headset', 'a gaming console',
  'a PlayStation', 'an Xbox', 'a Nintendo Switch', 'an e-reader',
  'a Kindle', 'a battery',
  'a hard drive', 'a webcam', 'a microphone', 'a drone controller',
  'a fitness tracker', 'AirPods', 'a Bluetooth speaker',
  'a smart home hub', 'an Amazon Echo', 'a Google Nest',
]

const SCHOOL = [
  'a pen', 'a pencil', 'a backpack', 'a book', 'an eraser', 'a notebook',
  'scissors', 'a ruler', 'a stapler', 'a highlighter', 'a marker',
  'a crayon', 'glue', 'tape', 'a binder', 'a folder', 'a calculator',
  'a whiteboard', 'chalk', 'a pencil case', 'index cards',
]

const CLOTHING = [
  'sneakers', 'boots', 'sandals', 'glasses', 'a hat', 'a hoodie',
  'a jacket', 'jeans', 'pants', 'socks', 'a t-shirt', 'an umbrella',
  'a watch', 'a dress', 'a skirt', 'a sweater', 'a coat', 'a scarf',
  'gloves', 'a belt', 'a tie', 'a suit', 'shorts', 'pajamas',
  'underwear', 'a bra', 'a swimsuit', 'flip-flops', 'heels',
  'a purse', 'a wallet', 'jewelry', 'a necklace',
  'a ring', 'earrings', 'a bracelet', 'sunglasses', 'a beanie',
  'a baseball cap', 'a helmet', 'knee pads',
]

const SMALL_OBJECTS = [
  'a ball', 'a candle', 'a coin', 'a credit card', 'dice', 'a fork',
  'a key', 'a knife', 'a mug', 'playing cards', 'soap', 'a spoon',
  'a teddy bear', 'a toothbrush', 'a water bottle', 'a plate', 'a bowl',
  'a cup', 'a glass', 'a napkin', 'a towel', 'a sponge', 'a broom',
  'a dustpan', 'a hammer', 'a screwdriver', 'a nail', 'a screw',
  'a wrench', 'pliers', 'a saw', 'a drill', 'a ladder',
  'a flashlight', 'a lighter', 'a match', 'a lock', 'a padlock',
  'a suitcase', 'a suitcase', 'luggage', 'a pillowcase', 'a sheet',
  'a quilt', 'a tissues box', 'tissue', 'toilet paper',
  'shampoo', 'conditioner', 'toothpaste', 'deodorant', 'perfume',
  'lotion', 'sunscreen', 'a bandage', 'medicine', 'vitamins',
  'a phone case', 'a keychain', 'a sticker', 'a magnet', 'a rubber band',
  'a paperclip', 'a zipper', 'a button', 'a needle', 'thread',
  'yarn', 'a sewing machine', 'a clock', 'an alarm clock', 'a calendar',
  'a map', 'a compass', 'binoculars', 'a telescope', 'a microscope',
  'a board game', 'a puzzle', 'Lego', 'a doll', 'an action figure',
  'a Frisbee', 'a football', 'a basketball', 'a soccer ball',
  'a baseball', 'a tennis ball', 'a tennis racket', 'a baseball bat',
  'a golf club', 'a yoga mat', 'dumbbells', 'a jump rope',
]

// Deduplicate pets/farm overlaps carefully by category placement.
const PETS_ONLY = PETS.filter((n) => !['a goldfish', 'a parrot', 'a turtle', 'a lizard', 'a snake'].includes(n))
const FARM_ONLY = FARM.filter((n) => !['a chicken', 'a turkey', 'a duck', 'a goose', 'a rooster'].includes(n))

function buildSeed() {
  // --- Living / person / fictional ---
  const superheroes = alpha(SUPERHEROES)
  const starWars = alpha(STAR_WARS)
  const animated = alpha(ANIMATED)
  const otherFiction = alpha(uniq(OTHER_FICTION).filter((n) => !SUPERHEROES.includes(n) && !STAR_WARS.includes(n) && !ANIMATED.includes(n)))

  const moviesTv = q(
    'From movies or TV?',
    q(
      'Superhero or comic character?',
      superheroes,
      q('Star Wars?', starWars, q('Animated / Disney / cartoon?', animated, otherFiction)),
    ),
    q(
      'From a book, myth, or video game?',
      alpha(uniq(
        'Harry Potter', 'Hermione Granger', 'Frodo', 'Gandalf', 'Voldemort',
        'Sherlock Holmes', 'Robin Hood', 'King Arthur', 'Merlin', 'Peter Pan',
        'Tinker Bell', 'Cupid', 'Santa Claus', 'Easter Bunny', 'Tooth Fairy',
        'The Grinch', 'Link', 'Zelda', 'Master Chief', 'Kratos', 'Lara Croft',
        'Pac-Man', 'Kirby', 'Donkey Kong', 'Luigi', 'Princess Peach',
        'Cloud Strife', 'Sephiroth', 'Geralt of Rivia', 'Aloy',
        'Percy Jackson', 'Katniss Everdeen', 'Bilbo Baggins', 'Aragorn',
        'Legolas', 'Gollum', 'Aslan', 'Lucy Pevensie', 'Alice in Wonderland',
        'Dorothy Gale', 'Scarecrow', 'Tin Man', 'Cowardly Lion', 'Wicked Witch',
        'Dracula', 'Frankenstein', 'Werewolf', 'Mummy', 'Zeus', 'Hera',
        'Poseidon', 'Hades', 'Athena', 'Apollo', 'Thor (mythology)', 'Odin',
        'Loki (mythology)', 'Hercules', 'Medusa', 'Pegasus', 'Phoenix',
        'Dragon', 'Unicorn', 'Mermaid', 'Vampire', 'Zombie', 'Ghost',
        'Fairy', 'Elf', 'Dwarf', 'Orc', 'Goblin', 'Troll', 'Wizard', 'Witch',
      ).filter((n) => !SUPERHEROES.includes(n) && !STAR_WARS.includes(n) && !ANIMATED.includes(n))),
      alpha(['a mascot', 'a meme character', 'an OC / original character', 'a cryptid', 'Bigfoot', 'the Loch Ness Monster', 'a superhero sidekick']),
    ),
  )

  // Occupation before famous person (seed v7+ rule)
  const jobs = alpha(JOBS)
  const famous = alpha(uniq(FAMOUS_PEOPLE))
  const realPerson = q(
    'Is it mainly a job or occupation (like teacher, doctor, firefighter)?',
    jobs,
    q('Is it a famous real person?', famous, alpha(['a baby', 'a child', 'a teenager', 'an adult', 'an elderly person', 'a twin', 'a neighbor', 'a stranger'])),
  )

  const person = q('Is it a fictional character?', moviesTv, realPerson)

  // --- Animals ---
  const water = q(
    'Does it live mostly in water?',
    q(
      'Mammal?',
      alpha(WATER_MAMMALS),
      q('Hard shell?', alpha(WATER_SHELL), alpha(WATER_OTHER)),
    ),
    q(
      'Can it fly?',
      q(
        'Bird?',
        q('Bird of prey?', alpha(BIRDS_PREY), q('Farm bird?', alpha(BIRDS_FARM), alpha(BIRDS_OTHER))),
        alpha(FLYING_BUGS),
      ),
      q(
        'Common pet?',
        q('Cat?', g('a cat'), q('Dog?', g('a dog'), alpha(PETS_ONLY.filter((n) => n !== 'a cat' && n !== 'a dog')))),
        q(
          'Farm animal?',
          alpha(FARM_ONLY),
          q('Big cat?', alpha(BIG_CATS), alpha(LAND_ANIMALS.filter((n) => !BIG_CATS.includes(n)))),
        ),
      ),
    ),
  )

  const plants = q(
    'Is it a plant?',
    q('Tree?', alpha(TREES), q('Flower?', alpha(FLOWERS), alpha(OTHER_PLANTS))),
    g('a bacterium'),
  )

  const living = q(
    'Is it a person (real or fictional)?',
    person,
    q('Is it an animal?', water, plants),
  )

  // --- Non-living ---
  const flyingVeh = alpha(FLYING_VEHICLES)
  const waterVeh = alpha(WATER_VEHICLES)
  const landVeh = alpha(LAND_VEHICLES)
  const vehicles = q('Vehicle?', q('Does it fly?', flyingVeh, q('Does it go on water?', waterVeh, landVeh)), null)

  const landmarks = alpha(LANDMARKS)
  const homes = alpha(HOMES)
  const places = alpha(PLACES)
  const furniture = alpha(FURNITURE)
  const bigAppliances = alpha(APPLIANCES_BIG)

  const buildings = q(
    'Building, landmark, or place?',
    q('Famous landmark?', landmarks, q('Home / dwelling?', homes, places)),
    q('Furniture?', furniture, q('Large appliance?', bigAppliances, alpha(['a statue', 'a fountain', 'a billboard', 'a satellite dish', 'a solar panel', 'a wind turbine', 'a generator', 'a vending machine', 'an ATM', 'a traffic light', 'a streetlight', 'a fire hydrant']))),
  )

  // Fix vehicles q — need both branches
  const bigNonLiving = q(
    'Is it bigger than a breadbox?',
    q(
      'Vehicle?',
      q('Does it fly?', flyingVeh, q('Does it go on water?', waterVeh, landVeh)),
      buildings,
    ),
    null, // filled below
  )

  // Food / drink / electronics / small
  const drinks = alpha(DRINKS)
  const fruits = alpha(FRUITS)
  const veggies = alpha(VEGGIES)
  const takeout = alpha(TAKEOUT)
  const otherFood = alpha(OTHER_FOOD)

  const foodDrink = q(
    'Food or drink?',
    q(
      'Drink?',
      drinks,
      q(
        'Fruit or vegetable?',
        q('Fruit?', fruits, veggies),
        q(
          'Pizza, burger, taco, or similar takeout?',
          takeout,
          otherFood,
        ),
      ),
    ),
    null, // electronics+
  )

  // COMPUTER PATH — keep exact question wording for QA
  const computerBranch = q(
    'Is it a computer (laptop, desktop, or PC)?',
    q(
      'Laptop?',
      g('a laptop'),
      q('Desktop / PC?', g('a computer'), g('a tablet')),
    ),
    q(
      'Headphones or earbuds?',
      q('Headphones (over-ear)?', g('headphones'), g('earbuds')),
      alpha(ELECTRONICS_OTHER.filter((n) => n !== 'headphones' && n !== 'earbuds')),
    ),
  )

  const electronics = q(
    'Electronic?',
    q('Phone / smartphone?', g('a smartphone'), computerBranch),
    q(
      'Writing or school supply?',
      alpha(SCHOOL),
      q(
        'Clothing you wear?',
        alpha(CLOTHING),
        alpha(SMALL_OBJECTS),
      ),
    ),
  )

  foodDrink.no = electronics
  bigNonLiving.no = foodDrink

  return q("Is it a living thing?", living, bigNonLiving)
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

function findPath(n, target, path = []) {
  if (n.kind === 'guess') return n.name === target ? path : null
  return (
    findPath(n.yes, target, [...path, `Y:${n.text}`]) ??
    findPath(n.no, target, [...path, `N:${n.text}`])
  )
}

const seed = buildSeed()
const leaves = countLeaves(seed)
const depth = maxDepth(seed)
const computerPath = findPath(seed, 'a computer')

if (!computerPath) {
  console.error('FATAL: computer leaf missing')
  process.exit(1)
}
if (depth > 20) {
  console.error('FATAL: max depth', depth, '> 20')
  process.exit(1)
}

console.log({ leaves, maxDepth: depth, computerDepth: computerPath.length })
console.log(computerPath.join('\n'))

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
export const STORAGE_KEY = 'twentyq-tree-v8'
export const MAX_QUESTIONS = 20

/** Bump this whenever the seeded question order/content changes. */
export const SEED_VERSION = 8
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

/** Seed v8: expanded commons; live path has no model fallback. */
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
console.log('Wrote src/tree.ts')
