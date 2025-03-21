import { BaseState } from '#types/api'
import { Product } from '#types/products'

export interface Cart {
  id: number
  user_id: number
  items: CartItem[]
}

export interface CartItem {
  id: number
  product_id: number
  cart_id: number
  quantity: number
  unit_price: number
  product: Product
}

export type CartState = BaseState<Cart | null, Cart>
