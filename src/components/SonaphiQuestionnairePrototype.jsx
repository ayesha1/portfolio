import { useState, useEffect } from 'react'
import PhoneMockup from './PhoneMockup'
import VRIScreen from './VRIScreen'

/* Auto-playing Sonaphi pre-recording questionnaire prototype.
 * Cycles through: 1) Recording History empty state
 *                 2) Pre-recording COVID questionnaire modal
 *                 3) Are-you-sure confirmation modal during recording
 */

const BLUE = '#6067F1'
const PURPLE = '#8685F1'
const DARK = '#3B4465'
const GRAY = '#7D7F9C'
const LINE = '#CED0E2'
const LIGHT_BG = '#F7F9FF'

function PhoneChrome({ children }) {
  return (
    <div
      className="relative mx-auto rounded-[40px] border-[6px] border-gray-900 bg-gray-900 shadow-xl overflow-hidden"
      style={{ width: 280, height: 580 }}
    >
      {/* Notch to match PhoneMockup */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[22px] bg-gray-900 rounded-b-2xl z-40" />
      <div
        className="relative w-full h-full overflow-hidden rounded-[34px]"
        style={{
          background: '#fff',
          fontFamily: "'Sarabun', system-ui, sans-serif",
        }}
      >
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 z-30" style={{ height: 24 }}>
          <span className="text-[9.5px] font-semibold text-white">9:41</span>
          <div className="flex items-center gap-1">
            <svg width="12" height="8" viewBox="0 0 17 11" fill="none"><path d="M1 9h2v1H1zm4-2h2v3H5zm4-3h2v6H9zm4-3h2v9h-2z" fill="white"/></svg>
            <svg width="11" height="8" viewBox="0 0 16 11" fill="none"><path d="M8 11a2 2 0 100-4 2 2 0 000 4zm-4-3a4 4 0 018 0h2a6 6 0 00-12 0h2zm-4-4a8 8 0 0116 0h-2a6 6 0 00-12 0H0z" fill="white"/></svg>
            <svg width="15" height="8" viewBox="0 0 22 11" fill="none"><rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="white" fill="none"/><rect x="2" y="2" width="15" height="7" rx="1" fill="white"/><rect x="19.5" y="4" width="1.5" height="3" rx="0.5" fill="white"/></svg>
          </div>
        </div>
        {/* Notch */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30" style={{ width: 80, height: 18, borderRadius: 10, background: '#0a0a0a' }} />

        {children}
      </div>
    </div>
  )
}

/* Recording-history background (shared base) */
function RecordingHistoryBase({ withFiles, dimmed, micPressed }) {
  return (
    <div className="absolute inset-0" style={{ opacity: dimmed ? 0.7 : 1 }}>
      {/* Purple header */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: 96,
          background: `linear-gradient(145deg, ${BLUE}, ${PURPLE})`,
        }}
      />
      <p
        className="absolute left-1/2 -translate-x-1/2 text-white"
        style={{ top: 30, fontSize: 15, fontWeight: 500, letterSpacing: 0.2 }}
      >
        Recording History
      </p>

      {/* White rounded card */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: 70,
          bottom: 62,
          background: '#fff',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          boxShadow: '0 -8px 20px rgba(16,16,39,0.05)',
        }}
      />

      {/* User */}
      <p className="absolute left-1/2 -translate-x-1/2" style={{ top: 92, color: DARK, fontSize: 14, fontWeight: 600 }}>
        Laura Burke
      </p>
      <p className="absolute left-1/2 -translate-x-1/2" style={{ top: 112, color: GRAY, fontSize: 10, fontWeight: 500 }}>
        laura@gmail.com
      </p>
      <div className="absolute" style={{ top: 138, left: 16, right: 16, height: 1, background: LINE }} />

      {/* Empty state text OR files list */}
      {!withFiles ? (
        <div className="absolute" style={{ top: 230, left: 30, right: 30, textAlign: 'center' }}>
          <p style={{ color: GRAY, fontSize: 10.5, lineHeight: 1.5, fontWeight: 500 }}>
            Click on the microphone button at the bottom to record your first voice sample.
          </p>
        </div>
      ) : (
        <>
          <div className="absolute flex items-baseline gap-2" style={{ top: 172, left: 14 }}>
            <span style={{ color: GRAY, fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>Files:</span>
            <span style={{ color: DARK, fontSize: 12, fontWeight: 600 }}>1</span>
          </div>
          {/* File card */}
          <div
            className="absolute flex items-center gap-3 px-3"
            style={{
              top: 196, left: 14, right: 14, height: 46,
              background: LIGHT_BG, borderRadius: 6,
            }}
          >
            <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 26, height: 26, borderRadius: 4, background: '#fff', border: `1px solid ${LINE}` }}>
              <svg width="10" height="12" viewBox="0 0 16 20" fill="none" stroke={BLUE} strokeWidth="1.6">
                <path d="M4 2h6l4 4v12a0 0 0 010 0H4a0 0 0 010 0V2z" fill="none" />
                <path d="M10 2v4h4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: BLUE, fontSize: 11, fontWeight: 500, lineHeight: 1.2 }}>COVID Test.pdf</p>
              <p style={{ color: GRAY, fontSize: 10, fontWeight: 500, marginTop: 2 }}>2020-02-14</p>
            </div>
            <span style={{ color: LINE, fontSize: 12 }}>✕</span>
          </div>
        </>
      )}

      {/* Bottom mic bar */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 62, background: LIGHT_BG }}>
        {/* Home icon */}
        <svg className="absolute" style={{ left: 58, top: 24 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12l9-9 9 9v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2z" />
        </svg>
        {/* Profile icon */}
        <svg className="absolute" style={{ right: 54, top: 24 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 22a8 8 0 0116 0" />
        </svg>
        {/* Mic button */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
          style={{
            top: -10, width: 50, height: 50, borderRadius: 999,
            background: `linear-gradient(145deg, ${BLUE}, ${PURPLE})`,
            boxShadow: micPressed
              ? `0 4px 8px rgba(99,98,237,0.6), 0 0 0 4px rgba(134,133,241,0.35)`
              : `0 12px 18px rgba(99,98,237,0.45)`,
            transform: micPressed ? 'scale(0.88)' : 'scale(1)',
            transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s',
          }}
        >
          {/* Ripple when pressed */}
          {micPressed && (
            <>
              <span
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'transparent',
                  border: `2px solid ${PURPLE}`,
                  animation: 'sonaphi-mic-ripple 1s ease-out infinite',
                }}
              />
              <span
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'transparent',
                  border: `2px solid ${PURPLE}`,
                  animation: 'sonaphi-mic-ripple 1s ease-out 0.4s infinite',
                }}
              />
            </>
          )}

          <svg width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="12" rx="3" fill="white" stroke="none" />
            <path d="M5 11a7 7 0 0014 0M12 18v4" />
          </svg>

        </div>
      </div>
    </div>
  )
}

/* Recording-in-progress base — matches Figma node 635:1333 "Are you sure?" backdrop */
function RecordingBase() {
  return (
    <div className="absolute inset-0">
      {/* Full-frame purple gradient */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(145deg, ${BLUE} 40%, ${PURPLE} 75%)` }}
      />

      {/* Header — "Recording" title */}
      <p
        className="absolute left-1/2 -translate-x-1/2 text-white"
        style={{ top: 30, fontSize: 14, fontWeight: 500, letterSpacing: 0.2, opacity: 0.85 }}
      >
        Recording
      </p>

      {/* Laura Burke */}
      <p
        className="absolute left-1/2 -translate-x-1/2 text-white"
        style={{ top: 94, fontSize: 17, fontWeight: 500, letterSpacing: 0.2 }}
      >
        Laura Burke
      </p>
      <p
        className="absolute left-1/2 -translate-x-1/2 text-white"
        style={{ top: 120, fontSize: 12, fontWeight: 500, letterSpacing: 0.2, opacity: 0.9 }}
      >
        laura@gmail.com
      </p>

      {/* Keep Talking */}
      <p
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 190, color: DARK, fontSize: 17, fontWeight: 500, letterSpacing: 0.2 }}
      >
        Keep Talking
      </p>

      {/* Recording... */}
      <p
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 226, color: GRAY, fontSize: 9, fontWeight: 500, letterSpacing: 0.2 }}
      >
        Recording...
      </p>

      {/* Timer 00:28 */}
      <p
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 243, color: DARK, fontSize: 28, fontWeight: 400, letterSpacing: 0.5, lineHeight: 1 }}
      >
        00:28
      </p>

      {/* Waveform */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[2px]"
        style={{ top: 290, height: 32 }}
      >
        {[6, 10, 16, 22, 28, 24, 18, 12, 20, 26, 22, 14, 8, 14, 20, 26, 28, 22, 16, 10, 18, 24, 20, 14, 8].map((h, i) => (
          <div key={i} style={{
            width: 2, height: h, borderRadius: 1,
            background: BLUE, opacity: 0.85,
          }} />
        ))}
      </div>

      {/* Too Quiet red button */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5"
        style={{
          top: 388, width: 138, height: 30, borderRadius: 999,
          background: '#EB5757',
          boxShadow: '0 6px 12px rgba(235,87,87,0.35)',
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, letterSpacing: 0.2 }}>Too Quiet</span>
      </div>

      {/* Bottom pause button */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
        style={{ bottom: 24, width: 68, height: 68 }}
      >
        <svg className="absolute inset-0" width="68" height="68" viewBox="0 0 68 68">
          <circle cx="34" cy="34" r="31" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
          <circle cx="34" cy="34" r="31" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 31} strokeDashoffset={2 * Math.PI * 31 * 0.4}
            transform="rotate(-90 34 34)" opacity="0.9" />
        </svg>
        <div
          className="flex items-center justify-center"
          style={{ width: 48, height: 48, borderRadius: 999, background: 'rgba(255,255,255,0.18)' }}
        >
          <div className="flex gap-1">
            <div style={{ width: 4, height: 16, background: '#fff', borderRadius: 1 }} />
            <div style={{ width: 4, height: 16, background: '#fff', borderRadius: 1 }} />
          </div>
        </div>
      </div>

      {/* Bottom-left lightbulb */}
      <button
        className="absolute flex items-center justify-center"
        style={{
          left: 24, bottom: 44, width: 28, height: 28, borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.35)',
          background: 'rgba(255,255,255,0.08)',
        }}
      >
        <svg width="11" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7z" />
        </svg>
      </button>

      {/* Bottom-right X */}
      <button
        className="absolute flex items-center justify-center"
        style={{
          right: 24, bottom: 44, width: 28, height: 28, borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.35)',
          background: 'rgba(255,255,255,0.08)',
        }}
      >
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.85 }}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

/* Yellow "?" badge used on modals */
function QBadge({ top }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center"
      style={{
        top, width: 62, height: 62, borderRadius: 999,
        background: 'linear-gradient(145deg, #ffd93d, #f0b400)',
        boxShadow: '0 8px 18px rgba(240,180,0,0.35)',
        border: '3px solid #fff',
      }}
    >
      <span style={{ color: '#fff', fontSize: 28, fontWeight: 700, lineHeight: 1 }}>?</span>
    </div>
  )
}

function PillButton({ label, filled, width = 98 }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width, height: 34, borderRadius: 999,
        background: filled ? `linear-gradient(145deg, ${BLUE}, ${PURPLE})` : '#fff',
        border: filled ? 'none' : `1px solid ${LINE}`,
        color: filled ? '#fff' : DARK,
        fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
        boxShadow: filled ? '0 10px 18px rgba(99,98,237,0.4)' : 'none',
      }}
    >
      {label}
    </div>
  )
}

/* Screen 1 — Empty recording history */
function ScreenEmpty({ pressed }) {
  return <RecordingHistoryBase withFiles={false} micPressed={pressed} />
}

/* Screen 2 — Recording history + questionnaire modal */
function ScreenQuestionnaire({ answers = {} }) {
  return (
    <>
      <RecordingHistoryBase withFiles={false} />
      {/* Dim overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(60,50,120,0.2)' }} />

      {/* Yellow ? */}
      <QBadge top={220} />

      {/* Modal sheet (bottom) */}
      <div
        className="absolute left-0 right-0 bottom-0 flex flex-col items-center pt-10 pb-6 px-5"
        style={{
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          background: '#fff',
          boxShadow: '0 -12px 30px rgba(16,16,39,0.1)',
        }}
      >
        {/* Q1 */}
        <p className="text-center" style={{ color: DARK, fontSize: 12.5, fontWeight: 600, lineHeight: 1.4, maxWidth: 230 }}>
          Have you taken any COVID-19 prescription medication within the past three weeks?
        </p>
        <div className="flex gap-3 mt-4">
          <PillButton label="YES" filled={answers.q1 === 'yes'} />
          <PillButton label="NO"  filled={answers.q1 === 'no'} />
        </div>

        {/* Divider */}
        <div className="my-5 w-full" style={{ height: 1, background: LINE, opacity: 0.6 }} />

        {/* Q2 */}
        <p className="text-center" style={{ color: DARK, fontSize: 12.5, fontWeight: 600, lineHeight: 1.4 }}>
          Have you taken a COVID-19 vaccine?
        </p>
        <div className="flex gap-3 mt-4">
          <PillButton label="YES" filled={answers.q2 === 'yes'} />
          <PillButton label="NO"  filled={answers.q2 === 'no'} />
        </div>
      </div>
    </>
  )
}

/* Screen 3 — Are you sure confirmation over the homepage VRIScreen (pre-recording) */
function ScreenConfirm({ selected }) {
  return (
    <div className="relative" style={{ width: 280, height: 580 }}>
      {/* Homepage VRIScreen, frozen at the pre-recording state */}
      <VRIScreen isVisible={false} />

      {/* 80% opacity #6067F1 layer over the phone screen only */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 6, left: 6, right: 6, bottom: 6,
          borderRadius: 34,
          background: BLUE,
          opacity: 0.8,
        }}
      />

      {/* Modal content on top — stays inside the phone screen area */}
      <div className="absolute" style={{ top: 6, left: 6, right: 6, bottom: 6, borderRadius: 34, overflow: 'hidden' }}>
        {/* Yellow "?" icon */}
        <QBadge top={160} />

        {/* White modal card */}
        <div
          className="absolute left-4 right-4 flex flex-col items-center pt-10 pb-6 px-5"
          style={{
            top: 192,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 20px 40px rgba(16,16,39,0.2)',
          }}
        >
          <p style={{ color: DARK, fontSize: 14, fontWeight: 600, letterSpacing: 0.1 }}>Are You Sure?</p>
          <p className="text-center mt-2" style={{ color: GRAY, fontSize: 11, lineHeight: 1.5, letterSpacing: 0.2 }}>
            You are about to make a recording for Laura Burke
          </p>
          <div className="flex gap-3 mt-5">
            <div
              className="flex items-center justify-center"
              style={{
                width: 96, height: 30, borderRadius: 999,
                background: `linear-gradient(145deg, ${BLUE}, ${PURPLE})`,
                color: '#fff',
                fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                boxShadow: '0 8px 14px rgba(99,98,237,0.4)',
                transform: selected === 'proceed' ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 0.2s',
              }}
            >
              PROCEED
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                width: 96, height: 30, borderRadius: 999,
                background: '#fde4e6',
                color: DARK,
                fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
              }}
            >
              GO BACK
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const STEPS = [
  { id: 'empty',     screen: 'empty', group: 0, duration: 1800, caption: 'Empty recording history' },
  { id: 'mic-press', screen: 'empty', group: 1, pressed: true,  duration: 900,  caption: 'Tap the mic to begin' },
  { id: 'prompt',    screen: 'quest', group: 2, answers: {},                      duration: 1100, caption: 'Pre-recording questionnaire' },
  { id: 'ans-no1',   screen: 'quest', group: 2, answers: { q1: 'no' },            duration: 1100, caption: 'Pre-recording questionnaire' },
  { id: 'ans-yes2',  screen: 'quest', group: 2, answers: { q1: 'no', q2: 'yes' }, duration: 1800, caption: 'Pre-recording questionnaire' },
]

const GROUP_COUNT = 3

export default function SonaphiQuestionnairePrototype() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setStep(s => (s + 1) % STEPS.length), STEPS[step].duration)
    return () => clearTimeout(t)
  }, [step])

  const current = STEPS[step]

  return (
    <div className="flex flex-col items-center">
      {current.screen === 'confirm' ? (
        <ScreenConfirm selected={current.selected} />
      ) : (
        <PhoneChrome>
          {current.screen === 'empty' && <ScreenEmpty pressed={current.pressed} />}
          {current.screen === 'quest' && <ScreenQuestionnaire answers={current.answers} />}
        </PhoneChrome>
      )}

      <style>{`
        @keyframes sonaphi-mic-ripple {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes sonaphi-tap-fade {
          0% { transform: translate(10px, 10px) rotate(-8deg); opacity: 0; }
          60% { transform: translate(0, 0) rotate(-12deg); opacity: 1; }
          100% { transform: translate(0, 0) rotate(-12deg); opacity: 1; }
        }
      `}</style>

      {/* Caption + progress dots */}
      <div className="mt-5 flex flex-col items-center">
        <p className="text-[12px] text-gray-500 italic" style={{ minHeight: 18 }}>{current.caption}</p>
        <div className="flex gap-1.5 mt-2">
          {Array.from({ length: GROUP_COUNT }).map((_, g) => (
            <span
              key={g}
              style={{
                width: g === current.group ? 18 : 6, height: 6, borderRadius: 999,
                background: g === current.group ? BLUE : '#d6d8eb',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
