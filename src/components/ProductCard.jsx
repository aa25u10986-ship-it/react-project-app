import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartStore } from '../store/cartStore'

export default function ProductCard({ product }) {
  const addToCart = useCartStore(s => s.addToCart)
  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const stars = Math.round(product.rating)

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration:'none', display:'block', height:'100%' }}>
      <motion.div
        whileHover={{ y:-6, boxShadow:'0 16px 48px rgba(0,0,0,0.5), 0 0 30px rgba(245,200,66,0.18)' }}
        whileTap={{ scale:0.98 }} transition={{ duration:0.2 }}
        style={{ background:'rgba(8,2,35,0.78)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', border:'1px solid rgba(245,200,66,0.15)', borderRadius:16, overflow:'hidden', display:'flex', flexDirection:'column', height:'100%' }}
      >
        <div style={{ position:'relative', aspectRatio:'1/1', overflow:'hidden', background:'rgba(0,0,0,0.3)' }}>
          <motion.img src={product.image} alt={product.title} loading="lazy"
            whileHover={{ scale:1.07 }} transition={{ duration:0.35 }}
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          <span style={{ position:'absolute', top:10, left:10, background:'rgba(245,200,66,0.15)', color:'var(--gold)', border:'1px solid rgba(245,200,66,0.3)', backdropFilter:'blur(8px)', borderRadius:20, padding:'3px 10px', fontSize:10, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase' }}>
            {product.category}
          </span>
          <span style={{ position:'absolute', top:10, right:10, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)', borderRadius:20, padding:'3px 8px', fontSize:11, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:3 }}>
            ⭐ {product.rating}
          </span>
        </div>
        <div style={{ padding:'14px 14px 16px', display:'flex', flexDirection:'column', gap:8, flex:1 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'rgba(240,232,255,0.95)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.45 }}>
            {product.title}
          </h3>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ color:'var(--gold)', fontSize:12, letterSpacing:1 }}>{'★'.repeat(stars)}{'☆'.repeat(5-stars)}</span>
            <span style={{ fontSize:11.5, color:'rgba(200,180,255,0.55)' }}>({product.reviews})</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto', paddingTop:8, borderTop:'1px solid rgba(245,200,66,0.08)' }}>
            <p style={{ fontSize:18, fontWeight:800, color:'var(--gold)', fontFamily:"'Syne',sans-serif" }}>
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.93 }}
              onClick={handleAdd}
              style={{ padding:'7px 13px', borderRadius:9, border:'none', background:added?'linear-gradient(135deg,#22c55e,#16a34a)':'linear-gradient(135deg,var(--gold),var(--gold-d))', color:'#0a0020', fontSize:12, fontWeight:700, cursor:'pointer', transition:'background 0.25s', whiteSpace:'nowrap' }}
            >{added ? '✓ Added' : '+ Add'}</motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
