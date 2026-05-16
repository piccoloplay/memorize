import { useState } from 'react'
import type { Deck } from '../types'
import type { Store } from '../useStore'
import { CardFace } from './CardFace'

interface Props {
  deck: Deck
  store: Store
  onBack: () => void
  onStudy: () => void
  onAddCard: () => void
  onEditCard: (cardId: string) => void
}

export function DeckView({ deck, store, onBack, onStudy, onAddCard, onEditCard }: Props) {
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(deck.name)

  function commitName() {
    if (name.trim() && name !== deck.name) store.renameDeck(deck.id, name.trim())
    else setName(deck.name)
    setEditingName(false)
  }

  function removeDeck() {
    if (confirm(`Eliminare il mazzo "${deck.name}" e tutte le sue card?`)) {
      store.deleteDeck(deck.id)
      onBack()
    }
  }

  return (
    <div className="screen">
      <header className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Indietro">
          ←
        </button>
        {editingName ? (
          <input
            className="title-input"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitName()
              if (e.key === 'Escape') {
                setName(deck.name)
                setEditingName(false)
              }
            }}
          />
        ) : (
          <h1 onClick={() => setEditingName(true)}>{deck.name}</h1>
        )}
        <button className="icon-btn danger" onClick={removeDeck} aria-label="Elimina mazzo">
          ✕
        </button>
      </header>

      <main className="content">
        {deck.cards.length === 0 ? (
          <p className="empty">Nessuna card. Aggiungine una per iniziare.</p>
        ) : (
          <ul className="card-list">
            {deck.cards.map((c) => (
              <li key={c.id}>
                <button className="card-row" onClick={() => onEditCard(c.id)}>
                  <div className="card-row__front">
                    <CardFace content={c.front} type={c.type} />
                  </div>
                  <div className="card-row__back">
                    <CardFace content={c.back} type={c.type} />
                    {c.notes && <div className="card-row__notes">{c.notes}</div>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <div className="bottom-bar">
        <button className="bottom-bar__btn" onClick={onAddCard}>
          + Aggiungi card
        </button>
        <button
          className="bottom-bar__btn primary"
          onClick={onStudy}
          disabled={deck.cards.length === 0}
        >
          Studia ({deck.cards.length})
        </button>
      </div>
    </div>
  )
}
