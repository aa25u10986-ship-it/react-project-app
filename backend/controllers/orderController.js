const { getOrders, saveOrders } = require('../data/db')
const Order = require('../models/orderModel')

// POST /api/orders
const placeOrder = (req, res) => {
  try {
    const { items, address, payment } = req.body
    if (!items || items.length === 0)
      return res.status(400).json({ success:false, message:'No items in order' })
    if (!address?.name || !address?.email || !address?.phone || !address?.address || !address?.city || !address?.pincode)
      return res.status(400).json({ success:false, message:'Please provide complete delivery address' })
    if (!payment)
      return res.status(400).json({ success:false, message:'Please select a payment method' })

    const orders   = getOrders()
    const newOrder = new Order({ userId:req.user.id, items, address, payment })
    orders.push(newOrder)
    saveOrders(orders)

    res.status(201).json({ success:true, message:'Order placed successfully', data:newOrder })
  } catch (err) {
    res.status(500).json({ success:false, message:'Server error placing order' })
  }
}

// GET /api/orders
const getMyOrders = (req, res) => {
  const orders   = getOrders()
  const myOrders = orders
    .filter(o => o.userId === req.user.id)
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json({ success:true, count:myOrders.length, data:myOrders })
}

// GET /api/orders/:id
const getOrderById = (req, res) => {
  const orders = getOrders()
  const order  = orders.find(o => o.id === req.params.id)
  if (!order) return res.status(404).json({ success:false, message:'Order not found' })
  if (order.userId !== req.user.id) return res.status(403).json({ success:false, message:'Not authorized' })
  res.json({ success:true, data:order })
}

module.exports = { placeOrder, getMyOrders, getOrderById }
