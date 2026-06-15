import API from './axios'

// Get current user's cart
export const getCart = async () => {
  const { data } = await API.get('/cart')
  return data  // { success, data: { items, total, delivery, grandTotal } }
}

// Add item to cart
export const addToCart = async (productId, qty = 1) => {
  const { data } = await API.post('/cart', { productId, qty })
  return data
}

// Update quantity
export const updateCartItem = async (productId, qty) => {
  const { data } = await API.put(`/cart/${productId}`, { qty })
  return data
}

// Remove single item
export const removeFromCart = async (productId) => {
  const { data } = await API.delete(`/cart/${productId}`)
  return data
}

// Clear entire cart
export const clearCart = async () => {
  const { data } = await API.delete('/cart')
  return data
}
