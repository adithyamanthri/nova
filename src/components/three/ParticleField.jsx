import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { store, hexToRgb } from '../../lib/engine/store'

const SCALE = 0.01
const MAX_PARTICLES = 160

/* One instanced particle field covers the ENTIRE page height, so every
   section gets ambient depth without extra meshes or canvases. */
export default function ParticleField() {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const colorObj = useMemo(() => new THREE.Color(), [])
  const targetColor = useMemo(() => new THREE.Color(), [])

  // base positions (recomputed on resize via store.stages)
  const data = useMemo(() => {
    const positions = []
    const phases = []
    const speeds = []
    const sizes = []
    for (let i = 0; i < MAX_PARTICLES; i++) {
      positions.push(
        (Math.random() - 0.5) * 26,
        0, // y set per frame
        -6 + Math.random() * 8
      )
      phases.push(Math.random() * Math.PI * 2)
      speeds.push(0.15 + Math.random() * 0.5)
      sizes.push(0.02 + Math.random() * 0.06)
    }
    return { positions, phases, speeds, sizes }
  }, [])

  // instance colors, lerped toward the active shade
  const colors = useMemo(() => {
    const arr = new Float32Array(MAX_PARTICLES * 3)
    for (let i = 0; i < MAX_PARTICLES; i++) {
      arr[i * 3] = 1; arr[i * 3 + 1] = 1; arr[i * 3 + 2] = 1
    }
    return arr
  }, [])

  useEffect(() => {
    const m = mesh.current
    if (!m) return
    m.instanceColor = new THREE.InstancedBufferAttribute(colors, 3)
    m.userData.layouted = false
  }, [colors])

  const layout = () => {
    const top = store.stages.home ?? 0
    const bottom = store.stages.contact ?? store.maxScroll
    const span = Math.max(200, bottom - top)
    const count = Math.min(MAX_PARTICLES, store.quality >= 2 ? 150 : store.quality === 1 ? 70 : 30)
    const m = mesh.current
    if (m) m.count = count
    data.positions.forEach((_, i) => {
      const idx = i * 3
      const frac = i / MAX_PARTICLES
      data.positions[idx + 1] = -(top + frac * span) * SCALE
    })
  }

  useFrame((state, delta) => {
    const m = mesh.current
    if (!m) return
    if (!m.userData.layouted || m.userData.version !== store.layoutVersion) {
      layout()
      m.userData.layouted = true
      m.userData.version = store.layoutVersion
    }

    const t = state.clock.elapsedTime
    const vel = store.velocityNorm

    // lerp particle color toward the active shade
    const [tr, tg, tb] = hexToRgb(store.activeShade)
    targetColor.setRGB(tr / 255, tg / 255, tb / 255)
    colorObj.lerp(targetColor, 0.04)
    for (let i = 0; i < m.count; i++) {
      const ci = i * 3
      colors[ci] = colorObj.r; colors[ci + 1] = colorObj.g; colors[ci + 2] = colorObj.b
    }
    m.instanceColor.needsUpdate = true

    // motion: gentle bob + velocity stretch (paint accelerates with fast scroll)
    const stretch = 1 + Math.abs(vel) * 2.2
    for (let i = 0; i < m.count; i++) {
      const idx = i * 3
      dummy.position.set(
        data.positions[idx] + Math.sin(t * data.speeds[i] + data.phases[i]) * 0.35,
        data.positions[idx + 1] + Math.sin(t * data.speeds[i] * 0.7 + data.phases[i]) * 0.5 - vel * 1.6,
        data.positions[idx + 2]
      )
      dummy.scale.setScalar(data.sizes[i] * (1 + Math.abs(vel) * 0.8))
      dummy.rotation.set(t * data.speeds[i] * 0.3, t * data.speeds[i] * 0.2, 0)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, MAX_PARTICLES]} frustumCulled={false}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial roughness={0.2} metalness={0.1} toneMapped={false} />
    </instancedMesh>
  )
}
