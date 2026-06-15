const products = require('../data/products')

// @route  GET /api/products
// @desc   Get all products with optional filters
// @access Public
// Query params: category, search, minPrice, maxPrice, sort
const getAllProducts = (req, res) => {
  let result = [...products]

  const { category, search, minPrice, maxPrice, sort } = req.query

  // Filter by category
  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase())
  }

  // Filter by search keyword
  if (search) {
    const q = search.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  }

  // Filter by price range
  if (minPrice) result = result.filter(p => p.price >= Number(minPrice))
  if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice))

  // Sort
  switch (sort) {
    case 'price_asc':  result.sort((a, b) => a.price   - b.price);   break
    case 'price_desc': result.sort((a, b) => b.price   - a.price);   break
    case 'rating':     result.sort((a, b) => b.rating  - a.rating);  break
    case 'reviews':    result.sort((a, b) => b.reviews - a.reviews); break
  }

  res.json({
    success: true,
    count:   result.length,
    data:    result,
  })
}

// @route  GET /api/products/categories
// @desc   Get all unique categories
// @access Public
const getCategories = (req, res) => {
  const categories = ['All', ...new Set(products.map(p => p.category))]
  res.json({ success: true, data: categories })
}

// @route  GET /api/products/:id
// @desc   Get single product by ID
// @access Public
const getProductById = (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id))

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' })
  }

  // Get related products — same category, different id, max 4
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  res.json({
    success: true,
    data: product,
    related,
  })
}

module.exports = { getAllProducts, getCategories, getProductById }
