import { BaseState } from '#types/api'

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  phone: string | null
  role: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface Address {
  id: number
  user_id: number
  receiver_name: string
  receiver_email: string | null
  receiver_phone: string
  address: string
  is_default: number
  created_at: string
  updated_at: string
}

export type UserState = BaseState<User[], User>
