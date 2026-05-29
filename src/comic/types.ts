export type Orientation = 'landscape' | 'portrait'
export type Resolution = '720p' | '1080p'
export type PanelsPerPage = 1 | 2 | 3 | 4 | 6
export type FitMode = 'contain' | 'cover'

export interface ComicImage {
  id: string
  /** Cached HTMLImageElement (already decoded). */
  bitmap: HTMLImageElement
  name: string
  width: number
  height: number
}

export interface ComicSettings {
  orientation: Orientation
  resolution: Resolution
  panelsPerPage: PanelsPerPage
  /** Seconds each page stays on screen. */
  durationPerPage: number
  /** Gap (in output pixels) between panels and around the page. */
  gutter: number
  fitMode: FitMode
  background: '#000000' | '#ffffff'
  panelBorder: boolean
}

export function resolutionSize(
  s: Pick<ComicSettings, 'orientation' | 'resolution'>,
): { w: number; h: number } {
  const long = s.resolution === '1080p' ? 1920 : 1280
  const short = s.resolution === '1080p' ? 1080 : 720
  return s.orientation === 'landscape'
    ? { w: long, h: short }
    : { w: short, h: long }
}

/** Returns rows × cols layout for a given panels-per-page in the given orientation. */
export function gridFor(
  panels: PanelsPerPage,
  orientation: Orientation,
): { rows: number; cols: number } {
  switch (panels) {
    case 1:
      return { rows: 1, cols: 1 }
    case 2:
      return orientation === 'landscape'
        ? { rows: 1, cols: 2 }
        : { rows: 2, cols: 1 }
    case 3:
      return orientation === 'landscape'
        ? { rows: 1, cols: 3 }
        : { rows: 3, cols: 1 }
    case 4:
      return { rows: 2, cols: 2 }
    case 6:
      return orientation === 'landscape'
        ? { rows: 2, cols: 3 }
        : { rows: 3, cols: 2 }
  }
}
