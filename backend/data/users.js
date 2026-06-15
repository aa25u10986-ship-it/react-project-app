// In-memory users store (replace with MongoDB/PostgreSQL in production)
// Each user: { id, name, email, password (hashed), createdAt }
const users = []

module.exports = users
