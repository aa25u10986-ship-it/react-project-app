const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRE } = require('../config/config')
const { getUsers, saveUsers }    = require('../data/db')

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE })

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ success:false, message:'Name, email and password are required' })
    if (password.length < 6)
      return res.status(400).json({ success:false, message:'Password must be at least 6 characters' })

    const users    = getUsers()
    const existing = users.find(u => u.email === email.toLowerCase().trim())
    if (existing)
      return res.status(400).json({ success:false, message:'Account already exists with this email' })

    const hashed = await bcrypt.hash(password, 10)
    const user   = {
      id:        Date.now().toString(),
      name:      name.trim(),
      email:     email.toLowerCase().trim(),
      password:  hashed,
      createdAt: new Date().toISOString(),
    }
    users.push(user)
    saveUsers(users)

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token:   generateToken(user.id),
      user:    { id:user.id, name:user.name, email:user.email },
    })
  } catch (err) {
    res.status(500).json({ success:false, message:'Server error during registration' })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success:false, message:'Email and password are required' })

    const users = getUsers()
    const user  = users.find(u => u.email === email.toLowerCase().trim())
    if (!user)
      return res.status(401).json({ success:false, message:'No account found with this email. Please sign up first.' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(401).json({ success:false, message:'Incorrect password' })

    res.json({
      success: true,
      message: 'Login successful',
      token:   generateToken(user.id),
      user:    { id:user.id, name:user.name, email:user.email },
    })
  } catch (err) {
    res.status(500).json({ success:false, message:'Server error during login' })
  }
}

// GET /api/auth/me
const getMe = (req, res) => {
  res.json({ success:true, user:req.user })
}

module.exports = { register, login, getMe }
