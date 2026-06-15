// Order Model — defines structure of an order object
class Order {
  constructor({ userId, items, address, payment }) {
    this.id        = Date.now().toString()
    this.userId    = userId
    this.items     = items    // [{ id, title, price, qty, image }]
    this.subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0)
    this.delivery  = this.subtotal > 999 ? 0 : 99
    this.total     = this.subtotal + this.delivery
    this.address   = address  // { name, email, phone, address, city, pincode }
    this.payment   = payment  // 'cod' | 'upi' | 'card'
    this.status    = 'placed' // placed → processing → shipped → delivered
    this.createdAt = new Date().toISOString()
  }
}

module.exports = Order
