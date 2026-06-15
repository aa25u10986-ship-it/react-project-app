const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRE } = require('../config/config')
const users  = require('../data/users')
const User   = require('../models/userModel')

// Helper — generate JWT token
const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE })

// @route  POST /api/auth/register
// @desc   Register new user
// @access Public
const register = async (req, res) => {
  const { name, email, password } = req.body

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email and password' })
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
  }

  // Check if email already exists
  const existing = users.find(u => u.email === email.toLowerCase())
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists' })
  }

  // Hash password — never store plain text
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user object
  const newUser = new User({
    id:       Date.now().toString(),
    name:     name.trim(),
    email:    email.toLowerCase().trim(),
    password: hashedPassword,
  })

  users.push(newUser)

  // Return token + user info (no password)
  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token:   generateToken(newUser.id),
    user: {
      id:    newUser.id,
      name:  newUser.name,
      email: newUser.email,
    },
  })
}

// @route  POST /api/auth/login
// @desc   Login existing user
// @access Public
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' })
  }

  // Find user by email
  const user = users.find(u => u.email === email.toLowerCase().trim())
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' })
  }

  // Compare password with hash
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' })
  }

  res.json({
    success: true,
    message: 'Login successful',
    token:   generateToken(user.id),
    user: {
      id:    user.id,
      name:  user.name,
      email: user.email,
    },
  })
}

// @route  GET /api/auth/me
// @desc   Get logged-in user profile
// @access Private (requires token)
const getMe = (req, res) => {
  // req.user is set by authMiddleware
  res.json({
    success: true,
    user: req.user,
  })
}

module.exports = { register, login, getMe }
