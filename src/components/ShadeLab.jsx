import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Check, ArrowRight } from 'lucide-react'
import { SHADES } from '../data/content'
import { store, setActiveShade } from '../lib/engine/store'
import { scrollToId } from '../lib/engine/scroll'
import { TextReveal, Reveal } from './ui/Reveal'
import MagneticButton from './ui/MagneticButton'
import { RoomView } from './Visualizer'

const isLight = (hex) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 170
}

/* One liquid paint pool */
const hoveringRef = { current: false }

function ShadePool({ shade, index, onSelect, active }) {
  const ref = useRef(null)
  const isActive = active?.code === shade.code
  return (
    <div className="flex shrink-0 snap-center flex-col items-center gap-3">
      <button
        ref={ref}
        type="button"
        onClick={(e) => onSelect(shade, ref.current.getBoundingClientRect(), e)}
        data-cursor="shade"
        data-cursor-color={shade.code}
        onMouseEnter={() => { store.hoverShade = shade.code; hoveringRef.current = true }}
        onMouseLeave={() => { store.hoverShade = store.activeShade; hoveringRef.current = false }}
        aria-pressed={isActive}
        aria-label={`Select ${shade.name}, ${shade.code}`}
        className={`group relative h-20 w-20 rounded-full transition-all duration-500 sm:h-24 sm:w-24 ${
          isActive ? 'scale-110' : 'hover:scale-105'
        }`}
        style={{
          background: `radial-gradient(circle at 32% 28%, ${lighten(shade.code, 0.35)}, ${shade.code} 45%, ${shadeHexDark(shade.code)})`,
          boxShadow: `0 12px 40px -10px ${shade.code}88, inset 0 -6px 14px ${shadeHexDark(shade.code)}99, inset 0 6px 10px ${lighten(shade.code, 0.5)}55`,
        }}
      >
        {/* liquid highlight */}
        <span aria-hidden className="absolute left-[18%] top-[12%] h-4 w-7 rotate-[-18deg] rounded-full bg-white/45 blur-[3px]" />
        {/* hover ripple ring */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-white/0 opacity-0 transition-all duration-500 group-hover:border-white/40 group-hover:opacity-100"
          style={{ boxShadow: `0 0 0 6px ${shade.code}22, 0 0 24px ${shade.code}66` }}
        />
        {/* spreading pool on hover */}
        <span
          aria-hidden
          className="absolute -inset-3 rounded-full opacity-0 blur-md transition-opacity duration-700 group-hover:opacity-70"
          style={{ background: `radial-gradient(circle, ${shade.code}, transparent 70%)` }}
        />
      </button>
      <div className="flex flex-col items-center">
        <p className="font-display text-xs font-bold tracking-wide text-cream-50">{shade.name}</p>
        <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-cream-400">{shade.code}</p>
        <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-cream-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {shade.finish}
        </p>
      </div>
    </div>
  )
}

const lighten = (hex, amt) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const l = (c) => Math.round(c + (255 - c) * amt)
  return `rgb(${l(r)}, ${l(g)}, ${l(b)})`
}
const shadeHexDark = (hex) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const d = (c) => Math.round(c * 0.45)
  return `rgb(${d(r)}, ${d(g)}, ${d(b)})`
}

/* Fullscreen cinematic color reveal after a shade click */
function ShadeShowcase({ shade, origin, onClose }) {
  const light = isLight(shade.code)
  const ink = light ? '#0a0a0c' : '#ffffff'
  const [originX, originY] = origin

  return (
    <motion.div
      className="fixed inset-0 z-[95] flex flex-col overflow-hidden"
      initial={{ clipPath: `circle(0% at ${originX}px ${originY}px)`, opacity: 0.5 }}
      animate={{ clipPath: `circle(150% at ${originX}px ${originY}px)`, opacity: 1 }}
      exit={{ clipPath: `circle(0% at ${originX}px ${originY}px)`, opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      style={{ backgroundColor: shade.code }}
      role="dialog"
      aria-modal="true"
      aria-label={`${shade.name} color showcase`}
    >
      {/* liquid ripple decorations */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            width: `${32 + i * 16}vw`,
            height: `${32 + i * 16}vw`,
            left: `${8 + i * 24}%`,
            top: `${12 + (i % 2) * 42}%`,
            border: `1.5px solid ${ink}26`,
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 10 + i * 3, ease: 'easeInOut' }}
        />
      ))}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close shade showcase"
        className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-110"
        style={{ backgroundColor: `${ink}1f`, color: ink }}
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      <div className="relative z-10 flex flex-1 flex-col justify-center gap-8 px-6 py-16 sm:px-14 lg:flex-row lg:items-center lg:gap-16">
        {/* text side */}
        <div className="lg:max-w-md">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[11px] font-semibold uppercase tracking-[0.4em]"
            style={{ color: `${ink}aa` }}
          >
            {shade.finish}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 font-display text-6xl font-extrabold tracking-tight sm:text-7xl"
            style={{ color: ink }}
          >
            {shade.name}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-4 font-display text-xl italic"
            style={{ color: ink }}
          >
            “{shade.tagline}”
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mt-7 flex items-center gap-3"
          >
            <span className="rounded-2xl px-5 py-3 font-display text-lg font-bold backdrop-blur-md" style={{ backgroundColor: `${ink}16`, color: ink }}>
              {shade.code}
            </span>
            <span className="rounded-2xl px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-md" style={{ backgroundColor: `${ink}16`, color: ink }}>
              {shade.finish}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <MagneticButton
              variant={light ? 'primary' : 'ghost'}
              onClick={() => { onClose(); setTimeout(() => scrollToId('#visualizer'), 450) }}
            >
              <Check className="h-4 w-4" aria-hidden />
              Apply to a room
            </MagneticButton>
            <MagneticButton
              variant={light ? 'ghost' : 'primary'}
              onClick={() => { onClose(); setTimeout(() => scrollToId('#contact'), 450) }}
            >
              Order this shade
            </MagneticButton>
          </motion.div>
        </div>

        {/* interior preview side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.6)]"
        >
          <div className="aspect-[16/10] w-full bg-ink-900">
            <RoomView room={{ id: 'living', name: 'Living Room', desc: '' }} wallColor={shade.code} />
          </div>
          <div className="flex items-center justify-between border-t border-white/15 bg-black/25 px-5 py-3 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: ink }}>
              Living room preview
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: `${ink}aa` }}>
              {shade.name} walls
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  The Shade Lab section                                              */
/* ------------------------------------------------------------------ */
export default function ShadeLab() {
  const sectionRef = useRef(null)
  const [showcase, setShowcase] = useState(null) // { shade, origin }
  const [active, setActive] = useState(SHADES[4])

  // The liquid stream cycles shades as you scroll through the section,
  // unless a pool is hovered or the showcase is open. ("River of paint")
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight + window.innerHeight
      if (hoveringRef.current) return
      const progress = Math.min(1, Math.max(0, -rect.top / total))
      const idx = Math.min(SHADES.length - 1, Math.floor(progress * (SHADES.length - 1)))
      store.hoverShade = SHADES[idx].code
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const selectShade = (shade, rect, e) => {
    setActiveShade({ name: shade.name, code: shade.code, finish: shade.finish })
    setActive(shade)
    const x = e?.clientX ?? rect.left + rect.width / 2
    const y = e?.clientY ?? rect.top + rect.height / 2
    setShowcase({ shade, origin: [x, y] })
  }

  return (
    <section
      id="shades"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden py-28 sm:py-36"
      aria-labelledby="shades-title"
    >
      {/* the liquid plane from the world canvas flows behind this section */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream-300">
            <span className="h-1.5 w-1.5 rounded-full bg-coral-400" aria-hidden />
            The Shade Lab
          </span>
        </Reveal>
        <h2 id="shades-title" className="mt-6 font-display text-5xl font-extrabold tracking-tight text-cream-50 sm:text-7xl">
          <TextReveal text="FIND YOUR COLOR" />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-md text-base text-cream-300">
            Every space begins with a shade. <span className="text-cream-100">Hover to feel it — click to step inside.</span>
          </p>
        </Reveal>

        {/* the pools */}
        <Reveal delay={0.2} className="mt-16 w-full">
          <div className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-6 overflow-x-auto pb-6 pt-4 no-scrollbar sm:justify-center sm:overflow-visible sm:flex-wrap lg:gap-8">
            {SHADES.map((shade, i) => (
              <ShadePool
                key={shade.code}
                shade={shade}
                index={i}
                active={active}
                onSelect={selectShade}
              />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-6 text-[11px] uppercase tracking-[0.35em] text-cream-400">
            Selected · <span style={{ color: store.activeShade }}>{active.name}</span> · {active.code}
          </p>
        </Reveal>
      </div>

      <AnimatePresence>
        {showcase && (
          <ShadeShowcase
            key={showcase.shade.code}
            shade={showcase.shade}
            origin={showcase.origin}
            onClose={() => setShowcase(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
