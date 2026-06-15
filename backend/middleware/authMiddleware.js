const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config')
const { getUsers }   = require('../data/db')

const protect = (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1]

  if (!token)
    return res.status(401).json({ success:false, message:'Not authorized — no token' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const users   = getUsers()
    const user    = users.find(u => u.id === decoded.id)
    if (!user)
      return res.status(401).json({ success:false, message:'User no longer exists' })
    req.user = { id:user.id, name:user.name, email:user.email }
    next()
  } catch {
    return res.status(401).json({ success:false, message:'Invalid or expired token' })
  }
}

module.exports = { protect }
