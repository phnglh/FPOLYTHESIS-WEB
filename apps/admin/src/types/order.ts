import { BaseState } from '#types/api'
import { Address, User } from '#types/user'

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  id: number
  order_id: number
  sku_id: number
  product_name: string
  sku: string
  unit_price: number
  quantity: number
  total_price: number
}

export interface Order {
  id: number
  user_id: number
  shipping_method_id: number
  address_id: number
  order_number: string
  status: OrderStatus
  payment_status: string
  subtotal: number
  shipping_fee: number
  discount: number
  final_total: number
  notes: string | null
  ordered_at: string
  shipped_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  items: OrderItem[]
  address: Address
  user: User
}

export type OrderState = BaseState<Order[], Order>
