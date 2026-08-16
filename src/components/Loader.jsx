import { useEffect } from 'react'
import { motion } from 'framer-motion'

/* Premium initial loader: an animated paint stroke reveals the logo,
   then the whole overlay wipes upward. Stays short (~2s). */
export default function Loader({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2100)
    return () => clearTimeout(t)
  }, [onComplete])
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-900"
      exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
      aria-label="Loading BIG PAINTS"
      role="status"
    >
      {/* ambient glow behind logo */}
      <motion.div
        aria-hidden
        className="absolute h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,92,77,0.18),transparent_65%)]"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
      />

      <div className="relative flex flex-col items-center">
        <svg width="240" height="80" viewBox="0 0 240 80" fill="none" aria-hidden>
          {/* paint stroke that reveals the wordmark */}
          <motion.rect
            x="10"
            y="26"
            width="220"
            height="28"
            rx="14"
            fill="url(#loader-grad)"
            initial={{ pathLength: 0, scaleX: 0 }}
            animate={{ scaleX: [0, 1, 1] }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left center' }}
          />
          <defs>
            <linearGradient id="loader-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff5c4d" />
              <stop offset="55%" stopColor="#ffb454" />
              <stop offset="100%" stopColor="#57c8f2" />
            </linearGradient>
          </defs>
          {/* droplets trailing the stroke */}
          {[
            [30, 62, 5], [70, 66, 4], [120, 60, 6], [170, 68, 4], [212, 63, 5],
          ].map(([cx, cy, r], i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={['#ff5c4d', '#ffb454', '#57c8f2'][i % 3]}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: [0, 1, 1], y: [8, 0, 0] }}
              transition={{ delay: 0.5 + i * 0.09, duration: 0.5 }}
            />
          ))}
        </svg>

        <motion.h1
          className="mt-2 font-display text-3xl font-extrabold tracking-[0.35em] text-cream-50"
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          BIG&nbsp;PAINTS
        </motion.h1>

        <motion.p
          className="mt-3 text-[11px] uppercase tracking-[0.4em] text-cream-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          Bringing spaces to life
        </motion.p>
      </div>

      {/* progress line */}
      <motion.div
        className="absolute bottom-24 h-px w-40 overflow-hidden bg-white/10"
        aria-hidden
      >
        <motion.div
          className="h-full bg-gradient-to-r from-coral-500 to-ember-500"
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  )
}
