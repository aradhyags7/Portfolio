/**
 * Tiny Web Audio synth — every sound on this site is generated at runtime.
 * Zero audio files, zero licensing, fully tweakable.
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = false
let noiseBuf: AudioBuffer | null = null

const MASTER_LEVEL = 0.5

export function unlockAudio() {
  if (ctx) {
    void ctx.resume()
    return
  }
  if (typeof window === 'undefined' || !('AudioContext' in window)) return
  ctx = new AudioContext()
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -20
  comp.knee.value = 22
  comp.ratio.value = 8
  comp.attack.value = 0.002
  comp.release.value = 0.12
  master = ctx.createGain()
  master.gain.value = muted ? 0 : MASTER_LEVEL
  master.connect(comp)
  comp.connect(ctx.destination)
  void ctx.resume()
}

export function setSfxMuted(v: boolean) {
  muted = v
  if (ctx && master) {
    master.gain.setTargetAtTime(v ? 0 : MASTER_LEVEL, ctx.currentTime, 0.015)
  }
}

export function audioReady() {
  return !!ctx
}

function getNoise(c: AudioContext) {
  if (noiseBuf) return noiseBuf
  const len = Math.floor(c.sampleRate * 0.4)
  noiseBuf = c.createBuffer(1, len, c.sampleRate)
  const data = noiseBuf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return noiseBuf
}

interface ToneOpts {
  type?: OscillatorType
  from: number
  to?: number
  dur: number
  peak?: number
  delay?: number
  linear?: boolean
}

function tone(o: ToneOpts) {
  if (!ctx || !master || muted) return
  const t0 = ctx.currentTime + (o.delay ?? 0)
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = o.type ?? 'sine'
  osc.frequency.setValueAtTime(o.from, t0)
  if (o.to !== undefined && o.to !== o.from) {
    if (o.linear) osc.frequency.linearRampToValueAtTime(o.to, t0 + o.dur)
    else osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.to), t0 + o.dur)
  }
  const peak = o.peak ?? 0.2
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(peak, t0 + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur)
  osc.connect(g)
  g.connect(master)
  osc.start(t0)
  osc.stop(t0 + o.dur + 0.06)
}

interface NoiseOpts {
  filter: number
  sweepTo?: number
  q?: number
  dur: number
  peak?: number
  delay?: number
  type?: BiquadFilterType
}

function noise(o: NoiseOpts) {
  if (!ctx || !master || muted) return
  const t0 = ctx.currentTime + (o.delay ?? 0)
  const src = ctx.createBufferSource()
  src.buffer = getNoise(ctx)
  src.loop = true
  const f = ctx.createBiquadFilter()
  f.type = o.type ?? 'bandpass'
  f.frequency.setValueAtTime(o.filter, t0)
  if (o.sweepTo) f.frequency.exponentialRampToValueAtTime(o.sweepTo, t0 + o.dur)
  f.Q.value = o.q ?? 1
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(o.peak ?? 0.15, t0 + 0.006)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur)
  src.connect(f)
  f.connect(g)
  g.connect(master)
  src.start(t0)
  src.stop(t0 + o.dur + 0.06)
}

export const sfx = {
  /** mechanical keyboard-ish thock */
  click() {
    noise({ filter: 1900, q: 1.4, dur: 0.055, peak: 0.2 })
    tone({ from: 150, to: 92, dur: 0.07, peak: 0.26 })
  },
  /** tiny tick on hover */
  hover() {
    noise({ filter: 3400, q: 2.4, dur: 0.028, peak: 0.045 })
  },
  /** overlay open / section transition */
  whoosh() {
    noise({ filter: 420, sweepTo: 2600, q: 0.9, dur: 0.32, peak: 0.13 })
  },
  /** happy robot */
  chirp() {
    tone({ from: 740, to: 1180, dur: 0.09, peak: 0.15 })
    tone({ from: 990, to: 1560, dur: 0.11, peak: 0.13, delay: 0.09 })
  },
  /** squash / wake-up */
  boing() {
    tone({ type: 'triangle', from: 320, to: 88, dur: 0.28, peak: 0.22 })
  },
  /** particle pop */
  pop() {
    tone({ from: 520, to: 60, dur: 0.09, peak: 0.22 })
    noise({ filter: 2600, q: 1, dur: 0.03, peak: 0.09 })
  },
  /** email copied, actions confirmed */
  success() {
    tone({ from: 523.25, dur: 0.09, peak: 0.15 })
    tone({ from: 659.25, dur: 0.09, peak: 0.15, delay: 0.08 })
    tone({ from: 783.99, dur: 0.18, peak: 0.17, delay: 0.16 })
  },
  /** site boot after Enter */
  powerOn() {
    tone({ from: 180, to: 720, dur: 0.35, peak: 0.15 })
    tone({ from: 880, to: 1760, dur: 0.22, peak: 0.09, delay: 0.3 })
    noise({ filter: 600, sweepTo: 3200, dur: 0.4, peak: 0.05 })
  },
  /** bot dozing off */
  sleepy() {
    tone({ from: 620, to: 310, dur: 0.32, peak: 0.08 })
  },
  /** bot spam-clicked */
  dizzy() {
    tone({ type: 'square', from: 500, to: 240, dur: 0.3, peak: 0.06 })
    tone({ type: 'square', from: 460, to: 210, dur: 0.3, peak: 0.05, delay: 0.12 })
  },
} as const

export type SfxName = keyof typeof sfx
