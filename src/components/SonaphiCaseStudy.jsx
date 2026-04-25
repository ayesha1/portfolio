import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import SonaphiQuestionnairePrototype from './SonaphiQuestionnairePrototype'
import LiveVoiceDemo from './LiveVoiceDemo'

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

export default function SonaphiCaseStudy() {
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
        onClick={() => navigate('/#case-sonaphi')}
        className="fixed top-6 left-6 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M5 12l7-7M5 12l7 7" />
        </svg>
      </button>

      {/* ── HERO ── */}
      <div
        className="relative w-full h-[85vh] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2a1a5e 0%, #3b4465 40%, #5f69ef 80%, #8685f1 100%)',
        }}
      >
        {/* Background voice video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.55, mixBlendMode: 'screen' }}
        >
          <source src="/sonaphi-voice.mp4" type="video/mp4" />
        </video>
        {/* Soft purple wash to keep the text legible */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(42,26,94,0.45) 0%, rgba(95,105,239,0.35) 60%, rgba(134,133,241,0.4) 100%)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <div className="relative">
            {/* Feathered backdrop blur halo behind the text */}
            <div
              className="absolute inset-0 backdrop-blur-[10px] pointer-events-none"
              style={{
                maskImage: 'radial-gradient(ellipse farthest-side at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 18%, rgba(0,0,0,0.5) 38%, rgba(0,0,0,0.28) 58%, rgba(0,0,0,0.12) 75%, rgba(0,0,0,0.04) 88%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse farthest-side at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 18%, rgba(0,0,0,0.5) 38%, rgba(0,0,0,0.28) 58%, rgba(0,0,0,0.12) 75%, rgba(0,0,0,0.04) 88%, transparent 100%)',
                margin: '-160px',
                padding: '160px',
                borderRadius: '240px',
              }}
            />

            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-6" style={{ animation: 'heroFade 0.8s ease-out 0.2s both' }}>
                <img src="/sonaphi-logo.png" alt="Sonaphi" className="h-8 object-contain brightness-0 invert opacity-90" />
              </div>
              <h1 className="font-serif text-4xl lg:text-6xl text-white leading-tight max-w-[780px] mb-6" style={{ animation: 'heroFade 0.8s ease-out 0.4s both' }}>
                Research App that Powers AI COVID-19 Testing
              </h1>
              <p className="text-[17px] text-white/75 max-w-[560px] leading-relaxed mb-10 mx-auto" style={{ animation: 'heroFade 0.8s ease-out 0.6s both' }}>
                Redesigning a clinical voice-research app to fuel an AI model that detects COVID-19 from the sound of a cough.
              </p>
              <div className="flex gap-6 text-[13px] text-white/60 flex-wrap justify-center" style={{ animation: 'heroFade 0.8s ease-out 0.8s both' }}>
                <div><span className="uppercase tracking-wider text-white/40 mr-2">Role</span>Founding UX Designer</div>
                <div><span className="uppercase tracking-wider text-white/40 mr-2">Duration</span>7 weeks</div>
                <div><span className="uppercase tracking-wider text-white/40 mr-2">Year</span>2021</div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes heroFade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>

      {/* ── MAIN ── */}
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-24 pb-32 flex gap-16">
        {/* TOC */}
        <aside className="hidden lg:block sticky top-24 self-start w-[180px] flex-shrink-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">Contents</p>
          <ul className="space-y-2">
            {tocItems.map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-[13px] transition-colors block py-1"
                  style={{
                    color: activeSection === item.id ? '#5f69ef' : '#9ca3af',
                    fontWeight: activeSection === item.id ? 600 : 400,
                    borderLeft: activeSection === item.id ? '2px solid #5f69ef' : '2px solid transparent',
                    paddingLeft: '10px',
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 min-w-0">

          {/* Background */}
          <ContentSection id="background">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#5f69ef] font-medium mb-3">Background</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">Reopen the World with AI</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              Sonaphi is a startup that uses vocal biomarkers to assess health conditions through the sound of your voice. It uses a particular algorithm to analyze your voice. It could even tell if we ate a banana within the last 24 hours.
            </p>

            <div className="rounded-2xl overflow-hidden border border-gray-100 bg-black mb-8">
              <video
                src="/sonaphi-vri.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto block"
              />
            </div>

            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              The world was in a panic in 2020, and our company set out to build a test that uses just your voice instead of the painful, time-consuming, and inaccessible swab tests. Enter <span className="font-semibold text-gray-700">Checkup</span>, an app by Sonaphi that detects COVID-19 from a 30-second voice recording and returns a result in minutes with around 88% accuracy.
            </p>

            <div className="flex justify-center gap-6 mb-8 flex-wrap">
              {['/sonaphi-checkup.png', '/sonaphi-checkup2.png'].map(src => (
                <div
                  key={src}
                  className="relative shadow-2xl"
                  style={{
                    width: 200,
                    aspectRatio: '9 / 19',
                    background: 'linear-gradient(145deg, #1a1a22, #0a0a0e)',
                    borderRadius: 32,
                    padding: 6,
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden bg-white" style={{ borderRadius: 26 }}>
                    {/* Notch */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10" style={{ width: 64, height: 16, borderRadius: 8, background: '#0a0a0e' }} />
                    <img src={src} alt="Checkup app screen" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Platform', value: 'iOS App' },
                { label: 'Team', value: '1 PM · 2 Eng · 1 Designer' },
                { label: 'Users', value: '~4,000 voice samples' },
                { label: 'Year', value: '2021' },
              ].map(m => (
                <div key={m.label} className="p-4 rounded-xl border border-gray-100">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-1">{m.label}</p>
                  <p className="text-[13px] text-gray-800 font-medium">{m.value}</p>
                </div>
              ))}
            </div>

            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              <span className="font-semibold text-gray-700">VRI</span>, or Voice Research Initiative, is a research app that is the backbone of Checkup. It has collected around 4,000 voice samples but struggled to keep up with rapidly evolving research on vaccines, variants, and symptoms.
            </p>

            <div className="flex justify-center mb-6">
              <img
                src="/sonaphi-vriimages.png"
                alt="VRI app screens"
                className="h-auto block"
                style={{ maxWidth: 440 }}
              />
            </div>

            <p className="text-[15px] text-gray-500 leading-relaxed">
              As the founding designer, I partnered closely with the clinical, engineering, and product teams to reshape the app so it could continue training the AI while keeping participants engaged over many months of research.
            </p>
          </ContentSection>

          {/* Problem */}
          <ContentSection id="problem">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Problem</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">A Research Tool Falling Behind Its Science</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              I designed the original VRI app from scratch with no user feedback, framed primarily as a tool for doctors to capture and review participant information. After launch, it became clear the experience needed a redesign, both to make the flow usable for the broader participant base and to keep up with the rapidly evolving research coming out of COVID-19.
            </p>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
              The app needed to evolve on two fronts: capturing new research signals (vaccines, variants, changing symptoms) and giving participants enough feedback to keep them engaged long enough to train the model.
            </p>

            <div className="space-y-3">
              {[
                { title: 'Stale health data', desc: 'Symptoms and test results were captured only once, during onboarding, and could never be updated.' },
                { title: 'No response to the science', desc: 'Emerging vaccine and variant data had no home in the app.' },
                { title: 'Silent submissions', desc: 'Users had no confirmation that their recordings were received, leaving them unsure whether to continue.' },
                { title: 'Weak retention', desc: 'With no evolving value proposition, repeat participation dropped sharply after first use.' },
              ].map((p, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100">
                  <span className="text-[12px] font-mono text-gray-300 font-bold mt-0.5">0{i + 1}</span>
                  <div>
                    <p className="text-[14px] font-semibold text-gray-800">{p.title}</p>
                    <p className="text-[13px] text-gray-400 mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ContentSection>

          {/* Research */}
          <ContentSection id="research">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Research</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">Listening Before Designing</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              I ran 30 one-to-one phone interviews and 9 Zoom video sessions with existing participants, spanning demographics, health backgrounds, and tech literacy. The goal was to understand why people stayed, why they dropped, and what they needed from a research experience.
            </p>

            <div className="flex gap-6 mb-8 p-6 rounded-2xl bg-gray-50">
              {[
                { value: '30', label: 'Phone interviews' },
                { value: '9', label: 'Zoom sessions' },
                { value: '77%', label: 'Successful test uploads' },
              ].map(s => (
                <div key={s.label} className="flex-1 text-center">
                  <p className="text-[28px] font-bold text-[#5f69ef]">{s.value}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <h3 className="text-[16px] font-semibold text-gray-800 mb-4">Key Findings</h3>
            <div className="space-y-3">
              {[
                { title: 'Users wanted to update, not just submit', desc: 'Health situations changed (new symptoms, a positive test, a vaccine dose) but the app treated every profile as static.' },
                { title: 'Feedback loops were missing', desc: 'Participants wanted proof their recording was received and a sense of whether it was useful.' },
                { title: 'Accessibility was a blocker', desc: 'Small fonts and low-contrast labels filtered out older adults, one of the most valuable research cohorts.' },
                { title: 'Instructions were unclear', desc: 'Users were uncertain how to hold the phone, how long to speak, and whether the recording had started.' },
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

          {/* Process */}
          <ContentSection id="process">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Process</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">Designing Within Clinical Constraints</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
              Every feature had to clear three gates at once, clinical accuracy (the data had to be valid for the model), engineering effort (we had a tight build window), and accessibility (we needed older adults to participate confidently).
            </p>

            <div className="mb-8 p-5 rounded-2xl bg-gray-50">
              <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-3">How decisions were made</p>
              <div className="flex items-center gap-2 flex-wrap">
                {['Clinical sign-off', 'Engineering scope', 'Accessibility review', 'User test', 'Ship'].map((step, i, arr) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-gray-800 px-3 py-1.5 rounded-full bg-white border border-gray-200">{step}</span>
                    {i < arr.length - 1 && (
                      <svg width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M0 4h12M9 1l3 3-3 3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[15px] text-gray-500 leading-relaxed mb-10">
              I restructured the existing flow so new features (vaccine questionnaires, test-result entry, recording history) could live alongside the original recording flow without bloating it. Collaboration happened in tight weekly cycles, with the clinical team reviewing language and the engineering team vetting technical feasibility before any screen reached high fidelity.
            </p>

            {/* Before / After user flow */}
            <h3 className="text-[16px] font-semibold text-gray-800 mb-4">Restructuring the User Flow</h3>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
              The original flow scattered health data across the experience, an orphaned COVID-test upload button, a mid-recording questionnaire, and an onboarding that captured too little. The new flow consolidates every health signal into onboarding and leaves the recording loop focused on one job: capturing voice.
            </p>
            <UserFlowDiagram />
          </ContentSection>

          {/* Solutions */}
          <ContentSection id="solutions">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#5f69ef] font-medium mb-3">Solutions</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">From a Silent Submission to a Living Study</h2>

            <div className="space-y-4">
              {[
                {
                  title: 'Pre-recording questionnaire',
                  desc: 'A short, research-backed questionnaire captures the participant\'s current vaccine status, symptoms, and variants, so every voice sample carries up-to-date context for the model.',
                  extra: (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-[#5f69ef]/80 font-semibold mb-1">Walkthrough</p>
                      <p className="text-[13px] text-gray-500 mb-6">The questionnaire flow, end to end.</p>
                      <SonaphiQuestionnairePrototype />
                    </div>
                  ),
                },
                {
                  title: 'Guided recording experience',
                  desc: 'Added instructional tips, a visible waveform, and a clear confirmation step so participants always know the recording was captured correctly.',
                  extra: (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-[#5f69ef]/80 font-semibold mb-1">Try it</p>
                      <p className="text-[13px] text-gray-500 mb-6">Tap the mic and speak. The wave reacts to your voice in real time, and we'll flag if you're too quiet or too loud.</p>
                      <LiveVoiceDemo />
                    </div>
                  ),
                },
                {
                  title: 'Structured test-result input',
                  desc: 'Replaced free-form image uploads with a structured form, improving data quality and lifting successful submissions to 77%.',
                },
                {
                  title: 'Upload history and confirmation',
                  desc: 'A simple history view shows how many times a participant has contributed, when, and what was submitted, closing the feedback loop that kept users engaged.',
                },
                {
                  title: 'Accessibility pass',
                  desc: 'Larger type, higher contrast, and tighter hierarchy made the flow usable for older adults without changing the core experience for everyone else.',
                },
              ].map((s, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-xl border border-gray-100">
                  <span className="text-[13px] font-mono text-[#5f69ef] font-bold mt-0.5">0{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-gray-900">{s.title}</p>
                    <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
                    {s.extra}
                  </div>
                </div>
              ))}
            </div>
          </ContentSection>

          {/* Results */}
          <ContentSection id="results">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Results</p>
            <h2 className="font-serif text-3xl text-gray-900 leading-tight mb-6">Outcome</h2>
            <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
              The redesign shipped inside the 7-week window and unlocked a second phase of investment from stakeholders. Most importantly, the AI team now had richer, more reliable training data.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { value: '200%', label: 'Increase in flow completion click-through' },
                { value: '60%', label: 'Lift in 5-star app ratings' },
                { value: '+$100K', label: 'Budget increase from stakeholders' },
                { value: '77%', label: 'Successful test result uploads' },
              ].map(r => (
                <div key={r.label} className="p-5 rounded-2xl bg-gradient-to-br from-[#5f69ef]/8 to-[#8685f1]/8 border border-[#5f69ef]/15">
                  <p className="text-[26px] font-bold text-[#5f69ef]">{r.value}</p>
                  <p className="text-[11px] text-gray-500 mt-1 leading-snug">{r.label}</p>
                </div>
              ))}
            </div>

            <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-3">From the team</p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-6 rounded-2xl bg-gray-50 flex flex-col">
                <p className="text-[14px] text-gray-700 leading-relaxed italic flex-1">
                  "Ayesha, your remarkable, focused, and meticulous collaboration with all participants hasn't gone unnoticed. You've brought about significant change and it's evident."
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <img src="/rec-firas.jpeg" alt="Firas Abras" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-[13px] font-semibold text-gray-800 leading-tight">Firas Abras</p>
                    <p className="text-[11px] text-gray-500 leading-tight">CTO, Sonaphi</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 flex flex-col">
                <p className="text-[14px] text-gray-700 leading-relaxed italic flex-1">
                  "I have continued to be impressed with her fresh ideas that always consider the customer-first, as well as her endless thirst for more knowledge."
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <img src="/rec-jamil.avif" alt="Jamil Houston" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-[13px] font-semibold text-gray-800 leading-tight">Jamil Houston</p>
                    <p className="text-[11px] text-gray-500 leading-tight">Design Director, Sonaphi</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 mb-10">
              <p className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-2">What came next</p>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                The redesigned app moved into HIPAA compliance review and App Store submission, with the increased budget earmarked for a broader participant recruitment campaign and continued AI model training.
              </p>
            </div>

            {/* Press feature — hover-to-preview link */}
            <div className="relative group">
              <a
                href="https://emag.directindustry.com/2021/07/28/voice-based-technology-a-promising-future-sonaphi-voicesense-alexa-amazon-artificial-intelligence-machine-learning/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl cursor-pointer no-underline"
                style={{ background: 'rgba(95,105,239,0.08)', border: '1px solid rgba(95,105,239,0.18)' }}
              >
                <span className="text-[20px]">📰</span>
                <p className="text-[14px] text-gray-600">
                  Sonaphi was featured in industry press alongside the broader rise of voice-based AI <span className="font-medium" style={{ color: '#5f69ef' }}>(hover to preview, click to open)</span>
                </p>
              </a>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[260px] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
                  <img src="/sonaphi-press.jpg" alt="Sonaphi press feature" className="w-full object-cover" />
                </div>
                <div className="w-4 h-4 bg-white border-b border-r border-gray-200 rotate-45 absolute -bottom-2 left-1/2 -translate-x-1/2" />
              </div>
            </div>
          </ContentSection>

        </div>
      </div>
    </div>
  )
}

/* ── Before / After user flow diagram ── */
function FlowBox({ x, y, w = 110, h = 32, label, variant = 'default', shape = 'rect', changed, note, notePos = 'bottom' }) {
  const variants = {
    default:  { bg: '#fff',         fg: '#1f2937', border: '#e5e7eb' },
    decision: { bg: '#111827',      fg: '#fff',    border: '#111827' },
    data:     { bg: '#eef0ff',      fg: '#3b4465', border: '#c4cafd' },
    start:    { bg: '#f3f4f6',      fg: '#6b7280', border: '#e5e7eb' },
    terminal: { bg: '#f9fafb',      fg: '#1f2937', border: '#e5e7eb' },
    orphan:   { bg: '#fef2f8',      fg: '#be185d', border: '#fbcfe8' },
  }
  const v = variants[variant]

  if (shape === 'diamond') {
    const size = 54
    return (
      <div style={{ position: 'absolute', left: x, top: y, width: size, height: size }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: v.bg,
          transform: 'rotate(45deg)',
          borderRadius: 6,
          border: `1px solid ${v.border}`,
          boxShadow: changed ? '0 0 0 2px rgba(236,72,153,0.6), 0 2px 6px rgba(0,0,0,0.06)' : '0 2px 6px rgba(0,0,0,0.04)',
        }} />
        <span style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: v.fg, fontSize: 9, fontWeight: 600, textAlign: 'center', padding: 4, lineHeight: 1.15,
        }}>{label}</span>
        {note && (
          <span style={{
            position: 'absolute', top: size + 8, left: '50%', transform: 'translateX(-50%)',
            fontSize: 10, fontWeight: 700, color: '#db2777', whiteSpace: 'nowrap',
          }}>{note}</span>
        )}
      </div>
    )
  }

  return (
    <div style={{ position: 'absolute', left: x, top: y }}>
      <div style={{
        width: w, height: h,
        background: v.bg, color: v.fg,
        border: `1px solid ${v.border}`,
        borderRadius: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10.5, fontWeight: 600, textAlign: 'center', padding: '0 10px', lineHeight: 1.15,
        boxShadow: changed ? '0 0 0 2px rgba(236,72,153,0.6), 0 2px 6px rgba(0,0,0,0.06)' : '0 2px 6px rgba(0,0,0,0.04)',
        whiteSpace: 'nowrap',
      }}>{label}</div>
      {note && (
        <span style={{
          position: 'absolute',
          left: '50%', transform: 'translateX(-50%)',
          [notePos]: notePos === 'top' ? h + 6 : 'auto',
          top: notePos === 'bottom' ? h + 6 : 'auto',
          fontSize: 10, fontWeight: 700, color: '#db2777', whiteSpace: 'nowrap',
        }}>{note}</span>
      )}
    </div>
  )
}

function EdgeText({ x, y, text }) {
  return <text x={x} y={y} fontSize="9.5" fill="#6b7280" fontWeight="600" textAnchor="middle">{text}</text>
}

function FlowDiagram({ title, subtitle, width, height, nodes, edges, overlays, titleColor = '#111827' }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[11px] uppercase tracking-[0.25em] font-bold" style={{ color: titleColor }}>{title}</span>
        <span className="text-[12px] text-gray-400">{subtitle}</span>
      </div>
      <div style={{ position: 'relative', width, height }}>
        <svg width={width} height={height} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <defs>
            <marker id="arr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#374151" />
            </marker>
            <marker id="arr-pink" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#db2777" />
            </marker>
          </defs>
          {edges}
          {overlays}
        </svg>
        {nodes.map((n, i) => <FlowBox key={i} {...n} />)}
      </div>
    </div>
  )
}

/* Reusable edge helper */
function Edge({ d, dashed, pink }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={pink ? '#db2777' : '#374151'}
      strokeWidth={pink ? 1.4 : 1.4}
      strokeDasharray={dashed ? '4,4' : '0'}
      markerEnd={pink ? 'url(#arr-pink)' : 'url(#arr)'}
    />
  )
}

/* Legacy marker — still referenced below, kept for compat */

function FlowChip({ label, variant = 'default', changed, note }) {
  const variants = {
    default: 'bg-white border-gray-200 text-gray-800',
    decision: 'bg-gray-900 border-gray-900 text-white',
    data: 'bg-[#5f69ef]/10 border-[#5f69ef]/30 text-[#3b4465]',
    orphan: 'bg-pink-50 border-pink-300 text-pink-700',
    start: 'bg-gray-100 border-gray-200 text-gray-500',
  }
  return (
    <div className="relative inline-flex items-center flex-shrink-0">
      <span className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap ${variants[variant]}`} style={changed ? { boxShadow: '0 0 0 2px rgba(236,72,153,0.5)' } : undefined}>
        {label}
      </span>
      {note && (
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 text-[10px] font-bold text-pink-600 whitespace-nowrap">
          {note}
        </span>
      )}
    </div>
  )
}

function FlowArrow() {
  return (
    <svg width="16" height="8" viewBox="0 0 14 8" fill="none" className="flex-shrink-0 text-gray-400">
      <path d="M0 4h12M9 1l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FlowRow({ items }) {
  return (
    <div className="flex items-start gap-2 flex-wrap">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          {item.type === 'arrow' ? <FlowArrow /> : item.type === 'label' ? (
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{item.label}</span>
          ) : (
            <FlowChip {...item} />
          )}
        </div>
      ))}
    </div>
  )
}


/* ── The main diagram ── */
function UserFlowDiagram() {
  const W = 920, H = 380

  // Diamonds are 54x54 rotated; to center-align with row (y=110, h=32, cy=126) → diamond y = 126 - 27 = 99
  const beforeNodes = [
    { x: 10,  y: 110, w: 62, label: 'Start', variant: 'start' },
    { x: 96,  y: 99,  label: 'User has account?', variant: 'decision', shape: 'diamond' },
    { x: 178, y: 110, w: 108, label: 'Enter password' },
    { x: 312, y: 110, w: 96,  label: 'Dashboard' },
    { x: 430, y: 110, w: 118, label: 'Recording History' },
    { x: 570, y: 110, w: 130, label: 'Vaccine & Symptoms', variant: 'data', changed: true, note: 'mid-flow questions' },
    { x: 720, y: 99,  label: 'Accepted?', variant: 'decision', shape: 'diamond' },
    { x: 798, y: 78,  w: 88, label: 'Thank you!', variant: 'terminal' },
    { x: 798, y: 128, w: 88, label: 'Record again', variant: 'terminal' },
    { x: 140, y: 200, w: 62, label: 'Sign up', variant: 'start' },
    { x: 224, y: 200, w: 96, label: 'Onboarding' },
    { x: 342, y: 200, w: 108, label: 'Add participant' },
    { x: 220, y: 280, w: 100, label: 'Bill of rights' },
    { x: 340, y: 280, w: 118, label: 'Informed consent', variant: 'data' },
    { x: 478, y: 280, w: 70,  label: 'Profile' },
    { x: 568, y: 280, w: 86,  label: 'Symptoms', variant: 'data', changed: true, note: 'too few questions' },
    { x: 340, y: 20,  w: 170, label: 'Upload COVID-19 test result', variant: 'orphan', changed: true, note: 'orphan button', notePos: 'top' },
  ]

  // Diamond 1 corners: T(123,99) R(150,126) B(123,153) L(96,126)
  // Diamond 2 corners: T(747,99) R(774,126) B(747,153) L(720,126)
  const beforeEdges = (
    <>
      {/* Main row — all horizontal */}
      <Edge d="M 72 126 L 94 126" />
      <Edge d="M 150 126 L 176 126" />
      <EdgeText x={163} y={115} text="Yes" />
      <Edge d="M 286 126 L 310 126" />
      <Edge d="M 408 126 L 428 126" />
      <Edge d="M 548 126 L 568 126" />
      <Edge d="M 700 126 L 718 126" />
      {/* Accepted? → Thank you! (enters top middle, pointing down) */}
      <Edge d="M 747 99 L 747 60 L 842 60 L 842 76" />
      <EdgeText x={795} y={54} text="Yes" />
      {/* Accepted? → Record again (enters bottom middle, pointing up) */}
      <Edge d="M 747 153 L 747 190 L 842 190 L 842 162" />
      <EdgeText x={795} y={202} text="No" />
      {/* No branch — straight down then right */}
      <Edge d="M 123 153 L 123 216 L 138 216" />
      <EdgeText x={110} y={185} text="No" />
      {/* Row 2 horizontal */}
      <Edge d="M 202 216 L 222 216" />
      <Edge d="M 320 216 L 340 216" />
      {/* Add participant → Dashboard loop up (straight up + right + down) */}
      <Edge d="M 396 200 L 396 170 L 360 170 L 360 144" dashed />
      {/* Add participant → Bill of rights (straight down + left + down) */}
      <Edge d="M 396 232 L 396 260 L 270 260 L 270 278" />
      {/* Row 3 horizontal */}
      <Edge d="M 320 296 L 338 296" />
      <Edge d="M 458 296 L 476 296" />
      <Edge d="M 548 296 L 566 296" />
      {/* Symptoms → Dashboard loop (up + left + down) */}
      <Edge d="M 611 280 L 611 180 L 360 180 L 360 144" dashed />
      {/* Orphan upload → Dashboard (down + left + down) */}
      <Edge d="M 425 52 L 425 88 L 360 88 L 360 108" dashed pink />
    </>
  )

  const afterNodes = [
    { x: 10,  y: 110, w: 62, label: 'Start', variant: 'start' },
    { x: 96,  y: 99,  label: 'User has account?', variant: 'decision', shape: 'diamond' },
    { x: 178, y: 110, w: 108, label: 'Enter password' },
    { x: 312, y: 110, w: 96,  label: 'Dashboard' },
    { x: 430, y: 110, w: 126, label: 'Voice recording', changed: true, note: 'focused loop' },
    { x: 580, y: 99,  label: 'Accepted?', variant: 'decision', shape: 'diamond' },
    { x: 658, y: 78,  w: 88, label: 'Thank you!', variant: 'terminal' },
    { x: 658, y: 128, w: 88, label: 'Record again', variant: 'terminal' },
    { x: 140, y: 200, w: 62, label: 'Sign up', variant: 'start' },
    { x: 224, y: 200, w: 96, label: 'Onboarding' },
    { x: 342, y: 200, w: 108, label: 'Add participant' },
    { x: 170, y: 280, w: 100, label: 'Bill of rights' },
    { x: 290, y: 280, w: 118, label: 'Informed consent' },
    { x: 428, y: 280, w: 70,  label: 'Profile' },
    { x: 518, y: 280, w: 148, label: 'Symptoms + COVID pic', variant: 'data', changed: true, note: 'consolidated here' },
  ]

  // Diamond 1 (has account?) corners: T(123,99) R(150,126) B(123,153) L(96,126)
  // Diamond 2 (accepted?) corners: T(607,99) R(634,126) B(607,153) L(580,126)
  const afterEdges = (
    <>
      <Edge d="M 72 126 L 94 126" />
      <Edge d="M 150 126 L 176 126" />
      <EdgeText x={163} y={115} text="Yes" />
      <Edge d="M 286 126 L 310 126" />
      <Edge d="M 408 126 L 428 126" />
      <Edge d="M 556 126 L 578 126" />
      {/* Accepted → Thank you! (enters top middle, pointing down) */}
      <Edge d="M 607 99 L 607 60 L 702 60 L 702 76" />
      <EdgeText x={655} y={54} text="Yes" />
      {/* Accepted → Record again (enters bottom middle, pointing up) */}
      <Edge d="M 607 153 L 607 190 L 702 190 L 702 162" />
      <EdgeText x={655} y={202} text="No" />
      {/* No branch: straight down + right */}
      <Edge d="M 123 153 L 123 216 L 138 216" />
      <EdgeText x={110} y={185} text="No" />
      <Edge d="M 202 216 L 222 216" />
      <Edge d="M 320 216 L 340 216" />
      {/* Add participant → Bill of rights (down + left + down) */}
      <Edge d="M 396 232 L 396 260 L 220 260 L 220 278" />
      <Edge d="M 270 296 L 288 296" />
      <Edge d="M 408 296 L 426 296" />
      <Edge d="M 498 296 L 516 296" />
      {/* Symptoms → Dashboard loop up (up + left + down) */}
      <Edge d="M 592 280 L 592 180 L 360 180 L 360 144" dashed />
    </>
  )

  return (
    <div className="mb-8" style={{ marginRight: '-180px', maxWidth: 'calc(100% + 180px)' }}>
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <FlowDiagram
          title="Before"
          subtitle="fragmented — health signals scattered across the flow"
          width={W} height={H}
          nodes={beforeNodes}
          edges={beforeEdges}
        />
        <FlowDiagram
          title="After"
          subtitle="consolidated — onboarding captures every signal, recording stays focused"
          titleColor="#5f69ef"
          width={W} height={H}
          nodes={afterNodes}
          edges={afterEdges}
        />
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-gray-500 pt-5 border-t border-gray-100">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-white border border-gray-300" /> Existing step</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-gray-900 inline-block rotate-45" /> Decision</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#eef0ff] border border-[#c4cafd]" /> Data collection</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full ring-2 ring-pink-500/60" /> What changed</span>
        </div>
      </div>
    </div>
  )
}
