import { useEffect, useRef, useState } from 'react'
import ChatbotDemo from './ChatbotDemo'
import VRIScreen from './VRIScreen'

const caseStudies = [
  {
    tags: ['AI Design', 'Conversation Design'],
    title: 'Designing AI Experiences for the Future of Telecom',
    description:
      'Partnered with a leading Canadian telecom company to redesign their AI support experience, improving resolution rates, reducing live agent reliance, and creating more intuitive, human-centered interactions at scale.',
    categories: ['Enterprise', 'Telecom', 'Human-Centered Design'],
    logos: ['/google-logo.png', '/telus-logo.png'],
    floatingCard: {
      title: 'Introduced AI Support to Telecom',
      description: 'Built an AI-powered support experience that streamlined journeys and increased self-service.',
    },
    type: 'chatbot',
    reverse: true,
    stats: [
      { value: '50%', label: 'Automated Resolution' },
      { value: '20x', label: 'Data Processing' },
      { value: '200%', label: 'Increase in Users' },
    ],
  },
  {
    tags: ['3D Design', 'E-commerce'],
    title: 'A Canvas for Immersive Brand Storytelling',
    description:
      'Viewer reimagines digital shopping as an immersive 3D experience. Transforming passive browsing into active exploration. By combining spatial interaction, intuitive navigation, and thoughtful visual design.\n\nIt enables users to seamlessly discover, engage with, and move through products in a way that feels natural, fluid, and deeply engaging.',
    categories: ['Immersive Experience', 'Brand Storytelling'],
    logos: ['/napster-logo.png'],
    floatingCard: null,
    images: {
      main: null,
      secondary: ['/viewer-mobile.gif', '/viewer-desktop.gif'],
    },
    type: 'images',
    stats: [
      { value: '204%', label: 'Increase in session time vs. e-commerce' },
      { value: '182%', label: 'Higher conversion vs. e-commerce' },
      { value: '90%', label: 'Completion of flow click-through rate' },
    ],
  },
  {
    tags: ['AI Research', 'Founding Designer'],
    title: 'Research App that Powers AI COVID-19 Testing',
    description:
      'An interactive system that visualizes sound in real time, converting voice and audio into dynamic visual experiences for medical research.\n\nA voice research initiative using vocal biomarkers to detect COVID-19 through Machine Learning.',
    categories: ['Audio Visualization', 'Founding Designer'],
    logos: ['/sonaphi-logo.png'],
    type: 'vri',
    reverse: true,
    stats: [
      { value: '200%', label: 'Completion of flow click-through rate' },
      { value: '60%', label: '5-Star Positive Ratings on App' },
      { value: '+$100K', label: 'Budget Increase from Stakeholders', icon: 'dollar' },
    ],
    floatingCard: {
      title: 'Reopen the World with AI',
      description: 'Clinical Research app that powers an AI COVID-19 detection app',
    },
  },
]

function FeaturedCard({ study, index }) {
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
    <div
      ref={ref}
      className="min-h-screen flex items-center py-16 transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(60px)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div data-card data-card-type={study.type} className="group overflow-visible transition-all duration-300 hover:-translate-y-1">
        <div className={`flex flex-col ${study.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} lg:min-h-[720px]`}>
          {/* Text content */}
          <div className={`flex-1 min-w-0 flex flex-col justify-center ${study.reverse ? 'p-10 lg:py-12 lg:pl-6 lg:pr-10' : 'p-10 lg:p-14'}`}>
            <div className="flex flex-wrap gap-2 mb-5">
              {study.tags.map((tag) => (
                <span key={tag} className="glass-tag inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 px-4 py-2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c4ff00] flex-shrink-0" />
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="font-serif text-3xl lg:text-4xl text-gray-900 leading-[1.15] mb-6">
              {study.title}
            </h3>

            <p className="text-gray-500 text-base leading-relaxed mb-8 whitespace-pre-line">
              {study.description}
            </p>

            <div className="flex items-center justify-between mb-10">
              <div className="flex flex-wrap gap-2">
                {study.categories.map((cat) => (
                  <span key={cat} className="text-xs text-gray-400 border border-gray-200 px-3 py-1 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-pink-50 transition-colors cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-pink-500 transition-colors">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {study.stats && (
              <div className="flex gap-8 mb-10">
                {study.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1">
                      {stat.icon !== 'dollar' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                      )}
                      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    </div>
                    <span className="text-[12px] text-gray-400">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}

            {study.logos && study.logos.length > 0 && (
              <div className="flex items-center gap-8">
                {study.logos.map((logo) => (
                  <img key={logo} src={logo} alt="" className="h-8 max-w-[120px] object-contain opacity-70" />
                ))}
              </div>
            )}
          </div>

          {/* Visual content */}
          <div className="relative flex-shrink-0 lg:w-[55%] p-4 lg:p-6 flex items-center justify-center overflow-visible">
            {study.type === 'chatbot' ? (
              <ChatbotDemo isVisible={visible} />
            ) : study.type === 'vri' ? (
              <VRIScreen isVisible={visible} />
            ) : study.images ? (
              <div className="relative w-full">
                {study.images.main && (
                  <img src={study.images.main} alt={study.title} className="w-full object-contain" />
                )}
                {study.images.secondary && (
                  <div className="flex items-end w-[180%]" style={{ gap: '0px', marginLeft: '-30px' }}>
                    <img src={study.images.secondary[0]} alt="" className="w-[25%] object-contain" style={{ marginRight: '-90px', zIndex: 1 }} />
                    <img src={study.images.secondary[1]} alt="" className="w-[74%] object-contain" />
                  </div>
                )}
              </div>
            ) : null}

            {study.floatingCard && (
              <div
                className={`absolute z-30 -translate-y-1/2 rounded-2xl overflow-hidden glass-overlay-card ${study.reverse ? 'right-[5%] w-[240px] top-[45%]' : 'left-[12%] w-[210px] top-[55%]'}`}
                style={{
                  opacity: visible ? undefined : 0,
                  animation: visible ? 'chatbotFadeUp 600ms ease-out 2.5s both' : 'none',
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-white/95 backdrop-blur-[40px]" style={{ zIndex: -1 }} />
                <div className="relative px-5 py-5">
                  <span className="text-2xl block mb-2">✨</span>
                  <h4 className="text-sm font-bold text-gray-900 leading-snug mb-2">
                    {study.floatingCard.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {study.floatingCard.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterDropdown({ label, options }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[13px] font-medium px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-200 text-gray-600"
      >
        {selected || label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[160px] z-50">
          <button
            onClick={() => { setSelected(null); setOpen(false) }}
            className={`w-full text-left px-4 py-2 text-[13px] transition-colors ${!selected ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            All
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { setSelected(opt); setOpen(false) }}
              className={`w-full text-left px-4 py-2 text-[13px] transition-colors ${selected === opt ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SideNav({ activeSection, visible }) {
  const items = [
    { id: 'featured', label: 'Featured' },
    { id: 'all-projects', label: 'All Projects' },
  ]

  return (
    <div
      className="hidden lg:flex flex-col gap-4 fixed left-8 top-1/2 -translate-y-1/2 z-40 transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
    >
      {items.map((item) => {
        const isActive = activeSection === item.id
        return (
          <button
            key={item.id}
            onClick={() => {
              const el = document.getElementById(item.id)
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex items-center gap-3 group"
          >
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width: isActive ? '8px' : '6px',
                height: isActive ? '8px' : '6px',
                backgroundColor: isActive ? '#111' : '#ccc',
              }}
            />
            <span
              className="text-[13px] font-medium transition-all duration-300 whitespace-nowrap"
              style={{
                opacity: isActive ? 1 : 0.4,
                color: isActive ? '#111' : '#aaa',
              }}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function CaseStudiesSection() {
  const [activeSection, setActiveSection] = useState('featured')
  const [navVisible, setNavVisible] = useState(false)
  const featuredRef = useRef(null)
  const allProjectsRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current
      const featured = featuredRef.current
      const allProjects = allProjectsRef.current
      if (!featured || !allProjects || !section) return

      const sectionRect = section.getBoundingClientRect()
      const inSection = sectionRect.top < window.innerHeight * 0.6 && sectionRect.bottom > window.innerHeight * 0.3
      setNavVisible(inSection)

      const allRect = allProjects.getBoundingClientRect()
      const featuredRect = featured.getBoundingClientRect()

      if (allRect.top < window.innerHeight * 0.5) {
        setActiveSection('all-projects')
      } else if (featuredRect.top < window.innerHeight * 0.5) {
        setActiveSection('featured')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="case-studies" ref={sectionRef} className="relative overflow-hidden pb-24">
      <div className="absolute inset-0 bg-white" />
      <SideNav activeSection={activeSection} visible={navVisible} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pt-32">
        <div id="featured" ref={featuredRef} className="flex flex-col">
          {caseStudies.map((study, i) => (
            <FeaturedCard key={study.title} study={study} index={i} />
          ))}
        </div>

        {/* Other Projects — 2 column grid */}
        <div id="all-projects" ref={allProjectsRef} className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl text-gray-900">Other Projects</h2>
            <div className="flex gap-3">
              <FilterDropdown
                label="Challenge"
                options={['0→1', 'Ambiguous', 'Design System', 'Growth', 'Scaling']}
              />
              <FilterDropdown
                label="Industry"
                options={['AI', 'B2B', 'E-commerce', 'Enterprise', 'HealthTech', 'Immersive', 'Social', 'Web3']}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            {[
              { title: 'Apple Enterprise Cloud Management', tag: 'Enterprise', challenge: 'Scaling', industry: 'Enterprise', image: '/apple.png' },
              { title: 'Napster Spaces', subtitle: 'AI Avatars to Agents', tag: 'Web Platform', challenge: 'Growth', industry: 'AI', video: '/new_spaces.mov' },
              { title: 'Forma', subtitle: 'AI Image Editor', tag: 'AI / Design Tool', challenge: '0→1', industry: 'AI', video: '/formanew.mov' },
              { title: '3D World Editor', subtitle: 'Democratizing 3D World Building', tag: 'Design System', challenge: '0→1', industry: 'Immersive', video: '/editor2.mp4' },
              { title: 'Blue Shield & Facebook', subtitle: 'Anti-Bullying App', tag: 'Social Wellness', challenge: '0→1', industry: 'Social', image: '/blue.png', light: true, bordered: true, contain: true },
              { title: 'HealMotion', subtitle: 'Mixed Reality Physical Therapy', tag: 'Mixed Reality / MIT', challenge: 'Ambiguous', industry: 'HealthTech', video: '/heal.mp4' },
              { title: 'Spacious Places', subtitle: 'VR Music Therapy', tag: 'VR / Meta Quest', challenge: '0→1', industry: 'Immersive', image: '/spacious.gif' },
              { title: 'Immersive Museum Experience', subtitle: 'AR Cultural Exploration', tag: 'AR / Gov & Thoughtworks', challenge: 'Ambiguous', industry: 'Immersive', image: '/lincoln.gif' },
            ].map((project) => (
              <div key={project.title} data-card data-card-type="project" className={`group relative rounded-2xl overflow-hidden aspect-[4/3] hover:-translate-y-1 transition-all duration-300 cursor-pointer ${project.bordered ? 'border border-gray-200 bg-white' : 'bg-gradient-to-br from-gray-100 to-gray-50'}`}>
                {/* Image or placeholder */}
                {project.video ? (
                  <video src={project.video} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                ) : project.image ? (
                  <img src={project.image} alt={project.title} className={`absolute inset-0 w-full h-full ${project.contain ? 'object-contain p-20' : 'object-cover'}`} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200/40" />
                  </div>
                )}
                {/* Bottom label with blur */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-b-2xl">
                  <div className={`backdrop-blur-[20px] px-5 py-4 ${project.light ? 'bg-white/40 border-t border-black/10' : 'bg-black/10'}`}>
                    <span className={`text-[11px] uppercase tracking-wider font-semibold ${project.light ? 'text-gray-500' : 'text-white/60'}`}>{project.tag}</span>
                    <h4 className={`text-[15px] font-semibold mt-1 ${project.light ? 'text-gray-900' : 'text-white'}`}>{project.title}</h4>
                    {project.subtitle && <p className={`text-[12px] mt-0.5 ${project.light ? 'text-gray-600' : 'text-white/70'}`}>{project.subtitle}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
