const express = require('express')
const router  = express.Router()
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController')
const { protect } = require('../middleware/authMiddleware')

// All cart routes require auth
router.use(protect)

// GET    /api/cart              — get user's cart
router.get('/', getCart)

// POST   /api/cart              — add item to cart
router.post('/', addToCart)

// PUT    /api/cart/:productId   — update qty of a cart item
router.put('/:productId', updateCartItem)

// DELETE /api/cart/:productId   — remove single item
router.delete('/:productId', removeFromCart)

// DELETE /api/cart              — clear entire cart
router.delete('/', clearCart)

module.exports = router
