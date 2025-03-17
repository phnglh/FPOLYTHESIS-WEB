import { BaseState } from '#types/api'

export interface Category {
  id: number | string
  name: string
  description: string
  image_url: string | null
  parent_id: number | null
  children?: Category[]
}

export interface CategoryWithKey extends Category {
  key: string | number
  children?: CategoryWithKey[]
}

export interface CategoryResponse {
  success: boolean
  message: string
  data: Category[]
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

export type CategoryState = BaseState<Category[], Category>
