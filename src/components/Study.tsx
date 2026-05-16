import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Card, Deck } from '../types'
import { CardFace } from './CardFace'

interface Props {
  deck: Deck
  onExit: () => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface Session {
  queue: Card[]
  retry: Card[]
  pass: number
  total: number
  firstTryRight: number
  /** IDs of cards that have been answered wrong at least once. */
  wrongOnce: Set<string>
}

function newSession(deck: Deck, shuffled: boolean): Session {
  const cards = shuffled ? shuffle(deck.cards) : deck.cards.slice()
  return {
    queue: cards,
    retry: [],
    pass: 1,
    total: cards.length,
    firstTryRight: 0,
    wrongOnce: new Set(),
  }
}

export function Study({ deck, onExit }: Props) {
  const [shuffled, setShuffled] = useState(true)
  const [session, setSession] = useState<Session>(() => newSession(deck, true))
  const [flipped, setFlipped] = useState(false)

  // Reset whenever the user toggles shuffle or the deck changes.
  useEffect(() => {
    setSession(newSession(deck, shuffled))
    setFlipped(false)
  }, [deck, shuffled])

  const card = session.queue[0]
  const done = !card
  const mastered = useMemo(
    () => session.total - (session.queue.length + session.retry.length),
    [session],
  )
  // 1-indexed position within the current pass (pass 1 only).
  const positionInPass =
    session.pass === 1 ? session.total - session.queue.length + 1 : null
  const remaining = session.queue.length + session.retry.length

  const answer = useCallback((knew: boolean) => {
    setSession((s) => {
      const [cur, ...rest] = s.queue
      if (!cur) return s
      let queue = rest
      let retry = s.retry
      let firstTryRight = s.firstTryRight
      let wrongOnce = s.wrongOnce
      if (knew) {
        if (s.pass === 1 && !wrongOnce.has(cur.id)) firstTryRight += 1
      } else {
        wrongOnce = new Set(wrongOnce)
        wrongOnce.add(cur.id)
        retry = [...retry, cur]
      }
      let pass = s.pass
      if (queue.length === 0 && retry.length > 0) {
        queue = shuffle(retry)
        retry = []
        pass += 1
      }
      return { ...s, queue, retry, pass, firstTryRight, wrongOnce }
    })
    setFlipped(false)
  }, [])

  function restart() {
    setSession(newSession(deck, shuffled))
    setFlipped(false)
  }

  // Keyboard shortcuts
  const flippedRef = useRef(flipped)
  flippedRef.current = flipped
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (done) {
        if (e.key === 'Enter') restart()
        else if (e.key === 'Escape') onExit()
        return
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (e.key === 'Escape') {
        onExit()
      } else if (flippedRef.current) {
        if (e.key === '1' || e.key === 'ArrowLeft') answer(false)
        else if (e.key === '2' || e.key === 'ArrowRight') answer(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  if (deck.cards.length === 0) {
    return (
      <div className="screen">
        <header className="topbar">
          <button className="icon-btn" onClick={onExit}>
            ←
          </button>
          <h1>Studio</h1>
          <span />
        </header>
        <main className="content">
          <p className="empty">Mazzo vuoto.</p>
        </main>
      </div>
    )
  }

  if (done) {
    const accuracy = Math.round((session.firstTryRight / session.total) * 100)
    return (
      <div className="screen">
        <header className="topbar">
          <button className="icon-btn" onClick={onExit} aria-label="Esci">
            ←
          </button>
          <h1>Risultato</h1>
          <span />
        </header>
        <main className="content result">
          <div className="result__big">🎉</div>
          <div className="result__title">Mazzo completato</div>
          <div className="result__score">{accuracy}%</div>
          <div className="result__stats">
            <div>
              <strong>{session.firstTryRight}</strong>/<span>{session.total}</span>{' '}
              al primo colpo
            </div>
            <div>
              {session.wrongOnce.size > 0
                ? `Hai ripassato ${session.wrongOnce.size} card sbagliate`
                : 'Nessun errore — perfetto!'}
            </div>
            <div>Passaggi totali: {session.pass}</div>
          </div>
        </main>
        <div className="bottom-bar">
          <button className="bottom-bar__btn" onClick={onExit}>
            Esci
          </button>
          <button className="bottom-bar__btn primary" onClick={restart}>
            Ricomincia
          </button>
        </div>
      </div>
    )
  }

  const passLabel =
    session.pass === 1
      ? `${positionInPass} / ${session.total}`
      : `Ripasso ${session.pass - 1} · ${remaining} rimaste`

  return (
    <div className="screen study">
      <header className="topbar">
        <button className="icon-btn" onClick={onExit} aria-label="Esci">
          ←
        </button>
        <h1>{passLabel}</h1>
        <button
          className={'icon-btn' + (shuffled ? ' active' : '')}
          onClick={() => setShuffled((s) => !s)}
          title={shuffled ? 'Ordine originale' : 'Mescola'}
          aria-label="Mescola"
        >
          ⇄
        </button>
      </header>

      <div className="study-progress">
        <div
          className="study-progress__bar"
          style={{ width: `${(mastered / session.total) * 100}%` }}
        />
      </div>

      <div
        className={'study-card' + (flipped ? ' flipped' : '')}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="study-card__inner">
          <div className="study-card__face study-card__face--front">
            <CardFace
              content={card.front}
              type={card.type}
              large={card.type === 'japanese'}
            />
            <div className="study-card__hint">Tocca per girare</div>
          </div>
          <div className="study-card__face study-card__face--back">
            <CardFace content={card.back} type={card.type} />
            {card.notes && <div className="study-card__notes">{card.notes}</div>}
          </div>
        </div>
      </div>

      <div className="bottom-bar">
        {flipped ? (
          <>
            <button
              className="bottom-bar__btn danger"
              onClick={() => answer(false)}
            >
              ✕ Non sapevo
            </button>
            <button
              className="bottom-bar__btn success"
              onClick={() => answer(true)}
            >
              ✓ Sapevo
            </button>
          </>
        ) : (
          <button
            className="bottom-bar__btn primary"
            onClick={() => setFlipped(true)}
          >
            Mostra risposta
          </button>
        )}
      </div>
    </div>
  )
}
