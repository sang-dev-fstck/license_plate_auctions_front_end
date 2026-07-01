import { lazy } from 'react'
import type { LayoutRoute } from '../types/Route'
import AuctionSessionDetailPage from '../pages/AuctionSessionDetailPage'

// Các layout này được export dưới dạng export default
const MainLayout = lazy(() => import('../components/layouts/layout/MainLayout'))
// --- Các Trang (tải lười - lazy loading) ---
const LoginPage = lazy(() => import('../pages/LoginPage'))

const routes: LayoutRoute[] = [
  {
    layout: MainLayout,
    data: [
      {
        path: '/login',
        component: LoginPage,
      },
      {
        path: '/auction-session/:id',
        component: AuctionSessionDetailPage
      }
    ],
  },
]

export default routes
