// ==========================================================================
// ARADHYA SHINDE — PORTFOLIO SCRIPT
// Aesthetic Reference: https://benscott.dev/
// Features: Interactive Constellation Canvas, Sticky Nav, Case Study Modals
// ==========================================================================

// -------------------- 1. Project Modal Data --------------------
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
    requestAnimationFrame(animate);
  }
  resize();
  animate();
}
