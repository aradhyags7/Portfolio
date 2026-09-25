// ==========================================================================
// ARADHYA SHINDE — PORTFOLIO SCRIPT
// Aesthetic Reference: https://benscott.dev/
// Features: Interactive Constellation Canvas, Sticky Nav, Case Study Modals
// ==========================================================================

// -------------------- 1. Project Modal Data --------------------
const projectsData = {
  adaptivevec: {
    title: "AdaptiveVec",
    tagline: "Vector Retrieval Proximity Graph (C++17 / AVX2 SIMD)",
    desc: "AdaptiveVec introduces an adaptive graph pruning and greedy beam-search traversal designed specifically for edge hardware and memory-constrained vector databases. Utilizing hardware SIMD intrinsics (Intel AVX2), it accelerates high-dimensional inner-product and L2 Euclidean distance computations while maintaining tight recall guarantees.",
    metrics: [
      { val: "< 0.42 ms", lbl: "Search Latency" },
      { val: "98.7%", lbl: "Recall@10" },
      { val: "3.4x", lbl: "SIMD Acceleration" }
    ],
    tags: ["C++17", "Intel AVX2 SIMD", "Python C-API", "Proximity Graphs", "ANN Vector Search", "Systems Research"],
    github: "https://github.com/aradhyags7/AdaptiveVec"
  },
  "adamem-fde": {
    title: "AdaMem-FDE",
    tagline: "Adaptive Neural Memory Framework (PyTorch)",
    desc: "AdaMem-FDE tackles catastrophic forgetting in deep neural networks undergoing sequential task streams. By dynamically estimating feature drift across latent representations and allocating selective episodic replay buffers, it preserves critical latent representations without exploding parameter counts.",
    metrics: [
      { val: "15/15", lbl: "Tests Passing" },
      { val: "89.2%", lbl: "Synaptic Retention" },
      { val: "PyTorch 2.2+", lbl: "Core Engine" }
    ],
    tags: ["PyTorch", "Python", "Continual Learning", "Episodic Memory", "Synaptic Regularization", "Deep Learning"],
    github: "https://github.com/aradhyags7/AdaMem-FDE"
  },
  aegis: {
    title: "Aegis",
    tagline: "Privacy-First Local AI Desktop Assistant",
    desc: "Aegis provides seamless desktop assistance without transmitting voice or confidential files to external servers. It orchestrates Faster-Whisper for near-instant speech-to-text, connected directly to Ollama for local LLM inference, with native operating system hooks and audio streaming.",
    metrics: [
      { val: "100%", lbl: "Offline & Private" },
      { val: "< 350 ms", lbl: "Whisper STT" },
      { val: "0 Bytes", lbl: "Cloud Telemetry" }
    ],
    tags: ["TypeScript", "Ollama", "Faster-Whisper", "Local LLMs", "Desktop App", "Audio Streaming"],
    github: "https://github.com/aradhyags7/Aegis"
  },
  twoofus: {
    title: "TwoOfUs",
    tagline: "Private & Secure Couple Space (Flutter / FastAPI / E2EE)",
    desc: "TwoOfUs is an intimate, zero-knowledge end-to-end encrypted (E2EE) private ecosystem designed for two connected partners. Built with Flutter (Android/iOS) and FastAPI (Python 3.11 + Render PostgreSQL), it provides on-device Curve25519 (X25519 ECDH) key agreements, XSalsa20-Poly1305 authenticated ciphers, out-of-band 60-digit safety numbers with QR scanning (Signal standard), multi-method 2FA (TOTP + Email OTP + 8 backup codes), real-time encrypted messaging, ephemeral view-once media, and real-time call signaling.",
    metrics: [
      { val: "Zero-Knowledge", lbl: "Curve25519 E2EE" },
      { val: "35/35", lbl: "Automated Tests (100%)" },
      { val: "Multi-Method", lbl: "TOTP + 2FA System" }
    ],
    tags: ["Flutter", "Dart", "FastAPI", "Python 3.11", "PostgreSQL", "Curve25519", "XSalsa20-Poly1305", "Render Cloud"],
    github: "https://github.com/aradhyags7/TwoOfUs"
  },
  smriti: {
    title: "Smriti (स्मृति / সোঁৱৰণি)",
    tagline: "AI-Powered Cognitive Care Platform for Dementia & MCI",
    desc: "Smriti is an assistive healthcare platform engineered to bridge the critical dementia and Mild Cognitive Impairment (MCI) care gap, with dedicated focus on India's North Eastern Region (NER). Delivering an offline-first, voice-driven, and culturally contextualized ecosystem, it combines Cognitive Stimulation Therapy (CST), reminiscence therapy in regional dialects (Assamese, Bengali, Hindi), caregiver cognitive progression tracking, and village-level ASHA healthcare worker triaging.",
    metrics: [
      { val: "87 | 323", lbl: "Backend & Flutter Tests" },
      { val: "Offline-First", lbl: "Edge AI Architecture" },
      { val: "NER India", lbl: "Culturally Contextual" }
    ],
    tags: ["Flutter 3.19+", "FastAPI", "PostgreSQL 15+", "Python 3.11+", "Cognitive Care", "Dementia Therapy", "Healthcare"],
    github: "https://github.com/aradhyags7/Smriti"
  },
  cosmolens: {
    title: "CosmoLens",
    tagline: "Deep Sky & Real-Time Satellite Visualization",
    desc: "CosmoLens connects astronomy enthusiasts with orbital mechanics calculations. By pulling Two-Line Element (TLE) datasets and utilizing SGP4 orbital propagation, it computes overhead satellite passes, ISS visual visibility windows, and interactive deep-sky star charts.",
    metrics: [
      { val: "Real-Time", lbl: "Orbital Tracking" },
      { val: "SGP4", lbl: "Orbit Propagator" },
      { val: "TLE", lbl: "Ephemeris Engine" }
    ],
    tags: ["Python", "Orbital Mechanics", "Ephemeris Calculation", "SGP4", "Data Visualization", "Astronomy"],
    github: "https://github.com/aradhyags7/CosmoLens"
  },
  resourceshelf: {
    tagline: "Collaborative Academic Note & Doubt Hub (Flutter / Firebase)",
    desc: "Resource Shelf is a cross-platform Flutter application built to centralize academic learning materials and encourage peer-to-peer academic support. It replaces scattered study materials with structured subject-wise channels, interactive PDF/image note viewing and cloud storage, real-time doubt discussion forums, and user study libraries.",
    metrics: [
      { val: "Multi-Platform", lbl: "Android / iOS / Web / PC" },
      { val: "Firebase", lbl: "Firestore & Cloud Storage" },
      { val: "Community", lbl: "Peer Doubt Forum" }
    ],
    tags: ["Flutter", "Dart", "Firebase", "Cloud Firestore", "Cloud Storage", "Cross-Platform", "Education Tech"],
    github: "https://github.com/aradhyags7/resource-shelf"
  }
};


// -------------------- 2. Interactive Constellation Canvas --------------------
// Replicating the exact particle physics & connecting lines from benscott.dev
function initConstellationCanvas() {
  const canvas = document.getElementById("connecting-dots");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  const maxDistance = 125;
  const mouse = { x: null, y: null, maxDistance: 160 };

  function resize() {
    const hero = document.getElementById("hero");
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 12000); // Dynamic density based on screen size
    const particleCount = Math.min(Math.max(count, 45), 95);

    for (let i = 0; i < particleCount; i++) {
      const isAccent = Math.random() > 0.85;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: isAccent ? 2.5 : 1.8,
        color: isAccent ? "rgba(255, 77, 90, 0.8)" : "rgba(81, 162, 233, 0.7)"
      });
    }
  }

  window.addEventListener("resize", resize);

  window.addEventListener("mousemove", (e) => {
    const heroRect = canvas.getBoundingClientRect();
    if (
      e.clientX >= heroRect.left &&
      e.clientX <= heroRect.right &&
      e.clientY >= heroRect.top &&
      e.clientY <= heroRect.bottom
    ) {
      mouse.x = e.clientX - heroRect.left;
      mouse.y = e.clientY - heroRect.top;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off borders
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Draw particle dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect to mouse if nearby
      if (mouse.x !== null && mouse.y !== null) {
        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouse.maxDistance) {
          const alpha = (1 - distMouse / mouse.maxDistance) * 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 77, 90, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Connect particle to neighbors
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(81, 162, 233, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

// -------------------- 3. Sticky Navigation & Active Section Tracking --------------------
function initStickyNavbar() {
  const navbar = document.getElementById("navbar");
  const navItems = document.querySelectorAll(".navigation__item");
  const sections = ["hero", "about", "projects", "contact"].map(id => document.getElementById(id)).filter(Boolean);

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY;

    // Sticky shadow
    if (scrollPos > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active Section Detection
    let currentSection = "hero";
    const offset = window.innerHeight * 0.35;

    sections.forEach(sec => {
      const top = sec.offsetTop - offset;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute("id");
      }
    });

    navItems.forEach(item => {
      if (item.getAttribute("data-target") === currentSection) {
        item.classList.add("navigation__item--active");
      } else {
        item.classList.remove("navigation__item--active");
      }
    });
  });
}

// -------------------- 4. Project Modal Handler --------------------
function initProjectModals() {
  const modal = document.getElementById("project-modal");
  const modalContent = document.getElementById("modal-content");
  const closeBtn = document.getElementById("modal-close-btn");
  const learnBtns = document.querySelectorAll(".project-btn-learn");

  if (!modal || !modalContent) return;

  function openModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    modalContent.innerHTML = `
      <h3 class="modal-title">${data.title}</h3>
      <div class="modal-tagline">${data.tagline}</div>
      <p class="modal-body-text">${data.desc}</p>
      
      <div class="modal-metrics-grid">
        ${data.metrics.map(m => `
          <div>
            <span class="m-val">${m.val}</span>
            <span class="m-lbl">${m.lbl}</span>
          </div>
        `).join("")}
      </div>

      <div class="modal-tags">
        ${data.tags.map(t => `<span class="m-tag">${t}</span>`).join("")}
      </div>

      <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="modal-source-btn">
        <span>VIEW SOURCE ON GITHUB</span>
        <span>→</span>
      </a>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  learnBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      openModal(id);
    });
  });

  closeBtn?.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

// -------------------- 5. Contact Form & Copy Email --------------------
function initContactForm() {
  const copyBtn = document.getElementById("copy-email-btn");
  const emailText = document.getElementById("email-text")?.innerText || "aradhyashinde2330@gmail.com";
  const contactForm = document.getElementById("contact-form");
  const statusDiv = document.getElementById("form-status");

  copyBtn?.addEventListener("click", () => {
    navigator.clipboard.writeText(emailText).then(() => {
      copyBtn.innerText = "Copied!";
      copyBtn.style.backgroundColor = "#ff4d5a";
      copyBtn.style.color = "#ffffff";
      setTimeout(() => {
        copyBtn.innerText = "Copy";
        copyBtn.style.backgroundColor = "";
        copyBtn.style.color = "";
      }, 2000);
    });
  });

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("form-name").value;
    const email = document.getElementById("form-email").value;
    const message = document.getElementById("form-message").value;

    if (statusDiv) {
      statusDiv.innerHTML = `<span>✓ Thank you, ${name}! Your email client will open to send your message.</span>`;
    }

    setTimeout(() => {
      window.location.href = `mailto:aradhyashinde2330@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom:%20${encodeURIComponent(email)}`;
    }, 600);
  });
}