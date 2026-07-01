import Cookies from 'js-cookie'

export interface MinimalUserData {
  fullName?: string
  id?: string
  role: string
}

const USER_DATA_COOKIE_KEY = 'userData'

// Cache để tránh parse lại JSON mỗi lần gọi (chỉ re-parse khi cookie value thay đổi)
let cachedCookieValue: string | undefined = undefined
let cachedUserData: any = null

export function getUserData<T = MinimalUserData>(): T | null {
  const raw = Cookies.get(USER_DATA_COOKIE_KEY)

  // Nếu cookie value không đổi, trả về cached data
  if (raw === cachedCookieValue && cachedUserData !== null) {
    return cachedUserData as T
  }

  // Cookie value thay đổi hoặc chưa có cache → parse lại
  if (!raw) {
    cachedCookieValue = undefined
    cachedUserData = null
    return null
  }

  try {
    const parsed = JSON.parse(raw) as T
    // Update cache
    cachedCookieValue = raw
    cachedUserData = parsed
    return parsed
  } catch {
    cachedCookieValue = undefined
    cachedUserData = null
    return null
  }
}

export function getUserFullName(defaultName = 'User'): string {
  const data = getUserData()
  return data?.fullName || defaultName
}
