const bcrypt = require('bcryptjs')

// Pre-seed a test user so login works immediately without registering
// Password: test123 (hashed)
const hashedPassword = bcrypt.hashSync('test123', 10)

const users = [
  {
    id:        '1',
    name:      'Aryan',
    email:     'aryan@test.com',
    password:  hashedPassword,
    createdAt: new Date().toISOString(),
  }
]

module.exports = users
