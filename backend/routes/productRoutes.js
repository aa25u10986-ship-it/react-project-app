const express = require('express')
const router  = express.Router()
const { getAllProducts, getCategories, getProductById } = require('../controllers/productController')

// GET /api/products            — all products (with optional query filters)
router.get('/', getAllProducts)

// GET /api/products/categories — list of unique categories
router.get('/categories', getCategories)

// GET /api/products/:id        — single product by ID
router.get('/:id', getProductById)

module.exports = router
