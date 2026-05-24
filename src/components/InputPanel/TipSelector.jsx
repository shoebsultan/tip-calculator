const PRESETS = [10, 15, 20, 25];

/**
 * Tip selector: preset buttons + custom percentage input.
 * Preset buttons use aria-pressed to convey active state to screen readers.
 */
export default function TipSelector({
  activePreset,
  customTipRaw,
  tipError,
  onPresetSelect,
  onCustomChange,
  onCustomBlur,
}) {
  return (
    <div className="field-group">
      <label className="field-label" htmlFor="custom-tip">
        Tip Percentage
        <span className="field-hint">Select a preset or enter custom</span>
      </label>

      {/* Preset buttons */}
      <div className="tip-presets" role="group" aria-label="Tip percentage presets">
        {PRESETS.map((pct) => (
          <button
            key={pct}
            type="button"
            id={`tip-preset-${pct}`}
            className={`tip-preset-btn${activePreset === pct ? ' active' : ''}`}
            aria-pressed={activePreset === pct}
            onClick={() => onPresetSelect(pct)}
          >
            {pct}%
          </button>
        ))}
      </div>

      {/* Custom tip input */}
      <div className="input-wrapper custom-tip-wrapper">
        <input
          id="custom-tip"
          type="number"
          inputMode="decimal"
          className={`field-input custom-tip-input${tipError ? ' has-error' : ''}`}
          placeholder="Custom %"
          value={customTipRaw}
          min="0"
          max="100"
          step="0.1"
          onChange={(e) => onCustomChange(e.target.value)}
          onBlur={onCustomBlur}
          autoComplete="off"
          aria-describedby="tip-error"
          aria-label="Custom tip percentage"
          aria-invalid={!!tipError}
        />
        <span className="input-suffix" aria-hidden="true">%</span>
      </div>

      <div
        id="tip-error"
        className={`field-error${tipError ? ' visible' : ''}`}
        role="alert"
        aria-live="polite"
      >
        {tipError || ''}
      </div>
    </div>
  );
}
