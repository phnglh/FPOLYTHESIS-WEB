import { BaseState } from '#types/api'
import { Sku } from '#types/products'

export interface Cart {
  id: number
  user_id: number
  created_at: string
  updated_at: string
  items: CartItem[]
}

export interface CartItem {
  id: number
  cart_id: number
  sku_id: number
  quantity: number
  unit_price: number
  created_at: string
  updated_at: string
  sku: Sku
}

export type CartState = BaseState<Cart | null, Cart>
