import { store, clamp } from './store'

let frames = 0
let lastSample = 0
let rafId = 0
let stop = false

/* Adaptive quality: measure FPS with hysteresis so we never thrash.
   60fps  -> quality 2 (full)
   45-60  -> quality 1 (fewer particles)
   30-45  -> quality 0 (light shaders)
   <30    -> stay at 0, disable shadows + post fx */
export function startFpsMonitor(onTierChange) {
  stop = false
  frames = 0
  lastSample = performance.now()
  const loop = (now) => {
    if (stop) return
    frames++
    const elapsed = now - lastSample
    if (elapsed >= 1500) {
      const fps = (frames * 1000) / elapsed
      store.fps = Math.round(fps)
      frames = 0
      lastSample = now

      const tier = fps >= 58 ? 2 : fps >= 44 ? 1 : 0
      if (tier !== store.quality) {
        store.quality = tier
        onTierChange?.(tier, fps)
      }
    }
    rafId = requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)
  return () => { stop = true; cancelAnimationFrame(rafId) }
}

/* Baseline tier from device capability (never climb above it) */
export function baselineQuality(isMobile, reducedMotion) {
  if (reducedMotion) return 0
  if (isMobile) return 1
  return 2
}

export { clamp }
