export const CURRENCY = '₹';

/**
 * Rounding policy: ceiling to nearest paise (2 decimal places).
 * The group never underpays the restaurant.
 * e.g. 333.333… → 333.34
 */
export function ceilToPaise(n) {
  return Math.ceil(n * 100) / 100;
}

/**
 * Indian locale currency formatting.
 * e.g. 12500 → "₹ 12,500.00"
 */
export function formatCurrency(n) {
  return `${CURRENCY} ${n.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Compute all derived values from validated inputs.
 * @param {number} bill   - positive bill amount
 * @param {number} tipPct - tip percentage (≥ 0)
 * @param {number} people - number of people (≥ 1)
 */
export function computeResults(bill, tipPct, people) {
  const tipAmt = bill * (tipPct / 100);
  const grand = bill + tipAmt;

  // Per-person ceiling to 2dp
  const rawPerPerson = grand / people;
  const perPerson = ceilToPaise(rawPerPerson);
  const perPersonTip = ceilToPaise(tipAmt / people);

  const hasRounding = Math.abs(rawPerPerson - perPerson) > 0.001;
  const ceilOvershoot = perPerson * people - grand;

  return { tipAmt, grand, perPerson, perPersonTip, hasRounding, ceilOvershoot };
}
