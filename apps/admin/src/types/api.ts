import { AxiosRequestConfig } from 'axios'

export interface ApiRequest<T, P = Record<string, unknown>> {
  url: string
  method?: AxiosRequestConfig['method']
  data?: T
  params?: P
}

export interface ApiResponse<T> {
  data: T
  message?: string
  status?: string
}

export interface ValidationErrorResponse {
  message: string
  errors: Record<string, string[]>
}

export interface ApiError {
  status: number
  message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}
export interface ApiErrorResponse {
  message: string
}

export interface BaseState<T, K> {
  data: T
  selectedItem: K | null
  loading: boolean
  error: string | null
}

export const transformResponse = <T>(response: ApiResponse<T>) => response.data
