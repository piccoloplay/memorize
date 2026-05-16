# Memorize

Webapp mobile-first per memorizzare formule matematiche e simboli giapponesi tramite flashcard.

## Caratteristiche

- Mazzi di flashcard con scorrimento manuale (no algoritmo di ripetizione spaziata)
- Formule matematiche renderizzate con **MathJax** (sintassi LaTeX, es. `$a^2 + b^2 = c^2$`)
- Supporto specifico per il giapponese: campo separato per la lettura (hiragana / romaji), font system CJK
- Tutti i dati salvati in **localStorage** del browser
- Export / import JSON per backup e trasferimento tra dispositivi
- Modalità studio: tap per girare la card, swipe / tasti / pulsanti per navigare
- Mobile-first, dark theme, safe-area iOS

## Sviluppo

```bash
npm install
npm run dev
```

Apri `http://localhost:5173` (su mobile: usa l'IP della macchina sulla LAN).

## Build di produzione

```bash
npm run build
npm run preview
```

I file statici risultanti in `dist/` possono essere pubblicati ovunque (GitHub Pages, Netlify, Vercel, ecc.).

## Stack

- Vite + React 18 + TypeScript
- [better-react-mathjax](https://github.com/fast-reflexes/better-react-mathjax) per il rendering LaTeX
- Nessun backend, nessun framework UI: CSS scritto a mano
