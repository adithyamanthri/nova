import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

/* Detects small screens / coarse pointers so we can drop heavy 3D. */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${breakpoint}px)`).matches
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [breakpoint])
  return isMobile
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/* Normalized mouse position (-0.5 .. 0.5) — drives 3D parallax. */
export function useMousePosition() {
  const ref = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e) => {
      ref.current.x = e.clientX / window.innerWidth - 0.5
      ref.current.y = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return ref
}

let lenisInstance = null

/* Global smooth scroll. Call once from App. */
export function useSmoothScroll(enabled = true) {
  const [lenis, setLenis] = useState(null)
  useEffect(() => {
    if (!enabled) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
      touchMultiplier: 1.6,
    })
    lenisInstance = instance
    setLenis(instance)

    let rafId
    const raf = (time) => {
      instance.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      instance.destroy()
      lenisInstance = null
    }
  }, [enabled])
  return lenis
}

/* Scroll to an anchor smoothly through Lenis (falls back to native). */
export function scrollToId(id) {
  const el = document.querySelector(id)
  if (!el) return
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -72, duration: 1.4 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
