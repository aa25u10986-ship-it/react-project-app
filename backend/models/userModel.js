// User Model — defines the structure of a user object
// In production replace with Mongoose schema (MongoDB) or Sequelize model (SQL)

class User {
  constructor({ id, name, email, password }) {
    this.id        = id
    this.name      = name
    this.email     = email
    this.password  = password   // always stored as bcrypt hash — never plain text
    this.createdAt = new Date().toISOString()
    this.orders    = []         // array of order IDs
  }
}

module.exports = User
