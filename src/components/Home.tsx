import { useRef, useState } from 'react'
import type { Store } from '../useStore'
import type { CardType } from '../types'
import type { ThemePref } from '../useTheme'

interface Props {
  store: Store
  onOpenDeck: (deckId: string) => void
  themePref: ThemePref
  onCycleTheme: () => void
}

export function Home({ store, onOpenDeck, themePref, onCycleTheme }: Props) {
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<CardType>('math')
  const fileRef = useRef<HTMLInputElement>(null)

  function create() {
    const id = store.addDeck(name, type)
    setName('')
    setType('math')
    setCreating(false)
    onOpenDeck(id)
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(store.state, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `memorize-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function loadSamples() {
    const added = store.loadSamples()
    if (added === 0) alert('Tutti i mazzi di esempio sono già presenti.')
    else alert(`Aggiunti ${added} mazzi di esempio.`)
  }

  async function importData(file: File) {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (data?.version !== 1 || !Array.isArray(data.decks)) {
        alert('File non valido.')
        return
      }
      if (!confirm('Sostituire tutti i mazzi attuali con quelli del file?')) return
      store.replaceAll(data)
    } catch {
      alert('Impossibile leggere il file.')
    }
  }

  return (
    <div className="screen">
      <header className="topbar">
        <span />
        <h1>Memorize</h1>
        <div className="topbar-actions">
          <button
            className="icon-btn"
            onClick={onCycleTheme}
            title={`Tema: ${themeLabel(themePref)} — tocca per cambiare`}
            aria-label="Cambia tema"
          >
            {themeIcon(themePref)}
          </button>
          <button className="icon-btn" onClick={exportData} title="Esporta">
            ↓
          </button>
          <button
            className="icon-btn"
            onClick={() => fileRef.current?.click()}
            title="Importa"
          >
            ↑
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importData(f)
              e.target.value = ''
            }}
          />
        </div>
      </header>

      <main className="content">
        {store.state.decks.length === 0 && (
          <p className="empty">Nessun mazzo. Creane uno o carica gli esempi.</p>
        )}
        <ul className="deck-list">
          {store.state.decks.map((d) => (
            <li key={d.id}>
              <button className="deck-row" onClick={() => onOpenDeck(d.id)}>
                <span className="deck-row__name">{d.name}</span>
                <span className="deck-row__meta">
                  {d.cards.length} card · {labelForType(d.defaultType)}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <button className="samples-btn" onClick={loadSamples}>
          + Carica mazzi di esempio (RL, CG, kanji)
        </button>

        <a className="samples-btn" href="./comic.html" style={{ marginTop: 12 }}>
          🎬 Comic video maker
        </a>
      </main>

      {creating ? (
        <div className="modal" onClick={() => setCreating(false)}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <h2>Nuovo mazzo</h2>
            <label>
              Nome
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Es. Derivate"
              />
            </label>
            <label>
              Tipo predefinito
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CardType)}
              >
                <option value="math">Matematica (LaTeX)</option>
                <option value="japanese">Giapponese</option>
                <option value="plain">Testo semplice</option>
              </select>
            </label>
            <div className="modal-actions">
              <button onClick={() => setCreating(false)}>Annulla</button>
              <button className="primary" onClick={create}>
                Crea
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button className="fab" onClick={() => setCreating(true)} aria-label="Nuovo mazzo">
          +
        </button>
      )}
    </div>
  )
}

function labelForType(t: CardType): string {
  return t === 'math' ? 'Matematica' : t === 'japanese' ? 'Giapponese' : 'Testo'
}

function themeIcon(p: ThemePref): string {
  return p === 'light' ? '☀' : p === 'dark' ? '☾' : '◐'
}
function themeLabel(p: ThemePref): string {
  return p === 'light' ? 'chiaro' : p === 'dark' ? 'scuro' : 'auto'
}
