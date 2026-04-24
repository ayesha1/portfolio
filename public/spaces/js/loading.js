// ══════════════════════════════════════════
// LOADING SCREEN
// ══════════════════════════════════════════

export function startLoading(url, onComplete) {
  const textEl = document.getElementById('loading-text');
  const urlEl = document.getElementById('loading-url');
  const progressEl = document.getElementById('loading-progress');
  const steps = document.querySelectorAll('.loading-step');
  const center = document.querySelector('.loading-center');

  // Reset state
  urlEl.textContent = url;
  progressEl.style.width = '0%';
  steps.forEach(s => {
    s.classList.remove('visible', 'completed');
  });

  // Phase 1: Analyzing
  textEl.textContent = 'Analyzing your website...';
  setTimeout(() => { progressEl.style.width = '20%'; }, 100);
  setTimeout(() => { progressEl.style.width = '35%'; }, 800);

  // Phase 2: Building — steps appear
  setTimeout(() => {
    textEl.textContent = 'Building your spatial experience...';
    progressEl.style.width = '50%';
  }, 1500);

  const stepTimings = [1800, 2400, 3000, 3600];
  stepTimings.forEach((t, i) => {
    setTimeout(() => {
      steps[i].classList.add('visible');
      progressEl.style.width = `${55 + (i + 1) * 8}%`;

      // Mark completed shortly after appearing
      setTimeout(() => {
        steps[i].classList.add('completed');
      }, 300);
    }, t);
  });

  // Phase 3: Ready
  setTimeout(() => {
    textEl.textContent = 'Your space is ready';
    progressEl.style.width = '100%';
    center.classList.add('ready');
  }, 4400);

  // Transition out
  setTimeout(() => {
    center.classList.remove('ready');
    if (onComplete) onComplete();
  }, 5200);
}
