<div align="center">

# Aradhya Shinde — Systems & Machine Learning Researcher

**A high-performance, interactive 3D personal portfolio & systems research showcase.**

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Portfolio-crimson?style=for-the-badge)](https://aradhyags7.github.io/Portfolio/)
[![Vite](https://img.shields.io/badge/Vite-7.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-19.1+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

</div>

---

## 🌌 Overview

This repository hosts the source code for **Aradhya Shinde**'s personal portfolio. Built with **React 19, TypeScript, Three.js, GSAP, and Framer Motion**, it delivers an interactive 3D web experience with procedural Web Audio sound synthesis, bespoke project canvas motifs, a live GitHub activity heatmap, and a 3D robot companion.

### Key Highlights
- 🤖 **Interactive 3D Companion**: Three.js procedural robot with real-time emotion engine (`idle`, `happy`, `wow`, `dizzy`, `sleep`), elastic squash-and-stretch physics, pointer tracking, and sleep particles.
- 🔊 **Zero-Dependency Procedural Audio Engine**: Real-time sound synthesis powered by the Web Audio API (`AudioContext`, `OscillatorNode`, noise buffers) with zero external audio asset overhead.
- ⚡ **Interactive Project Motifs**: Bespoke interactive canvas simulations for each featured project (e.g. radar probe scan, continuous orbital mechanics, swipe decks, cryptographic AES vault).
- ⌨️ **Command Palette (`Ctrl + K`)**: Quick keyboard navigation, section jumping, theme controls, sound toggles, and bot actions (`flip`, `party`).
- 📊 **Live GitHub Activity Heatmap**: Fetches contributions in real-time from GitHub API with hover tooltips and offline fallback data.
- 📜 **Smooth Kinetic Scrolling & GSAP Timelines**: Lenis smooth scroll paired with GSAP ScrollTrigger card-stack depth transitions.

---

## 🚀 Featured Projects

| # | System | Stack | Focus / Performance Highlights |
|---|---|---|---|
| **01** | [**AdaptiveVec**](https://github.com/aradhyags7/AdaptiveVec) | C++17, AVX2 SIMD, Python | Vector retrieval proximity graph • `< 0.42 ms` latency • `98.7%` Recall@10 • `3.4x` SIMD acceleration |
| **02** | [**AdaMem-FDE**](https://github.com/aradhyags7/AdaMem-FDE) | PyTorch 2.2+, Continual Learning | Continual neural memory • `15/15` tests passing • `89.2%` retention • Feature Distribution Estimation |
| **03** | [**Aegis**](https://github.com/aradhyags7/Aegis) | TypeScript, Faster-Whisper, Ollama | Local-first AI desktop assistant • `100%` offline & private • `< 350 ms` STT latency • Zero cloud telemetry |
| **04** | [**TwoOfUs**](https://github.com/aradhyags7/TwoOfUs) | Flutter, FastAPI, PostgreSQL | E2EE private couple space • Curve25519 ECDH • XSalsa20-Poly1305 • `35/35` tests passing |
| **05** | [**Smriti (स्मृति)**](https://github.com/aradhyags7/Smriti) | Flutter, FastAPI, PostgreSQL | Cognitive care platform for dementia & MCI • `87` backend & `323` Flutter tests • Offline-first |

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 19, TypeScript, Vite
- **3D & Canvas**: Three.js, `@react-three/fiber`, `@react-three/drei`, Canvas 2D render loops
- **Animation & Physics**: GSAP 3 (ScrollTrigger & Observer), Framer Motion, Lenis smooth scroll
- **Audio**: Web Audio API (Synthesized procedural sound effects)
- **State Management**: Zustand
- **Typography**: `JetBrains Mono Variable` & `Bricolage Grotesque Variable`

---

## 🏃 Getting Started Locally

### Prerequisites
- Node.js (v18.0 or later)
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/aradhyags7/Portfolio.git

# Navigate to project directory
cd Portfolio

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build

```bash
# Compile TypeScript and bundle assets
npm run build

# Preview production build locally
npm run preview
```

---

## 📬 Contact & Connect

- **Email**: [aradhyashinde2330@gmail.com](mailto:aradhyashinde2330@gmail.com)
- **GitHub**: [@aradhyags7](https://github.com/aradhyags7)
- **LinkedIn**: [Aradhya Shinde](https://www.linkedin.com/in/aradhya-shinde-5797b8304)
