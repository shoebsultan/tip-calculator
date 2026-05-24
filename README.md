# SplitWise — Tip Calculator & Bill Splitter

A polished, real-time tip calculator and bill splitter built with **React + Vite**. Updates live as you type — no "Calculate" button needed.

## 🌐 Live URL

**https://tip-calculator-azure-two.vercel.app**

## 🔗 Repository

**https://github.com/shoebsultan/tip-calculator**

---

## 🚀 Running Locally

### Requirements
- Node.js ≥ 16 ([nodejs.org](https://nodejs.org))

```bash
# 1. Clone the repo
git clone https://github.com/shoebsultan/tip-calculator.git
cd tip-calculator

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
# → http://localhost:5173
```

### Other commands

```bash
npm run build    # production build → dist/
npm run preview  # serve the built output locally
```

---

## 🏗️ Project Structure

```
tip-calculator/
├── .github/
│   └── workflows/
│       ├── ci.yml            # PR checks: build + bundle size report
│       └── deploy.yml        # Production deploy on merge to master
├── index.html                # Vite HTML entry
├── vite.config.js
├── vercel.json               # Zero-config Vercel deployment
├── package.json
├── src/
│   ├── main.jsx              # React root
│   ├── App.jsx               # Layout orchestrator
│   ├── index.css             # Global design system (CSS tokens)
│   ├── hooks/
│   │   └── useCalculator.js  # All state, validation, computed values
│   ├── utils/
│   │   ├── validate.js       # Pure validation functions
│   │   └── calculate.js      # Ceil rounding, formatCurrency, computeResults
│   └── components/
│       ├── Header.jsx
│       ├── Footer.jsx
│       ├── InputPanel/
│       │   ├── index.jsx
│       │   ├── BillInput.jsx
│       │   ├── TipSelector.jsx
│       │   └── PeopleStepper.jsx
│       └── OutputPanel/
│           ├── index.jsx
│           ├── HeroCard.jsx
│           ├── ResultRow.jsx
│           └── RoundingNote.jsx
├── README.md
└── ANSWERS.md
```

---

## 🔄 CI/CD Pipeline

This project follows a **trunk-based development** model with mandatory PR reviews before anything reaches production.

### Branching Strategy

```
master              ← production branch (protected)
  └── feature/xyz   ← all work starts here
  └── fix/abc
  └── chore/abc
```

- **`master`** is the single source of truth for production.
- **No direct pushes to `master`** — all changes come through a Pull Request.
- Branch names follow `feature/`, `fix/`, `chore/`, or `docs/` prefixes.

### The Full Flow

```
1. Branch off master
   git checkout -b feature/my-feature

2. Work locally → commit
   git add .
   git commit -m "feat: describe the change"
   git push origin feature/my-feature

3. Open a Pull Request → targets master
   - CI runs automatically (build check + bundle size)
   - PR must pass CI before merge is allowed
   - At least 1 approving review required

4. Squash & Merge into master
   - One clean commit per feature in master's history

5. Deploy pipeline fires automatically
   - Vite production build runs on GitHub Actions
   - Deployed to Vercel CDN
   - Live at https://tip-calculator-azure-two.vercel.app
```

### GitHub Actions Workflows

#### `ci.yml` — PR Checks

Triggers on every pull request to `master`.

| Step | What it does |
|------|-------------|
| Checkout | Fetches the branch code |
| Setup Node 20 | Consistent runtime, npm cache |
| `npm ci` | Clean install from lockfile |
| `npm run build` | Vite production build — catches any compile errors |
| Verify dist | Asserts `dist/index.html` was emitted |
| Bundle report | Posts JS/CSS sizes as a PR summary comment |

> ✅ All steps must pass for a PR to be mergeable.

#### `deploy.yml` — Production Deploy

Triggers **only on push to `master`** (i.e., after a PR is merged).

| Step | What it does |
|------|-------------|
| Checkout | Fetches merged code |
| Setup Node 20 | Consistent runtime, npm cache |
| `npm ci` | Clean install |
| `npm run build` | Final production bundle |
| Verify dist | Safety check before deploying |
| Vercel deploy | Pushes `dist/` to Vercel edge network (`--prod`) |
| Summary | Posts deployment URL and commit SHA to job summary |

> Production deploys are **never cancelled** mid-flight (`cancel-in-progress: false`).

### Pipeline Diagram

```
feature/xyz branch
      │
      │  git push
      ▼
  Pull Request ──────► CI Workflow (ci.yml)
      │                   ├── Build & Verify ✅
      │                   └── Bundle Size Report ✅
      │
      │  Approved + CI green → Squash Merge
      ▼
   master ────────────► Deploy Workflow (deploy.yml)
                            ├── npm ci
                            ├── vite build
                            ├── Verify dist/
                            └── vercel --prod ✅
                                    │
                                    ▼
                     https://tip-calculator-azure-two.vercel.app
```

### Setting Up Secrets (one-time)

To enable the production deploy workflow, add these three secrets to your GitHub repository:

**GitHub → Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Where to get it |
|-------------|----------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create token |
| `VERCEL_ORG_ID` | `.vercel/project.json` → `orgId` field |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` → `projectId` field |

Your `.vercel/project.json` values will look something like this once you run `vercel link`:
```json
{
  "projectId": "prj_XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "orgId":     "team_XXXXXXXXXXXXXXXXXXXXXXXXX"
}
```

### Protecting master (Recommended)

Go to **GitHub → Settings → Branches → Add rule** for `master`:

- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
  - Add: `Build & Verify`
- [x] Require branches to be up to date before merging
- [x] Do not allow bypassing the above settings

---

## ✨ Features

- **Live calculation** — `useMemo` recomputes on every keystroke, no button needed
- **Preset tip buttons** — 10 / 15 / 20 / 25 % with `aria-pressed` active state
- **Custom tip** — free-form input; clears preset highlight when used
- **People stepper** — +/− buttons with hold-to-repeat, `ArrowUp`/`ArrowDown` support
- **Inline validation** — per-field animated errors, never `window.alert`
- **Rounding policy** — `Math.ceil` to nearest paise (group never underpays)
- **Rounding disclosure** — amber note with exact overage when ceiling applies
- **Indian Rupee formatting** — `toLocaleString('en-IN')`
- **Responsive** — two-column desktop → stacked mobile (≤ 780 px)
- **Accessibility** — `aria-live`, `aria-pressed`, `aria-invalid`, keyboard nav, focus states
- **Reduced motion** — respects `prefers-reduced-motion`

---

## 🛠️ Tech Stack

| | |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Vanilla CSS (design tokens, glassmorphism) |
| Hosting | Vercel |
| CI/CD | GitHub Actions |
| Package manager | npm |
