import { useState, useEffect } from 'react'
import PhoneMockup from './PhoneMockup'

function RecordingWave({ isActive }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setPhase(p => p + 0.08)
    }, 50)
    return () => clearInterval(interval)
  }, [isActive])

  const generateWavePath = (amplitude, frequency, phaseOffset, yOffset) => {
    const width = 200
    const points = []
    for (let x = 0; x <= width; x += 2) {
      const normalX = x / width
      const envelope = Math.sin(normalX * Math.PI) ** 1.5
      const y = yOffset +
        envelope * amplitude * Math.sin(normalX * frequency + phase + phaseOffset) +
        envelope * (amplitude * 0.4) * Math.sin(normalX * frequency * 1.8 + phase * 1.3 + phaseOffset)
      points.push(`${x},${y}`)
    }
    return `M${points[0]} ${points.slice(1).map(p => `L${p}`).join(' ')}`
  }

  const waves = [
    { color: 'rgba(139, 141, 245, 0.7)', amplitude: isActive ? 15 : 3, frequency: 8, phaseOffset: 0, yOffset: 24 },
    { color: 'rgba(180, 140, 240, 0.55)', amplitude: isActive ? 12 : 2, frequency: 10, phaseOffset: 1.5, yOffset: 24 },
    { color: 'rgba(165, 214, 245, 0.6)', amplitude: isActive ? 13 : 2, frequency: 7, phaseOffset: 3, yOffset: 24 },
    { color: 'rgba(170, 232, 195, 0.55)', amplitude: isActive ? 11 : 2, frequency: 9, phaseOffset: 4.5, yOffset: 24 },
    { color: 'rgba(230, 160, 210, 0.5)', amplitude: isActive ? 10 : 2, frequency: 11, phaseOffset: 2.2, yOffset: 24 },
  ]

  return (
    <div className="w-full" style={{ height: '32px' }}>
      <svg width="100%" height="32" viewBox="0 0 200 48" preserveAspectRatio="none">
        {waves.map((wave, i) => (
          <path
            key={i}
            d={generateWavePath(wave.amplitude, wave.frequency, wave.phaseOffset, wave.yOffset)}
            fill="none"
            stroke={wave.color}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  )
}

/* Slide-up bottom card for Recording Tips */
function TipsCard({ visible, onDismiss }) {
  return (
    <>
      <div
        className="absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(96, 103, 241, 0.6)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
        }}
        onClick={onDismiss}
      />
      <div
        className="absolute left-0 right-0 bottom-0 z-40 transition-transform duration-400 ease-out"
        style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="bg-[#f0f1fb] rounded-t-[24px] px-4 pt-1 pb-3 flex flex-col items-center"
          style={{ boxShadow: '0 -4px 26px rgba(0,0,0,0.06)' }}
        >
          <div
            className="w-[48px] h-[48px] rounded-full flex items-center justify-center -mt-7 mb-1.5 border-[3px] border-white"
            style={{ background: 'linear-gradient(145deg, #3b4465, #5d5e73)' }}
          >
            <svg width="18" height="22" viewBox="0 0 24 28" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 24h6" />
              <path d="M12 24v-3" />
              <path d="M12 3a7 7 0 0 1 7 7c0 3.5-2 6-3.5 8S14 21 14 21h-4s-.5-1-2-3S5 13.5 5 10a7 7 0 0 1 7-7z" />
              <circle cx="12" cy="11" r="2" fill="white" stroke="none" />
            </svg>
          </div>
          <p className="text-[11px] font-semibold text-[#3b4465] mb-2" style={{ fontFamily: "'Sarabun', sans-serif" }}>
            Recording Tips
          </p>
          <div className="w-full space-y-1.5 mb-3 px-1">
            {['Record in a quiet area', 'Speak clearly in your natural voice', "For best results read FAQ's for tips"].map((tip) => (
              <div key={tip} className="flex items-center gap-2">
                <div className="w-[5px] h-[5px] rounded-full bg-[#6067f1] flex-shrink-0" />
                <p className="text-[10px] text-[#7d7f9c]" style={{ fontFamily: "'Sarabun', sans-serif" }}>{tip}</p>
              </div>
            ))}
          </div>
          <button
            onClick={onDismiss}
            className="w-full py-2.5 rounded-full text-white text-[9px] font-semibold uppercase tracking-wider"
            style={{
              background: 'linear-gradient(145deg, #5f69ef, #8685f1)',
              boxShadow: '0 8px 18px rgba(99, 98, 237, 0.3)',
              fontFamily: "'Sarabun', sans-serif",
            }}
          >
            Thanks, got it
          </button>
        </div>
      </div>
    </>
  )
}

/* Slide-up bottom card for Alert/Paused state */
function AlertCard({ visible, onResume, onDelete }) {
  return (
    <>
      <div
        className="absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(96, 103, 241, 0.6)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
        }}
      />
      <div
        className="absolute left-0 right-0 bottom-0 z-40 transition-transform duration-400 ease-out"
        style={{ transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="bg-[#f0f1fb] rounded-t-[24px] px-4 pt-1 pb-3 flex flex-col items-center"
          style={{ boxShadow: '0 -4px 26px rgba(0,0,0,0.06)' }}
        >
          <div
            className="w-[48px] h-[48px] rounded-full flex items-center justify-center -mt-7 mb-1.5 border-[3px] border-white"
            style={{ background: 'linear-gradient(145deg, #3b4465, #5d5e73)' }}
          >
            <div className="flex gap-1">
              <div className="w-[3px] h-[14px] bg-white rounded-sm" />
              <div className="w-[3px] h-[14px] bg-white rounded-sm" />
            </div>
          </div>
          <p className="text-[11px] font-semibold text-[#3b4465] mb-0.5" style={{ fontFamily: "'Sarabun', sans-serif" }}>
            Alert
          </p>
          <p className="text-[9px] text-[#7d7f9c] mb-3" style={{ fontFamily: "'Sarabun', sans-serif" }}>
            Your recording has been paused
          </p>
          <button
            onClick={onDelete}
            className="w-full py-2.5 rounded-full text-white text-[9px] font-semibold uppercase tracking-wider mb-1.5"
            style={{
              background: 'linear-gradient(145deg, #5f69ef, #8685f1)',
              boxShadow: '0 8px 18px rgba(99, 98, 237, 0.3)',
              fontFamily: "'Sarabun', sans-serif",
            }}
          >
            Delete Recording
          </button>
          <button
            onClick={onResume}
            className="text-[10px] text-[#6067f1] font-medium py-0.5"
            style={{ fontFamily: "'Sarabun', sans-serif" }}
          >
            Resume
          </button>
        </div>
      </div>
    </>
  )
}

const MAX_TIME = 90

const prompts = [
  'Describe your immediate surroundings in detail.',
  'Describe your favorite holiday, person, place, or travel experience.',
  'Describe the events of your typical day from morning to night.',
]

export default function VRIScreen({ isVisible = false }) {
  const [recording, setRecording] = useState(false)
  const [time, setTime] = useState(0)
  const [started, setStarted] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [activePrompt, setActivePrompt] = useState(0)

  // Auto-start recording when card scrolls into view
  useEffect(() => {
    if (isVisible && !started) {
      const timer = setTimeout(() => {
        setStarted(true)
        setRecording(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isVisible, started])

  // Timer
  useEffect(() => {
    if (!recording) return
    if (time >= MAX_TIME) {
      setRecording(false)
      return
    }
    const interval = setInterval(() => setTime(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [recording, time])

  // Show hint ripple on lightbulb after 3s of recording
  useEffect(() => {
    if (!recording) return
    const timer = setTimeout(() => setShowHint(true), 3000)
    return () => clearTimeout(timer)
  }, [recording])

  // Cycle prompts every 10 seconds while recording
  useEffect(() => {
    if (!recording) return
    const interval = setInterval(() => {
      setActivePrompt(p => (p + 1) % prompts.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [recording])

  const mins = String(Math.floor(time / 60)).padStart(2, '0')
  const secs = String(time % 60).padStart(2, '0')
  const progress = time / MAX_TIME

  const headerTitle = started ? 'Recording' : 'Start Session'
  const mainTitle = started ? 'Keep Talking' : 'Start Recording'
  const statusText = recording ? 'Recording...' : started ? (time >= MAX_TIME ? 'Complete!' : 'Paused') : 'Ready to Record'

  function handlePauseClick() {
    if (!started) {
      setStarted(true)
      setRecording(true)
      return
    }
    if (recording) {
      setRecording(false)
      setShowAlert(true)
    }
  }

  function handleResume() {
    setShowAlert(false)
    setRecording(true)
  }

  function handleDelete() {
    setShowAlert(false)
    setTime(0)
    setStarted(false)
    setRecording(false)
    setActivePrompt(0)
  }

  const radius = 26
  const circumference = 2 * Math.PI * radius

  return (
    <PhoneMockup>
      <div className="w-full h-full relative overflow-hidden flex flex-col" style={{ fontFamily: "'Sarabun', system-ui, sans-serif", background: '#f7f9ff' }}>

        {/* Purple gradient header — fixed height band at top */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: '135px',
            background: 'linear-gradient(145deg, #5f69ef 40%, #8685f1 75%)',
          }}
        />

        {/* Status bar */}
        <div className="relative z-20 flex items-center justify-between px-4 pt-3 text-white">
          <span className="text-[8px] font-semibold opacity-90">9:41</span>
          <div className="flex items-center gap-1 opacity-80">
            <svg width="10" height="8" viewBox="0 0 16 12" fill="white"><path d="M1 8h2v4H1zM5 5h2v7H5zM9 3h2v9H9zM13 0h2v12h-2z"/></svg>
            <svg width="10" height="8" viewBox="0 0 16 12" fill="white"><path d="M8 2C5.8 2 3.7 2.7 2 4l1.3 1.3C4.7 4.1 6.3 3.5 8 3.5s3.3.6 4.7 1.8L14 4c-1.7-1.3-3.8-2-6-2zm0 4c-1.3 0-2.5.5-3.5 1.3L6 8.7c.5-.5 1.2-.7 2-.7s1.5.2 2 .7l1.5-1.4C10.5 6.5 9.3 6 8 6zm0 4c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z"/></svg>
            <svg width="16" height="8" viewBox="0 0 25 12" fill="white"><rect x="0" y="1" width="20" height="10" rx="2" stroke="white" strokeWidth="1" fill="none"/><rect x="2" y="3" width="14" height="6" rx="1" fill="white"/><rect x="21" y="4" width="3" height="4" rx="1" fill="white" opacity="0.5"/></svg>
          </div>
        </div>

        {/* Header title + back arrow */}
        <div className="relative z-20 flex items-center justify-center px-4 pt-2 pb-5">
          <svg className="absolute left-4" width="12" height="10" viewBox="0 0 16 14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M14 7H2M2 7L7 2M2 7L7 12" />
          </svg>
          <p className="text-[15px] font-medium text-white tracking-wide">{headerTitle}</p>
        </div>

        {/* White card — the main content area, overlapping the purple header */}
        <div
          className="relative z-10 mx-0 flex flex-col items-center bg-white overflow-hidden"
          style={{
            borderRadius: '26px',
            boxShadow: '0 4px 20px rgba(111, 118, 242, 0.15)',
            height: 'calc(100% - 200px)',
            marginTop: '0px',
          }}
        >
          {/* Single prompt with transition */}
          <div className="w-full px-5 pt-4 pb-1">
            <div className="flex items-start gap-2 min-h-[42px]">
              <div className="w-[6px] h-[6px] rounded-full bg-[#6067f1] mt-[5px] flex-shrink-0" />
              <p
                key={activePrompt}
                className="text-[11px] text-[#5d5e73] leading-[17px] font-medium"
                style={{
                  animation: 'fadeInPrompt 0.4s ease-out',
                  letterSpacing: '0.06px',
                }}
              >
                {prompts[activePrompt]}
              </p>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2 mb-1">
            {prompts.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activePrompt ? '9px' : '6px',
                  height: i === activePrompt ? '9px' : '6px',
                  backgroundColor: i === activePrompt ? '#6067f1' : '#ced0e2',
                }}
              />
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Keep Talking / Start Recording */}
          <p className="text-[16px] font-medium text-[#3b4465] mb-1">{mainTitle}</p>

          {/* Status text */}
          <p className="text-[8px] text-[#7d7f9c] mb-1.5 font-medium">{statusText}</p>

          {/* Timer */}
          <p className="text-[24px] text-[#3b4465] font-normal tracking-wide mb-1">
            {mins}:{secs}
          </p>

          {/* Recording waves */}
          <RecordingWave isActive={recording} />

          <div className="flex-1 min-h-1" />
        </div>

        {/* Bottom controls — OUTSIDE the white card, on the background */}
        <div className="relative z-20 flex items-center justify-between w-full px-6 mt-auto pb-6">
          {/* Lightbulb */}
          <div className="relative">
            <button
              onClick={() => { setShowTips(true); setShowHint(false) }}
              className="w-[30px] h-[30px] rounded-full border border-[#ced0e2] flex items-center justify-center bg-white/60 relative z-10"
            >
              <svg width="14" height="16" viewBox="0 0 24 24" fill="none" stroke="#6067f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7z" />
              </svg>
            </button>
            {showHint && (
              <>
                <div className="absolute inset-[-4px] rounded-full border-2 border-[#6067f1]/30 pointer-events-none" style={{ animation: 'hintRipple 2s ease-out infinite' }} />
                <div className="absolute inset-[-4px] rounded-full border-2 border-[#6067f1]/30 pointer-events-none" style={{ animation: 'hintRipple 2s ease-out 0.6s infinite' }} />
              </>
            )}
          </div>

          {/* Record / Pause button */}
          <button onClick={handlePauseClick} className="relative w-[68px] h-[68px] flex items-center justify-center -mt-2">
            <svg className="absolute inset-0 -rotate-90" width="68" height="68" viewBox="0 0 68 68">
              <circle cx="34" cy="34" r="31" fill="none" stroke="#ddddef" strokeWidth="3" />
              <circle
                cx="34" cy="34" r="31"
                fill="none"
                stroke="#6067f1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 31}
                strokeDashoffset={2 * Math.PI * 31 * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div
              className="w-[46px] h-[46px] rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(145deg, #5f69ef, #8685f1)' }}
            >
              {started ? (
                <div className="flex gap-[4px]">
                  <div className="w-[3.5px] h-[14px] bg-white rounded-sm" />
                  <div className="w-[3.5px] h-[14px] bg-white rounded-sm" />
                </div>
              ) : (
                <svg width="14" height="16" viewBox="0 0 14 16" fill="white">
                  <path d="M2 1v14l11-7L2 1z" />
                </svg>
              )}
            </div>
          </button>

          {/* Close */}
          <button className="w-[30px] h-[30px] rounded-full border border-[#ced0e2] flex items-center justify-center bg-white/60">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7d7f9c" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Slide-up cards */}
        {showTips && <TipsCard visible={showTips} onDismiss={() => setShowTips(false)} />}
        {showAlert && <AlertCard visible={showAlert} onResume={handleResume} onDelete={handleDelete} />}

        {/* CSS animation for prompt transitions */}
        <style>{`
          @keyframes fadeInPrompt {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes hintRipple {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        `}</style>
      </div>
    </PhoneMockup>
  )
}
