import { useState } from 'react'

const panels = [
  { num: '01', title: 'AI Video\nGeneration\nfor Products', sub: 'personal project', color: '#f0c87a', video: '/ai-01.mp4' },
  { num: '02', title: 'Abstract\nIdeation', sub: 'AI exploration', color: '#a8b4d8', video: '/ai-02.mp4' },
  { num: '03', title: '3D World\nConcepts', sub: 'Accelerating spatial design with AI since 2024', color: '#d4a0a8', image: '/ai-03.png' },
  { num: '04', title: 'Outside\nthe Box', sub: 'Thinking of UI — literally.', color: '#2a2a2a', image: '/ai-04.png' },
  { num: '05', title: 'AI\nGambling', sub: 'Learning to deal with AI', color: '#d8d0c8', video: '/ai-05.mp4' },
  { num: '06', title: 'Having\nFun', sub: 'Always remembering to have fun', color: '#b8c4d8', video: '/ai-06.mp4' },
]

export default function AIExperiment({ visible }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div
      className="flex items-center gap-12 lg:gap-20 max-w-[1400px] mx-auto px-8 transition-all duration-1000"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(60px)',
      }}
    >
      {/* Left — info */}
      <div className="flex-shrink-0 max-w-[280px]">
        <span className="text-[10px] font-mono text-gray-300 block mb-2">03</span>
        <h3 className="font-serif text-2xl lg:text-3xl text-gray-900 mb-3 leading-tight">AI Image & Video</h3>
        <p className="text-[13px] text-gray-400 leading-relaxed mb-6">
          Exploring how AI-generated imagery and video can enhance the design process — from concept ideation to final presentation.
        </p>
        <div className="flex gap-2 flex-wrap">
          {['AI Generation', 'Visual Design', 'Exploration'].map(tag => (
            <span key={tag} className="text-[11px] text-gray-400 border border-gray-200 px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      {/* Right — accordion panels */}
      <div className="flex-1 flex justify-center">
        <div
          className="flex h-[360px] rounded-[20px] overflow-hidden"
          style={{ width: '640px' }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {panels.map((panel, i) => {
            const isHovered = hoveredIndex === i
            const hasHover = hoveredIndex !== null
            const flexVal = isHovered ? 4 : hasHover ? 0.6 : 1

            return (
              <div
                key={i}
                className="relative overflow-hidden"
                style={{
                  flex: flexVal,
                  transition: 'flex 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                  backgroundColor: panel.color,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredIndex(i)}
              >
                {/* Background — video, image, or color */}
                {panel.video ? (
                  <video src={panel.video} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                ) : panel.image ? (
                  <img src={panel.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0" style={{
                    background: `linear-gradient(180deg, ${panel.color}dd 0%, ${panel.color} 100%)`,
                  }} />
                )}

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  {/* Number */}
                  <span
                    className="font-bold transition-all duration-500"
                    style={{
                      fontSize: isHovered ? '48px' : '24px',
                      color: panel.num === '04' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)',
                      lineHeight: 1,
                    }}
                  >
                    {panel.num}
                  </span>

                  {/* Title + sub */}
                  <div
                    className="transition-all duration-500"
                    style={{
                      opacity: isHovered || !hasHover ? 1 : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                    }}
                  >
                    <p
                      className="font-semibold leading-tight whitespace-pre-line"
                      style={{
                        fontSize: isHovered ? '18px' : '12px',
                        color: panel.num === '04' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.95)',
                        transition: 'font-size 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                      }}
                    >
                      {panel.title}
                    </p>
                    {panel.sub && (
                      <p
                        className="mt-1 transition-opacity duration-500"
                        style={{
                          fontSize: '10px',
                          color: panel.num === '04' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.6)',
                          opacity: isHovered ? 1 : 0,
                        }}
                      >
                        {panel.sub}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
