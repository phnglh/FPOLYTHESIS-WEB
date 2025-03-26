import { BaseState } from '#types/api'
import { Sku } from '#types/products'

export interface Cart {
  id: number
  user_id: number
  items: CartItem[]
}

export interface CartItem {
  id: number
  cart_id: number
  sku_id: number
  product_name: string
  quantity: number
  unit_price: number
  sku: Sku
}

export type CartState = BaseState<Cart | null, Cart>
