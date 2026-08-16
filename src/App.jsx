import { lazy, Suspense, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { initScroll } from './lib/engine/scroll'
import { store } from './lib/engine/store'
import { startFpsMonitor, baselineQuality } from './lib/engine/fps'
import { useIsMobile, usePrefersReducedMotion, webglAvailable } from './lib/hooks'
import { ScrollProgress } from './components/ui/Effects'
import Cursor from './components/Cursor'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ShadeLab from './components/ShadeLab'
import Colors from './components/Colors'
import RoomTransform from './components/RoomTransform'
import Products from './components/Products'
import Services from './components/Services'
import Stats from './components/Stats'
import Visualizer from './components/Visualizer'
import Testimonials from './components/Testimonials'
import Location from './components/Location'
import Contact from './components/Contact'
import Footer from './components/Footer'

// The single WebGL canvas — lazy so the first paint stays instant.
const WorldCanvas = lazy(() => import('./components/three/WorldCanvas'))

export default function App() {
  const isMobile = useIsMobile()
  const reducedMotion = usePrefersReducedMotion()
  const [loaded, setLoaded] = useState(false)
  const [canvasOk, setCanvasOk] = useState(false)

  useEffect(() => {
    initScroll()
    setCanvasOk(webglAvailable() && !reducedMotion)
  }, [reducedMotion])

  // adaptive quality: never exceed the device baseline, then let the FPS
  // monitor step down further if the machine struggles.
  useEffect(() => {
    if (!loaded) return
    const baseline = baselineQuality(isMobile, reducedMotion)
    store.quality = baseline
    const stop = startFpsMonitor((tier) => {
      store.quality = Math.min(baseline, tier)
    })
    return stop
  }, [loaded, isMobile, reducedMotion])

  return (
    <MotionConfig reducedMotion="user">
    <div className="grain relative min-h-screen bg-ink-900 text-cream-50 antialiased">
      <ScrollProgress />
      <Cursor />

      <AnimatePresence mode="wait">
        {!loaded && <Loader key="loader" onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      <Navbar started={loaded} />

      {/* ONE WebGL canvas for the entire page journey */}
      {loaded && canvasOk && (
        <Suspense fallback={null}>
          <WorldCanvas />
        </Suspense>
      )}

      <main id="main" className="relative z-10">
        {/* HERO — liquid paint world */}
        <section id="home" className="relative min-h-screen overflow-hidden">
          <Hero started={loaded} />
        </section>

        {/* SHADE LAB — flowing liquid + shade pools (signature) */}
        <ShadeLab />

        {/* COLOR COLLECTION */}
        <div id="colors" className="relative">
          <Colors />
        </div>

        {/* ROOM TRANSFORMATION */}
        <RoomTransform />

        {/* 3D PAINT CAN band — opens & pours into the product section */}
        <section id="can" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
          <div className="pointer-events-none relative z-10 mx-auto max-w-3xl px-6 text-center">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-cream-300">
              The pour
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-cream-50 sm:text-6xl">
              From can <span className="text-gradient-paint">to canvas</span>
            </h2>
            <p className="mt-4 text-sm text-cream-400">
              Keep scrolling — watch the can open and pour the next chapter.
            </p>
          </div>
        </section>

        {/* PRODUCTS — pinned horizontal storytelling */}
        <Products />

        {/* SERVICES */}
        <div id="services" className="relative">
          <Services />
        </div>

        {/* WHY BIG PAINTS */}
        <div id="about" className="relative overflow-hidden">
          <Stats />
        </div>

        {/* VISUALIZER */}
        <div id="visualizer" className="relative">
          <Visualizer />
        </div>

        {/* TESTIMONIALS */}
        <Testimonials />

        {/* STORE / LOCATION */}
        <Location />

        {/* CONTACT */}
        <div id="contact" className="relative">
          <Contact />
        </div>
      </main>

      <Footer />

      {/* soft bottom ambient light, tinted by the active shade via CSS var */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[5] h-40"
        style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(var(--shade-r, 255), var(--shade-g, 92), var(--shade-b, 77), 0.10), transparent)' }}
      />
    </div>
    </MotionConfig>
  )
}
