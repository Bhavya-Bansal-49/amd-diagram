import { BookOpen, ListChecks, Search } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import type { ArchitectureComponent, ComponentId, GlossaryTerm, WalkthroughStep } from '../types/domain';

interface SidebarProps {
  steps: WalkthroughStep[];
  currentStep: number;
  onStepSelect: (index: number) => void;
  glossary: GlossaryTerm[];
  query: string;
  setQuery: (value: string) => void;
  components: ArchitectureComponent[];
  onComponentSelect: (id: ComponentId) => void;
}

type SidebarTab = 'steps' | 'glossary';

export default function Sidebar({ steps, currentStep, onStepSelect, glossary, query, setQuery, components, onComponentSelect }: SidebarProps) {
  const [tab, setTab] = useState<SidebarTab>('steps');
  const filtered = useMemo(
    () =>
      glossary.filter((item) => {
        const haystack = [item.term, ...item.aliases, item.definition, item.architectureNote ?? ''].join(' ').toLowerCase();
        return haystack.includes(query.toLowerCase());
      }),
    [glossary, query],
  );

  return (
    <aside className="flex min-h-0 flex-col rounded-[1.5rem] border border-white/10 bg-amd-panel/85 p-3 backdrop-blur xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)]">
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/25 p-1">
        <TabButton active={tab === 'steps'} onClick={() => setTab('steps')} icon={<ListChecks className="h-4 w-4" />} label="Steps" />
        <TabButton active={tab === 'glossary'} onClick={() => setTab('glossary')} icon={<BookOpen className="h-4 w-4" />} label="Glossary" />
      </div>

      {tab === 'steps' ? (
        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <div className="flex items-end justify-between gap-3 px-1">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-amd-red">Walkthrough</p>
              <p className="mt-1 text-xs text-slate-500">Compact list keeps the glossary one click away.</p>
            </div>
            <p className="font-mono text-xs text-amd-muted">{currentStep + 1}/{steps.length}</p>
          </div>
          <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => onStepSelect(index)}
                className={`group grid w-full grid-cols-[2.35rem_1fr] items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                  currentStep === index ? 'border-amd-red bg-amd-red/15 text-white shadow-glow' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:bg-white/[0.06]'
                }`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-[11px] ${currentStep === index ? 'border-amd-red/50 bg-amd-red/20 text-white' : 'border-white/10 bg-black/20 text-amd-muted'}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold leading-tight">{step.title}</span>
                  <span className="mt-1 block truncate text-[11px] text-slate-500">{step.particleKind} · stage {step.timelineIndex + 1}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <div className="px-1">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-amd-cyan">Glossary</p>
            <label className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-slate-300 focus-within:border-amd-cyan">
              <Search className="h-4 w-4 text-amd-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search AMD terms..."
                className="w-full bg-transparent outline-none placeholder:text-slate-500"
              />
            </label>
          </div>
          <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {filtered.map((term) => {
              const component = components.find((item) => item.glossaryIds.includes(term.id));
              return (
                <button
                  key={term.id}
                  type="button"
                  onClick={() => component && onComponentSelect(component.id)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-amd-cyan/60 hover:bg-amd-cyan/10"
                >
                  <span className="text-sm font-semibold text-white">{term.term}</span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-slate-400">{term.definition}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
        active ? 'bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]' : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
