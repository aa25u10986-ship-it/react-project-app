import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getProductById } from '../api/productApi'
import { useCartStore } from '../store/cartStore'

export default function ProductDetail() {
  const { id }        = useParams()
  const addToCart     = useCartStore(s => s.addToCart)
  const [product,  setProduct]  = useState(null)
  const [related,  setRelated]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [qty,      setQty]      = useState(1)
  const [added,    setAdded]    = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getProductById(id)
      .then(res => {
        setProduct(res.data)
        setRelated(res.related || [])
        setLoading(false)
      })
      .catch(() => { setError('Product not found'); setLoading(false) })
  }, [id])

  if (loading) return (
    <div className="container empty-state" style={{ minHeight:'70vh' }}>
      <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
        style={{ width:48, height:48, borderRadius:'50%', border:'3px solid rgba(245,200,66,0.15)', borderTop:'3px solid var(--gold)' }}
      />
      <p style={{ color:'rgba(200,180,255,0.6)' }}>Loading product...</p>
    </div>
  )

  if (error || !product) return (
    <div className="container empty-state" style={{ minHeight:'70vh' }}>
      <span className="icon">😕</span>
      <h2>Product not found</h2>
      <p>This product doesn't exist or the backend is offline.</p>
      <Link to="/" className="btn btn-primary">Back to Shop</Link>
    </div>
  )

  const stars = Math.round(product.rating)

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <div className="container" style={{ paddingTop:32, paddingBottom:64 }}>

      {/* Breadcrumb */}
      <motion.nav initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'rgba(200,180,255,0.55)', marginBottom:28, flexWrap:'wrap' }}
      >
        <Link to="/" style={{ color:'var(--gold)', fontWeight:500 }}>Home</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span style={{ color:'rgba(220,200,255,0.8)', fontWeight:500 }}>{product.title}</span>
      </motion.nav>

      {/* Main grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap:40, marginBottom:56, alignItems:'start' }}>

        {/* Image */}
        <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.55 }}>
          <div style={{ position:'relative', borderRadius:20, overflow:'hidden', background:'rgba(8,2,35,0.6)', border:'1px solid rgba(245,200,66,0.15)', aspectRatio:'1' }}>
            <img src={product.image} alt={product.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,transparent 60%,rgba(245,200,66,0.06))', pointerEvents:'none' }} />
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.55, delay:0.1 }}
          style={{ display:'flex', flexDirection:'column', gap:18 }}
        >
          <span className="badge badge-primary" style={{ width:'fit-content' }}>{product.category}</span>

          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'clamp(22px,4vw,34px)', fontWeight:800, lineHeight:1.15, color:'#fff' }}>
            {product.title}
          </h1>

          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ color:'var(--gold)', fontSize:16, letterSpacing:2 }}>
              {'★'.repeat(stars)}{'☆'.repeat(5-stars)}
            </span>
            <span style={{ fontSize:14, color:'rgba(200,180,255,0.65)' }}>{product.rating} · {product.reviews} reviews</span>
          </div>

          <div style={{ height:1, background:'linear-gradient(90deg,rgba(245,200,66,0.2),transparent)' }} />

          <div>
            <p style={{ fontSize:'clamp(28px,5vw,40px)', fontWeight:800, color:'var(--gold)', fontFamily:"'Syne',sans-serif", lineHeight:1 }}>
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            {product.stock > 0
              ? <p style={{ fontSize:12, color:'rgba(34,197,94,0.85)', marginTop:5, fontWeight:600 }}>✓ In Stock ({product.stock} left) · Free delivery over ₹999</p>
              : <p style={{ fontSize:12, color:'rgba(239,68,68,0.85)', marginTop:5, fontWeight:600 }}>✗ Out of Stock</p>
            }
          </div>

          <p style={{ fontSize:15, color:'rgba(220,200,255,0.7)', lineHeight:1.7 }}>{product.description}</p>

          {/* Qty */}
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ fontSize:13, fontWeight:600, color:'rgba(200,180,255,0.7)', textTransform:'uppercase', letterSpacing:0.5 }}>Qty</span>
            <div className="qty-control">
              <button onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q+1)}>+</button>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={handleAdd} disabled={product.stock === 0}
              style={{ flex:1, minWidth:140, padding:'14px 20px', borderRadius:12, border:'none', background:added?'linear-gradient(135deg,#22c55e,#16a34a)':product.stock===0?'rgba(100,100,100,0.3)':'linear-gradient(135deg,var(--gold),var(--gold-d))', color:'#0a0020', fontSize:15, fontWeight:700, cursor:product.stock===0?'not-allowed':'pointer', transition:'background 0.25s', boxShadow:added||product.stock===0?'none':'0 6px 24px rgba(245,200,66,0.3)' }}
            >
              {added ? '✓ Added to Cart!' : product.stock===0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </motion.button>
            <Link to="/cart" className="btn btn-outline" style={{ flex:1, minWidth:120 }}>View Cart →</Link>
          </div>

          {/* Trust badges */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {['Free Delivery','Easy Returns','Secure Payment'].map(b => (
              <span key={b} style={{ fontSize:12, color:'rgba(34,197,94,0.85)', fontWeight:600, background:'rgba(34,197,94,0.1)', padding:'4px 12px', borderRadius:20, border:'1px solid rgba(34,197,94,0.2)' }}>✓ {b}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <motion.section initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <h2 className="section-heading">Related Products</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(160px,100%),1fr))', gap:14 }}>
            {related.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration:'none' }}>
                <motion.div whileHover={{ y:-4 }} style={{ background:'rgba(8,2,35,0.75)', border:'1px solid rgba(245,200,66,0.13)', borderRadius:14, overflow:'hidden' }}>
                  <img src={p.image} alt={p.title} style={{ width:'100%', aspectRatio:'1', objectFit:'cover' }} />
                  <div style={{ padding:'10px 12px' }}>
                    <p style={{ fontSize:13, fontWeight:600, color:'rgba(240,232,255,0.9)', marginBottom:4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.4 }}>{p.title}</p>
                    <p style={{ fontSize:14, fontWeight:800, color:'var(--gold)' }}>₹{p.price.toLocaleString('en-IN')}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}
