import { timelineStages } from '../data/glossary';

export default function Timeline({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-4 shadow-xl shadow-black/20">
      <div className="grid gap-2 md:grid-cols-8">
        {timelineStages.map((stage, index) => (
          <div key={stage} className="relative">
            <div className={`rounded-xl border px-3 py-2 text-center text-xs font-semibold transition ${index <= activeIndex ? 'border-amd-orange bg-gradient-to-r from-amd-red/20 to-amd-orange/20 text-white' : 'border-white/10 bg-white/[0.03] text-slate-500'}`}>
              {stage}
            </div>
            {index < timelineStages.length - 1 ? <div className={`absolute left-[calc(100%-2px)] top-1/2 hidden h-px w-4 md:block ${index < activeIndex ? 'bg-amd-orange' : 'bg-white/10'}`} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
