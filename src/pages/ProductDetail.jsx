import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { products } from '../data/products'
import { useCartStore } from '../store/cartStore'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id }      = useParams()
  const product     = products.find(p => p.id === Number(id))
  const addToCart   = useCartStore(s => s.addToCart)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) return (
    <div className="container empty-state" style={{minHeight:'60vh'}}>
      <span className="icon">😕</span>
      <p>Product not found</p>
      <Link to="/" className="btn btn-primary">Back to Shop</Link>
    </div>
  )

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating))
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0,4)

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="container" style={{ padding: '28px 20px 48px' }}>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <span>{product.category}</span> / <span>{product.title}</span>
      </div>

      {/* Main */}
      <div className="pd-main">
        <div className="pd-image">
          <img src={product.image} alt={product.title}/>
        </div>
        <div className="pd-info">
          <span className="badge badge-primary">{product.category}</span>
          <h1 className="pd-title">{product.title}</h1>
          <div className="pd-rating">
            <span className="stars">{stars}</span>
            <span>{product.rating} ({product.reviews} reviews)</span>
          </div>
          <p className="pd-price">₹{product.price.toLocaleString('en-IN')}</p>
          <p className="pd-desc">{product.description}</p>

          {/* Qty */}
          <div className="pd-qty">
            <label>Quantity</label>
            <div className="qty-control">
              <button onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => q+1)}>+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="pd-actions">
            <button className="btn btn-primary" onClick={handleAdd} style={{flex:1}}>
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
            <Link to="/cart" className="btn btn-outline" style={{flex:1, textAlign:'center'}}>
              Go to Cart
            </Link>
          </div>

          {/* Trust badges */}
          <div className="trust-badges">
            {['Free Delivery','Easy Returns','Secure Payment'].map(b => (
              <span key={b} className="trust-badge">✓ {b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="pd-related">
          <h2>Related Products</h2>
          <div className="related-grid">
            {related.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="related-card">
                <img src={p.image} alt={p.title}/>
                <p className="related-title">{p.title}</p>
                <p className="related-price">₹{p.price.toLocaleString('en-IN')}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
