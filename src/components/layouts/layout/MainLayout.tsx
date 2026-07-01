import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
const { Content } = Layout

function MainLayout() {
  return (
    <Layout
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <Content>
        <Outlet />
      </Content>
    </Layout>
  )
}

export default MainLayout
