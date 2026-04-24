// ══════════════════════════════════════════
// DASHBOARD INTERACTIONS
// ══════════════════════════════════════════

export function initDashboard() {
  initSidebar();
  initTabs();
  initChips();
  initSegments();
  initSliders();
  initChatWidget();
  initEnvCards();
}

// ── Sidebar Navigation ──
function initSidebar() {
  const items = document.querySelectorAll('.sidebar-item');
  const panels = document.querySelectorAll('.panel-content');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const panelId = item.dataset.panel;

      // Update sidebar active state
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Update panel visibility
      panels.forEach(p => p.classList.remove('active'));
      const target = document.querySelector(`.panel-content[data-panel="${panelId}"]`);
      if (target) target.classList.add('active');
    });
  });
}

// ── Tab Switcher ──
function initTabs() {
  const switcher = document.querySelector('.tab-switcher');
  const tabs = document.querySelectorAll('.tab-btn');
  if (!switcher || tabs.length === 0) return;

  const updatePill = () => {
    const active = switcher.querySelector('.tab-btn.active');
    if (!active) return;
    const switcherRect = switcher.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    switcher.style.setProperty('--tab-pill-x', `${rect.left - switcherRect.left}px`);
    switcher.style.setProperty('--tab-pill-width', `${rect.width}px`);
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updatePill();
    });
  });

  // Position the pill on first paint, and keep it aligned on resize / font load
  requestAnimationFrame(updatePill);
  window.addEventListener('resize', updatePill);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updatePill);
  }
}

// ── Tone Chips ──
function initChips() {
  const chipGroups = document.querySelectorAll('.chips-grid');
  chipGroups.forEach(group => {
    const chips = group.querySelectorAll('.chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
  });
}

// ── Segment Controls ──
function initSegments() {
  const controls = document.querySelectorAll('.segment-control');
  controls.forEach(control => {
    const btns = control.querySelectorAll('.segment-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

// ── Sliders ──
function initSliders() {
  const daylight = document.getElementById('daylight-slider');
  const daylightVal = document.getElementById('daylight-value');
  const realism = document.getElementById('realism-slider');
  const realismVal = document.getElementById('realism-value');

  if (daylight && daylightVal) {
    daylight.addEventListener('input', () => {
      daylightVal.textContent = daylight.value + '%';
    });
  }

  if (realism && realismVal) {
    realism.addEventListener('input', () => {
      realismVal.textContent = realism.value + '%';
    });
  }
}

// ── Environment Cards ──
function initEnvCards() {
  const cards = document.querySelectorAll('.env-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
}

/**
 * Set the project name in the top bar.
 */
export function setProjectName(name) {
  const el = document.getElementById('project-name');
  if (el) {
    // Capitalize first letter
    el.textContent = name.charAt(0).toUpperCase() + name.slice(1);
  }
}

/**
 * Set the brand intelligence name from the domain.
 */
export function setBrandName(domain) {
  const el = document.getElementById('brand-intel-name');
  if (el) {
    const name = domain.split('.')[0].toUpperCase();
    el.textContent = `${name} Brand Intelligence`;
  }
}

// ── Chat Widget ──
function initChatWidget() {
  const bubble = document.getElementById('chat-bubble');
  const avatar = document.getElementById('avatar-toggle');
  const step2 = document.getElementById('chat-step-2');
  if (!bubble || !avatar) return;

  let isOpen = false;

  avatar.addEventListener('click', () => {
    isOpen = !isOpen;
    bubble.classList.toggle('visible', isOpen);
  });

  // Item chips (Bed, Lamp, Desk) → show price range
  bubble.querySelectorAll('[data-pick="item"]').forEach(chip => {
    chip.addEventListener('click', () => {
      // Clear all selections
      bubble.querySelectorAll('[data-pick="item"]').forEach(c => c.classList.remove('selected'));
      // Mark this one selected
      chip.classList.add('selected');
      // Reveal price range step
      if (step2) step2.classList.add('visible');
    });
  });

  // "No thanks" → hide price range and deselect
  bubble.querySelectorAll('[data-pick="no"]').forEach(chip => {
    chip.addEventListener('click', () => {
      if (step2) step2.classList.remove('visible');
      bubble.querySelectorAll('[data-pick="item"]').forEach(c => c.classList.remove('selected'));
    });
  });

  // Price chips → highlight on click
  bubble.querySelectorAll('[data-pick="price"]').forEach(chip => {
    chip.addEventListener('click', () => {
      bubble.querySelectorAll('[data-pick="price"]').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });
}

/**
 * Auto-show the chat bubble after a delay (call from main.js after dashboard loads).
 */
export function showChatBubble() {
  setTimeout(() => {
    const bubble = document.getElementById('chat-bubble');
    if (bubble) bubble.classList.add('visible');
  }, 1500);
}
