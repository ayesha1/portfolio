// ══════════════════════════════════════════
// URL → Seed → Seeded PRNG
// ══════════════════════════════════════════

/**
 * Normalize a URL string for hashing.
 */
function normalizeUrl(url) {
  let s = url.toLowerCase().trim();
  s = s.replace(/^https?:\/\//, '');
  s = s.replace(/^www\./, '');
  s = s.replace(/\/+$/, '');
  return s;
}

/**
 * DJB2 hash → 32-bit unsigned integer.
 */
export function urlToSeed(urlString) {
  const normalized = normalizeUrl(urlString);
  let hash = 5381;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) + hash + normalized.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Mulberry32 seeded PRNG — returns a function that yields 0..1.
 */
export function createRNG(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Extract a domain name from a URL for display.
 */
export function extractDomain(url) {
  try {
    let s = url.trim();
    if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
    const u = new URL(s);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Derive a full set of scene parameters from a seed.
 */
export function deriveSceneParams(seed) {
  const rng = createRNG(seed);

  const primaryHue = Math.floor(rng() * 360);
  const accentHue = (primaryHue + 30 + Math.floor(rng() * 120)) % 360;

  return {
    seed,
    primaryHue,
    accentHue,
    objectCount: 15 + Math.floor(rng() * 20),
    scatterRadius: 8 + rng() * 10,
    rotationSpeed: 0.001 + rng() * 0.003,
    fogDensity: 0.02 + rng() * 0.03,
    particleCount: 200 + Math.floor(rng() * 500),
    verticalSpread: 4 + rng() * 8,
    geometryMix: rng(),
    bloom: rng() > 0.3,
    ringCount: Math.floor(rng() * 3),
    centralScale: 1.5 + rng() * 2,
    centralType: Math.floor(rng() * 4),
  };
}
