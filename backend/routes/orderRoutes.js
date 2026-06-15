const express = require('express')
const router  = express.Router()
const { placeOrder, getMyOrders, getOrderById } = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')

// All order routes require auth
router.use(protect)

// POST /api/orders        — place new order
router.post('/', placeOrder)

// GET  /api/orders        — get all orders for logged-in user
router.get('/', getMyOrders)

// GET  /api/orders/:id    — get single order by ID
router.get('/:id', getOrderById)

module.exports = router
