import { MathJax } from 'better-react-mathjax'
import type { CardType } from '../types'

interface Props {
  content: string
  type: CardType
  /** Make the text larger (used for the front of Japanese cards). */
  large?: boolean
}

/**
 * Renders card content. Math/plain cards always go through MathJax so that
 * inline $...$ in any text gets typeset. Japanese cards skip MathJax to avoid
 * MathJax misinterpreting bare ASCII as math.
 */
export function CardFace({ content, type, large }: Props) {
  const className = ['card-content', large ? 'card-content--large' : '']
    .filter(Boolean)
    .join(' ')

  if (type === 'japanese') {
    return <div className={className}>{content}</div>
  }

  return (
    <MathJax key={content} dynamic className={className}>
      {content}
    </MathJax>
  )
}
