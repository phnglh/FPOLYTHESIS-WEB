import { AxiosRequestConfig } from 'axios'

export interface ApiRequest<T> {
  url: string
  method?: AxiosRequestConfig['method']
  data?: T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>
}

export interface ApiResponse<T> {
  data: T
}

export interface ApiError {
  status: number
  message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}
