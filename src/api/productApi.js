import API from './axios'

// Get all products with optional filters
export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.category && filters.category !== 'All') params.set('category', filters.category)
  if (filters.search)   params.set('search',   filters.search)
  if (filters.minPrice) params.set('minPrice', filters.minPrice)
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
  if (filters.sort)     params.set('sort',     filters.sort)
  const { data } = await API.get(`/products?${params.toString()}`)
  return data  // { success, count, data: [...products] }
}

// Get all categories
export const getCategories = async () => {
  const { data } = await API.get('/products/categories')
  return data  // { success, data: ['All', 'Electronics', ...] }
}

// Get single product by ID
export const getProductById = async (id) => {
  const { data } = await API.get(`/products/${id}`)
  return data  // { success, data: product, related: [...] }
}
