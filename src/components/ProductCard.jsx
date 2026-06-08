import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const addToCart = useCartStore(s => s.addToCart)

  const handleAdd = (e) => {
    e.preventDefault()
    addToCart(product)
  }

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating))

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-img-wrap">
        <img src={product.image} alt={product.title} loading="lazy"/>
        <span className="product-category badge badge-primary">{product.category}</span>
      </div>
      <div className="product-body">
        <h3 className="product-title">{product.title}</h3>
        <div className="product-rating">
          <span className="stars">{stars}</span>
          <span className="review-count">({product.reviews})</span>
        </div>
        <div className="product-footer">
          <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>
            + Add
          </button>
        </div>
      </div>
    </Link>
  )
}
