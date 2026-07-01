import React from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

interface Props {
  children: React.ReactNode
  protectedRole?: string[]
}

interface DecodedToken {
  role: string
  exp?: number
  [key: string]: any
}

import DoesnotLoginYet from './DoesnotLoginYet'
import NoPermission from './NoPermission'

const PermissionCheck: React.FC<Props> = ({ children, protectedRole }) => {
  const token = Cookies.get('userToken')

  if (!token && protectedRole?.length) {
    // ✅ Nếu không có token, vẫn cho vào
    return <DoesnotLoginYet />
  }
  try {
    const decoded = jwtDecode<DecodedToken>(token || '')

    // ✅ Nếu token hết hạn → vẫn không redirect
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      Cookies.remove('userToken')
      return <>{children}</>
    }

    // ✅ Nếu có role bảo vệ, thì kiểm tra quyền
    if (protectedRole?.length) {
      const userRole = decoded.role?.toLowerCase()
      const allowedRoles = protectedRole.map((r) => r.toLowerCase())
      if (!allowedRoles.includes(userRole)) {
        return <NoPermission></NoPermission>
      }
    }

    return <>{children}</>
  } catch (err) {
    Cookies.remove('userToken')
    return <>{children}</> // Token sai, nhưng không redirect
  }
}

export default PermissionCheck
