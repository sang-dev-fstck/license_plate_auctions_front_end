import { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import OperatorHeader from '../header/OperatorHeader'
import OperatorSidebar from '../sideBar/OperatorSidebar'
import { useMobileMenu } from '../../../hooks/useMobileMenu'

const { Content } = Layout

function OperatorLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { isMobile, mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu()

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const handleCollapse = useCallback((collapsed: boolean) => {
    setCollapsed(collapsed)
  }, [])

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
      }}
    >
      <OperatorSidebar
        collapsed={collapsed}
        onCollapse={handleCollapse}
        isMobile={isMobile}
        mobileOpen={mobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
      />

      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div className="mobile-overlay show" onClick={closeMobileMenu} />
      )}

      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? '10vh' : '35vh',
          transition: 'margin-left 0.3s ease',
          background: '#f5f5f5',
        }}
      >
        <OperatorHeader onMobileMenuToggle={toggleMobileMenu} isMobile={isMobile} />
        <Content
          style={{
            margin: isMobile ? '0.8vh' : '1.6vh',
            padding: isMobile ? '1.6vh' : '2.4vh',
            background: '#ffffff',
            borderRadius: isMobile ? '1.2vh' : '2vh',
            boxShadow: '0 0.1vh 0.3vh rgba(0, 0, 0, 0.1)',
            minHeight: isMobile ? 'calc(100vh - 8vh)' : 'calc(100vh - 12vh)',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default OperatorLayout
