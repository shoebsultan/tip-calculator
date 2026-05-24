import { useRef, useCallback } from 'react';
import { MAX_PEOPLE } from '../../utils/validate';

const HOLD_DELAY = 400;   // ms before repeat starts
const HOLD_RATE  = 80;    // ms between steps while held

/**
 * People stepper with +/- buttons.
 * Supports:
 *   - Click to step by 1
 *   - Hold to repeat (accelerated after HOLD_DELAY)
 *   - ArrowUp / ArrowDown keyboard in the text input
 */
export default function PeopleStepper({ value, error, onChange, onStep }) {
  const holdTimer = useRef(null);
  const holdInterval = useRef(null);
  const count = parseInt(value, 10) || 1;

  const startHold = useCallback((delta) => {
    onStep(delta);
    holdTimer.current = setTimeout(() => {
      holdInterval.current = setInterval(() => onStep(delta), HOLD_RATE);
    }, HOLD_DELAY);
  }, [onStep]);

  const stopHold = useCallback(() => {
    clearTimeout(holdTimer.current);
    clearInterval(holdInterval.current);
  }, []);

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp')   { e.preventDefault(); onStep(1); }
    if (e.key === 'ArrowDown') { e.preventDefault(); onStep(-1); }
  }

  return (
    <div className="field-group">
      <label className="field-label" htmlFor="num-people">
        Number of People
        <span className="field-hint">How many are splitting?</span>
      </label>

      <div className="people-control">
        {/* Decrement */}
        <button
          type="button"
          id="people-dec"
          className="stepper-btn stepper-dec"
          aria-label="Decrease number of people"
          aria-controls="num-people"
          disabled={count <= 1}
          onMouseDown={() => startHold(-1)}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={() => startHold(-1)}
          onTouchEnd={stopHold}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <rect x="4" y="9" width="12" height="2" rx="1" />
          </svg>
        </button>

        {/* Input */}
        <input
          id="num-people"
          type="text"
          inputMode="numeric"
          className={`field-input people-input${error ? ' has-error' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-describedby="people-error"
          aria-required="true"
          aria-label="Number of people"
          aria-invalid={!!error}
        />

        {/* Increment */}
        <button
          type="button"
          id="people-inc"
          className="stepper-btn stepper-inc"
          aria-label="Increase number of people"
          aria-controls="num-people"
          disabled={count >= MAX_PEOPLE}
          onMouseDown={() => startHold(1)}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={() => startHold(1)}
          onTouchEnd={stopHold}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
          </svg>
        </button>
      </div>

      <div
        id="people-error"
        className={`field-error${error ? ' visible' : ''}`}
        role="alert"
        aria-live="polite"
      >
        {error || ''}
      </div>
    </div>
  );
}
