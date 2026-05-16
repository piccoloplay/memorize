import { useState } from 'react'
import type { Card, CardType, Deck } from '../types'
import type { Store } from '../useStore'
import { CardFace } from './CardFace'

interface Props {
  deck: Deck
  card: Card | null
  store: Store
  onClose: () => void
}

export function CardEditor({ deck, card, store, onClose }: Props) {
  const isNew = card === null
  const [type, setType] = useState<CardType>(card?.type ?? deck.defaultType)
  const [front, setFront] = useState(card?.front ?? '')
  const [back, setBack] = useState(card?.back ?? '')
  const [notes, setNotes] = useState(card?.notes ?? '')

  function save() {
    if (!front.trim() || !back.trim()) {
      alert('Compila sia il fronte che il retro.')
      return
    }
    const payload = {
      type,
      front: front.trim(),
      back: back.trim(),
      notes: notes.trim() || undefined,
    }
    if (isNew) store.addCard(deck.id, payload)
    else store.updateCard(deck.id, card!.id, payload)
    onClose()
  }

  function remove() {
    if (!card) return
    if (confirm('Eliminare questa card?')) {
      store.deleteCard(deck.id, card.id)
      onClose()
    }
  }

  const isJp = type === 'japanese'

  return (
    <div className="screen">
      <header className="topbar">
        <button className="icon-btn" onClick={onClose} aria-label="Annulla">
          ←
        </button>
        <h1>{isNew ? 'Nuova card' : 'Modifica card'}</h1>
        {!isNew && (
          <button className="icon-btn danger" onClick={remove} aria-label="Elimina">
            ✕
          </button>
        )}
      </header>

      <main className="content editor">
        <label>
          Tipo
          <select value={type} onChange={(e) => setType(e.target.value as CardType)}>
            <option value="math">Matematica (LaTeX)</option>
            <option value="japanese">Giapponese</option>
            <option value="plain">Testo semplice</option>
          </select>
        </label>

        <label>
          Fronte {isJp ? '(kanji / kana / parola)' : type === 'math' ? '(nome o domanda)' : ''}
          <textarea
            value={front}
            onChange={(e) => setFront(e.target.value)}
            rows={isJp ? 2 : 3}
            placeholder={
              type === 'math'
                ? 'Es. Teorema di Pitagora'
                : isJp
                ? 'Es. 水'
                : 'Domanda o termine'
            }
          />
        </label>

        <label>
          Retro {isJp ? '(significato)' : type === 'math' ? '(formula in LaTeX, usa $...$)' : ''}
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            rows={3}
            placeholder={
              type === 'math'
                ? '$a^2 + b^2 = c^2$'
                : isJp
                ? 'Es. acqua'
                : 'Risposta'
            }
          />
        </label>

        {isJp && (
          <label>
            Lettura (hiragana / romaji)
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Es. みず (mizu)"
            />
          </label>
        )}

        {(front || back) && (
          <div className="preview">
            <div className="preview__label">Anteprima fronte</div>
            <div className="preview__box">
              <CardFace content={front || '—'} type={type} large={isJp} />
            </div>
            <div className="preview__label">Anteprima retro</div>
            <div className="preview__box">
              <CardFace content={back || '—'} type={type} />
              {isJp && notes && <div className="preview__notes">{notes}</div>}
            </div>
          </div>
        )}
      </main>

      <div className="bottom-bar">
        <button className="bottom-bar__btn" onClick={onClose}>
          Annulla
        </button>
        <button className="bottom-bar__btn primary" onClick={save}>
          Salva
        </button>
      </div>
    </div>
  )
}
