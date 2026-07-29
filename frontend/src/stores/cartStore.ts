import { create } from 'zustand'
import api from '@/lib/api'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  total: number
  isLoading: boolean
  fetch: () => Promise<void>
  addItem: (productId: number, quantity?: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clear: () => Promise<void>
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,
  isLoading: false,

  fetch: async () => {
    set({ isLoading: true })
    try {
      const { data } = await api.get('/cart')
      set({ items: data.data.items, total: data.data.total, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  addItem: async (productId, quantity = 1) => {
    await api.post('/cart/items', { product_id: productId, quantity })
    const { data } = await api.get('/cart')
    set({ items: data.data.items, total: data.data.total })
  },

  updateQuantity: async (itemId, quantity) => {
    await api.patch(`/cart/items/${itemId}`, { quantity })
    const { data } = await api.get('/cart')
    set({ items: data.data.items, total: data.data.total })
  },

  removeItem: async (itemId) => {
    await api.delete(`/cart/items/${itemId}`)
    const { data } = await api.get('/cart')
    set({ items: data.data.items, total: data.data.total })
  },

  clear: async () => {
    await api.delete('/cart')
    set({ items: [], total: 0 })
  },
}))
