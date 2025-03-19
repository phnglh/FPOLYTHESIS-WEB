import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'

interface ValidationErrorResponse {
  message: string
  errors: Record<string, string[]>
}

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
) => {
  if (!error) return 'Có lỗi xảy ra, vui lòng thử lại.'

  if ('status' in error) {
    const errorData = error.data as unknown

    if (error.status === 'FETCH_ERROR') return 'Không thể kết nối tới server.'
    if (error.status === 'PARSING_ERROR') return 'Lỗi xử lý dữ liệu.'
    if (error.status === 404) return 'Không tìm thấy dữ liệu.'
    if (error.status === 500) return 'Lỗi server, vui lòng thử lại sau.'
    if (error.status === 422) {
      const data = errorData as ValidationErrorResponse
      if (data?.errors) {
        return Object.values(data.errors).flat().join(' ')
      }
      return data.message || 'Dữ liệu không hợp lệ.'
    }
    const data = errorData as { message?: string }
    return `Lỗi: ${data.message || 'Không xác định.'}`
  }

  if ('message' in error) return error.message ?? 'Có lỗi xảy ra.'

  return 'Có lỗi xảy ra.'
}
