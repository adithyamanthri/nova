import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X, Check, Palette, ArrowRight } from 'lucide-react'
import { COLOR_COLLECTION } from '../data/content'
import { SectionHeading, Reveal } from './ui/Reveal'
import MagneticButton from './ui/MagneticButton'
import { scrollToId } from '../lib/engine/scroll'

function ColorCard({ color, index, onSelect }) {
  const reduced = useReducedMotion()
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(color)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? undefined : { scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-3xl p-6 text-left"
      style={{ backgroundColor: color.hex }}
      data-cursor="shade"
      data-cursor-color={color.hex}
      aria-label={`Preview ${color.name}, hex ${color.hex}`}
    >
      {/* paint ripple on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 120%, ${color.hex} 0%, rgba(255,255,255,0.14) 55%, transparent 70%)`,
        }}
      />
      {/* spreading color halo */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-10 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-60"
        style={{ background: `radial-gradient(circle, ${color.hex}, transparent 70%)` }}
      />

      {/* family chip */}
      <span className="relative z-10 inline-flex w-fit items-center gap-2 rounded-full bg-black/25 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
        <Palette className="h-3 w-3" aria-hidden />
        {color.family}
      </span>

      {/* info */}
      <div className="relative z-10">
        <p className="font-display text-[11px] font-medium uppercase tracking-[0.25em] text-white/70">
          {color.hex}
        </p>
        <h3 className="mt-1.5 font-display text-2xl font-bold text-white drop-shadow-sm">{color.name}</h3>
        <p className="mt-0.5 text-xs text-white/80">RGB · {color.rgb}</p>

        <span className="mt-4 inline-flex translate-y-2 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-ink-900 opacity-0 shadow-lg transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
          Preview
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </motion.button>
  )
}

/* Fullscreen color preview with liquid transition */
function ColorPreview({ color, onClose }) {
  const reduced = useReducedMotion()
  const textColor = ['#F4F1EA', '#C9B79A', '#E8E2D2'].includes(color.hex) ? '#0a0a0c' : '#ffffff'
  return (
    <motion.div
      className="fixed inset-0 z-[95] flex flex-col overflow-hidden"
      initial={{ clipPath: 'circle(0% at 50% 50%)', opacity: 0.6 }}
      animate={{ clipPath: 'circle(150% at 50% 50%)', opacity: 1 }}
      exit={{ clipPath: 'circle(0% at 50% 50%)', opacity: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.9, ease: [0.76, 0, 0.24, 1] }}
      style={{ backgroundColor: color.hex }}
      role="dialog"
      aria-modal="true"
      aria-label={`${color.name} color preview`}
    >
      {/* decorative paint ripples */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            width: `${30 + i * 18}vw`,
            height: `${30 + i * 18}vw`,
            left: `${10 + i * 22}%`,
            top: `${15 + (i % 2) * 40}%`,
            border: `1.5px solid ${textColor}22`,
          }}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ repeat: Infinity, duration: 9 + i * 3, ease: 'easeInOut' }}
        />
      ))}

      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-110"
        style={{ backgroundColor: `${textColor}1f`, color: textColor }}
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-20 sm:px-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-[11px] font-semibold uppercase tracking-[0.4em]"
          style={{ color: `${textColor}aa` }}
        >
          {color.family} · Finish {color.finish}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-display text-6xl font-extrabold tracking-tight sm:text-8xl"
          style={{ color: textColor }}
        >
          {color.name}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center gap-6"
          style={{ color: textColor }}
        >
          <div className="rounded-2xl px-5 py-4 backdrop-blur-md" style={{ backgroundColor: `${textColor}14` }}>
            <p className="text-[10px] uppercase tracking-[0.25em] opacity-60">Hex</p>
            <p className="mt-1 font-display text-lg font-bold">{color.hex}</p>
          </div>
          <div className="rounded-2xl px-5 py-4 backdrop-blur-md" style={{ backgroundColor: `${textColor}14` }}>
            <p className="text-[10px] uppercase tracking-[0.25em] opacity-60">RGB</p>
            <p className="mt-1 font-display text-lg font-bold">{color.rgb}</p>
          </div>
          <div className="rounded-2xl px-5 py-4 backdrop-blur-md" style={{ backgroundColor: `${textColor}14` }}>
            <p className="text-[10px] uppercase tracking-[0.25em] opacity-60">Finish</p>
            <p className="mt-1 font-display text-lg font-bold">{color.finish}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticButton
            variant={textColor === '#0a0a0c' ? 'primary' : 'ghost'}
            onClick={() => {
              onClose()
              setTimeout(() => scrollToId('#visualizer'), 500)
            }}
          >
            <Check className="h-4 w-4" aria-hidden />
            Try this color in a room
          </MagneticButton>
          <MagneticButton
            variant={textColor === '#0a0a0c' ? 'ghost' : 'primary'}
            onClick={() => {
              onClose()
              setTimeout(() => scrollToId('#contact'), 500)
            }}
          >
            Order this paint
          </MagneticButton>
        </motion.div>
      </div>

      {/* bottom swatch strip */}
      <div className="relative z-10 flex items-center gap-3 overflow-x-auto px-6 pb-8 no-scrollbar sm:px-16">
        {COLOR_COLLECTION.map((c) => (
          <span
            key={c.hex}
            className={`h-14 w-14 shrink-0 cursor-pointer rounded-full border-2 transition-transform hover:scale-110 ${c.hex === color.hex ? 'scale-110' : ''}`}
            style={{ backgroundColor: c.hex, borderColor: c.hex === color.hex ? textColor : `${textColor}33` }}
            title={c.name}
            onClick={() => onClose()}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function Colors() {
  const [selected, setSelected] = useState(null)
  return (
    <section className="relative py-28 sm:py-36" aria-labelledby="colors-title">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Explore Our Colors"
          title="A palette for every mood"
          description="Eight signature colors, each a story. Hover to feel the color, click to step inside it."
        />

        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {COLOR_COLLECTION.map((color, i) => (
            <ColorCard key={color.hex} color={color} index={i} onSelect={setSelected} />
          ))}
        </div>

        <Reveal delay={0.2} className="mt-14 text-center">
          <MagneticButton variant="ghost" onClick={() => scrollToId('#visualizer')}>
            Visualize a room with these colors
            <ArrowRight className="h-4 w-4" aria-hidden />
          </MagneticButton>
        </Reveal>
      </div>

      <AnimatePresence>
        {selected && <ColorPreview color={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}
