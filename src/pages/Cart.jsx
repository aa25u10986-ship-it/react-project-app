import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../store/cartStore'

export default function Cart() {
  const { items, removeFromCart, updateQty, clearCart } = useCartStore()
  const total      = items.reduce((s, i) => s + i.price * i.qty, 0)
  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const delivery   = total > 999 ? 0 : 99
  const grandTotal = total + delivery

  if (items.length === 0) return (
    <div className="container empty-state" style={{ minHeight:'75vh' }}>
      <motion.span initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', bounce:0.5 }}
        style={{ fontSize:64 }}>🛒</motion.span>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <Link to="/" className="btn btn-primary btn-lg">Start Shopping</Link>
    </div>
  )

  return (
    <div className="container" style={{ padding:'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 64px' }}>

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-sub">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
      </motion.div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr clamp(280px, 30vw, 360px)', gap:24, alignItems:'start' }} className="cart-grid">

        {/* Items */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <AnimatePresence>
            {items.map((item, idx) => (
              <motion.div key={item.id}
                initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:20, height:0, marginBottom:0 }}
                transition={{ duration:0.25, delay:idx*0.05 }}
                style={{
                  background:'rgba(8,2,35,0.82)', backdropFilter:'blur(14px)',
                  border:'1px solid rgba(245,200,66,0.14)',
                  borderRadius:16, padding:16, display:'flex', gap:14, alignItems:'center',
                }}
              >
                {/* Image */}
                <Link to={`/product/${item.id}`} style={{ flexShrink:0 }}>
                  <motion.img whileHover={{ scale:1.05 }} src={item.image} alt={item.title}
                    style={{ width:72, height:72, objectFit:'cover', borderRadius:10, border:'1px solid rgba(245,200,66,0.12)' }} />
                </Link>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <Link to={`/product/${item.id}`}>
                    <p style={{ fontSize:14, fontWeight:600, color:'rgba(240,232,255,0.9)', marginBottom:3, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.4, transition:'color 0.15s' }}
                      onMouseEnter={e => e.target.style.color='var(--gold)'}
                      onMouseLeave={e => e.target.style.color='rgba(240,232,255,0.9)'}
                    >{item.title}</p>
                  </Link>
                  <p style={{ fontSize:12, color:'rgba(200,180,255,0.5)', marginBottom:10 }}>₹{item.price.toLocaleString('en-IN')} each</p>

                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
                    <div className="qty-control" style={{ transform:'scale(0.9)', transformOrigin:'left' }}>
                      <button onClick={() => updateQty(item.id, item.qty-1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty+1)}>+</button>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <p style={{ fontSize:15, fontWeight:800, color:'var(--gold)' }}>₹{(item.price*item.qty).toLocaleString('en-IN')}</p>
                      <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                        onClick={() => removeFromCart(item.id)}
                        style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(239,68,68,0.8)', fontSize:14, cursor:'pointer', transition:'all 0.15s' }}
                      >✕</motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button onClick={clearCart} className="btn btn-outline btn-sm" style={{ alignSelf:'flex-start', color:'rgba(239,68,68,0.8)', borderColor:'rgba(239,68,68,0.2)' }}>
            🗑 Clear Cart
          </button>
        </div>

        {/* Summary */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          style={{ background:'rgba(8,2,35,0.85)', backdropFilter:'blur(16px)', border:'1px solid rgba(245,200,66,0.18)', borderRadius:18, padding:24, position:'sticky', top:84 }}
        >
          <h2 style={{ fontSize:18, fontWeight:700, marginBottom:20, color:'#fff' }}>Order Summary</h2>

          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
            {items.map(i => (
              <div key={i.id} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'rgba(200,180,255,0.65)' }}>
                <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'60%' }}>{i.title} ×{i.qty}</span>
                <span style={{ fontWeight:600, flexShrink:0 }}>₹{(i.price*i.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div style={{ height:1, background:'rgba(245,200,66,0.12)', margin:'16px 0' }} />

          {[
            ['Subtotal', `₹${total.toLocaleString('en-IN')}`],
            ['Delivery', delivery === 0 ? 'FREE' : `₹${delivery}`],
          ].map(([label, value]) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:'rgba(200,180,255,0.7)', marginBottom:10 }}>
              <span>{label}</span>
              <span style={{ fontWeight:600, color: value==='FREE' ? '#4ade80' : 'inherit' }}>{value}</span>
            </div>
          ))}

          <div style={{ height:1, background:'rgba(245,200,66,0.12)', margin:'12px 0 16px' }} />

          <div style={{ display:'flex', justifyContent:'space-between', fontSize:18, fontWeight:800, color:'#fff', marginBottom:20 }}>
            <span>Total</span>
            <span style={{ color:'var(--gold)' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>

          {total <= 999 && (
            <p style={{ fontSize:12.5, color:'rgba(245,200,66,0.75)', background:'rgba(245,200,66,0.08)', border:'1px solid rgba(245,200,66,0.15)', borderRadius:8, padding:'8px 12px', marginBottom:14, textAlign:'center' }}>
              Add ₹{(1000 - total).toLocaleString('en-IN')} more for free delivery!
            </p>
          )}
          {total > 999 && (
            <p style={{ fontSize:12.5, color:'rgba(34,197,94,0.85)', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:8, padding:'8px 12px', marginBottom:14, textAlign:'center' }}>
              🎉 You've unlocked free delivery!
            </p>
          )}

          <Link to="/checkout" className="btn btn-primary btn-full btn-lg">
            Proceed to Checkout →
          </Link>
          <Link to="/" className="btn btn-outline btn-full" style={{ marginTop:10 }}>
            Continue Shopping
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
