const fs   = require('fs')
const path = require('path')

const USERS_FILE  = path.join(__dirname, 'users.json')
const ORDERS_FILE = path.join(__dirname, 'orders.json')

// ── Ensure JSON files exist ──────────────────────────────────────────────
function ensureFile(file, defaultVal = '[]') {
  if (!fs.existsSync(file)) fs.writeFileSync(file, defaultVal, 'utf8')
}

ensureFile(USERS_FILE)
ensureFile(ORDERS_FILE)

// ── Users ────────────────────────────────────────────────────────────────
function getUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
}

// ── Orders ───────────────────────────────────────────────────────────────
function getOrders() {
  return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'))
}

function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8')
}

module.exports = { getUsers, saveUsers, getOrders, saveOrders }
