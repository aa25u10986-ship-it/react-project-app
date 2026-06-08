import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import './Cart.css'

export default function Cart() {
  const { items, removeFromCart, updateQty, clearCart } = useCartStore()
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const totalItems = items.reduce((s, i) => s + i.qty, 0)

  if (items.length === 0) return (
    <div className="container empty-state" style={{ minHeight: '70vh' }}>
      <span className="icon">🛒</span>
      <p>Your cart is empty</p>
      <Link to="/" className="btn btn-primary">Start Shopping</Link>
    </div>
  )

  return (
    <div className="container cart-page">
      <h1 className="page-title">Shopping Cart</h1>
      <p className="page-sub">{totalItems} item{totalItems > 1 ? 's' : ''} in your cart</p>

      <div className="cart-layout">

        {/* Items */}
        <div className="cart-items">
          <div className="cart-items-header">
            <span>Product</span>
            <span>Qty</span>
            <span>Price</span>
            <span></span>
          </div>

          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-product">
                <img src={item.image} alt={item.title}/>
                <div>
                  <Link to={`/product/${item.id}`} className="cart-item-name">{item.title}</Link>
                  <p className="cart-item-unit">₹{item.price.toLocaleString('en-IN')} each</p>
                </div>
              </div>

              <div className="qty-control">
                <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>

              <p className="cart-item-total">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>

              <button className="remove-btn" onClick={() => removeFromCart(item.id)} title="Remove">✕</button>
            </div>
          ))}

          <button className="btn btn-outline btn-sm" onClick={clearCart} style={{ marginTop: 12 }}>
            🗑 Clear Cart
          </button>
        </div>

        {/* Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-rows">
            {items.map(i => (
              <div key={i.id} className="summary-row">
                <span>{i.title} × {i.qty}</span>
                <span>₹{(i.price * i.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="summary-divider"/>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className="free-text">{total > 999 ? 'FREE' : '₹99'}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{(total + (total > 999 ? 0 : 99)).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {total > 999 && (
            <p className="free-delivery-msg">🎉 You get free delivery!</p>
          )}

          <Link to="/checkout" className="btn btn-primary btn-full" style={{ marginTop: 16 }}>
            Proceed to Checkout →
          </Link>
          <Link to="/" className="btn btn-outline btn-full" style={{ marginTop: 10 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
