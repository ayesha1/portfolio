import { useState, useEffect, useRef } from 'react'

const cardColors = {
  chatbot: { bg: 'rgba(128,90,160,0.35)', border: 'rgba(128,90,160,0.4)' },
  images: { bg: 'rgba(60,80,90,0.3)', border: 'rgba(60,80,90,0.35)' },
  vri: { bg: 'rgba(96,103,241,0.35)', border: 'rgba(96,103,241,0.4)' },
  project: { bg: 'rgba(180,140,170,0.35)', border: 'rgba(180,140,170,0.4)' },
}

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const [onCard, setOnCard] = useState(false)
  const [cardType, setCardType] = useState(null)
  const [onHero, setOnHero] = useState(false)
  const [hidden, setHidden] = useState(false)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const raf = useRef(null)

  useEffect(() => {
    const hide = () => setHidden(true)
    const show = () => setHidden(false)
    window.addEventListener('custom-cursor-hide', hide)
    window.addEventListener('custom-cursor-show', show)
    return () => {
      window.removeEventListener('custom-cursor-hide', hide)
      window.removeEventListener('custom-cursor-show', show)
    }
  }, [])

  useEffect(() => {
    function handleMouseMove(e) {
      target.current = { x: e.clientX, y: e.clientY }
    }

    function handleMouseOver(e) {
      const card = e.target.closest('[data-card]')
      if (card) {
        setOnCard(true)
        setCardType(card.getAttribute('data-card-type'))
      } else {
        setOnCard(false)
        setCardType(null)
      }
      // Check if over hero section
      const hero = e.target.closest('#hero')
      setOnHero(!!hero)
    }

    function animate() {
      pos.current.x += (target.current.x - pos.current.x) * 0.15
      pos.current.y += (target.current.y - pos.current.y) * 0.15

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`
      }
      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  const colors = cardType && cardColors[cardType] ? cardColors[cardType] : { bg: 'rgba(180,140,170,0.35)', border: 'rgba(180,140,170,0.4)' }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        willChange: 'transform',
        opacity: hidden ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      <div
        className="rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          width: onCard ? '60px' : '12px',
          height: onCard ? '60px' : '12px',
          background: onCard
            ? `radial-gradient(circle, ${colors.bg} 0%, transparent 70%)`
            : onHero ? 'rgba(255, 255, 255, 0.8)' : 'rgba(180, 140, 170, 0.5)',
          border: onCard ? `1.5px solid ${colors.border}` : 'none',
          transition: 'width 0.4s cubic-bezier(0.23,1,0.32,1), height 0.4s cubic-bezier(0.23,1,0.32,1), background 0.3s ease, border 0.3s ease',
          backdropFilter: onCard ? 'blur(2px)' : 'none',
        }}
      />
    </div>
  )
}
