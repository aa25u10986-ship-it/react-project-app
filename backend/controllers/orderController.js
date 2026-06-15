const orders = require('../data/orders')
const Order  = require('../models/orderModel')

// @route  POST /api/orders
// @desc   Place a new order
// @access Private
const placeOrder = (req, res) => {
  const { items, address, payment } = req.body

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'No items in order' })
  }
  if (!address || !address.name || !address.email || !address.phone || !address.address || !address.city || !address.pincode) {
    return res.status(400).json({ success: false, message: 'Please provide complete delivery address' })
  }
  if (!payment) {
    return res.status(400).json({ success: false, message: 'Please select a payment method' })
  }

  const newOrder = new Order({
    userId:  req.user.id,
    items,
    address,
    payment,
  })

  orders.push(newOrder)

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data:    newOrder,
  })
}

// @route  GET /api/orders
// @desc   Get all orders for the logged-in user
// @access Private
const getMyOrders = (req, res) => {
  const myOrders = orders
    .filter(o => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first

  res.json({
    success: true,
    count:   myOrders.length,
    data:    myOrders,
  })
}

// @route  GET /api/orders/:id
// @desc   Get a single order by ID (only owner can access)
// @access Private
const getOrderById = (req, res) => {
  const order = orders.find(o => o.id === req.params.id)

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' })
  }

  // Make sure the order belongs to the requesting user
  if (order.userId !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Not authorized to view this order' })
  }

  res.json({ success: true, data: order })
}

module.exports = { placeOrder, getMyOrders, getOrderById }
