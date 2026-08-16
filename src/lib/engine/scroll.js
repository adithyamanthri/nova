import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { store, lerp, clamp, hexToRgb, applyShadeToDom } from './store'

gsap.registerPlugin(ScrollTrigger)

let lenis = null
let rafId = 0
let lastY = 0
let lastFrame = 0

/* Measure DOM section offsets into store.stages so the WebGL camera
   can travel through the page in sync with real scroll. */
export function measureStages() {
  const ids = ['home', 'shades', 'can', 'products', 'services', 'about', 'contact']
  const out = {}
  ids.forEach((id) => {
    const el = document.getElementById(id)
    if (el) out[id] = el.offsetTop
  })
  store.stages = out
  store.layoutVersion++
}

function onFrame(time) {
  if (!lenis) return
  lenis.raf(time)

  const y = window.scrollY
  const dt = Math.max(1, time - lastFrame)
  lastFrame = time

  // raw velocity (px/frame), smoothed; used to drive liquid flow + motion
  const v = (y - lastY) / dt
  lastY = y
  store.velocity = lerp(store.velocity, v, 0.08)
  store.velocityNorm = clamp(store.velocity / 22, -1, 1)

  store.scrollY = y
  store.maxScroll = Math.max(store.maxScroll, document.documentElement.scrollHeight - window.innerHeight)

  // smooth pointer (used by shaders + cursor ring)
  store.mouse.sx = lerp(store.mouse.sx, store.mouse.x, 0.06)
  store.mouse.sy = lerp(store.mouse.sy, store.mouse.y, 0.06)

  // lerp active shade toward target and write to CSS vars (throttled writes)
  const target = hexToRgb(store.activeShade)
  const cur = store.shadeLerp
  cur.r = lerp(cur.r, target[0], 0.05)
  cur.g = lerp(cur.g, target[1], 0.05)
  cur.b = lerp(cur.b, target[2], 0.05)
  if (Math.abs(cur.r - target[0]) + Math.abs(cur.g - target[1]) + Math.abs(cur.b - target[2]) > 0.4) {
    applyShadeToDom([Math.round(cur.r), Math.round(cur.g), Math.round(cur.b)])
  }

  rafId = requestAnimationFrame(onFrame)
}

export function initScroll() {
  if (lenis) return lenis

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reduced,
    touchMultiplier: 1.5,
  })

  // keep GSAP ScrollTrigger in sync with Lenis
  lenis.on('scroll', ScrollTrigger.update)

  // one rAF loop drives lenis + velocity + shade lerp (cheap: no layout reads)
  rafId = requestAnimationFrame(onFrame)

  // pointer tracking
  window.addEventListener(
    'pointermove',
    (e) => {
      store.mouse.x = e.clientX / window.innerWidth - 0.5
      store.mouse.y = e.clientY / window.innerHeight - 0.5
      store.mouse.px = e.clientX
      store.mouse.py = e.clientY
    },
    { passive: true }
  )

  measureStages()
  window.addEventListener('resize', measureStages, { passive: true })
  // re-measure after GSAP pins settle (pinning changes later offsets)
  ScrollTrigger.addEventListener('refresh', measureStages)
  window.addEventListener('load', () => {
    measureStages()
    ScrollTrigger.refresh()
  })
  setTimeout(() => { measureStages(); ScrollTrigger.refresh() }, 800)

  return lenis
}

export function scrollToId(id) {
  if (!id) return
  const el = document.querySelector(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.6 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

export function destroyScroll() {
  cancelAnimationFrame(rafId)
  ScrollTrigger.removeEventListener('refresh', measureStages)
  if (lenis) { lenis.destroy(); lenis = null }
}

export { ScrollTrigger }
