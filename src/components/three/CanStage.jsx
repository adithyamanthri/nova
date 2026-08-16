import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { store, clamp, lerp, hexToRgb } from '../../lib/engine/store'
import { pourVert, pourFrag, poolVert, poolFrag } from '../../lib/engine/shaders'
import { PRODUCTS } from '../../data/content'

const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

function PaintCanBody({ openRef, bandMat, innerMat, progressRef }) {
  const group = useRef()
  const lid = useRef()

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const p = progressRef.current

    // slow base rotation that spins up as the can is approached
    g.rotation.y += delta * (0.4 + p * 4.5)

    // tilt when pouring
    const tilt = smooth(0.62, 0.78, p) * -0.52
    g.rotation.z = lerp(g.rotation.z, tilt, 0.06)

    // lid opens
    const open = smooth(0.5, 0.72, p)
    if (lid.current) {
      lid.current.position.y = lerp(lid.current.position.y, 1.18 + open * 1.1, 0.08)
      lid.current.rotation.x = lerp(lid.current.rotation.x, -Math.PI * 0.45 * open, 0.08)
    }
    // paint surface revealed inside (baseOpacity so the group fade composes)
    if (innerMat.current) {
      innerMat.current.opacity = open
      innerMat.current.userData.baseOpacity = open
    }
  })

  const metal = { metalness: 0.92, roughness: 0.22 }

  return (
    <group ref={group}>
      {/* body */}
      <mesh castShadow>
        <cylinderGeometry args={[1, 1, 1.9, 40]} />
        <meshStandardMaterial color="#c8c9cc" {...metal} />
      </mesh>
      {/* color band (label) — lerped to active shade / product color */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.006, 1.006, 0.62, 40]} />
        <meshStandardMaterial ref={bandMat} color="#ff5c4d" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* brand stripe */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[1.004, 1.004, 0.16, 40]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* inner paint surface (revealed when lid opens) */}
      <mesh position={[0, 1.03, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.12, 40]} />
        <meshStandardMaterial ref={innerMat} color="#ff7a6b" roughness={0.05} metalness={0.05} emissive="#ff5c4d" emissiveIntensity={0.6} transparent opacity={0} />
      </mesh>
      {/* lid + rim (group that flies off) */}
      <group ref={lid} position={[0, 1.18, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[1.07, 1.07, 0.2, 40]} />
          <meshStandardMaterial color="#d8d9dc" {...metal} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <torusGeometry args={[1.02, 0.05, 12, 40]} />
          <meshStandardMaterial color="#ececef" {...metal} />
        </mesh>
      </group>
      {/* handle */}
      <mesh castShadow position={[0, 1.68, 0]}>
        <torusGeometry args={[0.34, 0.055, 12, 28]} />
        <meshStandardMaterial color="#9fa1a6" {...metal} />
      </mesh>
    </group>
  )
}

/* Pour stream + spreading pool (screen-locked ground) */
function Pour({ progressRef, color }) {
  const streamMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pourVert,
        fragmentShader: pourFrag,
        uniforms: {
          uTime: { value: 0 },
          uSpeed: { value: 2.2 },
          uColor: { value: new THREE.Color('#ff5c4d') },
        },
        transparent: true,
        depthWrite: false,
      }),
    []
  )
  const poolMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: poolVert,
        fragmentShader: poolFrag,
        uniforms: {
          uTime: { value: 0 },
          uSpread: { value: 0 },
          uColor: { value: new THREE.Color('#ff5c4d') },
        },
        transparent: true,
        depthWrite: false,
      }),
    []
  )
  const target = useMemo(() => new THREE.Color(), [])
  const targetPool = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const p = progressRef.current
    streamMat.uniforms.uTime.value = t
    streamMat.uniforms.uSpeed.value = 2.2 + Math.abs(store.velocityNorm) * 2
    poolMat.uniforms.uTime.value = t
    poolMat.uniforms.uSpread.value = smooth(0.7, 1, p)

    // both follow the shade/product color
    const [r, g, b] = hexToRgb(color.current)
    target.setRGB(r / 255, g / 255, b / 255)
    targetPool.setRGB(r / 420, g / 420, b / 420)
    streamMat.uniforms.uColor.value.lerp(target, 0.05)
    poolMat.uniforms.uColor.value.lerp(target, 0.05)

    // stream fades in as the can tilts (baseOpacity composes with group fade)
    streamMat.userData.baseOpacity = smooth(0.68, 0.8, p)
    poolMat.userData.baseOpacity = smooth(0.7, 0.85, p)
  })

  return (
    <group>
      {/* falling stream — from the tilted lip down to the spreading pool */}
      <mesh position={[-0.42, -1.25, 0]} rotation={[0, 0, 0.55]}>
        <cylinderGeometry args={[0.09, 0.16, 3.9, 10, 1, true]} />
        <primitive object={streamMat} attach="material" />
      </mesh>
      {/* spreading pool on the ground */}
      <mesh position={[0, -3.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.6, 48]} />
        <primitive object={poolMat} attach="material" />
      </mesh>
    </group>
  )
}

/* Orbit droplets around the can */
function OrbitDrops({ count = 10 }) {
  const group = useRef()
  const drops = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      arr.push({
        radius: 1.7 + (i % 3) * 0.5,
        angle: a,
        speed: 0.25 + (i % 4) * 0.07,
        y: -0.7 + (i % 6) * 0.3,
        scale: 0.06 + ((i * 7) % 10) * 0.018,
      })
    }
    return arr
  }, [count])
  useFrame((_, delta) => {
    group.current?.children.forEach((c, i) => {
      const d = drops[i]
      c.position.x = Math.cos(d.angle + delta * d.speed * 5) * d.radius
      c.position.z = Math.sin(d.angle + delta * d.speed * 5) * d.radius
    })
  })
  return (
    <group ref={group}>
      {drops.map((d, i) => (
        <mesh key={i} position={[d.radius, d.y, 0]} scale={d.scale}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.08}
            metalness={0.15}
            clearcoat={1}
            transparent
            opacity={0.85}
            userData={{ baseOpacity: 0.85 }}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function CanStage({ quality }) {
  const group = useRef()
  const bandMat = useRef()
  const innerMat = useRef()
  const progressRef = useRef(0)
  const targetBand = useMemo(() => new THREE.Color(), [])
  const currentColor = useMemo(() => ({ current: '#ff5c4d' }), [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const camY = state.camera.position.y
    const vh = window.innerHeight

    const canTop = store.stages.can ?? store.maxScroll
    const productsTop = store.stages.products ?? store.maxScroll
    const y = store.scrollY

    // progress through the can band (0..1)
    const p = clamp((y - canTop) / (vh * 1.15), 0, 1)
    progressRef.current = p
    store.canProgress = p

    // fade in as we approach, fade out after products
    const enterDist = canTop - vh * 0.9
    const exitDist = productsTop + vh * 3.5
    const alpha = clamp((y - enterDist) / (vh * 0.6), 0, 1) * clamp((exitDist - y) / (vh * 0.9), 0, 1)

    // screen-locked: the can stays centered on screen through its band + products
    g.position.y = camY + 0.1
    g.position.x = lerp(0, -2.5, smooth(0.3, 0.55, p))
    g.position.z = lerp(0, -0.4, p)

    // products phase: recolor to the active product
    const product = PRODUCTS[store.activeProduct] ?? PRODUCTS[0]
    const productHex = product?.colors?.[0] ?? store.activeShade
    const targetHex = p >= 0.85 ? productHex : store.activeShade
    const [r, gg, b] = hexToRgb(targetHex)
    targetBand.setRGB(r / 255, gg / 255, b / 255)
    currentColor.current = targetHex
    if (bandMat.current) bandMat.current.color.lerp(targetBand, 0.05)

    // scale — gentle pulse with scroll velocity
    const pulse = 1 + Math.abs(store.velocityNorm) * 0.05
    g.scale.setScalar(lerp(g.scale.x, (0.95 + p * 0.25) * pulse, 0.05))

    // fade the whole stage with distance (each material keeps its own baseOpacity)
    g.visible = alpha > 0.02
    g.traverse((o) => {
      if (o.isMesh && o.material?.transparent) {
        o.material.opacity = (o.material.userData?.baseOpacity ?? 1) * alpha
      }
    })
  })

  return (
    <group ref={group} visible={false}>
      <PaintCanBody openRef={progressRef} bandMat={bandMat} innerMat={innerMat} progressRef={progressRef} />
      <Pour progressRef={progressRef} color={currentColor} />
      {quality >= 1 && <OrbitDrops count={quality >= 2 ? 10 : 5} />}
      {/* soft fake shadow on the ground */}
      <mesh position={[0, -3.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.1, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} depthWrite={false} userData={{ baseOpacity: 0.35 }} />
      </mesh>
    </group>
  )
}
