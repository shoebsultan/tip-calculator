import HeroCard from './HeroCard';
import ResultRow from './ResultRow';
import RoundingNote from './RoundingNote';
import { formatCurrency, CURRENCY } from '../../utils/calculate';

/**
 * OutputPanel — right glass card showing the live bill breakdown.
 * Uses aria-live="polite" so screen readers announce updates
 * without interrupting the user while they're typing.
 */
export default function OutputPanel({ results, bill, tipPct, people }) {
  const hasValue = !!results;

  const dash = `${CURRENCY} —`;

  return (
    <section
      className="panel output-panel"
      aria-labelledby="results-heading"
      aria-live="polite"
      aria-atomic="true"
    >
      <h2 id="results-heading" className="panel-title">
        <span className="panel-title-icon" aria-hidden="true">✨</span>
        Breakdown
      </h2>

      <HeroCard
        perPerson={results?.perPerson}
        people={people}
        tipPct={tipPct}
        hasValue={hasValue}
      />

      <div className="result-rows" role="list">
        <ResultRow
          dotClass="dot-bill"
          label="Bill Amount"
          value={hasValue ? formatCurrency(bill) : dash}
        />
        <ResultRow
          dotClass="dot-tip"
          label={`Tip (${tipPct}%)`}
          value={hasValue ? formatCurrency(results.tipAmt) : dash}
        />
        <ResultRow
          dotClass="dot-total"
          label="Grand Total"
          value={hasValue ? formatCurrency(results.grand) : dash}
          isTotal
        />
        <div className="result-divider" aria-hidden="true" />
        <ResultRow
          dotClass="dot-split"
          label="People Splitting"
          value={hasValue ? `${people} ${people === 1 ? 'person' : 'people'}` : '—'}
        />
        <ResultRow
          dotClass="dot-tip-pp"
          label="Tip per Person"
          value={hasValue ? formatCurrency(results.perPersonTip) : dash}
        />
      </div>

      {hasValue && results.hasRounding && people > 1 && (
        <RoundingNote
          perPerson={results.perPerson}
          people={people}
          ceilOvershoot={results.ceilOvershoot}
        />
      )}

      {!hasValue && (
        <div className="empty-state" aria-hidden="false">
          <div className="empty-icon" aria-hidden="true">💸</div>
          <p>Fill in the bill amount<br />to see the breakdown</p>
        </div>
      )}
    </section>
  );
}
