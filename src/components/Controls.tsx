import type React from 'react';
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import type { ViewMode } from '../types/domain';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const viewModes: { id: ViewMode; label: string }[] = [
  { id: 'architecture', label: 'Architecture view' },
  { id: 'execution', label: 'Execution flow view' },
  { id: 'memory', label: 'Memory hierarchy view' },
];

export default function Controls({ isPlaying, onPlayPause, onPrev, onNext, onReset, speed, setSpeed, viewMode, setViewMode }: ControlsProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-amd-panel/90 p-4 backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <ControlButton label="Previous step" onClick={onPrev} icon={<SkipBack className="h-4 w-4" />} />
          <ControlButton label={isPlaying ? 'Pause' : 'Play animation'} onClick={onPlayPause} primary icon={isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} />
          <ControlButton label="Next step" onClick={onNext} icon={<SkipForward className="h-4 w-4" />} />
          <ControlButton label="Reset" onClick={onReset} icon={<RotateCcw className="h-4 w-4" />} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-slate-300">
            Speed
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.25"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              className="accent-amd-red"
            />
            <span className="w-10 font-mono text-xs text-amd-muted">{speed.toFixed(2)}x</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {viewModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setViewMode(mode.id)}
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  viewMode === mode.id ? 'border-amd-cyan bg-amd-cyan/15 text-white shadow-cyan' : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlButton({ label, onClick, icon, primary = false }: { label: string; onClick: () => void; icon: React.ReactNode; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
        primary ? 'border-amd-red bg-amd-red text-white shadow-glow hover:bg-red-500' : 'border-white/10 bg-white/[0.04] text-slate-200 hover:border-white/25 hover:bg-white/[0.08]'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
