import { useEffect, useState } from 'react'
import './LoadingScreen.css'

function playEngineSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const master = ctx.createGain()
    master.gain.setValueAtTime(1.0, ctx.currentTime)
    master.gain.setValueAtTime(1.0, ctx.currentTime + 3.2)
    master.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 4.0)
    master.connect(ctx.destination)
    const now = ctx.currentTime
    const clickBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.08), ctx.sampleRate)
    const cd = clickBuf.getChannelData(0)
    for (let i = 0; i < cd.length; i++) cd[i] = (Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.012))
    const clickSrc = ctx.createBufferSource(); clickSrc.buffer = clickBuf
    const clickGain = ctx.createGain(); clickGain.gain.value = 2.0
    clickSrc.connect(clickGain); clickGain.connect(master); clickSrc.start(now)
    const crankBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate*0.55), ctx.sampleRate)
    const ckd = crankBuf.getChannelData(0)
    for (let i = 0; i < ckd.length; i++) { const t=i/ctx.sampleRate; ckd[i]=(Math.random()*2-1)*(Math.sin(2*Math.PI*18*t)>0?1:0.15)*0.9 }
    const crankSrc = ctx.createBufferSource(); crankSrc.buffer = crankBuf
    const crankBpf = ctx.createBiquadFilter(); crankBpf.type='bandpass'; crankBpf.frequency.value=160; crankBpf.Q.value=0.8
    const crankGain = ctx.createGain()
    crankGain.gain.setValueAtTime(0,now+0.1); crankGain.gain.linearRampToValueAtTime(1.4,now+0.2); crankGain.gain.linearRampToValueAtTime(0,now+0.65)
    crankSrc.connect(crankBpf); crankBpf.connect(crankGain); crankGain.connect(master); crankSrc.start(now+0.1)
    ;[{freq:52,type:'sawtooth',gain:1.0,detune:0},{freq:104,type:'sawtooth',gain:0.55,detune:8},{freq:156,type:'square',gain:0.35,detune:-6}].forEach(({freq,type,gain:gVal,detune})=>{
      const osc=ctx.createOscillator(); osc.type=type; osc.detune.value=detune
      osc.frequency.setValueAtTime(freq*0.55,now+0.55); osc.frequency.linearRampToValueAtTime(freq*1.0,now+1.0)
      osc.frequency.linearRampToValueAtTime(freq*2.6,now+2.0); osc.frequency.linearRampToValueAtTime(freq*4.5,now+2.7); osc.frequency.linearRampToValueAtTime(freq*3.8,now+3.3)
      const lpf=ctx.createBiquadFilter(); lpf.type='lowpass'; lpf.Q.value=3.0
      lpf.frequency.setValueAtTime(250,now+0.55); lpf.frequency.linearRampToValueAtTime(900,now+1.2); lpf.frequency.linearRampToValueAtTime(3500,now+2.7); lpf.frequency.linearRampToValueAtTime(2200,now+3.3)
      const oscGain=ctx.createGain(); oscGain.gain.setValueAtTime(0,now+0.5); oscGain.gain.linearRampToValueAtTime(gVal,now+0.85)
      osc.connect(lpf); lpf.connect(oscGain); oscGain.connect(master); osc.start(now+0.5); osc.stop(now+4.1)
    })
    const rBuf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*4.0),ctx.sampleRate)
    const rd=rBuf.getChannelData(0); for(let i=0;i<rd.length;i++) rd[i]=Math.random()*2-1
    const rSrc=ctx.createBufferSource(); rSrc.buffer=rBuf
    const rLpf=ctx.createBiquadFilter(); rLpf.type='lowpass'; rLpf.frequency.setValueAtTime(90,now+0.55); rLpf.frequency.linearRampToValueAtTime(500,now+2.5)
    const rGain=ctx.createGain(); rGain.gain.setValueAtTime(0,now+0.55); rGain.gain.linearRampToValueAtTime(0.6,now+1.1)
    rSrc.connect(rLpf); rLpf.connect(rGain); rGain.connect(master); rSrc.start(now+0.55)
    ;[2.55,2.72,2.88].forEach(t=>{
      const pBuf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*0.07),ctx.sampleRate)
      const pd=pBuf.getChannelData(0); for(let i=0;i<pd.length;i++) pd[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*0.018))
      const pSrc=ctx.createBufferSource(); pSrc.buffer=pBuf
      const pGain=ctx.createGain(); pGain.gain.value=1.8
      pSrc.connect(pGain); pGain.connect(master); pSrc.start(now+t)
    })
    setTimeout(()=>ctx.close().catch(()=>{}),4500)
  } catch(e){ console.warn('Audio unavailable',e) }
}

const PARTICLES = Array.from({length:18},(_,i)=>({
  id:i, left:`${Math.random()*90+5}%`, top:`${Math.random()*80+10}%`,
  dur:`${3+Math.random()*4}s`, delay:`${Math.random()*3}s`, dx:`${(Math.random()-0.5)*60}px`,
}))

const BOLTS = [
  {id:0,delay:'0.3s', dur:'0.12s',x:'20%',path:'M10,0 L5,40 L12,40 L3,90 L9,90 L0,130'},
  {id:1,delay:'1.1s', dur:'0.10s',x:'75%',path:'M8,0 L2,35 L10,35 L4,80 L11,80 L1,120'},
  {id:2,delay:'2.0s', dur:'0.14s',x:'45%',path:'M6,0 L13,45 L7,45 L14,95 L6,95 L12,140'},
  {id:3,delay:'0.8s', dur:'0.11s',x:'60%',path:'M9,0 L3,38 L11,38 L5,85 L12,85 L2,125'},
  {id:4,delay:'1.6s', dur:'0.13s',x:'30%',path:'M7,0 L14,42 L6,42 L13,88 L5,88 L11,130'},
]

const QUOTES = [
  '"A reader lives a thousand lives before he dies."',
  '"Not all those who wander are lost."',
  '"Words are, in my not-so-humble opinion, our most inexhaustible source of magic."',
]

export default function LoadingScreen({ onDone }) {
  const [visible,     setVisible]     = useState(true)
  const [flashActive, setFlashActive] = useState(false)
  const [started,     setStarted]     = useState(false)
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]

  const handleStart = () => {
    if (started) return
    setStarted(true)
    playEngineSound()
  }

  useEffect(() => {
    if (!started) return
    const flashTimes = [400, 1200, 2100]
    const timers = flashTimes.map(t => setTimeout(() => {
      setFlashActive(true)
      setTimeout(() => setFlashActive(false), 120)
    }, t))
    return () => timers.forEach(clearTimeout)
  }, [started])

  useEffect(() => {
    if (!started) return
    const timer = setTimeout(() => {
      if (onDone) onDone()
      setVisible(false)
    }, 4000)
    return () => clearTimeout(timer)
  }, [started, onDone])

  if (!visible) return null

  return (
    <div
      className={`loading-screen${flashActive ? ' ls-flash' : ''}`}
      aria-label="Loading ShopEasy" role="status"
      onClick={handleStart}
      style={{ cursor: started ? 'default' : 'pointer' }}
    >
      {!started && (
        <div className="ls-tap-prompt">
          <span className="ls-tap-icon">🏎️</span>
          <span className="ls-tap-text">Tap anywhere to start</span>
        </div>
      )}

      <div className={`ls-thunder-overlay${flashActive ? ' active' : ''}`} />

      <div className="ls-lightning-container" aria-hidden="true">
        {BOLTS.map(bolt => (
          <svg key={bolt.id} className="ls-bolt"
            style={{ left:bolt.x, '--bolt-delay':bolt.delay, '--bolt-dur':bolt.dur }}
            viewBox="0 0 20 140" width="20" height="140"
          >
            <path d={bolt.path} stroke="#ffe066" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d={bolt.path} stroke="rgba(180,140,255,0.6)" strokeWidth="6" fill="none" strokeLinecap="round" filter="url(#glow)" />
          </svg>
        ))}
        <svg width="0" height="0" style={{ position:'absolute' }}>
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      <div className="ls-corner ls-corner--tl" />
      <div className="ls-corner ls-corner--tr" />
      <div className="ls-corner ls-corner--bl" />
      <div className="ls-corner ls-corner--br" />

      {PARTICLES.map(p => (
        <div key={p.id} className="ls-particle"
          style={{ left:p.left, top:p.top, '--dur':p.dur, '--delay':p.delay, '--dx':p.dx }}
        />
      ))}

      <div className="ls-content">
        <div className="ls-ornament">
          <div className="ls-ornament-line" />
          <div className="ls-ornament-diamond" />
          <div className="ls-ornament-line" />
        </div>
        <div className="ls-icon">🛍️</div>
        <h1 className="ls-title">Shop<span>Easy</span></h1>
        <p className="ls-subtitle">Your Premium Shopping Destination</p>
        <p className="ls-quote">{quote}</p>
        <div className="ls-progress-track" aria-hidden="true">
          <div className="ls-progress-fill" />
        </div>
        <div className="ls-dots" aria-hidden="true">
          <div className="ls-dot" /><div className="ls-dot" /><div className="ls-dot" />
        </div>
      </div>
    </div>
  )
}
