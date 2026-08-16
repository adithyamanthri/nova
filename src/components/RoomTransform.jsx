import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { MoveHorizontal } from 'lucide-react'
import { SectionHeading } from './ui/Reveal'
import { useActiveShade } from '../lib/hooks'

/* tiny color helpers for shade-derived walls */
const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
const mix = (hex, target, amt) => {
  const [r, g, b] = hexToRgb(hex)
  const [tr, tg, tb] = target
  const m = (c, tc) => Math.round(c + (tc - c) * amt)
  return `rgb(${m(r, tr)}, ${m(g, tg)}, ${m(b, tb)})`
}

/* ------------------------------------------------------------------ */
/*  Room scene drawn in SVG. `mode` renders the before (drab) or       */
/*  after (painted) state of the same room. The after wall follows     */
/*  the shade selected in the Shade Lab.                               */
/* ------------------------------------------------------------------ */
function RoomScene({ mode, wallColor = '#ff5c4d' }) {
  const painted = mode === 'after'
  const light = [255, 255, 255]
  const wallTop = mix(wallColor, light, 0.18)
  const wallDeep = mix(wallColor, [0, 0, 0], 0.28)
  const feature = mix(wallColor, light, 0.25)
  const side = mix(wallColor, [0, 0, 0], 0.35)
  return (
    <svg viewBox="0 0 900 540" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="wall-before" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8b0a4" />
          <stop offset="100%" stopColor="#a49c90" />
        </linearGradient>
        <linearGradient id="wall-after" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={wallTop} />
          <stop offset="55%" stopColor={wallColor} />
          <stop offset="100%" stopColor={wallDeep} />
        </linearGradient>
        <linearGradient id="feature-after" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={feature} />
          <stop offset="100%" stopColor={wallDeep} />
        </linearGradient>
        <linearGradient id="floor-before" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8d8577" />
          <stop offset="100%" stopColor="#6f685c" />
        </linearGradient>
        <linearGradient id="floor-after" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9b79a" />
          <stop offset="100%" stopColor="#a98f6d" />
        </linearGradient>
      </defs>

      {/* back wall */}
      <rect x="0" y="0" width="900" height="390" fill={painted ? 'url(#wall-after)' : 'url(#wall-before)'} />
      {/* side wall (perspective) */}
      <polygon points="0,0 170,0 170,390 0,390" fill={painted ? side : '#9a9286'} opacity="0.55" />
      {/* feature wall panel */}
      <rect x="430" y="70" width="300" height="240" rx="14" fill={painted ? 'url(#feature-after)' : '#9f978a'} opacity={painted ? 0.92 : 0.4} />
      {/* picture frame */}
      <rect x="500" y="110" width="160" height="120" rx="8" fill={painted ? '#1f1f24' : '#7d766b'} />
      <rect x="516" y="126" width="128" height="88" rx="4" fill={painted ? '#3a2b2f' : '#8a8377'} />
      {/* skirting */}
      <rect x="0" y="382" width="900" height="10" fill={painted ? '#fff1e6' : '#8d8577'} opacity="0.85" />
      {/* floor */}
      <rect x="0" y="392" width="900" height="148" fill={painted ? 'url(#floor-after)' : 'url(#floor-before)'} />
      {/* floor planks */}
      {[90, 180, 270, 360, 450, 540, 630, 720, 810].map((x) => (
        <line key={x} x1={x} y1="392" x2={x - 40} y2="540" stroke={painted ? '#a98f6d' : '#6f685c'} strokeWidth="2" opacity="0.5" />
      ))}
      {/* rug */}
      <ellipse cx="450" cy="500" rx="260" ry="34" fill={painted ? '#2b2b30' : '#5f5a50'} opacity={painted ? 0.8 : 0.5} />

      {/* window */}
      <g opacity={painted ? 1 : 0.75}>
        <rect x="70" y="120" width="210" height="180" rx="10" fill={painted ? '#dff3ff' : '#aeb6b0'} />
        <rect x="70" y="120" width="210" height="180" rx="10" fill="none" stroke={painted ? '#fff' : '#7d766b'} strokeWidth="8" />
        <line x1="175" y1="120" x2="175" y2="300" stroke={painted ? '#fff' : '#7d766b'} strokeWidth="6" />
        <line x1="70" y1="210" x2="280" y2="210" stroke={painted ? '#fff' : '#7d766b'} strokeWidth="6" />
        {/* curtains */}
        <rect x="52" y="104" width="40" height="220" rx="8" fill={painted ? '#ff5c4d' : '#8f887c'} />
        <rect x="258" y="104" width="40" height="220" rx="8" fill={painted ? '#ff5c4d' : '#8f887c'} />
      </g>

      {/* sofa */}
      <g>
        <rect x="250" y="330" width="400" height="90" rx="26" fill={painted ? '#f4f1ea' : '#8d8577'} />
        <rect x="250" y="300" width="400" height="48" rx="24" fill={painted ? '#e8e2d2' : '#7d766b'} />
        {/* cushions */}
        <rect x="290" y="336" width="90" height="52" rx="18" fill={painted ? '#ffb454' : '#6f685c'} />
        <rect x="400" y="336" width="90" height="52" rx="18" fill={painted ? '#57c8f2' : '#6f685c'} />
        <rect x="510" y="336" width="90" height="52" rx="18" fill={painted ? '#ffb454' : '#6f685c'} />
        {/* legs */}
        <rect x="280" y="420" width="12" height="18" rx="3" fill="#3a3228" />
        <rect x="608" y="420" width="12" height="18" rx="3" fill="#3a3228" />
      </g>

      {/* side table + lamp */}
      <g>
        <rect x="700" y="380" width="90" height="12" rx="6" fill={painted ? '#8a5a2b' : '#6f685c'} />
        <rect x="738" y="392" width="14" height="46" rx="4" fill={painted ? '#5a3a1e' : '#5f5a50'} />
        <rect x="712" y="356" width="66" height="16" rx="8" fill={painted ? '#ffb454' : '#8d8577'} />
        <rect x="742" y="330" width="6" height="28" rx="3" fill="#3a3228" />
        <path d="M726 330 a16 16 0 0 1 32 0 z" fill={painted ? '#fff3c4' : '#c9bfa8'} />
      </g>

      {/* plant */}
      <g>
        <rect x="96" y="438" width="46" height="34" rx="8" fill={painted ? '#b0602f' : '#7d766b'} />
        <path d="M119 440 c-8 -40 6 -64 -2 -84 c20 6 28 30 22 52 c18 -8 34 -26 40 -46 c8 20 2 40 -10 52 c14 10 20 24 18 38 z" fill={painted ? '#1f5c45' : '#6f685c'} />
      </g>

      {/* wall art color splash (after only) */}
      {painted && (
        <g>
          <circle cx="170" cy="70" r="34" fill="#ff5c4d" opacity="0.9" />
          <circle cx="230" cy="52" r="18" fill="#ffb454" opacity="0.85" />
          <circle cx="120" cy="48" r="14" fill="#57c8f2" opacity="0.8" />
        </g>
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  The interactive comparison slider                                  */
/* ------------------------------------------------------------------ */
export default function RoomTransform() {
  const [progress, setProgress] = useState(50)
  const reduced = useReducedMotion()
  const shade = useActiveShade()
  const containerRef = useRef(null)
  const dragX = useMotionValue(0)

  // Mouse parallax for the room layers
  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })
  const py = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 })

  const updateFromClientX = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const p = ((clientX - rect.left) / rect.width) * 100
    setProgress(Math.min(97, Math.max(3, p)))
  }

  const onPointerMove = (e) => {
    if (e.buttons !== 1) return
    updateFromClientX(e.clientX)
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      px.set((e.clientX - rect.left) / rect.width - 0.5)
      py.set((e.clientY - rect.top) / rect.height - 0.5)
    }
  }

  return (
    <section className="relative py-28 sm:py-36" aria-labelledby="transform-title">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Room Transformation"
          title="See the difference"
          description="Drag the handle to compare a tired room with the same space transformed in BIG PAINTS color."
        />

        <div
          ref={containerRef}
          className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] select-none"
          style={{ aspectRatio: '16 / 9', maxHeight: '72vh' }}
          onPointerMove={onPointerMove}
          onPointerLeave={() => { px.set(0); py.set(0) }}
          role="slider"
          aria-label="Room transformation comparison"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setProgress((p) => Math.max(3, p - 4))
            if (e.key === 'ArrowRight') setProgress((p) => Math.min(97, p + 4))
          }}
        >
          {/* BEFORE (left) */}
          <div className="absolute inset-0">
            <motion.div style={{ x: reduced ? 0 : px, y: reduced ? 0 : py }} className="h-full w-full scale-110">
              <RoomScene mode="before" />
            </motion.div>
          </div>

          {/* AFTER (right, clipped) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${progress}%)` }}
          >
            <motion.div style={{ x: reduced ? 0 : px, y: reduced ? 0 : py }} className="h-full w-full scale-110">
              <RoomScene mode="after" wallColor={shade} />
            </motion.div>
          </div>

          {/* labels */}
          <span className="absolute left-5 top-5 rounded-full bg-black/45 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/90 backdrop-blur-md">
            Before
          </span>
          <span className="absolute right-5 top-5 rounded-full bg-black/45 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/90 backdrop-blur-md">
            After
          </span>

          {/* divider + handle */}
          <div className="absolute inset-y-0" style={{ left: `${progress}%` }}>
            <div className="absolute inset-y-0 -ml-px w-0.5 bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
            <div
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize touch-none"
              style={{ left: 0 }}
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); updateFromClientX(e.clientX) }}
              onPointerMove={(e) => { if (e.buttons === 1) updateFromClientX(e.clientX) }}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-coral-500 to-ember-500 text-ink-950 shadow-[0_10px_40px_-8px_rgba(255,92,77,0.8)]">
                <MoveHorizontal className="h-6 w-6" aria-hidden />
              </span>
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full bg-coral-400/50"
                animate={{ scale: [1, 1.5] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* progress readout */}
          <div className="absolute bottom-5 right-5 rounded-full bg-black/45 px-4 py-1.5 font-display text-xs font-semibold tabular-nums text-white/90 backdrop-blur-md">
            {Math.round(progress)}% painted
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-cream-400">
          Subtle parallax moves the room as you drag — just like stepping inside it.
        </p>
      </div>
    </section>
  )
}
