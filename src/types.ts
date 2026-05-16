export type CardType = 'math' | 'japanese' | 'plain'

export interface Card {
  id: string
  front: string
  back: string
  /** Optional secondary info: for Japanese cards, the reading (hiragana/romaji). */
  notes?: string
  type: CardType
  createdAt: number
}

export interface Deck {
  id: string
  name: string
  /** Hint to set the default type when creating new cards. */
  defaultType: CardType
  cards: Card[]
  createdAt: number
}

export interface AppState {
  version: 1
  decks: Deck[]
}
