import { useState, useMemo, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { getProducts, getCategories } from '../api/productApi'
import ProductCard from '../components/ProductCard'

const SORT_OPTIONS = [
  { label: 'Default',         value: 'default' },
  { label: 'Price: Low–High', value: 'price_asc' },
  { label: 'Price: High–Low', value: 'price_desc' },
  { label: 'Top Rated',       value: 'rating' },
  { label: 'Most Reviews',    value: 'reviews' },
]
const CAT_ICONS = { All:'🌟', Electronics:'⚡', Fashion:'👟', Home:'🏠', Sports:'🏋️' }

export default function Home() {
  const [searchParams] = useSearchParams()
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState(['All'])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [category,   setCategory]   = useState('All')
  const [sort,       setSort]       = useState('default')
  const [minPrice,   setMinPrice]   = useState('')
  const [maxPrice,   setMaxPrice]   = useState('')
  const [search,     setSearch]     = useState(searchParams.get('search') || '')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY     = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  // ── Fetch categories once on mount ──────────────────────────────────
  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data))
      .catch(() => setCategories(['All', 'Electronics', 'Fashion', 'Home', 'Sports']))
  }, [])

  // ── Fetch products whenever filters change ───────────────────────────
  useEffect(() => {
    setLoading(true)
    setError(null)
    getProducts({ category, search, minPrice, maxPrice, sort })
      .then(res => { setProducts(res.data); setLoading(false) })
      .catch(err => {
        setError('Could not load products. Is the backend running?')
        setLoading(false)
      })
  }, [category, search, minPrice, maxPrice, sort])

  const resetFilters = () => {
    setCategory('All'); setMinPrice(''); setMaxPrice('')
    setSearch(''); setSort('default')
  }

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position:'relative', minHeight:'clamp(520px,85vh,800px)', overflow:'hidden', display:'flex', alignItems:'center' }}>
        <motion.div style={{ position:'absolute', inset:0, y:heroY, scale:heroScale }}>
          <img src="/goku.webp" alt="Goku" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', filter:'brightness(0.55) saturate(1.2)' }} />
        </motion.div>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, rgba(5,0,25,0.92) 0%, rgba(5,0,25,0.65) 55%, rgba(5,0,25,0.25) 100%)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:200, background:'linear-gradient(0deg, #050010 0%, transparent 100%)' }} />

        {/* Energy particles */}
        {[...Array(10)].map((_,i) => (
          <motion.div key={i} style={{ position:'absolute', left:`${10+i*8}%`, top:`${20+(i%5)*14}%`, width:3, height:3, borderRadius:'50%', background: i%3===0?'var(--gold)':i%3===1?'#88ccff':'#ff8800', filter:'blur(1px)' }}
            animate={{ y:[-10,10,-10], opacity:[0.3,1,0.3] }}
            transition={{ duration:2.5+i*0.3, repeat:Infinity, ease:'easeInOut', delay:i*0.2 }}
          />
        ))}

        <div style={{ position:'relative', zIndex:2, width:'100%' }} className="container">
          <div style={{ maxWidth:600 }}>
            <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
              style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,200,66,0.12)', border:'1px solid rgba(245,200,66,0.3)', borderRadius:20, padding:'5px 14px', marginBottom:20, fontSize:12, fontWeight:600, letterSpacing:2, textTransform:'uppercase', color:'var(--gold)' }}
            >⚡ Premium Collection 2026</motion.div>

            <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
              style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(32px,6vw,68px)', fontWeight:800, lineHeight:1.06, letterSpacing:'-1.5px', marginBottom:16 }}
            >
              Shop the{' '}
              <span style={{ background:'linear-gradient(135deg,var(--gold),#ff8800)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Best Deals</span>
              <br />in Style
            </motion.h1>

            <motion.p initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
              style={{ fontSize:'clamp(14px,1.8vw,17px)', color:'rgba(220,200,255,0.75)', marginBottom:28, lineHeight:1.7, maxWidth:480 }}
            >Electronics, Fashion, Home &amp; Sports — delivered to your door with elegance.</motion.p>

            <motion.form initial={{ opacity:0, y:25 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
              onSubmit={e => e.preventDefault()}
              style={{ display:'flex', maxWidth:520, background:'rgba(255,255,255,0.07)', border:'1.5px solid rgba(245,200,66,0.3)', borderRadius:14, overflow:'hidden', backdropFilter:'blur(12px)' }}
            >
              <span style={{ padding:'0 14px', fontSize:18, display:'flex', alignItems:'center', opacity:0.5 }}>🔍</span>
              <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ flex:1, padding:'14px 0', background:'transparent', border:'none', outline:'none', fontSize:14, color:'#fff' }} />
              <button type="submit" className="btn btn-primary" style={{ borderRadius:0, padding:'0 22px' }}>Search</button>
            </motion.form>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
              style={{ display:'flex', flexWrap:'wrap', gap:10, marginTop:24 }}
            >
              {['Free Delivery','Easy Returns','Secure Payment','24/7 Support'].map((b,i) => (
                <motion.span key={b} initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.65+i*0.08 }}
                  style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(245,200,66,0.08)', border:'1px solid rgba(245,200,66,0.18)', borderRadius:20, padding:'5px 13px', fontSize:12.5, fontWeight:500, color:'rgba(245,200,66,0.85)' }}
                >✦ {b}</motion.span>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.75 }}
            style={{ display:'flex', marginTop:40, width:'fit-content' }}
          >
            {[['12+','Products'],['4.5★','Avg Rating'],['1K+','Happy Buyers']].map(([num,label],i) => (
              <div key={label} style={{ padding:'16px 24px', borderLeft:i>0?'1px solid rgba(245,200,66,0.12)':'none', textAlign:'center' }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:'var(--gold)', lineHeight:1.1 }}>{num}</div>
                <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'rgba(220,200,255,0.4)', marginTop:3 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRODUCTS SECTION ── */}
      <div className="container" style={{ paddingTop:48, paddingBottom:64 }}>

        {/* Category chips */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:28 }}>
          {categories.map((c,i) => (
            <motion.button key={c} whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}
              onClick={() => setCategory(c)}
              style={{ padding:'8px 18px', borderRadius:24, border:category===c?'1.5px solid var(--gold)':'1.5px solid rgba(245,200,66,0.2)', background:category===c?'rgba(245,200,66,0.18)':'rgba(8,0,32,0.6)', color:category===c?'var(--gold)':'rgba(200,180,255,0.8)', fontSize:13.5, fontWeight:category===c?700:500, cursor:'pointer', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', gap:6 }}
            >{CAT_ICONS[c]||'📦'} {c}</motion.button>
          ))}
        </div>

        <div style={{ display:'flex', gap:24, alignItems:'flex-start' }}>

          {/* Desktop Sidebar */}
          <aside className="sidebar-desktop" style={{ width:220, flexShrink:0, position:'sticky', top:80 }}>
            <div style={{ background:'rgba(8,2,35,0.82)', backdropFilter:'blur(16px)', border:'1px solid rgba(245,200,66,0.15)', borderRadius:16, padding:20 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                <h3 style={{ fontSize:15, fontWeight:700, color:'var(--gold)' }}>Filters</h3>
                <button onClick={resetFilters} style={{ fontSize:11, color:'rgba(200,180,255,0.6)', background:'transparent', border:'none', cursor:'pointer' }}>Reset</button>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11, fontWeight:700, color:'rgba(245,200,66,0.6)', display:'block', marginBottom:10, textTransform:'uppercase', letterSpacing:1 }}>Price (₹)</label>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  {[['Min',minPrice,setMinPrice],['Max',maxPrice,setMaxPrice]].map(([ph,val,setter]) => (
                    <input key={ph} type="number" placeholder={ph} value={val} onChange={e => setter(e.target.value)}
                      style={{ width:'100%', padding:'8px 10px', background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(245,200,66,0.18)', borderRadius:8, fontSize:13, color:'#fff', outline:'none' }} />
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'rgba(245,200,66,0.6)', display:'block', marginBottom:10, textTransform:'uppercase', letterSpacing:1 }}>Category</label>
                {categories.map(c => (
                  <label key={c} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', cursor:'pointer', fontSize:13.5, color:category===c?'var(--gold)':'rgba(200,180,255,0.75)', fontWeight:category===c?600:400 }}>
                    <input type="radio" name="cat" checked={category===c} onChange={() => setCategory(c)} style={{ accentColor:'var(--gold)', width:14, height:14 }} />
                    {CAT_ICONS[c]} {c}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, gap:12, flexWrap:'wrap' }}>
              <p style={{ fontSize:14, color:'rgba(200,180,255,0.7)', fontWeight:500 }}>
                <span style={{ color:'var(--gold)', fontWeight:700 }}>{products.length}</span> products found
              </p>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <button className="mobile-filter-btn" onClick={() => setFiltersOpen(v => !v)}
                  style={{ display:'none', alignItems:'center', gap:6, padding:'8px 14px', background:'rgba(245,200,66,0.1)', border:'1.5px solid rgba(245,200,66,0.25)', borderRadius:10, color:'var(--gold)', fontSize:13, fontWeight:600, cursor:'pointer' }}
                >⚙ Filters</button>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  style={{ padding:'9px 14px', background:'rgba(8,0,32,0.8)', border:'1.5px solid rgba(245,200,66,0.22)', borderRadius:10, fontSize:13.5, color:'#f0e0ff', backdropFilter:'blur(8px)', outline:'none', cursor:'pointer' }}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Mobile filter panel */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                  style={{ overflow:'hidden', marginBottom:16 }}
                >
                  <div style={{ background:'rgba(8,2,35,0.9)', border:'1px solid rgba(245,200,66,0.15)', borderRadius:14, padding:18 }}>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
                      {categories.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                          style={{ padding:'6px 14px', borderRadius:20, border:category===c?'1.5px solid var(--gold)':'1.5px solid rgba(245,200,66,0.2)', background:category===c?'rgba(245,200,66,0.15)':'transparent', color:category===c?'var(--gold)':'rgba(200,180,255,0.7)', fontSize:13, cursor:'pointer', fontWeight:category===c?600:400 }}
                        >{CAT_ICONS[c]} {c}</button>
                      ))}
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                      <span style={{ fontSize:12, color:'rgba(245,200,66,0.6)', fontWeight:600 }}>Price:</span>
                      {[['Min',minPrice,setMinPrice],['Max',maxPrice,setMaxPrice]].map(([ph,val,setter]) => (
                        <input key={ph} type="number" placeholder={`${ph} ₹`} value={val} onChange={e => setter(e.target.value)}
                          style={{ width:90, padding:'7px 10px', background:'rgba(255,255,255,0.06)', border:'1.5px solid rgba(245,200,66,0.18)', borderRadius:8, fontSize:13, color:'#fff', outline:'none' }} />
                      ))}
                      <button onClick={resetFilters} style={{ padding:'7px 14px', borderRadius:8, background:'rgba(245,200,66,0.12)', border:'1px solid rgba(245,200,66,0.2)', color:'var(--gold)', fontSize:12, fontWeight:600, cursor:'pointer' }}>Reset</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading state */}
            {loading && (
              <div style={{ display:'flex', justifyContent:'center', padding:'80px 0', flexDirection:'column', alignItems:'center', gap:16 }}>
                <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                  style={{ width:44, height:44, borderRadius:'50%', border:'3px solid rgba(245,200,66,0.15)', borderTop:'3px solid var(--gold)' }}
                />
                <p style={{ color:'rgba(200,180,255,0.6)', fontSize:14 }}>Loading products...</p>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="empty-state">
                <span className="icon">⚠️</span>
                <h2>Backend not connected</h2>
                <p>{error}</p>
                <p style={{ fontSize:12, color:'rgba(200,180,255,0.4)', marginTop:4 }}>Run: <code style={{ background:'rgba(255,255,255,0.08)', padding:'2px 8px', borderRadius:4 }}>cd backend && npm run dev</code></p>
              </div>
            )}

            {/* Empty results */}
            {!loading && !error && products.length === 0 && (
              <div className="empty-state">
                <span className="icon">🔍</span>
                <h2>No products found</h2>
                <p>Try different filters or search terms.</p>
                <button className="btn btn-primary" onClick={resetFilters}>Clear Filters</button>
              </div>
            )}

            {/* Products grid */}
            {!loading && !error && products.length > 0 && (
              <motion.div
                key={`${category}-${sort}-${search}-${minPrice}-${maxPrice}`}
                style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(200px,100%),1fr))', gap:16 }}
                initial="hidden" animate="visible"
                variants={{ visible:{ transition:{ staggerChildren:0.06 } }, hidden:{} }}
              >
                {products.map(p => (
                  <motion.div key={p.id} variants={{ hidden:{ opacity:0, y:24 }, visible:{ opacity:1, y:0 } }} transition={{ duration:0.35 }}>
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width:900px) { .sidebar-desktop{display:none!important;} .mobile-filter-btn{display:flex!important;} }
      `}</style>
    </div>
  )
}
