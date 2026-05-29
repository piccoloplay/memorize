import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ComicMaker } from './ComicMaker'
import '../styles.css'
import './comic.css'

// Apply persisted theme so this page matches the memorize app.
const themePref = localStorage.getItem('memorize:theme')
const isLight =
  themePref === 'light' ||
  (themePref !== 'dark' &&
    window.matchMedia('(prefers-color-scheme: light)').matches)
document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ComicMaker />
  </StrictMode>,
)
