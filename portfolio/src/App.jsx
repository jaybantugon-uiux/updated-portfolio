import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import ScrollToTop from './components/ScrollToTop'

// Home loads eagerly — it's the entry point
import Home from './pages/Home'

// Case study pages load only when navigated to
const DesignsRUs  = lazy(() => import('./pages/DesignsRUs'))
const AttendSmart = lazy(() => import('./pages/AttendSmart'))
const Candy       = lazy(() => import('./pages/Candy'))

// Minimal fallback — invisible, no layout shift
function PageFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#121212',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: '2px solid #2a2a2a',
        borderTopColor: '#D4AF37',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/designs-rus" element={
            <Suspense fallback={<PageFallback />}><DesignsRUs /></Suspense>
          } />
          <Route path="/attendsmart" element={
            <Suspense fallback={<PageFallback />}><AttendSmart /></Suspense>
          } />
          <Route path="/candy" element={
            <Suspense fallback={<PageFallback />}><Candy /></Suspense>
          } />
        </Routes>
      </AnimatePresence>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
