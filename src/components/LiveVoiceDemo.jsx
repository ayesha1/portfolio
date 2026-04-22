import { useState, useEffect, useRef } from 'react'
import PhoneMockup from './PhoneMockup'

/* Live voice demo — listens to the mic locally, shows wave reacting
 * to the user's voice, and gives "too quiet" / "too loud" feedback.
 * Nothing is recorded or stored. Audio is analyzed in-browser and
 * discarded as soon as the stream stops.
 */

const BLUE = '#6067F1'
const PURPLE = '#8685F1'
const DARK = '#3B4465'
const GRAY = '#7D7F9C'

// level thresholds (0–255 scale from getByteFrequencyData average)
const QUIET_THRESHOLD = 14
const LOUD_THRESHOLD = 130
const SUCCESS_SECONDS = 20 // shortened for the portfolio prototype
const BAD_LEVEL_SECONDS = 5 // reject after 5 consecutive seconds of silence OR clipping

const UPLOAD_PHASES = [
  { title: 'Uploading your', emphasis: 'voice',     gradient: 'linear-gradient(160deg, #79d6aa 0%, #7bd3b2 40%, #c8aecf 100%)' },
  { title: 'Uploading your', emphasis: 'recording', gradient: 'linear-gradient(160deg, #e48a90 0%, #d9a2b0 55%, #c4a4c9 100%)' },
  { title: 'Uploading your', emphasis: 'recording', gradient: 'linear-gradient(160deg, #bf9df7 0%, #a89af3 55%, #8c96ea 100%)' },
  { title: 'Getting',        emphasis: 'close!',    gradient: 'linear-gradient(160deg, #72d079 0%, #c8dd76 70%, #e4d979 100%)' },
  { title: 'Finishing',      emphasis: 'touches!',  gradient: 'linear-gradient(160deg, #9e9ff5 0%, #cf9fd1 55%, #f3a4a9 100%)' },
]

const prompts = [
  'Describe your immediate surroundings in detail.',
  'Describe your favorite holiday, person, place, or travel experience.',
  'Describe the events of your typical day from morning to night.',
]

function LiveWave({ level }) {
  // `level` is 0–255. Render smooth wave lines whose amplitude tracks level.
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let raf
    const loop = () => {
      setPhase(p => p + 0.08)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const amp = Math.min(1, level / 90) // normalize to 0-1

  const generateWavePath = (baseAmp, frequency, phaseOffset) => {
    const width = 200
    const points = []
    for (let x = 0; x <= width; x += 2) {
      const normalX = x / width
      const envelope = Math.sin(normalX * Math.PI) ** 1.5
      const y = 24 +
        envelope * baseAmp * amp * Math.sin(normalX * frequency + phase + phaseOffset) +
        envelope * (baseAmp * 0.4) * amp * Math.sin(normalX * frequency * 1.8 + phase * 1.3 + phaseOffset)
      points.push(`${x},${y}`)
    }
    return `M${points[0]} ${points.slice(1).map(p => `L${p}`).join(' ')}`
  }

  const waves = [
    { color: 'rgba(139, 141, 245, 0.7)',  baseAmp: 15, frequency: 8,  phaseOffset: 0 },
    { color: 'rgba(180, 140, 240, 0.55)', baseAmp: 12, frequency: 10, phaseOffset: 1.5 },
    { color: 'rgba(165, 214, 245, 0.6)',  baseAmp: 13, frequency: 7,  phaseOffset: 3 },
    { color: 'rgba(170, 232, 195, 0.55)', baseAmp: 11, frequency: 9,  phaseOffset: 4.5 },
    { color: 'rgba(230, 160, 210, 0.5)',  baseAmp: 10, frequency: 11, phaseOffset: 2.2 },
  ]

  return (
    <div className="w-full" style={{ height: 32 }}>
      <svg width="100%" height="32" viewBox="0 0 200 48" preserveAspectRatio="none">
        {waves.map((w, i) => (
          <path
            key={i}
            d={generateWavePath(w.baseAmp, w.frequency, w.phaseOffset)}
            fill="none"
            stroke={w.color}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  )
}

export default function LiveVoiceDemo() {
  const [listening, setListening] = useState(false)
  const [level, setLevel] = useState(0)
  const [error, setError] = useState('')
  const [elapsed, setElapsed] = useState(0) // seconds
  const [activePrompt, setActivePrompt] = useState(0)
  const [rejected, setRejected] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0) // 0..100
  const [success, setSuccess] = useState(false)

  const levelRef = useRef(0)
  const pauseSecondsRef = useRef(0)
  const uploadTimerRef = useRef(null)
  const elapsedRef = useRef(0)

  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const timerRef = useRef(null)

  function startUpload() {
    // Guard: if already uploading, do nothing (prevents duplicate intervals from StrictMode / re-triggers)
    if (uploadTimerRef.current) return

    // Release mic but keep the UI in an "uploading" overlay
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    analyserRef.current = null
    setListening(false)
    setUploading(true)
    setUploadProgress(0)

    // Animate progress from 0 → 100 over ~4.5s, then show success
    const TOTAL_MS = 4500
    const TICK = 50
    const start = Date.now()
    const localInterval = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, (elapsed / TOTAL_MS) * 100)
      setUploadProgress(pct)
      if (elapsed >= TOTAL_MS) {
        clearInterval(localInterval)
        // Only transition to success if this interval is still the active one
        if (uploadTimerRef.current === localInterval) {
          uploadTimerRef.current = null
          setUploading(false)
          setUploadProgress(0)
          setSuccess(true)
        }
      }
    }, TICK)
    uploadTimerRef.current = localInterval
  }

  function resetAll() {
    if (uploadTimerRef.current) { clearInterval(uploadTimerRef.current); uploadTimerRef.current = null }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    analyserRef.current = null
    setListening(false)
    setSuccess(false)
    setUploading(false)
    setUploadProgress(0)
    setRejected(false)
    setElapsed(0)
    setLevel(0)
    setActivePrompt(0)
    levelRef.current = 0
    pauseSecondsRef.current = 0
    elapsedRef.current = 0
  }

  function stopListening() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    analyserRef.current = null
    setLevel(0)
    setElapsed(0)
    setListening(false)
  }

  async function startListening() {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioCtx()
      audioCtxRef.current = ctx

      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.7
      source.connect(analyser)
      analyserRef.current = analyser

      const data = new Uint8Array(analyser.frequencyBinCount)

      const loop = () => {
        analyser.getByteFrequencyData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) sum += data[i]
        const avg = sum / data.length
        levelRef.current = avg
        setLevel(avg)
        rafRef.current = requestAnimationFrame(loop)
      }
      loop()
      setElapsed(0)
      setRejected(false)
      pauseSecondsRef.current = 0
      timerRef.current = setInterval(() => {
        // Tick elapsed outside of setElapsed side effects
        elapsedRef.current += 1
        setElapsed(elapsedRef.current)

        // Trigger success upload once
        if (elapsedRef.current >= SUCCESS_SECONDS) {
          startUpload()
          return
        }

        // Track consecutive seconds out-of-range (too quiet or too loud)
        if (levelRef.current < QUIET_THRESHOLD || levelRef.current > LOUD_THRESHOLD) {
          pauseSecondsRef.current += 1
          if (pauseSecondsRef.current >= BAD_LEVEL_SECONDS) {
            setRejected(true)
            stopListening()
          }
        } else {
          pauseSecondsRef.current = 0
        }
      }, 1000)
      setListening(true)
    } catch (e) {
      setError(e?.name === 'NotAllowedError'
        ? 'Microphone permission denied. Enable it in your browser to try the demo.'
        : 'Could not access the microphone.')
    }
  }

  // Cycle prompts every 10s while listening
  useEffect(() => {
    if (!listening) { setActivePrompt(0); return }
    const interval = setInterval(() => {
      setActivePrompt(p => (p + 1) % prompts.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [listening])

  // Cleanup on unmount
  useEffect(() => () => stopListening(), [])

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const secs = String(elapsed % 60).padStart(2, '0')

  const tooQuiet = listening && level < QUIET_THRESHOLD
  const tooLoud  = listening && level > LOUD_THRESHOLD
  const justRight = listening && !tooQuiet && !tooLoud

  const status =
    !listening ? 'Ready to Listen' :
    tooLoud    ? 'Too Loud' :
    tooQuiet   ? 'Too Quiet' :
    'Great volume'

  const statusColor =
    tooLoud  ? '#EB5757' :
    tooQuiet ? '#EB5757' :
    justRight ? '#22c55e' :
    GRAY

  return (
    <div className="flex flex-col items-center">
      <div
        className="mb-5 px-4 py-2.5 rounded-lg text-center"
        style={{
          background: 'rgba(96,103,241,0.08)',
          border: '1px solid rgba(96,103,241,0.2)',
          maxWidth: 340,
        }}
      >
        <p className="text-[11px] text-[#3b4465] leading-relaxed">
          <span className="font-semibold">Prototype note:</span> recording is capped at 20 seconds, and 5+ consecutive seconds of silence or clipping will reject the take.
        </p>
      </div>

      <PhoneMockup>
        <div className="w-full h-full relative overflow-hidden flex flex-col" style={{ fontFamily: "'Sarabun', system-ui, sans-serif", background: '#f7f9ff' }}>

          {/* ─── SUCCESS OVERLAY ─── */}
          {success && (
            <div className="absolute inset-0 z-50 flex flex-col" style={{ background: '#f7f9ff' }}>
              <div
                className="flex-1"
                style={{
                  background: 'linear-gradient(180deg, #dfe0f5 0%, #e8dff0 60%, #f7e8ec 100%)',
                  minHeight: 180,
                }}
              />

              <div
                className="flex flex-col items-center bg-white px-6 pt-12 pb-6 relative"
                style={{
                  borderTopLeftRadius: 32,
                  borderTopRightRadius: 32,
                  flex: '0 0 auto',
                  marginTop: -24,
                  boxShadow: '0 -8px 20px rgba(16,16,39,0.05)',
                }}
              >
                <p style={{ color: DARK, fontSize: 22, fontWeight: 600, letterSpacing: 0.1 }}>Thank You!</p>
                <p className="mt-2" style={{ color: BLUE, fontSize: 13, fontWeight: 500 }}>Upload Successful</p>
                <p className="mt-3 text-center" style={{ color: GRAY, fontSize: 11.5, lineHeight: 1.6, maxWidth: 230 }}>
                  Come back tomorrow and record again. Your contribution will help VRI solve the health crisis facing humanity.
                </p>

                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); resetAll() }}
                  className="mt-5 flex items-center gap-2 cursor-pointer transition-transform active:scale-[0.97]"
                  style={{
                    padding: '4px 14px 4px 4px',
                    borderRadius: 999,
                    border: '1px solid #e6e8f5',
                    background: '#fff',
                    boxShadow: '0 4px 12px rgba(111,118,242,0.1)',
                    pointerEvents: 'auto',
                    position: 'relative',
                    zIndex: 60,
                  }}
                >
                  <span
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 26, height: 26, borderRadius: 999,
                      background: `linear-gradient(145deg, ${BLUE}, ${PURPLE})`,
                    }}
                  >
                    <svg width="11" height="9" viewBox="0 0 16 14" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 7H2" />
                      <path d="M7 2L2 7L7 12" />
                    </svg>
                  </span>
                  <span style={{ color: DARK, fontSize: 10, fontWeight: 700, letterSpacing: 0.6, whiteSpace: 'nowrap' }}>
                    BACK TO DASHBOARD
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ─── UPLOAD OVERLAY (single continuous screen with progress bar) ─── */}
          {uploading && (
            <div
              className="absolute inset-0 z-40 overflow-hidden flex flex-col items-center px-6 pt-16"
              style={{
                background:
                  'linear-gradient(125deg, #6067F1 0%, #8685F1 15%, #c9a2e8 30%, #e79fa9 45%, #f2c189 60%, #9fd3a4 75%, #7bd3cf 90%, #6067F1 100%)',
                backgroundSize: '400% 400%',
                animation: 'uploadGradientShift 14s ease-in-out infinite',
              }}
            >
              <p className="text-white text-center" style={{ fontSize: 17, fontWeight: 400, letterSpacing: 0.2 }}>
                Uploading your <span style={{ fontWeight: 700 }}>recording</span>
              </p>

              {/* Progress bar */}
              <div className="w-full mt-auto mb-4" style={{ marginTop: '40%' }}>
                <div
                  className="w-full mx-auto overflow-hidden"
                  style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.25)' }}
                >
                  <div
                    style={{
                      width: `${uploadProgress}%`,
                      height: '100%',
                      borderRadius: 999,
                      background: '#fff',
                      boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                      transition: 'width 0.15s linear',
                    }}
                  />
                </div>
                <p className="text-white text-center mt-2" style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: 0.4, opacity: 0.9 }}>
                  {Math.round(uploadProgress)}%
                </p>
              </div>

              {/* Cancel circle */}
              <div className="mt-auto flex flex-col items-center pb-4">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 40, height: 40, borderRadius: 999,
                    border: '1.5px solid rgba(255,255,255,0.6)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" style={{ opacity: 0.9 }}>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </div>
                <p className="mt-2 text-white" style={{ fontSize: 10, fontWeight: 500, opacity: 0.85 }}>Hold to Cancel</p>
              </div>
            </div>
          )}

          {/* Purple header */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{ height: 135, background: `linear-gradient(145deg, ${BLUE} 40%, ${PURPLE} 75%)` }}
          />

          {/* Status bar */}
          <div className="relative z-20 flex items-center justify-between px-4 pt-3 text-white">
            <span className="text-[9px] font-semibold opacity-90">9:41</span>
            <div className="flex items-center gap-1 opacity-80">
              <svg width="10" height="8" viewBox="0 0 16 12" fill="white"><path d="M1 8h2v4H1zM5 5h2v7H5zM9 3h2v9H9zM13 0h2v12h-2z"/></svg>
              <svg width="14" height="8" viewBox="0 0 22 11" fill="none"><rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="white" fill="none"/><rect x="2" y="2" width="15" height="7" rx="1" fill="white"/></svg>
            </div>
          </div>

          {/* Title */}
          <div className="relative z-20 flex items-center justify-center pt-2 pb-5">
            <p className="text-white" style={{ fontSize: 14, fontWeight: 500, letterSpacing: 0.2 }}>Recording</p>
          </div>

          {/* Card */}
          <div
            className="relative z-10 mx-0 flex flex-col items-center bg-white overflow-hidden"
            style={{
              borderRadius: 26,
              boxShadow: '0 4px 20px rgba(111, 118, 242, 0.15)',
              height: 'calc(100% - 200px)',
            }}
          >
            {rejected ? (
              <div className="flex-1 w-full flex flex-col items-center justify-center px-6 text-center">
                {/* Purple sad-face */}
                <div
                  className="flex items-center justify-center mb-6"
                  style={{
                    width: 68, height: 68, borderRadius: 999,
                    background: `linear-gradient(145deg, ${BLUE}, ${PURPLE})`,
                    boxShadow: '0 8px 18px rgba(99,98,237,0.35)',
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 34 34" fill="none">
                    <circle cx="10" cy="12" r="2.8" fill="white" />
                    <circle cx="24" cy="12" r="2.8" fill="white" />
                    <path d="M9 26c2-2.4 5-3.4 8-3.4s6 1 8 3.4" stroke="white" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <p style={{ color: DARK, fontSize: 16, fontWeight: 500, letterSpacing: 0.2, lineHeight: 1.3 }}>
                  Oops, we can’t use that<br />recording!
                </p>
                <p className="mt-3" style={{ color: GRAY, fontSize: 11.5, lineHeight: 1.5, fontWeight: 400, maxWidth: 200 }}>
                  Please record again with fewer pauses, and be sure you are in a quiet space.
                </p>
              </div>
            ) : (
              <>
            {/* Describe-prompt bullet (same style as VRIScreen) */}
            <div className="w-full px-5 pt-4 pb-1">
              <div className="flex items-start gap-2 min-h-[42px]">
                <div className="w-[6px] h-[6px] rounded-full bg-[#6067f1] mt-[5px] flex-shrink-0" />
                <p
                  key={activePrompt}
                  className="text-[11px] text-[#5d5e73] leading-[17px] font-medium"
                  style={{
                    animation: 'livePromptFade 0.4s ease-out',
                    letterSpacing: '0.06px',
                  }}
                >
                  {prompts[activePrompt]}
                </p>
              </div>
            </div>

            {/* Prompt dots */}
            <div className="flex items-center gap-2 mb-1">
              {prompts.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activePrompt ? 9 : 6,
                    height: i === activePrompt ? 9 : 6,
                    backgroundColor: i === activePrompt ? BLUE : '#ced0e2',
                  }}
                />
              ))}
            </div>

            <div className="flex-1" />

            {/* Keep Talking title */}
            <p style={{ color: DARK, fontSize: 16, fontWeight: 500, marginBottom: 4 }}>
              {listening ? 'Keep Talking' : 'Ready to Listen'}
            </p>

            {/* Status chip — Too Quiet / Too Loud / Great volume */}
            <div
              className="px-3 py-1 mb-1.5"
              style={{
                borderRadius: 999,
                background: tooLoud ? 'rgba(235,87,87,0.12)' : tooQuiet ? 'rgba(235,87,87,0.12)' : justRight ? 'rgba(34,197,94,0.12)' : 'transparent',
                minHeight: 18,
              }}
            >
              <p style={{ color: statusColor, fontSize: 9.5, fontWeight: 600, letterSpacing: 0.2 }}>{status}</p>
            </div>

            {/* Timer — same style as VRIScreen */}
            <p style={{ color: DARK, fontSize: 26, fontWeight: 400, letterSpacing: 0.5, lineHeight: 1 }}>
              {mins}:{secs}
            </p>

            {/* Live waveform */}
            <div className="mt-3 w-full px-4">
              <LiveWave level={listening ? level : 0} />
            </div>

            <div className="flex-1 min-h-1" />
              </>
            )}
          </div>

          {/* Bottom controls row — lightbulb, mic, close (same style as VRIScreen) */}
          <div className="relative z-20 flex items-center justify-between w-full px-6 mt-auto pb-6">
            {/* Lightbulb */}
            <button
              className="w-[30px] h-[30px] rounded-full border border-[#ced0e2] flex items-center justify-center bg-white/60"
              aria-label="Tips"
            >
              <svg width="14" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7z" />
              </svg>
            </button>

            {/* Mic / Pause */}
            <button
              onClick={listening ? stopListening : startListening}
              className="relative w-[68px] h-[68px] flex items-center justify-center -mt-2 transition-transform active:scale-95"
              aria-label={listening ? 'Stop' : 'Start'}
            >
              <div
                className="w-[56px] h-[56px] rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(145deg, ${BLUE}, ${PURPLE})`,
                  boxShadow: listening
                    ? '0 0 0 4px rgba(96,103,241,0.2), 0 8px 18px rgba(96,103,241,0.45)'
                    : '0 8px 18px rgba(96,103,241,0.45)',
                }}
              >
                {listening ? (
                  <div className="flex gap-1">
                    <span style={{ width: 4, height: 16, background: '#fff', borderRadius: 1 }} />
                    <span style={{ width: 4, height: 16, background: '#fff', borderRadius: 1 }} />
                  </div>
                ) : (
                  <svg width="18" height="22" viewBox="0 0 24 24" fill="white">
                    <rect x="9" y="2" width="6" height="12" rx="3" />
                    <path d="M5 11a7 7 0 0014 0" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <line x1="12" y1="18" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              {!listening && (
                <>
                  <span className="absolute inset-0 rounded-full pointer-events-none" style={{
                    border: `2px solid ${PURPLE}`,
                    animation: 'liveVoicePulse 1.4s ease-out infinite',
                  }} />
                  <span className="absolute inset-0 rounded-full pointer-events-none" style={{
                    border: `2px solid ${PURPLE}`,
                    animation: 'liveVoicePulse 1.4s ease-out 0.6s infinite',
                  }} />
                </>
              )}
            </button>

            {/* Close — stops the session */}
            <button
              onClick={stopListening}
              className="w-[30px] h-[30px] rounded-full border border-[#ced0e2] flex items-center justify-center bg-white/60"
              aria-label="Close"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <style>{`
            @keyframes liveVoicePulse {
              0%   { transform: scale(1);   opacity: 0.6; }
              100% { transform: scale(1.6); opacity: 0;   }
            }
            @keyframes livePromptFade {
              from { opacity: 0; transform: translateY(6px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes uploadGradientShift {
              0%   { background-position:   0% 50%; }
              25%  { background-position:  50%  0%; }
              50%  { background-position: 100% 50%; }
              75%  { background-position:  50% 100%; }
              100% { background-position:   0% 50%; }
            }
          `}</style>
        </div>
      </PhoneMockup>

      {error && (
        <p className="mt-4 text-[12px] text-red-500 max-w-[260px] text-center">{error}</p>
      )}

      <p className="mt-4 text-[11px] text-gray-400 max-w-[280px] text-center leading-relaxed italic">
        Audio is analyzed locally in your browser using the Web Audio API and is never recorded, uploaded, or stored.
      </p>
    </div>
  )
}
