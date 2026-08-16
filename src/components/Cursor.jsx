import { useEffect, useRef, useState } from 'react'
import { store } from '../lib/engine/store'

/* Premium cursor: a small dot + a soft ring that lerps behind it.
   Context-aware via [data-cursor] attributes (button / shade / view /
   drag / magnify). Runs entirely on refs + rAF — zero React re-renders.
   Automatically disabled on touch devices and reduced motion. */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const modeRef = useRef('default')
  const colorRef = useRef('#ff5c4d')
  const visibleRef = useRef(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    document.body.classList.add('custom-cursor')

    let raf
    const loop = () => {
      const sx = (store.mouse.sx + 0.5) * window.innerWidth
      const sy = (store.mouse.sy + 0.5) * window.innerHeight
      const px = store.mouse.px
      const py = store.mouse.py

      if (dotRef.current) dotRef.current.style.transform = `translate(${px}px, ${py}px)`
      const mode = modeRef.current
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -50%)`
        const scale = mode === 'button' ? 1.7 : mode === 'shade' ? 1.9 : mode === 'view' || mode === 'drag' ? 2.4 : mode === 'magnify' ? 1.5 : 1
        ringRef.current.style.scale = scale
        ringRef.current.style.background =
          mode === 'shade'
            ? `radial-gradient(circle, ${colorRef.current}33, transparent 70%)`
            : 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)'
        ringRef.current.style.borderColor =
          mode === 'shade' ? colorRef.current : 'rgba(255,255,255,0.5)'
        ringRef.current.style.opacity = visibleRef.current ? 1 : 0
      }
      if (labelRef.current) {
        labelRef.current.style.opacity = mode === 'view' || mode === 'drag' ? 1 : 0
      }
      if (dotRef.current) dotRef.current.style.opacity = visibleRef.current ? 1 : 0
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    /* context detection via event delegation — no per-element listeners */
    const onOver = (e) => {
      const el = e.target.closest?.('[data-cursor]')
      if (el) {
        modeRef.current = el.dataset.cursor
        if (el.dataset.cursorColor) colorRef.current = el.dataset.cursorColor
        else colorRef.current = getComputedStyle(el).getPropertyValue('--shade') || '#ff5c4d'
        if (labelRef.current) {
          labelRef.current.textContent = modeRef.current === 'view' ? 'VIEW' : modeRef.current === 'drag' ? 'DRAG' : ''
        }
        visibleRef.current = true
      } else {
        modeRef.current = 'default'
      }
    }
    const onOut = (e) => {
      if (!e.target.closest?.('[data-cursor]')) visibleRef.current = true // stay visible over plain bg
    }
    const onLeaveDoc = () => { visibleRef.current = false }
    const onEnterDoc = () => { visibleRef.current = true }

    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeaveDoc)
    document.documentElement.addEventListener('mouseenter', onEnterDoc)

    return () => {
      cancelAnimationFrame(raf)
      document.body.classList.remove('custom-cursor')
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.documentElement.removeEventListener('mouseleave', onLeaveDoc)
      document.documentElement.removeEventListener('mouseenter', onEnterDoc)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120]">
      {/* dot */}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{ transform: 'translate(-100px,-100px)' }}
      />
      {/* ring */}
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border"
        style={{ transform: 'translate(-100px,-100px) translate(-50%, -50%)', borderColor: 'rgba(255,255,255,0.5)' }}
      >
        <span ref={labelRef} className="font-display text-[9px] font-bold tracking-[0.2em] text-white" style={{ opacity: 0 }}>
          VIEW
        </span>
      </div>
    </div>
  )
}
