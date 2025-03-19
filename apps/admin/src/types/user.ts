import { BaseState } from '#types/api'

export interface User {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
}

export type UserState = BaseState<User[], User>

