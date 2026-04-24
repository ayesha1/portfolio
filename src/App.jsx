import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import GlassNavBar from './components/GlassNavBar'
import HeroSection from './components/HeroSection'
import CaseStudiesSection from './components/CaseStudiesSection'
import PlaygroundSection from './components/PlaygroundSection'
import AboutSection from './components/AboutSection'
import RecommendationsSection from './components/RecommendationsSection'
import Footer from './components/Footer'
import TelusCaseStudy from './components/TelusCaseStudy'
import ViewerCaseStudy from './components/ViewerCaseStudy'
import SonaphiCaseStudy from './components/SonaphiCaseStudy'
import SpacesCaseStudy from './components/SpacesCaseStudy'
import LiquidGlassFilter from './components/LiquidGlassFilter'
import CustomCursor from './components/CustomCursor'
const logoImg = '/logo.png'

function FloatingLogo() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setShow(window.scrollY > window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <a
      href="#home"
      onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
      className="fixed top-6 left-6 z-50 transition-all duration-500"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(-10px)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <img src={logoImg} alt="Logo" className="w-14 h-14 object-contain" />
    </a>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()

  // Scroll to hash target on mount / hash change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      // Wait a tick so sections have rendered
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [location])

  return (
    <Layout>
      <LiquidGlassFilter />
      <CustomCursor />
      <FloatingLogo />
      <GlassNavBar />
      <HeroSection />
      <CaseStudiesSection
        onOpenTelus={() => navigate('/case-study/telus')}
        onOpenViewer={() => navigate('/case-study/viewer')}
        onOpenSonaphi={() => navigate('/case-study/sonaphi')}
        onOpenSpaces={() => navigate('/case-study/spaces')}
      />
      <RecommendationsSection />
      <PlaygroundSection />
      <AboutSection />
      <Footer />
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/case-study/telus" element={<><CustomCursor /><TelusCaseStudy /></>} />
        <Route path="/case-study/viewer" element={<><CustomCursor /><ViewerCaseStudy /></>} />
        <Route path="/case-study/sonaphi" element={<><CustomCursor /><SonaphiCaseStudy /></>} />
        <Route path="/case-study/spaces" element={<><CustomCursor /><SpacesCaseStudy /></>} />
      </Routes>
    </BrowserRouter>
  )
}
