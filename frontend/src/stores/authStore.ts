import { create } from 'zustand'
import api from '@/lib/api'
import type { User } from '@/types'

const TOKEN_KEY = 'auth_token'

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    localStorage.removeItem(TOKEN_KEY)
    delete api.defaults.headers.common['Authorization']
  }
}

export function initAuthToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

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
    const { data } = await api.post('/auth/login', { email, password })
    setAuthToken(data.data.token)
    set({ user: data.data.user, isAuthenticated: true })
  },

  register: async (formData) => {
    await api.post('/auth/register', formData)
  },

  logout: async () => {
    try { await api.post('/auth/logout') } catch {}
    setAuthToken(null)
    set({ user: null, isAuthenticated: false })
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get('/user')
      set({ user: data.data, isAuthenticated: true, isLoading: false })
    } catch {
      setAuthToken(null)
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}))

