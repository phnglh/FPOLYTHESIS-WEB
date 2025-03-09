import { BaseState } from '#types/api'

export interface Product {
  id: number
  name: string
  description: string
  isPublished: boolean
  imageUrl?: string
  skus?: Sku[]
}

export interface Sku {
  id: number
  productId: number
  sku: string
  price: number
  stock: number
}
export interface Attribute {
  id: number
  name: string
}

export interface AttributeValue {
  id: number
  attributeId: number
  value: string
}

export interface ProductResponse {
  success: boolean
  message: string
  data: {
    products: Product[]
    meta: {
      total: number
      per_page: number
      current_page: number
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any | null
}

export interface GetProductsResponse {
  products?: Product[]
  meta: {
    total: number
    per_page: number
    current_page: number
  }
}

export type ProductsState = BaseState<Product[]>
