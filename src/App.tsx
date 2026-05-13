import { useEffect, useMemo, useState } from 'react';
import ArchitectureCanvas from './components/ArchitectureCanvas';
import Controls from './components/Controls';
import Inspector from './components/Inspector';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';
import { components, glossaryTerms, walkthroughSteps } from './data/glossary';
import type { ComponentId, ViewMode } from './types/domain';

const AUTO_ADVANCE_MS = 5200;

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedId, setSelectedId] = useState<ComponentId>('cpu');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('architecture');
  const [query, setQuery] = useState('');

  const step = walkthroughSteps[currentStep];
  const selectedComponent = components.find((component) => component.id === selectedId) ?? components[0];
  const selectedTerms = useMemo(
    () => glossaryTerms.filter((term) => selectedComponent.glossaryIds.includes(term.id)),
    [selectedComponent],
  );

  useEffect(() => {
    const firstActive = step.activeComponents[0];
    if (firstActive) setSelectedId(firstActive);
  }, [currentStep, step.activeComponents]);

  useEffect(() => {
    if (!isPlaying || !hasStarted) return;
    const timer = window.setTimeout(() => {
      setCurrentStep((value) => (value + 1) % walkthroughSteps.length);
    }, AUTO_ADVANCE_MS / speed);
    return () => window.clearTimeout(timer);
  }, [currentStep, hasStarted, isPlaying, speed]);

  function beginWalkthrough() {
    setHasStarted(true);
    setIsPlaying(true);
    setCurrentStep(0);
  }

  function nextStep() {
    setCurrentStep((value) => Math.min(value + 1, walkthroughSteps.length - 1));
  }

  function prevStep() {
    setCurrentStep((value) => Math.max(value - 1, 0));
  }

  function reset() {
    setCurrentStep(0);
    setSelectedId('cpu');
    setIsPlaying(false);
    setViewMode('architecture');
  }

  return (
    <main className="min-h-screen bg-[#05070b] text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(237,28,36,0.2),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(53,213,255,0.13),transparent_24%),linear-gradient(180deg,#05070b,#090b12_55%,#05070b)]" />

      {!hasStarted ? (
        <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
          <div className="rounded-full border border-amd-red/30 bg-amd-red/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.35em] text-red-100 shadow-glow">
            Interactive GPU architecture explainer
          </div>
          <h1 className="mt-8 max-w-4xl text-6xl font-black tracking-tight text-white md:text-8xl">
            Inside an <span className="bg-gradient-to-r from-amd-red via-amd-orange to-amd-gold bg-clip-text text-transparent">AMD GPU</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Walk a kernel from CPU dispatch to wavefront scheduling, execution units, local data share, caches, VRAM, and final writeback. Click any block to inspect AMD-specific terminology and family notes.
          </p>
          <button
            type="button"
            onClick={beginWalkthrough}
            className="mt-10 rounded-2xl border border-amd-red bg-amd-red px-8 py-4 text-lg font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-red-500"
          >
            Begin walkthrough
          </button>
          <p className="mt-6 max-w-2xl text-sm text-slate-500">
            Built with technical assumptions noted inline: WGP is shown as an RDNA/Radeon grouping of two CUs, while Instinct/CDNA cache and die terminology can differ.
          </p>
        </section>
      ) : (
        <div className="mx-auto grid max-w-[1800px] gap-4 p-4 xl:grid-cols-[330px_minmax(720px,1fr)_360px]">
          <header className="xl:col-span-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-amd-panel/80 p-5 backdrop-blur">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.35em] text-amd-red">Inside an AMD GPU</p>
                  <h1 className="mt-2 text-3xl font-black text-white md:text-5xl">Architecture and execution flow</h1>
                  <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
                    Follow visible execution particles and memory particles as GPU work moves from CPU launch to grid, work-groups, wavefronts, CUs/WGPs, execution units, caches, VRAM, and writeback.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-slate-300">
                  <span className="font-mono text-amd-muted">Step {currentStep + 1} / {walkthroughSteps.length}</span>
                  <p className="mt-1 font-semibold text-white">{step.title}</p>
                </div>
              </div>
            </div>
          </header>

          <Sidebar
            steps={walkthroughSteps}
            currentStep={currentStep}
            onStepSelect={(index) => {
              setCurrentStep(index);
              setIsPlaying(false);
            }}
            glossary={glossaryTerms}
            query={query}
            setQuery={setQuery}
            components={components}
            onComponentSelect={setSelectedId}
          />

          <div className="flex flex-col gap-4">
            <ArchitectureCanvas
              components={components}
              selectedId={selectedId}
              step={step}
              viewMode={viewMode}
              isPlaying={isPlaying}
              speed={speed}
              onSelect={setSelectedId}
            />
            <Timeline activeIndex={step.timelineIndex} />
            <Controls
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying((value) => !value)}
              onPrev={prevStep}
              onNext={nextStep}
              onReset={reset}
              speed={speed}
              setSpeed={setSpeed}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>

          <Inspector component={selectedComponent} terms={selectedTerms} step={step} />
        </div>
      )}
    </main>
  );
}
