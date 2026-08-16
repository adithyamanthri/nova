import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import { NAV_LINKS, CONTACT_INFO } from '../data/content'
import { scrollToId } from '../lib/engine/scroll'
import MagneticButton from './ui/MagneticButton'

function Logo({ onClick }) {
  return (
    <a
      href="#home"
      onClick={(e) => { e.preventDefault(); onClick('#home') }}
      className="group flex items-center gap-2.5"
      aria-label="BIG PAINTS — home"
    >
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-coral-500 to-ember-500 shadow-[0_6px_20px_-6px_rgba(255,92,77,0.7)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink-950" fill="currentColor" aria-hidden>
          <path d="M12 2c2.8 3.8 4.8 6.7 4.8 9.3A4.8 4.8 0 1 1 7.2 11.3C7.2 8.7 9.2 5.8 12 2z" />
        </svg>
        <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </span>
      <span className="font-display text-lg font-extrabold tracking-[0.18em] text-cream-50">
        BIG<span className="text-coral-400">PAINTS</span>
      </span>
    </a>
  )
}

export default function Navbar({ started }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const go = (href) => {
    setOpen(false)
    // allow menu overlay to close before scrolling
    setTimeout(() => scrollToId(href), open ? 350 : 0)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={started ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[80] flex justify-center px-4 pt-4 sm:px-6"
      >
        <nav
          aria-label="Primary"
          className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5 ${
            scrolled ? 'glass-strong shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]' : 'bg-transparent'
          }`}
          style={{ maxWidth: scrolled ? 'min(72rem, 94vw)' : 'min(80rem, 96vw)', margin: '0 auto' }}
        >
          <Logo onClick={go} />

          {/* desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); go(link.href) }}
                  className="relative rounded-full px-4 py-2 text-[13px] font-medium text-cream-300 transition-colors duration-300 hover:text-cream-50"
                >
                  {link.label}
                  <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-coral-400 to-ember-400 transition-transform duration-300 hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 rounded-full glass px-4 py-2.5 text-[13px] font-medium text-cream-200 transition-colors hover:bg-white/10"
            >
              <Phone className="h-3.5 w-3.5 text-coral-400" aria-hidden />
              {CONTACT_INFO.phone}
            </a>
            <MagneticButton onClick={() => go('#contact')} className="!px-5 !py-2.5">
              Get a Quote
            </MagneticButton>
          </div>

          {/* mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-xl glass text-cream-50 transition-colors hover:bg-white/10 lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </nav>
      </motion.header>

      {/* fullscreen mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[75] flex flex-col justify-center bg-ink-900/95 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0, clipPath: 'circle(0% at 92% 6%)' }}
            animate={{ opacity: 1, clipPath: 'circle(140% at 92% 6%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 92% 6%)' }}
            transition={{ duration: reduced ? 0.1 : 0.7, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col items-center gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); go(link.href) }}
                    className="block font-display text-3xl font-bold tracking-tight text-cream-100 transition-colors hover:text-coral-400"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="mt-12 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <MagneticButton onClick={() => go('#contact')} size="lg">
                Get a Free Quote
              </MagneticButton>
            </motion.div>
            <p className="mt-10 text-center text-xs tracking-[0.3em] text-cream-400">{CONTACT_INFO.phone}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
