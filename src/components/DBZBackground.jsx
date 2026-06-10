import { useEffect, useRef, useState } from 'react'

const GOKU_SRC = '/goku.webp'

export default function DBZBackground() {
  const bgCanvasRef     = useRef(null)   // Layer 1: space bg + stars
  const fxCanvasRef     = useRef(null)   // Layer 3: aura, beam, effects on top of Goku
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError,  setImgError]  = useState(false)

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current
    const fxCanvas = fxCanvasRef.current
    if (!bgCanvas || !fxCanvas) return

    const bgCtx = bgCanvas.getContext('2d')
    const fxCtx = fxCanvas.getContext('2d')
    let animId, W, H

    const resize = () => {
      W = bgCanvas.width = fxCanvas.width  = window.innerWidth
      H = bgCanvas.height = fxCanvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const rand  = (a, b) => Math.random() * (b - a) + a
    const randI = (a, b) => Math.floor(rand(a, b))

    // ── Stars ──────────────────────────────────────────────
    const stars = Array.from({ length: 220 }, () => ({
      x: rand(0,1), y: rand(0,1), r: rand(0.3,2.2),
      a: rand(0.15,0.9), t: rand(0,Math.PI*2), ts: rand(0.008,0.04),
    }))

    // ── Flame particles ─────────────────────────────────────
    const FLAMES = Array.from({ length: 160 }, () => mkFlame())
    function mkFlame() {
      return {
        angle: rand(0, Math.PI*2),
        dist:  rand(0.5, 1.1),
        speed: rand(0.01, 0.03),
        len:   rand(60, 180),
        w:     rand(6, 22),
        a:     rand(0.5, 1.0),
        color: ['#ff2200','#ff6600','#ffaa00','#ffdd00','#ffffff'][randI(0,5)],
        life:  rand(0,1), phase: rand(0,Math.PI*2),
      }
    }

    // ── Ki particles ────────────────────────────────────────
    const KI = Array.from({ length: 120 }, () => mkKi())
    function mkKi() {
      return {
        x: rand(0,1), y: rand(0.3,1),
        vx: rand(-0.0004,0.0004), vy: rand(-0.001,-0.0003),
        r: rand(1.5,5), a: rand(0.3,1),
        color: ['#ffe066','#ffaa00','#ffffff','#aaddff','#88ffff','#ff6600'][randI(0,6)],
        pulse: rand(0,Math.PI*2), life: rand(0,1),
      }
    }

    // ── Electric arcs ───────────────────────────────────────
    const arcs = []
    let arcT = 0
    function spawnArc(cx, cy, radius) {
      const a0 = rand(0, Math.PI*2)
      const segs = []
      let px = cx + Math.cos(a0)*radius*rand(0.2,0.8)
      let py = cy + Math.sin(a0)*radius*rand(0.2,0.8)
      for (let i = 0; i < 12; i++) {
        const nx = px+rand(-70,70), ny = py+rand(-70,70)
        segs.push({x1:px,y1:py,x2:nx,y2:ny}); px=nx; py=ny
      }
      arcs.push({ segs, alpha:1, decay:rand(0.07,0.15),
        color:['#aaddff','#ffffff','#ffe066','#88ffff'][randI(0,4)] })
    }

    // ── Shockwaves ──────────────────────────────────────────
    const shocks = []
    function spawnShock(cx,cy,color) {
      shocks.push({cx,cy,r:0,alpha:0.9,color,speed:rand(6,14)})
    }

    // ── Explosion debris ────────────────────────────────────
    const debris = []
    function spawnExplosion(x,y) {
      for(let i=0;i<80;i++){
        const a=rand(0,Math.PI*2), s=rand(4,22)
        debris.push({
          x,y, vx:Math.cos(a)*s, vy:Math.sin(a)*s,
          r:rand(5,20), alpha:1,
          color:['#ffe066','#ff8800','#ffffff','#ff4400','#aaddff'][randI(0,5)],
        })
      }
    }

    // ── Phase ───────────────────────────────────────────────
    let phase=0, phaseT=0, beamProg=0
    const DUR = { charge:200, fire:170, explode:75 }

    // Goku image centre points (matching where he is in the image)
    // These control where aura/beam originates
    const getGokuPos = () => ({
      auraCX: W * 0.60,
      auraCY: H * 0.40,
      handX:  W * 0.25,
      handY:  H * 0.52,
      auraR:  W * 0.30 * (phase===0 ? (0.65 + 0.55*(phaseT/DUR.charge)) : 1.3),
    })

    // ══════════════════════════════════════════════════════
    // DRAW BEAM
    // ══════════════════════════════════════════════════════
    function drawBeam(ctx, sx, sy, prog, t) {
      if (prog <= 0) return
      const ex = sx * (1 - prog)   // fires to left edge
      const bH = 60 + 22*Math.sin(t*14)
      ctx.save()
      // Wide outer glow
      const og = ctx.createLinearGradient(ex,0,sx,0)
      og.addColorStop(0,'rgba(80,160,255,0)')
      og.addColorStop(0.4,'rgba(140,210,255,0.25)')
      og.addColorStop(1,'rgba(200,240,255,0.15)')
      ctx.fillStyle=og; ctx.fillRect(ex,sy-bH*4,sx-ex,bH*8)
      // Mid beam
      const mg=ctx.createLinearGradient(sx,sy-bH,sx,sy+bH)
      mg.addColorStop(0,'rgba(80,160,255,0.5)')
      mg.addColorStop(0.5,'rgba(230,248,255,0.98)')
      mg.addColorStop(1,'rgba(80,160,255,0.5)')
      ctx.fillStyle=mg; ctx.fillRect(ex,sy-bH,sx-ex,bH*2)
      // Bright core
      ctx.fillStyle='rgba(255,255,255,0.95)'
      ctx.fillRect(ex,sy-bH*0.22,sx-ex,bH*0.44)
      // Wavy edges
      ctx.strokeStyle='rgba(160,220,255,0.6)'; ctx.lineWidth=3
      ctx.beginPath()
      for(let x=sx;x>=ex;x-=8){
        const y=sy-bH+7*Math.sin(x*0.04+t*22)
        x===sx?ctx.moveTo(x,y):ctx.lineTo(x,y)
      }; ctx.stroke()
      ctx.beginPath()
      for(let x=sx;x>=ex;x-=8){
        const y=sy+bH-7*Math.sin(x*0.04+t*22)
        x===sx?ctx.moveTo(x,y):ctx.lineTo(x,y)
      }; ctx.stroke()
      // Tip explosion
      const iR=bH*3.5*(0.85+0.15*Math.sin(t*24))
      const ig=ctx.createRadialGradient(ex,sy,0,ex,sy,iR)
      ig.addColorStop(0,'rgba(255,255,255,1)')
      ig.addColorStop(0.3,'rgba(140,210,255,0.8)')
      ig.addColorStop(1,'rgba(60,140,255,0)')
      ctx.fillStyle=ig; ctx.beginPath(); ctx.arc(ex,sy,iR,0,Math.PI*2); ctx.fill()
      ctx.restore()
    }

    // ══════════════════════════════════════════════════════
    // MAIN LOOP
    // ══════════════════════════════════════════════════════
    let t = 0
    function draw() {
      t += 0.016; phaseT++
      const { auraCX, auraCY, handX, handY, auraR } = getGokuPos()

      // ── BG canvas: space + stars ──────────────────────
      bgCtx.clearRect(0,0,W,H)
      const bg = bgCtx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H))
      bg.addColorStop(0,'#0c0025')
      bg.addColorStop(0.5,'#050012')
      bg.addColorStop(1,'#000008')
      bgCtx.fillStyle=bg; bgCtx.fillRect(0,0,W,H)
      stars.forEach(s=>{
        s.t+=s.ts
        bgCtx.globalAlpha=s.a*(0.5+0.5*Math.sin(s.t))
        bgCtx.fillStyle='#fff'
        bgCtx.beginPath(); bgCtx.arc(s.x*W,s.y*H,s.r,0,Math.PI*2); bgCtx.fill()
      }); bgCtx.globalAlpha=1

      // ── FX canvas: effects on top of Goku ─────────────
      fxCtx.clearRect(0,0,W,H)

      // Aura glow behind Goku (large radial)
      for(let i=3;i>=1;i--){
        const r=auraR*(2.5-i*0.35)*(1+0.07*Math.sin(t*3+i))
        const ag=fxCtx.createRadialGradient(auraCX,auraCY,0,auraCX,auraCY,r)
        ag.addColorStop(0,`rgba(255,${90+i*25},0,${0.18/i})`)
        ag.addColorStop(0.5,`rgba(255,${50+i*15},0,${0.10/i})`)
        ag.addColorStop(1,'rgba(255,60,0,0)')
        fxCtx.fillStyle=ag
        fxCtx.beginPath(); fxCtx.ellipse(auraCX,auraCY,r,r*0.9,0,0,Math.PI*2); fxCtx.fill()
      }

      // Flame spikes
      FLAMES.forEach(f=>{
        f.life+=f.speed; f.phase+=0.06
        if(f.life>1) Object.assign(f,mkFlame())
        const r=auraR*f.dist*(1+0.2*Math.sin(f.phase))
        const x=auraCX+Math.cos(f.angle+f.life*2)*r
        const y=auraCY+Math.sin(f.angle+f.life*2)*r
        const a=(1-f.life)*f.a
        fxCtx.save()
        fxCtx.globalAlpha=a
        fxCtx.translate(x,y)
        fxCtx.rotate(Math.atan2(y-auraCY,x-auraCX)+Math.PI/2)
        const fg=fxCtx.createLinearGradient(0,0,0,-f.len)
        fg.addColorStop(0,f.color); fg.addColorStop(0.45,'#ff3300'); fg.addColorStop(1,'rgba(255,80,0,0)')
        fxCtx.fillStyle=fg
        fxCtx.beginPath()
        fxCtx.moveTo(-f.w/2,0)
        fxCtx.quadraticCurveTo(-f.w,  -f.len*0.5, 0, -f.len)
        fxCtx.quadraticCurveTo( f.w,  -f.len*0.5, f.w/2, 0)
        fxCtx.closePath(); fxCtx.fill()
        fxCtx.restore()
      })

      // Aura spike strokes
      for(let i=0;i<28;i++){
        const ang=(i/28)*Math.PI*2+0.1*Math.sin(t*6+i*1.4)
        const len=auraR*(0.8+0.7*Math.abs(Math.sin(t*4.5+i*0.8)))
        const x1=auraCX+Math.cos(ang)*auraR*0.5, y1=auraCY+Math.sin(ang)*auraR*0.5
        const x2=auraCX+Math.cos(ang)*(auraR*0.5+len), y2=auraCY+Math.sin(ang)*(auraR*0.5+len)
        const sg=fxCtx.createLinearGradient(x1,y1,x2,y2)
        const hot=i%3===0?'#ffffff':(i%3===1?'#ffee44':'#ff6600')
        sg.addColorStop(0,hot); sg.addColorStop(0.35,'#ff3300'); sg.addColorStop(1,'rgba(255,60,0,0)')
        fxCtx.strokeStyle=sg; fxCtx.lineWidth=4+3.5*Math.abs(Math.sin(t*5+i)); fxCtx.lineCap='round'
        fxCtx.beginPath()
        const mx=(x1+x2)/2+Math.cos(ang+Math.PI/2)*28*Math.sin(t*3+i)
        const my=(y1+y2)/2+Math.sin(ang+Math.PI/2)*28*Math.sin(t*3+i)
        fxCtx.moveTo(x1,y1); fxCtx.quadraticCurveTo(mx,my,x2,y2); fxCtx.stroke()
      }

      // Ki particles
      KI.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.pulse+=0.05; p.life+=0.006
        if(p.y<0||p.life>1) Object.assign(p,mkKi())
        const a=p.a*(0.6+0.4*Math.sin(p.pulse))*(1-p.life)
        fxCtx.globalAlpha=a
        const g=fxCtx.createRadialGradient(p.x*W,p.y*H,0,p.x*W,p.y*H,p.r*2.5)
        g.addColorStop(0,p.color); g.addColorStop(1,'rgba(255,200,0,0)')
        fxCtx.fillStyle=g; fxCtx.beginPath(); fxCtx.arc(p.x*W,p.y*H,p.r*2.5,0,Math.PI*2); fxCtx.fill()
        fxCtx.globalAlpha=Math.min(a*1.6,1); fxCtx.fillStyle='#fff'
        fxCtx.beginPath(); fxCtx.arc(p.x*W,p.y*H,p.r*0.35,0,Math.PI*2); fxCtx.fill()
        fxCtx.globalAlpha=1
      })

      // Phase logic
      if(phase===0){
        beamProg=0
        if(phaseT>=DUR.charge){ phase=1; phaseT=0 }
      } else if(phase===1){
        beamProg=Math.min(1,(phaseT/DUR.fire)*1.5)
        if(phaseT%18===0) spawnShock(auraCX,auraCY,'#ff6600')
        if(phaseT%28===0) spawnShock(handX,handY,'#4488ff')
        if(phaseT>=DUR.fire){
          spawnExplosion(W*0.02, handY)
          for(let i=0;i<8;i++) spawnShock(W*0.02,handY,'#aaddff')
          phase=2; phaseT=0
        }
      } else {
        beamProg=0
        if(phaseT>=DUR.explode){ phase=0; phaseT=0; debris.length=0 }
      }

      // Shockwaves
      for(let i=shocks.length-1;i>=0;i--){
        const s=shocks[i]; s.r+=s.speed; s.alpha-=0.018
        if(s.alpha<=0||s.r>W){ shocks.splice(i,1); continue }
        fxCtx.globalAlpha=s.alpha; fxCtx.strokeStyle=s.color; fxCtx.lineWidth=2.5
        fxCtx.beginPath(); fxCtx.arc(s.cx,s.cy,s.r,0,Math.PI*2); fxCtx.stroke()
        fxCtx.globalAlpha=1
      }

      // Electric arcs
      arcT++
      if(arcT>(phase===0?10:4)){ spawnArc(auraCX,auraCY,auraR); arcT=0 }
      for(let i=arcs.length-1;i>=0;i--){
        const a=arcs[i]; a.alpha-=a.decay
        if(a.alpha<=0){ arcs.splice(i,1); continue }
        fxCtx.globalAlpha=a.alpha; fxCtx.strokeStyle=a.color; fxCtx.lineWidth=2
        fxCtx.shadowColor=a.color; fxCtx.shadowBlur=10
        a.segs.forEach(s=>{ fxCtx.beginPath(); fxCtx.moveTo(s.x1,s.y1); fxCtx.lineTo(s.x2,s.y2); fxCtx.stroke() })
        fxCtx.shadowBlur=0; fxCtx.globalAlpha=1
      }

      // Beam
      if((phase===1||phase===2)&&beamProg>0) drawBeam(fxCtx,handX,handY,beamProg,t)

      // KAMEHAMEHA text
      if(phase===1&&phaseT<65){
        const ta=1-phaseT/65
        fxCtx.globalAlpha=ta; fxCtx.save()
        const fs=Math.max(28,Math.floor(H*0.072))
        fxCtx.font=`900 ${fs}px 'Arial Black',Arial,sans-serif`
        fxCtx.textAlign='center'; fxCtx.textBaseline='middle'
        fxCtx.strokeStyle='#001166'; fxCtx.lineWidth=14
        fxCtx.strokeText('KAMEHAMEHA!!',W*0.38,H*0.13)
        const tg=fxCtx.createLinearGradient(0,H*0.07,0,H*0.19)
        tg.addColorStop(0,'#ffffff'); tg.addColorStop(0.4,'#aaddff'); tg.addColorStop(1,'#3366ff')
        fxCtx.fillStyle=tg; fxCtx.fillText('KAMEHAMEHA!!',W*0.38,H*0.13)
        fxCtx.restore(); fxCtx.globalAlpha=1
      }

      // Debris
      for(let i=debris.length-1;i>=0;i--){
        const p=debris[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=0.22; p.alpha-=0.02
        if(p.alpha<=0){ debris.splice(i,1); continue }
        fxCtx.globalAlpha=p.alpha
        const dg=fxCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r)
        dg.addColorStop(0,'#fff'); dg.addColorStop(0.4,p.color); dg.addColorStop(1,'rgba(255,80,0,0)')
        fxCtx.fillStyle=dg; fxCtx.beginPath(); fxCtx.arc(p.x,p.y,p.r,0,Math.PI*2); fxCtx.fill()
        fxCtx.globalAlpha=1
      }

      // Ground light during beam
      if(phase===1){
        const gl=fxCtx.createRadialGradient(auraCX,H,0,auraCX,H,W*0.65*beamProg)
        gl.addColorStop(0,`rgba(80,160,255,${0.22*beamProg})`)
        gl.addColorStop(1,'rgba(60,120,255,0)')
        fxCtx.fillStyle=gl
        fxCtx.beginPath(); fxCtx.ellipse(auraCX,H,W*0.65*beamProg,H*0.12,0,0,Math.PI*2); fxCtx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize',resize) }
  }, [])

  return (
    <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', zIndex:0, pointerEvents:'none' }}>

      {/* Layer 1 — deep space background */}
      <canvas ref={bgCanvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', display:'block', zIndex:1 }} />

      {/* Layer 2 — Goku fullscreen image */}
      {!imgError && (
        <img
          src={GOKU_SRC}
          alt="Goku"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            objectPosition: 'center center',
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Layer 3 — aura, beam, sparks ON TOP of Goku */}
      <canvas ref={fxCanvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', display:'block', zIndex:3, pointerEvents:'none' }} />

    </div>
  )
}
