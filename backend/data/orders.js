// In-memory orders store (replace with MongoDB/PostgreSQL in production)
// Each order: { id, userId, items, total, delivery, status, address, payment, createdAt }
const orders = []

module.exports = orders
