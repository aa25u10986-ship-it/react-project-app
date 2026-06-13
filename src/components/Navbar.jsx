import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const [query, setQuery]     = useState('')
  const [menuOpen, setMenu]   = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const items     = useCartStore(s => s.items)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate  = useNavigate()
  const location  = useLocation()
  const userRef   = useRef(null)
  const totalItems = items.reduce((s, i) => s + i.qty, 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenu(false); setUserOpen(false) }, [location.pathname])

  useEffect(() => {
    const handler = (e) => { if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenu(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/?search=${encodeURIComponent(query.trim())}`)
    setMenu(false)
  }

  const handleLogout = () => { logout(); navigate('/'); setUserOpen(false) }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/cart', label: 'Cart' },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'sticky', top: 0, zIndex: 200,
          background: scrolled ? 'rgba(5,0,25,0.95)' : 'rgba(5,0,20,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(245,200,66,0.2)' : '1px solid rgba(245,200,66,0.08)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="container" style={{ display:'flex', alignItems:'center', gap:16, height:64 }}>

          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:'#fff', whiteSpace:'nowrap', flexShrink:0 }}>
            <span style={{ fontSize:22 }}>⚡</span>
            <span>Shop<span style={{ color:'var(--gold)' }}>Easy</span></span>
          </Link>

          {/* Desktop search */}
          <form onSubmit={handleSearch} style={{ flex:1, display:'flex', maxWidth:460, marginLeft:8 }} className="nav-search-wrap">
            <div style={{
              flex:1, display:'flex', alignItems:'center',
              background:'rgba(255,255,255,0.06)',
              border:'1.5px solid rgba(245,200,66,0.2)',
              borderRadius:12, overflow:'hidden',
              transition:'border-color 0.2s, box-shadow 0.2s',
            }}
              onFocus={e => e.currentTarget.style.borderColor='rgba(245,200,66,0.55)'}
              onBlur={e => e.currentTarget.style.borderColor='rgba(245,200,66,0.2)'}
            >
              <span style={{ padding:'0 12px', fontSize:16, opacity:0.5 }}>🔍</span>
              <input
                type="text" placeholder="Search products..."
                value={query} onChange={e => setQuery(e.target.value)}
                style={{
                  flex:1, padding:'10px 0', background:'transparent',
                  border:'none', outline:'none', fontSize:14, color:'#fff',
                }}
              />
              <button type="submit" style={{
                padding:'0 18px', height:'100%', background:'linear-gradient(135deg,var(--gold),var(--gold-d))',
                border:'none', color:'#0a0020', fontWeight:700, fontSize:13,
                cursor:'pointer', transition:'opacity 0.15s',
              }}>Search</button>
            </div>
          </form>

          {/* Desktop nav links */}
          <nav style={{ display:'flex', alignItems:'center', gap:4 }} className="nav-desktop-links">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding:'7px 14px', borderRadius:9, fontSize:14, fontWeight:500,
                color: location.pathname === l.to ? 'var(--gold)' : 'rgba(220,200,255,0.75)',
                background: location.pathname === l.to ? 'rgba(245,200,66,0.1)' : 'transparent',
                transition:'all 0.15s',
              }}>{l.label}</Link>
            ))}
          </nav>

          {/* Cart icon */}
          <Link to="/cart" style={{ position:'relative', fontSize:22, display:'flex', alignItems:'center', padding:'4px 6px', borderRadius:9, transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(245,200,66,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            🛒
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  style={{
                    position:'absolute', top:-6, right:-6,
                    background:'linear-gradient(135deg,var(--gold),var(--gold-d))',
                    color:'#0a0020', fontSize:10, fontWeight:800,
                    borderRadius:'50%', width:18, height:18,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}
                >{totalItems}</motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div ref={userRef} style={{ position:'relative' }}>
              <button onClick={() => setUserOpen(v => !v)} style={{
                display:'flex', alignItems:'center', gap:8,
                padding:'8px 14px', borderRadius:10,
                border:'1.5px solid rgba(245,200,66,0.3)',
                background:'rgba(255,255,255,0.06)',
                color:'#fff', fontSize:13.5, fontWeight:600,
                transition:'all 0.15s',
              }}>
                <span style={{
                  width:28, height:28, borderRadius:'50%',
                  background:'linear-gradient(135deg,var(--gold),var(--gold-d))',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:12, fontWeight:800, color:'#0a0020',
                }}>{user?.name?.[0]?.toUpperCase()}</span>
                <span className="nav-user-name">{user?.name}</span>
                <span style={{ fontSize:10, opacity:0.5 }}>▼</span>
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity:0, y:-8, scale:0.96 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, y:-8, scale:0.96 }}
                    transition={{ duration:0.15 }}
                    style={{
                      position:'absolute', top:'calc(100% + 10px)', right:0,
                      background:'rgba(10,4,40,0.97)',
                      border:'1px solid rgba(245,200,66,0.2)',
                      borderRadius:12, minWidth:170, overflow:'hidden',
                      boxShadow:'0 12px 40px rgba(0,0,0,0.6)',
                      backdropFilter:'blur(16px)',
                    }}
                  >
                    {[
                      { to:'/orders', icon:'📦', label:'My Orders' },
                    ].map(item => (
                      <Link key={item.to} to={item.to} style={{
                        display:'flex', alignItems:'center', gap:10,
                        padding:'12px 18px', fontSize:13.5, fontWeight:500,
                        color:'rgba(220,200,255,0.9)', transition:'background 0.12s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(245,200,66,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}
                      >
                        {item.icon} {item.label}
                      </Link>
                    ))}
                    <div style={{ height:1, background:'rgba(245,200,66,0.1)' }} />
                    <button onClick={handleLogout} style={{
                      display:'flex', alignItems:'center', gap:10,
                      padding:'12px 18px', fontSize:13.5, fontWeight:500,
                      color:'rgba(239,68,68,0.9)', width:'100%', textAlign:'left',
                      background:'transparent', border:'none', transition:'background 0.12s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      🚪 Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" style={{ flexShrink:0 }}>Login</Link>
          )}

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenu(v => !v)}
            aria-label="Toggle menu"
            style={{
              display:'none', flexDirection:'column', gap:5,
              background:'transparent', border:'none', padding:8,
              cursor:'pointer',
            }}
          >
            {[0,1,2].map(i => (
              <motion.span key={i}
                animate={menuOpen ? (i===1 ? { opacity:0, width:0 } : { rotate: i===0?45:-45, y: i===0?9:-9 }) : { rotate:0, y:0, opacity:1, width:22 }}
                style={{ display:'block', height:2, background:'var(--gold)', borderRadius:2, width:22, transformOrigin:'center' }}
                transition={{ duration:0.2 }}
              />
            ))}
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setMenu(false)}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:198, backdropFilter:'blur(4px)' }}
            />
            <motion.nav
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type:'spring', damping:30, stiffness:300 }}
              style={{
                position:'fixed', top:0, right:0, bottom:0, width:min(320, '85vw'),
                background:'rgba(8,2,35,0.98)',
                backdropFilter:'blur(20px)',
                borderLeft:'1px solid rgba(245,200,66,0.15)',
                zIndex:199, display:'flex', flexDirection:'column',
                padding:'24px 20px',
                boxShadow:'-8px 0 40px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:'#fff' }}>
                  ⚡ Shop<span style={{ color:'var(--gold)' }}>Easy</span>
                </span>
                <button onClick={() => setMenu(false)} style={{ background:'transparent', border:'none', color:'var(--text-2)', fontSize:22, padding:4 }}>✕</button>
              </div>

              {/* Mobile search */}
              <form onSubmit={handleSearch} style={{ marginBottom:28 }}>
                <div style={{ display:'flex', background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(245,200,66,0.2)', borderRadius:12, overflow:'hidden' }}>
                  <input type="text" placeholder="Search products..." value={query} onChange={e => setQuery(e.target.value)}
                    style={{ flex:1, padding:'11px 14px', background:'transparent', border:'none', outline:'none', fontSize:14, color:'#fff' }} />
                  <button type="submit" style={{ padding:'0 16px', background:'linear-gradient(135deg,var(--gold),var(--gold-d))', border:'none', color:'#0a0020', fontWeight:700, cursor:'pointer' }}>→</button>
                </div>
              </form>

              {/* Mobile nav links */}
              <div style={{ display:'flex', flexDirection:'column', gap:4, flex:1 }}>
                {[
                  { to:'/', icon:'🏠', label:'Home' },
                  { to:'/cart', icon:'🛒', label:`Cart ${totalItems > 0 ? `(${totalItems})` : ''}` },
                  ...(!isAuthenticated ? [
                    { to:'/login', icon:'🔑', label:'Login' },
                    { to:'/signup', icon:'✨', label:'Sign Up' },
                  ] : [
                    { to:'/orders', icon:'📦', label:'My Orders' },
                  ]),
                ].map((item, idx) => (
                  <motion.div key={item.to}
                    initial={{ opacity:0, x:20 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <Link to={item.to} onClick={() => setMenu(false)} style={{
                      display:'flex', alignItems:'center', gap:12,
                      padding:'14px 16px', borderRadius:12, fontSize:15, fontWeight:500,
                      color: location.pathname === item.to ? 'var(--gold)' : 'rgba(220,200,255,0.85)',
                      background: location.pathname === item.to ? 'rgba(245,200,66,0.1)' : 'transparent',
                      transition:'all 0.15s',
                    }}>
                      <span>{item.icon}</span>{item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {isAuthenticated && (
                <button onClick={handleLogout} style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'13px 16px', borderRadius:12, fontSize:14, fontWeight:600,
                  color:'rgba(239,68,68,0.9)', background:'rgba(239,68,68,0.08)',
                  border:'1px solid rgba(239,68,68,0.2)', width:'100%', marginTop:16,
                }}>
                  🚪 Logout
                </button>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-search-wrap { display: none !important; }
          .nav-desktop-links { display: none !important; }
          .nav-user-name { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (max-width: 480px) {
          .nav-user-name { display: none !important; }
        }
      `}</style>
    </>
  )
}

function min(a, b) { return `min(${a}px, ${b})` }
