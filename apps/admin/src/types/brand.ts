import { BaseState } from '#types/api'

export interface Brand {
  id: number
  name: string
  description: string
  image_url?: string
  parent_id?: number
}

export interface BrandResponse {
  success: boolean
  message: string
  data: Brand[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any | null
}

export interface GetBrandResponse {
  categories?: Brand[]
  meta: {
    total: number
    per_page: number
    current_page: number
  }
}

export type BrandState = BaseState<Brand[], Brand>
