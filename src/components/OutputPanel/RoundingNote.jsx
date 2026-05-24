import { CURRENCY } from '../../utils/calculate';

/**
 * Amber disclosure banner explaining ceiling rounding overage.
 * Only rendered when perPerson × people > grand total.
 */
export default function RoundingNote({ perPerson, people, ceilOvershoot }) {
  const totalCollected = (perPerson * people).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const extra = ceilOvershoot.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="rounding-note" aria-live="polite">
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <span>
        Rounded up to nearest paise. Total collected:{' '}
        <strong>
          {CURRENCY}{totalCollected}
        </strong>{' '}
        (+{CURRENCY}{extra} overage — extra can go in the tip jar).
      </span>
    </div>
  );
}
