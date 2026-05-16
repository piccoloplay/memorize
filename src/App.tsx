import { useEffect, useState } from 'react'
import { MathJaxContext } from 'better-react-mathjax'
import { mathJaxConfig } from './mathjax'
import { useStore } from './useStore'
import { useTheme } from './useTheme'
import { Home } from './components/Home'
import { DeckView } from './components/DeckView'
import { CardEditor } from './components/CardEditor'
import { Study } from './components/Study'

type View =
  | { name: 'home' }
  | { name: 'deck'; deckId: string }
  | { name: 'study'; deckId: string }
  | { name: 'edit'; deckId: string; cardId: string | null }

export default function App() {
  const store = useStore()
  const theme = useTheme()
  const [view, setView] = useState<View>({ name: 'home' })

  const deck =
    view.name !== 'home'
      ? store.state.decks.find((d) => d.id === view.deckId)
      : null

  // If the current deck disappears (e.g. deleted), go home.
  useEffect(() => {
    if (view.name !== 'home' && !deck) setView({ name: 'home' })
  }, [view, deck])

  return (
    <MathJaxContext version={3} config={mathJaxConfig}>
      {view.name === 'home' && (
        <Home
          store={store}
          onOpenDeck={(deckId) => setView({ name: 'deck', deckId })}
          themePref={theme.pref}
          onCycleTheme={theme.cycle}
        />
      )}

      {view.name === 'deck' && deck && (
        <DeckView
          deck={deck}
          store={store}
          onBack={() => setView({ name: 'home' })}
          onStudy={() => setView({ name: 'study', deckId: deck.id })}
          onAddCard={() => setView({ name: 'edit', deckId: deck.id, cardId: null })}
          onEditCard={(cardId) =>
            setView({ name: 'edit', deckId: deck.id, cardId })
          }
        />
      )}

      {view.name === 'study' && deck && (
        <Study deck={deck} onExit={() => setView({ name: 'deck', deckId: deck.id })} />
      )}

      {view.name === 'edit' && deck && (
        <CardEditor
          deck={deck}
          card={view.cardId ? deck.cards.find((c) => c.id === view.cardId) ?? null : null}
          store={store}
          onClose={() => setView({ name: 'deck', deckId: deck.id })}
        />
      )}
    </MathJaxContext>
  )
}
