import { motion, useReducedMotion } from 'framer-motion'
import { PaintRoller, Building2, Palette, Waves, Droplets, Store, Home, ArrowUpRight } from 'lucide-react'
import { SERVICES } from '../data/content'
import { SectionHeading, Reveal } from './ui/Reveal'
import { scrollToId } from '../lib/engine/scroll'

const ICONS = {
  roller: PaintRoller,
  building: Building2,
  palette: Palette,
  texture: Waves,
  droplets: Droplets,
  store: Store,
  home: Home,
}

const ACCENTS = [
  'from-coral-500 to-ember-500',
  'from-sky-500 to-sky-400',
  'from-violet-400 to-sky-400',
  'from-ember-500 to-coral-500',
  'from-forest-400 to-sky-400',
  'from-coral-500 to-violet-400',
  'from-ember-400 to-forest-400',
]

export default function Services() {
  const reduced = useReducedMotion()
  return (
    <section className="relative py-28 sm:py-36" aria-labelledby="services-title">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Our Services"
          title="From consultation to final coat"
          description="Full-service painting, handled end to end by craftsmen who treat your home like their own."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICES.map((service, i) => {
            const Icon = ICONS[service.icon] ?? Palette
            return (
              <Reveal key={service.title} delay={(i % 4) * 0.08} y={30}>
                <motion.button
                  type="button"
                  onClick={() => scrollToId('#contact')}
                  whileHover={reduced ? undefined : { y: -8 }}
                  className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl glass p-7 text-left transition-colors duration-500 hover:bg-white/[0.07]"
                >
                  {/* hover gradient wash */}
                  <div
                    aria-hidden
                    className={`absolute inset-0 bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]} opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-40`}
                  />
                  <div
                    aria-hidden
                    className="absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-60"
                    style={{ background: `radial-gradient(circle, ${['#ff5c4d', '#57c8f2', '#9d8cf6', '#ffb454', '#4ecf8e'][i % 5]}, transparent 70%)` }}
                  />

                  <div className="relative mb-6 flex items-center justify-between">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]} text-ink-950 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-cream-500 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" aria-hidden />
                  </div>

                  <h3 className="relative font-display text-lg font-bold text-cream-50">{service.title}</h3>
                  <p className="relative mt-2.5 text-sm leading-relaxed text-cream-400 opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                    {service.description}
                  </p>

                  {/* animated underline */}
                  <span aria-hidden className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-coral-500 to-ember-500 transition-all duration-500 group-hover:w-full" />
                </motion.button>
              </Reveal>
            )
          })}

          {/* CTA tile */}
          <Reveal delay={0.2} y={30}>
            <button
              type="button"
              onClick={() => scrollToId('#contact')}
              className="group flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl p-7 text-left glow-border"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-coral-500/15 via-transparent to-ember-500/15" aria-hidden />
              <p className="relative font-display text-2xl font-bold leading-snug text-cream-50">
                Not sure what your space needs?
              </p>
              <p className="relative mt-3 text-sm text-cream-300">Book a free color consultation — we'll bring the ideas.</p>
              <span className="relative mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold text-coral-400 transition-transform duration-500 group-hover:translate-x-2">
                Talk to an expert
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </span>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
