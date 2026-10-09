/**
 * Single source of truth for everything written on the site.
 * Edit here → whole site updates.
 */

export const person = {
  name: 'Aradhya Shinde',
  firstName: 'Aradhya',
  lastName: 'Shinde',
  role: 'Systems & Machine Learning Researcher',
  tagline: 'Architecting hardware-accelerated SIMD vector retrieval, continual neural memory, and sovereign edge AI.',
  heroSub:
    '< 0.42ms ANN search via AVX2 SIMD • Continual learning neural memory • Sovereign edge AI architectures. Pune, India.',
  location: 'Pune, India',
  timezone: 'Asia/Kolkata',
  email: 'aradhyashinde2330@gmail.com',
  github: { label: 'GitHub', handle: 'aradhyags7', url: 'https://github.com/aradhyags7' },
  linkedin: {
    label: 'LinkedIn',
    handle: 'aradhya-shinde-5797b8304',
    url: 'https://www.linkedin.com/in/aradhya-shinde-5797b8304',
  },
  resumePdf: '',
  about: [
    'I engineer software at the confluence of mathematical theory and silicon efficiency. Rather than treating machine learning as high-level black-box abstractions, I design systems from first principles — optimizing CPU cache hierarchies, vectorizing computational kernels directly onto AVX2 SIMD registers, and architecting models that learn continuously without catastrophic forgetting.',
    'My research spans density-aware vector graph indexing in AdaptiveVec (delivering sub-millisecond p99 search latency on million-scale embeddings via C++17 and AVX2 intrinsics) to dynamic memory consolidation in AdaMem-FDE (mitigating feature drift in non-stationary streaming distributions).',
    'Concurrently, I design sovereign, local-first intelligence platforms like Aegis and TwoOfUs, employing zero-knowledge cryptography and quantized on-device LLMs to guarantee zero cloud telemetry — building software that is uncompromisingly fast, provably robust, and deeply private.',
  ],
} as const

export type ProjectMotif = 'radar' | 'arcade' | 'orbit' | 'deck' | 'vault'

export interface Project {
  id: string
  index: string
  name: string
  /** compact label for tight spots like the tech matrix columns */
  short: string
  kind: string
  year: string
  accent: string
  motif: ProjectMotif
  kicker: string
  bullets: string[]
  impact: string
  tech: string[]
  links: { repo: string; live: string }
}

export const projects: Project[] = [
  {
    id: 'adaptivevec',
    index: '01',
    name: 'AdaptiveVec',
    short: 'AdaptiveVec',
    kind: 'Vector Retrieval Proximity Graph',
    year: '2026',
    accent: '#ff4655',
    motif: 'radar',
    kicker: '< 0.42ms ANN vector search with AVX2 SIMD acceleration.',
    bullets: [
      'Density- and dimension-aware proximity graph index engineered for resource-constrained vector retrieval.',
      'Hand-vectorized C++17 SIMD kernel utilizing Intel AVX2 256-bit registers with 3.4x throughput acceleration over baseline scalar implementations.',
      'Greedy beam-search graph traversal achieving 98.7% Recall@10 on million-scale high-dimensional embedding benchmarks.',
    ],
    impact: '< 0.42ms p99 latency · 98.7% Recall@10 · 3.4x SIMD acceleration',
    tech: ['C++17', 'AVX2 SIMD', 'Python', 'CMake', 'Vector Embeddings', 'HPC'],
    links: { repo: 'https://github.com/aradhyags7/AdaptiveVec', live: '' },
  },
  {
    id: 'adamem-fde',
    index: '02',
    name: 'AdaMem-FDE',
    short: 'AdaMem',
    kind: 'Adaptive Neural Memory Framework',
    year: '2026',
    accent: '#8b5cf6',
    motif: 'orbit',
    kicker: 'Continual learning deep neural memory without catastrophic forgetting.',
    bullets: [
      'Dynamic feature distribution estimation (FDE) framework tracking latent representation drift in non-stationary streaming data.',
      'Selective episodic memory replay buffer prioritizing high-entropy boundary samples while maintaining tight computational bounds.',
      'Zero-forgetting regularization penalty ensuring stable gradient updates across sequential task distributions.',
    ],
    impact: '89.2% retention across streaming tasks · 15/15 unit & integration tests passing',
    tech: ['PyTorch 2.2+', 'Python', 'Continual Learning', 'CUDA', 'NumPy'],
    links: { repo: 'https://github.com/aradhyags7/AdaMem-FDE', live: '' },
  },
  {
    id: 'aegis',
    index: '03',
    name: 'Aegis',
    short: 'Aegis',
    kind: 'Privacy-First AI Desktop Assistant',
    year: '2026',
    accent: '#00e5ff',
    motif: 'arcade',
    kicker: 'J.A.R.V.I.S.-style sovereign voice intelligence — 100% offline.',
    bullets: [
      'Privacy-first local AI desktop assistant running voice recognition and LLM inference entirely on localhost.',
      'Sub-350ms speech-to-text pipeline using quantized INT8 Faster-Whisper coupled with local streaming Ollama (Llama 3).',
      'Zero external cloud telemetry, zero API key dependencies, and complete hardware sovereignty.',
    ],
    impact: '< 350ms STT latency · 100% local & offline · Zero cloud telemetry',
    tech: ['TypeScript', 'Faster-Whisper', 'Ollama', 'Llama 3', 'Node.js', 'Audio Streaming'],
    links: { repo: 'https://github.com/aradhyags7/Aegis', live: '' },
  },
  {
    id: 'twoofus',
    index: '04',
    name: 'TwoOfUs',
    short: 'TwoOfUs',
    kind: 'Zero-Knowledge E2EE Private Space',
    year: '2026',
    accent: '#ff4d9d',
    motif: 'vault',
    kicker: 'End-to-end encrypted private sanctuary with Curve25519 & XSalsa20.',
    bullets: [
      'Intimate private sanctuary for couples with zero-knowledge client-side encryption — servers store only encrypted blobs.',
      'Asymmetric Curve25519 ECDH key agreement with XSalsa20-Poly1305 symmetric ciphers and out-of-band safety verification numbers.',
      'Real-time encrypted WebSocket synchronization with multi-method 2FA and biometric device locks.',
    ],
    impact: '35/35 cryptographic & socket tests passing · Provable zero plaintext leakage',
    tech: ['Flutter', 'FastAPI', 'Curve25519', 'XSalsa20-Poly1305', 'PostgreSQL', 'WebSockets'],
    links: { repo: 'https://github.com/aradhyags7/TwoOfUs', live: '' },
  },
  {
    id: 'mentora',
    index: '05',
    name: 'Mentora',
    short: 'Mentora',
    kind: 'Adaptive Multimodal AI Classroom',
    year: '2026',
    accent: '#10b981',
    motif: 'deck',
    kicker: 'The AI teacher that doesn\'t just answer — it teaches in real-time.',
    bullets: [
      'Autonomous multimodal AI virtual classroom orchestrating live teaching sessions with sub-500ms LiveKit WebRTC streaming voice and natural barge-in.',
      'Interactive infinite whiteboard featuring digital handwriting stroke capture, mathematical OCR, and symbolic SymPy step-by-step verification.',
      'Real-time 3D physics & molecular simulations (Three.js/R3F) and isolated Monaco code execution sandboxes with AST visualization.',
    ],
    impact: 'Sub-500ms voice pipeline · Dynamic pedagogical state machine · Multimodal 3D simulation',
    tech: ['Next.js 15', 'TypeScript', 'FastAPI', 'Three.js', 'LiveKit WebRTC', 'SymPy', 'Python 3.12', 'PostgreSQL'],
    links: { repo: 'https://github.com/aradhyags7/Mentora', live: '' },
  },
]

export interface Role {
  id: string
  company: string
  /** shown next to the company when there is a public site worth naming */
  site?: string
  title: string
  period: string
  location: string
  current?: boolean
  bullets: string[]
  tech: string[]
}

export const experience: Role[] = [
  {
    id: 'research',
    company: 'Independent Research',
    title: 'Systems & Machine Learning Researcher',
    period: '2026 — Present',
    location: 'Pune, India',
    current: true,
    bullets: [
      'Engineered AdaptiveVec, a high-performance vector retrieval proximity graph in C++17 with AVX2 SIMD acceleration achieving < 0.42ms search latency.',
      'Developed AdaMem-FDE, a continual learning neural memory framework in PyTorch mitigating catastrophic forgetting with 89.2% retention across streaming tasks.',
      'Architected local-first edge AI systems (Aegis, TwoOfUs) guaranteeing zero cloud telemetry via on-device LLMs and Curve25519 cryptography.',
    ],
    tech: ['C++17', 'AVX2 SIMD', 'PyTorch', 'Vector Search', 'Zero-Knowledge Crypto', 'FastAPI'],
  },
  {
    id: 'opensource',
    company: 'Open-Source Ecosystem',
    title: 'Core Systems Architect & Contributor',
    period: '2025 — Present',
    location: 'Remote',
    bullets: [
      'Architected Mentora, an adaptive multimodal AI teaching platform with LiveKit WebRTC low-latency streaming and symbolic SymPy equation verification.',
      'Built astronomical ephemeris and satellite tracking engine (CosmoLens) with real-time SGP4 orbital propagation.',
      'Maintained 100% test coverage benchmarks across core algorithmic and cryptographic modules.',
    ],
    tech: ['Next.js 15', 'TypeScript', 'FastAPI', 'LiveKit', 'Python', 'Three.js', 'PostgreSQL', 'Docker'],
  },
]

export interface Milestone {
  year: string
  title: string
  detail: string
  highlight?: boolean
}

export const timeline: Milestone[] = [
  {
    year: '2026',
    title: 'Mentora Multimodal AI Classroom',
    detail: 'Architected real-time AI teaching platform with sub-500ms WebRTC voice, interactive whiteboard, and symbolic math engine.',
    highlight: true,
  },
  {
    year: '2026',
    title: 'AdaMem-FDE Neural Memory Framework',
    detail: 'Engineered continual learning framework with 89.2% memory retention and zero catastrophic forgetting.',
    highlight: true,
  },
  {
    year: '2026',
    title: 'AdaptiveVec SIMD Benchmark',
    detail: 'Achieved < 0.42ms p99 latency with 3.4x AVX2 speedup on million-scale vector retrieval graph index.',
    highlight: true,
  },
  {
    year: '2026',
    title: 'Aegis Sovereign AI Assistant',
    detail: 'Deployed offline voice intelligence with sub-350ms Whisper STT and zero cloud telemetry.',
    highlight: true,
  },
  {
    year: '2026',
    title: 'TwoOfUs E2EE Private Space',
    detail: 'Shipped zero-knowledge private space with Curve25519 & XSalsa20 ciphers (35/35 tests passing).',
  },
  {
    year: '2026',
    title: 'CosmoLens Orbital Visualization',
    detail: 'Implemented real-time SGP4 orbital propagation for 10,000+ satellites and celestial body ephemeris.',
  },
  {
    year: '2025',
    title: 'Resource Shelf Open-Source Hub',
    detail: 'Architected cross-platform academic resource and collaborative learning platform.',
  },
]

export const interests = [
  'High-performance computing (SIMD & Cache)',
  'Vector retrieval & HNSW',
  'Continual learning & Neural memory',
  'Zero-knowledge cryptography',
  'Local-first & Sovereign edge AI',
  'Low-latency C++ systems',
  'Multimodal AI & Interactive Pedagogical Systems',
]

export const sections = [
  { id: 'hero', label: 'Start' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'proof', label: 'Proof' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof sections)[number]['id']
