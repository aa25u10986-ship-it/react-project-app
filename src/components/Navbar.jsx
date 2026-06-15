import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const [query,   setQuery]   = useState('')
  const [menuOpen, setMenu]   = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const items    = useCartStore(s => s.items)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const profileRef = useRef(null)
  const totalItems = items.reduce((s, i) => s + i.qty, 0)

  // Scroll effect
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close dropdown on route change
  useEffect(() => { setMenu(false); setProfileOpen(false) }, [location.pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  // Close mobile drawer on resize
  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setMenu(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/?search=${encodeURIComponent(query.trim())}`)
    setMenu(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setProfileOpen(false)
    setMenu(false)
  }

  // First letter of name for avatar
  const avatar = user?.name?.[0]?.toUpperCase() || '?'

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'sticky', top: 0, zIndex: 200,
          background: scrolled ? 'rgba(5,0,25,0.96)' : 'rgba(5,0,20,0.78)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${scrolled ? 'rgba(245,200,66,0.22)' : 'rgba(245,200,66,0.08)'}`,
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="container" style={{ display:'flex', alignItems:'center', gap:14, height:64 }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:7, fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:'#fff', whiteSpace:'nowrap', flexShrink:0, textDecoration:'none' }}>
            <span style={{ fontSize:22 }}>⚡</span>
            Shop<span style={{ color:'var(--gold)' }}>Easy</span>
          </Link>

          {/* ── Search (desktop) ── */}
          <form onSubmit={handleSearch} className="nav-search-wrap"
            style={{ flex:1, display:'flex', maxWidth:460, marginLeft:8 }}
          >
            <div style={{ flex:1, display:'flex', alignItems:'center', background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(245,200,66,0.2)', borderRadius:12, overflow:'hidden' }}>
              <span style={{ padding:'0 12px', fontSize:16, opacity:0.45 }}>🔍</span>
              <input type="text" placeholder="Search products..." value={query} onChange={e => setQuery(e.target.value)}
                style={{ flex:1, padding:'10px 0', background:'transparent', border:'none', outline:'none', fontSize:14, color:'#fff' }} />
              <button type="submit"
                style={{ padding:'0 18px', height:'100%', background:'linear-gradient(135deg,var(--gold),var(--gold-d))', border:'none', color:'#0a0020', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                Search
              </button>
            </div>
          </form>

          {/* ── Nav links (desktop) ── */}
          <nav className="nav-desktop-links" style={{ display:'flex', alignItems:'center', gap:4 }}>
            {[{ to:'/', label:'Home' }, { to:'/cart', label:'Cart' }].map(l => (
              <Link key={l.to} to={l.to} style={{
                padding:'7px 14px', borderRadius:9, fontSize:14, fontWeight:500, textDecoration:'none',
                color: location.pathname === l.to ? 'var(--gold)' : 'rgba(220,200,255,0.75)',
                background: location.pathname === l.to ? 'rgba(245,200,66,0.1)' : 'transparent',
              }}>{l.label}</Link>
            ))}
          </nav>

          {/* ── Cart badge ── */}
          <Link to="/cart" style={{ position:'relative', fontSize:22, display:'flex', alignItems:'center', padding:'4px 6px', borderRadius:9, textDecoration:'none' }}>
            🛒
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span key={totalItems}
                  initial={{ scale:0.4, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.4, opacity:0 }}
                  style={{ position:'absolute', top:-6, right:-6, background:'linear-gradient(135deg,var(--gold),var(--gold-d))', color:'#0a0020', fontSize:10, fontWeight:800, borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center' }}
                >{totalItems}</motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* ── Profile Icon + Dropdown ── */}
          {isAuthenticated ? (
            <div ref={profileRef} style={{ position:'relative', flexShrink:0 }}>

              {/* Profile button */}
              <motion.button
                whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                onClick={() => setProfileOpen(v => !v)}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  background:'transparent', border:'none', cursor:'pointer', padding:0,
                }}
                aria-label="Profile menu"
              >
                {/* Avatar circle */}
                <div style={{
                  width:38, height:38, borderRadius:'50%',
                  background:'linear-gradient(135deg,var(--gold),#ff8800)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:15, fontWeight:800, color:'#0a0020',
                  border:'2px solid rgba(245,200,66,0.4)',
                  boxShadow: profileOpen ? '0 0 0 3px rgba(245,200,66,0.25)' : 'none',
                  transition:'box-shadow 0.2s',
                }}>
                  {avatar}
                </div>
                {/* Name — hidden on small screens */}
                <span className="nav-user-name" style={{ color:'#fff', fontSize:13.5, fontWeight:600 }}>
                  {user?.name}
                </span>
                {/* Caret */}
                <motion.span animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration:0.2 }}
                  style={{ color:'rgba(245,200,66,0.6)', fontSize:11, lineHeight:1 }}
                >▼</motion.span>
              </motion.button>

              {/* Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity:0, y:-10, scale:0.95 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, y:-10, scale:0.95 }}
                    transition={{ duration:0.18 }}
                    style={{
                      position:'absolute', top:'calc(100% + 12px)', right:0,
                      background:'rgba(8,2,40,0.98)',
                      border:'1px solid rgba(245,200,66,0.2)',
                      borderRadius:14, minWidth:200, overflow:'hidden',
                      boxShadow:'0 16px 48px rgba(0,0,0,0.7)',
                      backdropFilter:'blur(20px)',
                    }}
                  >
                    {/* User info header */}
                    <div style={{ padding:'14px 18px 12px', borderBottom:'1px solid rgba(245,200,66,0.1)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold),#ff8800)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#0a0020', flexShrink:0 }}>
                          {avatar}
                        </div>
                        <div>
                          <p style={{ fontSize:13.5, fontWeight:700, color:'#fff', marginBottom:1 }}>{user?.name}</p>
                          <p style={{ fontSize:11.5, color:'rgba(200,180,255,0.5)' }}>{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* My Orders */}
                    <Link to="/orders"
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 18px', fontSize:14, fontWeight:500, color:'rgba(220,200,255,0.9)', textDecoration:'none', transition:'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(245,200,66,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <span style={{ fontSize:18 }}>📦</span>
                      <div>
                        <p style={{ fontWeight:600, marginBottom:1 }}>My Orders</p>
                        <p style={{ fontSize:11.5, color:'rgba(200,180,255,0.45)' }}>Track your purchases</p>
                      </div>
                    </Link>

                    <div style={{ height:1, background:'rgba(239,68,68,0.12)', margin:'0 12px' }} />

                    {/* Logout */}
                    <button onClick={handleLogout}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 18px', fontSize:14, fontWeight:500, color:'rgba(239,68,68,0.85)', width:'100%', textAlign:'left', background:'transparent', border:'none', cursor:'pointer', transition:'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <span style={{ fontSize:18 }}>🚪</span>
                      <div>
                        <p style={{ fontWeight:600, marginBottom:1 }}>Logout</p>
                        <p style={{ fontSize:11.5, color:'rgba(239,68,68,0.4)' }}>Sign out of your account</p>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              <Link to="/login"  className="btn btn-outline btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm" style={{ display:'none' }} className2="nav-signup-btn">Sign Up</Link>
            </div>
          )}

          {/* ── Hamburger (mobile) ── */}
          <button className="nav-hamburger" onClick={() => setMenu(v => !v)}
            aria-label="Toggle menu"
            style={{ display:'none', flexDirection:'column', gap:5, background:'transparent', border:'none', padding:8, cursor:'pointer' }}
          >
            {[0,1,2].map(i => (
              <motion.span key={i}
                animate={ menuOpen ? (i===1 ? { opacity:0 } : { rotate: i===0?45:-45, y: i===0?7:-7 }) : { rotate:0, y:0, opacity:1 }}
                style={{ display:'block', height:2, width:22, background:'var(--gold)', borderRadius:2, transformOrigin:'center' }}
                transition={{ duration:0.2 }}
              />
            ))}
          </button>

        </div>
      </motion.header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setMenu(false)}
              style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', zIndex:198, backdropFilter:'blur(4px)' }}
            />
            <motion.nav
              initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
              transition={{ type:'spring', damping:28, stiffness:280 }}
              style={{ position:'fixed', top:0, right:0, bottom:0, width:'min(320px,85vw)', background:'rgba(6,1,28,0.98)', backdropFilter:'blur(20px)', borderLeft:'1px solid rgba(245,200,66,0.14)', zIndex:199, display:'flex', flexDirection:'column', padding:'24px 20px', boxShadow:'-8px 0 40px rgba(0,0,0,0.6)' }}
            >
              {/* Header */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:'#fff' }}>⚡ Shop<span style={{ color:'var(--gold)' }}>Easy</span></span>
                <button onClick={() => setMenu(false)} style={{ background:'transparent', border:'none', color:'rgba(200,180,255,0.6)', fontSize:20, cursor:'pointer' }}>✕</button>
              </div>

              {/* Mobile user info (if logged in) */}
              {isAuthenticated && (
                <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'rgba(245,200,66,0.06)', border:'1px solid rgba(245,200,66,0.12)', borderRadius:12, marginBottom:20 }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold),#ff8800)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#0a0020', flexShrink:0 }}>{avatar}</div>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:'#fff' }}>{user?.name}</p>
                    <p style={{ fontSize:12, color:'rgba(200,180,255,0.5)' }}>{user?.email}</p>
                  </div>
                </div>
              )}

              {/* Search */}
              <form onSubmit={handleSearch} style={{ marginBottom:20 }}>
                <div style={{ display:'flex', background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(245,200,66,0.2)', borderRadius:12, overflow:'hidden' }}>
                  <input type="text" placeholder="Search products..." value={query} onChange={e => setQuery(e.target.value)}
                    style={{ flex:1, padding:'11px 14px', background:'transparent', border:'none', outline:'none', fontSize:14, color:'#fff' }} />
                  <button type="submit" style={{ padding:'0 16px', background:'linear-gradient(135deg,var(--gold),var(--gold-d))', border:'none', color:'#0a0020', fontWeight:700, cursor:'pointer' }}>→</button>
                </div>
              </form>

              {/* Links */}
              <div style={{ display:'flex', flexDirection:'column', gap:4, flex:1 }}>
                {[
                  { to:'/', icon:'🏠', label:'Home' },
                  { to:'/cart', icon:'🛒', label:`Cart${totalItems > 0 ? ` (${totalItems})` : ''}` },
                  ...(isAuthenticated
                    ? [{ to:'/orders', icon:'�', label:'My Orders' }]
                    : [{ to:'/login', icon:'🔑', label:'Login' }, { to:'/signup', icon:'✨', label:'Sign Up' }]
                  ),
                ].map((item, i) => (
                  <motion.div key={item.to} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}>
                    <Link to={item.to} onClick={() => setMenu(false)}
                      style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderRadius:12, fontSize:15, fontWeight:500, textDecoration:'none', color: location.pathname===item.to ? 'var(--gold)' : 'rgba(220,200,255,0.85)', background: location.pathname===item.to ? 'rgba(245,200,66,0.1)' : 'transparent' }}
                    ><span>{item.icon}</span>{item.label}</Link>
                  </motion.div>
                ))}
              </div>

              {isAuthenticated && (
                <button onClick={handleLogout}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', borderRadius:12, fontSize:14, fontWeight:600, color:'rgba(239,68,68,0.9)', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.18)', width:'100%', marginTop:12, cursor:'pointer' }}
                >🚪 Logout</button>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-search-wrap  { display: none !important; }
          .nav-desktop-links { display: none !important; }
          .nav-user-name    { display: none !important; }
          .nav-hamburger    { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-signup-btn { display: inline-flex !important; }
        }
      `}</style>
    </>
  )
}
