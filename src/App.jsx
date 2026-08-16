import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSmoothScroll, useIsMobile, usePrefersReducedMotion } from './lib/hooks'
import { GlowCursor, PaintTrail, ScrollProgress } from './components/ui/Effects'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PaintExperience from './components/PaintExperience'
import Colors from './components/Colors'
import Products from './components/Products'
import RoomTransform from './components/RoomTransform'
import Stats from './components/Stats'
import Services from './components/Services'
import Visualizer from './components/Visualizer'
import Testimonials from './components/Testimonials'
import Location from './components/Location'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { LiquidTransition } from './components/ui/PaintSplash'

// Heavy 3D backgrounds are lazy-loaded and only render after first paint.
const HeroCanvas = lazy(() => import('./components/three/HeroCanvas'))
const PaintCanScene = lazy(() => import('./components/three/PaintCanScene'))
const AmbientBackground = lazy(() => import('./components/three/Background'))

function CanvasFallback() {
  return <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,rgba(255,92,77,0.08),transparent_70%)]" />
}

export default function App() {
  useSmoothScroll(true)
  const isMobile = useIsMobile()
  const reducedMotion = usePrefersReducedMotion()
  const [loaded, setLoaded] = useState(false)

  // Keep 3D off until the loader finishes so first paint is instant.
  // (setLoaded also flips from the Loader's onComplete callback.)

  const canScrollRef = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('paint-can-section')
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = window.innerHeight + el.offsetHeight
      canScrollRef.current = Math.min(1, Math.max(0, -rect.top / total))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="grain relative min-h-screen bg-ink-900 text-cream-50 antialiased">
      <ScrollProgress />
      {!reducedMotion && !isMobile && <GlowCursor />}
      {!reducedMotion && <PaintTrail />}

      <AnimatePresence mode="wait">
        {!loaded && <Loader key="loader" onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      <Navbar started={loaded} />

      <main id="main">
        {/* ---------------- HERO ---------------- */}
        <section id="home" className="relative min-h-screen overflow-hidden">
          <Suspense fallback={<CanvasFallback />}>
            {loaded && <HeroCanvas reduced={isMobile} />}
          </Suspense>
          <Hero started={loaded} />
        </section>

        {/* ---------------- 3D PAINT EXPERIENCE ---------------- */}
        <PaintExperience scrollRef={canScrollRef} />

        {/* ---------------- COLORS ---------------- */}
        <div id="colors" className="relative">
          <Suspense fallback={null}>
            {loaded && <AmbientBackground reduced={isMobile} particles={isMobile ? 40 : 80} />}
          </Suspense>
          <Colors />
        </div>

        {/* ---------------- PRODUCTS ---------------- */}
        <div id="products" className="relative">
          <LiquidTransition />
          <Products />
        </div>

        {/* ---------------- ROOM TRANSFORMATION ---------------- */}
        <RoomTransform />

        {/* ---------------- WHY BIG PAINTS ---------------- */}
        <div id="about" className="relative overflow-hidden">
          <Suspense fallback={null}>
            {loaded && <AmbientBackground reduced={isMobile} particles={isMobile ? 30 : 70} />}
          </Suspense>
          <Stats />
        </div>

        {/* ---------------- SERVICES ---------------- */}
        <div id="services" className="relative">
          <Services />
        </div>

        {/* ---------------- VISUALIZER ---------------- */}
        <div id="visualizer" className="relative">
          <LiquidTransition />
          <Visualizer />
        </div>

        {/* ---------------- TESTIMONIALS ---------------- */}
        <Testimonials />

        {/* ---------------- STORE / LOCATION ---------------- */}
        <Location />

        {/* ---------------- CONTACT ---------------- */}
        <div id="contact" className="relative">
          <Contact />
        </div>
      </main>

      <Footer />

      {/* soft bottom ambient light */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-40 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(255,92,77,0.07),transparent)]"
      />
    </div>
  )
}
