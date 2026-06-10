import { Routes, Route } from 'react-router-dom'
import Navbar        from './components/Navbar'
import DBZBackground from './components/DBZBackground'
import Home          from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart          from './pages/Cart'
import Login         from './pages/Login'
import Signup        from './pages/Signup'
import Checkout      from './pages/Checkout'

export default function App() {
  return (
    <>
      {/* Animated DBZ canvas — fixed behind everything */}
      <DBZBackground />

      {/* All page content sits above the canvas */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart"        element={<Cart />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/signup"      element={<Signup />} />
          <Route path="/checkout"    element={<Checkout />} />
          <Route path="*"            element={<div style={{textAlign:'center',padding:80}}><h2>404 — Page not found</h2></div>} />
        </Routes>
      </div>
    </>
  )
}
