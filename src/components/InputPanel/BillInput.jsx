/**
 * Bill amount input with currency symbol and inline validation.
 * Sanitises paste events to strip non-numeric characters.
 */
export default function BillInput({ value, error, onChange, onPaste }) {
  function handlePaste(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    onPaste(text);
  }

  return (
    <div className="field-group">
      <label className="field-label" htmlFor="bill-amount">
        Bill Amount
        <span className="field-hint">Enter the total before tip</span>
      </label>

      <div className={`input-wrapper currency-wrapper ${error ? 'has-error' : ''}`}>
        <span className="currency-symbol" aria-hidden="true">₹</span>
        <input
          id="bill-amount"
          type="text"
          inputMode="decimal"
          className={`field-input${error ? ' has-error' : ''}`}
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          autoComplete="off"
          aria-describedby="bill-error"
          aria-required="true"
          aria-invalid={!!error}
        />
      </div>

      <div
        id="bill-error"
        className={`field-error${error ? ' visible' : ''}`}
        role="alert"
        aria-live="polite"
      >
        {error || ''}
      </div>
    </div>
  );
}
