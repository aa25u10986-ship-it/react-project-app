import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        // Mock auth — replace with real API
        if (email && password.length >= 6) {
          set({
            user: { id: 1, name: email.split('@')[0], email },
            isAuthenticated: true,
          })
          return { success: true }
        }
        return { success: false, error: 'Invalid credentials' }
      },

      signup: (name, email, password) => {
        if (name && email && password.length >= 6) {
          set({
            user: { id: Date.now(), name, email },
            isAuthenticated: true,
          })
          return { success: true }
        }
        return { success: false, error: 'Please fill all fields (password min 6 chars)' }
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
)
