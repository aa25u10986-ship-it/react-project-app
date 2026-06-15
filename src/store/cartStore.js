import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Cart store — local state (syncs with backend on checkout)
// Items are stored locally for fast UI, sent to backend when order is placed
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        const existing = get().items.find(i => i.id === product.id)
        if (existing) {
          set({
            items: get().items.map(i =>
              i.id === product.id ? { ...i, qty: i.qty + 1 } : i
            ),
          })
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

      // Computed helpers
      totalItems: () => get().items.reduce((s, i) => s + i.qty, 0),
      totalPrice: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    { name: 'cart-storage' }
  )
)
