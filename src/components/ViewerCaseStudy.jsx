import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ViewerPrototype from './ViewerPrototype'

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
  const [fullscreenImg, setFullscreenImg] = useState(null)

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
          <img src="/viewer-hero.gif" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <div className="flex items-center gap-3 mb-6" style={{ animation: 'heroFade 0.8s ease-out 0.2s both' }}>
            <img src="/napster-logo.png" alt="Napster" className="h-8 object-contain brightness-0 invert opacity-80" />
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl text-white leading-tight max-w-[700px] mb-6" style={{ animation: 'heroFade 0.8s ease-out 0.4s both' }}>
            A Canvas for Immersive Brand Storytelling
          </h1>
          <p className="text-[17px] text-white/70 max-w-[500px] leading-relaxed mb-10" style={{ animation: 'heroFade 0.8s ease-out 0.6s both' }}>
            Redesigning the Viewer platform to transform passive browsing into active 3D exploration.
          </p>
          <div className="flex gap-6 text-[13px] text-white/50 flex-wrap justify-center" style={{ animation: 'heroFade 0.8s ease-out 0.8s both' }}>
            <div>
              <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-0.5">Role</span>
              <span className="text-white/80">Lead Visual & Product Designer</span>
            </div>
            <div className="w-[1px] bg-white/15 self-stretch" />
            <div>
              <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-0.5">Timeline</span>
              <span className="text-white/80">2 months</span>
            </div>
            <div className="w-[1px] bg-white/15 self-stretch" />
            <div>
              <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-0.5">Tools</span>
              <span className="text-white/80">Figma, Midjourney, Claude</span>
            </div>
            <div className="w-[1px] bg-white/15 self-stretch" />
            <div>
              <span className="text-white/40 text-[10px] uppercase tracking-wider block mb-0.5">Platform</span>
              <span className="text-white/80">Web, Phone & VR</span>
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
        {/* Left – sticky TOC */}
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

        {/* Right – scrolling content */}
        <div className="flex-1 max-w-[700px]">

          <ContentSection id="background">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Background</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">The Platform</h2>

            {/* Company background gif */}
            <div className="mb-6 rounded-2xl overflow-hidden h-[260px]">
              <img src="/viewer-bg.gif" alt="Napster" className="w-full h-full object-cover" />
            </div>

            {/* Napster description card */}
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-100">
              <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-2">About Napster</p>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                Napster is an innovative technology and entertainment company focused on developing AI-powered, 3D immersive experiences. In March 2025, Napster was acquired by Infinite Reality for $207 million, marking a major strategic shift from its legacy music-streaming platform to an AI-driven immersive technology company. Today, Napster is focused on <strong className="text-gray-800">building agentic AI systems, virtual experiences, and interactive 3D digital environments</strong>.
              </p>
            </div>

            {/* Global clients — outside the card */}
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-1">Some of our Global Clients</p>
              <img src="/viewer-companies.png" alt="Global clients" className="w-full object-contain -mt-2" style={{ mixBlendMode: 'multiply' }} />
            </div>

            <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
              The Viewer platform functions within a three-component ecosystem: the Editor for creating environments, the Dashboard for analytics, and the Viewer for immersive exploration, interaction, and shopping.
            </p>
            <div className="flex flex-col gap-5">
              {[
                { title: 'Editor', desc: 'Web-based 3D creation tool', image: '/viewer-editor.gif', pos: 'top', offsetY: '-10px' },
                { title: 'Dashboard', desc: 'Analytics & management', image: '/viewer-dashboard.png', pos: 'top' },
                { title: 'Viewer', desc: 'Immersive player experience', image: '/viewer-viewer.gif', pos: 'top' },
              ].map(item => (
                <div key={item.title} className="rounded-2xl overflow-hidden border border-gray-100">
                  <div className={`h-[450px] overflow-hidden ${item.pad ? 'px-4 py-2 bg-black' : ''}`}>
                    <img src={item.image} alt={item.title} className={`w-full h-full ${item.contain ? 'object-contain' : 'object-cover'}`} style={{ objectPosition: item.pos, marginTop: item.offsetY || 0 }} />
                  </div>
                  <div className="p-4">
                    <p className="text-[14px] font-semibold text-gray-800">{item.title}</p>
                    <p className="text-[12px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection id="problem">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Problem</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">Beyond a Visual Refresh</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              The initial directive requested a visual refresh with glassmorphism rebranding. However, research revealed deeper issues. The platform created user confusion and lacked social foundations.
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
              I studied three core user groups (consumers, enterprise brands, and independent creators) through observational testing, interviews, and surveys.
            </p>

            {/* Old Viewer reference */}
            <div className="mb-8">
              <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                <img src="/viewer-old.png" alt="The original Viewer experience" className="w-full h-auto block" />
              </div>
              <p className="text-[12px] text-gray-400 italic mt-2 text-center">The original Viewer experience users tested against.</p>
            </div>

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
            <div className="space-y-3 mb-10">
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

            {/* Platform decision — mobile-first */}
            <h3 className="text-[16px] font-semibold text-gray-800 mb-4">Why Mobile, Why Portrait</h3>
            <div className="flex items-stretch gap-3 mb-10">
              <div className="flex-1 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-[28px] font-bold text-[#4b286d]">70%</p>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">of e-commerce purchases happen on mobile, most of them in portrait mode.</p>
              </div>
              <div className="flex-[1.4] p-5 rounded-2xl border border-gray-100">
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  That single data point reframed the scope. Instead of designing for the ideal headset or desktop demo, I prioritised the context users actually buy in, one thumb, a phone held upright, and a few seconds of attention.
                </p>
              </div>
            </div>

            {/* Strategic insight — campaign velocity */}
            <h3 className="text-[16px] font-semibold text-gray-800 mb-4">A Strategic Opportunity</h3>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50/60 via-pink-50/40 to-blue-50/40 border border-purple-100 mb-4">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#4b286d]/70 font-semibold mb-2">Hypothesis</p>
              <p className="text-[15px] text-gray-700 leading-relaxed">
                If Viewer reached a polished, systemised look, brands could launch smaller, faster campaigns, shifting the model from a 2–3 month, all-hands effort (3D artists, developers, designers, and PMs) to lightweight, reusable drops that ship in days.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-xl border border-gray-100">
                <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-1">Before</p>
                <p className="text-[13px] text-gray-600 leading-relaxed">Every activation was a bespoke, months-long production requiring full cross-functional teams.</p>
              </div>
              <div className="p-4 rounded-xl border border-[#4b286d]/15 bg-[#4b286d]/[0.03]">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#4b286d]/70 font-semibold mb-1">After</p>
                <p className="text-[13px] text-gray-700 leading-relaxed">A shared design system unlocks templated worlds and product drops, lowering the barrier for smaller brands and repeat campaigns.</p>
              </div>
            </div>
            <p className="text-[13px] text-gray-400 italic leading-relaxed">
              This reframed the refresh as more than a visual upgrade, it became the foundation for a scalable, brand-friendly commerce platform.
            </p>
          </ContentSection>

          <ContentSection id="process">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Process</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">
              Minimum <span className="text-gray-300 line-through decoration-gray-400">Viable</span> Lovable Product
            </h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              To reduce risk, engineering and I tested the Viewer experience in short iterative bursts rather than a single large release. Each cycle validated a small set of hypotheses with real users.
            </p>

            {/* Testing cycle */}
            <div className="mb-8 p-5 rounded-2xl bg-gray-50">
              <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-3">Testing Cycle</p>
              <div className="flex items-center gap-2 flex-wrap">
                {['Ship', 'Observe', 'Identify friction', 'Refine', 'Retest'].map((step, i, arr) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-gray-800 px-3 py-1.5 rounded-full bg-white border border-gray-200">{step}</span>
                    {i < arr.length - 1 && (
                      <svg width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M0 4h12M9 1l3 3-3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
              These bursts helped us quickly identify where users struggled most. For example, testing revealed that while users enjoyed exploring the world, many struggled to locate core settings or understand interaction controls. That insight prioritized navigation clarity and UI hierarchy in later iterations.
            </p>

            {/* Burst test example */}
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#4b286d]/70 font-semibold mb-2">Burst Testing</p>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-3">Simplifying the Interface</h3>
              <p className="text-[14px] text-gray-500 leading-relaxed mb-5">
                The first burst test focused on validating the placement of core interaction elements. I introduced a cleaned-up layout with the primary menu consolidated to the right side of the screen, along with early experiments around video interaction and UI hierarchy.
              </p>

              {/* MLP images */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { src: '/viewer-mlp1.png', label: 'Iteration 1' },
                  { src: '/viewer-mlp2.png', label: 'Iteration 2' },
                  { src: '/viewer-mlp3.png', label: 'Iteration 3' },
                ].map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setFullscreenImg(img)}
                    className="rounded-xl overflow-hidden border border-gray-100 relative group cursor-pointer"
                  >
                    <img src={img.src} alt={img.label} className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4b286d" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center py-2 bg-gray-50">{img.label}</p>
                  </button>
                ))}
              </div>

              <p className="text-[13px] text-gray-500 leading-relaxed mb-3">During testing, I evaluated:</p>
              <ul className="space-y-2 mb-5">
                {[
                  'How quickly users discovered the menu',
                  'Whether right-side placement felt intuitive during navigation',
                  'How users interacted with video and social controls',
                  'How UI placement affected movement in 3D space',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-[13px] text-gray-600">
                    <span className="text-gray-300 mt-0.5">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-[14px] text-gray-500 leading-relaxed italic">
                Because the test was intentionally lightweight, we could observe real user behavior without committing to a full redesign. Each iteration moved the Viewer closer to a more intuitive and engaging immersive platform.
              </p>
            </div>
          </ContentSection>

          <ContentSection id="solutions">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Solutions</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">Key Design Decisions</h2>

            {/* Interactive 3D Prototype */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/30 border border-purple-100">
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#4b286d]/70 font-semibold mb-1">Interactive Prototype</p>
              <p className="text-[13px] text-gray-500 mb-4">Try it below.</p>
              <ViewerPrototype />
            </div>
            <div className="space-y-4">
              {[
                { title: 'Portrait mode responsiveness', desc: 'Added portrait support. Users hold phones upright 95% of the time, reducing onboarding friction' },
                { title: 'Visual noise reduction', desc: 'Reorganized controls into collapsible sidebar groupings for immersive focus' },
                { title: 'Progressive onboarding', desc: 'Default-open menu for first-time users; collapses for returning users' },
                { title: 'Interactive hotspots', desc: 'Redesigned from static squares to animated pulsing circles to guide attention naturally' },
                { title: 'Settings redesign', desc: 'Table-style layout replacing tabs, reducing navigation from 3 clicks to 1' },
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
              <p className="text-[13px] text-gray-400 mt-3 font-medium">User feedback, post-launch testing</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50">
              <p className="text-[15px] text-gray-600 italic leading-relaxed">
                "Exploring products in 3D space is fun... We can use this for smaller, quicker campaigns."
              </p>
              <p className="text-[13px] text-gray-400 mt-3 font-medium">Brand partner feedback</p>
            </div>
          </ContentSection>

        </div>
      </div>

      {/* Fullscreen image viewer */}
      {fullscreenImg && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => setFullscreenImg(null)}
          style={{ animation: 'fsFade 0.3s ease' }}
        >
          <img
            src={fullscreenImg.src}
            alt={fullscreenImg.label}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setFullscreenImg(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-xl hover:bg-white/20 transition-colors"
          >
            ×
          </button>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-[12px] font-medium">{fullscreenImg.label}</p>
        </div>
      )}

      <style>{`
        @keyframes fsFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes heroFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
