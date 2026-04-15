import { useState, useEffect } from 'react'
const navItems = [
  { label: 'Home', href: '#home', section: 'hero' },
  { label: 'Case Studies', href: '#case-studies', section: 'case-studies' },
  { label: 'Playground', href: '#playground', section: 'playground' },
  { label: 'About Me', href: '#about', section: 'about' },
]

export default function GlassNavBar() {
  const [active, setActive] = useState(0)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const caseStudiesEl = document.getElementById('case-studies')
      const playgroundEl = document.getElementById('playground')
      const aboutEl = document.getElementById('about')
      if (!caseStudiesEl) return

      const rect = caseStudiesEl.getBoundingClientRect()
      const playgroundRect = playgroundEl?.getBoundingClientRect()
      const aboutRect = aboutEl?.getBoundingClientRect()

      // Switch active tab based on section in viewport
      if (aboutRect && aboutRect.top < 200) {
        setActive(3) // About Me
      } else if (playgroundRect && playgroundRect.top < 200) {
        setActive(2) // Playground
      } else if (rect.top < 200) {
        setActive(1) // Case Studies
      } else {
        setActive(0) // Home
      }

      // Go dark when over white/light background sections
      let shouldBeDark = false

      if (rect.top < 70 && rect.bottom > 24) {
        shouldBeDark = true
      }

      if (playgroundRect && playgroundRect.top < 70 && playgroundRect.bottom > 24) {
        shouldBeDark = true
      }

      if (aboutRect && aboutRect.top < 70 && aboutRect.bottom > 24) {
        shouldBeDark = true
      }

      setDark(shouldBeDark)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4">
      <nav
        className={`glass-nav flex items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-500 ease-out ${
          dark ? 'glass-nav-dark' : ''
        }`}
      >
        {navItems.map((item, i) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById(item.section)
              if (el) el.scrollIntoView({ behavior: 'smooth' })
              setActive(i)
            }}
            className={`
              relative z-10 rounded-full px-5 py-2 text-[13px] font-medium tracking-wide
              transition-all duration-500 ease-out select-none whitespace-nowrap
              ${
                active === i
                  ? `nav-item-active ${dark ? 'text-gray-800' : 'text-white'}`
                  : dark
                    ? 'text-gray-500 hover:text-gray-800 hover:bg-black/5'
                    : 'text-white/70 hover:text-white hover:bg-white/8'
              }
            `}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
