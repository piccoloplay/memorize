import { useEffect, useRef, useState } from 'react'
import {
  type ComicImage,
  type ComicSettings,
  type Orientation,
  type PanelsPerPage,
  type Resolution,
  type FitMode,
  resolutionSize,
} from './types'
import { chunkPages, recordWebM, renderPage } from './render'
import { isFFmpegSupported, webmToMp4 } from './ffmpegConvert'

const defaultSettings: ComicSettings = {
  orientation: 'landscape',
  resolution: '720p',
  panelsPerPage: 4,
  durationPerPage: 3,
  gutter: 16,
  fitMode: 'contain',
  background: '#000000',
  panelBorder: true,
}

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

async function loadImageFile(file: File): Promise<ComicImage> {
  const url = URL.createObjectURL(file)
  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Impossibile leggere ${file.name}`))
    img.src = url
  })
  return {
    id: uid(),
    bitmap: img,
    name: file.name,
    width: img.naturalWidth,
    height: img.naturalHeight,
  }
}

export function ComicMaker() {
  const [images, setImages] = useState<ComicImage[]>([])
  const [settings, setSettings] = useState<ComicSettings>(defaultSettings)
  const [busy, setBusy] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [webm, setWebm] = useState<{ url: string; blob: Blob } | null>(null)
  const [mp4, setMp4] = useState<{ url: string; blob: Blob } | null>(null)
  const [ffmpegLog, setFfmpegLog] = useState<string>('')
  const fileRef = useRef<HTMLInputElement>(null)

  const pages = chunkPages(images, settings.panelsPerPage)

  async function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy('Carico le immagini…')
    try {
      const loaded: ComicImage[] = []
      for (const f of Array.from(files)) {
        if (!f.type.startsWith('image/')) continue
        loaded.push(await loadImageFile(f))
      }
      setImages((s) => [...s, ...loaded])
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setBusy(null)
    }
  }

  function removeImage(id: string) {
    setImages((s) => s.filter((i) => i.id !== id))
  }
  function moveImage(id: string, dir: -1 | 1) {
    setImages((s) => {
      const i = s.findIndex((x) => x.id === id)
      if (i < 0) return s
      const j = i + dir
      if (j < 0 || j >= s.length) return s
      const copy = s.slice()
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy
    })
  }

  function update<K extends keyof ComicSettings>(key: K, val: ComicSettings[K]) {
    setSettings((s) => ({ ...s, [key]: val }))
  }

  function clearOutputs() {
    if (webm) URL.revokeObjectURL(webm.url)
    if (mp4) URL.revokeObjectURL(mp4.url)
    setWebm(null)
    setMp4(null)
    setFfmpegLog('')
  }

  async function generate() {
    if (images.length === 0) {
      alert('Aggiungi almeno una immagine.')
      return
    }
    clearOutputs()
    setBusy('Genero il video…')
    setProgress(0)
    try {
      const blob = await recordWebM(images, settings, (cur, tot) =>
        setProgress(cur / tot),
      )
      const url = URL.createObjectURL(blob)
      setWebm({ url, blob })
    } catch (err) {
      alert('Errore durante la registrazione: ' + (err as Error).message)
    } finally {
      setBusy(null)
      setProgress(0)
    }
  }

  async function convertToMp4() {
    if (!webm) return
    if (!isFFmpegSupported()) {
      alert(
        'SharedArrayBuffer non disponibile. Ricarica la pagina e riprova: la prima visita installa il service worker necessario.',
      )
      return
    }
    setBusy('Converto in MP4 (la prima volta scarica ffmpeg ~25 MB)…')
    setProgress(0)
    try {
      const blob = await webmToMp4(
        webm.blob,
        (line) => setFfmpegLog((s) => (s + '\n' + line).slice(-2000)),
        (ratio) => setProgress(ratio),
      )
      if (mp4) URL.revokeObjectURL(mp4.url)
      const url = URL.createObjectURL(blob)
      setMp4({ url, blob })
    } catch (err) {
      alert('Conversione fallita: ' + (err as Error).message)
    } finally {
      setBusy(null)
      setProgress(0)
    }
  }

  const totalSeconds = pages.length * settings.durationPerPage
  const { w, h } = resolutionSize(settings)

  return (
    <div className="screen">
      <header className="topbar">
        <a className="icon-btn" href="./index.html" title="Torna a Memorize">
          ←
        </a>
        <h1>Comic video maker</h1>
        <span />
      </header>

      <main className="content comic">
        <section className="comic-section">
          <h2>1 · Immagini</h2>
          <div className="comic-uploader">
            <button
              className="comic-upload-btn"
              onClick={() => fileRef.current?.click()}
            >
              + Aggiungi immagini
            </button>
            <input
              ref={fileRef}
              type="file"
              hidden
              accept="image/*"
              multiple
              onChange={(e) => {
                addFiles(e.target.files)
                e.target.value = ''
              }}
            />
            <span className="comic-count">
              {images.length} {images.length === 1 ? 'immagine' : 'immagini'} ·{' '}
              {pages.length} {pages.length === 1 ? 'pagina' : 'pagine'} ·{' '}
              ~{totalSeconds.toFixed(0)} s
            </span>
          </div>

          {images.length > 0 && (
            <ul className="comic-thumbs">
              {images.map((img, i) => (
                <li key={img.id} className="comic-thumb">
                  <img src={img.bitmap.src} alt={img.name} />
                  <div className="comic-thumb-actions">
                    <button
                      onClick={() => moveImage(img.id, -1)}
                      disabled={i === 0}
                      aria-label="Sposta su"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveImage(img.id, 1)}
                      disabled={i === images.length - 1}
                      aria-label="Sposta giù"
                    >
                      ↓
                    </button>
                    <button
                      className="danger"
                      onClick={() => removeImage(img.id)}
                      aria-label="Rimuovi"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="comic-section">
          <h2>2 · Impostazioni</h2>
          <div className="comic-grid">
            <label>
              Orientamento
              <select
                value={settings.orientation}
                onChange={(e) =>
                  update('orientation', e.target.value as Orientation)
                }
              >
                <option value="landscape">Landscape (16:9)</option>
                <option value="portrait">Portrait (9:16)</option>
              </select>
            </label>

            <label>
              Risoluzione
              <select
                value={settings.resolution}
                onChange={(e) =>
                  update('resolution', e.target.value as Resolution)
                }
              >
                <option value="720p">720p ({w}×{h})</option>
                <option value="1080p">1080p (più pesante)</option>
              </select>
            </label>

            <label>
              Pannelli per pagina
              <select
                value={settings.panelsPerPage}
                onChange={(e) =>
                  update(
                    'panelsPerPage',
                    Number(e.target.value) as PanelsPerPage,
                  )
                }
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4 (2×2)</option>
                <option value={6}>6</option>
              </select>
            </label>

            <label>
              Durata per pagina: {settings.durationPerPage.toFixed(1)} s
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={settings.durationPerPage}
                onChange={(e) =>
                  update('durationPerPage', Number(e.target.value))
                }
              />
            </label>

            <label>
              Margine pannelli: {settings.gutter} px
              <input
                type="range"
                min={0}
                max={64}
                step={2}
                value={settings.gutter}
                onChange={(e) => update('gutter', Number(e.target.value))}
              />
            </label>

            <label>
              Adattamento immagine
              <select
                value={settings.fitMode}
                onChange={(e) => update('fitMode', e.target.value as FitMode)}
              >
                <option value="contain">Contain (no crop)</option>
                <option value="cover">Cover (riempie, taglia)</option>
              </select>
            </label>

            <label>
              Sfondo
              <select
                value={settings.background}
                onChange={(e) =>
                  update('background', e.target.value as '#000000' | '#ffffff')
                }
              >
                <option value="#000000">Nero</option>
                <option value="#ffffff">Bianco</option>
              </select>
            </label>

            <label className="comic-checkbox">
              <input
                type="checkbox"
                checked={settings.panelBorder}
                onChange={(e) => update('panelBorder', e.target.checked)}
              />
              Bordo intorno ai pannelli
            </label>
          </div>
        </section>

        <section className="comic-section">
          <h2>3 · Anteprima pagine</h2>
          {pages.length === 0 ? (
            <p className="empty">Carica immagini per vedere l'anteprima.</p>
          ) : (
            <ul className="comic-pages">
              {pages.map((p, i) => (
                <PagePreview
                  key={i}
                  index={i}
                  pageImages={p}
                  settings={settings}
                />
              ))}
            </ul>
          )}
        </section>

        <section className="comic-section">
          <h2>4 · Video</h2>
          <button
            className="comic-generate-btn"
            onClick={generate}
            disabled={busy !== null || images.length === 0}
          >
            {busy ? 'Lavoro in corso…' : '▶ Genera video'}
          </button>

          {busy && (
            <div className="comic-progress">
              <div className="comic-progress-label">{busy}</div>
              <div className="study-progress">
                <div
                  className="study-progress__bar"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
            </div>
          )}

          {webm && (
            <div className="comic-output">
              <video src={webm.url} controls playsInline />
              <div className="comic-output-actions">
                <a
                  className="bottom-bar__btn primary"
                  href={webm.url}
                  download={`comic-${Date.now()}.webm`}
                >
                  ↓ Scarica WebM
                </a>
                {mp4 ? (
                  <a
                    className="bottom-bar__btn success"
                    href={mp4.url}
                    download={`comic-${Date.now()}.mp4`}
                  >
                    ↓ Scarica MP4
                  </a>
                ) : (
                  <button
                    className="bottom-bar__btn"
                    onClick={convertToMp4}
                    disabled={busy !== null}
                  >
                    Esporta MP4
                  </button>
                )}
              </div>
              {ffmpegLog && (
                <details className="comic-log">
                  <summary>Log ffmpeg</summary>
                  <pre>{ffmpegLog}</pre>
                </details>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function PagePreview({
  index,
  pageImages,
  settings,
}: {
  index: number
  pageImages: ComicImage[]
  settings: ComicSettings
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return
    renderPage(ref.current, settings, pageImages)
  }, [pageImages, settings])

  const { w, h } = resolutionSize(settings)
  const ar = w / h

  return (
    <li className="comic-page">
      <div
        className="comic-page-canvas-wrap"
        style={{ aspectRatio: String(ar) }}
      >
        <canvas ref={ref} />
      </div>
      <div className="comic-page-label">Pagina {index + 1}</div>
    </li>
  )
}
