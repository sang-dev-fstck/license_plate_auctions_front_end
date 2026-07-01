import { Route, Routes } from 'react-router-dom'
import routes from './routes/routes'
import PermissionCheck from './components/permission/PermissionCheck'
import NotFound from './components/not-found/NotFound'
import { useAutoLogout } from './hooks/useAutoLogout'
import { Suspense } from 'react'
import { Spin } from 'antd'
function App() {
  useAutoLogout()

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Spin size="large" />
        </div>
      }
    >
      <Routes>
        {routes.flatMap((route) => {
          const Layout = route.layout
          return route.data.map((item) => {
            const Component = item.component
            return (
              <Route
                key={item.path}
                path={item.path}
                element={
                  <PermissionCheck protectedRole={item.role}>
                    <Layout />
                  </PermissionCheck>
                }
              >
                <Route index element={<Component />} />
              </Route>
            )
          })
        })}

        {/* Trang fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
