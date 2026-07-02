export interface UserToken {
  data: string // JWT token
}

export interface UserData {
  email: string
  id: string
  department: string
  role: string
  fullName: string
  phoneNumber: string
  adminId: string
  exp: boolean
}

export interface AuthState {
  userData: UserData | null
  userToken: UserToken | null
  isAuthenticated: boolean
  isLoading: boolean
}
