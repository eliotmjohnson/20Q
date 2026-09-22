import { useCallback, useMemo, useState } from 'react'
import {
  MAX_QUESTIONS,
  type TreeNode,
  learn,
  loadTree,
  saveTree,
} from './tree'
import './App.css'

type Phase =
  | 'start'
  | 'ask'
  | 'guess'
  | 'win'
  | 'learn-what'
  | 'learn-question'
  | 'learn-side'
  | 'give-up'
  | 'learned'

type Answer = 'yes' | 'no' | 'maybe'

export default function App() {
  const [tree, setTree] = useState<TreeNode>(() => loadTree())
  const [node, setNode] = useState<TreeNode>(() => loadTree())
  const [path, setPath] = useState<Array<'yes' | 'no'>>([])
  const [count, setCount] = useState(0)
  const [phase, setPhase] = useState<Phase>('start')
  const [correctName, setCorrectName] = useState('')
  const [distQ, setDistQ] = useState('')
  const [lastGuess, setLastGuess] = useState('')

  const remaining = MAX_QUESTIONS - count

  const reset = useCallback(() => {
    const t = loadTree()
    setTree(t)
    setNode(t)
    setPath([])
    setCount(0)
    setPhase('start')
    setCorrectName('')
    setDistQ('')
    setLastGuess('')
  }, [])

  const start = () => {
    const t = loadTree()
    setTree(t)
    setNode(t)
    setPath([])
    setCount(0)
    setCorrectName('')
    setDistQ('')
    setLastGuess('')
    if (t.kind === 'guess') {
      setLastGuess(t.name)
      setPhase('guess')
    } else {
      setPhase('ask')
    }
  }

  const goTo = (next: TreeNode, step: 'yes' | 'no', nextCount: number) => {
    const nextPath = [...path, step]
    setPath(nextPath)
    setCount(nextCount)
    setNode(next)

    if (next.kind === 'guess') {
      setLastGuess(next.name)
      setPhase('guess')
      return
    }
    if (nextCount >= MAX_QUESTIONS) {
      setPhase('give-up')
      return
    }
    setPhase('ask')
  }

  const answer = (a: Answer) => {
    if (node.kind !== 'question') return
    const nextCount = count + 1

    if (a === 'maybe') {
      // Prefer the yes branch but still burn a question
      if (nextCount >= MAX_QUESTIONS) {
        setCount(nextCount)
        setPhase('give-up')
        return
      }
      // Soft lean: treat as yes for navigation
      goTo(node.yes, 'yes', nextCount)
      return
    }

    if (nextCount >= MAX_QUESTIONS && node[a].kind === 'question') {
      setCount(nextCount)
      setPath([...path, a])
      setNode(node[a])
      setPhase('give-up')
      return
    }

    goTo(node[a], a, nextCount)
  }

  const confirmGuess = (yes: boolean) => {
    if (yes) {
      setPhase('win')
      return
    }
    // Miss — learn if we have room conceptually, always offer learn
    setPhase('learn-what')
  }

  const submitWhat = () => {
    const name = correctName.trim()
    if (!name) return
    setPhase('learn-question')
  }

  const submitQuestion = () => {
    const q = distQ.trim()
    if (!q) return
    setPhase('learn-side')
  }

  const finishLearn = (correctAnswersYes: boolean) => {
    const updated = learn(
      tree,
      path,
      lastGuess || 'something else',
      correctName.trim(),
      distQ.trim().endsWith('?') ? distQ.trim() : `${distQ.trim()}?`,
      correctAnswersYes,
    )
    saveTree(updated)
    setTree(updated)
    setPhase('learned')
  }

  const questionText = useMemo(() => {
    if (node.kind === 'question') return node.text
    return ''
  }, [node])

  return (
    <div className="app">
      <header className="top">
        <div className="brand">20Q</div>
        {phase !== 'start' && (
          <div className="meta" aria-live="polite">
            {phase === 'ask' || phase === 'guess'
              ? `Q ${Math.min(count + (phase === 'guess' ? 0 : 1), MAX_QUESTIONS)} / ${MAX_QUESTIONS}`
              : `${count} asked`}
          </div>
        )}
      </header>

      <main className="stage">
        {phase === 'start' && (
          <>
            <h1>Think of anything.</h1>
            <p className="sub">
              I&apos;ll try to guess it in {MAX_QUESTIONS} yes/no questions.
              No account. Works on your phone.
            </p>
            <button type="button" className="btn primary big" onClick={start}>
              I&apos;m thinking of something
            </button>
          </>
        )}

        {phase === 'ask' && (
          <>
            <p className="label">Question</p>
            <h1 className="prompt">{questionText}</h1>
            <p className="hint">{remaining} left after this</p>
            <div className="actions">
              <button type="button" className="btn yes" onClick={() => answer('yes')}>
                Yes
              </button>
              <button type="button" className="btn no" onClick={() => answer('no')}>
                No
              </button>
              <button type="button" className="btn maybe" onClick={() => answer('maybe')}>
                Maybe / Don&apos;t know
              </button>
            </div>
          </>
        )}

        {phase === 'guess' && (
          <>
            <p className="label">My guess</p>
            <h1 className="prompt">Are you thinking of {lastGuess}?</h1>
            <div className="actions">
              <button type="button" className="btn yes" onClick={() => confirmGuess(true)}>
                Yes!
              </button>
              <button type="button" className="btn no" onClick={() => confirmGuess(false)}>
                No
              </button>
            </div>
          </>
        )}

        {phase === 'win' && (
          <>
            <h1>Got it!</h1>
            <p className="sub">
              {lastGuess} in {count} question{count === 1 ? '' : 's'}.
            </p>
            <button type="button" className="btn primary big" onClick={start}>
              Play again
            </button>
          </>
        )}

        {phase === 'give-up' && (
          <>
            <h1>Out of questions</h1>
            <p className="sub">Teach me what you were thinking so I get better.</p>
            <button
              type="button"
              className="btn primary big"
              onClick={() => {
                setLastGuess(lastGuess || 'my last guess')
                setPhase('learn-what')
              }}
            >
              Teach me
            </button>
            <button type="button" className="btn ghost" onClick={reset}>
              Start over
            </button>
          </>
        )}

        {phase === 'learn-what' && (
          <>
            <h1>What were you thinking of?</h1>
            <input
              className="field"
              value={correctName}
              onChange={(e) => setCorrectName(e.target.value)}
              placeholder="e.g. a giraffe"
              autoCapitalize="sentences"
              enterKeyHint="done"
              onKeyDown={(e) => e.key === 'Enter' && submitWhat()}
            />
            <button type="button" className="btn primary big" onClick={submitWhat} disabled={!correctName.trim()}>
              Next
            </button>
          </>
        )}

        {phase === 'learn-question' && (
          <>
            <h1>One question to tell them apart</h1>
            <p className="sub">
              A yes/no question where <strong>{correctName.trim()}</strong> and{' '}
              <strong>{lastGuess}</strong> answer differently.
            </p>
            <input
              className="field"
              value={distQ}
              onChange={(e) => setDistQ(e.target.value)}
              placeholder="e.g. Does it have a long neck?"
              enterKeyHint="done"
              onKeyDown={(e) => e.key === 'Enter' && submitQuestion()}
            />
            <button type="button" className="btn primary big" onClick={submitQuestion} disabled={!distQ.trim()}>
              Next
            </button>
          </>
        )}

        {phase === 'learn-side' && (
          <>
            <h1>{distQ.trim().endsWith('?') ? distQ.trim() : `${distQ.trim()}?`}</h1>
            <p className="sub">
              For <strong>{correctName.trim()}</strong>, is the answer Yes or No?
            </p>
            <div className="actions">
              <button type="button" className="btn yes" onClick={() => finishLearn(true)}>
                Yes
              </button>
              <button type="button" className="btn no" onClick={() => finishLearn(false)}>
                No
              </button>
            </div>
          </>
        )}

        {phase === 'learned' && (
          <>
            <h1>Got it — I&apos;ll remember.</h1>
            <p className="sub">
              Next time someone thinks of {correctName.trim()}, I can ask about it.
              Survives a refresh on this phone.
            </p>
            <button type="button" className="btn primary big" onClick={start}>
              Play again
            </button>
          </>
        )}
      </main>
    </div>
  )
}
