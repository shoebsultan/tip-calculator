import { useState, useMemo, useCallback } from 'react';
import { validateBill, validateTip, validatePeople } from '../utils/validate';
import { computeResults } from '../utils/calculate';

const DEFAULT_PRESET = 20;

/**
 * Central state and logic hook for the tip calculator.
 * All raw string inputs are stored so inputs remain controlled without
 * fighting the browser's number-input behaviour.
 */
export function useCalculator() {
  const [billRaw, setBillRaw] = useState('');
  const [customTipRaw, setCustomTipRaw] = useState('');
  const [peopleRaw, setPeopleRaw] = useState('2');
  const [activePreset, setActivePreset] = useState(DEFAULT_PRESET);

  /* ── Validation (memoised) ── */
  const billV = useMemo(() => validateBill(billRaw), [billRaw]);

  const tipV = useMemo(() => {
    if (customTipRaw !== '') return validateTip(customTipRaw);
    // Preset is always a known-good number
    return { value: activePreset, error: null };
  }, [customTipRaw, activePreset]);

  const peopleV = useMemo(() => validatePeople(peopleRaw), [peopleRaw]);

  /* ── Effective tip % label ── */
  const tipPct = tipV.value ?? DEFAULT_PRESET;

  /* ── Results (only when all inputs are valid) ── */
  const results = useMemo(() => {
    if (!billV.value || billV.error || tipV.error || peopleV.error || !peopleV.value) return null;
    return computeResults(billV.value, tipV.value, peopleV.value);
  }, [billV, tipV, peopleV]);

  /* ── Handlers ── */
  const handleBillChange = useCallback((val) => {
    // Strip anything that isn't a digit or decimal point; allow only one dot
    const cleaned = val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    setBillRaw(cleaned);
  }, []);

  const handleBillPaste = useCallback((text) => {
    const cleaned = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    setBillRaw(cleaned);
  }, []);

  const handleCustomTipChange = useCallback((val) => {
    setCustomTipRaw(val);
    if (val !== '') setActivePreset(null);
  }, []);

  const handleCustomTipBlur = useCallback(() => {
    // If custom input is cleared, restore last active preset display
    if (customTipRaw === '' && activePreset === null) {
      setActivePreset(DEFAULT_PRESET);
    }
  }, [customTipRaw, activePreset]);

  const handlePresetSelect = useCallback((pct) => {
    setActivePreset(pct);
    setCustomTipRaw('');
  }, []);

  const handlePeopleChange = useCallback((val) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    setPeopleRaw(cleaned);
  }, []);

  const handlePeopleStep = useCallback((delta) => {
    setPeopleRaw((prev) => {
      const curr = parseInt(prev, 10) || 1;
      const next = Math.max(1, Math.min(999, curr + delta));
      return String(next);
    });
  }, []);

  const handleReset = useCallback(() => {
    setBillRaw('');
    setCustomTipRaw('');
    setPeopleRaw('2');
    setActivePreset(DEFAULT_PRESET);
  }, []);

  return {
    // Raw controlled values
    billRaw,
    customTipRaw,
    peopleRaw,
    activePreset,
    tipPct,

    // Validation errors (null = no error)
    billError: billV.error,
    tipError: tipV.error,
    peopleError: peopleV.error,

    // Validated scalar values
    bill: billV.value,
    people: peopleV.value,

    // Computed breakdown (null when inputs invalid/empty)
    results,

    // Event handlers
    handleBillChange,
    handleBillPaste,
    handleCustomTipChange,
    handleCustomTipBlur,
    handlePresetSelect,
    handlePeopleChange,
    handlePeopleStep,
    handleReset,
  };
}
