import { BaseState } from '#types/api'

export interface Product {
  id: number
  name: string
  description: string
  is_published: boolean
  image_url?: string
  price?: number
  brand_id?: number
  brand_name?: string
  category_id?: number
  category_name?: string
  skus: Sku[]
}

export interface Sku {
  id: number
  product_id: number
  sku: string
  image_url: string[] | string
  price: number
  stock: number
  attributes: Attribute[]
}
export interface Attribute {
  id: number
  name: string
  value?: string
}

export interface AttributeValue {
  id: number
  attribute_id: number
  value: string
}

export interface ProductResponse {
  success: boolean
  message: string
  data: Product[]
  meta: {
    total: number
    per_page: number
    current_page: number
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any | null
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

export type ProductsState = BaseState<Product[], Product>
export type AttributeState = BaseState<Attribute[], Attribute>
