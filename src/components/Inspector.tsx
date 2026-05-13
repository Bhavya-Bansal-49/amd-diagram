import type { ArchitectureComponent, GlossaryTerm, WalkthroughStep } from '../types/domain';

interface InspectorProps {
  component: ArchitectureComponent;
  terms: GlossaryTerm[];
  step: WalkthroughStep;
}

export default function Inspector({ component, terms, step }: InspectorProps) {
  return (
    <aside className="rounded-[1.5rem] border border-white/10 bg-amd-panel/85 p-5 backdrop-blur">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-amd-orange">Inspector</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">{component.title}</h2>
      <p className="mt-1 text-sm text-slate-400">{component.subtitle}</p>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-amd-muted">Current flow role</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{step.description}</p>
      </div>

      <div className="mt-4 space-y-4">
        {terms.map((term) => (
          <article key={term.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <h3 className="text-base font-semibold text-white">{term.term}</h3>
            {term.aliases.length ? <p className="mt-1 font-mono text-[11px] text-amd-muted">Also: {term.aliases.join(' · ')}</p> : null}
            <InfoBlock title="Short definition" body={term.definition} />
            <InfoBlock title="Why it matters" body={term.whyItMatters} />
            <InfoBlock title="Where it appears in the flow" body={term.flowRole} />
            <div className="mt-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amd-muted">Related components</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {term.related.map((related) => (
                  <span key={related} className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[11px] text-slate-300">
                    {related}
                  </span>
                ))}
              </div>
            </div>
            {term.architectureNote ? (
              <div className="mt-3 rounded-xl border border-amd-orange/20 bg-amd-orange/10 p-3 text-xs leading-relaxed text-amber-100">
                <span className="font-semibold text-amd-orange">Architecture note: </span>
                {term.architectureNote}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </aside>
  );
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-amd-muted">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-300">{body}</p>
    </div>
  );
}
