import {
  type ComicImage,
  type ComicSettings,
  gridFor,
  resolutionSize,
} from './types'

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** Splits the page into N panel rectangles inside the given canvas. */
export function computePanels(
  settings: ComicSettings,
  canvasW: number,
  canvasH: number,
): Rect[] {
  const { rows, cols } = gridFor(settings.panelsPerPage, settings.orientation)
  const g = settings.gutter
  const availW = canvasW - g * (cols + 1)
  const availH = canvasH - g * (rows + 1)
  const cellW = availW / cols
  const cellH = availH / rows
  const rects: Rect[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rects.push({
        x: g + c * (cellW + g),
        y: g + r * (cellH + g),
        w: cellW,
        h: cellH,
      })
    }
  }
  return rects
}

export function chunkPages<T>(items: T[], perPage: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += perPage) {
    out.push(items.slice(i, i + perPage))
  }
  return out
}

function drawImageInRect(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  rect: Rect,
  fit: 'contain' | 'cover',
) {
  const ar = img.width / img.height
  const rar = rect.w / rect.h
  let dw: number, dh: number, dx: number, dy: number
  if (fit === 'cover' ? ar > rar : ar < rar) {
    // Image is "wider" than rect when contain → height-bound; cover → width-bound
    if (fit === 'contain') {
      dh = rect.h
      dw = dh * ar
    } else {
      dw = rect.w
      dh = dw / ar
    }
  } else {
    if (fit === 'contain') {
      dw = rect.w
      dh = dw / ar
    } else {
      dh = rect.h
      dw = dh * ar
    }
  }
  dx = rect.x + (rect.w - dw) / 2
  dy = rect.y + (rect.h - dh) / 2

  if (fit === 'cover') {
    ctx.save()
    ctx.beginPath()
    ctx.rect(rect.x, rect.y, rect.w, rect.h)
    ctx.clip()
    ctx.drawImage(img, dx, dy, dw, dh)
    ctx.restore()
  } else {
    ctx.drawImage(img, dx, dy, dw, dh)
  }
}

/** Renders one page (a chunk of images) to the canvas. */
export function renderPage(
  canvas: HTMLCanvasElement,
  settings: ComicSettings,
  pageImages: ComicImage[],
) {
  const { w, h } = resolutionSize(settings)
  if (canvas.width !== w) canvas.width = w
  if (canvas.height !== h) canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = settings.background
  ctx.fillRect(0, 0, w, h)

  const panelBg = settings.background === '#000000' ? '#111111' : '#ffffff'
  const borderColor = settings.background === '#000000' ? '#ffffff' : '#000000'

  const rects = computePanels(settings, w, h)
  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i]
    ctx.fillStyle = panelBg
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h)

    const img = pageImages[i]
    if (img) drawImageInRect(ctx, img.bitmap, rect, settings.fitMode)

    if (settings.panelBorder) {
      ctx.strokeStyle = borderColor
      ctx.lineWidth = Math.max(2, Math.round(w / 480))
      ctx.strokeRect(
        rect.x + ctx.lineWidth / 2,
        rect.y + ctx.lineWidth / 2,
        rect.w - ctx.lineWidth,
        rect.h - ctx.lineWidth,
      )
    }
  }
}

/**
 * Records a video by stepping through each page and holding it for the
 * configured duration. Resolves with a WebM blob.
 */
export async function recordWebM(
  images: ComicImage[],
  settings: ComicSettings,
  onProgress?: (current: number, total: number) => void,
): Promise<Blob> {
  const pages = chunkPages(images, settings.panelsPerPage)
  if (pages.length === 0) throw new Error('Nessuna immagine da renderizzare')

  const { w, h } = resolutionSize(settings)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h

  const fps = 30
  const stream = canvas.captureStream(fps)
  const mime = pickMimeType()
  const recorder = new MediaRecorder(stream, {
    mimeType: mime,
    videoBitsPerSecond: settings.resolution === '1080p' ? 6_000_000 : 3_000_000,
  })

  const chunks: BlobPart[] = []
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data)
  }

  const done = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mime }))
    recorder.onerror = (e) => reject((e as ErrorEvent).error ?? e)
  })

  recorder.start(250)

  // Render the first page before timing starts so the first frame is captured.
  renderPage(canvas, settings, pages[0])
  await waitMs(100)

  const msPerPage = Math.max(500, settings.durationPerPage * 1000)
  for (let i = 0; i < pages.length; i++) {
    renderPage(canvas, settings, pages[i])
    onProgress?.(i + 1, pages.length)
    await waitMs(msPerPage)
  }

  recorder.stop()
  return done
}

function waitMs(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function pickMimeType(): string {
  const candidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ]
  for (const c of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(c)) {
      return c
    }
  }
  return 'video/webm'
}
