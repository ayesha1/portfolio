import { useState } from 'react'

const days = [
  { day: 'Mon', temp: 72, condition: 'sunny', high: 75, low: 62 },
  { day: 'Tue', temp: 68, condition: 'partly-cloudy', high: 70, low: 58 },
  { day: 'Wed', temp: 65, condition: 'cloudy', high: 67, low: 55 },
  { day: 'Thu', temp: 70, condition: 'rainy', high: 73, low: 60 },
  { day: 'Fri', temp: 74, condition: 'sunny', high: 76, low: 64 },
]

/* ── 3D Weather Scenes ── */

function Sun3D({ active }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="absolute rounded-full transition-all duration-700"
        style={{
          width: '80px', height: '80px',
          background: 'radial-gradient(circle at 35% 35%, #fde68a, #f59e0b)',
          boxShadow: '0 0 50px rgba(251,191,36,0.4), 0 0 100px rgba(251,191,36,0.15), inset -6px -6px 16px rgba(234,179,8,0.3)',
          transform: active ? 'scale(1)' : 'scale(0.3)',
          opacity: active ? 1 : 0,
        }}
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <div
          key={deg}
          className="absolute rounded-full transition-all duration-700"
          style={{
            width: '3px', height: '14px',
            background: 'linear-gradient(to bottom, #fbbf24, transparent)',
            top: '50%', left: '50%',
            transformOrigin: '50% -25px',
            transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-48px)`,
            opacity: active ? 0.5 : 0,
            transitionDelay: `${i * 40}ms`,
          }}
        />
      ))}
    </div>
  )
}

function Clouds3D({ active, dark }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="absolute transition-all duration-700"
        style={{
          width: '100px', height: '70px',
          transform: active ? 'scale(1)' : 'scale(0.3)',
          opacity: active ? 1 : 0,
        }}
      >
        {/* Bottom body */}
        <div className="absolute bottom-0 left-0 right-0" style={{
          height: '40px', borderRadius: '22px',
          background: dark ? 'linear-gradient(145deg, #94a3b8, #64748b)' : 'linear-gradient(145deg, #f1f5f9, #e2e8f0)',
          boxShadow: dark
            ? '0 6px 24px rgba(100,116,139,0.35), inset 2px 2px 6px rgba(148,163,184,0.3)'
            : '0 6px 24px rgba(226,232,240,0.5), inset 2px 2px 6px rgba(255,255,255,0.8)',
        }} />
        {/* Top bumps */}
        <div className="absolute rounded-full" style={{
          width: '42px', height: '42px', top: '0px', left: '14px',
          background: dark ? 'linear-gradient(145deg, #94a3b8, #64748b)' : 'linear-gradient(145deg, #f1f5f9, #e2e8f0)',
        }} />
        <div className="absolute rounded-full" style={{
          width: '32px', height: '32px', top: '8px', right: '18px',
          background: dark ? 'linear-gradient(145deg, #94a3b8, #64748b)' : 'linear-gradient(145deg, #f1f5f9, #e2e8f0)',
        }} />
      </div>
    </div>
  )
}

function Rain3D({ active }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="absolute w-[100px] h-[70px]" style={{ top: '25%', left: '50%', transform: 'translateX(-50%)' }}>
        <Clouds3D active={active} dark />
      </div>
      {active && Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="absolute" style={{
          width: '2px', height: `${10 + Math.random() * 8}px`,
          background: 'linear-gradient(to bottom, rgba(147,197,253,0.7), transparent)',
          borderRadius: '2px',
          left: `${18 + i * 7}%`, top: '55%',
          animation: `rainDrop ${0.5 + Math.random() * 0.3}s linear ${i * 0.07}s infinite`,
        }} />
      ))}
    </div>
  )
}

function PartlyCloudy3D({ active }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute transition-all duration-700" style={{
        width: '50px', height: '50px', borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #fde68a, #f59e0b)',
        boxShadow: '0 0 30px rgba(251,191,36,0.25)',
        top: '15%', left: '18%',
        transform: active ? 'scale(1)' : 'scale(0.3)', opacity: active ? 0.7 : 0,
      }} />
      <div className="absolute transition-all duration-700" style={{ top: '25%', right: '8%', transitionDelay: '100ms' }}>
        <div style={{
          width: '80px', height: '40px', borderRadius: '22px',
          background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
          boxShadow: '0 5px 20px rgba(226,232,240,0.4), inset 2px 2px 5px rgba(255,255,255,0.8)',
          transform: active ? 'scale(1)' : 'scale(0.3)', opacity: active ? 1 : 0, transition: 'all 0.7s ease',
        }}>
          <div className="absolute rounded-full" style={{ width: '35px', height: '35px', top: '-15px', left: '12px', background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)' }} />
        </div>
      </div>
    </div>
  )
}

function WeatherScene({ condition, active }) {
  if (condition === 'sunny') return <Sun3D active={active} />
  if (condition === 'cloudy') return <Clouds3D active={active} />
  if (condition === 'rainy') return <Rain3D active={active} />
  if (condition === 'partly-cloudy') return <PartlyCloudy3D active={active} />
  return <Sun3D active={active} />
}

function SmallIcon({ condition, size = 16 }) {
  if (condition === 'sunny') return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" fill="#fbbf24"/><g stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></g></svg>
  if (condition === 'cloudy') return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M6 19h12a5 5 0 0 0 0-10h-.5A6 6 0 0 0 6 12v1a4 4 0 0 0 0 6z" fill="#cbd5e1"/></svg>
  if (condition === 'rainy') return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M6 14h12a5 5 0 0 0 0-10h-.5A6 6 0 0 0 6 7v1a4 4 0 0 0 0 6z" fill="#94a3b8"/><line x1="8" y1="17" x2="7" y2="21" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="17" x2="11" y2="21" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/><line x1="16" y1="17" x2="15" y2="21" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/></svg>
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="8" cy="8" r="3.5" fill="#fbbf24"/><path d="M6 18h12a4 4 0 0 0 0-8h-.5A5.5 5.5 0 0 0 7 12.5V13a3 3 0 0 0-1 5.83" fill="#e2e8f0"/></svg>
}

const neu = {
  raised: '8px 8px 16px rgba(0,0,0,0.07), -8px -8px 16px rgba(255,255,255,0.85)',
  pressed: 'inset 4px 4px 8px rgba(0,0,0,0.06), inset -4px -4px 8px rgba(255,255,255,0.7)',
  button: '3px 3px 6px rgba(0,0,0,0.05), -3px -3px 6px rgba(255,255,255,0.8)',
}

export default function WeatherExperiment({ visible, onConditionChange }) {
  const [activeDay, setActiveDay] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const current = days[activeDay]

  function selectDay(i) {
    if (i === activeDay) return
    setTransitioning(true)
    setTimeout(() => {
      setActiveDay(i)
      if (onConditionChange) onConditionChange(days[i].condition)
      setTimeout(() => setTransitioning(false), 50)
    }, 300)
  }

  return (
    <div
      className="flex flex-col items-center transition-all duration-1000"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(60px)' }}
    >
      {/* Weather card — centered */}
      <div
        className="w-[380px] rounded-[36px] p-8 relative"
        style={{ background: 'linear-gradient(145deg, #f0f0f3, #e6e6ea)', boxShadow: neu.raised }}
      >
        {/* Location */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-[18px] font-semibold text-gray-800">San Francisco</h4>
            <p className="text-[11px] text-gray-400">California, US</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ boxShadow: neu.button, background: '#ececf0' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>

        {/* Main temp + 3D scene */}
        <div className="rounded-[24px] p-5 mb-5 flex items-center" style={{ background: 'linear-gradient(145deg, #e8e8ec, #f4f4f8)', boxShadow: neu.pressed, minHeight: '150px' }}>
          <div className="flex-shrink-0">
            <p className="text-[52px] font-light text-gray-800 leading-none">{current.temp}°</p>
            <p className="text-[11px] text-gray-400 mt-1">H:{current.high}° L:{current.low}°</p>
            <p className="text-[11px] text-gray-500 mt-1 capitalize">{current.condition.replace('-', ' ')}</p>
          </div>
          <div className="flex-1 h-[120px] relative">
            <WeatherScene condition={current.condition} active={!transitioning} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-5">
          {[
            { label: 'Wind', value: '12 mph', icon: '💨' },
            { label: 'Humidity', value: '54%', icon: '💧' },
            { label: 'UV', value: 'Low', icon: '☀️' },
          ].map(stat => (
            <div key={stat.label} className="flex-1 rounded-2xl p-3 text-center" style={{ background: '#ededf1', boxShadow: neu.button }}>
              <span className="text-[14px] block mb-0.5">{stat.icon}</span>
              <p className="text-[13px] font-semibold text-gray-700">{stat.value}</p>
              <p className="text-[10px] text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Forecast */}
        <div className="flex gap-2">
          {days.map((d, i) => (
            <button
              key={d.day}
              onClick={() => selectDay(i)}
              className="flex-1 rounded-2xl py-3 flex flex-col items-center gap-1.5 transition-all duration-200"
              style={{ background: i === activeDay ? '#e8e8ec' : '#ededf1', boxShadow: i === activeDay ? neu.pressed : neu.button }}
            >
              <span className="text-[10px] font-medium text-gray-400">{d.day}</span>
              <SmallIcon condition={d.condition} size={16} />
              <span className="text-[12px] font-semibold text-gray-700">{d.temp}°</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes rainDrop {
          0% { transform: translateY(0); opacity: 0.7; }
          100% { transform: translateY(35px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
