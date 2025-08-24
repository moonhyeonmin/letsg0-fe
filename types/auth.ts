export interface User {
  user_id: number
  email: string
  nickname: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface SignupRequest {
  email: string
  password: string
  nickname: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, nickname: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}
