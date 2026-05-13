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
  host: 'from-slate-700/90 via-slate-900 to-[#070b14] border-slate-400/45 shadow-slate-950/30',
  dispatch: 'from-amd-red/30 via-red-950/70 to-[#09060a] border-amd-red/45 shadow-red-950/40',
  compute: 'from-slate-700/55 via-[#141a24] to-[#07090d] border-slate-400/30 shadow-black/40',
  execution: 'from-amd-orange/22 via-[#23170f] to-[#08070b] border-amd-orange/45 shadow-orange-950/30',
  memory: 'from-cyan-500/20 via-[#0b2028] to-[#060910] border-amd-cyan/45 shadow-cyan-950/30',
  result: 'from-emerald-400/25 via-[#0d2418] to-[#06100b] border-emerald-300/45 shadow-emerald-950/30',
};

const focusLabels: Partial<Record<ComponentId, string[]>> = {
  cpu: ['HIP / API call', 'Command queue'],
  'kernel-grid': ['Global size', 'Work-item IDs'],
  'work-group': ['Local size', 'Sync + LDS scope'],
  wavefront: ['Wave32 / Wave64', 'SIMT lanes'],
  'gcd-xcd': ['Die boundary', 'Cache slices'],
  wgp: ['CU pair', 'Shared front-end'],
  cu: ['Scheduler', 'Registers', 'LDS'],
  scheduler: ['Ready waves', 'Issue slots'],
  registers: ['SGPR', 'VGPR', 'AccVGPR'],
  'scalar-path': ['Uniform branch', 'SALU op'],
  'vector-path': ['SIMD lanes', 'VGPR operands'],
  'matrix-path': ['MFMA', 'Accumulate'],
  sfu: ['Trig', 'Reciprocal', 'sqrt'],
  lsu: ['Load', 'Store', 'Coalesce'],
  lds: ['Shared tile', 'Barrier'],
  'l0-caches': ['I$', 'Scalar$', 'Vector$'],
  'l1-caches': ['I$', 'Scalar$', 'Vector$'],
  'l2-cache': ['Shared cache', 'Fabric'],
  'infinity-cache': ['LLC', 'Family dependent'],
  vram: ['Global memory', 'Large arrays'],
  dme: ['Tensor copy', 'MI300+'],
  result: ['Writeback', 'Host visible'],
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
  const particleColor = step.particleKind === 'memory' ? '#35d5ff' : step.particleKind === 'result' ? '#65f2a8' : '#ff8a1f';

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_18%_8%,rgba(237,28,36,0.22),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(255,138,31,0.14),transparent_22%),radial-gradient(circle_at_72%_88%,rgba(53,213,255,0.16),transparent_30%),#080a0f] p-4 shadow-2xl">
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.75)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.75)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative flex items-start justify-between gap-4 px-2 pb-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-amd-red">Live architecture canvas</p>
          <h2 className="mt-1 text-xl font-semibold text-white">{step.title}</h2>
          <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-400">Inactive blocks stay in place but dim, while active blocks reveal their inner role for the current step.</p>
        </div>
        <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-amd-muted">
          {viewMode.toUpperCase()} VIEW
        </div>
      </div>

      <div className="relative h-[clamp(560px,58vh,720px)] rounded-[1.5rem] border border-white/10 bg-black/25 shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]">
        <svg className="absolute inset-0 z-20 h-full w-full pointer-events-none" viewBox="0 0 100 114" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="particleGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d={route} fill="none" stroke={particleColor} strokeDasharray="2 2" strokeOpacity="0.38" strokeWidth="0.35" />
          {[0, 0.22, 0.44, 0.66].map((offset) => (
            <motion.circle
              key={`${step.id}-${offset}`}
              r="0.95"
              fill={particleColor}
              filter="url(#particleGlow)"
              initial={{ offsetDistance: `${offset * 100}%`, opacity: 0.25 }}
              animate={isPlaying ? { offsetDistance: ['0%', '100%'], opacity: [0, 1, 1, 0] } : { opacity: 0.9 }}
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
          const labels = focusLabels[component.id] ?? component.glossaryIds;
          return (
            <motion.button
              key={component.id}
              type="button"
              onClick={() => onSelect(component.id)}
              className={`absolute overflow-hidden rounded-2xl border bg-gradient-to-br p-3 text-left shadow-xl transition focus:outline-none focus:ring-2 focus:ring-amd-orange ${groupStyles[component.group]} ${
                isShell ? 'z-0 bg-opacity-30' : active ? 'z-30' : 'z-10'
              } ${active ? 'shadow-glow' : ''} ${selected ? 'ring-2 ring-amd-orange' : ''}`}
              style={{ left: `${component.x}%`, top: `${component.y}%`, width: `${component.w}%`, height: `${component.h}%` }}
              initial={false}
              animate={{ opacity: visible ? (active || selected || isShell ? 1 : 0.64) : 0.14, scale: active ? 1.035 : 1 }}
              whileHover={{ scale: isShell ? 1.005 : 1.035 }}
            >
              <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_35%)]" />
              {active && !isShell ? (
                <motion.span
                  className="absolute inset-0 rounded-2xl border border-amd-orange/80 bg-amd-orange/5"
                  animate={{ opacity: [0.38, 0.92, 0.38] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              ) : null}
              <span className="relative block truncate text-[clamp(0.72rem,0.75vw,0.92rem)] font-semibold text-white">{component.title}</span>
              <span className="relative mt-1 block truncate text-[clamp(0.58rem,0.62vw,0.72rem)] leading-tight text-slate-300">{component.subtitle}</span>
              {active && !isShell ? (
                <span className="relative mt-2 grid grid-cols-2 gap-1 text-[10px] leading-none text-white/80">
                  {labels.slice(0, 4).map((label) => (
                    <span key={label} className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-center">
                      {label}
                    </span>
                  ))}
                </span>
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
