import { Award, Sparkles } from 'lucide-react'
import { STATS } from '../data/content'
import { SectionHeading, Reveal, Counter } from './ui/Reveal'

export default function Stats() {
  return (
    <section className="relative py-28 sm:py-36" aria-labelledby="about-title">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Why BIG PAINTS"
          title="Trusted by people who care about their walls"
          description="A decade of color expertise, premium formulations and a service standard that turns houses into homes."
        />

        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="group relative overflow-hidden rounded-3xl glass p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.07]">
                <div
                  aria-hidden
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-50"
                  style={{ background: 'radial-gradient(circle, rgba(255,92,77,0.5), transparent 70%)' }}
                />
                <p className="font-display text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl" style={{ backgroundImage: 'linear-gradient(100deg,#fff,#ffb454)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-cream-300">{stat.label}</p>
                <Award className="mx-auto mt-5 h-5 w-5 text-coral-400/70 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" aria-hidden />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3} className="mx-auto mt-16 max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl glow-border p-8 sm:p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-coral-500/10 via-transparent to-sky-400/10" aria-hidden />
            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-coral-500 to-ember-500 text-ink-950 shadow-[0_10px_40px_-10px_rgba(255,92,77,0.7)]">
                <Sparkles className="h-7 w-7" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-2xl font-bold text-cream-50">Premium quality, guaranteed</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-300">
                  Every can is factory-sealed, batch-tested and backed by our finish warranty. If the paint
                  doesn't deliver, we repaint — free.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
