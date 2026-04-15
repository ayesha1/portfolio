import { useState, useEffect, useRef } from 'react'
import WeatherExperiment from './WeatherExperiment'
import ClosetExperiment from './ClosetExperiment'
import AIExperiment from './AIExperiment'

function PlaygroundDots({ activeExp }) {
  return (
    <div className="hidden lg:flex flex-col gap-3 fixed left-8 top-1/2 -translate-y-1/2 z-40">
      {[0, 1, 2].map(i => (
        <button
          key={i}
          onClick={() => {
            const targets = ['playground-01', 'playground-02', 'playground-03']
            const el = document.getElementById(targets[i])
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === activeExp ? '10px' : '6px',
            height: i === activeExp ? '10px' : '6px',
            backgroundColor: i === activeExp ? '#111' : '#ccc',
          }}
        />
      ))}
    </div>
  )
}

export default function PlaygroundSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [weather, setWeather] = useState('sunny')
  const [activeExp, setActiveExp] = useState(0)
  const [inSection, setInSection] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function handleScroll() {
      const section = document.getElementById('playground')
      if (!section) return
      const sRect = section.getBoundingClientRect()
      const isIn = sRect.top < window.innerHeight * 0.5 && sRect.bottom > window.innerHeight * 0.3
      setInSection(isIn)

      const e1 = document.getElementById('playground-01')
      const e2 = document.getElementById('playground-02')
      const e3 = document.getElementById('playground-03')
      if (e3 && e3.getBoundingClientRect().top < window.innerHeight * 0.5) setActiveExp(2)
      else if (e2 && e2.getBoundingClientRect().top < window.innerHeight * 0.5) setActiveExp(1)
      else setActiveExp(0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="playground" className="relative bg-white">
      {inSection && <PlaygroundDots activeExp={activeExp} />}
      <div id="playground-01" ref={ref} className="min-h-screen flex items-center py-20">
        <div
          className="flex items-center gap-12 lg:gap-20 max-w-[1400px] mx-auto px-8 transition-all duration-1000"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(60px)',
          }}
        >
          {/* Left — experiment info */}
          <div className="flex-shrink-0 max-w-[280px]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-2">Playground</p>
            <h2 className="font-serif text-2xl lg:text-3xl text-gray-900 leading-tight mb-3">Design Experiments</h2>
            <p className="text-[13px] text-gray-400 leading-relaxed mb-8">
              A collection of explorations in interaction, motion, and visual design.
            </p>
            <span className="text-[10px] font-mono text-gray-300 block mb-2">01</span>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Neumorphic meets soft 3D</h3>
            <p className="text-[13px] text-gray-400 leading-relaxed mb-5">
              Neumorphic UI meets dimensional design. Interactive 3D weather elements respond to forecast data with smooth transitions.
            </p>
            <div className="flex gap-2 flex-wrap">
              {['Neumorphism', '3D CSS', 'Interaction'].map(tag => (
                <span key={tag} className="text-[11px] text-gray-400 border border-gray-200 px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>

          {/* Center — 3D floating elements (reactive to weather) */}
          <div className="hidden lg:flex flex-shrink-0 w-[160px] h-[300px] items-center justify-center relative overflow-visible">
            {/* Sun */}
            <div
              className="absolute top-[25%] right-[10%] transition-all duration-700"
              style={{
                animation: 'float 4s ease-in-out infinite',
                opacity: weather === 'sunny' ? 1 : weather === 'partly-cloudy' ? 0.6 : 0,
                transform: weather === 'sunny' ? 'scale(1)' : weather === 'partly-cloudy' ? 'scale(0.7)' : 'scale(0.3)',
              }}
            >
              <div className="w-[60px] h-[60px] rounded-full" style={{
                background: 'radial-gradient(circle at 35% 35%, #fde68a, #f59e0b)',
                boxShadow: '0 0 40px rgba(251,191,36,0.3)',
              }} />
            </div>

            {/* Cloud */}
            <div
              className="absolute top-[40%] right-[5%] transition-all duration-700"
              style={{
                animation: 'float 5s ease-in-out 1s infinite',
                opacity: weather === 'cloudy' || weather === 'partly-cloudy' || weather === 'rainy' ? 1 : 0,
                transform: weather === 'cloudy' || weather === 'rainy' ? 'scale(1)' : weather === 'partly-cloudy' ? 'scale(0.8)' : 'scale(0.3)',
              }}
            >
              <div className="relative" style={{ width: '80px', height: '55px' }}>
                <div className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-700" style={{
                  height: '35px',
                  background: weather === 'rainy'
                    ? 'linear-gradient(145deg, #94a3b8, #64748b)'
                    : 'linear-gradient(145deg, #f1f5f9, #e2e8f0)',
                  boxShadow: '0 4px 16px rgba(226,232,240,0.5), inset 2px 2px 4px rgba(255,255,255,0.8)',
                }} />
                <div className="absolute rounded-full transition-all duration-700" style={{
                  width: '32px', height: '32px', top: '0px', left: '12px',
                  background: weather === 'rainy'
                    ? 'linear-gradient(145deg, #94a3b8, #64748b)'
                    : 'linear-gradient(145deg, #f1f5f9, #e2e8f0)',
                }} />
                <div className="absolute rounded-full transition-all duration-700" style={{
                  width: '24px', height: '24px', top: '6px', left: '40px',
                  background: weather === 'rainy'
                    ? 'linear-gradient(145deg, #94a3b8, #64748b)'
                    : 'linear-gradient(145deg, #f1f5f9, #e2e8f0)',
                }} />
              </div>
            </div>

            {/* Rain drops */}
            <div
              className="absolute top-[65%] right-[15%] flex gap-2 transition-opacity duration-700"
              style={{ opacity: weather === 'rainy' ? 1 : 0 }}
            >
              {[0, 1, 2].map(i => (
                <div key={i} className="w-[6px] h-[10px] rounded-full bg-blue-300" style={{ animation: `rainFloat 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>

            {/* Sun rays for sunny */}
            {weather === 'sunny' && [0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <div
                key={deg}
                className="absolute w-[3px] h-[12px] rounded-full transition-opacity duration-700"
                style={{
                  background: 'linear-gradient(to bottom, #fbbf24, transparent)',
                  top: 'calc(25% + 30px)',
                  right: 'calc(10% + 30px)',
                  transformOrigin: '50% -20px',
                  transform: `rotate(${deg}deg)`,
                  opacity: 0.5,
                }}
              />
            ))}
          </div>

          {/* Right — weather card */}
          <div className="flex-1 flex justify-center">
            <WeatherExperiment visible={visible} onConditionChange={setWeather} />
          </div>
        </div>
      </div>

      <Experiment02 />
      <Experiment03 />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes rainFloat {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(8px); opacity: 0.3; }
        }
      `}</style>
    </section>
  )
}

function Experiment02() {
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
    <div id="playground-02" ref={ref} className="min-h-screen flex items-center py-20">
      <ClosetExperiment visible={visible} />
    </div>
  )
}

function Experiment03() {
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
    <div id="playground-03" ref={ref} className="min-h-screen flex items-center py-20">
      <AIExperiment visible={visible} />
    </div>
  )
}
