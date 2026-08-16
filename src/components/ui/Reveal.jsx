import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import MagneticButton from './MagneticButton'

/* ------------------------------------------------------------------ */
/*  Reveal — fades + slides children in when scrolled into view        */
/* ------------------------------------------------------------------ */
export function Reveal({ children, delay = 0, y = 40, className = '', once = true, amount = 0.2 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* Character-by-character text reveal.
   When `started` is provided, the reveal is driven by it (e.g. after the
   loader finishes) instead of by viewport entry. */
export function TextReveal({ text, className = '', delay = 0, as: Tag = 'span', started }) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  const hidden = reduced ? { opacity: 0 } : { y: '110%' }
  const shown = { y: 0, opacity: 1 }
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="inline-block will-change-transform"
            initial={hidden}
            {...(started !== undefined
              ? { animate: started ? shown : hidden }
              : {
                  whileInView: shown,
                  viewport: { once: true, amount: 0.6 },
                })}
            transition={{
              duration: 0.7,
              delay: delay + wi * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {wi < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/*  SectionHeading — eyebrow + title + optional description            */
/* ------------------------------------------------------------------ */
export function SectionHeading({ eyebrow, title, description, align = 'center', className = '' }) {
  const alignCls = align === 'left' ? 'text-left items-start' : 'text-center items-center'
  return (
    <div className={`flex flex-col gap-5 ${alignCls} ${className}`}>
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream-300">
          <span className="h-1.5 w-1.5 rounded-full bg-coral-400" aria-hidden />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-cream-50 sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className={`max-w-xl text-base leading-relaxed text-cream-400 ${align === 'center' ? 'mx-auto' : ''}`}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Counter — animates a number upward when in view                    */
/* ------------------------------------------------------------------ */
export function Counter({ value, suffix = '', duration = 1.8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 })

  const [display, setDisplay] = useState('0')
  useEffect(() => {
    if (inView) mv.set(value)
    const unsub = spring.on('change', (v) => {
      const formatted = Math.round(v).toLocaleString('en-IN')
      setDisplay(formatted)
    })
    return unsub
  }, [inView, value, mv, spring])

  return (
    <span ref={ref} className="tabular-nums">
      {reduced ? value.toLocaleString('en-IN') : display}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  CTA block used at the end of several sections                      */
/* ------------------------------------------------------------------ */
export function CTAButton({ children, href = '#contact', onClick, variant = 'primary' }) {
  return (
    <MagneticButton href={href} variant={variant} onClick={onClick} size="lg">
      {children}
    </MagneticButton>
  )
}
