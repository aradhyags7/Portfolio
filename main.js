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

  }
  resize();
}
