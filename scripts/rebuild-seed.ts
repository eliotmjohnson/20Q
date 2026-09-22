import fs from 'node:fs'
import { seedTree, type TreeNode } from '../src/tree.ts'

function isAlpha(text: string) {
  return /come before|alphabetically/i.test(text)
}

function collectLeaves(n: TreeNode): string[] {
  if (n.kind === 'guess') return [n.name]
  return [...collectLeaves(n.yes), ...collectLeaves(n.no)]
}

function unique(names: string[]): string[] {
  return [...new Set(names)]
}

function formatOr(names: string[]): string {
  if (names.length === 1) return names[0]!
  if (names.length === 2) return `${names[0]} or ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, or ${names[names.length - 1]}`
}

function groupQuestion(yesGroup: string[]): string {
  if (yesGroup.length <= 4) {
    return `Is it ${formatOr(yesGroup)}?`
  }
  const sample = yesGroup.slice(0, 3)
  return `Is it ${formatOr(sample)}, or something else in that same bunch (${yesGroup.length} options)?`
}

/** Balanced rebuild — never alphabet order. Depth ~ log2(n). */
function buildFromNames(names: string[]): TreeNode {
  const list = unique(names)
  if (list.length === 0) return { kind: 'guess', name: 'something else' }
  if (list.length === 1) return { kind: 'guess', name: list[0]! }
  if (list.length === 2) {
    return {
      kind: 'question',
      text: `Is it ${list[0]}?`,
      yes: { kind: 'guess', name: list[0]! },
      no: { kind: 'guess', name: list[1]! },
    }
  }

  // Prefer a meaningful split when it is reasonably balanced (30/70+)
  const multi = list.filter((n) => n.trim().split(/\s+/).length > 1)
  const single = list.filter((n) => n.trim().split(/\s+/).length <= 1)
  const balanced =
    multi.length > 0 &&
    single.length > 0 &&
    multi.length / list.length >= 0.3 &&
    single.length / list.length >= 0.3
  if (balanced) {
    return {
      kind: 'question',
      text: 'Does its name have more than one word?',
      yes: buildFromNames(multi),
      no: buildFromNames(single),
    }
  }

  // Stable order for deterministic trees, but question text does not say "alphabet"
  const sorted = [...list].sort((a, b) => a.localeCompare(b))
  const mid = Math.ceil(sorted.length / 2)
  const left = sorted.slice(0, mid)
  const right = sorted.slice(mid)
  return {
    kind: 'question',
    text: groupQuestion(left),
    yes: buildFromNames(left),
    no: buildFromNames(right),
  }
}

function transform(n: TreeNode): TreeNode {
  if (n.kind === 'guess') return { kind: 'guess', name: n.name }
  if (isAlpha(n.text)) {
    return buildFromNames(collectLeaves(n))
  }
  return {
    kind: 'question',
    text: n.text,
    yes: transform(n.yes),
    no: transform(n.no),
  }
}

function emit(n: TreeNode, indent: number): string {
  const pad = ' '.repeat(indent)
  if (n.kind === 'guess') {
    return `${pad}{ kind: 'guess', name: ${JSON.stringify(n.name)} }`
  }
  return (
    `${pad}{\n` +
    `${pad}  kind: 'question',\n` +
    `${pad}  text: ${JSON.stringify(n.text)},\n` +
    `${pad}  yes: ${emit(n.yes, indent + 2).trimStart()},\n` +
    `${pad}  no: ${emit(n.no, indent + 2).trimStart()},\n` +
    `${pad}}`
  )
}

function countAlpha(n: TreeNode): number {
  if (n.kind === 'guess') return 0
  return (isAlpha(n.text) ? 1 : 0) + countAlpha(n.yes) + countAlpha(n.no)
}

function countLeaves(n: TreeNode): number {
  if (n.kind === 'guess') return 1
  return countLeaves(n.yes) + countLeaves(n.no)
}

function maxDepth(n: TreeNode): number {
  if (n.kind === 'guess') return 0
  return 1 + Math.max(maxDepth(n.yes), maxDepth(n.no))
}

const next = transform(seedTree)
console.log(
  JSON.stringify({
    beforeAlpha: countAlpha(seedTree),
    afterAlpha: countAlpha(next),
    leaves: countLeaves(next),
    maxDepth: maxDepth(next),
  }),
)

const orig = fs.readFileSync('src/tree.ts', 'utf8')
const header = orig
  .split('export const seedTree')[0]!
  .replace(/SEED_VERSION = \d+/, 'SEED_VERSION = 11')
  .replace(/twentyq-tree-v\d+/g, 'twentyq-tree-v11')

const afterSeed = orig.split(/^export function cloneTree/m)
if (afterSeed.length < 2) throw new Error('cloneTree not found')
const rest = 'export function cloneTree' + afterSeed[1]

const out =
  header +
  '/** Seed v11: alphabet / comes-before questions removed; balanced group splits. */\n' +
  'export const seedTree: TreeNode = ' +
  emit(next, 0) +
  '\n\n' +
  rest
fs.writeFileSync('src/tree.ts', out)
console.log('wrote', fs.statSync('src/tree.ts').size)
