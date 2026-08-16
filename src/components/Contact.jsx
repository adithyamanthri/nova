import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, CheckCircle2, Loader2, Phone } from 'lucide-react'
import { SectionHeading, Reveal } from './ui/Reveal'
import MagneticButton from './ui/MagneticButton'
import { CONTACT_INFO } from '../data/content'

const SERVICES_OPTIONS = [
  'Interior Painting',
  'Exterior Painting',
  'Color Consultation',
  'Texture Painting',
  'Waterproofing',
  'Commercial Painting',
  'Residential Painting',
]

const inputCls =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-cream-50 placeholder:text-cream-500/60 transition-all duration-300 focus:border-coral-400/60 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-coral-400/20'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    // Simulated async submit — swap for a real endpoint (Formspree / email API) later.
    setTimeout(() => setStatus('sent'), 1400)
  }

  const reset = () => {
    setForm({ name: '', phone: '', email: '', service: '', message: '' })
    setStatus('idle')
  }

  return (
    <section className="relative py-28 sm:py-36" aria-labelledby="contact-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* left copy */}
          <div>
            <SectionHeading
              align="left"
              eyebrow="Get In Touch"
              title="Start your color journey"
              description="Tell us about your space and we'll come back within one working day with a plan, a palette and a transparent quote."
            />
            <Reveal delay={0.25}>
              <div className="mt-10 flex items-center gap-4 rounded-3xl glass p-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-coral-500 to-ember-500 text-ink-950">
                  <Phone className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cream-400">Prefer to talk?</p>
                  <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="font-display text-xl font-bold text-cream-50 transition-colors hover:text-coral-400">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="mt-6 rounded-3xl glow-border p-6">
                <p className="text-sm leading-relaxed text-cream-300">
                  <span className="font-semibold text-cream-50">Free color consultation</span> on every order above
                  ₹10,000 — including a home visit, sample swatches and a 3D preview of your room.
                </p>
              </div>
            </Reveal>
          </div>

          {/* form */}
          <Reveal delay={0.15}>
            <div className="relative overflow-hidden rounded-3xl glass p-6 sm:p-9">
              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center py-16 text-center"
                    role="status"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-forest-400 to-sky-400 text-ink-950 shadow-[0_20px_60px_-15px_rgba(78,207,142,0.7)]"
                    >
                      <CheckCircle2 className="h-10 w-10" aria-hidden />
                    </motion.span>
                    <h3 className="mt-6 font-display text-2xl font-bold text-cream-50">Color journey started! 🎨</h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream-300">
                      Thanks {form.name || 'friend'}! Our color experts will reach out within one working day.
                    </p>
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-8 rounded-full glass px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-cream-200 transition-colors hover:bg-white/10"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={onSubmit}
                    className="flex flex-col gap-5"
                    aria-label="Contact form"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="cf-name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-cream-300">
                          Name *
                        </label>
                        <input id="cf-name" required value={form.name} onChange={update('name')} placeholder="Your full name" className={inputCls} autoComplete="name" />
                      </div>
                      <div>
                        <label htmlFor="cf-phone" className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-cream-300">
                          Phone Number *
                        </label>
                        <input id="cf-phone" required type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 98XXX XXXXX" className={inputCls} autoComplete="tel" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cf-email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-cream-300">
                        Email
                      </label>
                      <input id="cf-email" type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" className={inputCls} autoComplete="email" />
                    </div>

                    <div>
                      <label htmlFor="cf-service" className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-cream-300">
                        Service Required
                      </label>
                      <select id="cf-service" value={form.service} onChange={update('service')} className={`${inputCls} appearance-none [&>option]:bg-ink-800`}>
                        <option value="">Select a service…</option>
                        {SERVICES_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="cf-message" className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-cream-300">
                        Message *
                      </label>
                      <textarea id="cf-message" required rows={4} value={form.message} onChange={update('message')} placeholder="Tell us about your space — rooms, size, current condition…" className={`${inputCls} resize-none`} />
                    </div>

                    <MagneticButton type="submit" size="lg" className="w-full justify-center !py-4">
                      {status === 'sending' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" aria-hidden />
                          START YOUR COLOR JOURNEY
                        </>
                      )}
                    </MagneticButton>
                    <p className="text-center text-[11px] text-cream-500">
                      We respect your privacy. No spam, ever.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
