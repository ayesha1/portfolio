import { useState, useEffect, useRef, useCallback } from 'react'

function GlassRipple() {
  const canvasRef = useRef(null)
  const ripples = useRef([])
  const lastPos = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  const addRipple = useCallback((x, y) => {
    ripples.current.push({
      x, y,
      radius: 0,
      maxRadius: 120,
      opacity: 0.35,
      birth: performance.now(),
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      const section = canvas.parentElement
      canvas.width = section.offsetWidth
      canvas.height = section.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function handleMouseMove(e) {
      const rect = canvas.parentElement.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Only add ripple if cursor is inside hero and moved enough
      if (y >= 0 && y <= rect.height && x >= 0 && x <= rect.width) {
        const dx = x - lastPos.current.x
        const dy = y - lastPos.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 40) {
          addRipple(x, y)
          lastPos.current = { x, y }
        }
      }
    }

    function animate() {
      const now = performance.now()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ripples.current = ripples.current.filter(r => {
        const age = now - r.birth
        const duration = 1200
        if (age > duration) return false

        const progress = age / duration
        const eased = 1 - Math.pow(1 - progress, 3)

        r.radius = eased * r.maxRadius
        const currentOpacity = r.opacity * (1 - progress)

        // Outer ring
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.8})`
        ctx.lineWidth = 2
        ctx.stroke()

        // Inner glow ring
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius * 0.7, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.4})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Radial glow fill
        const gradient = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, r.radius)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.08})`)
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${currentOpacity * 0.04})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        return true
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [addRipple])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[5] pointer-events-none"
      style={{ mixBlendMode: 'overlay' }}
    />
  )
}

export default function HeroSection() {
  const [show, setShow] = useState(false)
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let mounted = true
    const timer = setTimeout(() => {
      if (mounted && window.scrollY <= 100) setShowScroll(true)
    }, 4000)

    function handleScroll() {
      if (window.scrollY > 100) setShowScroll(false)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      mounted = false
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section id="hero" className="min-h-screen relative flex items-center justify-center px-6 md:px-16 pt-24 pb-16 overflow-hidden">
      {/* Video background — 3D glass flower */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-flower.mp4" type="video/mp4" />
        </video>
        {/* Bottom fade — blends video into the section below */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[250px] pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, #ffffff 100%)',
          }}
        />
      </div>

      {/* Glass ripple effect */}
      <GlassRipple />

      {/* Heading — positioned bottom-right, fades in after delay */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-end justify-end min-h-[60vh] pr-4 md:pr-12">
        <div
          className="relative transition-all duration-1000 ease-out"
          style={{
            opacity: show ? 1 : 0,
            transform: show ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {/* Feathered blur layer behind the text */}
          <div
            className="absolute inset-0 backdrop-blur-[4px] pointer-events-none"
            style={{
              maskImage: 'radial-gradient(ellipse 100% 100% at center, black 30%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at center, black 30%, transparent 75%)',
              margin: '-30px',
              padding: '30px',
              borderRadius: '40px',
            }}
          />
          <h1 className="relative font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.15] text-white tracking-tight text-right max-w-[520px] drop-shadow-[0_2px_15px_rgba(0,0,0,0.06)]">
            I'm Ayesha, a product
            <br />
            designer who{' '}
            <em className="italic">builds.</em>
          </h1>
        </div>
      </div>
      {/* Scroll down indicator */}
      <button
        onClick={() => {
          const cs = document.getElementById('case-studies')
          if (cs) cs.scrollIntoView({ behavior: 'smooth' })
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[50] flex flex-col items-center gap-1.5 transition-all duration-700 backdrop-blur-md bg-black/15 px-5 py-3 rounded-full"
        style={{
          opacity: showScroll ? 1 : 0,
          transform: showScroll ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(10px)',
          pointerEvents: showScroll ? 'auto' : 'none',
        }}
      >
        <span className="text-[11px] tracking-widest uppercase font-medium" style={{ color: '#ffffff' }}>Scroll</span>
        <div className="w-[22px] h-[36px] rounded-full flex justify-center pt-1.5" style={{ border: '2px solid #ffffff' }}>
          <div className="w-[3px] h-[8px] rounded-full animate-bounce" style={{ backgroundColor: '#ffffff' }} />
        </div>
      </button>
    </section>
  )
}
