import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { store, clamp, lerp, hexToRgb } from '../../lib/engine/store'
import ParticleField from './ParticleField'
import HeroStage from './HeroStage'
import ShadeStage from './ShadeStage'
import CanStage from './CanStage'

const SCALE = 0.01
const WORLD_Y = (px) => -px * SCALE

/* ------------------------------------------------------------------ */
/*  Camera rig — travels through the page in sync with Lenis scroll.   */
/*  Smoothed with lerp; accelerates with scroll velocity for a         */
/*  weighted, cinematic feel. No React state, ever.                    */
/* ------------------------------------------------------------------ */
function CameraRig() {
  useFrame((state) => {
    const cam = state.camera
    const targetY = WORLD_Y(store.scrollY)
    const ease = 0.07 + Math.abs(store.velocityNorm) * 0.05
    cam.position.y = lerp(cam.position.y, targetY, ease)
    // look slightly ahead (down the page) so sections feel three-dimensional
    cam.lookAt(0, cam.position.y - 0.55, -2.5)
  })
  return null
}

/* Position a stage's objects at its DOM section's world Y, fading by distance */
function StageAt({ id, offsetY = 0, fadeNear = 4, fadeFar = 9, children }) {
  const group = useRef()
  useFrame((state) => {
    const g = group.current
    if (!g) return
    const stageY = WORLD_Y(store.stages[id] ?? 0) + offsetY
    g.position.y = stageY
    const dist = Math.abs(state.camera.position.y - stageY)
    const alpha = clamp(1 - (dist - fadeNear) / (fadeFar - fadeNear), 0, 1)
    g.visible = alpha > 0.01
    g.traverse((o) => {
      if (o.isMesh && o.material?.transparent && o.material.userData?.stageBaseOpacity != null) {
        o.material.opacity = o.material.userData.stageBaseOpacity * alpha
      }
    })
  })
  return <group ref={group}>{children}</group>
}

/* Lighting that reacts to the selected shade */
function Lights() {
  const key = useRef()
  const fill = useRef()
  const target = useMemo(() => new THREE.Color(), [])
  const targetKey = useMemo(() => new THREE.Color(), [])

  useFrame(() => {
    const [r, g, b] = hexToRgb(store.activeShade)
    target.setRGB(r / 255, g / 255, b / 255)
    targetKey.setRGB(1 - (1 - r / 255) * 0.4, 1 - (1 - g / 255) * 0.4, 1 - (1 - b / 255) * 0.4)
    fill.current?.color.lerp(target, 0.04)
    key.current?.color.lerp(targetKey, 0.04)
  })
  return (
    <>
      <directionalLight ref={key} position={[5, 6, 4]} intensity={1.25} color="#fff2e0" />
      <pointLight ref={fill} position={[-5, 2, 3]} intensity={34} color="#ff5c4d" />
      <pointLight position={[5, -2, 2]} intensity={26} color="#57c8f2" />
    </>
  )
}

/* Adapts pixel ratio + quality flags as the FPS monitor changes tiers */
function AdaptiveQuality() {
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    const apply = () => {
      const q = store.quality
      const dpr = q >= 2 ? Math.min(2, window.devicePixelRatio || 1) : q === 1 ? 1.4 : 1
      if (gl.getPixelRatio() !== dpr) gl.setPixelRatio(dpr)
    }
    apply()
    const id = setInterval(apply, 700)
    return () => clearInterval(id)
  }, [gl])
  return null
}

/* ------------------------------------------------------------------ */
/*  The single world canvas                                            */
/* ------------------------------------------------------------------ */
export default function WorldCanvas({ quality }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 9], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    >
      <fog attach="fog" args={['#0a0a0c', 12, 26]} />
      <ambientLight intensity={0.5} />
      <Lights />
      <AdaptiveQuality />
      <CameraRig />

      <ParticleField />
      <StageAt id="home" fadeNear={3.5} fadeFar={8.5}>
        <HeroStage quality={quality} />
      </StageAt>
      <ShadeStage quality={quality} />
      <CanStage quality={quality} />
    </Canvas>
  )
}
