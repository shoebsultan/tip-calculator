import BillInput from './BillInput';
import TipSelector from './TipSelector';
import PeopleStepper from './PeopleStepper';

/**
 * InputPanel — left glass card containing all user inputs.
 */
export default function InputPanel({
  billRaw, billError,
  activePreset, customTipRaw, tipError,
  peopleRaw, peopleError,
  onBillChange, onBillPaste,
  onPresetSelect, onCustomTipChange, onCustomTipBlur,
  onPeopleChange, onPeopleStep,
  onReset,
}) {
  return (
    <section className="panel input-panel" aria-labelledby="inputs-heading">
      <h1 id="inputs-heading" className="panel-title">
        <span className="panel-title-icon" aria-hidden="true">📝</span>
        Enter Details
      </h1>

      <BillInput
        value={billRaw}
        error={billError}
        onChange={onBillChange}
        onPaste={onBillPaste}
      />

      <TipSelector
        activePreset={activePreset}
        customTipRaw={customTipRaw}
        tipError={tipError}
        onPresetSelect={onPresetSelect}
        onCustomChange={onCustomTipChange}
        onCustomBlur={onCustomTipBlur}
      />

      <PeopleStepper
        value={peopleRaw}
        error={peopleError}
        onChange={onPeopleChange}
        onStep={onPeopleStep}
      />

      <button
        type="button"
        className="reset-btn"
        id="reset-btn"
        onClick={onReset}
        aria-label="Reset all fields to default values"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 4l3.5 3.5M4 4v4.5h4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 10a6 6 0 11-9.5-4.9" strokeLinecap="round" />
        </svg>
        Reset Calculator
      </button>
    </section>
  );
}
