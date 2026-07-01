// src/hooks/useAuth.ts

import Cookies from 'js-cookie'

interface AuthState {
  userId: string | null
  userRole: string | null
  isAuthenticated: boolean
}

// Lưu ý: Trong môi trường production, KHÔNG NÊN giải mã JWT ở phía client
// vì nó có thể dễ bị giả mạo. Nên dùng Redux store hoặc Context để lưu thông tin user
// sau khi đã xác thực phía backend.
// Tuy nhiên, đây là cấu trúc mẫu để mô phỏng.

const decodeJwtPayload = (token: string): { id: string; role: string } | null => {
  try {
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return null

    // Thay thế ký tự không an toàn cho URL và decode base64
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson)

    // Giả định payload JWT của bạn có trường 'id' và 'role'
    return {
      id: payload.id as string,
      role: payload.role as string,
    }
  } catch (e) {
    console.error('Lỗi giải mã JWT:', e)
    return null
  }
}

export const useAuth = (): AuthState => {
  // 1. Lấy token từ Cookie (phải khớp với cách bạn lưu token)
  const token = Cookies.get('userToken')

  if (!token) {
    return { userId: null, userRole: null, isAuthenticated: false }
  }

  // 2. Giải mã và lấy thông tin
  const payload = decodeJwtPayload(token)

  if (payload) {
    return {
      userId: payload.id,
      userRole: payload.role.toUpperCase(),
      isAuthenticated: true,
    }
  }

  // Nếu token tồn tại nhưng không hợp lệ (ví dụ: hết hạn, bị thay đổi)
  return { userId: null, userRole: null, isAuthenticated: false }
}
