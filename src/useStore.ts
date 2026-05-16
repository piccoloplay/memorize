import { useCallback, useEffect, useState } from 'react'
import { loadState, saveState, uid } from './storage'
import type { AppState, Card, CardType, Deck } from './types'

export function useStore() {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const addDeck = useCallback((name: string, defaultType: CardType) => {
    const deck: Deck = {
      id: uid(),
      name: name.trim() || 'Nuovo mazzo',
      defaultType,
      cards: [],
      createdAt: Date.now(),
    }
    setState((s) => ({ ...s, decks: [...s.decks, deck] }))
    return deck.id
  }, [])

  const renameDeck = useCallback((deckId: string, name: string) => {
    setState((s) => ({
      ...s,
      decks: s.decks.map((d) => (d.id === deckId ? { ...d, name } : d)),
    }))
  }, [])

  const deleteDeck = useCallback((deckId: string) => {
    setState((s) => ({ ...s, decks: s.decks.filter((d) => d.id !== deckId) }))
  }, [])

  const addCard = useCallback(
    (deckId: string, card: Omit<Card, 'id' | 'createdAt'>) => {
      const newCard: Card = { ...card, id: uid(), createdAt: Date.now() }
      setState((s) => ({
        ...s,
        decks: s.decks.map((d) =>
          d.id === deckId ? { ...d, cards: [...d.cards, newCard] } : d,
        ),
      }))
      return newCard.id
    },
    [],
  )

  const updateCard = useCallback(
    (deckId: string, cardId: string, patch: Partial<Omit<Card, 'id' | 'createdAt'>>) => {
      setState((s) => ({
        ...s,
        decks: s.decks.map((d) =>
          d.id === deckId
            ? {
                ...d,
                cards: d.cards.map((c) => (c.id === cardId ? { ...c, ...patch } : c)),
              }
            : d,
        ),
      }))
    },
    [],
  )

  const deleteCard = useCallback((deckId: string, cardId: string) => {
    setState((s) => ({
      ...s,
      decks: s.decks.map((d) =>
        d.id === deckId ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) } : d,
      ),
    }))
  }, [])

  const replaceAll = useCallback((next: AppState) => setState(next), [])

  return {
    state,
    addDeck,
    renameDeck,
    deleteDeck,
    addCard,
    updateCard,
    deleteCard,
    replaceAll,
  }
}

export type Store = ReturnType<typeof useStore>
