import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from '../../lib/gsap'
import { sfx } from '../../audio/synth'
import { scrollState } from '../../lib/scrollState'
import { useApp } from '../../store'
import type { SectionId } from '../../content/resume'
import { createFace, makeGlowTexture, makeZTexture, type FaceMood } from './face'

type Anchor = { fx: number; fy: number; s: number }

/**
 * Where the bot parks per section, as fractions of the half-viewport
 * (screen x = 0.5 + fx/2, screen y = 0.5 - fy/2).
 * Each spot is measured against the real layout so he never sits on the copy.
 */

/** two-column layouts (>980px): tuck him into the gutters the grid leaves behind */
const ANCHORS: Record<SectionId, Anchor> = {
  hero: { fx: 0.58, fy: 0.06, s: 0.85 },
  // the corridor between .about-copy (ends 0.45) and .about-side (starts 0.62)
  about: { fx: 0.07, fy: -0.72, s: 0.42 },
  work: { fx: 0.7, fy: -0.64, s: 0.4 },
  // the experience rows run full width, so park him low-right under the last card
  experience: { fx: 0.78, fy: -0.7, s: 0.38 },
  proof: { fx: 0.7, fy: 0.5, s: 0.42 },
  journey: { fx: 0.58, fy: -0.62, s: 0.4 },
  contact: { fx: 0.74, fy: -0.62, s: 0.5 },
}

/** single-column layouts (760–980px): copy is full-bleed, so hug the corners */
const MEDIUM_ANCHORS: Record<SectionId, Anchor> = {
  hero: { fx: 0.55, fy: 0.5, s: 0.5 },
  about: { fx: 0.72, fy: -0.72, s: 0.34 },
  work: { fx: 0.72, fy: -0.72, s: 0.32 },
  experience: { fx: 0.72, fy: -0.72, s: 0.32 },
  proof: { fx: 0.72, fy: -0.72, s: 0.34 },
  journey: { fx: 0.72, fy: -0.72, s: 0.34 },
  contact: { fx: 0.6, fy: -0.66, s: 0.42 },
}

/** phones (≤760px): small and corner-docked, never over the text */
const COMPACT_ANCHORS: Record<SectionId, Anchor> = {
  hero: { fx: 0.44, fy: 0.52, s: 0.5 },
  about: { fx: 0.66, fy: -0.68, s: 0.36 },
  work: { fx: 0.66, fy: -0.68, s: 0.32 },
  experience: { fx: 0.66, fy: -0.68, s: 0.32 },
  proof: { fx: 0.66, fy: -0.68, s: 0.36 },
  journey: { fx: 0.66, fy: -0.68, s: 0.36 },
  contact: { fx: 0.5, fy: 0.5, s: 0.46 },
}

/** picked by CSS pixel width so the bot follows the same breakpoints as the layout */
function anchorsFor(cssWidth: number): Record<SectionId, Anchor> {
  if (cssWidth <= 760) return COMPACT_ANCHORS
  if (cssWidth <= 980) return MEDIUM_ANCHORS
  return ANCHORS
}

const SLEEP_AFTER_MS = 30_000
const BURST_COUNT = 16

export default function Mascot() {
  const root = useRef<THREE.Group>(null!)
  const squash = useRef<THREE.Group>(null!)
  const facePlane = useRef<THREE.Mesh>(null!)
  const antennaTip = useRef<THREE.Mesh>(null!)
  const ring = useRef<THREE.Mesh>(null!)
  const thruster = useRef<THREE.Sprite>(null!)
  const handL = useRef<THREE.Mesh>(null!)
  const handR = useRef<THREE.Mesh>(null!)
  const zzz = useRef<THREE.Group>(null!)
  const burst = useRef<THREE.Points>(null!)

  const entered = useApp((s) => s.entered)
  const viewport = useThree((s) => s.viewport)
  const cssWidth = useThree((s) => s.size.width)

  const face = useMemo(() => createFace(), [])
  const glowTex = useMemo(() => makeGlowTexture('#00e5ff'), [])
  const zTex = useMemo(() => makeZTexture(), [])

  const burstGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(BURST_COUNT * 3), 3))
    return g
  }, [])

  // ---- mutable animation state (no re-renders) ----
  const st = useRef({
    mood: 'idle' as FaceMood,
    sleeping: false,
    dizzyUntil: 0,
    happyUntil: 0,
    nextBlink: 2.5,
    blinking: false,
    clicks: [] as number[],
    rotX: 0,
    rotY: 0,
    burstT: 1e9,
    burstVel: Array.from({ length: BURST_COUNT }, () => new THREE.Vector3()),
    appeared: false,
    flipping: false,
  })

  const setFace = (m: FaceMood) => {
    if (st.current.mood !== m) {
      st.current.mood = m
      face.draw(m)
    }
  }

  const popBurst = (origin: THREE.Vector3) => {
    const s = st.current
    const pos = burstGeo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < BURST_COUNT; i++) {
      pos.setXYZ(i, origin.x, origin.y, origin.z)
      s.burstVel[i]
        .set(Math.random() - 0.5, Math.random() - 0.2, Math.random() - 0.5)
        .normalize()
        .multiplyScalar(2.2 + Math.random() * 2)
    }
    pos.needsUpdate = true
    s.burstT = 0
  }

  const squashPop = (strength = 1) => {
    gsap
      .timeline()
      .to(squash.current.scale, {
        x: 1 + 0.28 * strength,
        y: 1 - 0.32 * strength,
        z: 1 + 0.28 * strength,
        duration: 0.09,
        ease: 'power2.out',
      })
      .to(squash.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.7,
        ease: 'elastic.out(1.1, 0.32)',
      })
  }

  const doFlip = () => {
    const s = st.current
    if (s.flipping) return
    s.flipping = true
    sfx.whoosh()
    setFace('wow')
    gsap.to(root.current.rotation, {
      x: root.current.rotation.x - Math.PI * 2,
      duration: 0.85,
      ease: 'power2.inOut',
      onComplete: () => {
        root.current.rotation.x = 0
        s.flipping = false
        setFace('happy')
        s.happyUntil = performance.now() + 900
      },
    })
  }

  // external commands (palette / konami)
  useEffect(
    () =>
      useApp.subscribe((state, prev) => {
        if (state.botMood === prev.botMood) return
        if (state.botMood === 'flip') {
          doFlip()
          window.setTimeout(() => useApp.getState().setBotMood('idle'), 950)
        } else if (state.botMood === 'party') {
          setFace('happy')
          window.setTimeout(() => {
            useApp.getState().setBotMood('idle')
            setFace('idle')
          }, 4000)
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // entrance pop once the user clicks Enter
  useEffect(() => {
    if (!entered || st.current.appeared) return
    st.current.appeared = true
    root.current.scale.setScalar(0)
    gsap.to(root.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.9,
      delay: 0.35,
      ease: 'elastic.out(1, 0.45)',
      onStart: () => {
        sfx.pop()
        popBurst(root.current.position.clone())
      },
    })
  }, [entered])

  const onBotDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const s = st.current
    const now = performance.now()

    if (s.sleeping) {
      s.sleeping = false
      setFace('happy')
      s.happyUntil = now + 1200
      sfx.boing()
      squashPop(1.2)
      return
    }

    s.clicks = s.clicks.filter((t) => now - t < 1600)
    s.clicks.push(now)

    if (s.clicks.length >= 4 && now > s.dizzyUntil) {
      s.dizzyUntil = now + 2300
      s.clicks = []
      setFace('dizzy')
      sfx.dizzy()
      squashPop(1.3)
      return
    }

    if (now > s.dizzyUntil) {
      setFace('happy')
      s.happyUntil = now + 900
      sfx.chirp()
      squashPop(1)
      popBurst(root.current.position.clone().add(new THREE.Vector3(0, 0.4, 0.4)))
    }
  }

  useFrame((state, dt) => {
    const s = st.current
    const t = state.clock.elapsedTime
    const now = performance.now()
    const lerp = (a: number, b: number, k: number) => a + (b - a) * (1 - Math.exp(-k * dt))

    // ---- section anchor travel ----
    const section = useApp.getState().section
    const a = anchorsFor(cssWidth)[section]
    // proportional sizing: full size on wide desktops, shrink on smaller laptops
    const sizeMul = THREE.MathUtils.clamp(viewport.width / 7.3, 0.85, 1.05)
    const halfW = viewport.width / 2
    const halfH = viewport.height / 2
    // keep him fully on screen — margin tracks his actual size, so a small bot
    // can tuck right into a corner instead of being held back by a fixed inset
    const margin = Math.max(0.5, 1.25 * a.s * sizeMul)
    const tx = THREE.MathUtils.clamp(a.fx * halfW, -halfW + margin, halfW - margin)
    const ty = THREE.MathUtils.clamp(a.fy * halfH, -halfH + margin, halfH - margin)
    root.current.position.x = lerp(root.current.position.x, tx, 2.6)
    root.current.position.y = lerp(root.current.position.y, ty + Math.sin(t * (s.sleeping ? 0.9 : 1.6)) * 0.07, 2.6)

    if (s.appeared && !s.flipping) {
      // duck out of the way when an interactive 3D panel owns the screen —
      // otherwise he covers it and his raycast steals the pointer
      const targetS = useApp.getState().botSuppressed ? 0.0001 : a.s * sizeMul
      root.current.scale.x = lerp(root.current.scale.x, targetS, 3.4)
      root.current.scale.y = lerp(root.current.scale.y, targetS, 3.4)
      root.current.scale.z = lerp(root.current.scale.z, targetS, 3.4)
      root.current.visible = root.current.scale.x > 0.02
    }

    // ---- moods ----
    if (!s.sleeping && now - scrollState.lastActivity > SLEEP_AFTER_MS) {
      s.sleeping = true
      setFace('sleep')
      sfx.sleepy()
    } else if (s.sleeping && now - scrollState.lastActivity < 400) {
      s.sleeping = false
      setFace('happy')
      s.happyUntil = now + 1000
      sfx.boing()
      squashPop(0.8)
    }

    if (!s.sleeping && now > s.dizzyUntil && now > s.happyUntil && s.mood !== 'idle' && !s.flipping) {
      setFace('idle')
    }

    // ---- pointer tracking (head) ----
    const targetRotY = s.sleeping ? 0 : state.pointer.x * 0.55
    const targetRotX = s.sleeping ? 0.12 : -state.pointer.y * 0.3
    s.rotY = lerp(s.rotY, targetRotY, 5)
    s.rotX = lerp(s.rotX, targetRotX, 5)
    squash.current.rotation.y = s.rotY
    squash.current.rotation.x = s.rotX

    // dizzy wobble / scroll lean
    const vel = THREE.MathUtils.clamp(scrollState.velocity * 0.010, -0.5, 0.5)
    const dizzyWobble = now < s.dizzyUntil ? Math.sin(t * 15) * 0.14 : 0
    root.current.rotation.z = lerp(root.current.rotation.z, dizzyWobble + vel * -0.35, 4)

    // ---- blink (scaleY the face plane) ----
    if (!s.sleeping && s.mood === 'idle') {
      if (!s.blinking && t > s.nextBlink) {
        s.blinking = true
        gsap
          .timeline({ onComplete: () => (s.blinking = false) })
          .to(facePlane.current.scale, { y: 0.08, duration: 0.06, ease: 'power2.in' })
          .to(facePlane.current.scale, { y: 1, duration: 0.09, ease: 'power2.out' })
        s.nextBlink = t + 2.2 + Math.random() * 3
      }
    }

    // ---- antenna pulse + party colors ----
    const tipMat = antennaTip.current.material as THREE.MeshStandardMaterial
    const party = useApp.getState().botMood === 'party'
    if (party) {
      tipMat.emissive.setHSL((t * 0.7) % 1, 1, 0.55)
      tipMat.emissiveIntensity = 2.6
      root.current.rotation.y = Math.sin(t * 6) * 0.25
    } else {
      tipMat.emissiveIntensity = 1.6 + Math.sin(t * 3.2) * 0.6
      root.current.rotation.y = lerp(root.current.rotation.y, 0, 3)
    }

    // ---- ring + thruster ----
    ring.current.scale.setScalar(1 + Math.sin(t * 2.1) * 0.05)
    const rm = ring.current.material as THREE.MeshBasicMaterial
    rm.opacity = 0.32 + Math.sin(t * 2.1) * 0.1
    const speed = Math.min(1, Math.abs(scrollState.velocity) * 0.02)
    const tm = thruster.current.material as THREE.SpriteMaterial
    tm.opacity = lerp(tm.opacity, 0.25 + speed * 0.75, 6)
    thruster.current.scale.setScalar(0.7 + speed * 0.9 + Math.sin(t * 9) * 0.04)

    // ---- hands ----
    const wave = section === 'contact' && !s.sleeping
    handL.current.position.y = -0.08 + Math.sin(t * 1.7 + 1.2) * 0.09
    if (wave) {
      handR.current.position.y = 0.55 + Math.sin(t * 8) * 0.18
      handR.current.position.x = 0.98
    } else {
      handR.current.position.y = lerp(handR.current.position.y, -0.08 + Math.sin(t * 1.7) * 0.09, 4)
      handR.current.position.x = lerp(handR.current.position.x, 0.92, 4)
    }

    // ---- zzz bubbles ----
    zzz.current.visible = s.sleeping
    if (s.sleeping) {
      zzz.current.children.forEach((child, i) => {
        const m = child as THREE.Sprite
        const phase = (t * 0.5 + i * 0.33) % 1
        m.position.set(0.65 + phase * 0.35 + i * 0.08, 0.7 + phase * 0.85, 0.2)
        m.scale.setScalar(0.12 + phase * 0.16)
        ;(m.material as THREE.SpriteMaterial).opacity = (1 - phase) * 0.85
      })
    }

    // ---- click burst particles ----
    if (s.burstT < 0.7) {
      s.burstT += dt
      const pos = burstGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < BURST_COUNT; i++) {
        pos.setXYZ(
          i,
          pos.getX(i) + s.burstVel[i].x * dt,
          pos.getY(i) + s.burstVel[i].y * dt - 1.4 * dt * s.burstT,
          pos.getZ(i) + s.burstVel[i].z * dt,
        )
      }
      pos.needsUpdate = true
      const bm = burst.current.material as THREE.PointsMaterial
      bm.opacity = Math.max(0, 1 - s.burstT / 0.65)
      burst.current.visible = true
    } else {
      burst.current.visible = false
    }
  })

  return (
    <group>
      <group ref={root} position={[3, 0, 0]}>
        <group ref={squash} onPointerDown={onBotDown}>
          {/* body */}
          <RoundedBox args={[1.15, 1.28, 0.95]} radius={0.3} smoothness={5} castShadow>
            <meshStandardMaterial color="#ff8a1f" metalness={0.3} roughness={0.38} />
          </RoundedBox>
          {/* belly light */}
          <mesh position={[0, -0.32, 0.468]}>
            <circleGeometry args={[0.08, 24]} />
            <meshBasicMaterial color="#00e5ff" toneMapped={false} transparent opacity={0.9} />
          </mesh>
          {/* visor */}
          <RoundedBox args={[0.84, 0.5, 0.12]} radius={0.13} smoothness={4} position={[0, 0.16, 0.45]}>
            <meshStandardMaterial color="#07070d" metalness={0.4} roughness={0.18} />
          </RoundedBox>
          {/* face */}
          <mesh ref={facePlane} position={[0, 0.16, 0.52]}>
            <planeGeometry args={[0.68, 0.34]} />
            <meshBasicMaterial map={face.texture} transparent toneMapped={false} />
          </mesh>
          {/* antenna */}
          <mesh position={[0, 0.78, 0]}>
            <cylinderGeometry args={[0.022, 0.03, 0.28, 10]} />
            <meshStandardMaterial color="#c2590e" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh ref={antennaTip} position={[0, 0.95, 0]}>
            <sphereGeometry args={[0.075, 20, 20]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.8} roughness={0.3} />
          </mesh>
          {/* ear pods */}
          <mesh position={[-0.62, 0.16, 0]}>
            <sphereGeometry args={[0.11, 18, 18]} />
            <meshStandardMaterial color="#c2590e" metalness={0.4} roughness={0.38} />
          </mesh>
          <mesh position={[0.62, 0.16, 0]}>
            <sphereGeometry args={[0.11, 18, 18]} />
            <meshStandardMaterial color="#c2590e" metalness={0.4} roughness={0.38} />
          </mesh>
        </group>

        {/* floating hands */}
        <mesh ref={handL} position={[-0.92, -0.08, 0.12]}>
          <sphereGeometry args={[0.15, 20, 20]} />
          <meshStandardMaterial color="#e8720f" metalness={0.35} roughness={0.4} />
        </mesh>
        <mesh ref={handR} position={[0.92, -0.08, 0.12]}>
          <sphereGeometry args={[0.15, 20, 20]} />
          <meshStandardMaterial color="#e8720f" metalness={0.35} roughness={0.4} />
        </mesh>

        {/* hover ring + thruster glow */}
        <mesh ref={ring} position={[0, -0.95, 0]} rotation-x={-Math.PI / 2}>
          <torusGeometry args={[0.42, 0.014, 8, 48]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.35} toneMapped={false} />
        </mesh>
        <sprite ref={thruster} position={[0, -0.78, 0]} scale={0.8}>
          <spriteMaterial map={glowTex} color="#00e5ff" transparent opacity={0.3} depthWrite={false} />
        </sprite>

        {/* zzz */}
        <group ref={zzz} visible={false}>
          {[0, 1, 2].map((i) => (
            <sprite key={i} scale={0.15}>
              <spriteMaterial map={zTex} transparent depthWrite={false} />
            </sprite>
          ))}
        </group>
      </group>

      {/* click burst */}
      <points ref={burst} geometry={burstGeo} visible={false}>
        <pointsMaterial size={0.07} color="#ffb114" transparent opacity={0} depthWrite={false} toneMapped={false} />
      </points>
    </group>
  )
}
