import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, MessageCircle } from 'lucide-react'
import { NAV_LINKS, CONTACT_INFO } from '../data/content'
import { scrollToId } from '../lib/engine/scroll'

const SOCIALS = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/8 bg-ink-950/60" aria-label="Footer">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div>
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToId('#home') }} className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-coral-500 to-ember-500">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink-950" fill="currentColor" aria-hidden>
                  <path d="M12 2c2.8 3.8 4.8 6.7 4.8 9.3A4.8 4.8 0 1 1 7.2 11.3C7.2 8.7 9.2 5.8 12 2z" />
                </svg>
              </span>
              <span className="font-display text-lg font-extrabold tracking-[0.18em] text-cream-50">
                BIG<span className="text-coral-400">PAINTS</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-400">{CONTACT_INFO.tagline}</p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl glass text-cream-300 transition-all duration-300 hover:-translate-y-1 hover:border-coral-400/50 hover:text-coral-400"
                >
                  <s.icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* nav */}
          <nav aria-label="Footer navigation">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-cream-300">Explore</h3>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToId(link.href) }}
                    className="text-sm text-cream-400 transition-colors hover:text-coral-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-cream-300">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm text-cream-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral-400" aria-hidden />
                {CONTACT_INFO.address}
              </li>
              <li>
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="flex items-center gap-2.5 transition-colors hover:text-coral-400">
                  <Phone className="h-4 w-4 shrink-0 text-coral-400" aria-hidden />
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, '')}`} className="flex items-center gap-2.5 transition-colors hover:text-coral-400">
                  <MessageCircle className="h-4 w-4 shrink-0 text-coral-400" aria-hidden />
                  WhatsApp us
                </a>
              </li>
              <li>
                <a href="mailto:hello@bigpaints.in" className="flex items-center gap-2.5 transition-colors hover:text-coral-400">
                  <Mail className="h-4 w-4 shrink-0 text-coral-400" aria-hidden />
                  hello@bigpaints.in
                </a>
              </li>
            </ul>
          </div>

          {/* hours */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-cream-300">Opening Hours</h3>
            <ul className="mt-5 space-y-3 text-sm text-cream-400">
              {CONTACT_INFO.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4">
                  <span>{h.day}</span>
                  <span className="font-medium text-cream-200">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 sm:flex-row">
          <p className="text-xs text-cream-500">© {new Date().getFullYear()} BIG PAINTS. All rights reserved.</p>
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-cream-500">
            Bring your space to life<span className="text-coral-400">.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
