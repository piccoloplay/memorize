import { useEffect, useState } from 'react'

export type ThemePref = 'auto' | 'light' | 'dark'
export type EffectiveTheme = 'light' | 'dark'

const KEY = 'memorize:theme'

function readPref(): ThemePref {
  const v = localStorage.getItem(KEY)
  return v === 'light' || v === 'dark' || v === 'auto' ? v : 'auto'
}

function systemTheme(): EffectiveTheme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(() => readPref())
  const [effective, setEffective] = useState<EffectiveTheme>(() =>
    pref === 'auto' ? systemTheme() : pref,
  )

  useEffect(() => {
    localStorage.setItem(KEY, pref)
    if (pref !== 'auto') {
      setEffective(pref)
      return
    }
    // Auto: follow system, and react to changes.
    const mql = window.matchMedia('(prefers-color-scheme: light)')
    const apply = () => setEffective(mql.matches ? 'light' : 'dark')
    apply()
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
  }, [pref])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effective)
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (meta) meta.content = effective === 'light' ? '#f8fafc' : '#0f172a'
  }, [effective])

  function cycle() {
    setPref((p) => (p === 'auto' ? 'light' : p === 'light' ? 'dark' : 'auto'))
  }

  return { pref, effective, setPref, cycle }
}
