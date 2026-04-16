import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

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

const tocItems = [
  { id: 'background', label: 'Background' },
  { id: 'problem', label: 'Problem' },
  { id: 'research', label: 'Research' },
  { id: 'process', label: 'Process' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'results', label: 'Results' },
]

export default function ViewerCaseStudy() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('background')

  useEffect(() => {
    window.scrollTo(0, 0)
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
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div className="min-h-screen bg-white" style={{ cursor: 'auto' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M5 12l7-7M5 12l7 7" />
        </svg>
      </button>

      {/* ── HERO ── */}
      <div className="relative w-full h-[85vh] overflow-hidden bg-black">
        {/* Background video/gif */}
        <div className="absolute inset-0 opacity-40">
          <img src="/viewer-desktop.gif" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <div className="flex items-center gap-3 mb-6" style={{ animation: 'heroFade 0.8s ease-out 0.2s both' }}>
            <img src="/napster-logo.png" alt="Napster" className="h-8 object-contain opacity-80 invert" />
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl text-white leading-tight max-w-[700px] mb-6" style={{ animation: 'heroFade 0.8s ease-out 0.4s both' }}>
            A Canvas for Immersive Brand Storytelling
          </h1>
          <p className="text-[17px] text-white/70 max-w-[500px] leading-relaxed mb-10" style={{ animation: 'heroFade 0.8s ease-out 0.6s both' }}>
            Redesigning the Viewer platform to transform passive browsing into active 3D exploration.
          </p>
          <div className="flex gap-8 text-[13px] text-white/50" style={{ animation: 'heroFade 0.8s ease-out 0.8s both' }}>
            <div className="text-center">
              <p className="font-semibold text-white/70">Role</p>
              <p>Lead Visual & Product Designer</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-white/70">Timeline</p>
              <p>2 months</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-white/70">Tools</p>
              <p>Figma, Midjourney, Claude</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-white/70">Platform</p>
              <p>Web, Phone & VR</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40" style={{ animation: 'heroFade 0.8s ease-out 1s both' }}>
          <span className="text-[11px] tracking-widest uppercase">Scroll</span>
          <div className="w-[20px] h-[32px] rounded-full border-2 border-white/30 flex justify-center pt-1.5">
            <div className="w-[2px] h-[6px] bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
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
                    color: activeSection === item.id ? '#1a1a1a' : '#9ca3af',
                    fontWeight: activeSection === item.id ? 600 : 400,
                    background: activeSection === item.id ? 'rgba(0,0,0,0.04)' : 'transparent',
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
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Background</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">The Platform</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-4">
              Napster is an AI-powered technology and entertainment company specializing in immersive 3D experiences. Following its acquisition by Infinite Reality for $207 million, the company transitioned to developing interactive 3D digital environments.
            </p>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
              The Viewer platform functions within a three-component ecosystem — the Editor for creating environments, the Dashboard for analytics, and the Viewer for immersive exploration, interaction, and shopping.
            </p>
            <div className="flex gap-4">
              {[
                { icon: '🎨', title: 'Editor', desc: 'Web-based 3D creation tool' },
                { icon: '📊', title: 'Dashboard', desc: 'Analytics & management' },
                { icon: '👁️', title: 'Viewer', desc: 'Immersive player experience' },
              ].map(item => (
                <div key={item.title} className="flex-1 p-4 rounded-xl bg-gray-50">
                  <span className="text-[20px] block mb-2">{item.icon}</span>
                  <p className="text-[13px] font-semibold text-gray-800">{item.title}</p>
                  <p className="text-[11px] text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection id="problem">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Problem</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">Beyond a Visual Refresh</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              The initial directive requested a visual refresh with glassmorphism rebranding. However, research revealed deeper issues — the platform created user confusion and lacked social foundations.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'Low trust during first sessions',
                'High user drop-off rates',
                'Unclear functionality for key features',
                'Interface hierarchy was confusing',
                'Visual design lacked personality',
              ].map(item => (
                <div key={item} className="flex items-start gap-3 p-4 rounded-xl bg-red-50/50">
                  <span className="text-red-400 mt-0.5">✕</span>
                  <p className="text-[14px] text-gray-600">{item}</p>
                </div>
              ))}
            </div>
            <div className="border-l-4 border-gray-900 pl-6 py-2">
              <p className="text-[16px] text-gray-700 italic leading-relaxed">
                The challenge extended beyond aesthetics to encompassing usability, user needs alignment, and platform goals.
              </p>
            </div>
          </ContentSection>

          <ContentSection id="research">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Research</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">Understanding Users</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              I studied three core user groups — consumers, enterprise brands, and independent creators — through observational testing, interviews, and surveys.
            </p>

            {/* Usability test results */}
            <div className="flex gap-6 mb-8 p-6 rounded-2xl bg-gray-50">
              {[
                { value: '10%', label: 'Could lower store volume', color: '#ef4444' },
                { value: '60%', label: 'Could chat with others', color: '#f59e0b' },
                { value: '70%', label: 'Enjoyed the experience', color: '#22c55e' },
              ].map(s => (
                <div key={s.label} className="flex-1 text-center">
                  <p className="text-[28px] font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <h3 className="text-[16px] font-semibold text-gray-800 mb-4">Key Findings</h3>
            <div className="space-y-3">
              {[
                { title: 'Discovery needed structure', desc: 'Users enjoyed exploring but struggled understanding interaction mechanics' },
                { title: 'Social features were essential', desc: 'Users expected peer interaction similar to Roblox' },
                { title: 'Interface hierarchy was unclear', desc: 'Settings and chat controls were difficult to locate' },
                { title: 'Visual design lacked personality', desc: 'Interface felt flat and outdated' },
              ].map((f, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100">
                  <span className="text-[12px] font-mono text-gray-300 font-bold mt-0.5">0{i + 1}</span>
                  <div>
                    <p className="text-[14px] font-semibold text-gray-800">{f.title}</p>
                    <p className="text-[13px] text-gray-400 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection id="process">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Process</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">Minimum Lovable Product</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              Rather than a complete redesign, I prioritized high-impact improvements through an MLP strategy with incremental burst testing — shipping small improvements, observing real user behavior, identifying friction, and refining.
            </p>
            <div className="space-y-6">
              {[
                { num: '01', title: 'Clearer Navigation', desc: 'Improved controls and wayfinding throughout the 3D environment' },
                { num: '02', title: 'Settings Discoverability', desc: 'Made settings and controls easier to find and use' },
                { num: '03', title: 'Social Interaction Cues', desc: 'Added early signals that other users are present and interactive' },
                { num: '04', title: 'Glassmorphism Alignment', desc: 'Visual alignment with the new design system across all platforms' },
              ].map(step => (
                <div key={step.num} className="flex gap-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 text-white text-[13px] font-bold flex items-center justify-center">{step.num}</div>
                  <div className="pt-1">
                    <p className="text-[16px] font-semibold text-gray-800 mb-2">{step.title}</p>
                    <p className="text-[14px] text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection id="solutions">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Solutions</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">Key Design Decisions</h2>
            <div className="space-y-4">
              {[
                { title: 'Portrait mode responsiveness', desc: 'Added portrait support — users hold phones upright 95% of the time, reducing onboarding friction' },
                { title: 'Visual noise reduction', desc: 'Reorganized controls into collapsible sidebar groupings for immersive focus' },
                { title: 'Progressive onboarding', desc: 'Default-open menu for first-time users; collapses for returning users' },
                { title: 'Interactive hotspots', desc: 'Redesigned from static squares to animated pulsing circles to guide attention naturally' },
                { title: 'Settings redesign', desc: 'Table-style layout replacing tabs — reduced navigation from 3 clicks to 1' },
                { title: 'Chat & video integration', desc: 'Full-screen default for mobile; sidebar placement for desktop multitasking' },
                { title: 'Creator vs. guest permissions', desc: 'Creators access additional controls; guests see only relevant settings' },
              ].map(s => (
                <div key={s.title} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-[14px] font-semibold text-gray-800">{s.title}</p>
                    <p className="text-[13px] text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection id="results">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Results</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">The Impact</h2>
            <div className="grid grid-cols-2 gap-4 mb-10">
              {[
                { value: '204%', label: 'Increase in session time vs. e-commerce', icon: '↑', color: '#22c55e' },
                { value: '182%', label: 'Higher conversion vs. e-commerce', icon: '↑', color: '#22c55e' },
                { value: '90%', label: 'Flow completion click-through rate', icon: '↑', color: '#22c55e' },
                { value: '7%', label: 'Average conversion from virtual stores', icon: '↑', color: '#22c55e' },
              ].map(s => (
                <div key={s.label} className="p-5 rounded-2xl bg-gray-50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-bold" style={{ color: s.color }}>{s.icon}</span>
                    <span className="text-[28px] font-bold text-gray-900">{s.value}</span>
                  </div>
                  <p className="text-[12px] text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>

            <h3 className="text-[16px] font-semibold text-gray-800 mb-4">Post-Launch Testing</h3>
            <div className="flex gap-6 mb-8 p-6 rounded-2xl bg-green-50/50">
              {[
                { value: '100%', label: 'Enjoyed the experience' },
                { value: '90%', label: 'Task completion rate' },
                { value: '+4', label: 'Returning brands for launches' },
              ].map(s => (
                <div key={s.label} className="flex-1 text-center">
                  <p className="text-[24px] font-bold text-gray-900">{s.value}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 mb-6">
              <p className="text-[15px] text-gray-600 italic leading-relaxed">
                "I like how clean it looks. I can find the settings now."
              </p>
              <p className="text-[13px] text-gray-400 mt-3 font-medium">— User feedback, post-launch testing</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50">
              <p className="text-[15px] text-gray-600 italic leading-relaxed">
                "Exploring products in 3D space is fun... We can use this for smaller, quicker campaigns."
              </p>
              <p className="text-[13px] text-gray-400 mt-3 font-medium">— Brand partner feedback</p>
            </div>
          </ContentSection>

        </div>
      </div>

      <style>{`
        @keyframes heroFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
