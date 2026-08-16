# BIG PAINTS 🎨

A premium, cinematic 3D website for **BIG PAINTS** — a professional paint and
home-decoration shop. Rebuilt around one core idea: **one WebGL canvas, zero
per-frame React re-renders, and a camera that travels through the page** so the
whole site feels like a single continuous journey through liquid paint.

React 19 · Vite 7 · Tailwind CSS v4 · Three.js (React Three Fiber) · GSAP
ScrollTrigger · Framer Motion · Lenis · Lucide React.

## Architecture (why it's fast)

- **One primary WebGL canvas** (`src/components/three/WorldCanvas.jsx`). All 3D —
  hero liquid, shade-lab liquid plane, paint can, particles — lives in it as
  *stages*. The camera moves in sync with Lenis scroll (`CameraRig`), so 3D
  objects stay glued to their DOM sections with zero extra canvases.
- **A plain mutable engine store** (`src/lib/engine/store.js`) shared between DOM
  and WebGL. Scroll position, velocity, pointer, hovered/active shade, quality
  tier and product index are written imperatively and read inside `useFrame` —
  **no React state updates during animation**, ever.
- **Scroll-velocity motion system** (`src/lib/engine/scroll.js`): paint flow,
  particle stretch, headline skew and camera easing all scale with how fast you
  scroll, then settle when you stop.
- **Adaptive quality** (`src/lib/engine/fps.js`): a hysteresis-based FPS monitor
  steps pixel ratio and particle counts down (60fps → full, 45–60 → reduced,
  <45 → light shaders), and never exceeds a device baseline (mobile = lower).
- **Instanced particles** (`ParticleField.jsx`) — one `InstancedMesh` covers the
  whole page; colors lerp toward the active shade.
- **Custom GLSL, no textures**: liquid plane (fbm flow + cursor ripples), hero
  blob (vertex-displaced fresnel sphere), pour stream and spreading pool are all
  cheap `ShaderMaterial`s.
- **GSAP ScrollTrigger** for the pinned product storytelling and the paint-can
  choreography — scrubbed, so nothing fights the scroll.
- 3D is lazy-loaded, only mounts after the loader, and is skipped entirely when
  WebGL is unavailable or `prefers-reduced-motion` is set.

## Page journey

```
HERO (liquid blob world)
  → SHADE LAB — "FIND YOUR COLOR" — 15 liquid pools; hover ripples,
    click = cinematic paint-explosion showcase; the liquid stream cycles
    shades as you scroll ("river of paint")
  → COLOR COLLECTION
  → ROOM TRANSFORMATION (before/after, walls follow the selected shade)
  → PAINT CAN — opens, tilts, pours; the pool becomes the product tabletop
  → PRODUCTS — pinned horizontal storytelling; the 3D can recolors per product
  → SERVICES → WHY BIG PAINTS → VISUALIZER → TESTIMONIALS → LOCATION → CONTACT
```

Every section's accent lighting, particles and glass reflections lerp toward
the shade you select — the color follows you through the whole page.

## Cursor

Desktop only (`pointer: fine`, disabled on touch / reduced motion): a dot +
lerped ring that expands over buttons, becomes the hovered shade over color
pools, and shows **VIEW** over products. Context is declared with
`data-cursor` attributes — add a new state anywhere.

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

Deploy `dist/` to Vercel, Netlify or GitHub Pages (no build-time secrets).

## Customizing

- All copy, shades, colors, products, services, testimonials: `src/data/content.js`
- 3D stage objects: `src/components/three/*` (stages can be individually
  enabled/disabled/optimized/replaced)
- Shader effects: `src/lib/engine/shaders.js`
- Contact form in `src/components/Contact.jsx` simulates submission — point it
  at any free form backend (Formspree, Web3Forms) to go live.
- Product art is SVG placeholders in `src/components/Products.jsx` — swap for
  real photography anytime.
