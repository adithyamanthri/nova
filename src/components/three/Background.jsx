import { useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { useMousePosition } from '../../lib/hooks'

/* Reusable ambient 3D background — particles + a few soft blobs.
   Mounted behind content sections, lazy-loaded by App. */
function Field({ count = 90, reduced }) {
  const ref = useRef()
  const mouse = useMousePosition()
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.02
    if (!reduced) {
      const tx = mouse.current.x * 0.06
      const ty = mouse.current.y * 0.04
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, ty, 0.03)
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, tx, 0.03)
    }
  })
  return (
    <group ref={ref}>
      <Sparkles count={count} scale={[16, 10, 8]} size={2} speed={0.22} opacity={0.4} color="#fff3e0" />
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.2} floatingRange={[-0.5, 0.5]}>
        <mesh position={[-6, 3, -5]} scale={1.1}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial color="#ff5c4d" roughness={0.25} transparent opacity={0.16} />
        </mesh>
      </Float>
      <Float speed={1} rotationIntensity={0.4} floatIntensity={1.4} floatingRange={[-0.6, 0.6]}>
        <mesh position={[6.5, -2, -6]} scale={1.4}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial color="#57c8f2" roughness={0.25} transparent opacity={0.13} />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.5, 0.5]}>
        <mesh position={[4, 4.5, -7]} scale={0.8}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial color="#ffb454" roughness={0.25} transparent opacity={0.15} />
        </mesh>
      </Float>
    </group>
  )
}

export default function Background({ particles, reduced = false }) {
  return (
    <Canvas
      dpr={[1, reduced ? 0.7 : 1.3]}
      camera={{ position: [0, 0, 8], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[-6, 4, 4]} intensity={24} color="#ff5c4d" />
      <pointLight position={[6, -2, 3]} intensity={20} color="#57c8f2" />
      <Field count={reduced ? 30 : (particles ?? 90)} reduced={reduced} />
    </Canvas>
  )
}
