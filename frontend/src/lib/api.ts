import axios from 'axios'

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
    return Promise.reject(error)
  }
)

export const csrf = () => axios.get('/sanctum/csrf-cookie', { withCredentials: true })

export default api
