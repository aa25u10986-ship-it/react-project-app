import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginUser, registerUser } from '../api/authApi'

export const useAuthStore = create(
  persist(
    (set) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,
      loading:         false,
      error:           null,

      // ── Login ────────────────────────────────────────────────────────
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const data = await loginUser(email, password)
          // Save token to localStorage so axios interceptor picks it up
          localStorage.setItem('token', data.token)
          set({
            user:            data.user,
            token:           data.token,
            isAuthenticated: true,
            loading:         false,
          })
          return { success: true }
        } catch (err) {
          const msg = err.response?.data?.message || 'Login failed'
          set({ loading: false, error: msg })
          return { success: false, error: msg }
        }
      },

      // ── Signup ───────────────────────────────────────────────────────
      signup: async (name, email, password) => {
        set({ loading: true, error: null })
        try {
          const data = await registerUser(name, email, password)
          localStorage.setItem('token', data.token)
          set({
            user:            data.user,
            token:           data.token,
            isAuthenticated: true,
            loading:         false,
          })
          return { success: true }
        } catch (err) {
          const msg = err.response?.data?.message || 'Registration failed'
          set({ loading: false, error: msg })
          return { success: false, error: msg }
        }
      },

      // ── Logout ───────────────────────────────────────────────────────
      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      // Only persist user + token, not loading/error
      partialize: (state) => ({
        user:            state.user,
        token:           state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
