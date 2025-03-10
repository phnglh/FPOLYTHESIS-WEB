import { BaseState } from '#types/api'

export interface Category {
  id: number
  name: string
  description: string
  image?: string
  parent_id?: number
}

export interface CategoryResponse {
  success: boolean
  message: string
  data: {
    categories: Category[]
    meta: {
      total: number
      per_page: number
      current_page: number
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any | null
}

export interface GetCategoryResponse {
  categories?: Category[]
  meta: {
    total: number
    per_page: number
    current_page: number
  }
}

export type CategoryState = BaseState<Category[]>
