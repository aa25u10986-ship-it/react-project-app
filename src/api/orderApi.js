import API from './axios'

// Place a new order
export const placeOrder = async ({ items, address, payment }) => {
  const { data } = await API.post('/orders', { items, address, payment })
  return data  // { success, message, data: order }
}

// Get all orders for logged-in user
export const getMyOrders = async () => {
  const { data } = await API.get('/orders')
  return data  // { success, count, data: [...orders] }
}

// Get single order by ID
export const getOrderById = async (id) => {
  const { data } = await API.get(`/orders/${id}`)
  return data  // { success, data: order }
}
