export type ViewMode = 'architecture' | 'execution' | 'memory';

export type ComponentId =
  | 'cpu'
  | 'kernel-grid'
  | 'work-group'
  | 'wavefront'
  | 'scheduler'
  | 'cu'
  | 'wgp'
  | 'gcd-xcd'
  | 'scalar-path'
  | 'vector-path'
  | 'matrix-path'
  | 'sfu'
  | 'lsu'
  | 'registers'
  | 'lds'
  | 'l0-caches'
  | 'l1-caches'
  | 'l2-cache'
  | 'infinity-cache'
  | 'vram'
  | 'dme'
  | 'result';

export interface GlossaryTerm {
  id: string;
  term: string;
  aliases: string[];
  definition: string;
  whyItMatters: string;
  flowRole: string;
  related: string[];
  architectureNote?: string;
}

export interface ArchitectureComponent {
  id: ComponentId;
  title: string;
  subtitle: string;
  glossaryIds: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  group: 'host' | 'dispatch' | 'compute' | 'execution' | 'memory' | 'result';
}

export interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  activeComponents: ComponentId[];
  particlePath: ComponentId[];
  particleKind: 'execution' | 'memory' | 'result';
  timelineIndex: number;
  focusTermIds: string[];
}
