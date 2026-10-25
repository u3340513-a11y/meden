import axios from 'axios'
import toast from 'react-hot-toast'

export const AUTH_TOKEN_KEY = 'auth_token'

const HTTP_UNAUTHORIZED = 401
const LOGIN_PATH = '/giris'
const AUTH_ENDPOINTS_WITHOUT_SESSION_RESET = ['/auth/login', '/auth/register', '/user']
const SESSION_EXPIRED_MESSAGE = 'Oturumunuz sona erdi. Lütfen tekrar giriş yapın.'

let isHandlingSessionExpiry = false

/**
 * Why: a 401 on a protected call means the stored token was revoked or is invalid.
 * What: drops the token, informs the user once and redirects to the login page.
 * Input: failed axios request config. Output: none.
 */
function handleSessionExpiry(requestUrl: string | undefined): void {
  const hadToken = !!localStorage.getItem(AUTH_TOKEN_KEY)
  const isAuthEndpoint = AUTH_ENDPOINTS_WITHOUT_SESSION_RESET.some(path => requestUrl?.startsWith(path))
  if (!hadToken || isAuthEndpoint || isHandlingSessionExpiry) return

  isHandlingSessionExpiry = true
  localStorage.removeItem(AUTH_TOKEN_KEY)
  toast.error(SESSION_EXPIRED_MESSAGE)
  window.location.assign(LOGIN_PATH)
}

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 419) {
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true })
      return api.request(error.config)
    }
    if (error.response?.status === HTTP_UNAUTHORIZED) {
      handleSessionExpiry(error.config?.url)
    }
    return Promise.reject(error)
  }
)

export const csrf = () => axios.get('/sanctum/csrf-cookie', { withCredentials: true })

export default api
