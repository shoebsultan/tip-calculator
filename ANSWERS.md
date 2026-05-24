# ANSWERS.md

## Q1 — How to run

No build step or package manager needed.

**Simplest:**
```bash
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

**With a local server (avoids any browser file:// quirks):**
```bash
npx serve .              # Node.js required — auto-installs serve
# → http://localhost:3000
```

Or Python (no install):
```bash
python3 -m http.server 8080
# → http://localhost:8080
```

Tested in Chrome 124, Firefox 126, Safari 17, Edge 124.

---

## Q2 — Stack & design choices

**Stack: Vanilla HTML / CSS / JavaScript — no framework, no build tools.**

The task is a single interactive screen with no routing, no shared state across components, no async data fetching. Reaching for React or Vue would add abstraction without benefit. Vanilla JS keeps the dependency graph at zero (no `node_modules`, no bundler, no version drift) and lets the grader open the file directly in a browser. The calculation logic fits comfortably in one ~250-line file; a framework's component model would only obscure it.

**Decision 1 — Results panel stays sticky on the right column (desktop)**

On a two-column desktop layout the output panel is `position: sticky; top: 20px`. This means a user with a long form (e.g. many presets visible) never loses sight of the live number while they're editing inputs. The alternative — stacking results below inputs — forces scrolling just to see the effect of a change, breaking the "live as you type" feel. On mobile the panel moves to the top of the stack (CSS `order: -1`) so the result is always visible before the user scrolls into the inputs, mimicking how mobile calculator apps work.

**Decision 2 — Ceiling (round-up) rounding displayed with a disclosure note**

Per-person amounts are rounded up to the nearest paise (`Math.ceil(n * 100) / 100`) so the group never underpays the restaurant. When this ceiling produces an overage (e.g. ₹333.34 × 3 = ₹1000.02 vs grand total ₹1000.00) a small amber disclosure note appears below the result rows showing the exact overage. This is placed in the output panel rather than a tooltip because:
1. It's only visible when relevant (it's `hidden` by default).
2. It explains the arithmetic rather than hiding it — a user noticing the per-person × people ≠ grand total otherwise assumes a bug.

---

## Q3 — Responsive & accessibility

**360 px phone:**
- Layout switches to a single column (CSS grid → `1fr`), with the results panel moved to the top via `order: -1`.
- The four preset tip buttons stay in a single row (`grid-template-columns: repeat(4, 1fr)`) with reduced padding — they're still 44 px tall, meeting touch target guidance.
- The hero per-person number scales from 3.2 rem (desktop) down to 2.4 rem using `clamp()`, keeping it readable without overflowing.
- Font sizes use relative units (`clamp`, `rem`) so the layout doesn't break when the user zooms in.
- The virtual keyboard is typed as `inputmode="decimal"` for the bill/tip fields and `inputmode="numeric"` for people, so the mobile keyboard shows the right keypad without a "go" button obscuring the result panel.

**1440 px laptop:**
- Two-column grid, results sticky on the right.
- Ambient gradient blobs visible in the background.
- All interactive targets are ≥ 44 × 44 px.

**Accessibility handled:**
- **Keyboard navigation**: Tab order matches visual flow (bill → tip presets → custom tip → people − → people input → people + → reset). Enter in any text field advances focus to the next field. The stepper buttons support `ArrowUp`/`ArrowDown` in the people input.
- **ARIA live regions**: The output panel has `aria-live="polite"` and `aria-atomic="true"` so screen readers announce updated totals without interrupting the user mid-edit. Inline errors use `role="alert"` and `aria-live="polite"` for immediate announcement.
- **`aria-invalid`**: Set on inputs when they have a validation error; cleared when resolved. `aria-describedby` links each input to its error message element.
- **`aria-pressed`**: Applied to tip preset buttons to communicate selected state to screen readers without relying on visual-only class changes.
- **Color contrast**: All body text on the dark background exceeds WCAG AA 4.5:1. The error red (`#f87171`) against the dark surface is ≥ 4.5:1. Tested with the Chrome DevTools contrast checker.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables all CSS animations and transitions for users who have requested it.
- **Focus indicators**: `:focus-visible` outlines are 2 px solid indigo, clearly visible, and never suppressed.

**Accessibility knowingly skipped:**
- **Full screen-reader testing with a real AT (NVDA/VoiceOver)**: I used ARIA semantics by the spec but did not do end-to-end testing with an actual screen reader beyond browser DevTools accessibility tree inspection. The live region timing (polite vs assertive) may not be optimal for all AT + browser combos. With another day I would run through the full flow in VoiceOver on macOS and NVDA on Windows.

---

## Q4 — AI usage

**Tool used: Antigravity (Google DeepMind agentic AI assistant)**

| What I asked | What it gave me |
|---|---|
| Generate the full project skeleton (HTML structure, CSS design system, JS logic) for the tip calculator | An initial draft with all three files |

**What I changed and why:**

1. **Rounding logic** — The initial output used `Math.round` (round-to-nearest). I changed this to `Math.ceil` (ceiling) and added the disclosure note. The reason: with split bills the most common user complaint is "we paid less than we owed." Ceiling guarantees the restaurant is never shorted. The disclosure note was added because without it a user who multiplies the per-person figure back will notice a discrepancy and think the calculator is wrong.

2. **Mobile layout ordering** — The AI placed results below inputs in the stacked mobile layout. I changed the output panel to `order: -1` so it appears first. On mobile a user types in a small bottom-anchored keyboard that pushes content up; if the result is below the inputs, it gets scrolled off screen. Putting the result first means it's always visible in the viewport above the keyboard.

3. **Hold-to-repeat on stepper buttons** — The initial implementation had simple click handlers on the +/− buttons. I added `mousedown` + `setTimeout` / `setInterval` logic so holding the button rapidly increments/decrements the people count. This is standard UX for steppers (native iOS/Android do this) and makes going from 2 → 12 people practical.

4. **Paste sanitization** — The initial draft had no paste handler on the bill input. I added a `paste` event listener that strips non-numeric characters (e.g. "₹1,234.56" pasted from a chat → "1234.56"). Without this, pasting currency-formatted strings from messaging apps breaks the input.

---

## Q5 — Honest gap

**The rounding disclosure UX is not fully polished.**

The amber note that appears when ceiling rounding creates an overage is functionally correct but visually abrupt — it pops in with a simple fade and the copy is technical ("Total collected: ₹1000.02, +₹0.02 overage"). A real user seeing this for the first time might not understand why there's an overage or what to do with the information.

With another day I would:
1. Rewrite the copy to plain language: *"Each person pays a tiny bit more to avoid fractions of a paise. The extra ₹0.02 can go in the tip jar."*
2. Add a small animated bar chart or breakdown showing each person's exact contribution vs the raw share, so the arithmetic is self-evident.
3. Consider a "distribute remainder" mode as an alternative policy — the first N people pay the ceiling amount and the last person pays slightly less — and let the user toggle between policies.
