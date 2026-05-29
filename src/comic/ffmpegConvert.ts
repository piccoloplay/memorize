import type { FFmpeg } from '@ffmpeg/ffmpeg'

let ffmpegPromise: Promise<FFmpeg> | null = null

async function loadFFmpeg(
  onLog?: (line: string) => void,
): Promise<FFmpeg> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg')
      const { toBlobURL } = await import('@ffmpeg/util')
      const ff = new FFmpeg()
      ff.on('log', ({ message }) => onLog?.(message))
      // Use the ESM single-thread core to avoid needing a worker bundle.
      const baseURL =
        'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm'
      await ff.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          'application/wasm',
        ),
      })
      return ff
    })()
  }
  return ffmpegPromise
}

/** Converts a WebM blob to MP4 (H.264 + AAC stub) using ffmpeg.wasm. */
export async function webmToMp4(
  webm: Blob,
  onLog?: (line: string) => void,
  onProgress?: (ratio: number) => void,
): Promise<Blob> {
  const ff = await loadFFmpeg(onLog)
  ff.on('progress', ({ progress }) => onProgress?.(progress))

  const inBuf = new Uint8Array(await webm.arrayBuffer())
  await ff.writeFile('input.webm', inBuf)

  // Re-encode video to H.264 baseline for max compatibility (iPhone, WhatsApp).
  // No audio track.
  await ff.exec([
    '-i',
    'input.webm',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-preset',
    'veryfast',
    '-movflags',
    '+faststart',
    '-an',
    'output.mp4',
  ])

  const data = (await ff.readFile('output.mp4')) as Uint8Array
  // Copy into a plain ArrayBuffer so Blob is happy (readFile may return a
  // Uint8Array backed by SharedArrayBuffer).
  const out = new Uint8Array(data.byteLength)
  out.set(data)
  return new Blob([out.buffer], { type: 'video/mp4' })
}

export function isFFmpegSupported(): boolean {
  return typeof SharedArrayBuffer !== 'undefined'
}
