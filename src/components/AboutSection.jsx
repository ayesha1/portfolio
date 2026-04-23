import { useState, useEffect, useRef } from 'react'

const folderData = [
  { name: 'my self-appointed life manager', top: '5%', left: '-170px', delay: 1.2, photos: [
    '/pet-6CC28C5E-E8E0-4E46-9ADD-EA4C1B7621B1.jpg',
    '/pet-IMG_4040.jpg',
    '/pet-IMG_8824.jpg',
    '/pet-IMG_9958.jpg',
  ]},
  { name: 'my interests', top: '40%', left: '-85px', delay: 1.6, photos: [
    '/interest-0d08343f7cda85141750d2c324b333c5.jpg',
    '/interest-DSC04334__1.jpg',
    '/interest-Temply.jpg',
    '/interest-images__11.jpeg',
  ]},
  { name: 'me speaking', top: '38%', right: '-95px', delay: 1.8, photos: [
    '/speaking-1624804336313.jpeg',
    '/speaking-1652670165418.jpeg',
    '/speaking-screenshot.png',
  ]},
  { name: 'myawards.txt', top: '70%', left: '-180px', delay: 2.4, type: 'text', icon: '/txt-file.png', text: `- MIT Reality Hack 2024 Honorable Mention for using Bezi
- AR/VR Hackathon for Thoughtworks 2023
- Spotlight Award for Thoughtworks | March 2022 West + Canada Market Update
- 2nd Place in Hacking for Humanity Hackathon for Girls in Tech | $1,500 for second place
- Best of Show (Project School-Wide CMPE/SE Department) for Senior Project at SJSU out of 400 graduating seniors
- Certificate of Leadership for CodePath's Tech Fellow Society for leading a class of 80 students in an iOS programming boot camp | Also received $400 for most students nationwide
- Best Community Development Project Award for UmmaHacks Hackathon` },
  { name: 'in college 👩🏽‍🏫', top: '10%', right: '-150px', delay: 2.2, photos: [
    { src: '/college-1.jpeg', position: 'left center', caption: '2nd Place Best of Show for iOS App (Project School-Wide CMPE/SE Department) · Senior Project 2019' },
    { src: '/college-2.jpeg', caption: 'Elected Chair for SWE 2019 & volunteered at Women in Engineering for 2 years' },
    '/college-3.jpg',
    '/college-4.gif',
  ]},
  { name: 'photos of me', top: '82%', right: '-90px', delay: 2.0, photos: [
    '/me-37DE7D06-8B52-46AB-900F-B4C42F0784A5.jpg',
    '/me-464AE3D1-924D-4D60-AABD-A924F3450396.jpg',
    '/me-IMG_1191.jpg',
    '/me-IMG_3118.jpg',
    '/me-IMG_8589.JPG',
  ]},
]

function FolderIcon({ name, style, visible, delay, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="absolute flex flex-col items-center gap-1 z-20 transition-all duration-700"
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
        transitionDelay: `${delay}s`,
      }}
    >
      {icon ? (
        <img src={icon} alt="" style={{ width: 56, height: 56, objectFit: 'contain' }} />
      ) : (
        <svg width="68" height="56" viewBox="0 0 48 40" fill="none">
          <path d="M4 6h12l4 4h24a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z" fill="url(#fg)" />
          <path d="M4 6h12l4 4h24a4 4 0 0 1 4 4H0V10a4 4 0 0 1 4-4z" fill="url(#ft)" />
          <defs>
            <linearGradient id="fg" x1="24" y1="6" x2="24" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7DD3FC" /><stop offset="1" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="ft" x1="24" y1="6" x2="24" y2="14" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93E1FE" /><stop offset="1" stopColor="#5CC8F7" />
            </linearGradient>
          </defs>
        </svg>
      )}
      <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{name}</span>
    </button>
  )
}

/* Finder-style folder window */
function FolderWindow({ name, photos, text, onClose, onPhotoClick }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Window */}
      <div
        className="relative w-[480px] rounded-[16px] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'folderOpen 0.35s cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#f6f6f6] border-b border-gray-200">
          <div className="flex gap-2">
            <button onClick={onClose} className="w-[12px] h-[12px] rounded-full bg-[#ff5f57] hover:brightness-90" />
            <div className="w-[12px] h-[12px] rounded-full bg-[#febc2e]" />
            <div className="w-[12px] h-[12px] rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[13px] font-medium text-gray-700 absolute left-1/2 -translate-x-1/2">{name}</span>
          <div />
        </div>

        {/* Text file contents */}
        {text ? (
          <div className="bg-white px-6 py-5 max-h-[460px] overflow-y-auto">
            <pre
              className="whitespace-pre-wrap text-[13px] text-gray-700 leading-relaxed"
              style={{ fontFamily: "'SF Mono', 'Menlo', 'Courier New', monospace" }}
            >
              {text}
            </pre>
          </div>
        ) : (
        <div className="bg-white p-4 grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
          {photos.map((photo, i) => {
            const src = typeof photo === 'string' ? photo : photo.src
            const position = typeof photo === 'string' ? 'center center' : (photo.position || 'center center')
            const caption = typeof photo === 'string' ? null : photo.caption
            return (
              <button
                key={i}
                onClick={() => onPhotoClick(src)}
                className="relative aspect-square rounded-[10px] overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all duration-200 hover:scale-[1.02]"
              >
                <img src={src} alt="" className="w-full h-full object-cover" style={{ objectPosition: position }} />
                {caption && (
                  <div
                    className="absolute inset-x-0 bottom-0 px-2 py-1.5 text-[8.5px] text-white leading-tight text-left"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 100%)',
                      fontWeight: 500,
                      letterSpacing: '0.1px',
                    }}
                  >
                    {caption}
                  </div>
                )}
              </button>
            )
          })}
        </div>
        )}
      </div>

      <style>{`
        @keyframes folderOpen {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

/* Fullscreen photo viewer */
function PhotoViewer({ photo, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.3s ease' }}
    >
      <img
        src={photo}
        alt=""
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-[12px] shadow-2xl"
        onClick={e => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-xl hover:bg-white/20 transition-colors"
      >
        ×
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default function AboutSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [highlighted, setHighlighted] = useState(false)
  const [openFolder, setOpenFolder] = useState(null)
  const [fullscreenPhoto, setFullscreenPhoto] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => setHighlighted(true), 2000)
    return () => clearTimeout(timer)
  }, [visible])

  return (
    <section id="about" className="relative min-h-screen flex items-center py-20" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 15%, #fef0f5 30%, #fce4ec 50%, #f8bbd0 80%, #f4a9c4 100%)' }}>
      <div ref={ref} className="max-w-[1200px] mx-auto px-8 w-full flex flex-col items-center">

        {/* Center image with overlays */}
        <div
          className="relative w-[400px] h-[540px] transition-all duration-1000"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          {/* Photo */}
          <div className="absolute inset-0 rounded-[24px] overflow-hidden">
            <img src="/me.png" alt="Ayesha Khan" className="w-full h-full object-cover" />
          </div>

          {/* "Who Am I?" overlaid on top of image */}
          <div className="absolute top-6 left-4 right-4 z-10">
            <div className="absolute inset-[-20px] backdrop-blur-[8px] pointer-events-none" style={{
              WebkitBackdropFilter: 'blur(8px)',
              maskImage: 'radial-gradient(ellipse 100% 100% at center, black 20%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at center, black 20%, transparent 70%)',
            }} />
          </div>
          <div className="absolute top-8 left-6 right-6 z-10">
            <h2 className="font-serif text-5xl lg:text-6xl text-white leading-[1]" style={{ WebkitTextStroke: '0.5px rgba(0,0,0,0.3)', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              Who{' '}
              <span className="relative inline-block">
                <span
                  className="absolute inset-[-3px_-6px] rounded-[8px] transition-all duration-500"
                  style={{
                    background: highlighted ? 'rgba(147, 197, 253, 0.2)' : 'transparent',
                    border: highlighted ? '2px solid rgba(147, 197, 253, 0.4)' : '2px solid transparent',
                    boxShadow: highlighted ? '0 0 12px rgba(147, 197, 253, 0.2)' : 'none',
                    backdropFilter: highlighted ? 'blur(8px)' : 'none',
                    WebkitBackdropFilter: highlighted ? 'blur(8px)' : 'none',
                  }}
                />
                <span
                  className="relative transition-colors duration-500"
                  style={{ color: highlighted ? '#93c5fd' : 'white' }}
                >
                  Am I
                </span>
              </span>
              {' '}?
            </h2>
          </div>

          {/* iPhone-style face detection box */}
          <div
            className="absolute z-10 transition-all duration-700"
            style={{
              width: '100px',
              height: '120px',
              top: '38%',
              left: '42%',
              transform: 'translateX(-50%)',
              opacity: visible ? 1 : 0,
              transitionDelay: '1.5s',
            }}
          >
            <div className="absolute top-0 left-0 w-4 h-4 border-t-[2.5px] border-l-[2.5px] border-yellow-400 rounded-tl-[3px]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-[2.5px] border-r-[2.5px] border-yellow-400 rounded-tr-[3px]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-[2.5px] border-l-[2.5px] border-yellow-400 rounded-bl-[3px]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-[2.5px] border-r-[2.5px] border-yellow-400 rounded-br-[3px]" />
            <div
              className="absolute -right-5 top-[40%] text-yellow-400 transition-all duration-500"
              style={{ opacity: visible ? 1 : 0, transitionDelay: '2s' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1">
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="1" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" /><line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" /><line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
              </svg>
            </div>
          </div>

          {/* Clickable folders */}
          {folderData.map((folder) => (
            <FolderIcon
              key={folder.name}
              name={folder.name}
              icon={folder.icon}
              style={{ top: folder.top, left: folder.left, right: folder.right }}
              visible={visible}
              delay={folder.delay}
              onClick={() => (folder.photos || folder.text) && setOpenFolder(folder)}
            />
          ))}

          {/* Chat bubble */}
          <div
            className="absolute top-[16%] right-[-40px] z-20 transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(0.5)', transitionDelay: '2.3s' }}
          >
            <div className="bg-white rounded-full w-[32px] h-[24px] flex items-center justify-center shadow-md">
              <span className="text-[8px] text-gray-400 font-bold">•••</span>
            </div>
          </div>

          {/* Scattered emojis */}
          {[
            { emoji: '👍', top: '60%', right: '-50px', delay: 1.4, size: '22px' },
            { emoji: '🌸', top: '20%', left: '-45px', delay: 1.8, size: '20px' },
            { emoji: '🦜', top: '55%', right: '-65px', delay: 2.2, size: '24px' },
            { emoji: '🚴🏽‍♀️', top: '88%', left: '-55px', delay: 2.6, size: '22px' },
          ].map((e, i) => (
            <div
              key={i}
              className="absolute z-20 transition-all duration-700"
              style={{
                top: e.top,
                left: e.left,
                right: e.right,
                fontSize: e.size,
                opacity: visible ? 1 : 0,
                transform: visible ? 'scale(1) translateY(0)' : 'scale(0.3) translateY(10px)',
                transitionDelay: `${e.delay}s`,
                animation: visible ? `emojiFloat ${3 + i * 0.5}s ease-in-out ${e.delay + 0.5}s infinite` : 'none',
              }}
            >
              {e.emoji}
            </div>
          ))}

        </div>

        <style>{`
          @keyframes emojiFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(5deg); }
          }
        `}</style>
      </div>

      {/* Folder window popup */}
      {openFolder && (
        <FolderWindow
          name={openFolder.name}
          photos={openFolder.photos}
          text={openFolder.text}
          onClose={() => setOpenFolder(null)}
          onPhotoClick={(photo) => setFullscreenPhoto(photo)}
        />
      )}

      {/* Fullscreen photo viewer */}
      {fullscreenPhoto && (
        <PhotoViewer
          photo={fullscreenPhoto}
          onClose={() => setFullscreenPhoto(null)}
        />
      )}
    </section>
  )
}
