import type { Card, Deck } from './types'

/**
 * Pre-built decks the user can load with one tap from Home.
 * IDs and timestamps are filled in at insertion time.
 */
export interface DeckTemplate {
  name: string
  defaultType: Deck['defaultType']
  cards: Array<Omit<Card, 'id' | 'createdAt'>>
}

// ---------- Reinforcement Learning ----------

const rlFondamenti: DeckTemplate = {
  name: 'RL · Fondamenti',
  defaultType: 'math',
  cards: [
    {
      type: 'math',
      front: 'Return scontato $G_t$',
      back: '$G_t = \\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1}$',
      notes: 'Somma scontata delle reward future; $0 \\le \\gamma < 1$.',
    },
    {
      type: 'math',
      front: 'Value function $V^\\pi(s)$',
      back: '$V^\\pi(s) = \\mathbb{E}_\\pi[G_t \\mid S_t = s]$',
      notes: 'Ritorno atteso partendo da $s$ seguendo $\\pi$.',
    },
    {
      type: 'math',
      front: 'Action-value $Q^\\pi(s,a)$',
      back: '$Q^\\pi(s,a) = \\mathbb{E}_\\pi[G_t \\mid S_t=s, A_t=a]$',
    },
    {
      type: 'math',
      front: 'Bellman per $V^\\pi$',
      back: '$V^\\pi(s) = \\mathbb{E}_\\pi\\!\\left[R_{t+1} + \\gamma V^\\pi(S_{t+1}) \\mid S_t=s\\right]$',
    },
    {
      type: 'math',
      front: 'Bellman per $Q^\\pi$',
      back: '$Q^\\pi(s,a) = \\mathbb{E}\\!\\left[R_{t+1} + \\gamma\\, Q^\\pi(S_{t+1}, A_{t+1}) \\mid S_t=s, A_t=a\\right]$',
    },
    {
      type: 'math',
      front: 'Bellman ottimalità $V^*$',
      back: '$V^*(s) = \\max_a \\mathbb{E}\\!\\left[R_{t+1} + \\gamma V^*(S_{t+1}) \\mid S_t=s, A_t=a\\right]$',
    },
    {
      type: 'math',
      front: 'Bellman ottimalità $Q^*$',
      back: '$Q^*(s,a) = \\mathbb{E}\\!\\left[R_{t+1} + \\gamma \\max_{a\'} Q^*(S_{t+1}, a\') \\mid S_t=s, A_t=a\\right]$',
    },
    {
      type: 'math',
      front: 'Advantage $A^\\pi(s,a)$',
      back: '$A^\\pi(s,a) = Q^\\pi(s,a) - V^\\pi(s)$',
      notes: 'Quanto è migliore l\'azione $a$ rispetto alla media sotto $\\pi$.',
    },
    {
      type: 'math',
      front: 'TD error $\\delta_t$',
      back: '$\\delta_t = R_{t+1} + \\gamma V(S_{t+1}) - V(S_t)$',
    },
    {
      type: 'math',
      front: 'Policy stocastica $\\pi(a\\mid s)$',
      back: '$\\pi(a\\mid s) = \\Pr(A_t = a \\mid S_t = s)$',
    },
    {
      type: 'math',
      front: 'Entropia della policy',
      back: '$H(\\pi(\\cdot\\mid s)) = -\\sum_a \\pi(a\\mid s) \\log \\pi(a\\mid s)$',
      notes: 'Usata per regolarizzare ed incoraggiare esplorazione.',
    },
    {
      type: 'math',
      front: 'Policy $\\varepsilon$-greedy',
      back: '$\\pi(a\\mid s) = \\begin{cases} 1-\\varepsilon + \\varepsilon/|A| & a = \\arg\\max_{a\'} Q(s,a\') \\\\ \\varepsilon/|A| & \\text{altrimenti} \\end{cases}$',
    },
    {
      type: 'math',
      front: 'Discount factor $\\gamma$ — vincolo',
      back: '$0 \\le \\gamma < 1$ (per garantire $G_t$ finito con reward limitate)',
    },
    {
      type: 'math',
      front: 'Importance sampling ratio',
      back: '$\\rho_t = \\dfrac{\\pi(a_t\\mid s_t)}{\\mu(a_t\\mid s_t)}$',
      notes: '$\\mu$ è la policy comportamentale (behavior), $\\pi$ quella target.',
    },
    {
      type: 'math',
      front: 'Politica greedy rispetto a $Q$',
      back: '$\\pi^*(s) = \\arg\\max_a Q^*(s,a)$',
    },
  ],
}

const rlAlgoritmi: DeckTemplate = {
  name: 'RL · Algoritmi',
  defaultType: 'math',
  cards: [
    {
      type: 'math',
      front: 'TD(0) — aggiornamento value',
      back: '$V(S_t) \\leftarrow V(S_t) + \\alpha\\big[R_{t+1} + \\gamma V(S_{t+1}) - V(S_t)\\big]$',
    },
    {
      type: 'math',
      front: 'Q-learning (off-policy)',
      back: '$Q(S_t,A_t) \\leftarrow Q(S_t,A_t) + \\alpha\\big[R_{t+1} + \\gamma \\max_a Q(S_{t+1},a) - Q(S_t,A_t)\\big]$',
    },
    {
      type: 'math',
      front: 'SARSA (on-policy)',
      back: '$Q(S_t,A_t) \\leftarrow Q(S_t,A_t) + \\alpha\\big[R_{t+1} + \\gamma Q(S_{t+1},A_{t+1}) - Q(S_t,A_t)\\big]$',
    },
    {
      type: 'math',
      front: 'Expected SARSA',
      back: '$Q(S_t,A_t) \\leftarrow Q(S_t,A_t) + \\alpha\\big[R_{t+1} + \\gamma\\, \\mathbb{E}_\\pi[Q(S_{t+1},A)] - Q(S_t,A_t)\\big]$',
    },
    {
      type: 'math',
      front: 'Policy gradient (REINFORCE)',
      back: '$\\nabla_\\theta J(\\theta) = \\mathbb{E}_\\pi\\big[\\nabla_\\theta \\log \\pi_\\theta(a\\mid s)\\; G_t\\big]$',
    },
    {
      type: 'math',
      front: 'Actor-critic',
      back: '$\\nabla_\\theta J(\\theta) = \\mathbb{E}\\big[\\nabla_\\theta \\log \\pi_\\theta(a\\mid s)\\; A^\\pi(s,a)\\big]$',
      notes: 'Sostituisce $G_t$ con l\'advantage stimato dal critic.',
    },
    {
      type: 'math',
      front: 'GAE — Generalized Advantage Estimation',
      back: '$\\hat{A}_t^{\\text{GAE}(\\gamma,\\lambda)} = \\sum_{l=0}^{\\infty} (\\gamma\\lambda)^l\\, \\delta_{t+l}$',
    },
    {
      type: 'math',
      front: 'PPO — surrogate clippato',
      back: '$L^{\\text{CLIP}}(\\theta) = \\mathbb{E}_t\\Big[\\min\\big(r_t(\\theta)\\hat{A}_t,\\; \\text{clip}(r_t, 1-\\epsilon, 1+\\epsilon)\\hat{A}_t\\big)\\Big]$',
      notes: '$r_t(\\theta) = \\pi_\\theta(a_t\\mid s_t) / \\pi_{\\theta_{\\text{old}}}(a_t\\mid s_t)$',
    },
    {
      type: 'math',
      front: 'TRPO — vincolo KL',
      back: '$\\max_\\theta \\mathbb{E}\\!\\left[\\tfrac{\\pi_\\theta}{\\pi_{\\theta_{\\text{old}}}} \\hat{A}_t\\right] \\;\\text{s.t.}\\; \\mathbb{E}\\big[D_{\\mathrm{KL}}(\\pi_{\\theta_{\\text{old}}}\\Vert \\pi_\\theta)\\big] \\le \\delta$',
    },
    {
      type: 'math',
      front: 'DQN — loss target network',
      back: '$L(\\theta) = \\mathbb{E}\\!\\left[\\big(r + \\gamma \\max_{a\'} Q_{\\theta^{-}}(s\',a\') - Q_\\theta(s,a)\\big)^2\\right]$',
    },
    {
      type: 'math',
      front: 'Double DQN — target',
      back: '$y = r + \\gamma\\, Q_{\\theta^{-}}\\!\\big(s\',\\, \\arg\\max_{a\'} Q_\\theta(s\',a\')\\big)$',
      notes: 'Disaccoppia selezione e valutazione dell\'azione → meno overestimation.',
    },
    {
      type: 'math',
      front: 'SAC — soft value (entropy-augmented)',
      back: '$V(s) = \\mathbb{E}_{a\\sim\\pi}\\big[Q(s,a) - \\alpha \\log \\pi(a\\mid s)\\big]$',
    },
    {
      type: 'math',
      front: 'Soft Bellman',
      back: '$Q(s,a) = r + \\gamma\\, \\mathbb{E}_{s\'}\\!\\left[\\mathbb{E}_{a\'\\sim\\pi}\\big[Q(s\',a\') - \\alpha\\log\\pi(a\'\\mid s\')\\big]\\right]$',
    },
    {
      type: 'math',
      front: 'DDPG — gradient deterministico',
      back: '$\\nabla_\\theta J \\approx \\mathbb{E}_s\\!\\left[\\nabla_a Q(s,a)\\big|_{a=\\mu_\\theta(s)} \\nabla_\\theta \\mu_\\theta(s)\\right]$',
    },
  ],
}

// ---------- Computer Grafica ----------

const cgIlluminazione: DeckTemplate = {
  name: 'CG · Illuminazione & BRDF',
  defaultType: 'math',
  cards: [
    {
      type: 'math',
      front: 'Rendering equation (Kajiya, 1986)',
      back: '$L_o(x,\\omega_o) = L_e(x,\\omega_o) + \\displaystyle\\int_\\Omega f_r(x,\\omega_i,\\omega_o)\\, L_i(x,\\omega_i)\\, (\\omega_i\\cdot n)\\, d\\omega_i$',
    },
    {
      type: 'math',
      front: 'Legge di Lambert (diffuso)',
      back: '$L_d = \\dfrac{\\rho}{\\pi}\\, \\max(0, n\\cdot l)\\, E$',
      notes: '$\\rho$ albedo, $E$ irradianza incidente.',
    },
    {
      type: 'math',
      front: 'Phong (specular)',
      back: '$I_s = k_s\\, (r\\cdot v)^\\alpha\\, I_l$',
      notes: '$r$ riflesso di $l$, $v$ direzione verso la camera.',
    },
    {
      type: 'math',
      front: 'Blinn-Phong (half-vector)',
      back: '$I_s = k_s\\, (n\\cdot h)^\\alpha\\, I_l,\\quad h = \\dfrac{l + v}{\\|l+v\\|}$',
    },
    {
      type: 'math',
      front: 'Fresnel-Schlick',
      back: '$F(\\theta) = F_0 + (1 - F_0)(1 - \\cos\\theta)^5$',
    },
    {
      type: 'math',
      front: 'NDF GGX / Trowbridge-Reitz',
      back: '$D(h) = \\dfrac{\\alpha^2}{\\pi\\big((n\\cdot h)^2(\\alpha^2 - 1) + 1\\big)^2}$',
    },
    {
      type: 'math',
      front: 'BRDF Cook-Torrance (specular)',
      back: '$f_r(\\omega_i,\\omega_o) = \\dfrac{D\\, F\\, G}{4\\,(n\\cdot l)(n\\cdot v)}$',
    },
    {
      type: 'math',
      front: 'Vettore riflesso',
      back: '$r = 2\\,(n\\cdot l)\\, n - l$',
    },
    {
      type: 'math',
      front: 'Legge di Snell (rifrazione)',
      back: '$n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2$',
    },
    {
      type: 'math',
      front: 'Gamma correction (display)',
      back: '$C_{\\text{display}} = C_{\\text{linear}}^{1/\\gamma}$',
      notes: 'Tipicamente $\\gamma \\approx 2.2$ per sRGB.',
    },
    {
      type: 'math',
      front: 'Angolo solido (sferiche)',
      back: '$d\\omega = \\sin\\theta\\, d\\theta\\, d\\phi$',
    },
    {
      type: 'math',
      front: 'Irradianza da radianza',
      back: '$E(x) = \\displaystyle\\int_\\Omega L_i(x,\\omega)(n\\cdot\\omega)\\, d\\omega$',
    },
  ],
}

const cgTrasformazioni: DeckTemplate = {
  name: 'CG · Trasformazioni & camera',
  defaultType: 'math',
  cards: [
    {
      type: 'math',
      front: 'Traslazione (omogenea 4×4)',
      back: '$T = \\begin{pmatrix} 1 & 0 & 0 & t_x \\\\ 0 & 1 & 0 & t_y \\\\ 0 & 0 & 1 & t_z \\\\ 0 & 0 & 0 & 1 \\end{pmatrix}$',
    },
    {
      type: 'math',
      front: 'Scala uniforme/anisotropa',
      back: '$S = \\begin{pmatrix} s_x & 0 & 0 & 0 \\\\ 0 & s_y & 0 & 0 \\\\ 0 & 0 & s_z & 0 \\\\ 0 & 0 & 0 & 1 \\end{pmatrix}$',
    },
    {
      type: 'math',
      front: 'Rotazione asse $X$',
      back: '$R_x(\\theta) = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & \\cos\\theta & -\\sin\\theta \\\\ 0 & \\sin\\theta & \\cos\\theta \\end{pmatrix}$',
    },
    {
      type: 'math',
      front: 'Rotazione asse $Y$',
      back: '$R_y(\\theta) = \\begin{pmatrix} \\cos\\theta & 0 & \\sin\\theta \\\\ 0 & 1 & 0 \\\\ -\\sin\\theta & 0 & \\cos\\theta \\end{pmatrix}$',
    },
    {
      type: 'math',
      front: 'Rotazione asse $Z$',
      back: '$R_z(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta & 0 \\\\ \\sin\\theta & \\cos\\theta & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$',
    },
    {
      type: 'math',
      front: 'Proiezione prospettica (OpenGL)',
      back: '$P = \\begin{pmatrix} \\frac{2n}{r-l} & 0 & \\frac{r+l}{r-l} & 0 \\\\ 0 & \\frac{2n}{t-b} & \\frac{t+b}{t-b} & 0 \\\\ 0 & 0 & -\\frac{f+n}{f-n} & -\\frac{2fn}{f-n} \\\\ 0 & 0 & -1 & 0 \\end{pmatrix}$',
    },
    {
      type: 'math',
      front: 'Proiezione ortografica',
      back: '$P_o = \\begin{pmatrix} \\frac{2}{r-l} & 0 & 0 & -\\frac{r+l}{r-l} \\\\ 0 & \\frac{2}{t-b} & 0 & -\\frac{t+b}{t-b} \\\\ 0 & 0 & -\\frac{2}{f-n} & -\\frac{f+n}{f-n} \\\\ 0 & 0 & 0 & 1 \\end{pmatrix}$',
    },
    {
      type: 'math',
      front: 'Quaternione di rotazione',
      back: '$q = \\cos\\!\\tfrac{\\theta}{2} + (n_x i + n_y j + n_z k)\\sin\\!\\tfrac{\\theta}{2}$',
      notes: 'Rotazione di $\\theta$ attorno all\'asse unitario $\\hat{n}$.',
    },
    {
      type: 'math',
      front: 'Composizione MVP',
      back: '$\\mathbf{p}_{\\text{clip}} = P \\cdot V \\cdot M \\cdot \\mathbf{p}_{\\text{model}}$',
    },
    {
      type: 'math',
      front: 'Divisione prospettica',
      back: '$(x_{\\text{ndc}}, y_{\\text{ndc}}, z_{\\text{ndc}}) = (x/w,\\, y/w,\\, z/w)$',
    },
  ],
}

const cgGeometria: DeckTemplate = {
  name: 'CG · Geometria & ray tracing',
  defaultType: 'math',
  cards: [
    {
      type: 'math',
      front: 'Equazione del raggio',
      back: '$r(t) = \\mathbf{o} + t\\, \\mathbf{d},\\quad t \\ge 0$',
    },
    {
      type: 'math',
      front: 'Intersezione raggio-sfera',
      back: 'Con $\\mathbf{f} = \\mathbf{o} - \\mathbf{c}$: $t = -\\mathbf{d}\\cdot\\mathbf{f} \\pm \\sqrt{(\\mathbf{d}\\cdot\\mathbf{f})^2 - (\\|\\mathbf{f}\\|^2 - r^2)}$',
    },
    {
      type: 'math',
      front: 'Intersezione raggio-piano',
      back: '$t = \\dfrac{(\\mathbf{p}_0 - \\mathbf{o})\\cdot \\mathbf{n}}{\\mathbf{d}\\cdot \\mathbf{n}}$',
    },
    {
      type: 'math',
      front: 'Prodotto vettoriale',
      back: '$\\mathbf{a}\\times\\mathbf{b} = (a_y b_z - a_z b_y,\\; a_z b_x - a_x b_z,\\; a_x b_y - a_y b_x)$',
    },
    {
      type: 'math',
      front: 'Normale di un triangolo',
      back: '$\\mathbf{n} = \\dfrac{(\\mathbf{b}-\\mathbf{a}) \\times (\\mathbf{c}-\\mathbf{a})}{\\|(\\mathbf{b}-\\mathbf{a}) \\times (\\mathbf{c}-\\mathbf{a})\\|}$',
    },
    {
      type: 'math',
      front: 'Coordinate baricentriche',
      back: '$P = \\alpha A + \\beta B + \\gamma C,\\quad \\alpha+\\beta+\\gamma = 1$',
    },
    {
      type: 'math',
      front: 'Bézier cubica',
      back: '$B(t) = (1-t)^3 P_0 + 3(1-t)^2 t\\, P_1 + 3(1-t) t^2 P_2 + t^3 P_3$',
    },
    {
      type: 'math',
      front: 'Interpolazione lineare (lerp)',
      back: '$\\mathrm{lerp}(a,b,t) = (1-t)\\, a + t\\, b$',
    },
    {
      type: 'math',
      front: 'SLERP (interp. sferica)',
      back: '$\\mathrm{slerp}(q_0,q_1;t) = \\dfrac{\\sin((1-t)\\Omega)}{\\sin\\Omega} q_0 + \\dfrac{\\sin(t\\Omega)}{\\sin\\Omega} q_1$',
    },
    {
      type: 'math',
      front: 'Distanza punto-piano',
      back: '$d = \\dfrac{(\\mathbf{p} - \\mathbf{p}_0)\\cdot \\mathbf{n}}{\\|\\mathbf{n}\\|}$',
    },
  ],
}

// ---------- Kanji ----------

const kanjiNumeri: DeckTemplate = {
  name: 'Kanji · Numeri',
  defaultType: 'japanese',
  cards: [
    { type: 'japanese', front: '一', back: 'uno', notes: 'いち (ichi)' },
    { type: 'japanese', front: '二', back: 'due', notes: 'に (ni)' },
    { type: 'japanese', front: '三', back: 'tre', notes: 'さん (san)' },
    { type: 'japanese', front: '四', back: 'quattro', notes: 'よん / し (yon / shi)' },
    { type: 'japanese', front: '五', back: 'cinque', notes: 'ご (go)' },
    { type: 'japanese', front: '六', back: 'sei', notes: 'ろく (roku)' },
    { type: 'japanese', front: '七', back: 'sette', notes: 'なな / しち (nana / shichi)' },
    { type: 'japanese', front: '八', back: 'otto', notes: 'はち (hachi)' },
    { type: 'japanese', front: '九', back: 'nove', notes: 'きゅう / く (kyū / ku)' },
    { type: 'japanese', front: '十', back: 'dieci', notes: 'じゅう (jū)' },
    { type: 'japanese', front: '百', back: 'cento', notes: 'ひゃく (hyaku)' },
    { type: 'japanese', front: '千', back: 'mille', notes: 'せん (sen)' },
    { type: 'japanese', front: '万', back: 'diecimila', notes: 'まん (man)' },
    { type: 'japanese', front: '円', back: 'yen / cerchio', notes: 'えん (en)' },
    { type: 'japanese', front: '半', back: 'metà', notes: 'はん (han)' },
  ],
}

const kanjiTempo: DeckTemplate = {
  name: 'Kanji · Tempo & giorni',
  defaultType: 'japanese',
  cards: [
    { type: 'japanese', front: '日', back: 'giorno / sole', notes: 'ひ / にち (hi / nichi)' },
    { type: 'japanese', front: '月', back: 'luna / mese', notes: 'つき / げつ (tsuki / getsu)' },
    { type: 'japanese', front: '年', back: 'anno', notes: 'とし / ねん (toshi / nen)' },
    { type: 'japanese', front: '週', back: 'settimana', notes: 'しゅう (shū)' },
    { type: 'japanese', front: '時', back: 'ora / tempo', notes: 'とき / じ (toki / ji)' },
    { type: 'japanese', front: '分', back: 'minuto / parte', notes: 'ふん / ぶん (fun / bun)' },
    { type: 'japanese', front: '秒', back: 'secondo', notes: 'びょう (byō)' },
    { type: 'japanese', front: '今', back: 'ora / adesso', notes: 'いま (ima)' },
    { type: 'japanese', front: '朝', back: 'mattina', notes: 'あさ (asa)' },
    { type: 'japanese', front: '昼', back: 'mezzogiorno', notes: 'ひる (hiru)' },
    { type: 'japanese', front: '夜', back: 'notte', notes: 'よる (yoru)' },
    { type: 'japanese', front: '前', back: 'davanti / prima', notes: 'まえ (mae)' },
    { type: 'japanese', front: '後', back: 'dietro / dopo', notes: 'うしろ / あと (ushiro / ato)' },
    { type: 'japanese', front: '毎', back: 'ogni', notes: 'まい (mai)' },
  ],
}

const kanjiNatura: DeckTemplate = {
  name: 'Kanji · Natura & elementi',
  defaultType: 'japanese',
  cards: [
    { type: 'japanese', front: '水', back: 'acqua', notes: 'みず / すい (mizu / sui)' },
    { type: 'japanese', front: '火', back: 'fuoco', notes: 'ひ / か (hi / ka)' },
    { type: 'japanese', front: '木', back: 'albero / legno', notes: 'き / もく (ki / moku)' },
    { type: 'japanese', front: '金', back: 'oro / denaro', notes: 'かね / きん (kane / kin)' },
    { type: 'japanese', front: '土', back: 'terra / suolo', notes: 'つち / ど (tsuchi / do)' },
    { type: 'japanese', front: '山', back: 'montagna', notes: 'やま (yama)' },
    { type: 'japanese', front: '川', back: 'fiume', notes: 'かわ (kawa)' },
    { type: 'japanese', front: '海', back: 'mare', notes: 'うみ (umi)' },
    { type: 'japanese', front: '空', back: 'cielo / vuoto', notes: 'そら / くう (sora / kū)' },
    { type: 'japanese', front: '雨', back: 'pioggia', notes: 'あめ (ame)' },
    { type: 'japanese', front: '雪', back: 'neve', notes: 'ゆき (yuki)' },
    { type: 'japanese', front: '風', back: 'vento', notes: 'かぜ (kaze)' },
    { type: 'japanese', front: '花', back: 'fiore', notes: 'はな (hana)' },
    { type: 'japanese', front: '石', back: 'pietra', notes: 'いし (ishi)' },
    { type: 'japanese', front: '光', back: 'luce', notes: 'ひかり (hikari)' },
    { type: 'japanese', front: '電', back: 'elettricità', notes: 'でん (den)' },
  ],
}

const kanjiPersona: DeckTemplate = {
  name: 'Kanji · Persona & vita quotidiana',
  defaultType: 'japanese',
  cards: [
    { type: 'japanese', front: '人', back: 'persona', notes: 'ひと / じん (hito / jin)' },
    { type: 'japanese', front: '男', back: 'uomo', notes: 'おとこ (otoko)' },
    { type: 'japanese', front: '女', back: 'donna', notes: 'おんな (onna)' },
    { type: 'japanese', front: '子', back: 'bambino', notes: 'こ (ko)' },
    { type: 'japanese', front: '大', back: 'grande', notes: 'おお / だい (ō / dai)' },
    { type: 'japanese', front: '小', back: 'piccolo', notes: 'ちい / しょう (chii / shō)' },
    { type: 'japanese', front: '中', back: 'mezzo / dentro', notes: 'なか / ちゅう (naka / chū)' },
    { type: 'japanese', front: '上', back: 'sopra', notes: 'うえ (ue)' },
    { type: 'japanese', front: '下', back: 'sotto', notes: 'した (shita)' },
    { type: 'japanese', front: '右', back: 'destra', notes: 'みぎ (migi)' },
    { type: 'japanese', front: '左', back: 'sinistra', notes: 'ひだり (hidari)' },
    { type: 'japanese', front: '名', back: 'nome', notes: 'な / めい (na / mei)' },
    { type: 'japanese', front: '生', back: 'vita / nascere', notes: 'いき / せい (iki / sei)' },
    { type: 'japanese', front: '学', back: 'studio', notes: 'がく (gaku)' },
    { type: 'japanese', front: '校', back: 'scuola', notes: 'こう (kō)' },
    { type: 'japanese', front: '本', back: 'libro / origine', notes: 'ほん (hon)' },
    { type: 'japanese', front: '行', back: 'andare', notes: 'い / こう (i / kō)' },
    { type: 'japanese', front: '来', back: 'venire', notes: 'く / らい (ku / rai)' },
    { type: 'japanese', front: '見', back: 'vedere', notes: 'み (mi)' },
    { type: 'japanese', front: '聞', back: 'ascoltare / chiedere', notes: 'き (ki)' },
    { type: 'japanese', front: '話', back: 'parlare / storia', notes: 'はなし / わ (hanashi / wa)' },
    { type: 'japanese', front: '読', back: 'leggere', notes: 'よ (yo)' },
    { type: 'japanese', front: '書', back: 'scrivere', notes: 'か / しょ (ka / sho)' },
    { type: 'japanese', front: '食', back: 'mangiare / cibo', notes: 'た / しょく (ta / shoku)' },
    { type: 'japanese', front: '飲', back: 'bere', notes: 'の / いん (no / in)' },
  ],
}

const hiraganaBase: DeckTemplate = {
  name: 'Hiragana · vocali e K',
  defaultType: 'japanese',
  cards: [
    { type: 'japanese', front: 'あ', back: 'a' },
    { type: 'japanese', front: 'い', back: 'i' },
    { type: 'japanese', front: 'う', back: 'u' },
    { type: 'japanese', front: 'え', back: 'e' },
    { type: 'japanese', front: 'お', back: 'o' },
    { type: 'japanese', front: 'か', back: 'ka' },
    { type: 'japanese', front: 'き', back: 'ki' },
    { type: 'japanese', front: 'く', back: 'ku' },
    { type: 'japanese', front: 'け', back: 'ke' },
    { type: 'japanese', front: 'こ', back: 'ko' },
  ],
}

export const sampleDecks: DeckTemplate[] = [
  rlFondamenti,
  rlAlgoritmi,
  cgIlluminazione,
  cgTrasformazioni,
  cgGeometria,
  kanjiNumeri,
  kanjiTempo,
  kanjiNatura,
  kanjiPersona,
  hiraganaBase,
]
