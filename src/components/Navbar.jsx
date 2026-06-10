import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import './Navbar.css'

export default function Navbar({ onSearch }) {
  const [query, setQuery]   = useState('')
  const [menuOpen, setMenu] = useState(false)
  const items               = useCartStore(s => s.items)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate            = useNavigate()

  const totalItems = items.reduce((s, i) => s + i.qty, 0)

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch) onSearch(query)
    navigate(`/?search=${encodeURIComponent(query)}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenu(false)
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          🛒 <span>ShopEasy</span>
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            🛒
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setMenu(v => !v)}>
                👤 {user?.name}
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <Link to="/orders" onClick={() => setMenu(false)}>📦 Orders</Link>
                  <button onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenu(v => !v)}>☰</button>
      </div>
    </header>
  )
}
