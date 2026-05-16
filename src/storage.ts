import { sampleDecks, type DeckTemplate } from './samples'
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

/** Materializes a template into a Deck with fresh IDs/timestamps. */
export function instantiateTemplate(tpl: DeckTemplate, offset = 0): Deck {
  const now = Date.now() + offset
  return {
    id: uid(),
    name: tpl.name,
    defaultType: tpl.defaultType,
    createdAt: now,
    cards: tpl.cards.map((c, i) => ({
      ...c,
      id: uid(),
      createdAt: now + i,
    })),
  }
}

function seedIfFirstRun(): AppState {
  const decks = sampleDecks.map((tpl, i) => instantiateTemplate(tpl, i))
  const state: AppState = { version: 1, decks }
  saveState(state)
  return state
}
