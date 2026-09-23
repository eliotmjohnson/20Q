/**
 * Audit seedTree: mid-tree questions must be attributes (no name guesses / fingerprints).
 * Run: npx tsx scripts/rebuild-seed.ts
 */
import { seedTree, type TreeNode } from '../src/tree.ts'

function collectLeaves(n: TreeNode, out: string[] = []): string[] {
  if (n.kind === 'guess') {
    out.push(n.name)
    return out
  }
  collectLeaves(n.yes, out)
  collectLeaves(n.no, out)
  return out
}

function countLeaves(n: TreeNode): number {
  if (n.kind === 'guess') return 1
  return countLeaves(n.yes) + countLeaves(n.no)
}

function findPath(n: TreeNode, target: string, path: string[] = []): string[] | null {
  if (n.kind === 'guess') return n.name === target ? path : null
  return (
    findPath(n.yes, target, [...path, `Y:${n.text}`]) ??
    findPath(n.no, target, [...path, `N:${n.text}`])
  )
}

function audit(seed: TreeNode) {
  const leaves = collectLeaves(seed)
  const leafSet = new Set(leaves.map((n) => n.toLowerCase()))
  const bare = new Set<string>()
  for (const n of leaves) {
    bare.add(n.toLowerCase())
    bare.add(n.toLowerCase().replace(/^(a|an|the)\s+/, ''))
  }
  const bad: Array<{ text: string; reason: string }> = []
  const walk = (node: TreeNode) => {
    if (node.kind === 'guess') return
    const t = node.text
    if (/same bunch|\d+\s*options/i.test(t)) bad.push({ text: t, reason: 'group-list' })
    if (/come before|alphabetically/i.test(t)) bad.push({ text: t, reason: 'alphabet' })
    if (/known for/i.test(t)) bad.push({ text: t, reason: 'known-for' })
    if (/handheld slab|re-recording/i.test(t)) bad.push({ text: t, reason: 'banned-phrase' })
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
    // Flag unique proper nouns that match a leaf (celebrity/species fingerprint risk)
    const caps = t.match(/\b[A-Z][a-zA-Z'-]{2,}\b/g) || []
    const allow = new Set([
      'Is', 'Does', 'Do', 'Can', 'Are', 'Was', 'Were', 'Has', 'Have', 'From', 'The',
      'Typically', 'Usually', 'Primarily', 'Often', 'Associated', 'Among', 'Works',
      'Marvel', 'Star', 'Wars', 'Disney', 'Pixar', 'Greek', 'Force', 'Christmas',
      'Harry', 'Potter', 'Simpsons', 'American', 'Mainly', 'Commonly',
    ])
    for (const c of caps) {
      if (allow.has(c)) continue
      const cl = c.toLowerCase()
      for (const leaf of leafSet) {
        if (leaf.includes(cl) && cl.length >= 4) {
          bad.push({ text: t, reason: 'proper-noun-leaf' })
        }
      }
    }
    walk(node.yes)
    walk(node.no)
  }
  walk(seed)
  return bad
}

const bad = audit(seedTree)
console.log({ leaves: countLeaves(seedTree), violations: bad.length })
for (const t of [
  'a computer', 'a smartphone', 'a laptop', 'a tablet', 'a dog', 'a cat',
  'a light switch', 'a light bulb', 'an outlet', 'a doorknob', 'a remote control',
]) {
  const p = findPath(seedTree, t)
  console.log(t, p ? `(${p.length}q) ` + p.join(' → ') : 'MISSING')
}
if (bad.length) {
  for (const b of bad.slice(0, 40)) console.error(b.reason, b.text)
  process.exit(1)
}
console.log('OK: attribute-only seed')
