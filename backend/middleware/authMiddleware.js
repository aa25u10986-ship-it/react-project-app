const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config')
const users = require('../data/users')

// Protect routes — verifies JWT token from Authorization header
const protect = (req, res, next) => {
  let token

  // Token comes as: Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized — no token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    // Attach user to request (without password)
    const user = users.find(u => u.id === decoded.id)
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' })
    }
    req.user = { id: user.id, name: user.name, email: user.email }
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized — invalid or expired token' })
  }
}

module.exports = { protect }
