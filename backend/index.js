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

// ── CORS — allow all origins in production (Netlify)
app.use(cors({
  origin: true,   // allow any origin
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Health check ────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: 'ShopEasy API is running ✅', version: '1.0.0' })
})

// ── API Routes ──────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart',     cartRoutes)
app.use('/api/orders',   orderRoutes)

// ── Error Handling ──────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ── Start ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 ShopEasy Backend → http://localhost:${PORT}`)
  console.log(`📦 Products  → http://localhost:${PORT}/api/products`)
  console.log(`🔐 Auth      → http://localhost:${PORT}/api/auth`)
  console.log(`🛒 Cart      → http://localhost:${PORT}/api/cart`)
  console.log(`📋 Orders    → http://localhost:${PORT}/api/orders\n`)
})
