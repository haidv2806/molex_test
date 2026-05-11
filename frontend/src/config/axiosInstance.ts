import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { showToast } from './ToastConfig'
import type { PaginationMetadata } from '../types/pagination'

// ─── Kiểu API response ────────────────────────────────────────────────────────
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  pagination?: PaginationMetadata
  details?: string | string[]
}

// ─── Axios instance ───────────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  timeout: 30 * 1000,
  withCredentials: true,
  headers: { 'X-Custom-Header': 'foobar' },
})

// ─── Response interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    if (response.data?.success === false) {
      showToast('error', response.data.message || 'Đã xảy ra lỗi.')
      return Promise.reject(new Error(response.data.message || 'API trả về lỗi'))
    }
    return response
  },

  async (error: AxiosError<ApiResponse>) => {
    const status = error.response?.status

    // ── Các lỗi HTTP khác ─────────────────────────────────────────────────
    const detailMessage = Array.isArray(error.response?.data?.details)
      ? error.response!.data!.details!.join(', ')
      : (error.response?.data?.details as string | undefined)

    switch (status) {
      case 400:
        showToast('warning', error.response?.data?.message || 'Yêu cầu không hợp lệ.', detailMessage)
        break
      case 404:
        showToast('warning', error.response?.data?.message || 'Không tìm thấy tài nguyên.', detailMessage)
        break
      case 500:
        showToast('error', 'Lỗi server. Vui lòng thử lại sau.', detailMessage)
        break
      default:
        if (!status || status < 200 || status >= 300) {
          showToast('error', error.response?.data?.message || error.message, detailMessage)
        }
        break
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
