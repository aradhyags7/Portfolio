import * as THREE from 'three'

export type FaceMood = 'idle' | 'happy' | 'dizzy' | 'sleep' | 'wow'

const EYE = '#25f5ff'

/** The bot's face is a 2D canvas texture — cheap, expressive, easy to tweak. */
export function createFace() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const c = canvas.getContext('2d')!
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace

  const eyes: Array<[number, number]> = [
    [82, 60],
    [174, 60],
  ]

  function draw(mood: FaceMood) {
    c.clearRect(0, 0, 256, 128)
    c.fillStyle = EYE
    c.strokeStyle = EYE
    c.lineCap = 'round'

    for (const [x, y] of eyes) {
      switch (mood) {
        case 'idle': {
          c.beginPath()
          c.roundRect(x - 16, y - 24, 32, 48, 14)
          c.fill()
          break
        }
        case 'happy': {
          c.lineWidth = 11
          c.beginPath()
          c.arc(x, y + 12, 22, Math.PI * 1.15, Math.PI * 1.85)
          c.stroke()
          break
        }
        case 'sleep': {
          c.lineWidth = 9
          c.beginPath()
          c.moveTo(x - 18, y + 4)
          c.lineTo(x + 18, y + 4)
          c.stroke()
          break
        }
        case 'dizzy': {
          c.lineWidth = 7
          c.beginPath()
          for (let a = 0; a < Math.PI * 5; a += 0.12) {
            const r = 3 + a * 4.2
            const px = x + Math.cos(a + x) * r * 0.42
            const py = y + Math.sin(a + x) * r * 0.42
            if (a === 0) c.moveTo(px, py)
            else c.lineTo(px, py)
          }
          c.stroke()
          break
        }
        case 'wow': {
          c.lineWidth = 10
          c.beginPath()
          c.arc(x, y, 19, 0, Math.PI * 2)
          c.stroke()
          break
        }
      }
    }

    // mouth
    if (mood === 'happy') {
      c.lineWidth = 9
      c.beginPath()
      c.arc(128, 92, 14, Math.PI * 0.15, Math.PI * 0.85)
      c.stroke()
    } else if (mood === 'wow' || mood === 'sleep') {
      c.lineWidth = 8
      c.beginPath()
      c.arc(128, 98, mood === 'wow' ? 10 : 6, 0, Math.PI * 2)
      c.stroke()
    }

    texture.needsUpdate = true
  }

  draw('idle')
  return { texture, draw }
}

/** soft radial glow sprite texture */
export function makeGlowTexture(color = '#00e5ff') {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const c = canvas.getContext('2d')!
  const g = c.createRadialGradient(64, 64, 2, 64, 64, 62)
  g.addColorStop(0, color)
  g.addColorStop(0.35, color + 'aa')
  g.addColorStop(1, color + '00')
  c.fillStyle = g
  c.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** "Z" texture for the sleep bubbles */
export function makeZTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const c = canvas.getContext('2d')!
  c.font = '700 44px "JetBrains Mono Variable", monospace'
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.fillStyle = '#9fdcff'
  c.fillText('z', 32, 34)
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
