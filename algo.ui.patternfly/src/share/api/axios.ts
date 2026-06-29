import axios from 'axios'
import {
  ApiHttpError,
  getApiErrorMessage,
  getStatusFallbackMessage,
} from './types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_CANCELED' || axios.isCancel(error)) {
        return Promise.reject(error)
      }

      const status = error.response?.status
      const data = error.response?.data
      const message =
        getApiErrorMessage(data) ??
        error.message ??
        getStatusFallbackMessage(status)

      return Promise.reject(new ApiHttpError(message, status, data))
    }

    if (error instanceof Error) {
      return Promise.reject(new ApiHttpError(error.message))
    }

    return Promise.reject(new ApiHttpError('Unknown request error.'))
  },
)

export default apiClient
