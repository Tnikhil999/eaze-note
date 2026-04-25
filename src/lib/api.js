import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://your-render-url.onrender.com',
  timeout: 60000,
})

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.detail || err.response?.data?.message || err.message || 'Something went wrong'
    return Promise.reject(new Error(msg))
  }
)

export const uploadDocument = (file) => {
  const fd = new FormData()
  fd.append('file', file)
  return api.post('/upload', fd)
}

export const askQuestion = (query, sessionId) =>
  api.get('/ask', { params: { query, session_id: sessionId } })

export const getSummary = (sessionId) =>
  api.get('/summary', { params: { session_id: sessionId } })

export const getQuiz = (sessionId) =>
  api.get('/quiz', { params: { session_id: sessionId } })

export const checkHealth = () => api.get('/health')

export default api
