import type { AppState, Deck } from './types'

const KEY = 'memorize:v1'

const empty: AppState = { version: 1, decks: [] }

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seedIfFirstRun()
    const parsed = JSON.parse(raw) as AppState
    if (parsed.version !== 1 || !Array.isArray(parsed.decks)) return empty
    return parsed
  } catch {
    return empty
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function seedIfFirstRun(): AppState {
  const mathDeck: Deck = {
    id: uid(),
    name: 'Formule matematiche',
    defaultType: 'math',
    createdAt: Date.now(),
    cards: [
      {
        id: uid(),
        type: 'math',
        front: 'Teorema di Pitagora',
        back: '$a^2 + b^2 = c^2$',
        createdAt: Date.now(),
      },
      {
        id: uid(),
        type: 'math',
        front: 'Formula quadratica',
        back: '$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$',
        createdAt: Date.now(),
      },
      {
        id: uid(),
        type: 'math',
        front: 'Identità di Eulero',
        back: '$e^{i\\pi} + 1 = 0$',
        createdAt: Date.now(),
      },
    ],
  }
  const jpDeck: Deck = {
    id: uid(),
    name: 'Hiragana base',
    defaultType: 'japanese',
    createdAt: Date.now(),
    cards: [
      { id: uid(), type: 'japanese', front: 'あ', back: 'a', createdAt: Date.now() },
      { id: uid(), type: 'japanese', front: 'い', back: 'i', createdAt: Date.now() },
      { id: uid(), type: 'japanese', front: 'う', back: 'u', createdAt: Date.now() },
      { id: uid(), type: 'japanese', front: 'え', back: 'e', createdAt: Date.now() },
      { id: uid(), type: 'japanese', front: 'お', back: 'o', createdAt: Date.now() },
      {
        id: uid(),
        type: 'japanese',
        front: '水',
        back: 'acqua',
        notes: 'みず (mizu)',
        createdAt: Date.now(),
      },
    ],
  }
  const state: AppState = { version: 1, decks: [mathDeck, jpDeck] }
  saveState(state)
  return state
}
