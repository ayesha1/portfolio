// ══════════════════════════════════════════
// MAIN APP — View Orchestration
// ══════════════════════════════════════════

// ── Custom cursor overlay ──
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x;
  let ty = y;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });

  window.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
  window.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));

  function tick() {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;
    cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Detect hover on interactive elements and scale up
  const interactiveSelector = 'button, a, input, textarea, [role="button"], .tab-btn, .chip, .nav-tab, .toolbar-btn, .hero-input-container, .generate-btn, label, [data-clickable]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.add('is-interactive');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector) && !e.relatedTarget?.closest?.(interactiveSelector)) {
      cursor.classList.remove('is-interactive');
    }
  });
}

initCustomCursor();

import { urlToSeed, extractDomain, deriveSceneParams } from './seed.js';
import { startLoading } from './loading.js';
import { initDashboard, setProjectName, setBrandName, showChatBubble } from './dashboard.js';
import { buildScene, dispose } from './environment.js';

// ── Views ──
const viewLanding = document.getElementById('view-landing');
const viewLoading = document.getElementById('view-loading');
const viewDashboard = document.getElementById('view-dashboard');
const urlInput = document.getElementById('url-input');
const generateBtn = document.getElementById('generate-btn');
const canvas = document.getElementById('three-canvas');

let currentUrl = '';

// ── View Switching ──
function showView(viewId) {
  const views = [viewLanding, viewLoading, viewDashboard];
  const target = document.getElementById(viewId);

  // Fade out current active views
  views.forEach(v => {
    if (v !== target && v.classList.contains('active')) {
      v.classList.remove('active');
      v.classList.add('fade-out');
    }
  });

  // Show new view after brief delay for fade-out
  setTimeout(() => {
    views.forEach(v => v.classList.remove('fade-out'));
    target.classList.add('active');
  }, 400);
}

// ── Generate Flow ──
function handleGenerate() {
  let url = urlInput.value.trim();
  if (!url) {
    urlInput.focus();
    urlInput.classList.add('shake');
    setTimeout(() => urlInput.classList.remove('shake'), 500);
    return;
  }

  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  currentUrl = url;
  const domain = extractDomain(url);

  // Switch to loading
  showView('view-loading');

  // Start the loading sequence
  startLoading(url, () => {
    // Prepare dashboard
    const domainName = domain.split('.')[0];
    setProjectName(domainName);
    setBrandName(domain);

    // Build 3D scene
    try {
      const seed = urlToSeed(url);
      const params = deriveSceneParams(seed);
      buildScene(canvas, params);
    } catch (e) {
      console.error('Scene build error:', e);
    }

    // Switch to dashboard
    showView('view-dashboard');

    // Auto-show chat bubble after a moment
    showChatBubble();
  });
}

// ── Event Listeners ──
generateBtn.addEventListener('click', handleGenerate);

urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleGenerate();
  }
});

// Initialize dashboard interactions
initDashboard();

// ── Shake Animation (inline) ──
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  .shake {
    animation: shake 0.4s ease;
  }
`;
document.head.appendChild(style);
