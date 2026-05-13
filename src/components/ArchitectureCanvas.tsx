import { motion } from 'framer-motion';
import type { ArchitectureComponent, ComponentId, ViewMode, WalkthroughStep } from '../types/domain';

interface ArchitectureCanvasProps {
  components: ArchitectureComponent[];
  selectedId: ComponentId;
  step: WalkthroughStep;
  viewMode: ViewMode;
  isPlaying: boolean;
  speed: number;
  onSelect: (id: ComponentId) => void;
}

const groupStyles: Record<ArchitectureComponent['group'], string> = {
  host: 'from-slate-800 to-slate-950 border-slate-500/50',
  dispatch: 'from-red-950/70 to-slate-950 border-red-400/45',
  compute: 'from-slate-800/80 to-zinc-950 border-slate-500/40',
  execution: 'from-amber-950/35 to-slate-950 border-amber-300/35',
  memory: 'from-cyan-950/35 to-slate-950 border-cyan-300/35',
  result: 'from-emerald-950/50 to-slate-950 border-emerald-300/40',
};

function centerOf(component: ArchitectureComponent) {
  return { x: component.x + component.w / 2, y: component.y + component.h / 2 };
}

function pathFor(ids: ComponentId[], components: ArchitectureComponent[]) {
  const points = ids
    .map((id) => components.find((component) => component.id === id))
    .filter(Boolean)
    .map((component) => centerOf(component as ArchitectureComponent));

  if (points.length === 0) return 'M 0 0';
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

function isVisibleInView(component: ArchitectureComponent, viewMode: ViewMode) {
  if (viewMode === 'architecture') return true;
  if (viewMode === 'execution') return ['host', 'dispatch', 'compute', 'execution', 'result'].includes(component.group);
  return ['compute', 'execution', 'memory', 'result'].includes(component.group);
}

export default function ArchitectureCanvas({
  components,
  selectedId,
  step,
  viewMode,
  isPlaying,
  speed,
  onSelect,
}: ArchitectureCanvasProps) {
  const activeSet = new Set(step.activeComponents);
  const route = pathFor(step.particlePath, components);
  const particleColor = step.particleKind === 'memory' ? '#35d5ff' : step.particleKind === 'result' ? '#65f2a8' : '#ffc857';

  return (
    <section className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(237,28,36,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(53,213,255,0.14),transparent_34%),#080a0f] p-4 shadow-2xl">
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative flex items-center justify-between gap-4 px-2 pb-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-amd-red">Live architecture canvas</p>
          <h2 className="mt-1 text-xl font-semibold text-white">{step.title}</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-amd-muted">
          {viewMode.toUpperCase()} VIEW
        </div>
      </div>

      <div className="relative h-[540px] rounded-[1.5rem] border border-white/10 bg-black/20">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 114" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="particleGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d={route} fill="none" stroke={particleColor} strokeDasharray="2 2" strokeOpacity="0.32" strokeWidth="0.25" />
          {[0, 0.22, 0.44, 0.66].map((offset) => (
            <motion.circle
              key={`${step.id}-${offset}`}
              r="0.9"
              fill={particleColor}
              filter="url(#particleGlow)"
              initial={{ offsetDistance: `${offset * 100}%`, opacity: 0.25 }}
              animate={isPlaying ? { offsetDistance: ['0%', '100%'], opacity: [0, 1, 1, 0] } : { opacity: 0.75 }}
              transition={{ duration: Math.max(1.2, 4 / speed), repeat: isPlaying ? Infinity : 0, delay: offset * 2, ease: 'easeInOut' }}
              style={{ offsetPath: `path('${route}')` }}
            />
          ))}
        </svg>

        {components.map((component) => {
          const active = activeSet.has(component.id);
          const selected = selectedId === component.id;
          const visible = isVisibleInView(component, viewMode);
          const isShell = component.id === 'gcd-xcd';
          return (
            <motion.button
              key={component.id}
              type="button"
              onClick={() => onSelect(component.id)}
              className={`absolute rounded-2xl border bg-gradient-to-br p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-amd-orange ${groupStyles[component.group]} ${
                isShell ? 'pointer-events-auto bg-opacity-20' : ''
              } ${active ? 'shadow-glow' : ''} ${selected ? 'ring-2 ring-amd-orange' : ''}`}
              style={{ left: `${component.x}%`, top: `${component.y}%`, width: `${component.w}%`, height: `${component.h}%` }}
              initial={false}
              animate={{ opacity: visible ? (isShell ? 0.82 : 1) : 0.18, scale: active ? 1.025 : 1 }}
              whileHover={{ scale: 1.035 }}
            >
              {active && !isShell ? (
                <motion.span
                  className="absolute -inset-px rounded-2xl border border-amd-orange/70"
                  animate={{ opacity: [0.25, 0.85, 0.25] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              ) : null}
              <span className="relative block text-sm font-semibold text-white">{component.title}</span>
              <span className="relative mt-1 block text-[11px] leading-tight text-slate-300">{component.subtitle}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
