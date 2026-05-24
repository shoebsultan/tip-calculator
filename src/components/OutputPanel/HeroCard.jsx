import { useRef, useEffect } from 'react';

/**
 * Hero card showing the per-person amount — the dominant visual.
 * Triggers a CSS pop animation whenever the displayed value changes.
 */
export default function HeroCard({ perPerson, people, tipPct, hasValue }) {
  const valueRef = useRef(null);
  const prevValue = useRef(null);

  const displayed = hasValue
    ? perPerson.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '—';

  useEffect(() => {
    if (hasValue && displayed !== prevValue.current && valueRef.current) {
      valueRef.current.classList.remove('num-updated');
      void valueRef.current.offsetWidth; // force reflow
      valueRef.current.classList.add('num-updated');
    }
    prevValue.current = displayed;
  }, [displayed, hasValue]);

  const subText = hasValue
    ? `each of ${people} ${people === 1 ? 'person' : 'people'} · ${tipPct}% tip`
    : 'Enter a bill amount to start';

  return (
    <div className="hero-card" aria-label="Per person total">
      <div className="hero-label">Per Person</div>
      <div className="hero-amount" aria-live="polite">
        <span className="hero-currency">₹</span>
        <span className="hero-value" ref={valueRef} id="per-person-value">
          {displayed}
        </span>
      </div>
      <div className="hero-sub">{subText}</div>
    </div>
  );
}
