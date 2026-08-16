import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  ScrollProgress — thin gradient bar pinned to the top               */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden />
}

/* ------------------------------------------------------------------ */
/*  GlowCursor — soft light that follows the cursor                    */
/* ------------------------------------------------------------------ */
export function GlowCursor() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    let raf
    const onMove = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 h-[400px] w-[400px] rounded-full opacity-60 mix-blend-screen"
      style={{
        background:
          'radial-gradient(circle, rgba(255,122,107,0.14) 0%, rgba(255,180,84,0.07) 35%, transparent 70%)',
        filter: 'blur(30px)',
        transition: 'opacity .6s',
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  PaintTrail — tiny paint droplets that trail the cursor             */
/* ------------------------------------------------------------------ */
const TRAIL_COLORS = ['#ff5c4d', '#ffb454', '#57c8f2', '#9d8cf6', '#faf8f4']

export function PaintTrail() {
  const reduced = useReducedMotion()
  const [drops, setDrops] = useState([])
  const count = useRef(0)

  useEffect(() => {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return
    let last = 0
    const onMove = (e) => {
      const now = performance.now()
      if (now - last < 90) return
      last = now
      const id = count.current++
      const x = e.clientX + (Math.random() * 14 - 7)
      const y = e.clientY + (Math.random() * 14 - 7)
      const color = TRAIL_COLORS[id % TRAIL_COLORS.length]
      setDrops((prev) => [...prev.slice(-18), { id, x, y, color, size: 3 + Math.random() * 5 }])
      setTimeout(() => setDrops((prev) => prev.filter((d) => d.id !== id)), 1000)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {drops.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            background: `radial-gradient(circle at 30% 30%, #fff, ${d.color})`,
            boxShadow: `0 0 8px ${d.color}66`,
          }}
          initial={{ opacity: 0.9, scale: 1, y: 0 }}
          animate={{ opacity: 0, scale: 0.3, y: 26 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Marquee — infinite scrolling strip (used for paint names)          */
/* ------------------------------------------------------------------ */
export function Marquee({ items, className = '' }) {
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <div className="inline-flex animate-marquee will-change-transform">
        {row.map((item, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-8 font-display text-sm uppercase tracking-[0.3em] text-cream-300/70">
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-coral-400/70" />
          </span>
        ))}
      </div>
    </div>
  )
}
