import { useState, useRef, useEffect } from 'react'

const bags = [
  { name: 'Cyme Mini', brand: "Polène SS '25", image: '/closet-bag1.jpg', logo: 'POLÈNE' },
  { name: 'Lady Dior Mini', brand: "Dior Fall '25", image: '/closet-bag2.jpg', logo: 'DIOR' },
  { name: 'Brooklyn Shoulder Bag 28', brand: "Coach Fall '25", image: '/closet-bag3.jpg', logo: 'COACH' },
  { name: 'Re-Nylon Shoulder Bag', brand: "Prada FW '25", image: '/closet-bag4.jpg', logo: 'PRADA' },
]

export default function ClosetExperiment({ visible }) {
  const [activeIndex, setActiveIndex] = useState(2)
  const [animIndex, setAnimIndex] = useState(2)
  const dragRef = useRef(null)
  const startX = useRef(0)

  // Smooth animate the index
  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimIndex(activeIndex))
    return () => cancelAnimationFrame(raf)
  }, [activeIndex])

  function handlePointerDown(e) {
    startX.current = e.clientX
    dragRef.current?.setPointerCapture(e.pointerId)
  }

  function handlePointerUp(e) {
    const diff = e.clientX - startX.current
    if (diff < -30 && activeIndex < bags.length - 1) setActiveIndex(i => i + 1)
    else if (diff > 30 && activeIndex > 0) setActiveIndex(i => i - 1)
  }

  const current = bags[activeIndex]

  return (
    <div
      className="flex items-center gap-12 lg:gap-20 max-w-[1400px] mx-auto px-8 transition-all duration-1000"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(60px)',
      }}
    >
      {/* Left — info */}
      <div className="flex-shrink-0 max-w-[280px]">
        <span className="text-[10px] font-mono text-gray-300 block mb-2">02</span>
        <h3 className="font-serif text-2xl lg:text-3xl text-gray-900 mb-3 leading-tight">Spatial Closet</h3>
        <p className="text-[13px] text-gray-400 leading-relaxed mb-6">
          A Vision Pro closet experience. Swipe through your wardrobe in spatial glass panels.
        </p>
        <div className="flex gap-2 flex-wrap">
          {['visionOS', 'Spatial UI', 'Glass'].map(tag => (
            <span key={tag} className="text-[11px] text-gray-400 border border-gray-200 px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      {/* Right — Vision Pro scene */}
      <div className="flex-1 flex justify-center">
        <div
          className="relative rounded-[28px] overflow-hidden select-none"
          style={{ width: '640px', height: '420px' }}
        >
          {/* Room bg */}
          <img src="/closet-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(49,26,0,0.4) 0%, rgba(0,0,0,0.15) 80%)' }} />

          {/* Glass side nav */}
          <div
            className="absolute left-[12px] top-1/2 -translate-y-1/2 flex flex-col gap-[4px] p-[5px] rounded-[32px] z-30"
            style={{
              backdropFilter: 'blur(40px)',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset -1px 2px 1px -1px rgba(255,255,255,0.12), inset 0 -1px 1px rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            {['✂️', '💎', '👔', '🔒'].map((icon, i) => (
              <div
                key={i}
                className="w-[24px] h-[24px] rounded-full flex items-center justify-center text-[9px]"
                style={{ background: i === 3 ? 'rgba(255,255,255,0.18)' : 'transparent' }}
              >
                <span style={{ filter: 'grayscale(1) brightness(2)', opacity: 0.6 }}>{icon}</span>
              </div>
            ))}
          </div>

          {/* Top outfit panel — centered, at perspective angle, fading at bottom */}
          <div
            className="absolute top-[-90px] left-1/2 z-10"
            style={{
              width: '280px',
              height: '180px',
              transform: 'translateX(-50%) perspective(400px) rotateX(25deg)',
              transformOrigin: 'center bottom',
            }}
          >
            <div
              className="w-full h-full rounded-[20px] overflow-hidden"
              style={{
                backdropFilter: 'blur(40px)',
                background: 'linear-gradient(117deg, rgba(180,180,180,0.2) 2%, rgba(255,255,255,0.12) 33%, rgba(175,175,175,0.12) 97%)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                opacity: 0.5,
              }}
            >
              <img src="/closet-outfit.png" alt="" className="w-full h-full object-cover opacity-80" />
            </div>
          </div>

          {/* Model panel — right side */}
          <div
            className="absolute right-[-10px] top-[50px] w-[130px] h-[260px] rounded-[18px] overflow-hidden z-20"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <img src="/closet-map.png" alt="" className="w-full h-full object-cover" />
          </div>

          {/* ── Card Carousel (Apple Cover Flow) ── */}
          <div
            ref={dragRef}
            className="absolute inset-0 z-20"
            style={{ perspective: '800px', cursor: 'grab' }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {bags.map((bag, i) => {
                const offset = i - animIndex
                const absOffset = Math.abs(offset)

                // Apple cover-flow style transforms
                const translateX = offset * 75
                const rotateY = offset * -35
                const translateZ = -absOffset * 60
                const scale = 1 - absOffset * 0.1
                const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.2

                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      width: '120px',
                      height: '160px',
                      transform: `translateX(${translateX}px) perspective(800px) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
                      opacity,
                      zIndex: 20 - absOffset,
                      transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                      pointerEvents: 'none',
                    }}
                  >
                    <div
                      className="w-full h-full rounded-[14px] overflow-hidden"
                      style={{
                        backdropFilter: 'blur(20px)',
                        background: 'linear-gradient(117deg, rgba(200,200,200,0.3) 0%, rgba(255,255,255,0.2) 30%, rgba(180,180,180,0.2) 100%)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        boxShadow: `0 ${4 + absOffset * 2}px ${16 + absOffset * 8}px rgba(0,0,0,${0.15 + absOffset * 0.05}), inset -1px 2px 1px -1px rgba(255,255,255,0.2), inset 0 -1px 1px rgba(255,255,255,0.1)`,
                      }}
                    >
                      <img
                        src={bag.image}
                        alt={bag.name}
                        className="w-full h-full object-cover rounded-[13px] p-[5px]"
                        style={{ borderRadius: '13px' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom media bar */}
          <div
            className="absolute bottom-[16px] left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-[6px] rounded-full z-30"
            style={{
              backdropFilter: 'blur(40px)',
              background: 'linear-gradient(168deg, rgba(79,79,79,0.06) 2%, rgba(255,255,255,0.06) 33%, rgba(79,79,79,0.06) 97%)',
              border: '1px solid rgba(255,255,255,0.15)',
              width: '280px',
            }}
          >
            <svg width="11" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>

            <button onClick={() => setActiveIndex(i => Math.max(0, i - 1))} className="p-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255,255,255,0.45)">
                <path d="M19 20L9 12l10-8v16zM7 4h2v16H7V4z"/>
              </svg>
            </button>

            <div className="flex items-center gap-2 flex-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="w-[18px] h-[18px] rounded bg-white flex-shrink-0 flex items-center justify-center">
                <span className="text-[5px] font-bold text-black tracking-wider">{current.logo}</span>
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-[7px] text-white font-medium leading-tight truncate">{current.name}</p>
                <p className="text-[6px] text-white/35 leading-tight truncate">{current.brand}</p>
              </div>
            </div>

            <button onClick={() => setActiveIndex(i => Math.min(bags.length - 1, i + 1))} className="p-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255,255,255,0.45)">
                <path d="M5 4l10 8-10 8V4zm12 0h2v16h-2V4z"/>
              </svg>
            </button>

            <svg width="7" height="7" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)">
              <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
            </svg>

            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 flex gap-2 z-30">
            <div className="w-[5px] h-[5px] rounded-full bg-white/25" />
            <div className="w-[48px] h-[5px] rounded-full bg-white/25" />
          </div>
        </div>
      </div>
    </div>
  )
}
