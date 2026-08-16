import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, ArrowRight, Droplets } from 'lucide-react'
import { TextReveal } from './ui/Reveal'
import MagneticButton from './ui/MagneticButton'
import { Marquee } from './ui/Effects'
import { scrollToId } from '../lib/hooks'

const EASE = [0.22, 1, 0.36, 1]

export default function Hero({ started }) {
  const { scrollYProgress } = useScroll({ target: '#home', offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.25])

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* ambient DOM glow behind text */}
      <motion.div
        aria-hidden
        style={{ scale: glowScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] max-h-[700px] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,122,107,0.12),transparent_60%)]"
      />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative flex flex-col items-center">
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
          className="mb-8 flex items-center gap-2 rounded-full glass px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-cream-200"
        >
          <Droplets className="h-3.5 w-3.5 text-coral-400" aria-hidden />
          Premium Paints & Home Decor
        </motion.div>

        {/* headline */}
        <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-cream-50 sm:text-7xl lg:text-[6.5rem]">
          <TextReveal text="BRING YOUR" delay={0.3} started={started} />
          <br />
          <span className="text-gradient-paint">
            <TextReveal text="SPACE TO LIFE." delay={0.5} started={started} />
          </span>
        </h1>

        {/* subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-7 max-w-xl text-base leading-relaxed text-cream-300 sm:text-lg"
        >
          Premium paints. Beautiful colors. Extraordinary spaces.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={started ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8, ease: EASE }}
          className="mt-11 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton size="lg" onClick={() => scrollToId('#colors')}>
            EXPLORE COLORS
            <ArrowRight className="h-4 w-4" aria-hidden />
          </MagneticButton>
          <MagneticButton size="lg" variant="ghost" onClick={() => scrollToId('#location')}>
            VISIT OUR STORE
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        onClick={() => scrollToId('#colors')}
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ delay: 1.4 }}
        className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-cream-400 transition-colors hover:text-cream-100 sm:bottom-8"
        aria-label="Scroll to explore colors"
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
          <ChevronDown className="h-5 w-5" aria-hidden />
        </motion.span>
      </motion.button>

      {/* paint-name marquee pinned to the bottom */}
      <div className="absolute inset-x-0 bottom-0 border-t border-white/5 bg-ink-900/40 py-4 backdrop-blur-sm">
        <Marquee items={['Arctic White', 'Royal Blue', 'Forest Green', 'Sunset Orange', 'Rose Pink', 'Ocean Blue', 'Sand Beige', 'Charcoal Black']} />
      </div>
    </div>
  )
}
