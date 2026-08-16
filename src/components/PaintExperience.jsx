import { Suspense, lazy } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { TextReveal, Reveal } from './ui/Reveal'
import MagneticButton from './ui/MagneticButton'
import { scrollToId } from '../lib/hooks'

const PaintCanScene = lazy(() => import('./three/PaintCanScene'))

/* Cinematic band where the procedural paint can lives.
   As you scroll, the can spins, lifts and moves toward the camera
   before the section melts into the color collection. */
export default function PaintExperience({ scrollRef }) {
  const { scrollYProgress } = useScroll({
    target: '#paint-can-section',
    offset: ['start start', 'end end'],
  })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section id="paint-can-section" className="relative h-[130vh] overflow-hidden">
      {/* backdrop glow */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_55%,rgba(255,92,77,0.09),transparent_70%)]" />

      <div className="sticky top-0 h-screen w-full">
        <Suspense fallback={null}>
          <PaintCanScene scrollRef={scrollRef} />
        </Suspense>

        {/* floating caption */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="pointer-events-none absolute left-1/2 top-[12%] z-10 w-full -translate-x-1/2 px-6 text-center"
        >
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden />
              The 3D Paint Experience
            </span>
          </Reveal>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-cream-50 sm:text-6xl">
            <TextReveal text="Every color." delay={0.1} />{' '}
            <span className="text-gradient-paint"><TextReveal text="One perfect drop." delay={0.3} /></span>
          </h2>
        </motion.div>

        {/* bottom hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2"
        >
          <MagneticButton variant="ghost" onClick={() => scrollToId('#colors')}>
            Meet the color collection
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
