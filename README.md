# SplitWise — Tip Calculator & Bill Splitter

A polished, zero-dependency tip calculator and bill splitter built with vanilla HTML, CSS, and JavaScript. Updates live as you type — no "Calculate" button needed.

## Live Demo

Open `index.html` directly in any modern browser — no build step, no server required.

## Running Locally

### Option 1 — Direct file open (simplest)

```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

### Option 2 — Local dev server (recommended for consistent behaviour)

Requires Node.js ≥ 16 installed ([nodejs.org](https://nodejs.org)).

```bash
# Install a lightweight static server once
npm install -g serve

# Serve the app
serve .
# → Open http://localhost:3000
```

Or with Python (comes pre-installed on macOS/Linux):

```bash
python3 -m http.server 8080
# → Open http://localhost:8080
```

### Option 3 — VS Code Live Server

Install the **Live Server** extension, right-click `index.html` → **Open with Live Server**.

## Project Structure

```
tip-calculator/
├── index.html   # Semantic HTML, ARIA labels, meta tags
├── style.css    # Design tokens, glassmorphism theme, responsive layout
├── app.js       # All calculation logic, validation, interaction
├── README.md    # This file
└── ANSWERS.md   # Assessment Q&A
```

## Features

- **Live calculation** — results update on every keystroke
- **Preset tip buttons** — 10 / 15 / 20 / 25 % with active state
- **Custom tip** — free-form input; clears preset highlight when used
- **People stepper** — +/− buttons with hold-to-repeat, arrow-key support
- **Inline validation** — animated errors per field, never `window.alert`
- **Rounding policy** — ceiling to 2 decimal places (the group never underpays)
- **Rounding disclosure** — visible note when rounding adds overage
- **Reset button** — single click returns to clean state, focus returns to bill field
- **Keyboard nav** — Enter advances focus through fields, full tab order
- **Indian Rupee formatting** — lakhs/crores via `toLocaleString('en-IN')`
- **Responsive** — two-column on desktop, stacked on mobile (≤ 780 px)
- **Reduced motion** — respects `prefers-reduced-motion`
- **No dependencies** — zero npm packages, zero build tools

## Currency

Indian Rupees (₹). Change the `CURRENCY` constant in `app.js` and the `currency-symbol` span in `index.html` to switch.
