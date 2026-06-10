import { useEffect, useState } from 'react'
import './LoadingScreen.css'

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 90 + 5}%`,
  top:  `${Math.random() * 80 + 10}%`,
  dur:  `${3 + Math.random() * 4}s`,
  delay:`${Math.random() * 3}s`,
  dx:   `${(Math.random() - 0.5) * 60}px`,
}))

const QUOTES = [
  '"A reader lives a thousand lives before he dies."',
  '"Not all those who wander are lost."',
  '"Words are, in my not-so-humble opinion, our most inexhaustible source of magic."',
]

export default function LoadingScreen({ onDone }) {
  const [visible, setVisible] = useState(true)
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]

  useEffect(() => {
    // Match the CSS animation timing: fade-out starts at 3.2s, duration 0.8s
    const timer = setTimeout(() => {
      setVisible(false)
      if (onDone) onDone()
    }, 4000)
    return () => clearTimeout(timer)
  }, [onDone])

  if (!visible) return null

  return (
    <div className="loading-screen" aria-label="Loading ShopEasy" role="status">

      {/* Corner ornaments */}
      <div className="ls-corner ls-corner--tl" />
      <div className="ls-corner ls-corner--tr" />
      <div className="ls-corner ls-corner--bl" />
      <div className="ls-corner ls-corner--br" />

      {/* Floating particles */}
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="ls-particle"
          style={{
            left: p.left,
            top:  p.top,
            '--dur':   p.dur,
            '--delay': p.delay,
            '--dx':    p.dx,
          }}
        />
      ))}

      {/* Main content */}
      <div className="ls-content">
        {/* Ornamental rule */}
        <div className="ls-ornament">
          <div className="ls-ornament-line" />
          <div className="ls-ornament-diamond" />
          <div className="ls-ornament-line" />
        </div>

        {/* Icon */}
        <div className="ls-icon">🛍️</div>

        {/* Brand name */}
        <h1 className="ls-title">
          Shop<span>Easy</span>
        </h1>

        {/* Tagline */}
        <p className="ls-subtitle">Your Premium Shopping Destination</p>

        {/* Literary quote */}
        <p className="ls-quote">{quote}</p>

        {/* Progress bar */}
        <div className="ls-progress-track" aria-hidden="true">
          <div className="ls-progress-fill" />
        </div>

        {/* Dots */}
        <div className="ls-dots" aria-hidden="true">
          <div className="ls-dot" />
          <div className="ls-dot" />
          <div className="ls-dot" />
        </div>
      </div>
    </div>
  )
}
