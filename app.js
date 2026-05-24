/**
 * SplitWise — Tip Calculator Logic
 * Rounding policy: Math.ceil to nearest paise (2 decimal places)
 * so the group never underpays the restaurant.
 */

'use strict';

/* ──────────────────────────────────────────
   DOM References
────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const billInput      = $('bill-amount');
const customTipInput = $('custom-tip');
const peopleInput    = $('num-people');
const presetBtns     = document.querySelectorAll('.tip-preset-btn');

const billError      = $('bill-error');
const tipError       = $('tip-error');
const peopleError    = $('people-error');

const outBill        = $('out-bill');
const outTip         = $('out-tip');
const outTipPct      = $('out-tip-pct');
const outGrandTotal  = $('out-grand-total');
const outPeople      = $('out-people');
const outTipPerPerson= $('out-tip-per-person');
const perPersonValue = $('per-person-value');
const heroSub        = $('per-person-sub');

const roundingNote   = $('rounding-note');
const roundingText   = $('rounding-note-text');
const emptyState     = $('empty-state');

const decBtn         = $('people-dec');
const incBtn         = $('people-inc');
const resetBtn       = $('reset-btn');

/* ──────────────────────────────────────────
   State
────────────────────────────────────────── */
const state = {
  bill: null,
  tipPct: 20,       // default 20 %
  people: 2,
  activePreset: 20, // tracks which preset is highlighted
};

/* ──────────────────────────────────────────
   Constants
────────────────────────────────────────── */
const MAX_BILL    = 10_000_000; // ₹ 1 crore
const MAX_TIP     = 100;        // 100 % upper bound
const MAX_PEOPLE  = 999;
const CURRENCY    = '₹';

/* ──────────────────────────────────────────
   Formatting helpers
────────────────────────────────────────── */
/**
 * Ceiling to 2 decimal places (paise).
 * e.g. 333.333… → 333.34
 */
function ceilToPaise(n) {
  return Math.ceil(n * 100) / 100;
}

function formatCurrency(n) {
  // Indian number formatting (lakhs/crores)
  return `${CURRENCY} ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ──────────────────────────────────────────
   Validation
────────────────────────────────────────── */
function showError(el, inputEl, msg) {
  el.textContent = msg;
  el.classList.add('visible');
  inputEl.classList.add('has-error');
  inputEl.setAttribute('aria-invalid', 'true');
}

function clearError(el, inputEl) {
  el.textContent = '';
  el.classList.remove('visible');
  inputEl.classList.remove('has-error');
  inputEl.removeAttribute('aria-invalid');
}

function validateBill(raw) {
  const val = raw.trim();
  if (val === '' || val === null) {
    clearError(billError, billInput);
    return null; // no value yet — not an error
  }
  const n = parseFloat(val);
  if (isNaN(n))              { showError(billError, billInput, 'Please enter a valid number'); return false; }
  if (n < 0)                 { showError(billError, billInput, 'Bill amount cannot be negative'); return false; }
  if (n === 0)               { showError(billError, billInput, 'Bill amount must be greater than ₹0'); return false; }
  if (n > MAX_BILL)          { showError(billError, billInput, `Amount too large (max ${CURRENCY}${MAX_BILL.toLocaleString('en-IN')})`); return false; }
  clearError(billError, billInput);
  return n;
}

function validateTip(raw) {
  const val = String(raw).trim();
  if (val === '') {
    clearError(tipError, customTipInput);
    return null;
  }
  const n = parseFloat(val);
  if (isNaN(n))   { showError(tipError, customTipInput, 'Enter a valid tip percentage'); return false; }
  if (n < 0)      { showError(tipError, customTipInput, 'Tip cannot be negative'); return false; }
  if (n > MAX_TIP){ showError(tipError, customTipInput, `Tip cannot exceed ${MAX_TIP}%`); return false; }
  clearError(tipError, customTipInput);
  return n;
}

function validatePeople(raw) {
  const val = String(raw).trim();
  const n = parseInt(val, 10);
  if (val === '' || isNaN(n))  { showError(peopleError, peopleInput, 'Enter the number of people'); return false; }
  if (n < 1)                   { showError(peopleError, peopleInput, 'At least 1 person required'); return false; }
  if (!Number.isInteger(n))    { showError(peopleError, peopleInput, 'Must be a whole number'); return false; }
  if (n > MAX_PEOPLE)          { showError(peopleError, peopleInput, `Max ${MAX_PEOPLE} people`); return false; }
  clearError(peopleError, peopleInput);
  return n;
}

/* ──────────────────────────────────────────
   Update stepper button states
────────────────────────────────────────── */
function updateStepperState() {
  const val = parseInt(peopleInput.value, 10);
  decBtn.disabled = (!val || val <= 1);
  incBtn.disabled = (val >= MAX_PEOPLE);
}

/* ──────────────────────────────────────────
   Animate a value change
────────────────────────────────────────── */
function animateValue(el) {
  el.classList.remove('num-updated');
  // Force reflow
  void el.offsetWidth;
  el.classList.add('num-updated');
}

/* ──────────────────────────────────────────
   Core calculation & render
────────────────────────────────────────── */
function calculate() {
  const bill   = validateBill(billInput.value);
  const tip    = validateTip(customTipInput.value !== '' ? customTipInput.value : state.tipPct);
  const people = validatePeople(peopleInput.value);

  // sync state
  if (typeof bill === 'number')   state.bill   = bill;
  if (typeof tip === 'number')    state.tipPct = tip;
  if (typeof people === 'number') state.people  = people;

  // Hide empty state only when bill is a valid positive number
  const hasValidBill = typeof bill === 'number' && bill > 0;
  emptyState.setAttribute('aria-hidden', hasValidBill ? 'true' : 'false');

  if (!hasValidBill || bill === false || tip === false || people === false) {
    if (!hasValidBill) renderEmpty();
    return;
  }

  const tipAmt   = bill * (state.tipPct / 100);
  const grand    = bill + tipAmt;

  // Per-person: ceiling to 2dp so total never underpays
  const perPerson = ceilToPaise(grand / state.people);
  const perPersonTip = ceilToPaise(tipAmt / state.people);

  // Detect rounding overshoot
  const rawPerPerson = grand / state.people;
  const ceilOvershoot = (perPerson * state.people) - grand;
  const hasRounding = Math.abs(rawPerPerson - perPerson) > 0.001;

  // Render
  outBill.textContent         = formatCurrency(bill);
  outTip.textContent          = formatCurrency(tipAmt);
  outTipPct.textContent       = state.tipPct % 1 === 0 ? state.tipPct : state.tipPct.toFixed(1);
  outGrandTotal.textContent   = formatCurrency(grand);
  outPeople.textContent       = `${state.people} ${state.people === 1 ? 'person' : 'people'}`;
  outTipPerPerson.textContent = formatCurrency(perPersonTip);

  const newVal = perPerson.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (perPersonValue.textContent !== newVal) {
    perPersonValue.textContent = newVal;
    animateValue(perPersonValue);
  }

  heroSub.textContent = `each of ${state.people} ${state.people === 1 ? 'person' : 'people'} · ${state.tipPct}% tip`;

  // Rounding note
  if (hasRounding && state.people > 1) {
    const extra = (ceilOvershoot).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    roundingText.textContent = `Rounded up to nearest paise. Total collected: ${CURRENCY}${(perPerson * state.people).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (+${CURRENCY}${extra} overage).`;
    roundingNote.hidden = false;
  } else {
    roundingNote.hidden = true;
  }
}

function renderEmpty() {
  perPersonValue.textContent   = '—';
  heroSub.textContent          = 'Enter a bill amount to start';
  outBill.textContent          = `${CURRENCY} —`;
  outTip.textContent           = `${CURRENCY} —`;
  outGrandTotal.textContent    = `${CURRENCY} —`;
  outPeople.textContent        = '—';
  outTipPerPerson.textContent  = `${CURRENCY} —`;
  outTipPct.textContent        = '0';
  roundingNote.hidden          = true;
}

/* ──────────────────────────────────────────
   Preset Buttons
────────────────────────────────────────── */
function setActivePreset(pct) {
  presetBtns.forEach(btn => {
    const isActive = Number(btn.dataset.tip) === pct;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
  state.activePreset = pct;
}

function clearPresets() {
  presetBtns.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  state.activePreset = null;
}

presetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const pct = Number(btn.dataset.tip);
    state.tipPct = pct;
    customTipInput.value = '';
    clearError(tipError, customTipInput);
    setActivePreset(pct);
    calculate();
  });
});

/* ──────────────────────────────────────────
   Input Events
────────────────────────────────────────── */
billInput.addEventListener('input', () => {
  calculate();
});

// Sanitize pasted text (strip non-numeric except decimal)
billInput.addEventListener('paste', e => {
  e.preventDefault();
  const text = (e.clipboardData || window.clipboardData).getData('text');
  const cleaned = text.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  const safe = parts.length > 1
    ? parts[0] + '.' + parts.slice(1).join('')
    : parts[0];
  billInput.value = safe;
  calculate();
});

customTipInput.addEventListener('input', () => {
  const val = customTipInput.value;
  if (val !== '') {
    clearPresets();
  } else {
    // Restore last active preset
    if (state.activePreset !== null) setActivePreset(state.activePreset);
  }
  calculate();
});

customTipInput.addEventListener('blur', () => {
  if (customTipInput.value === '' && state.activePreset !== null) {
    state.tipPct = state.activePreset;
    setActivePreset(state.activePreset);
    calculate();
  }
});

peopleInput.addEventListener('input', () => {
  // Sanitize: allow only integers
  const raw = peopleInput.value;
  const cleaned = raw.replace(/[^0-9]/g, '');
  if (cleaned !== raw) peopleInput.value = cleaned;
  updateStepperState();
  calculate();
});

/* ──────────────────────────────────────────
   Stepper Buttons
────────────────────────────────────────── */
decBtn.addEventListener('click', () => {
  const curr = parseInt(peopleInput.value, 10) || 1;
  if (curr > 1) {
    peopleInput.value = curr - 1;
    updateStepperState();
    calculate();
  }
});

incBtn.addEventListener('click', () => {
  const curr = parseInt(peopleInput.value, 10) || 1;
  if (curr < MAX_PEOPLE) {
    peopleInput.value = curr + 1;
    updateStepperState();
    calculate();
  }
});

// Hold-to-repeat for stepper buttons
let holdTimer = null;
let holdInterval = null;

function startHold(btn, action) {
  action();
  holdTimer = setTimeout(() => {
    holdInterval = setInterval(action, 80);
  }, 400);
}

function stopHold() {
  clearTimeout(holdTimer);
  clearInterval(holdInterval);
}

decBtn.addEventListener('mousedown', () => startHold(decBtn, () => {
  const curr = parseInt(peopleInput.value, 10) || 1;
  if (curr > 1) { peopleInput.value = curr - 1; updateStepperState(); calculate(); }
}));
incBtn.addEventListener('mousedown', () => startHold(incBtn, () => {
  const curr = parseInt(peopleInput.value, 10) || 1;
  if (curr < MAX_PEOPLE) { peopleInput.value = curr + 1; updateStepperState(); calculate(); }
}));
[decBtn, incBtn].forEach(btn => {
  btn.addEventListener('mouseup', stopHold);
  btn.addEventListener('mouseleave', stopHold);
  btn.addEventListener('touchend', stopHold);
});

// Keyboard: up/down arrows in people input
peopleInput.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    const curr = parseInt(peopleInput.value, 10) || 0;
    if (curr < MAX_PEOPLE) { peopleInput.value = curr + 1; updateStepperState(); calculate(); }
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const curr = parseInt(peopleInput.value, 10) || 2;
    if (curr > 1) { peopleInput.value = curr - 1; updateStepperState(); calculate(); }
  }
});

/* ──────────────────────────────────────────
   Reset
────────────────────────────────────────── */
function resetAll() {
  billInput.value      = '';
  customTipInput.value = '';
  peopleInput.value    = '2';

  clearError(billError, billInput);
  clearError(tipError, customTipInput);
  clearError(peopleError, peopleInput);

  state.bill        = null;
  state.tipPct      = 20;
  state.people      = 2;
  state.activePreset= 20;

  setActivePreset(20);
  updateStepperState();
  renderEmpty();

  emptyState.setAttribute('aria-hidden', 'false');
  roundingNote.hidden = true;

  // Focus back to first input
  billInput.focus();

  // Brief flash animation on reset button
  resetBtn.style.transform = 'scale(0.97)';
  setTimeout(() => { resetBtn.style.transform = ''; }, 150);
}

resetBtn.addEventListener('click', resetAll);

/* ──────────────────────────────────────────
   Keyboard: Enter advances focus
────────────────────────────────────────── */
const focusOrder = [billInput, customTipInput, peopleInput, resetBtn];
focusOrder.forEach((el, i) => {
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' && el !== resetBtn) {
      e.preventDefault();
      focusOrder[i + 1]?.focus();
    }
  });
});

/* ──────────────────────────────────────────
   Init
────────────────────────────────────────── */
setActivePreset(20);
updateStepperState();
renderEmpty();
