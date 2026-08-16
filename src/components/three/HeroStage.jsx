import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { store, hexToRgb, lerp } from '../../lib/engine/store'
import { blobVert, blobFrag } from '../../lib/engine/shaders'

/* Shader-driven radial-gradient sprite for soft volumetric mist */
function makeMistTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,0.55)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  return tex
}

function Mist({ position, scale }) {
  const tex = useMemo(makeMistTexture, [])
  const mat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [tex]
  )
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 0.25) * 0.3
    ref.current.material.opacity = 0.12 + Math.sin(t * 0.4) * 0.05
  })
  return <sprite ref={ref} position={position} scale={scale} material={mat} />
}

/* The large liquid blob — one displaced sphere, fully shader-driven */
function LiquidBlob({ position, scale = 1, intensity = 0.7 }) {
  const mesh = useRef()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouseX: { value: 0 },
      uMouseY: { value: 0 },
      uIntensity: { value: intensity },
      uColor: { value: new THREE.Color('#ff6b5e') },
      uColorDeep: { value: new THREE.Color('#7a2b24') },
    }),
    [intensity]
  )

  const target = useMemo(() => new THREE.Color(), [])
  const targetDeep = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t
    uniforms.uMouseX.value = store.mouse.sx * 0.8
    uniforms.uMouseY.value = store.mouse.sy * 0.8

    // blob color smoothly follows the active shade
    const [r, g, b] = hexToRgb(store.activeShade)
    target.setRGB(r / 255, g / 255, b / 255)
    targetDeep.setRGB(r / 510, g / 510, b / 510)
    uniforms.uColor.value.lerp(target, 0.03)
    uniforms.uColorDeep.value.lerp(targetDeep, 0.03)

    // slow organic drift
    mesh.current.rotation.y = Math.sin(t * 0.1) * 0.35
    mesh.current.position.x = position[0] + Math.sin(t * 0.16) * 0.25
    mesh.current.position.y = position[1] + Math.cos(t * 0.12) * 0.2
  })

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <sphereGeometry args={[1.5, 48, 48]} />
      <shaderMaterial vertexShader={blobVert} fragmentShader={blobFrag} uniforms={uniforms} transparent />
    </mesh>
  )
}

function GlossySphere({ position, scale = 0.45, color }) {
  const mat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color, roughness: 0.08, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.12 }),
    [color]
  )
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.3
    ref.current.rotation.y += 0.004
  })
  return <mesh ref={ref} position={position} scale={scale} material={mat} />
}

function Droplets({ count = 10 }) {
  const group = useRef()
  const drops = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: -3.5 + Math.random() * 7,
        y: 1.5 + Math.random() * 4,
        z: -3 + Math.random() * 3,
        speed: 0.6 + Math.random() * 0.9,
        scale: 0.045 + Math.random() * 0.07,
      })
    }
    return arr
  }, [count])
  useFrame((_, delta) => {
    group.current?.children.forEach((c, i) => {
      c.position.y -= drops[i].speed * delta
      if (c.position.y < -1.6) c.position.y = 5.2
    })
  })
  return (
    <group ref={group}>
      {drops.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]} scale={d.scale}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.2} clearcoat={1} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

export default function HeroStage({ quality }) {
  const blobPos = quality >= 2 ? [2.6, 0.2, -1.2] : [3.8, -0.6, -1.6]
  return (
    <group>
      <LiquidBlob position={blobPos} scale={quality >= 2 ? 1.15 : 0.8} intensity={quality >= 2 ? 0.7 : 0.5} />
      <LiquidBlob position={[-3.4, -0.6, -3]} scale={0.55} intensity={0.9} />
      <GlossySphere position={[-2.2, 1.7, -1.8]} color="#faf8f4" />
      <GlossySphere position={[4.6, 1.4, -2.2]} color="#ffb454" />
      <GlossySphere position={[1.2, 2.6, -3]} color="#57c8f2" scale={0.35} />
      <GlossySphere position={[-4.8, -0.8, -2.4]} color="#9d8cf6" scale={0.5} />
      <Droplets count={quality >= 2 ? 10 : 6} />
      {quality >= 2 && (
        <>
          <Mist position={[-2.5, 0.5, -3.5]} scale={[7, 5, 1]} />
          <Mist position={[3.5, -0.8, -4]} scale={[6, 4.5, 1]} />
        </>
      )}
    </group>
  )
}
