import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei'
import { useMousePosition, usePrefersReducedMotion } from '../../lib/hooks'

const PALETTE = [
  new THREE.Color('#ff5c4d'),
  new THREE.Color('#ffb454'),
  new THREE.Color('#57c8f2'),
  new THREE.Color('#9d8cf6'),
  new THREE.Color('#faf8f4'),
]

/* Soft liquid blobs */
function Blob({ position, color, scale = 1, distort = 0.45, speed = 1.6, floatIntensity = 1 }) {
  return (
    <Float speed={speed} rotationIntensity={0.6} floatIntensity={floatIntensity} floatingRange={[-0.6, 0.6]}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={speed * 0.6}
          roughness={0.15}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  )
}

/* Glossy floating spheres */
function GlossySphere({ position, color, scale = 0.5 }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} floatingRange={[-0.8, 0.8]}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial color={color} roughness={0.08} metalness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
    </Float>
  )
}

/* Paint droplets — small falling spheres that slowly orbit */
function Droplets({ count = 18 }) {
  const positions = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * 7
      arr.push({
        pos: new THREE.Vector3(Math.cos(angle) * radius, -2 + Math.random() * 8, Math.sin(angle) * radius - 2),
        speed: 0.2 + Math.random() * 0.6,
        scale: 0.04 + Math.random() * 0.1,
        color: PALETTE[i % PALETTE.length],
      })
    }
    return arr
  }, [count])
  const group = useRef()
  useFrame((_, delta) => {
    if (group.current) {
      group.current.children.forEach((child, i) => {
        child.position.y -= positions[i].speed * delta
        if (child.position.y < -2.4) child.position.y = 4.5
      })
    }
  })
  return (
    <group ref={group}>
      {positions.map((d, i) => (
        <mesh key={i} position={d.pos} scale={d.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshPhysicalMaterial color={d.color} roughness={0.1} metalness={0.1} clearcoat={1} />
        </mesh>
      ))}
    </group>
  )
}

/* Scene root — subtle mouse parallax on the whole environment */
function SceneContent({ reduced }) {
  const group = useRef()
  const mouse = useMousePosition()
  useFrame((state, delta) => {
    if (reduced || !group.current) return
    const targetX = mouse.current.x * 0.25
    const targetY = mouse.current.y * 0.18
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.04)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, 0.04)
    // subtle camera drift
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.current.x * 0.4, 0.03)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0.2 + mouse.current.y * 0.25, 0.03)
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={group}>
      {/* volumetric-style light beams */}
      <mesh position={[0, 0, -6]} rotation={[0.2, 0, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshBasicMaterial color="#ff7a6b" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <Blob position={[-4.2, 1.6, -2.5]} color="#ff5c4d" scale={1.5} distort={0.5} />
      <Blob position={[4.4, -1.4, -3]} color="#57c8f2" scale={1.2} distort={0.42} speed={1.2} />
      <Blob position={[2.8, 2.4, -4.5]} color="#ffb454" scale={1.1} distort={0.55} speed={1.1} floatIntensity={1.4} />
      <Blob position={[-3, -2.2, -4]} color="#9d8cf6" scale={0.9} distort={0.5} speed={1.4} />

      <GlossySphere position={[-5.5, 0.6, -1.5]} color="#faf8f4" scale={0.42} />
      <GlossySphere position={[5.8, 1.8, -2]} color="#ffb454" scale={0.5} />
      <GlossySphere position={[-2.2, 3, -3.2]} color="#ff5c4d" scale={0.3} />
      <GlossySphere position={[1.6, -2.6, -2.2]} color="#57c8f2" scale={0.34} />
      <GlossySphere position={[6.2, -0.6, -4]} color="#f58fb4" scale={0.6} />

      <Droplets count={reduced ? 8 : 18} />

      <Sparkles count={reduced ? 40 : 120} scale={[12, 7, 6]} size={2.2} speed={0.35} opacity={0.55} color="#fff3e0" />
      <Sparkles count={reduced ? 20 : 60} scale={[9, 5, 4]} size={5} speed={0.2} opacity={0.35} color="#ffb454" />
    </group>
  )
}

export default function HeroCanvas({ reduced }) {
  const prefersReduced = usePrefersReducedMotion()
  const quality = reduced || prefersReduced ? 0.8 : 1.6
  return (
    <Canvas
      dpr={[1, quality]}
      camera={{ position: [0, 0.2, 9], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <fog attach="fog" args={['#0a0a0c', 9, 16]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} color="#fff2e0" />
      <pointLight position={[-6, 2, 3]} intensity={30} color="#ff5c4d" />
      <pointLight position={[6, -2, 2]} intensity={26} color="#57c8f2" />
      <pointLight position={[0, 4, -3]} intensity={20} color="#ffb454" />
      <SceneContent reduced={reduced || prefersReduced} />
    </Canvas>
  )
}
