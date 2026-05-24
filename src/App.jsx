import { useCalculator } from './hooks/useCalculator';
import Header from './components/Header';
import Footer from './components/Footer';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';

/**
 * Background ambient blobs — purely decorative.
 */
function BackgroundBlobs() {
  return (
    <>
      <div className="bg-blob blob-1" aria-hidden="true" />
      <div className="bg-blob blob-2" aria-hidden="true" />
      <div className="bg-blob blob-3" aria-hidden="true" />
    </>
  );
}

/**
 * App root — thin orchestration layer.
 * All state lives in useCalculator; this component only wires props.
 */
export default function App() {
  const calc = useCalculator();

  return (
    <>
      <BackgroundBlobs />

      <div className="app-wrapper">
        <Header />

        <main className="app-main" id="main-content">
          <div className="calculator-layout">
            <InputPanel
              billRaw={calc.billRaw}
              billError={calc.billError}
              activePreset={calc.activePreset}
              customTipRaw={calc.customTipRaw}
              tipError={calc.tipError}
              peopleRaw={calc.peopleRaw}
              peopleError={calc.peopleError}
              onBillChange={calc.handleBillChange}
              onBillPaste={calc.handleBillPaste}
              onPresetSelect={calc.handlePresetSelect}
              onCustomTipChange={calc.handleCustomTipChange}
              onCustomTipBlur={calc.handleCustomTipBlur}
              onPeopleChange={calc.handlePeopleChange}
              onPeopleStep={calc.handlePeopleStep}
              onReset={calc.handleReset}
            />

            <OutputPanel
              results={calc.results}
              bill={calc.bill}
              tipPct={calc.tipPct}
              people={calc.people ?? 2}
            />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
