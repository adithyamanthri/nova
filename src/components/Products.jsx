import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Layers } from 'lucide-react'
import { PRODUCTS } from '../data/content'
import { SectionHeading, Reveal } from './ui/Reveal'
import MagneticButton from './ui/MagneticButton'
import { scrollToId } from '../lib/hooks'

/* Stylized paint-can illustration — easy to swap for a real photo later */
function CanArt({ gradient, colors }) {
  const [c1, c2] = gradient
  return (
    <svg viewBox="0 0 120 140" className="h-32 w-28 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" aria-hidden>
      <defs>
        <linearGradient id="can-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <linearGradient id="can-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8e8ec" />
          <stop offset="45%" stopColor="#9fa1a6" />
          <stop offset="100%" stopColor="#d8d9dc" />
        </linearGradient>
      </defs>
      {/* body */}
      <path d="M30 34 h60 v86 a6 6 0 0 1 -6 6 h-48 a6 6 0 0 1 -6 -6 z" fill="url(#can-body)" />
      {/* highlight */}
      <rect x="36" y="40" width="8" height="74" rx="4" fill="white" opacity="0.18" />
      {/* label */}
      <rect x="38" y="58" width="44" height="30" rx="4" fill="#0a0a0c" opacity="0.85" />
      <circle cx="60" cy="73" r="7" fill={colors[0] ?? '#ff5c4d'} />
      {/* lid */}
      <rect x="26" y="26" width="68" height="10" rx="5" fill="url(#can-metal)" />
      <rect x="32" y="20" width="56" height="8" rx="4" fill="url(#can-metal)" />
      {/* handle */}
      <path d="M46 20 h28" stroke="url(#can-metal)" strokeWidth="4" strokeLinecap="round" />
      {/* droplets */}
      <circle cx="88" cy="50" r="4" fill={colors[1] ?? '#ffb454'} />
      <circle cx="26" cy="84" r="3" fill={colors[2] ?? '#57c8f2'} />
    </svg>
  )
}

function ProductCard({ product, index }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 18 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 18 })

  const onMove = (e) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      whileHover={reduced ? undefined : { y: -10 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl glass transition-shadow duration-500 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
    >
      {/* image area */}
      <div
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
        style={{ background: `radial-gradient(120% 100% at 50% 0%, ${product.gradient[0]}55, transparent 70%), linear-gradient(180deg, #17171c, #101014)` }}
      >
        <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(60% 60% at 50% 110%, ${product.gradient[0]}66, transparent 70%)` }} />
        <CanArt gradient={product.gradient} colors={product.colors} />
        <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream-100 backdrop-blur-sm">
          {product.category}
        </span>
        <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream-100 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-6" style={{ transform: 'translateZ(30px)' }}>
        <h3 className="font-display text-xl font-bold text-cream-50">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-cream-400">{product.description}</p>

        <div className="mt-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-cream-300">
          <Layers className="h-3.5 w-3.5 text-coral-400" aria-hidden />
          {product.finish}
        </div>

        {/* available colors */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.15em] text-cream-400">Colors</span>
          <div className="flex -space-x-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c}
                className="h-5 w-5 rounded-full border-2 border-ink-800 transition-transform hover:scale-125"
                style={{ backgroundColor: c }}
                aria-hidden
              />
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-5">
          <span className="font-display text-lg font-bold text-cream-50">
            {product.price === 'Contact for Price' ? (
              <span className="text-sm font-semibold text-ember-400">Contact for Price</span>
            ) : (
              product.price
            )}
          </span>
          <MagneticButton
            variant="ghost"
            className="!px-4 !py-2 !text-[11px]"
            onClick={() => scrollToId('#contact')}
          >
            View Product
          </MagneticButton>
        </div>
      </div>
    </motion.article>
  )
}

export default function Products() {
  return (
    <section className="relative py-28 sm:py-36" aria-labelledby="products-title">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Product Showcase"
          title="Engineered for perfect walls"
          description="From interior emulsions to weatherproof exteriors — a complete range, formulated for flawless results."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <Reveal delay={0.15} className="mt-16 text-center">
          <MagneticButton size="lg" onClick={() => scrollToId('#contact')}>
            Request Full Price List
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  )
}
