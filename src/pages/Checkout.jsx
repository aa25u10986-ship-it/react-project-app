import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import './Checkout.css'

export default function Checkout() {
  const { items, clearCart } = useCartStore()
  const { isAuthenticated }  = useAuthStore()
  const navigate             = useNavigate()
  const [placed, setPlaced]  = useState(false)
  const [form, setForm]      = useState({ name:'', email:'', phone:'', address:'', city:'', pincode:'', payment:'cod' })

  const total      = items.reduce((s,i) => s + i.price * i.qty, 0)
  const delivery   = total > 999 ? 0 : 99
  const grandTotal = total + delivery

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleOrder = (e) => {
    e.preventDefault()
    setPlaced(true)
    clearCart()
  }

  if (!isAuthenticated) return (
    <div className="container empty-state" style={{minHeight:'60vh'}}>
      <span className="icon">🔒</span>
      <p>Please login to checkout</p>
      <Link to="/login" className="btn btn-primary">Login</Link>
    </div>
  )

  if (items.length === 0 && !placed) return (
    <div className="container empty-state" style={{minHeight:'60vh'}}>
      <span className="icon">🛒</span>
      <p>Your cart is empty</p>
      <Link to="/" className="btn btn-primary">Shop Now</Link>
    </div>
  )

  if (placed) return (
    <div className="container empty-state" style={{minHeight:'70vh'}}>
      <span style={{fontSize:64}}>🎉</span>
      <h2 style={{fontSize:24,fontWeight:800}}>Order Placed!</h2>
      <p>Thank you for shopping with ShopEasy. You'll receive a confirmation shortly.</p>
      <div style={{display:'flex',gap:12,marginTop:8}}>
        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        <Link to="/orders" className="btn btn-outline">View Orders</Link>
      </div>
    </div>
  )

  return (
    <div className="container checkout-page">
      <h1 className="page-title">Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleOrder}>
          <div className="co-section">
            <h2>Delivery Details</h2>
            {[
              { label:'Full Name',    key:'name',    type:'text',  placeholder:'John Doe' },
              { label:'Email',        key:'email',   type:'email', placeholder:'you@example.com' },
              { label:'Phone',        key:'phone',   type:'tel',   placeholder:'+91 98765 43210' },
              { label:'Address',      key:'address', type:'text',  placeholder:'Street address' },
              { label:'City',         key:'city',    type:'text',  placeholder:'Mumbai' },
              { label:'Pincode',      key:'pincode', type:'text',  placeholder:'400001' },
            ].map(f => (
              <div className="form-group" key={f.key}>
                <label>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => update(f.key, e.target.value)} required/>
              </div>
            ))}
          </div>

          <div className="co-section">
            <h2>Payment Method</h2>
            {[
              { value:'cod',  label:'💵 Cash on Delivery' },
              { value:'upi',  label:'📱 UPI / GPay / PhonePe' },
              { value:'card', label:'💳 Credit / Debit Card' },
            ].map(p => (
              <label key={p.value} className="payment-option">
                <input type="radio" name="payment" value={p.value} checked={form.payment === p.value} onChange={() => update('payment', p.value)}/>
                {p.label}
              </label>
            ))}
          </div>

          <button className="btn btn-primary btn-full" type="submit" style={{padding:'14px'}}>
            Place Order • ₹{grandTotal.toLocaleString('en-IN')}
          </button>
        </form>

        {/* Summary */}
        <div className="co-summary">
          <h2>Order Summary</h2>
          {items.map(i => (
            <div key={i.id} className="co-item">
              <img src={i.image} alt={i.title}/>
              <div>
                <p className="co-item-name">{i.title}</p>
                <p className="co-item-qty">Qty: {i.qty}</p>
              </div>
              <p className="co-item-price">₹{(i.price*i.qty).toLocaleString('en-IN')}</p>
            </div>
          ))}
          <div className="co-totals">
            <div className="co-total-row"><span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span></div>
            <div className="co-total-row"><span>Delivery</span><span style={{color:'#16a34a'}}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span></div>
            <div className="co-total-row grand"><span>Total</span><span>₹{grandTotal.toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
