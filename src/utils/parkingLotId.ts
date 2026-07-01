import Cookies from 'js-cookie'

const USER_DATA_COOKIE_KEY = 'parkingLotId'

export function getParkingLotIdCookie(): string | null {
  const raw = Cookies.get(USER_DATA_COOKIE_KEY)
  if (!raw) return null
  try {
    return raw as string
  } catch {
    return null
  }
}

export function getParkingLotId(defaultId = ''): string {
  const data = getParkingLotIdCookie()
  return data || defaultId
}
