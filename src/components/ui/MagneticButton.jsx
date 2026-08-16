import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { usePrefersReducedMotion } from '../../lib/hooks'

/**
 * Premium magnetic button.
 * - Pulls toward the cursor while hovering
 * - Soft glow border, scaling + shimmer
 * - Ripple on click
 */
export default function MagneticButton({
  children,
  className = '',
  variant = 'primary', // primary | ghost
  onClick,
  as: Tag = 'button',
  href,
  ...rest
}) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef(null)
  const [ripples, setRipples] = useState([])

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 })

  const handleMove = (e) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set(relX * 0.28)
    y.set(relY * 0.28)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  const handleClick = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const id = Date.now()
    const r = Math.max(rect.width, rect.height)
    setRipples((prev) => [
      ...prev,
      {
        id,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        size: r * 2,
      },
    ])
    setTimeout(() => setRipples((prev) => prev.filter((rp) => rp.id !== id)), 900)
    onClick?.(e)
  }

  const base =
    'relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-display font-semibold tracking-wide select-none transition-colors duration-300 cursor-pointer'
  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-coral-500 to-ember-500 text-ink-950 shadow-[0_10px_40px_-10px_rgba(255,92,77,0.55)] hover:shadow-[0_14px_50px_-8px_rgba(255,92,77,0.7)]'
      : 'glass text-cream-50 hover:bg-white/10'

  const size = rest.size === 'lg' ? 'px-9 py-4 text-sm' : 'px-7 py-3.5 text-xs'
  const Comp = Tag === 'button' && href ? 'a' : Tag

  return (
    <motion.div
      style={{ x: sx, y: sy, display: 'inline-flex' }}
      whileHover={{ scale: reduced ? 1 : 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="inline-flex"
    >
      <Comp
        ref={ref}
        href={href}
        data-cursor="button"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        className={`group ${base} ${styles} ${size} ${className}`}
        {...rest}
      >
        {/* shimmer sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.35)_45%,transparent_60%)] bg-[length:250%_100%] opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:animate-[shimmer_1.4s_linear_infinite]"
        />
        {/* ripples */}
        {ripples.map((rp) => (
          <span
            key={rp.id}
            aria-hidden
            className="pointer-events-none absolute rounded-full bg-white/40"
            style={{
              left: rp.x,
              top: rp.y,
              width: rp.size,
              height: rp.size,
              transform: 'translate(-50%, -50%)',
              animation: 'ripple 0.9s ease-out forwards',
            }}
          />
        ))}
        {children}
      </Comp>
    </motion.div>
  )
}
