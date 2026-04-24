import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
const beforeImages = [
  '/spaces-before/01.png',
  '/spaces-before/03.png',
  '/spaces-before/04.png',
  '/spaces-before/05.png',
  '/spaces-before/06.png',
  '/spaces-before/07.png',
  '/spaces-before/08.png',
  '/spaces-before/09.png',
  '/spaces-before/10.png',
  '/spaces-before/11.png',
  '/spaces-before/Napster_Spaces_UX_Improvements.png',
]
const secondImg = '/spaces-quickux/second.png'
const spacesPressImg = '/spaces-quickux/spaces-press.png'

/* Scale-to-fit helper: measures available width and shrinks a fixed-size child
 * proportionally, preserving aspect ratio. Used on flow diagrams + pinned overlays
 * so they never cause horizontal scroll on narrow viewports. */
function ScaleToFit({ nativeWidth, nativeHeight, children }) {
  const wrapRef = useRef(null)
  const [scale, setScale] = useState(() => {
    // Best-effort initial guess before measuring so first paint isn't oversized
    if (typeof window === 'undefined') return 1
    return Math.min(1, (window.innerWidth - 80) / nativeWidth)
  })

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => {
      const avail = el.clientWidth
      if (!avail) return
      setScale(Math.min(1, avail / nativeWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [nativeWidth])

  return (
    <div ref={wrapRef} style={{ width: '100%', height: nativeHeight * scale }}>
      <div
        style={{
          width: nativeWidth,
          height: nativeHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* New user flow — hub-and-spoke around a single canvas */
function NewFlowDiagram() {
  const W = 520, H = 160
  const cy = H / 2

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 md:p-8 w-full">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] uppercase tracking-[0.25em] font-bold" style={{ color: '#5f69ef' }}>New Flow</span>
          <span className="text-[12px] text-gray-400">one canvas, any section in one click</span>
        </div>

        <ScaleToFit nativeWidth={W} nativeHeight={H}>
          <div style={{ position: 'relative', width: W, height: H }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <marker id="spaces-arrow-new-end" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill="#374151" />
                </marker>
              </defs>
              <line x1={66} y1={cy} x2={210} y2={cy} stroke="#374151" strokeWidth="1.4" markerEnd="url(#spaces-arrow-new-end)" />
            </svg>

            <FlowChip x={10} y={cy - 15} w={56} label="Start" variant="start" />

            <div
              style={{
                position: 'absolute',
                left: 220,
                top: cy - 44,
                width: 260,
                height: 88,
                borderRadius: 18,
                background: 'linear-gradient(135deg, rgba(124,92,255,0.12) 0%, rgba(235,120,200,0.1) 100%)',
                border: '2px solid rgba(124,92,255,0.4)',
                boxShadow: '0 8px 24px rgba(124,92,255,0.18)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 14px',
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 700, color: '#2a1a5e', letterSpacing: 0.3, textTransform: 'uppercase' }}>
                Single Canvas
              </p>
              <p style={{ fontSize: 11, color: '#5f69ef', marginTop: 2, fontWeight: 500, textAlign: 'center' }}>
                live preview · any section in one click
              </p>
            </div>
          </div>
        </ScaleToFit>

        <p className="mt-4 text-[12px] text-gray-500 italic leading-relaxed">
          Every section lives one click from the canvas, and edits apply to the live preview in real time.
        </p>
      </div>
    </div>
  )
}

/* Connect-your-Claude visitor journey — 5 horizontal stages */
function ClaudeFlowDiagram() {
  const ACCENT = '#7c5cff'

  const stages = [
    {
      n: '01',
      title: 'Arrival',
      desc: 'Visitor lands on the store\'s Space. The 3D environment loads and the brand\'s agent greets them on video.',
      surface: 'visitor',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <circle cx="12" cy="11" r="2.5" />
          <path d="M8 20h8" />
          <path d="M12 17v3" />
        </svg>
      ),
    },
    {
      n: '02',
      title: 'The Pitch',
      desc: 'A soft side-panel offers "Connect your Claude." Declining is one click. No dark patterns.',
      surface: 'visitor',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="14" height="16" rx="2" />
          <path d="M17 9h4v6h-4" />
          <path d="M7 9h6M7 13h4" />
        </svg>
      ),
    },
    {
      n: '03',
      title: 'Handoff',
      desc: 'Desktop shows a QR that opens Claude. The approval screen lists exactly what Napster receives — style, sizing, tone. Never chat history.',
      surface: 'claude',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3v3h-3zM20 14v3M17 20h4M14 20v1" />
        </svg>
      ),
    },
    {
      n: '04',
      title: 'Personalized Return',
      desc: 'Back in the Space, the environment shifts to match their aesthetic. The agent opens with a preference-aware line.',
      surface: 'visitor',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l2.4 5 5.6.8-4 3.9.9 5.6L12 15.8 7.1 18.3l.9-5.6-4-3.9 5.6-.8z" />
        </svg>
      ),
    },
    {
      n: '05',
      title: 'Ongoing Trust',
      desc: 'A small Claude indicator lives in the HUD. Tap it to see what\'s being used, or disconnect in one tap.',
      surface: 'visitor',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          <path d="M12 14.5v3" />
        </svg>
      ),
    },
  ]

  return (
    <div
      className="rounded-2xl border border-gray-200 p-6 md:p-8 mb-8"
      style={{ background: 'linear-gradient(135deg, #fafbff 0%, #f7f4ff 100%)' }}
    >
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-[11px] uppercase tracking-[0.25em] font-bold" style={{ color: ACCENT }}>
          Speculative feature
        </span>
        <span className="text-[12px] text-gray-400">Connect-your-Claude visitor journey</span>
      </div>

      <div className="flex items-stretch gap-3 flex-wrap md:flex-nowrap">
        {stages.map((s, i) => (
          <div key={s.n} className="flex items-stretch gap-3 flex-1 min-w-[180px]">
            {/* Stage card */}
            <div
              className="flex-1 rounded-xl bg-white p-4 flex flex-col"
              style={{
                border: '1px solid rgba(124,92,255,0.12)',
                boxShadow: '0 4px 14px rgba(40,20,80,0.04)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="inline-flex items-center justify-center"
                  style={{
                    width: 28, height: 28, borderRadius: 999,
                    background: 'rgba(124,92,255,0.1)',
                    color: ACCENT,
                    fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
                  }}
                >
                  {s.n}
                </span>
                <span
                  className="text-[9.5px] uppercase tracking-[0.15em] font-semibold px-2 py-0.5 rounded-full"
                  style={
                    s.surface === 'claude'
                      ? { background: 'rgba(15,23,42,0.08)', color: '#334155' }
                      : { background: 'rgba(124,92,255,0.08)', color: ACCENT }
                  }
                >
                  {s.surface === 'claude' ? 'Claude' : 'Visitor'}
                </span>
              </div>

              <div className="mb-2" style={{ color: ACCENT, opacity: 0.85 }}>
                {s.icon}
              </div>

              <p className="text-[13px] font-semibold text-gray-900 mb-1.5">{s.title}</p>
              <p className="text-[11.5px] text-gray-500 leading-relaxed">{s.desc}</p>
            </div>

            {/* Arrow between cards */}
            {i < stages.length - 1 && (
              <div className="hidden md:flex flex-shrink-0 items-center">
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                  <path d="M1 7h14M11 2l4 5-4 5" stroke={ACCENT} strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Constraint callouts */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: 'Granular consent', desc: 'Only named slices — style, sizing, tone. Never full chat history.' },
          { label: 'One-tap disconnect', desc: 'Connection can be revoked from the HUD at any time, mid-session.' },
          { label: 'Two surfaces, one flow', desc: 'Napster stays visitor-facing. Claude handles approval in its own app.' },
        ].map(c => (
          <div key={c.label} className="p-3 rounded-lg" style={{ background: 'rgba(124,92,255,0.04)', border: '1px solid rgba(124,92,255,0.1)' }}>
            <p className="text-[11.5px] font-semibold text-gray-800 mb-1">{c.label}</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-gray-500 pt-4 border-t border-gray-200/60">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(124,92,255,0.6)' }} />
          Visitor surface (the 3D Space)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
          Claude surface (approval + disconnect)
        </span>
      </div>
    </div>
  )
}

/* Current user flow — Start → Auto / Advanced branches */
function CurrentFlowDiagram() {
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 md:p-8 w-full">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[11px] uppercase tracking-[0.25em] text-gray-900 font-bold">Current Flow</span>
          <span className="text-[12px] text-gray-400">two branches after Start, one short and one sequential</span>
        </div>

        <ScaleToFit nativeWidth={820} nativeHeight={760}>
          <FlowSvg />
        </ScaleToFit>

        <p className="mt-4 text-[12px] text-gray-500 italic leading-relaxed">
          * In Advanced, users can't skip through the sequential steps, but they can jump directly to Preview & Publish at any point.
        </p>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-gray-500 pt-5 border-t border-gray-100">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300" /> Start</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-gray-900 inline-block rotate-45" /> Decision</span>
        </div>
      </div>
    </div>
  )
}

function FlowChip({ x, y, w = 108, h = 30, label, variant = 'default', shape = 'rect', fontSize = 10.5 }) {
  const variants = {
    default:  { bg: '#fff',    fg: '#1f2937', border: '#e5e7eb' },
    decision: { bg: '#111827', fg: '#fff',    border: '#111827' },
    auto:     { bg: 'rgba(124,92,255,0.12)', fg: '#2a1a5e', border: 'rgba(124,92,255,0.4)' },
    start:    { bg: '#f3f4f6', fg: '#6b7280', border: '#e5e7eb' },
    terminal: { bg: '#111827', fg: '#fff',    border: '#111827' },
  }
  const v = variants[variant]
  if (shape === 'diamond') {
    const size = w || 56
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: size, height: size }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: v.bg,
          transform: 'rotate(45deg)',
          borderRadius: 6,
          border: `1px solid ${v.border}`,
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        }} />
        <span style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: v.fg, fontSize: fontSize, fontWeight: 600, textAlign: 'center', padding: 8, lineHeight: 1.15,
        }}>{label}</span>
      </div>
    )
  }
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: w, height: h,
      background: v.bg, color: v.fg,
      border: `1px solid ${v.border}`,
      borderRadius: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: fontSize, fontWeight: 600, textAlign: 'center', padding: '0 10px', lineHeight: 1.15,
      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
      whiteSpace: 'nowrap',
    }}>{label}</div>
  )
}

function FlowEdge({ d }) {
  return <path d={d} fill="none" stroke="#374151" strokeWidth="1.4" markerEnd="url(#spaces-arrow)" />
}

function FlowLabel({ x, y, text }) {
  return <text x={x} y={y} fontSize="9.5" fill="#6b7280" fontWeight="600" textAnchor="middle">{text}</text>
}

function FlowSvg() {
  // Vertical layout:
  //   Start → ◇ Mode?
  //            ├─ Yes (Auto) → Preview & Publish (top right)
  //            └─ Advanced ↓
  //                Avatar
  //                  ↓
  //                Environment
  //                  ↓
  //                Knowledge
  //                  ↓
  //                FAQ
  //                  ↓
  //                Welcome
  //                  ↓
  //                Deflect
  //                  ↓
  //                Prompt ──→ Preview & Publish
  const W = 820, H = 760

  // Shared geometry
  const startChip  = { x: 10,   y: 40, w: 76, h: 44, fontSize: 13 }
  const diamond    = { x: 110,  y: 28, w: 68, fontSize: 11, label: 'Auto or Advanced?' }
  const autoChip   = { x: 299,  y: 40, w: 140, h: 44, fontSize: 13 }
  const publishChip = { x: 560, y: 40, w: 220, h: 48, fontSize: 13 }

  // Advanced vertical column (centered under the diamond at cx = 144)
  const colCx = 144
  const chipW = 160
  const chipH = 44
  const rowGap = 28
  const startY = 150
  const advanced = ['Avatar', 'Environment', 'Knowledge', 'FAQ', 'Welcome', 'Deflect', 'Prompt'].map((label, i) => ({
    label,
    x: colCx - chipW / 2,
    y: startY + i * (chipH + rowGap),
    w: chipW,
    h: chipH,
    fontSize: 13,
  }))
  const promptChip = advanced[advanced.length - 1]

  // Diamond corners
  const dTop    = [diamond.x + diamond.w / 2, diamond.y]                     // (144, 28)
  const dRight  = [diamond.x + diamond.w,     diamond.y + diamond.w / 2]     // (178, 62)
  const dBottom = [diamond.x + diamond.w / 2, diamond.y + diamond.w]         // (144, 96)

  return (
    <div style={{ position: 'relative', width: W, height: H }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <marker id="spaces-arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="#374151" />
          </marker>
        </defs>

        {/* Start → Diamond (horizontal) */}
        <FlowEdge d={`M ${startChip.x + startChip.w} ${startChip.y + startChip.h / 2} L ${diamond.x - 4} ${diamond.y + diamond.w / 2}`} />

        {/* Diamond right corner → Auto (Yes / Auto) */}
        <FlowEdge d={`M ${dRight[0]} ${dRight[1]} L ${autoChip.x - 4} ${autoChip.y + autoChip.h / 2}`} />
        <FlowLabel x={(dRight[0] + autoChip.x) / 2} y={dRight[1] - 10} text="Auto" />

        {/* Auto → Preview & Publish (straight across) */}
        <FlowEdge d={`M ${autoChip.x + autoChip.w} ${autoChip.y + autoChip.h / 2} L ${publishChip.x - 4} ${publishChip.y + publishChip.h / 2}`} />

        {/* Diamond bottom corner → Advanced column (down to Avatar's top) */}
        <FlowEdge d={`M ${dBottom[0]} ${dBottom[1]} L ${colCx} ${advanced[0].y - 4}`} />
        <FlowLabel x={colCx - 44} y={dBottom[1] + 26} text="Advanced" />

        {/* Down arrows between each advanced step */}
        {advanced.slice(0, -1).map((chip, i) => {
          const next = advanced[i + 1]
          const fromY = chip.y + chip.h
          const toY = next.y - 4
          return <FlowEdge key={i} d={`M ${colCx} ${fromY} L ${colCx} ${toY}`} />
        })}

        {/* Prompt → Preview & Publish (right across and up) */}
        <FlowEdge
          d={`M ${promptChip.x + promptChip.w} ${promptChip.y + promptChip.h / 2} L ${publishChip.x + publishChip.w / 2} ${promptChip.y + promptChip.h / 2} L ${publishChip.x + publishChip.w / 2} ${publishChip.y + publishChip.h + 4}`}
        />
      </svg>

      {/* Nodes */}
      <FlowChip {...startChip} label="Start" variant="start" />
      <FlowChip {...diamond} y={diamond.y} label={diamond.label} variant="decision" shape="diamond" />
      <FlowChip {...autoChip} label="Generate" variant="auto" />
      <FlowChip {...publishChip} label="Preview & Publish" variant="terminal" />
      {advanced.map(chip => (
        <FlowChip key={chip.label} {...chip} label={chip.label} />
      ))}
    </div>
  )
}

function BeforeSlideshow() {
  const [active, setActive] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (fullscreen) return // Pause auto-advance while fullscreen is open
    const t = setInterval(() => setActive(i => (i + 1) % beforeImages.length), 4200)
    return () => clearInterval(t)
  }, [fullscreen])

  // ESC to close fullscreen
  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e) => { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullscreen])

  return (
    <div className="flex gap-4 items-stretch" style={{ height: 420 }}>
      {/* Main preview — no background, no border */}
      <div className="relative flex-1 group">
        {beforeImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              opacity: i === active ? 1 : 0,
              transition: 'opacity 0.7s ease-in-out',
            }}
          />
        ))}
        {/* Fullscreen button (appears on hover) */}
        <button
          onClick={() => setFullscreen(true)}
          aria-label="View fullscreen"
          className="absolute top-3 right-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/80"
          style={{
            width: 36, height: 36, borderRadius: 999,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9V5a1 1 0 0 1 1-1h4" />
            <path d="M20 9V5a1 1 0 0 0-1-1h-4" />
            <path d="M4 15v4a1 1 0 0 0 1 1h4" />
            <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
          </svg>
        </button>
      </div>

      {/* Right-rail scrollable square thumbnails */}
      <div
        className="flex-shrink-0 flex flex-col gap-1.5 overflow-y-auto pr-1"
        style={{
          width: 72,
          height: '100%',
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 transparent',
        }}
      >
        {beforeImages.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200"
            style={{
              width: 60,
              height: 60,
              border: i === active ? '2px solid #7c5cff' : '1px solid #e5e7eb',
              opacity: i === active ? 1 : 0.55,
              boxShadow: i === active ? '0 2px 8px rgba(124,92,255,0.25)' : 'none',
            }}
            aria-label={`Screen ${i + 1}`}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Fullscreen overlay — portaled to document.body so no ancestor transform can clip it */}
      {fullscreen && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            animation: 'fsSlideshowFade 0.25s ease',
          }}
          onClick={() => setFullscreen(false)}
        >
          <img
            src={beforeImages[active]}
            alt=""
            style={{
              maxWidth: '92vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              borderRadius: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setFullscreen(false)}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 24, right: 24,
              width: 44, height: 44, borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.22)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <style>{`
            @keyframes fsSlideshowFade {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>,
        document.body
      )}
    </div>
  )
}

function ContentSection({ id, children, className = 'mb-24' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id={id}
      className={`${className} transition-all duration-700`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
      }}
    >
      {children}
    </section>
  )
}

const tocItems = [
  { id: 'background', label: 'Background' },
  { id: 'problem', label: 'Problem' },
  { id: 'process', label: 'Process' },
  { id: 'prototype', label: 'Prototype' },
  { id: 'results', label: 'Results' },
]

const PURPLE = '#7c5cff'

export default function SpacesCaseStudy() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('background')
  const [onPrototype, setOnPrototype] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const prototypeRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleScroll = useCallback(() => {
    for (const item of tocItems) {
      const el = document.getElementById(item.id)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.4 && rect.bottom > 0) {
          setActiveSection(item.id)
        }
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Hide the portfolio cursor whenever the pointer enters the prototype iframe,
  // and show it again as soon as the pointer leaves. Uses both native
  // pointerenter/leave (reliable at the parent level when crossing iframe bounds)
  // AND a window.blur listener (the iframe focus steals events).
  useEffect(() => {
    const el = prototypeRef.current
    if (!el) return

    let hidden = false
    const hide = () => {
      if (hidden) return
      hidden = true
      window.dispatchEvent(new Event('custom-cursor-hide'))
    }
    const show = () => {
      if (!hidden) return
      hidden = false
      window.dispatchEvent(new Event('custom-cursor-show'))
    }

    el.addEventListener('pointerenter', hide)
    el.addEventListener('pointerleave', show)
    el.addEventListener('mouseenter', hide)
    el.addEventListener('mouseleave', show)
    // If the iframe steals focus (e.g. user clicks inside), the parent
    // window blurs — use that as a redundant "hide" signal.
    window.addEventListener('blur', hide)
    // When the parent window regains focus, show again
    window.addEventListener('focus', show)

    return () => {
      el.removeEventListener('pointerenter', hide)
      el.removeEventListener('pointerleave', show)
      el.removeEventListener('mouseenter', hide)
      el.removeEventListener('mouseleave', show)
      window.removeEventListener('blur', hide)
      window.removeEventListener('focus', show)
      window.dispatchEvent(new Event('custom-cursor-show'))
    }
  }, [])

  // After 5s of sitting on the prototype section, reveal a scroll-to-results hint
  useEffect(() => {
    if (!onPrototype) {
      setShowScrollHint(false)
      return
    }
    const t = setTimeout(() => setShowScrollHint(true), 20000)
    return () => clearTimeout(t)
  }, [onPrototype])

  // Hide the back button while the full-bleed prototype is on screen
  useEffect(() => {
    function check() {
      const el = prototypeRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // Consider "on prototype" when it occupies the top half of the viewport
      const visibleTop = Math.max(0, -rect.top)
      const visibleHeight = Math.min(rect.height, vh - rect.top) - Math.max(0, -rect.top)
      const ratioOfViewport = Math.max(0, visibleHeight) / vh
      setOnPrototype(rect.top < vh * 0.3 && rect.bottom > vh * 0.3 && ratioOfViewport > 0.4)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white" style={{ cursor: 'auto', overflowX: 'clip' }}>
      {/* Scroll-to-results hint — shown after 5s on the prototype */}
      <button
        onClick={() => {
          const el = document.getElementById('results')
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
        aria-label="Scroll to results"
        className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-white"
        style={{
          bottom: 32,
          opacity: onPrototype && showScrollHint ? 1 : 0,
          pointerEvents: onPrototype && showScrollHint ? 'auto' : 'none',
          background: 'rgba(15, 10, 40, 0.7)',
          backdropFilter: 'blur(14px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
          transition: 'opacity 0.45s ease',
          animation: onPrototype && showScrollHint ? 'spacesScrollBob 2s ease-in-out infinite' : 'none',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: 0.3 }}>See the results</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        <style>{`
          @keyframes spacesScrollBob {
            0%, 100% { transform: translate(-50%, 0); }
            50%      { transform: translate(-50%, 6px); }
          }
        `}</style>
      </button>

      {/* Back button — hidden while the prototype is in view */}
      <button
        onClick={() => navigate('/#case-spaces')}
        className="fixed top-6 left-6 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white"
        style={{
          opacity: onPrototype ? 0 : 1,
          pointerEvents: onPrototype ? 'none' : 'auto',
          transition: 'opacity 0.35s ease, background-color 0.2s ease',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M5 12l7-7M5 12l7 7" />
        </svg>
      </button>

      {/* ── HERO ── */}
      <div
        className="relative w-full h-[85vh] overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 30% 30%, #3a1f6f 0%, #1b0f3a 45%, #0a0718 100%)',
        }}
      >
        {/* Floating ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { size: 320, top: '8%',  left: '10%', color: 'rgba(124, 92, 255, 0.35)' },
            { size: 260, top: '55%', left: '70%', color: 'rgba(235, 120, 200, 0.28)' },
            { size: 200, top: '65%', left: '15%', color: 'rgba(110, 190, 255, 0.25)' },
            { size: 180, top: '15%', left: '75%', color: 'rgba(255, 180, 130, 0.22)' },
          ].map((o, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: o.size, height: o.size,
                top: o.top, left: o.left,
                background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
                filter: 'blur(30px)',
                animation: `spacesOrb ${12 + i * 2}s ease-in-out ${i * 0.8}s infinite`,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <div className="flex items-center gap-3 mb-6" style={{ animation: 'heroFade 0.8s ease-out 0.2s both' }}>
            <img src="/spaces-logo.png" alt="Napster Spaces" className="h-8 object-contain opacity-95" />
            <span className="text-[13px] uppercase tracking-[0.3em] text-white/80 font-semibold">Spaces</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl text-white leading-tight max-w-[820px] mb-6" style={{ animation: 'heroFade 0.8s ease-out 0.4s both' }}>
            <span style={{ display: 'block' }}>Transforming Retail as</span>
            <span style={{ display: 'block' }}>Intelligent & Immersive Experiences.</span>
          </h1>
          <p className="text-[17px] text-white/75 max-w-[580px] leading-relaxed mb-10" style={{ animation: 'heroFade 0.8s ease-out 0.6s both' }}>
            A concept prototype that generates a browsable brand world from a single URL, shrinking weeks of 3D production into seconds.
          </p>
          <div className="flex gap-6 text-[13px] text-white/55 flex-wrap justify-center" style={{ animation: 'heroFade 0.8s ease-out 0.8s both' }}>
            <div><span className="uppercase tracking-wider text-white/35 mr-2">Role</span>Design Lead</div>
            <div><span className="uppercase tracking-wider text-white/35 mr-2">Year</span>2025</div>
            <div><span className="uppercase tracking-wider text-white/35 mr-2">Team</span>CTO, Director & Designer (me)</div>
          </div>
        </div>

        <style>{`
          @keyframes heroFade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spacesOrb {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
            50% { transform: translate(30px, -40px) scale(1.08); opacity: 0.85; }
          }
        `}</style>
      </div>

      {/* ── MAIN ── */}
      <div className="max-w-[1100px] mr-auto ml-[max(24px,calc((100vw-1100px)*0.28))] px-6 lg:px-12 pt-24 pb-32 flex gap-16">
        <aside className="hidden lg:block sticky top-24 self-start w-[180px] flex-shrink-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">Contents</p>
          <ul className="space-y-2">
            {tocItems.map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-[13px] transition-colors block py-1"
                  style={{
                    color: activeSection === item.id ? '#2a1a5e' : '#9ca3af',
                    fontWeight: activeSection === item.id ? 600 : 400,
                    borderLeft: activeSection === item.id ? `2px solid ${PURPLE}` : '2px solid transparent',
                    paddingLeft: '10px',
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 min-w-0">

          {/* Background */}
          <ContentSection id="background">
            <p className="text-[11px] uppercase tracking-[0.2em] font-medium mb-3" style={{ color: PURPLE }}>Background</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">A Spatial Future for Napster</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              Imagine shopping with a personal assistant by your side who knows you and your brand inside and out, surfacing the right product at the right moment. Now imagine any business being able to stand one up for themselves from a single URL and a single click. Napster Spaces is that idea, an AI agent embedded in a generated brand world, spun up on demand from the web presence a business already has.
            </p>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
              Napster Spaces is my answer to that bottleneck, a speculative prototype that generates a spatial scene directly from a brand's existing web presence. Paste a URL, watch the loading state stitch a space together, and drop into a lightweight, explorable world themed around that brand.
            </p>

            <p className="text-[15px] text-gray-500 leading-relaxed mb-5">
              The original version of Spaces was built by a team without any designers, so the product shipped without basic UX principles in place, no clear hierarchy, no visual system, and interactions that left users guessing. Below is a recording of that early build as a reference point for what needed to change.
            </p>

            <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 bg-black">
              <video
                src="/spaces-old.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto block"
              />
            </div>
            <p className="text-[12px] text-gray-400 italic mt-3 text-center">
              Spaces, pre-redesign — the starting point inherited from an engineering-led build.
            </p>
          </ContentSection>

          {/* Problem */}
          <ContentSection id="problem">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Problem</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">"Bad" UX. Visual Refresh. Unnecessarily Complicated.</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              Without a designer on the original team, Spaces shipped with bad UX, weak visual design, and no sense of coherence across views. Core flows ignored basic heuristics, the interface had no visual system, and every screen felt like it belonged to a different product.
            </p>

            <div className="mb-8">
              <BeforeSlideshow />
              <p className="text-[12px] text-gray-400 italic mt-3 text-center">
                Early Spaces screens, before the redesign. Inconsistent hierarchy, clashing styles, and unclear interactions.
              </p>
            </div>

            <h3 className="text-[16px] font-semibold text-gray-800 mb-4">What was actually broken</h3>
            <div className="space-y-3">
              {[
                { title: 'No visual hierarchy', desc: 'Every element competed for attention — primary actions, body text, and decoration all rendered at similar weight and size.' },
                { title: 'Visually unappealing', desc: 'Unrefined colors, inconsistent spacing, and mismatched typography made the product feel unfinished and off-brand.' },
                { title: 'Incoherent across screens', desc: 'Navigation, controls, and layouts changed shape between views, so users had to re-learn the interface every step.' },
                { title: 'Heuristics ignored', desc: 'No clear system status, no error prevention, no affordances — the core Nielsen principles were missing across the flow.' },
                { title: 'Stepper-based friction', desc: 'A rigid multi-step wizard hid options behind decisions and forced users to restart to change anything upstream.' },
              ].map((p, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100">
                  <span className="text-[12px] font-mono text-gray-300 font-bold mt-0.5">0{i + 1}</span>
                  <div>
                    <p className="text-[14px] font-semibold text-gray-800">{p.title}</p>
                    <p className="text-[13px] text-gray-400 mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentSection>

          {/* Process */}
          <ContentSection id="process">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Process</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">From Pattern Library to Generated Worlds</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              I broke the problem down into three layers, a deterministic seed that turns any URL into a consistent set of parameters, a lightweight runtime that assembles a Three.js scene from those parameters, and a dashboard shell that lets a user guide the space once it's loaded.
            </p>

            <h3 className="text-[16px] font-semibold text-gray-800 mb-4">The existing user flow</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-5">
              Before touching visuals, I mapped out the flow a user had to walk through to build a Space. It split into a quick "Auto" path that jumped straight to preview, and an "Advanced" path that funneled users through seven sequential steps before they could publish.
            </p>
            <CurrentFlowDiagram />

            {/* Quick UX Cleanup — 1-week launch */}
            <div className="mt-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] uppercase tracking-[0.15em] text-[#5f69ef] font-semibold">Quick UX Cleanup</span>
                <span className="text-[11px] text-gray-400">· 1-week launch</span>
              </div>
              <h3 className="text-[20px] font-semibold text-gray-900 leading-tight mb-3">Shipping a calmer, more coherent Spaces in a week</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-5">
                The full redesign would take time, so I scoped a one-week pass focused purely on visual clean-up and interaction consistency. I leaned on color psychology to guide attention and tone (calm neutrals for surfaces, purple accents reserved for primary actions so the eye always knows where to go), tightened visual design with a shared type scale, spacing rhythm, and rounded-pill language, and ran the flow against core UX heuristics (visibility of system status, consistency, user control).
              </p>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
                The biggest structural change: users can now jump between steps in Advanced instead of being funneled through a rigid wizard, and every screen shares the same navigation, controls, and layout language so the product finally feels like one product.
              </p>

              <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 bg-black">
                <video
                  src="/spaces-quickux.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto block"
                />
              </div>
              <p className="text-[12px] text-gray-400 italic mt-3 text-center">
                Quick UX cleanup — consistent chrome, jumpable steps, and a calmer color system applied across the flow.
              </p>
            </div>

            {/* Long-term: Key Structural Change */}
            <div className="mt-14">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] uppercase tracking-[0.15em] text-[#5f69ef] font-semibold">Long-Term Vision</span>
                <span className="text-[11px] text-gray-400">· Key Structural Change</span>
              </div>
              <h3 className="text-[20px] font-semibold text-gray-900 leading-tight mb-3">From stepper to single canvas</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
                Longer term, I wanted the whole experience to live on one surface, where users can see and publish in one place, and edit any section with a single click instead of jumping between steps. That meant rethinking the structure itself.
              </p>

              <div className="mb-8 relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                <img src={secondImg} alt="Restructured Spaces editor layout" className="w-full h-auto block" />

                {/* Animated region highlights */}
                <div className="absolute inset-0 pointer-events-none">
                  {[
                    { key: 'left',  left: '0%',   right: '86%',  label: <>Left sidebar<br/>selection</>,   delay: '0s', stack: true },
                    { key: 'center', left: '14%', right: '21%',  label: 'Central canvas — live preview', delay: '2s' },
                    { key: 'right', left: '79%',  right: '0%',   label: 'Right sidebar — editing',       delay: '4s' },
                  ].map(region => (
                    <div
                      key={region.key}
                      className="absolute top-0 bottom-0"
                      style={{
                        left: region.left,
                        right: region.right,
                        animation: `spacesRegionHighlight 6s ease-in-out ${region.delay} infinite`,
                      }}
                    >
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          background: 'rgba(124, 92, 255, 0.3)',
                          border: '2px solid rgba(124, 92, 255, 0)',
                          borderRadius: 10,
                          boxShadow: '0 0 0 0 rgba(124,92,255,0)',
                          opacity: 0,
                          animation: 'inherit',
                        }}
                      >
                        <span
                          className="px-3 py-1.5 rounded-2xl text-white font-semibold text-center"
                          style={{
                            background: 'linear-gradient(135deg, #7c5cff 0%, #a78bfa 100%)',
                            fontSize: 11,
                            letterSpacing: 0.3,
                            boxShadow: '0 6px 16px rgba(124,92,255,0.4)',
                            whiteSpace: region.stack ? 'normal' : 'nowrap',
                            lineHeight: 1.3,
                          }}
                        >
                          {region.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <style>{`
                  @keyframes spacesRegionHighlight {
                    0%, 100% {
                      opacity: 0;
                      border-color: rgba(124, 92, 255, 0);
                      box-shadow: 0 0 0 0 rgba(124, 92, 255, 0);
                    }
                    15% {
                      opacity: 1;
                      border-color: rgba(124, 92, 255, 0.8);
                      box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.25);
                    }
                    30% {
                      opacity: 1;
                      border-color: rgba(124, 92, 255, 0.8);
                      box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.25);
                    }
                    45% {
                      opacity: 0;
                      border-color: rgba(124, 92, 255, 0);
                      box-shadow: 0 0 0 0 rgba(124, 92, 255, 0);
                    }
                  }
                `}</style>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Before */}
                <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-3">Before</p>
                  <ul className="space-y-2.5">
                    {[
                      {
                        label: 'Stepper-based flow',
                        icon: (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="5" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="19" cy="12" r="2" />
                            <path d="M7 12h3M14 12h3" />
                          </svg>
                        ),
                      },
                      {
                        label: 'Fragmented decisions',
                        icon: (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3v6M12 15v6" />
                            <path d="M4.5 8.5l4 2M15.5 13.5l4 2" />
                            <path d="M19.5 8.5l-4 2M8.5 13.5l-4 2" />
                          </svg>
                        ),
                      },
                      {
                        label: 'Hidden options',
                        icon: (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s4-7 10-7a9.77 9.77 0 0 1 5.17 1.5" />
                            <path d="M22 12s-4 7-10 7a9.77 9.77 0 0 1-5.17-1.5" />
                            <line x1="2" y1="2" x2="22" y2="22" />
                          </svg>
                        ),
                      },
                    ].map(item => (
                      <li key={item.label} className="flex items-center gap-2.5 text-[13.5px] text-gray-700">
                        <span className="text-gray-400 flex-shrink-0">{item.icon}</span>
                        <span>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* After */}
                <div
                  className="p-5 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,92,255,0.06) 0%, rgba(235,120,200,0.04) 100%)',
                    border: '1px solid rgba(124,92,255,0.18)',
                  }}
                >
                  <p className="text-[11px] uppercase tracking-[0.15em] font-semibold mb-3" style={{ color: '#5f69ef' }}>After</p>
                  <ul className="space-y-3">
                    {[
                      { label: 'Left sidebar', desc: 'navigation' },
                      { label: 'Right panel', desc: 'contextual editing' },
                      { label: 'Central canvas', desc: 'live preview' },
                    ].map(item => (
                      <li key={item.label} className="text-[13.5px] text-gray-800">
                        <span className="font-semibold" style={{ color: '#2a1a5e' }}>{item.label}</span>
                        <span className="text-gray-500"> → {item.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 mb-10">
                <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-3">What this creates</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { title: 'Spatial clarity', desc: 'Everything you can do lives in view, not hidden behind linear steps.' },
                    { title: 'Faster iteration', desc: 'Edits happen in the right panel while the canvas updates live, no reload, no backtracking.' },
                    { title: 'Better mental model', desc: 'The UI maps to how users already think, navigate on the left, edit on the right, see the result in the middle.' },
                  ].map(item => (
                    <div key={item.title} className="p-4 rounded-xl bg-white border border-gray-100">
                      <p className="text-[13px] font-semibold text-gray-900 mb-1">{item.title}</p>
                      <p className="text-[12px] text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <h4 className="text-[16px] font-semibold text-gray-800 mb-4">The new user flow</h4>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-5">
                Instead of a linear stepper, every section now lives one click from a single canvas. Users can jump between Avatar, Environment, Knowledge, FAQ, Welcome, Deflect, Prompt, and Publish in any order, and every edit reflects live in the preview.
              </p>
              <NewFlowDiagram />
            </div>
          </ContentSection>

          {/* Prototype */}
          <ContentSection id="prototype" className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.2em] font-medium mb-3" style={{ color: PURPLE }}>Prototype</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">Try it yourself</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-4">
              Paste any URL into the landing screen, watch the orbs gather into a loading state, and drop into a generated dashboard. The prototype below is the real thing, running live inside the case study.
            </p>
            <div
              className="mb-6 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(124, 92, 255, 0.06)',
                border: '1px solid rgba(124, 92, 255, 0.18)',
              }}
            >
              <p className="text-[13px] text-gray-600 leading-relaxed">
                <span className="font-semibold" style={{ color: '#2a1a5e' }}>Clickable prototype.</span> Paste <span className="font-semibold">ikea.com</span> to walk through a pre-rendered demo. Live model and API calls are disabled here to keep the portfolio lightweight and cost-conscious.
              </p>
            </div>

          </ContentSection>
        </div>
      </div>

      {/* ─── Full-bleed prototype section with scroll-snap ─── */}
      <section
        ref={prototypeRef}
        className="relative w-screen overflow-hidden bg-black"
        style={{
          height: '100vh',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
        }}
      >
        <iframe
          src="/spaces/index.html"
          title="Napster Spaces prototype"
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
          allow="fullscreen"
        />
      </section>

      {/* Enable scroll-snap on the page root only while this case study is mounted */}
      <style>{`
        html {
          scroll-snap-type: y proximity;
        }
      `}</style>

      {/* Speculative feature: Connect your Claude */}
      <section className="w-full pt-24 pb-8" id="claude-flow" style={{ scrollMarginTop: 80 }}>
        {/* Header text aligned with the rest of the case study's body column */}
        <div className="max-w-[1100px] mr-auto ml-[max(24px,calc((100vw-1100px)*0.28))] px-6 lg:px-12 flex gap-16">
          <div className="hidden lg:block w-[180px] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] font-medium mb-3" style={{ color: '#7c5cff' }}>Feature Concept</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-4">Connect your Claude</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
              A speculative extension I'd pair with Spaces: visitors link their Claude account so the store's agent greets them with context it already has, style, sizing, tone, without ever seeing their conversations. The flow below walks through the full five-stage journey.
            </p>
          </div>
        </div>

        {/* Flow diagram gets the wider, centered treatment */}
        <div className="mx-auto px-6 lg:px-10" style={{ maxWidth: 1400 }}>
          <ClaudeFlowDiagram />
        </div>
      </section>

      {/* Continue the content flow below the full-bleed prototype */}
      <div className="max-w-[1100px] mr-auto ml-[max(24px,calc((100vw-1100px)*0.28))] px-6 lg:px-12 pt-16 pb-32 flex gap-16">
        <div className="hidden lg:block w-[180px] flex-shrink-0" />
        <div className="flex-1 min-w-0">

          {/* Results */}
          <ContentSection id="results">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Results</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">A Path Toward Self-Serve Worlds</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
              Spaces is a concept, not a shipped product, but the prototype was enough to open up the conversation internally about what a lightweight, template-driven spatial platform could look like alongside Viewer's bespoke worlds.
            </p>

            <div className="flex items-baseline gap-2 mb-4">
              <h3 className="text-[16px] font-semibold text-gray-800">Product impact</h3>
              <span className="text-[11px] text-gray-400 italic">internal / directional</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                'Instant iteration vs. manual rebuilds with every layout change',
                'Reduced creation flow from 8+ steps to 1 step',
                'Enabled non-technical users to create environments',
              ].map(label => (
                <div
                  key={label}
                  className="p-5 rounded-2xl border border-[#7c5cff]/15 flex items-center"
                  style={{ background: 'linear-gradient(135deg, rgba(124,92,255,0.06) 0%, rgba(235,120,200,0.04) 100%)' }}
                >
                  <p className="text-[13px] leading-snug" style={{ color: '#2a1a5e', fontWeight: 500 }}>{label}</p>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 mb-6">
              <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-3">From the team</p>
              <p className="text-[15px] text-gray-700 leading-relaxed italic">
                "I was fortunate to collaborate with her on projects like an AI-powered personal assistant. Even when the direction was unclear, Ayesha jumped right in, identified pain points, uncovered opportunities through research, and translated them into thoughtful flows and prototypes. Her work was always rooted in user needs while still pushing the boundaries of what design and AI experiences could be."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <img src="/rec-melissa.png" alt="Melissa Molina" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-[13px] font-semibold text-gray-800 leading-tight">Melissa Molina</p>
                  <p className="text-[11px] text-gray-500 leading-tight">Creative Director, Napster · ex-Nickelodeon</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50">
              <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-2">Where it points</p>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                The next version would layer in real design tokens per brand, a saveable dashboard of generated spaces, and a creator mode where teams can remix a seed into a finished world, making spatial activations as casual to launch as a landing page.
              </p>
            </div>

            {/* Press / industry context */}
            <div className="relative group mt-10">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 cursor-pointer">
                <span className="text-[20px]">📣</span>
                <p className="text-[14px] text-gray-600">
                  Napster Spaces was featured in press alongside broader industry coverage, agentic AI is projected to reach <span className="font-semibold text-gray-800">$200B annually by 2034</span>. <span className="text-[#5f69ef] font-medium">(hover to see)</span>
                </p>
              </div>
              {/* Hover popup */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[520px] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                  <img src={spacesPressImg} alt="Napster Spaces press coverage" className="w-full object-cover" />
                </div>
                <div className="w-4 h-4 bg-white border-b border-r border-gray-200 rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2" />
              </div>
            </div>
          </ContentSection>

        </div>
      </div>
    </div>
  )
}
