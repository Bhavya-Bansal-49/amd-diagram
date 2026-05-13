# Inside an AMD GPU

An interactive single-page React + TypeScript educational app that explains AMD GPU architecture and kernel execution flow. The walkthrough follows visible execution and memory particles from CPU dispatch through grid/work-group/wavefront formation, CU/WGP scheduling, execution units, memory hierarchy, VRAM, and result writeback.

## Features

- Dark, AMD-inspired technical dashboard visual style.
- Start screen with **Inside an AMD GPU** and **Begin walkthrough** action.
- 15-step animated walkthrough:
  1. CPU dispatches a GPU kernel
  2. Kernel creates a grid of work
  3. Grid is divided into work-groups
  4. Work-groups are assigned to CUs or WGPs
  5. Work-groups are divided into wavefronts
  6. Wavefront scheduler selects ready wavefronts
  7. Scalar path handles control flow through SGPR + SALU
  8. Vector path executes per-work-item math through VGPR + VALU/SIMD
  9. Matrix path uses AccVGPR + MFMA units
  10. SFU handles special math functions
  11. Load/store unit performs memory loads/stores
  12. LDS enables work-items in a work-group to share data
  13. Caches reduce memory access cost
  14. VRAM/global memory stores large data
  15. Results are written back
- Clickable architecture blocks with an inspector panel for definitions, importance, flow role, related components, and architecture notes.
- Searchable AMD glossary panel with the app's hardware terms.
- Play/pause, previous, next, reset, and speed controls.
- Architecture, execution-flow, and memory-hierarchy view toggles.
- Timeline: CPU → Kernel/Grid → Work-group → Wavefront → CU/WGP → Execution Units → Memory → Result.

## Technical notes

The app is intentionally AMD-specific:

- It uses **wavefront** as the AMD term and only mentions NVIDIA-style terms such as warp/block as comparisons.
- It presents **Compute Units (CUs)** as the fundamental programmable execution engines.
- It presents **WGP** as a Radeon/RDNA-style hardware grouping containing two CUs.
- It calls out family differences instead of pretending one layout applies universally:
  - AMD Instinct/CDNA commonly uses 64 work-items per wavefront.
  - AMD Radeon/RDNA commonly uses 32 work-items per wavefront.
  - Instinct/CDNA and Radeon/RDNA cache hierarchy details can differ.
  - XCD/GCD terminology depends on GPU family.

Primary content reference: [AMD ROCm Device Hardware Glossary](https://rocm.docs.amd.com/en/develop/reference/glossary/device-hardware.html#term-WGP).
Additional conceptual references: [Coding Confessions GPU computing primer](https://blog.codingconfessions.com/p/gpu-computing) and [Mojo GPU architecture documentation](https://mojolang.org/docs/manual/gpu/architecture/).

## Project structure

```text
inside-amd-gpu/
├── index.html
├── package.json
├── README.md
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── ArchitectureCanvas.tsx
│   │   ├── Controls.tsx
│   │   ├── Inspector.tsx
│   │   ├── Sidebar.tsx
│   │   └── Timeline.tsx
│   ├── data/
│   │   └── glossary.ts
│   ├── main.tsx
│   ├── styles.css
│   └── types/
│       └── domain.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts
```

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Accessibility and responsiveness

The layout is desktop-first for the diagram-heavy learning experience, but it uses responsive grid behavior so the sidebar, canvas, and inspector stack on smaller screens. Interactive blocks are keyboard-focusable buttons with visible focus rings.
