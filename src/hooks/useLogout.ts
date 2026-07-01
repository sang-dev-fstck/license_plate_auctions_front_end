import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { notification } from 'antd'
export function useLogout(redirectTo: string = '/') {
  const navigate = useNavigate()

  const logout = async () => {
    try {
      // 1. Xóa cookies
      Cookies.remove('userToken', { path: '/' })
      Cookies.remove('userData', { path: '/' })
      Cookies.remove('parkingLotId', { path: '/' })
      notification.success({
        message: 'Đăng xuất thành công',
        description: 'Bạn đã đăng xuất thành công',
      })
      // 2. Navigate về login page
      navigate(redirectTo, { replace: true })
    } catch (error) {
      notification.error({
        message: 'Lỗi khi đăng xuất',
        description: 'Vui lòng thử lại sau',
      })
    }
  }

  return logout
}
