import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatbotDemo from './ChatbotDemo'

function BotAvatar({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M6 0h28a6 6 0 0 1 6 6v34H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6z" fill="#4b286d" />
      <circle cx="14" cy="16" r="2.5" fill="white" />
      <circle cx="26" cy="16" r="2.5" fill="white" />
      <path d="M13 24c3 4 11 4 14 0" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function ErrorStatesAnim() {
  const errors = [
    { image: '/telus-error1.jpg', label: 'Undelivered Message', desc: 'Shows retry option when message fails to send' },
    { image: '/telus-error2.jpg', label: 'WiFi Disconnected', desc: 'Alerts user of connection issues with reconnect prompt' },
    { image: '/telus-error3.jpg', label: 'Image Not Loading', desc: 'Placeholder state when media fails to load' },
  ]

  return (
    <div className="flex gap-4">
      {errors.map((err, i) => (
        <div key={i} className="flex-1">
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <img src={err.image} alt={err.label} className="w-full object-cover object-top" />
          </div>
          <p className="text-[12px] font-semibold text-gray-700 mt-2">{err.label}</p>
          <p className="text-[11px] text-gray-400">{err.desc}</p>
        </div>
      ))}
    </div>
  )
}

function PrototypeOnScroll() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="mb-8 flex justify-start">
      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
        <ChatbotDemo isVisible={visible} />
      </div>
    </div>
  )
}

function BeforeNewCustomerAnim() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const cycle = () => {
      setStep(0)
      setTimeout(() => setStep(1), 2000)   // hover
      setTimeout(() => setStep(2), 3000)   // click (fill)
      setTimeout(() => setStep(3), 4200)   // products
      setTimeout(() => setStep(0), 8000)   // reset
    }
    cycle()
    const loop = setInterval(cycle, 8000)
    return () => clearInterval(loop)
  }, [])

  return (
    <div className="flex flex-col" style={{ fontFamily: 'system-ui, sans-serif', height: '420px' }}>
      {/* Old-style header — white bg with purple icon */}
      <div className="bg-[#4b286d] flex items-center gap-2 px-3 py-2 rounded-t-[6px]">
        <img src="/telus-oldlogo.png" alt="" className="w-[24px] h-[24px] object-contain" />
        <span className="text-white text-[11px] font-semibold">TELUS Assist</span>
        <div className="flex-1" />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
      </div>

      {step < 3 ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="text-center text-[12px] font-medium text-gray-500 py-2 border-b border-gray-100">Welcome</div>
          <div className="px-4 py-4 flex-1 flex flex-col">
            <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
              A quick and easy way to find information and manage your account, 24/7. If our virtual assistant can't help, it will connect you to a live agent.
            </p>
            <p className="text-[12px] font-bold text-gray-800 mb-4">Are you currently a TELUS business customer?</p>
            <button className="w-full border border-gray-300 rounded-lg py-3 text-[12px] text-gray-700 mb-3">Yes</button>
            <button
              className="w-full border-2 rounded-lg py-3 text-[12px] font-medium transition-all duration-300"
              style={{
                borderColor: step >= 1 ? '#4b286d' : '#d1d5db',
                backgroundColor: step === 2 ? '#4b286d' : step === 1 ? '#f3f0f6' : 'white',
                color: step === 2 ? 'white' : '#374151',
                transform: step === 2 ? 'scale(0.97)' : 'scale(1)',
              }}
            >
              No
            </button>
            <p className="text-[8px] text-gray-400 mt-3 leading-relaxed">This Chat session will be recorded in accordance with the TELUS Privacy Commitment.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <span className="text-[#4b286d] text-[16px] font-light">‹</span>
            <span className="text-[12px] font-medium text-gray-500">Select a product</span>
          </div>
          <div className="px-4 py-1 overflow-auto">
            {['Business mobility services', 'Business phone or Internet Services', 'Business Connect (Cloud Based Voice over IP)', 'Business Bundles', 'TELUS Secure Business', 'TELUS Business Apps - Office 365 & G Suite'].map(opt => (
              <div key={opt} className="flex items-center gap-3 py-2.5 border-b border-gray-50">
                <div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-gray-300 flex-shrink-0" />
                <span className="text-[10px] text-gray-600 leading-tight">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AfterNewCustomerAnim() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const cycle = () => {
      setStep(0)
      setTimeout(() => setStep(1), 2500)
      setTimeout(() => setStep(0), 7500)
    }
    cycle()
    const loop = setInterval(cycle, 7500)
    return () => clearInterval(loop)
  }, [])

  return (
    <div className="flex flex-col" style={{ fontFamily: 'system-ui, sans-serif', height: '420px' }}>
      {/* New header — matching the after mockup style */}
      <div className="bg-[#4b286d] flex items-center gap-2 px-3 py-2 rounded-t-[6px]">
        <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
          <circle cx="14" cy="16" r="2.5" fill="white" /><circle cx="26" cy="16" r="2.5" fill="white" />
          <path d="M13 24c3 4 11 4 14 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-white text-[11px] font-semibold">TELUS Assist</span>
        <div className="flex-1" />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"><path d="M5 12h14"/></svg>
      </div>

      {step === 0 ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="text-center text-[12px] font-medium text-gray-600 py-2 border-b border-gray-100">Welcome 👋</div>
          <div className="px-4 py-4 flex-1 flex flex-col">
            <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
              To start let's get some quick information so we can better serve you.
            </p>
            <p className="text-[12px] font-bold text-gray-800 mb-5">Are you a TELUS customer?</p>
            <button className="w-full border-2 border-[#4b286d] rounded-full py-3.5 text-[12px] text-gray-700 mb-3">Yes</button>
            <button className="w-full border-2 border-[#4b286d] rounded-full py-3.5 text-[12px] text-gray-700">No</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden" style={{ animation: 'fadeSlideIn 0.4s ease-out' }}>
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <span className="text-[#4b286d] text-[16px] font-light">‹</span>
            <span className="text-[12px] font-medium text-gray-600">Welcome! 👋</span>
          </div>
          <div className="px-4 py-4 flex-1 flex flex-col">
            <p className="text-[12px] font-semibold text-gray-700 mb-4">What can we help you with?</p>
            <div className="flex flex-col gap-3">
              <button className="border-2 border-[#4b286d] rounded-full py-3 px-4 text-center">
                <p className="text-[12px] font-bold text-gray-800">Mobility</p>
                <p className="text-[10px] text-gray-400">Phones/ Plans/ Deals</p>
              </button>
              <button className="border-2 border-[#4b286d] rounded-full py-3 px-4 text-center">
                <p className="text-[12px] font-bold text-gray-800">Home</p>
                <p className="text-[10px] text-gray-400">SmartPhone/Online Security</p>
              </button>
              <button className="border-2 border-[#4b286d] rounded-full py-3 px-4 text-center">
                <p className="text-[12px] font-bold text-gray-800">Business</p>
                <p className="text-[10px] text-gray-400">Business Phones/ Internet/ Bundles</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FlowNode({ color, text, small, border }) {
  return (
    <div
      className={`rounded-lg flex items-center justify-center text-center ${small ? 'px-3 py-1.5' : 'px-4 py-2.5'}`}
      style={{
        background: color,
        color: color === 'white' || color === '#fff' ? '#4b286d' : 'white',
        fontSize: small ? '10px' : '12px',
        fontWeight: 600,
        border: border ? '1.5px solid #4b286d' : 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  )
}

function FlowArrow() {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" className="flex-shrink-0">
      <path d="M0 5h16M12 1l4 4-4 4" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const tocItems = [
  { id: 'background', label: 'Background' },
  { id: 'problem', label: 'Problem' },
  { id: 'goals', label: 'Goals' },
  { id: 'process', label: 'Process' },
  { id: 'userflow', label: 'User Flow' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'results', label: 'Results' },
]

function ContentSection({ id, children }) {
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
      className="mb-24 transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
      }}
    >
      {children}
    </section>
  )
}

export default function TelusCaseStudy() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('background')

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(timer)
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
    if (loading) return
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, handleScroll])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#f4f9f2' }}>
        <div style={{ animation: 'loadFadeIn 0.6s ease-out' }}>
          <BotAvatar size={120} />
        </div>
        <p className="text-center text-[15px] font-bold mt-5 text-[#2c2e30]" style={{ animation: 'loadFadeIn 0.6s ease-out 0.3s both' }}>
          One moment ☝️<br />Connecting you with TELUS Assist
        </p>
        <style>{`
          @keyframes loadFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white" style={{ cursor: 'auto' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/#case-telus')}
        className="fixed top-6 left-6 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M5 12l7-7M5 12l7 7" />
        </svg>
      </button>

      {/* ── HERO ── */}
      <div className="relative w-full h-[85vh] overflow-hidden" style={{ background: '#f4f9f2' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <div className="flex items-center gap-4 mb-8" style={{ animation: 'heroFade 0.8s ease-out 0.2s both' }}>
            <img src="/google-logo.png" alt="Google" className="h-8 object-contain opacity-70" />
            <span className="text-gray-300 text-2xl font-light">×</span>
            <img src="/telus-logo.png" alt="TELUS" className="h-8 object-contain opacity-70" />
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl text-gray-900 leading-tight max-w-[700px] mb-6" style={{ animation: 'heroFade 0.8s ease-out 0.4s both' }}>
            AI-Powered Chatbot Experience
          </h1>
          <p className="text-[17px] text-gray-500 max-w-[500px] leading-relaxed mb-10" style={{ animation: 'heroFade 0.8s ease-out 0.6s both' }}>
            Redesigning TELUS's conversational AI to reduce live agent dependency by 50% and increase user adoption by 200%.
          </p>
          <div className="flex gap-8 text-[13px] text-gray-400" style={{ animation: 'heroFade 0.8s ease-out 0.8s both' }}>
            <div className="text-center">
              <p className="font-semibold text-gray-600">Role</p>
              <p>UX Design Consultant</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-600">Timeline</p>
              <p>3 months</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-600">Tools</p>
              <p>Figma, Miro, Jira</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-600">Team</p>
              <p>PM, Tech Lead, 3 Devs</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400" style={{ animation: 'heroFade 0.8s ease-out 1s both' }}>
          <span className="text-[11px] tracking-widest uppercase">Scroll</span>
          <div className="w-[20px] h-[32px] rounded-full border-2 border-gray-300 flex justify-center pt-1.5">
            <div className="w-[2px] h-[6px] bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* ── CONTENT: TOC left + content right ── */}
      <div className="max-w-[1200px] mx-auto px-8 lg:px-16 flex gap-16 py-20">
        {/* Left — sticky TOC */}
        <div className="hidden lg:block w-[200px] flex-shrink-0">
          <div className="sticky top-24">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-6">Contents</p>
            <nav className="flex flex-col gap-1">
              {tocItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="text-left py-2 px-3 rounded-lg transition-all duration-300 text-[14px]"
                  style={{
                    color: activeSection === item.id ? '#4b286d' : '#9ca3af',
                    fontWeight: activeSection === item.id ? 600 : 400,
                    background: activeSection === item.id ? 'rgba(75, 40, 109, 0.06)' : 'transparent',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right — scrolling content */}
        <div className="flex-1 max-w-[700px]">

          <ContentSection id="background">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#4b286d] font-medium mb-3">Background</p>

            {/* Telus x Thoughtworks */}
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">Telus x Thoughtworks</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              TELUS, one of Canada's fastest-growing telecommunications companies, wanted to increase the speed and responsiveness of its enterprise. They partnered with Thoughtworks for a new way of working built on a digital platform strategy and value-driven portfolio capabilities. I was placed as a designer on the chatbot team to bring the speed and impact of a startup to a large enterprise group.
            </p>

            <div className="rounded-2xl overflow-hidden border border-gray-100 bg-black mb-4">
              <video
                src="/telus-tw.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto block"
              />
            </div>
            <div className="mb-12" />

            {/* The Challenge */}
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">The Challenge</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              TELUS, a major Canadian telecommunications company, struggled with a chatbot that customers found unhelpful. The live chat support team was overwhelmed, with 90% of chatbot conversations being escalated to human agents.
            </p>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              The company partnered with Google Cloud to develop an AI-powered solution but lacked design expertise after losing their sole visual designer.
            </p>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
              That's where I stepped in, helping TELUS and Google bridge the gap, improving the chatbot's user experience and visual design, and making the integration with Google Cloud's platform feel natural and easy.
            </p>
            {/* Stats */}
            <div className="flex p-6 rounded-2xl bg-gray-50">
              {[
                { value: '90%', label: 'Escalation rate', color: '#ef4444' },
                { value: '2 hrs', label: 'Avg wait time', color: '#f59e0b' },
                { value: '0', label: 'Designers on team', color: '#6b7280' },
              ].map(s => (
                <div key={s.label} className="flex-1 text-center">
                  <p className="text-[28px] font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[12px] text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection id="problem">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#4b286d] font-medium mb-3">Problem</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">What Went Wrong</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              The chatbot presented several critical challenges that needed to be addressed for the platform to be effective.
            </p>
            <div className="space-y-4 mb-8">
              {[
                '90% escalation rate to live agents instead of solving issues autonomously',
                'Average 2-hour wait times to connect with live agents',
                'No in-chat sign-in capability forced users to lose conversation context',
                'Excessive interface options confused users',
                'Unclear user flows looped back without resolution',
              ].map(item => (
                <div key={item} className="flex items-start gap-3 p-4 rounded-xl bg-red-50/50">
                  <span className="text-red-400 mt-0.5">✕</span>
                  <p className="text-[14px] text-gray-600">{item}</p>
                </div>
              ))}
            </div>
            {/* User research complaint — styled as research artifact */}
            <div className="mb-8 flex justify-center">
              <div className="relative max-w-[400px]">
                {/* Paper shadow + slight tilt */}
                <div className="bg-white rounded-lg p-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transform rotate-[-1deg]">
                  {/* Tape strip */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-100/80 rounded-sm" style={{ transform: 'rotate(2deg)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }} />
                  <img src="/telus-complaint.avif" alt="User complaint from research" className="w-full rounded-md" />
                </div>
                <div className="mt-3 flex items-center gap-2 justify-center">
                  <span className="text-[16px]">📌</span>
                  <p className="text-[11px] text-gray-400 italic">Real user complaint captured during research</p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-[#4b286d] pl-6 py-2">
              <p className="text-[16px] text-gray-700 italic leading-relaxed">
                "How can the chatbot effectively address customer needs without live agents?"
              </p>
              <p className="text-[12px] text-gray-400 mt-2">Primary Research Question</p>
            </div>
          </ContentSection>

          <ContentSection id="goals">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#4b286d] font-medium mb-3">Goals</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">What I Set Out to Do</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🎯', title: 'Identify automatable problems', desc: 'Found issues the bot could solve without human help' },
                { icon: '🗺️', title: 'Improve customer journeys', desc: 'Create clear, linear paths to resolution' },
                { icon: '👤', title: 'Reduce agent dependency', desc: 'Lower the 90% escalation rate significantly' },
                { icon: '📈', title: 'Increase engagement', desc: 'Drive more value from the website experience' },
              ].map(g => (
                <div key={g.title} className="p-5 rounded-xl bg-gray-50">
                  <span className="text-[24px] block mb-3">{g.icon}</span>
                  <p className="text-[14px] font-semibold text-gray-800 mb-1">{g.title}</p>
                  <p className="text-[13px] text-gray-400">{g.desc}</p>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection id="process">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#4b286d] font-medium mb-3">Process</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">How I Solved It</h2>
            <div className="space-y-8">
              {[
                { num: '01', title: 'Card Sorting Workshop', desc: 'Organized a cross-functional workshop with team members and a live agent to categorize and prioritize chatbot features, eliminating unnecessary options.', image: '/telus-cardsorting.avif' },
                { num: '02', title: 'Service Design Thinking', desc: 'Mapped end-to-end customer experiences across chatbot-to-agent-to-resolution touchpoints for seamless handoffs.' },
                { num: '03', title: 'Conversation Design', desc: 'Applied human-centered communication strategies emphasizing natural, helpful, and context-aware interactions.' },
                { num: '04', title: 'Design Iterations', desc: 'Streamlined user flows, redesigned quick-reply buttons, created error states, introduced carousel-based catalogues, and developed post-interaction surveys.' },
              ].map(step => (
                <div key={step.num} className="flex gap-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#4b286d] text-white text-[13px] font-bold flex items-center justify-center">{step.num}</div>
                  <div className="pt-1 flex-1">
                    <p className="text-[16px] font-semibold text-gray-800 mb-2">{step.title}</p>
                    <p className="text-[14px] text-gray-500 leading-relaxed">{step.desc}</p>
                    {step.image && (
                      <div className="mt-4 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <img src={step.image} alt={step.title} className="w-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection id="userflow">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#4b286d] font-medium mb-3">User Flow</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-8">Before & After</h2>

            {/* Before */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Before</p>
              </div>
              <div className="relative p-6 rounded-2xl bg-red-50/40 border border-red-100">
                {/* Flow diagram */}
                <div className="flex items-center gap-3 flex-wrap">
                  <FlowNode color="#4b286d" text="User Opens Chat" />
                  <FlowArrow />
                  <FlowNode color="#4b286d" text="Tutorial" />
                  <FlowArrow />
                  <div className="flex flex-col gap-2">
                    <FlowNode color="#2b8000" text="Existing Customer" small />
                    <FlowNode color="#2b8000" text="Let's get started" small />
                  </div>
                  <FlowArrow />
                  <div className="flex flex-col gap-1.5">
                    <FlowNode color="white" text="Mobility" small border />
                    <FlowNode color="white" text="Home Services" small border />
                    <FlowNode color="white" text="Internet" small border />
                    <FlowNode color="white" text="TV" small border />
                    <FlowNode color="white" text="Home Phone" small border />
                    <FlowNode color="white" text="SmartHome" small border />
                  </div>
                </div>
                <p className="text-[12px] text-red-400 mt-4 italic">Too many options → user confusion → 90% escalation to agents</p>
              </div>
            </div>

            {/* After */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider">After</p>
              </div>
              <div className="relative p-6 rounded-2xl bg-green-50/40 border border-green-100">
                <div className="flex items-start gap-4">
                  {/* Path 1: Logged in */}
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 mb-2 font-medium">Already logged in</p>
                    <div className="flex items-center gap-2">
                      <FlowNode color="#4b286d" text="Open Chat" small />
                      <FlowArrow />
                      <FlowNode color="#4b286d" text="Quick Replies" small />
                      <FlowArrow />
                      <FlowNode color="#2b8000" text="Resolved ✓" small />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-100">
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 mb-2 font-medium">Not logged in</p>
                    <div className="flex items-center gap-2">
                      <FlowNode color="#4b286d" text="Open Chat" small />
                      <FlowArrow />
                      <FlowNode color="white" text="In-chat Login" small border />
                      <FlowArrow />
                      <FlowNode color="#4b286d" text="Quick Replies" small />
                      <FlowArrow />
                      <FlowNode color="#2b8000" text="Resolved ✓" small />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-100">
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 mb-2 font-medium">New customer</p>
                    <div className="flex items-center gap-2">
                      <FlowNode color="#4b286d" text="Open Chat" small />
                      <FlowArrow />
                      <FlowNode color="white" text="Sign Up" small border />
                      <FlowArrow />
                      <FlowNode color="#4b286d" text="Browse Plans" small />
                      <FlowArrow />
                      <FlowNode color="#2b8000" text="Resolved ✓" small />
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-green-600 mt-4 italic">Streamlined paths → clear resolution → 50% reduction in agents</p>
              </div>
            </div>
          </ContentSection>

          <ContentSection id="solutions">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#4b286d] font-medium mb-3">Solutions</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">Key Design Decisions</h2>
            {/* Streamlined quick replies */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#2b8000] mt-2 flex-shrink-0" />
              <div>
                <p className="text-[14px] font-semibold text-gray-800">Streamlined quick replies</p>
                <p className="text-[13px] text-gray-400 mt-0.5">Narrowed options to the most commonly asked questions based on live agent data</p>
              </div>
            </div>

            {/* Interactive prototype */}
            <div className="ml-8">
              <PrototypeOnScroll />
            </div>


            {/* In-chat authentication */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#2b8000] mt-2 flex-shrink-0" />
              <div>
                <p className="text-[14px] font-semibold text-gray-800">In-chat authentication</p>
                <p className="text-[13px] text-gray-400 mt-0.5">Implemented sign-in/sign-up so users never lose conversation context</p>
              </div>
            </div>

            {/* Before & After — under In-chat authentication */}
            <div className="mb-10 ml-8">
              <p className="text-[13px] font-semibold text-gray-700 mb-4">Existing Customer Experience</p>
              <div className="flex gap-4 mb-4 items-start">
                {/* Before */}
                <div className="w-[280px] flex-shrink-0 rounded-2xl overflow-hidden border border-red-100 flex flex-col">
                  <div className="bg-red-50 px-3 py-2 flex items-center gap-2 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Before</span>
                  </div>
                  <div className="overflow-hidden">
                    <img src="/telus-beforeauth.jpg" alt="Before authentication flow" className="w-full object-contain" />
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center flex-shrink-0">
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                    <path d="M2 12h24M20 6l6 6-6 6" stroke="#4b286d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* After */}
                <div className="w-[280px] flex-shrink-0 flex flex-col rounded-2xl overflow-hidden border border-green-100">
                  <div className="bg-green-50 px-3 py-2 flex items-center gap-2 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[11px] font-semibold text-green-600 uppercase tracking-wider">After</span>
                  </div>
                  <div className="flex-1 bg-white overflow-hidden flex flex-col">
                    <div className="flex flex-col flex-1" style={{ fontFamily: 'Helvetica, system-ui, sans-serif' }}>
                      {/* Purple header */}
                      <div className="bg-[#4b286d] flex items-center gap-2 px-3 py-2.5 rounded-t-[6px]">
                        <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                          <circle cx="14" cy="16" r="2.5" fill="white" />
                          <circle cx="26" cy="16" r="2.5" fill="white" />
                          <path d="M13 24c3 4 11 4 14 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-white text-[13px] font-semibold">TELUS Assist</span>
                        <div className="flex-1" />
                        <div className="flex gap-1">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"><path d="M5 12h14"/></svg>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </div>
                      </div>

                      {/* Intro */}
                      <div className="flex flex-col items-center pt-8 pb-6 bg-white">
                        <div className="w-[80px] h-[80px] bg-[#4b286d] rounded-tl-[8px] rounded-tr-[8px] rounded-bl-[8px] flex items-center justify-center mb-3">
                          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <circle cx="21" cy="24" r="4" fill="white" />
                            <circle cx="43" cy="24" r="4" fill="white" />
                            <path d="M17 43c6 7 24 7 30 0" stroke="white" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                        </div>
                        <p className="text-[13px] font-bold text-[#2c2e30]">Connected with TELUS Assist</p>
                        <p className="text-[11px] text-[#2a2c2e]">Tuesday, 20 July, 10:00</p>
                      </div>

                      {/* Messages */}
                      <div className="px-4 pb-4 bg-white space-y-3">
                        <div className="bg-[#f2eff4] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] px-4 py-2.5 max-w-[85%]">
                          <p className="text-[13px] text-[#2a2c2e]">👋 Hi Joe, I'm TELUS Assist for TV Bundles & Deals.</p>
                        </div>
                        <div className="bg-[#f2eff4] rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] px-4 py-2.5 max-w-[85%]">
                          <p className="text-[13px] text-[#2a2c2e]">To get started, select one of the options below.</p>
                        </div>
                      </div>

                      {/* Quick reply buttons */}
                      <div className="px-3 pb-4 bg-white flex flex-wrap gap-1.5 flex-1">
                        {['Add, manage or upgrade', 'TV programming', 'TV bundles', 'I need technical support', 'Bundle Builder', 'Best deals'].map(opt => (
                          <span key={opt} className="text-[10px] font-bold border-[1.5px] border-[#248700] text-[#248700] rounded-full px-3 py-1.5 hover:bg-[#e8f5e0] transition-colors cursor-default">{opt}</span>
                        ))}
                      </div>

                      {/* Input */}
                      <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center gap-2 shadow-[0_-1px_3px_rgba(0,0,0,0.08)] flex-shrink-0 mt-auto">
                        <div className="flex-1 border border-[#d8d8d8] rounded-full px-4 py-2 text-[13px] text-[#71757b]">Type your message</div>
                        <div className="w-[28px] h-[28px] rounded-full bg-[#4b286d] flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-[11px] text-green-700">
                  <span>✓</span> Authenticated logged-in user
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-[11px] text-green-700">
                  <span>✓</span> Commonly asked questions about service
                </div>
              </div>
            </div>

            {/* Before & After — New Customer (animated) */}
            <div className="mb-10 ml-8">
              <p className="text-[13px] font-semibold text-gray-700 mb-4">New Customer Experience</p>
              <div className="flex gap-4 mb-4 items-stretch" style={{ maxWidth: '800px' }}>
                {/* Before — animated */}
                <div className="flex-1 rounded-2xl overflow-hidden border border-red-100 flex flex-col">
                  <div className="bg-red-50 px-3 py-2 flex items-center gap-2 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Before</span>
                  </div>
                  <div className="flex-1 bg-white overflow-hidden">
                    <BeforeNewCustomerAnim />
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center flex-shrink-0">
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                    <path d="M2 12h24M20 6l6 6-6 6" stroke="#4b286d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* After — animated */}
                <div className="flex-1 rounded-2xl overflow-hidden border border-green-100 flex flex-col">
                  <div className="bg-green-50 px-3 py-2 flex items-center gap-2 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[11px] font-semibold text-green-600 uppercase tracking-wider">After</span>
                  </div>
                  <div className="flex-1 bg-white overflow-hidden">
                    <AfterNewCustomerAnim />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-[11px] text-green-700">
                  <span>✓</span> Simplified onboarding
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-[11px] text-green-700">
                  <span>✓</span> Reduced options from 6 to 3
                </div>
              </div>
            </div>

            {/* Consistent patterns */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#2b8000] mt-2 flex-shrink-0" />
              <div>
                <p className="text-[14px] font-semibold text-gray-800">Consistent patterns</p>
                <p className="text-[13px] text-gray-400 mt-0.5">Established button and interaction patterns across the entire platform</p>
              </div>
            </div>

            {/* Error state system */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#2b8000] mt-2 flex-shrink-0" />
              <div>
                <p className="text-[14px] font-semibold text-gray-800">Error state system</p>
                <p className="text-[13px] text-gray-400 mt-0.5">Created definitions for the design system to handle edge cases gracefully</p>
              </div>
            </div>

            {/* Error states animation */}
            <div className="ml-8 mb-8">
              <ErrorStatesAnim />
            </div>

            {/* Remaining solutions */}
            <div className="space-y-4">
              {[
                { title: 'Carousel catalogues', desc: 'Redesigned product browsing from scrollable lists to swipeable carousels' },
                { title: 'Smart surveys', desc: 'Star-rating surveys with conditional follow-up questions for better feedback' },
              ].map(s => (
                <div key={s.title} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-[#2b8000] mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-[14px] font-semibold text-gray-800">{s.title}</p>
                    <p className="text-[13px] text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection id="results">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#4b286d] font-medium mb-3">Results</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">The Impact</h2>
            <div className="flex gap-8 mb-10">
              {[
                { value: '200%', label: 'User adoption increase', icon: '↑', color: '#22c55e' },
                { value: '50%', label: 'Reduction in live agents', icon: '↓', color: '#4b286d' },
              ].map(s => (
                <div key={s.label} className="flex-1 p-6 rounded-2xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[14px] font-bold" style={{ color: s.color }}>{s.icon}</span>
                    <span className="text-[32px] font-bold text-gray-900">{s.value}</span>
                  </div>
                  <p className="text-[13px] text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-[#f4f9f2] mb-8">
              <p className="text-[15px] text-gray-600 italic leading-relaxed">
                "The layouts were ingeniously conceived, advancing our partnership and fostering cross-team collaboration."
              </p>
              <p className="text-[13px] text-gray-500 mt-3 font-medium">Product Manager, TELUS (NDA Protected)</p>
            </div>
            <div className="mb-4 p-6 rounded-2xl bg-gray-50">
              <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-3">From leadership</p>
              <p className="text-[15px] text-gray-700 leading-relaxed italic">
                "Way to go Ayesha! 👏 Extremely proud of your contribution, dedication and impact! We are indeed very fortunate to have Ayesha on the team."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <img src="/rec-farooq.jpeg" alt="Farooq Ali" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-[13px] font-semibold text-gray-800 leading-tight">Farooq Ali</p>
                  <p className="text-[11px] text-gray-500 leading-tight">Head of Product & Design · US West Market, Thoughtworks</p>
                </div>
              </div>
            </div>

            <div className="relative group mb-3">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 cursor-pointer">
                <span className="text-[20px]">⭐</span>
                <p className="text-[14px] text-gray-600">Google Cloud featured the chatbot in their official case study <span className="text-[#4b286d] font-medium">(hover to see)</span></p>
              </div>
              {/* Hover popup */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[400px] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                  <img src="/telus-google-result.png" alt="Google Cloud case study feature" className="w-full object-cover" />
                </div>
                <div className="w-4 h-4 bg-white border-b border-r border-gray-200 rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2" />
              </div>
            </div>

            {/* Hover-to-reveal Thoughtworks case study link */}
            <div className="relative group">
              <a
                href="https://www.thoughtworks.com/clients/telus-digital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-[#f4f9f2] cursor-pointer no-underline"
              >
                <span className="text-[20px]">🔗</span>
                <p className="text-[14px] text-gray-600">
                  Read how Thoughtworks worked with TELUS to lift customer advocacy and app store ratings <span className="text-[#4b286d] font-medium">(hover to preview, click to open)</span>
                </p>
              </a>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[260px] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white p-4">
                  <div className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-1">thoughtworks.com</div>
                  <p className="text-[14px] font-semibold text-gray-900 mb-1">TELUS Digital · Client story</p>
                </div>
                <div className="w-4 h-4 bg-white border-b border-r border-gray-200 rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2" />
              </div>
            </div>
          </ContentSection>

        </div>
      </div>

      <style>{`
        @keyframes heroFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
