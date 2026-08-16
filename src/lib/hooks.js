import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { subscribeShade, store } from './engine/store'

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

/* Reactive active shade — re-renders only when the user selects a shade. */
export function useActiveShade() {
  return useSyncExternalStore(subscribeShade, () => store.activeShade)
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

export function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}
