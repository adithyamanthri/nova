import { motion } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  PaintSplash — an animated liquid divider between sections.         */
/*  Paints a soft blob of color from the bottom edge upward.           */
/* ------------------------------------------------------------------ */
export function PaintSplash({ colorA = '#ff5c4d', colorB = '#ffb454', flip = false, className = '' }) {
  return (
    <div className={`pointer-events-none relative -mt-px h-28 w-full overflow-hidden sm:h-40 ${className}`} aria-hidden>
      <motion.svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className="h-full w-full"
        initial={{ y: '40%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transform: flip ? 'scaleY(-1)' : undefined }}
      >
        <defs>
          <linearGradient id="ps-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colorA} />
            <stop offset="100%" stopColor={colorB} />
          </linearGradient>
          <filter id="ps-blur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <path
          d="M0,120 C160,60 320,170 480,110 C640,50 800,180 960,130 C1120,80 1280,170 1440,100 L1440,220 L0,220 Z"
          fill="url(#ps-grad)"
          opacity="0.35"
          filter="url(#ps-blur)"
        />
        <path
          d="M0,160 C140,110 300,210 460,150 C620,90 780,200 940,150 C1100,100 1260,190 1440,130 L1440,220 L0,220 Z"
          fill="url(#ps-grad)"
        />
        {/* floating droplets */}
        {[
          [180, 60, 10], [420, 40, 6], [700, 72, 14], [980, 44, 8], [1230, 62, 11],
        ].map(([cx, cy, r], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill={i % 2 ? colorB : colorA}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.12, duration: 0.8, ease: 'easeOut' }}
          />
        ))}
      </motion.svg>
    </div>
  )
}

/* Soft radial gradient transition — blends one section into the next */
export function LiquidTransition({ className = '' }) {
  return (
    <div className={`pointer-events-none relative h-32 overflow-hidden sm:h-48 ${className}`} aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_100%,rgba(255,92,77,0.14),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}
