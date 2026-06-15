import API from './axios'

// Register new user
export const registerUser = async (name, email, password) => {
  const { data } = await API.post('/auth/register', { name, email, password })
  return data  // { success, token, user }
}

// Login
export const loginUser = async (email, password) => {
  const { data } = await API.post('/auth/login', { email, password })
  return data  // { success, token, user }
}

// Get logged-in user profile
export const getMe = async () => {
  const { data } = await API.get('/auth/me')
  return data  // { success, user }
}
