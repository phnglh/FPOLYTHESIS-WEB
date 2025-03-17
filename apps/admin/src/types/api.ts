import { AxiosRequestConfig } from 'axios'

export interface ApiRequest<T, P = Record<string, unknown>> {
  url: string
  method?: AxiosRequestConfig['method']
  data?: T
  params?: P
}

export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface Meta {
  current_page: number
  from: number
  last_page: number
  links: PaginationLink[]
  path: string
  per_page: number
  to: number
  total: number
}

export interface Links {
  first: string
  last: string
  prev: string | null
  next: string | null
}

export interface ApiResponse<T> {
  data: T
  status: string
  status_code: number
  message: string
  links: Links
  meta: Meta
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any
  error_code: string | null
  timestamp: number
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
