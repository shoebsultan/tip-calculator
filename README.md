# SplitWise — Tip Calculator & Bill Splitter

A polished, real-time tip calculator and bill splitter built with **React + Vite**. Updates live as you type — no "Calculate" button needed.

## Live Demo

Deploy to Vercel in one command (see Deployment section below).

## Running Locally

### Requirements
- Node.js ≥ 16 ([nodejs.org](https://nodejs.org))

### Steps

```bash
# 1. Clone / navigate to the project directory
cd tip-calculator

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
# → Open http://localhost:5173
```

### Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the built output locally
```

## Deploying to Vercel

### Option A — Vercel CLI (recommended)

```bash
# Install Vercel CLI once
npm install -g vercel

# Deploy from project root
vercel

# For production
vercel --prod
```

The `vercel.json` at the project root configures the build automatically:
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Framework**: `vite`
- **SPA rewrites**: all routes → `index.html`

### Option B — Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo — Vercel auto-detects Vite, no config needed
4. Click **Deploy** ✅

## Project Structure

```
tip-calculator/
├── index.html                    # Vite HTML entry
├── vite.config.js                # Vite + React plugin
├── vercel.json                   # Zero-config Vercel deployment
├── package.json
├── src/
│   ├── main.jsx                  # React root
│   ├── App.jsx                   # Layout orchestrator
│   ├── index.css                 # Global design system (CSS tokens)
│   ├── hooks/
│   │   └── useCalculator.js      # All state, validation, computed values
│   ├── utils/
│   │   ├── validate.js           # Pure validation functions
│   │   └── calculate.js          # Ceil rounding, formatCurrency, computeResults
│   └── components/
│       ├── Header.jsx
│       ├── Footer.jsx
│       ├── InputPanel/
│       │   ├── index.jsx         # Panel container
│       │   ├── BillInput.jsx     # Currency input + paste sanitise
│       │   ├── TipSelector.jsx   # Presets (aria-pressed) + custom input
│       │   └── PeopleStepper.jsx # +/- with hold-to-repeat
│       └── OutputPanel/
│           ├── index.jsx         # Panel container
│           ├── HeroCard.jsx      # Per-person hero with pop animation
│           ├── ResultRow.jsx     # Reusable breakdown row
│           └── RoundingNote.jsx  # Amber ceiling disclosure
├── README.md
└── ANSWERS.md
```

## Features

- **Live calculation** — `useMemo` recomputes on every keystroke
- **Preset tip buttons** — 10 / 15 / 20 / 25 % with `aria-pressed` active state
- **Custom tip** — free-form; clears preset highlight when used
- **People stepper** — +/− buttons with hold-to-repeat, `ArrowUp`/`ArrowDown` support
- **Inline validation** — per-field animated errors, never `window.alert`
- **Rounding policy** — `Math.ceil` to nearest paise (group never underpays)
- **Rounding disclosure** — amber note with exact overage when ceiling applies
- **Reset** — single click, focus returns to bill input
- **Indian Rupee formatting** — `toLocaleString('en-IN')`
- **Responsive** — two-column desktop → stacked mobile (≤ 780 px)
- **Reduced motion** — `prefers-reduced-motion` respected
- **Zero runtime dependencies** beyond React itself
