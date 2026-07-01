// src/routes/RouteWrapper.tsx
import React from 'react'
import { Route } from 'react-router-dom'
import PermissionCheck from '../components/permission/PermissionCheck'

interface RouteItem {
  path: string
  component: React.ComponentType
  role?: string[]
}

interface RouteGroup {
  layout: React.ComponentType
  data: RouteItem[]
}

export const RouteWrapper: React.FC<{ route: RouteGroup }> = ({ route }) => {
  const Layout = route.layout

  return (
    <Route element={<Layout />}>
      {route.data.map((item) => {
        const Component = item.component
        return (
          <Route
            key={item.path}
            path={item.path}
            element={
              <PermissionCheck protectedRole={item.role}>
                <Component />
              </PermissionCheck>
            }
          />
        )
      })}
    </Route>
  )
}
