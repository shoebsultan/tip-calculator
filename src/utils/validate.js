export const MAX_BILL = 10_000_000;   // ₹1 crore
export const MAX_TIP = 100;           // 100%
export const MAX_PEOPLE = 999;

/**
 * Validates the bill amount string.
 * Returns { value: number|null, error: string|null }
 */
export function validateBill(raw) {
  const val = String(raw ?? '').trim();
  if (!val) return { value: null, error: null };

  const n = parseFloat(val);
  if (isNaN(n))  return { value: null, error: 'Please enter a valid number' };
  if (n < 0)     return { value: null, error: 'Bill amount cannot be negative' };
  if (n === 0)   return { value: null, error: 'Bill amount must be greater than ₹0' };
  if (n > MAX_BILL)
    return { value: null, error: `Amount too large (max ₹${MAX_BILL.toLocaleString('en-IN')})` };

  return { value: n, error: null };
}

/**
 * Validates a tip percentage string (only used for the custom input).
 * Returns { value: number|null, error: string|null }
 */
export function validateTip(raw) {
  const val = String(raw ?? '').trim();
  if (!val) return { value: null, error: null };

  const n = parseFloat(val);
  if (isNaN(n)) return { value: null, error: 'Enter a valid tip percentage' };
  if (n < 0)    return { value: null, error: 'Tip cannot be negative' };
  if (n > MAX_TIP)
    return { value: null, error: `Tip cannot exceed ${MAX_TIP}%` };

  return { value: n, error: null };
}

/**
 * Validates the number of people string.
 * Returns { value: number|null, error: string|null }
 */
export function validatePeople(raw) {
  const val = String(raw ?? '').trim();
  if (!val) return { value: null, error: 'Enter the number of people' };

  const n = parseInt(val, 10);
  if (isNaN(n) || String(n) !== val.replace(/^0+/, '') && val !== '0')
    return { value: null, error: 'Must be a whole number' };
  if (n < 1)         return { value: null, error: 'At least 1 person required' };
  if (n > MAX_PEOPLE) return { value: null, error: `Max ${MAX_PEOPLE} people` };

  return { value: n, error: null };
}
