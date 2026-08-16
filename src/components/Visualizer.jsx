import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Check, Sofa, BedDouble, CookingPot, Paintbrush } from 'lucide-react'
import { COLOR_COLLECTION, VISUALIZER_ROOMS } from '../data/content'
import { SectionHeading, Reveal } from './ui/Reveal'

const ROOM_ICONS = { living: Sofa, bedroom: BedDouble, kitchen: CookingPot }

/* ------------------------------------------------------------------ */
/*  Stylized room renderer — wall color + furniture per room type      */
/* ------------------------------------------------------------------ */
function RoomView({ room, wallColor }) {
  const accent = wallColor
  const darkAccent = shade(accent, -0.35)

  return (
    <svg viewBox="0 0 900 520" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-label={`${room.name} preview with ${wallColor} walls`}>
      <defs>
        <linearGradient id="vw-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lighten(accent, 0.25)} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <linearGradient id="vw-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a8272" />
          <stop offset="100%" stopColor="#5f594c" />
        </linearGradient>
      </defs>

      {/* back wall */}
      <rect x="0" y="0" width="900" height="380" fill="url(#vw-wall)" />
      {/* side walls */}
      <polygon points="0,0 130,0 130,380 0,380" fill={darkAccent} opacity="0.55" />
      <polygon points="900,0 770,0 770,380 900,380" fill={darkAccent} opacity="0.55" />
      {/* skirting */}
      <rect x="0" y="372" width="900" height="10" fill="#f2ede4" opacity="0.9" />
      {/* floor */}
      <rect x="0" y="382" width="900" height="138" fill="url(#vw-floor)" />
      {/* rug */}
      <ellipse cx="450" cy="480" rx="250" ry="30" fill="#2b2b30" opacity="0.55" />

      {/* window (shared) */}
      <g>
        <rect x="60" y="100" width="190" height="170" rx="8" fill="#e6f4fb" />
        <rect x="60" y="100" width="190" height="170" rx="8" fill="none" stroke="#f5f2ea" strokeWidth="6" />
        <line x1="155" y1="100" x2="155" y2="270" stroke="#f5f2ea" strokeWidth="4" />
        <line x1="60" y1="185" x2="250" y2="185" stroke="#f5f2ea" strokeWidth="4" />
        <rect x="44" y="86" width="34" height="196" rx="6" fill={darkAccent} />
        <rect x="232" y="86" width="34" height="196" rx="6" fill={darkAccent} />
      </g>

      {/* feature art */}
      <circle cx="700" cy="120" r="44" fill="#ffffff" opacity="0.18" />
      <circle cx="700" cy="120" r="30" fill="#ffffff" opacity="0.25" />

      {/* furniture per room */}
      {room.id === 'living' && (
        <g>
          <rect x="300" y="318" width="340" height="80" rx="22" fill="#f4f1ea" />
          <rect x="300" y="292" width="340" height="42" rx="20" fill="#e8e2d2" />
          <rect x="330" y="324" width="80" height="46" rx="16" fill={accent} />
          <rect x="430" y="324" width="80" height="46" rx="16" fill="#57c8f2" />
          <rect x="530" y="324" width="80" height="46" rx="16" fill={accent} />
          <rect x="322" y="398" width="10" height="16" rx="3" fill="#3a3228" />
          <rect x="608" y="398" width="10" height="16" rx="3" fill="#3a3228" />
          <rect x="700" y="360" width="80" height="10" rx="5" fill="#8a5a2b" />
          <rect x="734" y="370" width="12" height="38" rx="4" fill="#5a3a1e" />
          <path d="M726 346 a14 14 0 0 1 28 0 z" fill="#fff3c4" />
          <rect x="760" y="344" width="5" height="24" rx="2.5" fill="#3a3228" />
        </g>
      )}

      {room.id === 'bedroom' && (
        <g>
          <rect x="280" y="300" width="360" height="110" rx="18" fill="#f4f1ea" />
          <rect x="268" y="286" width="384" height="26" rx="13" fill="#e8e2d2" />
          <rect x="300" y="322" width="120" height="60" rx="16" fill={accent} />
          <rect x="500" y="322" width="120" height="60" rx="16" fill={accent} />
          <rect x="452" y="330" width="16" height="60" rx="4" fill="#f4f1ea" />
          <rect x="448" y="410" width="26" height="14" rx="4" fill="#3a3228" />
          <rect x="448" y="390" width="26" height="14" rx="4" fill="#3a3228" />
          <rect x="700" y="350" width="90" height="10" rx="5" fill="#8a5a2b" />
          <rect x="736" y="360" width="12" height="42" rx="4" fill="#5a3a1e" />
          <path d="M740 330 a14 14 0 0 1 28 0 z" fill="#fff3c4" />
        </g>
      )}

      {room.id === 'kitchen' && (
        <g>
          <rect x="290" y="300" width="360" height="110" rx="10" fill="#e8e6e0" />
          <rect x="290" y="300" width="360" height="14" rx="7" fill="#8a8272" />
          <rect x="310" y="330" width="90" height="34" rx="6" fill={darkAccent} />
          <rect x="420" y="330" width="90" height="34" rx="6" fill={darkAccent} />
          <rect x="530" y="330" width="100" height="34" rx="6" fill={darkAccent} />
          <circle cx="500" cy="378" r="22" fill="#f4f1ea" />
          <circle cx="500" cy="378" r="14" fill={accent} />
          <circle cx="385" cy="380" r="18" fill="#f4f1ea" />
          <rect x="390" y="392" width="60" height="6" rx="3" fill="#c9c4ba" />
          <path d="M690 300 l40 40 l-40 40 z" fill="#57c8f2" opacity="0.8" />
          <rect x="672" y="380" width="36" height="34" rx="6" fill="#8a8272" />
        </g>
      )}

      {/* wall color chip */}
      <g>
        <rect x="60" y="430" width="120" height="44" rx="12" fill={accent} />
        <rect x="60" y="430" width="120" height="44" rx="12" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" />
      </g>
    </svg>
  )
}

/* tiny color helpers (hex math) */
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}
function lighten(hex, amt) {
  const [r, g, b] = hexToRgb(hex)
  const l = (c) => Math.round(c + (255 - c) * amt)
  return `rgb(${l(r)}, ${l(g)}, ${l(b)})`
}
function shade(hex, amt) {
  const [r, g, b] = hexToRgb(hex)
  const s = (c) => Math.round(c * (1 + amt))
  return `rgb(${Math.max(0, s(r))}, ${Math.max(0, s(g))}, ${Math.max(0, s(b))})`
}

export default function Visualizer() {
  const [roomId, setRoomId] = useState('living')
  const [colorHex, setColorHex] = useState(COLOR_COLLECTION[1].hex)
  const room = VISUALIZER_ROOMS.find((r) => r.id === roomId)

  const reset = () => {
    setRoomId('living')
    setColorHex(COLOR_COLLECTION[1].hex)
  }

  return (
    <section className="relative py-28 sm:py-36" aria-labelledby="visualizer-title">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Color Visualizer"
          title="Visualize your room"
          description="Pick a room, pick a color, and watch the space transform in real time — before you buy a single can."
        />

        <Reveal delay={0.15} className="mt-14">
          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            {/* controls */}
            <div className="flex flex-col gap-6 rounded-3xl glass p-6 sm:p-7">
              <div>
                <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-cream-300">
                  Choose a room
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {VISUALIZER_ROOMS.map((r) => {
                    const Icon = ROOM_ICONS[r.id]
                    const active = r.id === roomId
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRoomId(r.id)}
                        aria-pressed={active}
                        className={`flex flex-col items-center gap-2 rounded-2xl px-2 py-4 text-[11px] font-semibold transition-all duration-300 ${
                          active
                            ? 'bg-gradient-to-br from-coral-500 to-ember-500 text-ink-950 shadow-[0_8px_30px_-8px_rgba(255,92,77,0.7)]'
                            : 'bg-white/[0.04] text-cream-300 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                        {r.name.split(' ')[0]}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-cream-300">
                  Pick a wall color
                </h3>
                <div className="grid grid-cols-4 gap-2.5">
                  {COLOR_COLLECTION.map((c) => {
                    const active = c.hex === colorHex
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setColorHex(c.hex)}
                        aria-label={`Select ${c.name} (${c.hex})`}
                        aria-pressed={active}
                        title={c.name}
                        className={`relative flex aspect-square items-center justify-center rounded-2xl border-2 transition-all duration-300 hover:scale-110 ${
                          active ? 'border-coral-400 shadow-[0_0_20px_rgba(255,92,77,0.4)] scale-110' : 'border-white/10'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {active && <Check className="h-4 w-4 text-white drop-shadow" aria-hidden />}
                      </button>
                    )
                  })}
                </div>
                <p className="mt-3 text-xs text-cream-400">
                  {COLOR_COLLECTION.find((c) => c.hex === colorHex)?.name} · {colorHex}
                </p>
              </div>

              <button
                type="button"
                onClick={reset}
                className="mt-auto flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-cream-300 transition-colors hover:border-coral-400/50 hover:text-cream-50"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Reset room
              </button>
            </div>

            {/* preview */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.85)]">
              <div className="flex items-center justify-between border-b border-white/5 bg-black/30 px-5 py-3.5 backdrop-blur-sm">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cream-300">
                  <Paintbrush className="h-3.5 w-3.5 text-coral-400" aria-hidden />
                  Live preview · {room.name}
                </p>
                <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink-950" style={{ backgroundColor: colorHex }}>
                  {colorHex}
                </span>
              </div>
              <div className="relative aspect-[16/10] w-full bg-ink-800 sm:aspect-[16/9]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={roomId}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <RoomView room={room} wallColor={colorHex} />
                  </motion.div>
                </AnimatePresence>
                {/* color transition overlay */}
                <AnimatePresence>
                  <motion.div
                    key={colorHex}
                    initial={{ opacity: 0.55 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="pointer-events-none absolute inset-0"
                    style={{ backgroundColor: colorHex }}
                    aria-hidden
                  />
                </AnimatePresence>
              </div>
              <p className="border-t border-white/5 bg-black/30 px-5 py-3 text-xs text-cream-400">
                {room.desc} Colors shown are indicative — visit the store to check physical swatches.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
