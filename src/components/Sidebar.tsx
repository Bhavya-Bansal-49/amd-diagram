import { Search } from 'lucide-react';
import type { ComponentId, GlossaryTerm, WalkthroughStep } from '../types/domain';
import type { ArchitectureComponent } from '../types/domain';

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

export default function Sidebar({ steps, currentStep, onStepSelect, glossary, query, setQuery, components, onComponentSelect }: SidebarProps) {
  const filtered = glossary.filter((item) => {
    const haystack = [item.term, ...item.aliases, item.definition, item.architectureNote ?? ''].join(' ').toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <aside className="flex min-h-0 flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-amd-panel/85 p-4 backdrop-blur">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-amd-red">Walkthrough</p>
        <div className="mt-3 space-y-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepSelect(index)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                currentStep === index ? 'border-amd-red bg-amd-red/15 text-white' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25'
              }`}
            >
              <span className="font-mono text-[10px] text-amd-muted">STEP {String(index + 1).padStart(2, '0')}</span>
              <span className="mt-1 block text-sm font-medium leading-snug">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 border-t border-white/10 pt-4">
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
        <div className="mt-3 max-h-[470px] space-y-2 overflow-y-auto pr-1">
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
    </aside>
  );
}
