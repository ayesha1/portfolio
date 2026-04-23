import { useState, useRef, useEffect, useCallback } from 'react'

export default function ViewerPrototype() {
  const sceneRef = useRef(null)
  const [joystick, setJoystick] = useState({ x: 0, y: 0 }) // -1 to 1 normalized
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [walkStep, setWalkStep] = useState(0)
  const [showProduct, setShowProduct] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [cart, setCart] = useState([]) // [{id, name, price, qty, image}]
  const [cartBounce, setCartBounce] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const cartCount = cart.reduce((n, i) => n + i.qty, 0)

  const addToCart = (n) => {
    setCart(items => {
      const existing = items.find(i => i.id === 'constella')
      if (existing) return items.map(i => i.id === 'constella' ? { ...i, qty: i.qty + n } : i)
      return [...items, { id: 'constella', name: 'Constella Necklace', price: 500, qty: n, image: '/necklace.png' }]
    })
    setCartBounce(true)
    setTimeout(() => setCartBounce(false), 600)
  }

  const updateQty = (id, qty) => {
    setCart(items => qty <= 0 ? items.filter(i => i.id !== id) : items.map(i => i.id === id ? { ...i, qty } : i))
  }

  // Drive scene based on joystick input
  useEffect(() => {
    const active = joystick.x !== 0 || joystick.y !== 0
    if (!active) return

    const interval = setInterval(() => {
      // Accumulate pan based on joystick x (left/right looks), y (walk forward/back)
      setOffset(o => ({
        x: Math.max(-80, Math.min(80, o.x + joystick.x * 2)),
        y: Math.max(-30, Math.min(30, o.y + joystick.y * 0.5)),
      }))
      // Zoom in when pushing forward (y negative = up on joystick = walk forward)
      setZoom(z => {
        const target = 1 + Math.max(0, -joystick.y) * 0.25
        return z + (target - z) * 0.1
      })
      // Walk bob animation
      setWalkStep(s => s + 1)
    }, 30)
    return () => clearInterval(interval)
  }, [joystick])

  // Gentle reset when joystick returns to center
  useEffect(() => {
    if (joystick.x !== 0 || joystick.y !== 0) return
    const interval = setInterval(() => {
      setZoom(z => z + (1 - z) * 0.08)
    }, 40)
    return () => clearInterval(interval)
  }, [joystick])

  return (
    <div className="flex items-center justify-center py-12">
      <div
        data-card
        data-card-type="images"
        className="relative rounded-[44px] border-[10px] border-gray-900 bg-gray-900 shadow-2xl overflow-hidden"
        style={{ width: 320, height: 650 }}
      >
        {/* Dynamic island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50" />

        {/* Scene */}
        <div
          ref={sceneRef}
          className="w-full h-full relative overflow-hidden rounded-[32px] select-none bg-black"
        >
          {/* ═══════ WORLD IMAGE — scaled up + pans with mouse ═══════ */}
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out"
            style={{
              transform: `scale(${zoom * 1.3}) translate(${-offset.x * 0.6}px, ${-offset.y * 0.4}px) translateY(${Math.sin(walkStep * 0.3) * 2}px)`,
            }}
          >
            <img
              src="/viewer-world.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '70% center' }}
              draggable={false}
            />
            {/* Necklace hotspot — pinned to the world so it pans with it */}
            <Hotspot top="52%" left="32%" onClick={() => setShowProduct(true)} />
          </div>

          {/* Soft color vignette for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(180,150,180,0.25) 100%)',
            }}
          />

          {/* Subtle atmospheric haze */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,220,230,0.08) 0%, transparent 30%, transparent 70%, rgba(200,180,210,0.15) 100%)',
            }}
          />

          {/* ═══════ 3D AVATAR HANDS (image overlay) ═══════ */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none z-20"
            style={{
              transform: `translate(${offset.x * 0.15}px, ${Math.sin(walkStep * 0.3) * 5}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            <img
              src="/viewer-hands.png"
              alt=""
              className="w-full object-contain"
              style={{
                imageRendering: 'auto',
                filter: 'drop-shadow(0 -4px 16px rgba(60,40,80,0.25))',
              }}
              draggable={false}
            />
          </div>


          {/* Joystick */}
          <Joystick onChange={setJoystick} />

          {/* Right-side control rail */}
          <ControlRail />

          {/* Top-right cart button */}
          <CartButton count={cartCount} bounce={cartBounce} onClick={() => setShowCart(true)} />

          {/* Cart view */}
          {showCart && (
            <CartView
              items={cart}
              onClose={() => setShowCart(false)}
              onUpdateQty={updateQty}
            />
          )}

          {/* Product card (shown when hotspot is clicked) */}
          {showProduct && (
            <ProductCard
              onClose={() => setShowProduct(false)}
              onOpen={() => { setShowProduct(false); setShowDetail(true) }}
              onAdd={() => { addToCart(1); setShowProduct(false) }}
            />
          )}

          {/* Full-screen product detail */}
          {showDetail && (
            <ProductDetail
              onClose={() => setShowDetail(false)}
              onAddToCart={(n) => { addToCart(n); setShowDetail(false) }}
            />
          )}

          {/* Home indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[90px] h-[3px] rounded-full bg-white/60 z-40" />
        </div>
      </div>
    </div>
  )
}

/* ── Draggable joystick (inner thumb moves freely within outer ring) ── */
function Joystick({ onChange }) {
  const outerRef = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const MAX_RADIUS = 16

  const handleStart = useCallback((e) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleMove = useCallback((e) => {
    if (!dragging || !outerRef.current) return
    const rect = outerRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    let dx = clientX - cx
    let dy = clientY - cy

    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist > MAX_RADIUS) {
      dx = (dx / dist) * MAX_RADIUS
      dy = (dy / dist) * MAX_RADIUS
    }

    setPos({ x: dx, y: dy })
    // Report normalized -1 to 1
    onChange?.({ x: dx / MAX_RADIUS, y: dy / MAX_RADIUS })
  }, [dragging, onChange])

  const handleEnd = useCallback(() => {
    setDragging(false)
    setPos({ x: 0, y: 0 })
    onChange?.({ x: 0, y: 0 })
  }, [onChange])

  useEffect(() => {
    if (!dragging) return
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleEnd)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [dragging, handleMove, handleEnd])

  return (
    <div
      ref={outerRef}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      className="absolute bottom-10 left-6 z-30 rounded-full flex items-center justify-center"
      style={{
        width: '62px',
        height: '62px',
        background: 'transparent',
        border: '2px solid #E9E7E6',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
    >
      {/* Inner draggable thumb */}
      <div
        className="rounded-full"
        style={{
          width: '28px',
          height: '28px',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid #E9E7E6',
          boxShadow: `
            0 4px 8px rgba(0,0,0,0.1),
            inset 0 1px 1px rgba(255,255,255,0.5)
          `,
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: dragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
    </div>
  )
}

/* ── Right-side control rail (video call / XR controls) ── */
export function ControlRail() {
  const [collapsed, setCollapsed] = useState(false)

  const iconBtn = "flex items-center justify-center transition-all hover:opacity-100 opacity-85 active:scale-90"
  const btnBox = { width: '24px', height: '24px' }

  return (
    <div
      className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
      style={{
        width: '38px',
        padding: '14px 0',
        borderRadius: '24px',
        background: 'rgba(0,0,0,0.12)',
        backdropFilter: 'blur(100px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(100px) saturate(1.2)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08), inset 0 -1px 1px rgba(255,255,255,0.08), inset 0 1px 1px rgba(255,255,255,0.22)',
        gap: '16px',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Collapse chevron */}
      <button
        className={iconBtn}
        onClick={() => setCollapsed(c => !c)}
        aria-label="Collapse"
        style={{ width: '24px', height: '10px', transform: collapsed ? 'none' : 'scaleY(-1)' }}
      >
        <img src="/viewer-icons/chevron.svg" alt="" style={{ width: '12px', height: '6px' }} />
      </button>

      {!collapsed && (
        <>
          {/* Settings */}
          <button className={iconBtn} aria-label="Settings" style={btnBox}>
            <img src="/viewer-icons/settings.svg" alt="" style={{ width: '18px', height: '19px' }} />
          </button>

          {/* Share */}
          <button className={iconBtn} aria-label="Share" style={btnBox}>
            <img src="/viewer-icons/camera-off.svg" alt="" style={{ width: '18px', height: '13.5px' }} />
          </button>

          {/* Reactions (emoji) */}
          <button className={iconBtn} aria-label="Reactions" style={btnBox}>
            <img src="/viewer-icons/emoji.svg" alt="" style={{ width: '18px', height: '20px' }} />
          </button>

          {/* Divider */}
          <div style={{ width: '22px', height: '1px', background: 'rgba(247,248,250,0.3)' }} />
        </>
      )}

      {/* Chat */}
      <button className={iconBtn} aria-label="Chat" style={btnBox}>
        <img src="/viewer-icons/chat.svg" alt="" style={{ width: '18px', height: '17px' }} />
      </button>

      {/* Camera off */}
      <button className={iconBtn} aria-label="Camera" style={btnBox}>
        <img src="/viewer-icons/share.svg" alt="" style={{ width: '18px', height: '14.5px' }} />
      </button>

      {/* Mic off */}
      <button className={iconBtn} aria-label="Mic" style={btnBox}>
        <img src="/viewer-icons/mic-off.svg" alt="" style={{ width: '18px', height: '20px' }} />
      </button>
    </div>
  )
}

/* ── Hotspot glow (pulsing marker for interactive products) ── */
export function Hotspot({ top, left, onClick }) {
  return (
    <button
      aria-label="View product"
      onClick={onClick}
      className="absolute z-20 flex items-center justify-center group"
      style={{
        top,
        left,
        width: '36px',
        height: '36px',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer pulse */}
      <span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'rgba(255,255,255,0.35)',
          animation: 'hotspot-pulse 2s ease-out infinite',
        }}
      />
      {/* Icon */}
      <img src="/viewer-icons/hotspot.svg" alt="" style={{ width: '26px', height: '26px', position: 'relative' }} />
      <style>{`
        @keyframes hotspot-pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </button>
  )
}

/* ── Product card (appears when hotspot is clicked) ── */
function ProductCard({ onClose, onOpen, onAdd }) {
  return (
    <>
      {/* Click-outside catcher */}
      <div className="absolute inset-0 z-30" onClick={onClose} />
    <div
      onClick={onOpen}
      className="absolute z-40 left-1/2 -translate-x-1/2 bottom-28 overflow-hidden flex cursor-pointer"
      style={{
        width: '280px',
        height: '114px',
        borderRadius: '18px',
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(30px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(30px) saturate(1.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.2)',
        animation: 'card-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Close */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        aria-label="Close"
        className="absolute top-1.5 right-2 z-10 w-5 h-5 rounded-full flex items-center justify-center text-white/70 hover:text-white"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Image */}
      <div className="relative flex-shrink-0" style={{ width: '126px', height: '114px' }}>
        <img
          src="/necklace.png"
          alt="Constella Necklace"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Divider */}
      <div style={{ width: '1px', background: 'rgba(255,255,255,0.25)' }} />

      {/* Text */}
      <div className="flex-1 flex flex-col justify-center px-3.5 py-3 text-white relative">
        <p className="font-bold leading-tight" style={{ fontSize: '14px', letterSpacing: '-0.1px' }}>
          Constella Necklace
        </p>
        <p className="text-white/80 leading-snug mt-1" style={{ fontSize: '9.5px' }}>
          Mixed cuts, Clasp, White,<br />Rhodium plated
        </p>
        <p className="font-bold mt-2" style={{ fontSize: '11.5px' }}>$500</p>

        {/* Add-to-cart button (cart icon with + badge) */}
        <button
          onClick={(e) => { e.stopPropagation(); onAdd?.() }}
          aria-label="Add to cart"
          className="absolute bottom-2 right-2 flex items-center justify-center transition-transform active:scale-90"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          <img src="/viewer-icons/cart.svg" alt="" style={{ width: '14px', height: '11px', filter: 'brightness(0)' }} />
          {/* + badge */}
          <span
            className="absolute flex items-center justify-center text-white font-bold"
            style={{
              top: '-3px',
              right: '-3px',
              width: '13px',
              height: '13px',
              borderRadius: '999px',
              background: '#000',
              fontSize: '10px',
              lineHeight: 1,
              border: '1.5px solid #fff',
            }}
          >
            +
          </span>
        </button>
      </div>

      <style>{`
        @keyframes card-pop {
          0% { opacity: 0; transform: translate(-50%, 20px) scale(0.9); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
      `}</style>
    </div>
    </>
  )
}

/* ── Full-screen product detail page ── */
function ProductDetail({ onClose, onAddToCart }) {
  const [qty, setQty] = useState(1)

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col"
      style={{
        background: 'rgba(20, 10, 30, 0.55)',
        backdropFilter: 'blur(30px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(30px) saturate(1.4)',
        borderRadius: 'inherit',
        animation: 'detail-in 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-end px-4 pt-12 pb-3">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform active:scale-90"
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Product image */}
      <div className="px-6 mt-2">
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: '1 / 1',
            borderRadius: '22px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <img
            src="/necklace.png"
            alt="Constella Necklace"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>
      </div>

      {/* Details */}
      <div className="px-6 mt-5 text-white flex-1 flex flex-col">
        <p className="font-serif" style={{ fontSize: '22px', lineHeight: '1.15', letterSpacing: '-0.3px' }}>
          Constella Necklace
        </p>
        <p className="text-white/70 mt-2" style={{ fontSize: '11px', lineHeight: '1.5' }}>
          Mixed cuts, Clasp, White, Rhodium plated
        </p>

        <p className="font-bold mt-4" style={{ fontSize: '20px' }}>$500</p>

        {/* Quantity */}
        <div className="flex items-center justify-between mt-5">
          <span className="text-white/70" style={{ fontSize: '12px' }}>Quantity</span>
          <div
            className="flex items-center gap-3 px-2 py-1 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
              aria-label="Decrease"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M5 12h14" />
              </svg>
            </button>
            <span className="text-white font-semibold" style={{ fontSize: '13px', minWidth: '16px', textAlign: 'center' }}>
              {qty}
            </span>
            <button
              onClick={() => setQty(q => q + 1)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
              aria-label="Increase"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Add to cart button */}
        <button
          onClick={() => onAddToCart?.(qty)}
          className="mt-auto mb-6 w-full py-3.5 rounded-full text-white font-semibold transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #fff 0%, #f0e8ff 100%)',
            color: '#2a1a3a',
            fontSize: '13px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            letterSpacing: '0.2px',
          }}
        >
          <img src="/viewer-icons/cart.svg" alt="" style={{ width: '14px', height: '11px', filter: 'brightness(0)' }} />
          Add to cart · ${500 * qty}
        </button>
      </div>

      <style>{`
        @keyframes detail-in {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

/* ── Cart view (full-screen glass overlay listing cart items + Apple Pay) ── */
function CartView({ items, onClose, onUpdateQty }) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div
      className="absolute inset-0 z-[60] flex flex-col"
      style={{
        background: 'rgba(20, 10, 30, 0.55)',
        backdropFilter: 'blur(30px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(30px) saturate(1.4)',
        borderRadius: 'inherit',
        animation: 'detail-in 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3">
        <button
          onClick={onClose}
          aria-label="Back"
          className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform active:scale-90"
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <p className="text-white font-semibold" style={{ fontSize: '15px' }}>Your Cart</p>
        <div className="w-8 h-8" />
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center mt-16 text-white/70">
            <svg width="90" height="100" viewBox="0 0 100 110" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              {/* Handle */}
              <path d="M38 22 Q38 8 50 8 Q62 8 62 22" />
              {/* Top rim */}
              <path d="M30 22 H70 Q74 22 74 28 V32 H26 V28 Q26 22 30 22 Z" />
              {/* Bag body (trapezoid) */}
              <path d="M26 32 L22 98 Q22 102 26 102 H74 Q78 102 78 98 L74 32" />
              {/* Eyes */}
              <circle cx="42" cy="58" r="2.2" fill="#fff" stroke="none" />
              <circle cx="58" cy="58" r="2.2" fill="#fff" stroke="none" />
              {/* Mouth */}
              <path d="M44 74 H56" />
            </svg>
            <p className="mt-4" style={{ fontSize: '12px' }}>Your cart is empty.</p>
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2.5 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" draggable={false} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate" style={{ fontSize: '12px' }}>{item.name}</p>
                <p className="text-white/70 mt-0.5" style={{ fontSize: '11px' }}>${item.price}</p>
              </div>
              <div
                className="flex items-center gap-2 px-1.5 py-1 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.18)',
                }}
              >
                <button
                  onClick={() => onUpdateQty(item.id, item.qty - 1)}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                  aria-label="Decrease"
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M5 12h14" />
                  </svg>
                </button>
                <span className="text-white font-semibold" style={{ fontSize: '11px', minWidth: '12px', textAlign: 'center' }}>
                  {item.qty}
                </span>
                <button
                  onClick={() => onUpdateQty(item.id, item.qty + 1)}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                  aria-label="Increase"
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer — subtotal + Apple Pay */}
      <div className="px-4 pt-3 pb-6 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="flex items-center justify-between text-white">
          <span style={{ fontSize: '12px', opacity: 0.8 }}>Subtotal</span>
          <span className="font-bold" style={{ fontSize: '16px' }}>${subtotal}</span>
        </div>

        {/* Apple Pay */}
        <button
          disabled={items.length === 0}
          className="w-full py-3.5 rounded-full text-white font-semibold flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98]"
          style={{
            background: '#000',
            fontSize: '14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            opacity: items.length === 0 ? 0.4 : 1,
          }}
        >
          <span style={{ fontSize: '13px' }}>Pay with</span>
          <svg width="42" height="17" viewBox="0 0 43 18" fill="white" xmlns="http://www.w3.org/2000/svg" aria-label="Apple Pay">
            <path d="M7.4 2.3c.5-.6.8-1.4.7-2.3-.7 0-1.6.5-2.1 1.1-.5.5-.9 1.3-.8 2.1.8.1 1.6-.4 2.2-.9zm.7 1.1c-1.2-.1-2.2.7-2.8.7-.6 0-1.4-.6-2.4-.6-1.2 0-2.4.7-3 1.8-1.3 2.2-.3 5.5.9 7.3.6.9 1.3 1.9 2.3 1.8.9 0 1.3-.6 2.4-.6 1.1 0 1.4.6 2.4.6 1 0 1.6-.9 2.2-1.8.7-1 1-2 1-2-.1 0-1.9-.7-1.9-2.8 0-1.7 1.4-2.6 1.5-2.6-.8-1.3-2.2-1.4-2.6-1.5z"/>
            <path d="M18.6 1.6c2.5 0 4.2 1.7 4.2 4.2 0 2.5-1.7 4.2-4.2 4.2h-2.7v4.3h-2V1.6h4.7zm-2.7 6.7h2.2c1.7 0 2.7-.9 2.7-2.5s-1-2.5-2.7-2.5h-2.2v5zM23.3 11.6c0-1.7 1.3-2.7 3.6-2.9l2.6-.2v-.7c0-1.1-.7-1.7-1.9-1.7-1.1 0-1.8.5-2 1.3h-1.8c.1-1.7 1.6-3 3.8-3 2.3 0 3.8 1.2 3.8 3.1v6.8h-1.8v-1.6h-.1c-.5 1.1-1.8 1.8-3.1 1.8-1.9 0-3.1-1.2-3.1-2.9zm6.2-.9v-.7l-2.4.2c-1.2.1-1.8.5-1.8 1.3 0 .8.7 1.4 1.7 1.4 1.3 0 2.5-.9 2.5-2.2zM32.2 17.9v-1.6c.1 0 .4 0 .6 0 .9 0 1.4-.4 1.7-1.4 0 0 .2-.6.2-.6l-3.3-9.1h2.1l2.3 7.4 2.3-7.4h2l-3.4 9.5c-.8 2.2-1.7 2.9-3.6 2.9-.1 0-.6 0-.9-.1z"/>
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes detail-in {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

/* ── Top-right cart button (glassmorphism pill) ── */
export function CartButton({ count = 0, bounce = false, onClick }) {
  return (
    <div className="absolute top-12 right-3 z-30">
      <button
        onClick={onClick}
        aria-label="Cart"
        className="relative flex items-center justify-center"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '999px',
          background: 'rgba(0,0,0,0.1)',
          backdropFilter: 'blur(52.1px)',
          WebkitBackdropFilter: 'blur(52.1px)',
          boxShadow: '0 1px 6.25px rgba(0,0,0,0.05), inset 0 -1.04px 1.04px rgba(255,255,255,0.1), inset 0 1.04px 1.04px rgba(255,255,255,0.25)',
          animation: bounce ? 'cart-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
        }}
      >
        <img src="/viewer-icons/cart.svg" alt="" style={{ width: '22px', height: '17.25px' }} />

        {/* Badge */}
        {count > 0 && (
          <span
            className="absolute flex items-center justify-center font-bold"
            style={{
              top: '-4px',
              right: '-4px',
              minWidth: '18px',
              height: '18px',
              padding: '0 5px',
              borderRadius: '999px',
              background: '#fff',
              color: '#000',
              fontSize: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              animation: 'badge-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {count}
          </span>
        )}
      </button>

      <style>{`
        @keyframes cart-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-6px) scale(1.1); }
          60% { transform: translateY(0) scale(0.95); }
        }
        @keyframes badge-pop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

/* ── 3D avatar hand — styled like a game FPS ── */
function AvatarHand({ side, walkStep }) {
  const isLeft = side === 'left'
  const swayAmount = Math.sin(walkStep * 0.3 + (isLeft ? 0.5 : 0)) * 3

  return (
    <div
      className="absolute bottom-[-20px]"
      style={{
        [isLeft ? 'left' : 'right']: '-5%',
        width: '120px',
        height: '180px',
        transform: `rotate(${isLeft ? -15 : 15}deg) translateY(${swayAmount}px)`,
        filter: 'drop-shadow(0 -8px 24px rgba(80,60,100,0.4))',
      }}
    >
      {/* Sleeve/cuff — soft sweater */}
      <div
        className="absolute bottom-0"
        style={{
          left: isLeft ? '10px' : 'auto',
          right: isLeft ? 'auto' : '10px',
          width: '90px',
          height: '80px',
          background: `
            radial-gradient(ellipse at ${isLeft ? '30% 30%' : '70% 30%'}, #fff5f8 0%, #f0dfe6 40%, #d9c3ce 100%)
          `,
          borderRadius: isLeft ? '60px 40px 40px 60px' : '40px 60px 60px 40px',
          boxShadow: `
            inset ${isLeft ? '4px' : '-4px'} 4px 10px rgba(255,255,255,0.6),
            inset ${isLeft ? '-3px' : '3px'} -4px 8px rgba(160,130,150,0.35)
          `,
        }}
      >
        {/* Knit texture pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(180,150,170,0.2) 3px, rgba(180,150,170,0.2) 4px)',
            borderRadius: 'inherit',
          }}
        />
        {/* Cuff edge */}
        <div
          className="absolute top-2 left-2 right-2 rounded-full"
          style={{
            height: '4px',
            background: 'linear-gradient(180deg, rgba(100,80,100,0.2), transparent)',
          }}
        />
      </div>

      {/* Hand — rounded and 3D */}
      <div
        className="absolute"
        style={{
          bottom: '55px',
          [isLeft ? 'left' : 'right']: '15px',
          width: '80px',
          height: '90px',
          background: `
            radial-gradient(ellipse at ${isLeft ? '25% 25%' : '75% 25%'}, #ffebd4 0%, #f5d2b0 40%, #d9a782 80%, #b8876a 100%)
          `,
          borderRadius: isLeft ? '45% 55% 50% 50% / 55% 45% 50% 50%' : '55% 45% 50% 50% / 45% 55% 50% 50%',
          boxShadow: `
            inset ${isLeft ? '5px' : '-5px'} 5px 15px rgba(255,240,220,0.6),
            inset ${isLeft ? '-4px' : '4px'} -5px 12px rgba(140,90,70,0.4),
            0 4px 12px rgba(0,0,0,0.15)
          `,
          transform: `rotate(${isLeft ? -10 : 10}deg)`,
        }}
      >
        {/* Knuckles */}
        <div
          className="absolute flex gap-1"
          style={{
            top: '15px',
            [isLeft ? 'left' : 'right']: '10px',
          }}
        >
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: '10px',
                height: '14px',
                background: 'radial-gradient(ellipse at 30% 30%, #ffd9b0 0%, #e5b088 60%, #c08860 100%)',
                boxShadow: 'inset 2px 2px 3px rgba(255,240,220,0.7), inset -1px -2px 3px rgba(120,80,60,0.4)',
              }}
            />
          ))}
        </div>

        {/* Thumb */}
        <div
          className="absolute"
          style={{
            bottom: '35px',
            [isLeft ? 'right' : 'left']: '-8px',
            width: '20px',
            height: '28px',
            background: 'radial-gradient(ellipse at 30% 30%, #ffd9b0 0%, #e5b088 60%, #c08860 100%)',
            borderRadius: '50%',
            boxShadow: 'inset 2px 2px 4px rgba(255,240,220,0.7), inset -2px -2px 4px rgba(120,80,60,0.4)',
            transform: `rotate(${isLeft ? 30 : -30}deg)`,
          }}
        />

        {/* Highlight — skin shine */}
        <div
          className="absolute rounded-full"
          style={{
            width: '20px',
            height: '30px',
            top: '10px',
            [isLeft ? 'left' : 'right']: '20px',
            background: 'radial-gradient(ellipse, rgba(255,250,240,0.7) 0%, transparent 70%)',
            filter: 'blur(4px)',
          }}
        />

        {/* Nail polish dots on knuckle tops */}
        <div
          className="absolute flex gap-1"
          style={{
            top: '10px',
            [isLeft ? 'left' : 'right']: '11px',
          }}
        >
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: '7px',
                height: '8px',
                background: 'linear-gradient(145deg, #ffd0de 0%, #f099b1 50%, #c06a86 100%)',
                boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.7), inset -1px -1px 2px rgba(100,50,70,0.3)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
