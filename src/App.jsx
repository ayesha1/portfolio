import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import GlassNavBar from './components/GlassNavBar'
import HeroSection from './components/HeroSection'
import CaseStudiesSection from './components/CaseStudiesSection'
import PlaygroundSection from './components/PlaygroundSection'
import AboutSection from './components/AboutSection'
import Footer from './components/Footer'
import TelusCaseStudy from './components/TelusCaseStudy'
import LiquidGlassFilter from './components/LiquidGlassFilter'
import CustomCursor from './components/CustomCursor'
import logoImg from './assets/hero.png'

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
      <img src={logoImg} alt="Logo" className="w-14 h-14 object-contain opacity-70" />
    </a>
  )
}

function HomePage() {
  const navigate = useNavigate()

  return (
    <Layout>
      <LiquidGlassFilter />
      <CustomCursor />
      <FloatingLogo />
      <GlassNavBar />
      <HeroSection />
      <CaseStudiesSection onOpenTelus={() => navigate('/case-study/telus')} />
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
        <Route path="/case-study/telus" element={<TelusCaseStudy />} />
      </Routes>
    </BrowserRouter>
  )
}
