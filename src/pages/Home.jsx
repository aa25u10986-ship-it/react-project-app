import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products, categories } from '../data/products'
import ProductCard from '../components/ProductCard'
import './Home.css'

const SORT_OPTIONS = [
  { label: 'Default',        value: 'default' },
  { label: 'Price: Low-High',value: 'price_asc' },
  { label: 'Price: High-Low',value: 'price_desc' },
  { label: 'Top Rated',      value: 'rating' },
  { label: 'Most Reviews',   value: 'reviews' },
]

export default function Home() {
  const [searchParams] = useSearchParams()
  const searchQuery    = searchParams.get('search') || ''

  const [category, setCategory] = useState('All')
  const [sort, setSort]         = useState('default')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [search, setSearch]     = useState(searchQuery)
  const [gender, setGender]     = useState('All')

  const filtered = useMemo(() => {
    let list = [...products]

    if (search)                list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    if (category !== 'All')    list = list.filter(p => p.category === category)
    if (minPrice)              list = list.filter(p => p.price >= Number(minPrice))
    if (maxPrice)              list = list.filter(p => p.price <= Number(maxPrice))

    switch (sort) {
      case 'price_asc':  list.sort((a,b) => a.price   - b.price);   break
      case 'price_desc': list.sort((a,b) => b.price   - a.price);   break
      case 'rating':     list.sort((a,b) => b.rating  - a.rating);  break
      case 'reviews':    list.sort((a,b) => b.reviews - a.reviews); break
    }
    return list
  }, [search, category, sort, minPrice, maxPrice])

  return (
    <div className="home container">

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <div className="hero-eyebrow">Premium Collection 2026</div>
          <h1>Shop the <em>Best Deals</em><br />in Style</h1>
          <p>Electronics, Fashion, Home &amp; Sports — delivered to your door with elegance.</p>

          <div className="hero-divider">
            <div className="hero-divider-line" />
            <div className="hero-divider-diamond" />
          </div>

          <form className="hero-search" onSubmit={e => e.preventDefault()}>
            <input
              type="text" placeholder="Search for products..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        <div className="hero-badges">
          {[
            { icon: '✦', label: 'Free Delivery' },
            { icon: '✦', label: 'Easy Returns' },
            { icon: '✦', label: 'Secure Payment' },
            { icon: '✦', label: '24/7 Support' },
          ].map(b => (
            <span key={b.label} className="hero-badge">{b.icon} {b.label}</span>
          ))}
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">12+</span>
            <span className="hero-stat-label">Products</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">4.5★</span>
            <span className="hero-stat-label">Avg Rating</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">1K+</span>
            <span className="hero-stat-label">Happy Buyers</span>
          </div>
        </div>
      </section>

      {/* Category chips */}
      <div className="category-chips">
        {categories.map(c => (
          <button
            key={c}
            className={`chip${category === c ? ' active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="home-layout">

        {/* Sidebar filters */}
        <aside className="filters">
          <h3>Filters</h3>

          <div className="filter-group">
            <label>Price Range (₹)</label>
            <div className="price-inputs">
              <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}/>
              <span>—</span>
              <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}/>
            </div>
          </div>

          <div className="filter-group">
            <label>Category</label>
            {categories.map(c => (
              <label key={c} className="radio-label">
                <input type="radio" name="cat" checked={category === c} onChange={() => setCategory(c)}/>
                {c}
              </label>
            ))}
          </div>

          <button className="btn btn-outline btn-full btn-sm" onClick={() => { setCategory('All'); setMinPrice(''); setMaxPrice(''); setSearch(''); setSort('default') }}>
            Reset Filters
          </button>
        </aside>

        {/* Products */}
        <div className="products-section">
          <div className="products-toolbar">
            <p className="results-count">{filtered.length} products found</p>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="icon">🔍</span>
              <p>No products found. Try different filters.</p>
              <button className="btn btn-primary" onClick={() => { setCategory('All'); setSearch(''); }}>Clear filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p}/>)}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
