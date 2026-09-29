import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { scrollState } from '../lib/scrollState'

const NODE_COUNT = 92
const LINK_DIST = 1.35

/** Neural-web particle field behind/around the hero type. */
function NeuralField() {
  const group = useRef<THREE.Group>(null!)
  const points = useRef<THREE.Points>(null!)
  const lines = useRef<THREE.LineSegments>(null!)

  const { base, seeds, pointGeo, lineGeo, linkPairs } = useMemo(() => {
    const base = new Float32Array(NODE_COUNT * 3)
    const colors = new Float32Array(NODE_COUNT * 3)
    const seeds = new Float32Array(NODE_COUNT * 3)
    const cWhite = new THREE.Color('#dfe6ff')
    const cCyan = new THREE.Color('#33e9ff')
    const cAmber = new THREE.Color('#ffb114')

    for (let i = 0; i < NODE_COUNT; i++) {
      // loose ellipsoid cloud
      const r = Math.cbrt(Math.random())
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      base[i * 3] = 3.9 * r * Math.sin(phi) * Math.cos(theta)
      base[i * 3 + 1] = 2.1 * r * Math.sin(phi) * Math.sin(theta)
      base[i * 3 + 2] = 1.4 * r * Math.cos(phi)
      seeds[i * 3] = Math.random() * 100
      seeds[i * 3 + 1] = Math.random() * 100
      seeds[i * 3 + 2] = 0.4 + Math.random() * 0.8

      const pick = Math.random()
      const c = pick < 0.72 ? cWhite : pick < 0.94 ? cCyan : cAmber
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    const linkPairs: Array<[number, number]> = []
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = base[i * 3] - base[j * 3]
        const dy = base[i * 3 + 1] - base[j * 3 + 1]
        const dz = base[i * 3 + 2] - base[j * 3 + 2]
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < LINK_DIST) linkPairs.push([i, j])
      }
    }

    const pointGeo = new THREE.BufferGeometry()
    pointGeo.setAttribute('position', new THREE.BufferAttribute(base.slice(), 3))
    pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linkPairs.length * 6), 3))

    return { base, seeds, pointGeo, lineGeo, linkPairs }
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const pos = pointGeo.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array

    for (let i = 0; i < NODE_COUNT; i++) {
      const sp = seeds[i * 3 + 2]
      arr[i * 3] = base[i * 3] + Math.sin(t * sp + seeds[i * 3]) * 0.09
      arr[i * 3 + 1] = base[i * 3 + 1] + Math.cos(t * sp * 0.9 + seeds[i * 3 + 1]) * 0.09
      arr[i * 3 + 2] = base[i * 3 + 2] + Math.sin(t * sp * 0.7 + seeds[i * 3]) * 0.06
    }
    pos.needsUpdate = true

    const lpos = lineGeo.attributes.position as THREE.BufferAttribute
    const larr = lpos.array as Float32Array
    for (let k = 0; k < linkPairs.length; k++) {
      const [i, j] = linkPairs[k]
      larr[k * 6] = arr[i * 3]
      larr[k * 6 + 1] = arr[i * 3 + 1]
      larr[k * 6 + 2] = arr[i * 3 + 2]
      larr[k * 6 + 3] = arr[j * 3]
      larr[k * 6 + 4] = arr[j * 3 + 1]
      larr[k * 6 + 5] = arr[j * 3 + 2]
    }
    lpos.needsUpdate = true

    // pointer parallax + slow drift
    const px = state.pointer.x
    const py = state.pointer.y
    group.current.rotation.y += ((px * 0.22 - group.current.rotation.y) * 0.03 + 0.0004)
    group.current.rotation.x += (-py * 0.14 - group.current.rotation.x) * 0.03

    // fade out as hero scrolls away
    const fade = Math.max(0, 1 - scrollState.heroProgress * 1.35)
    ;(points.current.material as THREE.PointsMaterial).opacity = 0.85 * fade
    ;(lines.current.material as THREE.LineBasicMaterial).opacity = 0.14 * fade
  })

  return (
    <group ref={group} position={[0, 0.2, -1.2]}>
      <points ref={points} geometry={pointGeo}>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={lines} geometry={lineGeo}>
        <lineBasicMaterial
          color="#7fd8ff"
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}

export default function HeroScene() {
  return (
    <>
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />
      <NeuralField />
    </>
  )
}
