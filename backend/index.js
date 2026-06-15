const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const { PORT } = require('./config/config')
const authRoutes    = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes    = require('./routes/cartRoutes')
const orderRoutes   = require('./routes/orderRoutes')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')

const app = express()

// ── Middleware ──────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Health check ────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ShopEasy API is running',
    version: '1.0.0',
    endpoints: {
      auth:     '/api/auth',
      products: '/api/products',
      cart:     '/api/cart',
      orders:   '/api/orders',
    },
  })
})

// ── API Routes ──────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart',     cartRoutes)
app.use('/api/orders',   orderRoutes)

// ── Error Handling ──────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start Server ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 ShopEasy Backend running on http://localhost:${PORT}`)
  console.log(`📦 Products API  → http://localhost:${PORT}/api/products`)
  console.log(`🔐 Auth API      → http://localhost:${PORT}/api/auth`)
  console.log(`🛒 Cart API      → http://localhost:${PORT}/api/cart`)
  console.log(`📋 Orders API    → http://localhost:${PORT}/api/orders\n`)
})
