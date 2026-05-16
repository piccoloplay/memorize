import { useEffect, useMemo, useState } from 'react'
import type { Deck } from '../types'
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

export function Study({ deck, onExit }: Props) {
  const [shuffled, setShuffled] = useState(false)
  const order = useMemo(
    () => (shuffled ? shuffle(deck.cards) : deck.cards),
    [deck.cards, shuffled],
  )
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setIndex(0)
    setFlipped(false)
  }, [order])

  const card = order[index]
  const canPrev = index > 0
  const canNext = index < order.length - 1

  function next() {
    if (canNext) {
      setIndex(index + 1)
      setFlipped(false)
    }
  }
  function prev() {
    if (canPrev) {
      setIndex(index - 1)
      setFlipped(false)
    }
  }

  // Swipe gestures
  useEffect(() => {
    let startX = 0
    let startY = 0
    function onStart(e: TouchEvent) {
      const t = e.touches[0]
      startX = t.clientX
      startY = t.clientY
    }
    function onEnd(e: TouchEvent) {
      const t = e.changedTouches[0]
      const dx = t.clientX - startX
      const dy = t.clientY - startY
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next()
        else prev()
      }
    }
    const el = document.getElementById('study-card-area')
    el?.addEventListener('touchstart', onStart, { passive: true })
    el?.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el?.removeEventListener('touchstart', onStart)
      el?.removeEventListener('touchend', onEnd)
    }
  }, [canNext, canPrev, index])

  // Keyboard shortcuts (desktop)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (e.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, canNext, canPrev])

  if (!card) {
    return (
      <div className="screen">
        <header className="topbar">
          <button className="icon-btn" onClick={onExit}>←</button>
          <h1>Studio</h1>
          <span />
        </header>
        <main className="content">
          <p className="empty">Mazzo vuoto.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="screen study">
      <header className="topbar">
        <button className="icon-btn" onClick={onExit} aria-label="Esci">
          ←
        </button>
        <h1>
          {index + 1} / {order.length}
        </h1>
        <button
          className={'icon-btn' + (shuffled ? ' active' : '')}
          onClick={() => setShuffled((s) => !s)}
          title={shuffled ? 'Ordine originale' : 'Mescola'}
          aria-label="Mescola"
        >
          ⇄
        </button>
      </header>

      <div
        id="study-card-area"
        className={'study-card' + (flipped ? ' flipped' : '')}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="study-card__inner">
          <div className="study-card__face study-card__face--front">
            <CardFace content={card.front} type={card.type} large={card.type === 'japanese'} />
            <div className="study-card__hint">Tocca per girare</div>
          </div>
          <div className="study-card__face study-card__face--back">
            <CardFace content={card.back} type={card.type} />
            {card.notes && <div className="study-card__notes">{card.notes}</div>}
          </div>
        </div>
      </div>

      <div className="bottom-bar">
        <button className="bottom-bar__btn" onClick={prev} disabled={!canPrev}>
          ← Prec
        </button>
        <button className="bottom-bar__btn" onClick={() => setFlipped((f) => !f)}>
          Gira
        </button>
        <button
          className="bottom-bar__btn primary"
          onClick={next}
          disabled={!canNext}
        >
          Succ →
        </button>
      </div>
    </div>
  )
}
