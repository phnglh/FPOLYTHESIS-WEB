import { User } from '#types/user'

export interface AuthState {
  user: User | null
  token: string | null
  isInitialized: boolean
  loading: boolean
  error: string | null
}

export interface Login {
  email: string
  password: string
}

