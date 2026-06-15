import { Routes, Route } from 'react-router-dom'
import Navbar        from './components/Navbar'
import Home          from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart          from './pages/Cart'
import Login         from './pages/Login'
import Signup        from './pages/Signup'
import Checkout      from './pages/Checkout'

export default function App() {
  return (
    <div style={{ position:'relative', zIndex:1, minHeight:'100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart"        element={<Cart />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/signup"      element={<Signup />} />
        <Route path="/checkout"    element={<Checkout />} />
        <Route path="*"            element={
          <div className="container empty-state" style={{ minHeight:'70vh' }}>
            <span style={{ fontSize:64 }}>🌀</span>
            <h2>404 — Page not found</h2>
            <a href="/" className="btn btn-primary">Go Home</a>
          </div>
        } />
      </Routes>
    </div>
  )
}
