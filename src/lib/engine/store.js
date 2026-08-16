/* ------------------------------------------------------------------ */
/*  Engine store — a plain mutable object shared between the DOM and   */
/*  the WebGL world. Updated imperatively, NEVER through React state,  */
/*  so per-frame changes cause zero React re-renders.                  */
/* ------------------------------------------------------------------ */

export const store = {
  // scroll
  scrollY: 0,
  velocity: 0, // px/frame, smoothed
  velocityNorm: 0, // -1..1 smoothed
  maxScroll: 0,

  // pointer (normalized -0.5..0.5), lerped toward the real cursor
  mouse: { x: 0, y: 0, sx: 0, sy: 0, px: 0, py: 0 },

  // shade system
  hoverShade: '#ff5c4d', // shade under the cursor
  activeShade: '#ff5c4d', // selected shade
  activeShadeName: 'Coral',
  activeShadeCode: '#ff5c4d',
  activeShadeFinish: 'Premium Matte',
  shadeLerp: { r: 255, g: 92, b: 77 }, // lerped RGB of activeShade

  // quality / adaptive
  quality: 2, // 0 low, 1 medium, 2 high
  fps: 60,
  webgl: true,

  // stage tracking: world Y (px) of each DOM section, measured on load/resize
  stages: {},
  layoutVersion: 0,

  // paint can choreography (0..1) — driven by ScrollTrigger
  canProgress: 0,
  canActive: false,
  activeProduct: 0, // index of product in the horizontal showcase
  productsProgress: 0,

  // liquid plane uniforms cache
  liquid: { time: 0, flow: 0.35 },
}

/* Smooth-lerp helper used across the engine */
export const lerp = (a, b, t) => a + (b - a) * t
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

/* ------- reactive selection (fires ONLY on user shade selection) ---- */
const shadeListeners = new Set()

export function setActiveShade({ name, code, finish }) {
  store.activeShade = code
  store.activeShadeName = name
  store.activeShadeCode = code
  store.activeShadeFinish = finish
  shadeListeners.forEach((fn) => fn())
}

export function subscribeShade(fn) {
  shadeListeners.add(fn)
  return () => shadeListeners.delete(fn)
}

/* Write the lerped shade into CSS custom properties (throttled by the
   engine loop) so the DOM theme follows the selected shade smoothly. */
export function applyShadeToDom(rgb) {
  const root = document.documentElement
  root.style.setProperty('--shade-r', rgb[0])
  root.style.setProperty('--shade-g', rgb[1])
  root.style.setProperty('--shade-b', rgb[2])
  root.style.setProperty('--shade', `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`)
}
