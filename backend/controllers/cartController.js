const products = require('../data/products')

// In-memory cart store per user: { userId: [{ productId, qty }] }
const carts = {}

// @route  GET /api/cart
// @desc   Get cart for logged-in user
// @access Private
const getCart = (req, res) => {
  const userId    = req.user.id
  const cartItems = carts[userId] || []

  // Enrich cart items with full product data
  const enriched = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId)
    if (!product) return null
    return { ...product, qty: item.qty }
  }).filter(Boolean)

  const total    = enriched.reduce((s, i) => s + i.price * i.qty, 0)
  const delivery = total > 999 ? 0 : 99

  res.json({
    success: true,
    data: {
      items:    enriched,
      total,
      delivery,
      grandTotal: total + delivery,
    },
  })
}

// @route  POST /api/cart
// @desc   Add item to cart (or increment qty if exists)
// @access Private
const addToCart = (req, res) => {
  const userId    = req.user.id
  const { productId, qty = 1 } = req.body

  if (!productId) {
    return res.status(400).json({ success: false, message: 'productId is required' })
  }

  const product = products.find(p => p.id === Number(productId))
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }

  if (!carts[userId]) carts[userId] = []

  const existing = carts[userId].find(i => i.productId === Number(productId))
  if (existing) {
    existing.qty += qty
  } else {
    carts[userId].push({ productId: Number(productId), qty })
  }

  res.json({ success: true, message: 'Item added to cart' })
}

// @route  PUT /api/cart/:productId
// @desc   Update quantity of a cart item
// @access Private
const updateCartItem = (req, res) => {
  const userId    = req.user.id
  const productId = Number(req.params.productId)
  const { qty }   = req.body

  if (!carts[userId]) {
    return res.status(404).json({ success: false, message: 'Cart is empty' })
  }

  if (qty <= 0) {
    // Remove item if qty is 0 or less
    carts[userId] = carts[userId].filter(i => i.productId !== productId)
  } else {
    const item = carts[userId].find(i => i.productId === productId)
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' })
    }
    item.qty = qty
  }

  res.json({ success: true, message: 'Cart updated' })
}

// @route  DELETE /api/cart/:productId
// @desc   Remove single item from cart
// @access Private
const removeFromCart = (req, res) => {
  const userId    = req.user.id
  const productId = Number(req.params.productId)

  if (!carts[userId]) {
    return res.status(404).json({ success: false, message: 'Cart is empty' })
  }

  carts[userId] = carts[userId].filter(i => i.productId !== productId)
  res.json({ success: true, message: 'Item removed from cart' })
}

// @route  DELETE /api/cart
// @desc   Clear entire cart
// @access Private
const clearCart = (req, res) => {
  carts[req.user.id] = []
  res.json({ success: true, message: 'Cart cleared' })
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart }
