import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowUpRight, Layers, ChevronRight } from 'lucide-react'
import { PRODUCTS } from '../data/content'
import { store } from '../lib/engine/store'
import { useIsMobile, usePrefersReducedMotion } from '../lib/hooks'
import { scrollToId } from '../lib/engine/scroll'
import MagneticButton from './ui/MagneticButton'

/* Stylized paint-can illustration (swap for real photography later) */
function CanArt({ gradient, colors }) {
  const [c1, c2] = gradient
  return (
    <svg viewBox="0 0 120 140" className="h-28 w-24 drop-shadow-2xl transition-transform duration-700" aria-hidden>
      <defs>
        <linearGradient id="p-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <linearGradient id="p-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8e8ec" />
          <stop offset="45%" stopColor="#9fa1a6" />
          <stop offset="100%" stopColor="#d8d9dc" />
        </linearGradient>
      </defs>
      <path d="M30 34 h60 v86 a6 6 0 0 1 -6 6 h-48 a6 6 0 0 1 -6 -6 z" fill="url(#p-body)" />
      <rect x="36" y="40" width="8" height="74" rx="4" fill="white" opacity="0.18" />
      <rect x="38" y="58" width="44" height="30" rx="4" fill="#0a0a0c" opacity="0.85" />
      <circle cx="60" cy="73" r="7" fill={colors[0] ?? '#ff5c4d'} />
      <rect x="26" y="26" width="68" height="10" rx="5" fill="url(#p-metal)" />
      <rect x="32" y="20" width="56" height="8" rx="4" fill="url(#p-metal)" />
      <path d="M46 20 h28" stroke="url(#p-metal)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="88" cy="50" r="4" fill={colors[1] ?? '#ffb454'} />
      <circle cx="26" cy="84" r="3" fill={colors[2] ?? '#57c8f2'} />
    </svg>
  )
}

function ProductCard({ product, index }) {
  return (
    <article
      data-index={index}
      data-cursor="view"
      className="product-card group relative mx-3 flex h-full w-[80vw] shrink-0 flex-col justify-between overflow-hidden rounded-3xl glass p-6 transition-all duration-700 sm:w-[440px] sm:p-8"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: `radial-gradient(80% 80% at 50% 100%, ${product.gradient[0]}44, transparent 70%)` }}
      />
      {/* image area */}
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-2xl"
        style={{ background: `radial-gradient(120% 100% at 50% 0%, ${product.gradient[0]}44, transparent 70%), linear-gradient(180deg, #17171c, #101014)` }}
      >
        <div className="aspect-[4/3] w-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <CanArt gradient={product.gradient} colors={product.colors} />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream-100 backdrop-blur-sm">
          {product.category}
        </span>
        <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream-100 opacity-0 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>

      <div className="mt-6">
        <h3 className="font-display text-2xl font-bold text-cream-50">{product.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cream-400">{product.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-cream-300">
            <Layers className="h-3.5 w-3.5 text-coral-400" aria-hidden />
            {product.finish}
          </span>
          <div className="flex -space-x-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <span key={c} className="h-5 w-5 rounded-full border-2 border-ink-800" style={{ backgroundColor: c }} aria-hidden />
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
          <MagneticButton variant="ghost" className="!px-4 !py-2 !text-[11px]" onClick={() => scrollToId('#contact')}>
            View Product
          </MagneticButton>
        </div>
      </div>
    </article>
  )
}

export default function Products() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const dotsRef = useRef(null)
  const counterRef = useRef(null)
  const isMobile = useIsMobile()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (isMobile || reduced) return
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      const amount = () => track.scrollWidth - window.innerWidth

      gsap.to(track, {
        x: () => -amount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + amount(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              PRODUCTS.length - 1,
              Math.max(0, Math.round(self.progress * (PRODUCTS.length - 1)))
            )
            store.activeProduct = idx
            // all emphasis via direct DOM — zero React re-renders while scrolling
            track.querySelectorAll('.product-card').forEach((card, i) => {
              card.classList.toggle('is-active', i === idx)
            })
            dotsRef.current?.querySelectorAll('span').forEach((dot, i) => {
              dot.classList.toggle('w-8', i === idx)
              dot.classList.toggle('bg-coral-400', i === idx)
              dot.classList.toggle('w-3', i !== idx)
              dot.classList.toggle('bg-white/15', i !== idx)
            })
            if (counterRef.current) {
              counterRef.current.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(PRODUCTS.length).padStart(2, '0')}`
            }
          },
        },
      })
    }, section)
    return () => ctx.revert()
  }, [isMobile, reduced])

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden"
      aria-labelledby="products-title"
    >
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden />
              Product Showcase
            </span>
            <h2 id="products-title" className="mt-5 font-display text-4xl font-bold tracking-tight text-cream-50 sm:text-5xl">
              Engineered for <span className="text-gradient-paint">perfect walls</span>
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm text-cream-400 sm:block">
            {isMobile || reduced ? 'A complete range, formulated for flawless results.' : 'Keep scrolling — the range glides by.'}
          </p>
        </div>
      </div>

      <div className={isMobile || reduced ? 'no-scrollbar mt-12 overflow-x-auto' : 'mt-12'}>
      <div ref={trackRef} className="flex w-max items-stretch px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] will-change-transform">
        {PRODUCTS.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
        {/* end card */}
        <div className="mx-3 flex h-full w-[70vw] shrink-0 flex-col items-center justify-center gap-6 rounded-3xl glow-border p-8 text-center sm:w-[380px]">
          <p className="font-display text-2xl font-bold text-cream-50">Can't decide?</p>
          <p className="text-sm text-cream-300">Our color experts will curate a palette for your space — free.</p>
          <MagneticButton onClick={() => scrollToId('#contact')}>
            Book a consultation
            <ChevronRight className="h-4 w-4" aria-hidden />
          </MagneticButton>
        </div>
      </div>
      </div>

      {/* progress dots — updated imperatively, not via React state */}
      <div ref={dotsRef} className="mx-auto mt-10 flex max-w-7xl items-center gap-2 px-6">
        {PRODUCTS.map((p) => (
          <span key={p.id} className="h-1.5 w-3 rounded-full bg-white/15 transition-all duration-500" aria-hidden />
        ))}
        <span ref={counterRef} className="ml-auto font-display text-xs tabular-nums text-cream-400">
          01 / {String(PRODUCTS.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  )
}
