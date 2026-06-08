import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        const existing = get().items.find(i => i.id === product.id)
        if (existing) {
          set({ items: get().items.map(i =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          )})
        } else {
          set({ items: [...get().items, { ...product, qty: 1 }] })
        }
      },

      removeFromCart: (id) => {
        set({ items: get().items.filter(i => i.id !== id) })
      },

      updateQty: (id, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter(i => i.id !== id) })
        } else {
          set({ items: get().items.map(i => i.id === id ? { ...i, qty } : i) })
        }
      },

      clearCart: () => set({ items: [] }),

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.qty, 0)
      },

      get totalPrice() {
        return get().items.reduce((sum, i) => sum + i.price * i.qty, 0)
      },
    }),
    { name: 'cart-storage' }
  )
)
