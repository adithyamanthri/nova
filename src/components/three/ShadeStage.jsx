import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { store, hexToRgb } from '../../lib/engine/store'
import { liquidVert, liquidFrag } from '../../lib/engine/shaders'

/* One big flowing liquid plane behind the Shade Lab. The color smoothly
   follows hoverShade (then activeShade), flow speeds up with scroll
   velocity, and the cursor produces soft ripples via the shader. */
export default function ShadeStage({ quality }) {
  const meshRef = useRef()
  const targetA = useMemo(() => new THREE.Color(), [])
  const targetB = useMemo(() => new THREE.Color(), [])
  const targetC = useMemo(() => new THREE.Color(), [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFlow: { value: 0.35 },
      uQuality: { value: quality >= 2 ? 1 : 0.6 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColorA: { value: new THREE.Color('#ff6b5e') },
      uColorB: { value: new THREE.Color('#8a2b24') },
      uColorC: { value: new THREE.Color('#ffd9c9') },
      uOpacity: { value: 0 },
    }),
    [quality]
  )

  const SCALE = 0.01

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t

    // pin the plane to the shade section's world position
    if (meshRef.current) meshRef.current.position.y = -(store.stages.shades ?? 0) * SCALE

    // shade follows hover first, then the active selection
    const hex = store.hoverShade || store.activeShade
    const [r, g, b] = hexToRgb(hex)
    targetA.setRGB(r / 255, g / 255, b / 255)
    targetB.setRGB(r / 600, g / 600, b / 600)
    targetC.setRGB(1 - (1 - r / 255) * 0.65, 1 - (1 - g / 255) * 0.65, 1 - (1 - b / 255) * 0.65)
    uniforms.uColorA.value.lerp(targetA, 0.05)
    uniforms.uColorB.value.lerp(targetB, 0.05)
    uniforms.uColorC.value.lerp(targetC, 0.05)

    // scroll velocity drives flow: paint accelerates when scrolling fast
    uniforms.uFlow.value = lerpUniform(uniforms.uFlow.value, 0.35 + Math.abs(store.velocityNorm) * 1.4, 0.05)
    uniforms.uFlow.value = Math.min(1.6, uniforms.uFlow.value)

    // lerped cursor position for soft ripples (no jitter)
    uniforms.uMouse.value.x += ((store.mouse.sx + 0.5) - uniforms.uMouse.value.x) * 0.06
    uniforms.uMouse.value.y += ((store.mouse.sy + 0.5) - uniforms.uMouse.value.y) * 0.06

    // fade in/out based on how close the camera is to this stage
    const stageY = store.stages.shades ?? 0
    const camY = state.camera.position.y
    const dist = Math.abs(camY + stageY * 0.01)
    const targetOpacity = THREE.MathUtils.smoothstep(dist, 4.5, 2.2)
    uniforms.uOpacity.value += (targetOpacity - uniforms.uOpacity.value) * 0.05
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} renderOrder={-1}>
      <planeGeometry args={[70, 50, 1, 1]} />
      <shaderMaterial vertexShader={liquidVert} fragmentShader={liquidFrag} uniforms={uniforms} transparent depthWrite={false} />
    </mesh>
  )
}

const lerpUniform = (a, b, t) => a + (b - a) * t
