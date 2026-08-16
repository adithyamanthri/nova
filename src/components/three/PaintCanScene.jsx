import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshReflectorMaterial, Sparkles } from '@react-three/drei'
import { useMousePosition, usePrefersReducedMotion } from '../../lib/hooks'

const CAN_COLORS = ['#ff5c4d', '#57c8f2', '#4ecf8e', '#9d8cf6', '#ffb454', '#faf8f4']

/* ------------------------------------------------------------------ */
/*  Procedural paint can: body + lid + handle + color band label       */
/* ------------------------------------------------------------------ */
function PaintCan({ scrollRef, reduced }) {
  const group = useRef()
  const colorIndex = useRef(0)
  const [bandColor, setBandColor] = useState(CAN_COLORS[0])
  const mouse = useMousePosition()

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    // Slow base rotation + scroll-driven spin
    const scroll = scrollRef.current ?? 0
    g.rotation.y += delta * (0.35 + scroll * 2.2)
    // Mouse tilt
    if (!reduced) {
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -mouse.current.y * 0.35, 0.05)
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, mouse.current.x * 0.25, 0.05)
    }
    // Scroll lifts the can and moves it toward the viewer
    const lift = Math.sin(scroll * Math.PI) * 1.1
    g.position.y = THREE.MathUtils.lerp(g.position.y, -0.15 + lift * 0.5, 0.08)
    g.position.z = THREE.MathUtils.lerp(g.position.z, 0 + scroll * 2.2, 0.08)

    // Cycle the label color every few seconds
    colorIndex.current += delta
    if (colorIndex.current > 2.4) {
      colorIndex.current = 0
      setBandColor(CAN_COLORS[Math.floor(Math.random() * CAN_COLORS.length)])
    }
  })

  const metal = { metalness: 0.92, roughness: 0.22 }

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      {/* body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 1.9, 48]} />
        <meshStandardMaterial color="#c8c9cc" {...metal} />
      </mesh>
      {/* color band (label) */}
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.005, 1.005, 0.62, 48]} />
        <meshStandardMaterial color={bandColor} roughness={0.32} metalness={0.35} emissive={bandColor} emissiveIntensity={0.08} />
      </mesh>
      {/* brand stripe */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[1.004, 1.004, 0.16, 48]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* lid */}
      <mesh castShadow position={[0, 1.02, 0]}>
        <cylinderGeometry args={[1.06, 1.06, 0.18, 48]} />
        <meshStandardMaterial color="#d8d9dc" {...metal} />
      </mesh>
      {/* lid rim */}
      <mesh position={[0, 1.14, 0]}>
        <torusGeometry args={[1.02, 0.045, 16, 48]} />
        <meshStandardMaterial color="#ececef" {...metal} />
      </mesh>
      {/* handle */}
      <mesh castShadow position={[0, 1.62, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.34, 0.05, 12, 32]} />
        <meshStandardMaterial color="#9fa1a6" {...metal} />
      </mesh>
      {/* glossy top highlight */}
      <mesh position={[0.28, 1.15, 0.28]}>
        <circleGeometry args={[0.3, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

/* Floating droplets orbiting the can */
function OrbitDrops({ count = 14, reduced }) {
  const drops = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      arr.push({
        radius: 1.8 + (i % 3) * 0.55,
        angle: a,
        speed: 0.25 + (i % 5) * 0.08,
        y: -0.8 + (i % 7) * 0.32,
        scale: 0.06 + ((i * 7) % 10) * 0.02,
        color: CAN_COLORS[i % CAN_COLORS.length],
      })
    }
    return arr
  }, [count])
  const group = useRef()
  useFrame((_, delta) => {
    group.current?.children.forEach((c, i) => {
      c.position.x = Math.cos(drops[i].angle + delta * drops[i].speed * 6) * drops[i].radius
      c.position.z = Math.sin(drops[i].angle + delta * drops[i].speed * 6) * drops[i].radius
    })
  })
  return (
    <group ref={group}>
      {drops.map((d, i) => (
        <mesh key={i} position={[d.radius, d.y, 0]} scale={d.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshPhysicalMaterial color={d.color} roughness={0.08} metalness={0.15} clearcoat={1} clearcoatRoughness={0.1} />
        </mesh>
      ))}
    </group>
  )
}

export default function PaintCanScene({ scrollRef, reduced }) {
  const prefersReduced = usePrefersReducedMotion()
  const quality = reduced || prefersReduced ? 0.7 : 1.5
  return (
    <Canvas
      dpr={[1, quality]}
      camera={{ position: [0, 0.6, 5.6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows
      style={{ position: 'absolute', inset: 0 }}
    >
      <fog attach="fog" args={['#0a0a0c', 7, 13]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.4}
        color="#fff2e0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, 2, 3]} intensity={40} color="#ff5c4d" />
      <pointLight position={[5, -1, 2]} intensity={34} color="#57c8f2" />
      <pointLight position={[0, 4, -2]} intensity={26} color="#ffb454" />

      <PaintCan scrollRef={scrollRef} reduced={reduced || prefersReduced} />
      {!reduced && <OrbitDrops count={prefersReduced ? 6 : 14} />}

      {/* reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
        <circleGeometry args={[9, 64]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={18}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color="#131318"
          metalness={0.6}
        />
      </mesh>

      <Sparkles count={reduced ? 30 : 90} scale={[9, 5, 6]} size={2.4} speed={0.3} opacity={0.5} color="#fff3e0" />
    </Canvas>
  )
}
