import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, MessageCircle, Navigation, Store } from 'lucide-react'
import { CONTACT_INFO } from '../data/content'
import { Reveal } from './ui/Reveal'
import MagneticButton from './ui/MagneticButton'

/* Stylized animated "map" backdrop — glowing streets + marker pulse */
function MapBackdrop() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <svg viewBox="0 0 800 600" className="h-full w-full opacity-[0.16]" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0 H0 V60" fill="none" stroke="#ffffff" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#grid)" />
        {/* streets */}
        <path d="M0 150 C 200 120, 400 200, 800 140" fill="none" stroke="#ff5c4d" strokeWidth="3" />
        <path d="M0 380 C 250 420, 500 340, 800 400" fill="none" stroke="#57c8f2" strokeWidth="2.5" />
        <path d="M200 0 C 240 200, 180 400, 240 600" fill="none" stroke="#ffb454" strokeWidth="2.5" />
        <path d="M560 0 C 520 180, 620 420, 560 600" fill="none" stroke="#9d8cf6" strokeWidth="2" />
        {/* river */}
        <path d="M0 520 C 300 480, 500 540, 800 500" fill="none" stroke="#57c8f2" strokeWidth="14" opacity="0.5" />
        {/* blocks */}
        {[
          [90, 220], [320, 90], [520, 230], [680, 80], [120, 440], [420, 470], [640, 320],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="46" height="30" rx="6" fill="#ffffff" opacity="0.35" />
        ))}
      </svg>
      {/* pulsing marker */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.span
          className="absolute inset-0 rounded-full bg-coral-500/40"
          animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
        />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-coral-500 to-ember-500 text-ink-950 shadow-[0_10px_40px_-8px_rgba(255,92,77,0.8)]">
          <Store className="h-6 w-6" aria-hidden />
        </span>
      </div>
    </div>
  )
}

export default function Location() {
  return (
    <section id="location" className="relative overflow-hidden py-28 sm:py-36" aria-labelledby="location-title">
      <MapBackdrop />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream-300">
              <MapPin className="h-3.5 w-3.5 text-coral-400" aria-hidden />
              Visit Us
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="location-title" className="mt-5 font-display text-5xl font-extrabold tracking-tight text-cream-50 sm:text-6xl">
              BIG<span className="text-coral-400">PAINTS</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream-300">
              {CONTACT_INFO.tagline}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-14">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, title: 'Address', lines: [CONTACT_INFO.address] },
              { icon: Phone, title: 'Phone', lines: [CONTACT_INFO.phone], href: `tel:${CONTACT_INFO.phone.replace(/\s/g, '')}` },
              { icon: MessageCircle, title: 'WhatsApp', lines: [CONTACT_INFO.whatsapp], href: `https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}` },
              { icon: Clock, title: 'Opening Hours', lines: CONTACT_INFO.hours.map((h) => `${h.day}: ${h.time}`) },
            ].map((card) => (
              <div key={card.title} className="group rounded-3xl glass p-6 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.07]">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-coral-500/20 to-ember-500/20 text-coral-400 transition-transform duration-500 group-hover:scale-110">
                  <card.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-sm font-bold uppercase tracking-[0.2em] text-cream-300">
                  {card.title}
                </h3>
                {card.lines.map((line) =>
                  card.href ? (
                    <a key={line} href={card.href} className="mt-2 block text-sm text-cream-100 transition-colors hover:text-coral-400">
                      {line}
                    </a>
                  ) : (
                    <p key={line} className="mt-2 text-sm leading-relaxed text-cream-100">
                      {line}
                    </p>
                  )
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.28} className="mt-12 flex justify-center">
          <MagneticButton size="lg" href={CONTACT_INFO.mapsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-4 w-4" aria-hidden />
            Open in Google Maps
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  )
}
