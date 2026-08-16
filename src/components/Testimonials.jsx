import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { TESTIMONIALS } from '../data/content'
import { useIsMobile } from '../lib/hooks'

function Stars({ rating }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-ember-400 text-ember-400' : 'text-cream-500/40'}`}
          aria-hidden
        />
      ))}
    </div>
  )
}

function TestimonialCard({ t, i }) {
  return (
    <article
      className="relative flex h-full w-[85vw] shrink-0 flex-col justify-between overflow-hidden rounded-3xl glass p-8 transition-transform duration-500 hover:-translate-y-2 sm:w-[460px] sm:p-9"
      style={{ transform: 'perspective(1200px)' }}
    >
      {/* depth + glow */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
      <div
        aria-hidden
        className="absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-25 blur-3xl"
        style={{ background: `radial-gradient(circle, ${t.color}, transparent 70%)` }}
      />
      <Quote className="h-8 w-8 text-coral-400/60" aria-hidden />

      <p className="relative mt-5 flex-1 text-[15px] leading-relaxed text-cream-100">“{t.text}”</p>

      <footer className="relative mt-7 flex items-center gap-4 border-t border-white/8 pt-6">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full font-display text-sm font-bold text-ink-950"
          style={{ background: `linear-gradient(135deg, ${t.color}, #fff)` }}
          aria-hidden
        >
          {t.name.split(' ').map((n) => n[0]).join('')}
        </span>
        <div>
          <p className="font-display text-sm font-bold text-cream-50">{t.name}</p>
          <p className="text-xs text-cream-400">{t.location}</p>
        </div>
        <div className="ml-auto">
          <Stars rating={t.rating} />
        </div>
      </footer>
    </article>
  )
}

export default function Testimonials() {
  const isMobile = useIsMobile()
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-50%'])

  return (
    <section ref={sectionRef} className="relative py-28 sm:py-36" aria-labelledby="testimonials-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream-300">
              <span className="h-1.5 w-1.5 rounded-full bg-forest-400" aria-hidden />
              Testimonials
            </span>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-cream-50 sm:text-5xl">
              Walls we've made <span className="text-gradient-paint">happy</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-cream-400 sm:text-right">
            Real reviews from real homes. Keep scrolling — the stories glide by.
          </p>
        </div>
      </div>

      {isMobile ? (
        /* vertical stack on mobile */
        <div className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 no-scrollbar">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} i={i} />
          ))}
        </div>
      ) : (
        /* scroll-driven horizontal track on desktop */
        <div className="relative mt-16">
          <motion.div style={{ x }} className="flex w-max gap-6 px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.name} t={t} i={i} />
            ))}
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={`${t.name}-dup`} t={t} i={i} />
            ))}
          </motion.div>
        </div>
      )}
    </section>
  )
}
