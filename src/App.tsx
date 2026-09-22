import { useEffect, useMemo, useState } from 'react'
import {
  MAX_QUESTIONS,
  type TreeNode,
  clearSession,
  learn,
  loadSession,
  loadTree,
  saveSession,
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

function nodeAt(tree: TreeNode, path: Array<'yes' | 'no'>): TreeNode {
  let n = tree
  for (const step of path) {
    if (n.kind !== 'question') break
    n = n[step]
  }
  return n
}

function restorePhase(raw: string | undefined): Phase {
  if (!raw) return 'start'
  // Stale sessions may still have model-loading from older builds.
  if (raw === 'model-loading') return 'guess'
  const allowed: Phase[] = [
    'start',
    'ask',
    'guess',
    'win',
    'learn-what',
    'learn-question',
    'learn-side',
    'give-up',
    'learned',
  ]
  return (allowed as string[]).includes(raw) ? (raw as Phase) : 'start'
}

export default function App() {
  const [tree, setTree] = useState<TreeNode>(() => loadTree())
  const [path, setPath] = useState<Array<'yes' | 'no'>>(() => loadSession()?.path ?? [])
  const [count, setCount] = useState(() => loadSession()?.count ?? 0)
  const [phase, setPhase] = useState<Phase>(() => restorePhase(loadSession()?.phase))
  const [correctName, setCorrectName] = useState(() => loadSession()?.correctName ?? '')
  const [distQ, setDistQ] = useState(() => loadSession()?.distQ ?? '')
  const [lastGuess, setLastGuess] = useState(() => loadSession()?.lastGuess ?? '')
  const [node, setNode] = useState<TreeNode>(() => {
    const t = loadTree()
    const s = loadSession()
    return s ? nodeAt(t, s.path) : t
  })

  const remaining = MAX_QUESTIONS - count

  // Persist mid-game so refresh resumes — but only for the current seed version.
  useEffect(() => {
    if (phase === 'start') {
      clearSession()
      return
    }
    saveSession({
      seedVersion: 0, // overwritten inside saveSession
      phase,
      path,
      count,
      correctName,
      distQ,
      lastGuess,
    })
  }, [phase, path, count, correctName, distQ, lastGuess])

  const start = () => {
    clearSession()
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
      if (nextCount >= MAX_QUESTIONS) {
        setCount(nextCount)
        setPhase('give-up')
        return
      }
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
    // Wrong leaf → give-up / learn as last resort. No model on live.
    setPhase('give-up')
  }

  const submitWhat = () => {
    if (!correctName.trim()) return
    setPhase('learn-question')
  }

  const submitQuestion = () => {
    if (!distQ.trim()) return
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

  const showAskUi = phase === 'ask'
  const showGuessUi = phase === 'guess'
  const counterLabel =
    phase === 'ask' || phase === 'guess'
      ? `Q ${Math.min(count + (phase === 'guess' ? 0 : 1), MAX_QUESTIONS)} / ${MAX_QUESTIONS}`
      : `${count} asked`

  return (
    <div className="app">
      <header className="top">
        <div className="brand">20Q</div>
        {phase !== 'start' && (
          <div className="meta" aria-live="polite">
            {counterLabel}
          </div>
        )}
      </header>

      <main className="stage">
        {phase === 'start' && (
          <>
            <p className="eyebrow">20 Questions</p>
            <h1>Think of anything.</h1>
            <p className="sub">
              Animals, objects, people — I&apos;ll try to nail it in {MAX_QUESTIONS} yes/no questions.
              No account. Built for your phone.
            </p>
            <ol className="howto">
              <li>Think of something</li>
              <li>Answer Yes, No, or Maybe</li>
              <li>I&apos;ll take a guess</li>
            </ol>
            <button type="button" className="btn primary big" onClick={start}>
              Play
            </button>
          </>
        )}

        {showAskUi && (
          <>
            <div className="progress" aria-hidden="true">
              <div
                className="progress-bar"
                style={{ width: `${(Math.min(count + 1, MAX_QUESTIONS) / MAX_QUESTIONS) * 100}%` }}
              />
            </div>
            <p className="label">
              {`Question ${Math.min(count + 1, MAX_QUESTIONS)} of ${MAX_QUESTIONS}`}
            </p>
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

        {showGuessUi && (
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
            <p className="celebrate" aria-hidden="true">
              🎉
            </p>
            <h1>Nailed it!</h1>
            <p className="sub">
              You were thinking of <strong>{lastGuess}</strong> — got it in {count} question
              {count === 1 ? '' : 's'}.
            </p>
            <button type="button" className="btn primary big" onClick={start}>
              Play again
            </button>
          </>
        )}

        {phase === 'give-up' && (
          <>
            <h1>I give up.</h1>
            <p className="sub">
              {lastGuess ? (
                <>
                  I was stuck after thinking it might be <strong>{lastGuess}</strong>.
                </>
              ) : (
                <>I couldn&apos;t pin it down in {MAX_QUESTIONS} questions.</>
              )}
            </p>
            <button type="button" className="btn primary big" onClick={start}>
              Play again
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                setLastGuess(lastGuess || 'my last guess')
                setPhase('learn-what')
              }}
            >
              Teach me for next time
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
            <button
              type="button"
              className="btn primary big"
              onClick={submitWhat}
              disabled={!correctName.trim()}
            >
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
            <button
              type="button"
              className="btn primary big"
              onClick={submitQuestion}
              disabled={!distQ.trim()}
            >
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
            <h1>Thanks — noted.</h1>
            <p className="sub">
              I&apos;ll remember <strong>{correctName.trim()}</strong> on this phone for next time.
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
