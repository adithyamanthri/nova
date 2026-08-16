import { motion, useScroll, useSpring } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  ScrollProgress — thin gradient bar pinned to the top               */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden />
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
