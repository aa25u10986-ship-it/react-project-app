import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

const FIELDS = [
  { label:'Full Name', key:'name',    type:'text',  placeholder:'John Doe' },
  { label:'Email',     key:'email',   type:'email', placeholder:'you@example.com' },
  { label:'Phone',     key:'phone',   type:'tel',   placeholder:'+91 98765 43210' },
  { label:'Address',   key:'address', type:'text',  placeholder:'Street address' },
  { label:'City',      key:'city',    type:'text',  placeholder:'Mumbai' },
  { label:'Pincode',   key:'pincode', type:'text',  placeholder:'400001' },
]
const PAYMENTS = [
  { value:'cod', icon:'💵', label:'Cash on Delivery' },
  { value:'upi', icon:'📱', label:'UPI / GPay / PhonePe' },
  { value:'card',icon:'💳', label:'Credit / Debit Card' },
]

export default function Checkout() {
  const { items, clearCart }  = useCartStore()
  const { isAuthenticated }   = useAuthStore()
  const [placed,   setPlaced] = useState(false)
  const [loading,  setLoading]= useState(false)
  const [form, setForm]       = useState({ name:'',email:'',phone:'',address:'',city:'',pincode:'',payment:'cod' })
  const total      = items.reduce((s,i)=>s+i.price*i.qty,0)
  const delivery   = total > 999 ? 0 : 99
  const grandTotal = total + delivery
  const update     = (k,v) => setForm(f=>({...f,[k]:v}))

  const handleOrder = async (e) => {
    e.preventDefault(); setLoading(true)
    await new Promise(r=>setTimeout(r,1200))
    clearCart(); setPlaced(true); setLoading(false)
  }

  if (!isAuthenticated) return (
    <div className="container empty-state" style={{ minHeight:'75vh' }}>
      <span style={{ fontSize:56 }}>🔒</span><h2>Login required</h2>
      <p>Please sign in to complete your purchase.</p>
      <Link to="/login" className="btn btn-primary btn-lg">Sign In</Link>
    </div>
  )
  if (items.length === 0 && !placed) return (
    <div className="container empty-state" style={{ minHeight:'75vh' }}>
      <span style={{ fontSize:56 }}>🛒</span><h2>Cart is empty</h2>
      <Link to="/" className="btn btn-primary btn-lg">Shop Now</Link>
    </div>
  )
  if (placed) return (
    <div className="container empty-state" style={{ minHeight:'80vh' }}>
      <motion.span initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', bounce:0.5 }} style={{ fontSize:72 }}>🎉</motion.span>
      <motion.h2 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800 }}>Order Placed!</motion.h2>
      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.45 }} style={{ color:'rgba(200,180,255,0.7)', maxWidth:360, lineHeight:1.7 }}>Thank you for shopping with ShopEasy!</motion.p>
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }} style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
        <Link to="/" className="btn btn-primary btn-lg">Continue Shopping</Link>
        <Link to="/orders" className="btn btn-outline btn-lg">View Orders</Link>
      </motion.div>
    </div>
  )

  return (
    <div className="container" style={{ padding:'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 64px' }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <h1 className="page-title">Checkout</h1>
        <p className="page-sub">Complete your order</p>
      </motion.div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr clamp(280px,30vw,360px)', gap:24, alignItems:'start' }} className="checkout-grid">
        <motion.form initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }} onSubmit={handleOrder} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'rgba(8,2,35,0.85)', backdropFilter:'blur(16px)', border:'1px solid rgba(245,200,66,0.15)', borderRadius:18, padding:24 }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:'var(--gold)', marginBottom:20 }}>📦 Delivery Details</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(200px,100%),1fr))', gap:0 }}>
              {FIELDS.map(f=>(
                <div key={f.key} className="form-group">
                  <label>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e=>update(f.key,e.target.value)} required
                    style={{ background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(245,200,66,0.16)', borderRadius:10, padding:'12px 14px', fontSize:14, color:'#fff', outline:'none', width:'100%' }} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:'rgba(8,2,35,0.85)', backdropFilter:'blur(16px)', border:'1px solid rgba(245,200,66,0.15)', borderRadius:18, padding:24 }}>
            <h2 style={{ fontSize:16, fontWeight:700, color:'var(--gold)', marginBottom:18 }}>💳 Payment Method</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {PAYMENTS.map(p=>(
                <label key={p.value} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', background:form.payment===p.value?'rgba(245,200,66,0.1)':'rgba(255,255,255,0.04)', border:`1.5px solid ${form.payment===p.value?'rgba(245,200,66,0.45)':'rgba(255,255,255,0.08)'}`, borderRadius:12, cursor:'pointer', fontSize:14, fontWeight:500, color:form.payment===p.value?'var(--gold)':'rgba(220,200,255,0.8)' }}>
                  <input type="radio" name="payment" value={p.value} checked={form.payment===p.value} onChange={()=>update('payment',p.value)} style={{ accentColor:'var(--gold)', width:16, height:16 }} />
                  <span style={{ fontSize:18 }}>{p.icon}</span> {p.label}
                </label>
              ))}
            </div>
          </div>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} type="submit" disabled={loading}
            style={{ padding:'16px', borderRadius:14, border:'none', background:loading?'rgba(245,200,66,0.4)':'linear-gradient(135deg,var(--gold),var(--gold-d))', color:'#0a0020', fontSize:16, fontWeight:800, cursor:loading?'not-allowed':'pointer', boxShadow:'0 8px 30px rgba(245,200,66,0.35)', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}
          >{loading?'⏳ Placing Order...':`Place Order · ₹${grandTotal.toLocaleString('en-IN')}`}</motion.button>
        </motion.form>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          style={{ background:'rgba(8,2,35,0.88)', backdropFilter:'blur(16px)', border:'1px solid rgba(245,200,66,0.18)', borderRadius:18, padding:24, position:'sticky', top:84 }}
        >
          <h2 style={{ fontSize:17, fontWeight:700, marginBottom:18, color:'#fff' }}>Order Summary</h2>
          <div style={{ maxHeight:260, overflowY:'auto', marginBottom:16 }}>
            {items.map(i=>(
              <div key={i.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(245,200,66,0.08)' }}>
                <img src={i.image} alt={i.title} style={{ width:48, height:48, objectFit:'cover', borderRadius:8, flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:12.5, fontWeight:600, color:'rgba(220,200,255,0.9)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{i.title}</p>
                  <p style={{ fontSize:11.5, color:'rgba(200,180,255,0.5)' }}>Qty: {i.qty}</p>
                </div>
                <p style={{ fontSize:13.5, fontWeight:700, color:'var(--gold)', flexShrink:0 }}>₹{(i.price*i.qty).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
            {[['Subtotal',`₹${total.toLocaleString('en-IN')}`],['Delivery',delivery===0?'FREE':`₹${delivery}`]].map(([l,v])=>(
              <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:'rgba(200,180,255,0.65)' }}>
                <span>{l}</span><span style={{ fontWeight:600, color:v==='FREE'?'#4ade80':'inherit' }}>{v}</span>
              </div>
            ))}
            <div style={{ height:1, background:'rgba(245,200,66,0.14)', margin:'6px 0' }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:18, fontWeight:800, color:'#fff' }}>
              <span>Total</span><span style={{ color:'var(--gold)' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>
      </div>
      <style>{`@media(max-width:768px){.checkout-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
