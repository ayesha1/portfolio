import { useState, useEffect, useRef } from 'react'

const recs = [
  {
    name: 'Melissa Molina',
    title: 'Creative Director',
    company: 'Napster',
    image: '/rec-melissa.png',
    short: "Ayesha jumped right in, identified pain points, uncovered opportunities through research, and translated them into thoughtful flows and prototypes. She's proactive, innovative, and never afraid to take bold design risks that pay off.",
    full: "I was fortunate to collaborate with her on projects like an AI-powered personal assistant. Even when the direction was unclear, Ayesha jumped right in, identified pain points, uncovered opportunities through research, and translated them into thoughtful flows and prototypes. Her work was always rooted in user needs while still pushing the boundaries of what design and AI experiences could be.\n\nShe also spearheaded a full restructure of our design library, setting processes and guidelines that improved efficiency and consistency across the company. She's proactive, innovative, and never afraid to test new tools or take bold design risks that pay off.\n\nOn top of her product design expertise, Ayesha brings animation, prototyping, and even coding skills that give her work a unique edge. And beyond her skills, she's a genuinely collaborative and great person to work with, plus she comes with the sweetest green cheek conure birdie named Boo Boo!\n\nI can't say enough good things about her. Any team would be incredibly lucky to have Ayesha driving innovation and creating experiences that are not only beautiful but impactful.",
  },
  {
    name: 'Justin Hebert',
    title: 'CEO',
    company: 'MIT · ex-Microsoft',
    image: '/rec-justin.jpeg',
    short: "Her enthusiasm and creativity added so much to the project. Ayesha is a true professional who flourishes on the cutting edge of XR design. Looking forward to working with her again.",
    full: "Ayesha was a pleasure to work with on my startup as an XR Designer. Her enthusiasm and creativity added so much to the project. From creating compelling mood boards to deeply researching the competitor landscape, she ensured the design was best-in-class. She has a keen sense of organization, generating user journeys and flows to clarify and modify paths prior to development. I like that she created multiple options and quickly adapted the design to changing requirements and patiently shepherded the experience through many iterations. She is responsive to feedback and creates systems for capturing and responding to commentary. Really appreciated her advice on unanticipated pain points and taking overall ownership of the user experience.\n\nThe highlight was the dev handoff, which streamlined getting the assets from design to dev to expedite the implementation phase. Ayesha is a true professional who flourishes on the cutting edge of XR design.\n\nLooking forward to sharing her designs when the app launches. And I hope to work again with her again in the future!",
  },
  {
    name: 'Scott Wueschinski',
    title: 'Technical Director',
    company: 'Thoughtworks · ex-Avanade',
    image: '/rec-scott.png',
    short: "Ayesha's creativity, technical skills, and commitment to excellence have been critical to our project's success. Her ability to design and implement using ReactJS, CSS, and Swift streamlined our processes.",
    full: "I had the pleasure of working closely with Ayesha on the visual design for our Stripe partnership solution and several other currently underway pursuits. From the beginning, Ayesha's creativity, technical skills, and commitment to excellence have been critical to our project's success.\n\nAyesha's extensive experience in product design, storytelling, and content visualization made her an invaluable asset to our team. Her background in designing mobile and web apps and her passion for mixed reality gave us unique insights and innovative solutions.\n\nDuring our collaboration, Ayesha's ability to design and implement her concepts using ReactJS, CSS, and Swift streamlined our processes and enhanced the final product. This multifaceted skillset distinguishes her from other designers benefiting our projects and Thoughtworks.\n\nOne of Ayesha's most admirable qualities is her dedication to creating products that are accessible, modern, and engaging. She consistently collaborates with the team, bouncing ideas around and fostering an atmosphere of creativity and fun. Ayesha's impressive list of accolades, including the Spotlight Award for Thoughtworks, reflects her commitment to excellence and community development.",
  },
  {
    name: 'Jamil Houston',
    title: 'Design Director',
    company: 'Sonaphi · Warner Bros',
    image: '/rec-jamil.avif',
    short: "Within her first few days, Ms. Khan single-handedly led an internal hackathon and developed the first complete set of high-fidelity wireframes. Her fresh ideas always consider the customer-first.",
    full: "As a startup, we have a very fast-paced work culture and within her first few days, Ms. Khan single-handedly led an internal hackathon of sorts and developed the first complete set of high-fidelity wireframes for our product prototype. Since then, I have continued to be impressed with her fresh ideas that always consider the customer-first, as well as her endless thirst for more knowledge.\n\nOverall, Ayesha is a pleasure to work with and has continuously contributed to a culture of creativity, innovation, and healthy risk-taking to always push past conventional norms.",
  },
]

function RecCard({ rec, expanded, onToggle }) {
  return (
    <div
      className="flex-shrink-0 rounded-2xl p-6 transition-all duration-500 cursor-pointer"
      style={{
        width: expanded ? '500px' : '320px',
        background: 'white',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: expanded ? '0 8px 32px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <img src={rec.image} alt={rec.name} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-gray-900 leading-tight">{rec.name}</p>
          <p className="text-[12px] font-semibold text-[#4b286d] mt-0.5">{rec.title}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{rec.company}</p>
        </div>
        {/* Quote mark */}
        <svg width="28" height="22" viewBox="0 0 28 22" fill="none" className="flex-shrink-0 opacity-10">
          <path d="M0 22V12c0-3.3.5-6 1.5-8.1C2.7 1.3 4.8 0 7.8 0l1 2c-1.7.6-2.9 1.7-3.7 3.3-.8 1.6-1.1 3.4-1 5.4h4v11.3H0zM16 22V12c0-3.3.5-6 1.5-8.1C18.7 1.3 20.8 0 23.8 0l1 2c-1.7.6-2.9 1.7-3.7 3.3-.8 1.6-1.1 3.4-1 5.4h4v11.3H16z" fill="currentColor" />
        </svg>
      </div>

      {/* Quote */}
      <div className="relative">
        <p
          className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line"
          style={{
            maxHeight: expanded ? '2000px' : '120px',
            overflow: 'hidden',
            transition: 'max-height 0.5s ease',
          }}
        >
          {expanded ? rec.full : rec.short}
        </p>
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {/* Read more */}
      <button
        className="mt-3 text-[12px] font-medium text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1"
        onClick={(e) => { e.stopPropagation(); onToggle() }}
      >
        {expanded ? 'Read less' : 'Read more'}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  )
}

export default function RecommendationsSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="recommendations" className="relative bg-white py-24 overflow-hidden">
      <div ref={ref} className="max-w-[1400px] mx-auto">
        {/* Heading */}
        <div
          className="px-8 lg:px-16 mb-12 transition-all duration-1000"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Recommendations</p>
          <h2 className="font-serif text-3xl lg:text-5xl text-gray-900 leading-tight max-w-[700px]">
            Don't just take my word for it, hear theirs.
          </h2>
        </div>

        {/* Horizontal scroll cards */}
        <div
          className="flex gap-5 overflow-x-auto pb-6 px-8 lg:px-16 transition-all duration-1000"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '0.2s',
            scrollbarWidth: 'thin',
          }}
        >
          {recs.map((rec, i) => (
            <RecCard
              key={rec.name}
              rec={rec}
              expanded={expanded === i}
              onToggle={() => setExpanded(expanded === i ? null : i)}
            />
          ))}
          {/* Spacer at end */}
          <div className="flex-shrink-0 w-8" />
        </div>
      </div>
    </section>
  )
}
