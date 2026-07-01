import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import { getUserData } from '../../utils/userData'
import type { AuthState, UserData } from '../../types/Auth'

// Lấy userData từ Cookies (qua utility an toàn)
const userData: UserData | null = getUserData<UserData>()

const userToken = Cookies.get('userToken')

const initialState: AuthState = {
  userData,
  userToken: userToken ? { data: userToken } : null,
  isAuthenticated: !!userData,
  isLoading: false,
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    login: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload

      const decodedToken: any = jwtDecode(token)

      state.userData = {
        email: decodedToken.email,
        id: decodedToken.id,
        role: decodedToken.role,
        fullName: decodedToken.fullName,
        phoneNumber: decodedToken.phoneNumber,
        exp: decodedToken.exp,
        department: decodedToken.department,
        adminId: decodedToken.adminId,
      }

      state.userToken = { data: token }
      state.isAuthenticated = true

      const expirationDate = new Date(Number(state.userData.exp) * 1000)
      Cookies.set('userData', JSON.stringify(state.userData), {
        expires: expirationDate,
      })
      Cookies.set('userToken', token, { expires: expirationDate })
      if (state.userData.role === 'Admin') {
        window.location.href = '/admin/manage-account'
      } else {
        window.location.href = '/operator/parking-lot'
      }
    },
    logout: (state) => {
      state.userData = null
      state.userToken = null
      state.isAuthenticated = false

      Cookies.remove('userData')
      Cookies.remove('userToken')
    },
  },
})

export const { login, logout, setLoading } = authSlice.actions
export default authSlice.reducer
export const selectAuthUser = (state: { authSlice: AuthState }) => state.authSlice
