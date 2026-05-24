/**
 * A single labelled result row in the breakdown list.
 */
export default function ResultRow({ dotClass, label, value, isTotal = false }) {
  return (
    <div className={`result-row${isTotal ? ' result-row-total' : ''}`} role="listitem">
      <div className="result-row-label">
        <span className={`result-dot ${dotClass}`} aria-hidden="true" />
        {label}
      </div>
      <div className="result-row-value">{value}</div>
    </div>
  );
}
