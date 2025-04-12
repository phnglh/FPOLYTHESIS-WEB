import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(
      `[API] ${config.method?.toUpperCase()} → ${config.baseURL}${config.url}`,
    )
    return config
  },
  (error) => Promise.reject(error),
)

export default apiClient
