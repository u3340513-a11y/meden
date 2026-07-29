import { create } from 'zustand'
import api, { csrf } from '@/lib/api'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string; password_confirmation: string; referral_code: string }) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    await csrf()
    await api.post('/auth/login', { email, password })
    const { data } = await api.get('/user')
    set({ user: data.data, isAuthenticated: true })
  },

  register: async (formData) => {
    await csrf()
    await api.post('/auth/register', formData)
  },

  logout: async () => {
    await api.post('/auth/logout')
    set({ user: null, isAuthenticated: false })
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get('/user')
      set({ user: data.data, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}))
