import React from 'react'
import { Layout, Menu, Button } from 'antd'
import {
  BarChartOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CarOutlined,
  EnvironmentOutlined,
  WalletOutlined,
  CalendarOutlined,
  GiftOutlined,
  NotificationOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import './AdminSidebar.css'

const { Sider } = Layout

interface AdminSidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
  isMobile?: boolean
  mobileOpen?: boolean
  onMobileToggle?: () => void
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  onCollapse,
  isMobile = false,
  mobileOpen = false,
  onMobileToggle,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Menu items cho ứng dụng Park Smart
  const menuItems = [
    {
      key: '/admin/manage-account',
      icon: <TeamOutlined />,
      label: 'Tài khoản',
    },
    {
      key: '/admin/dashboard-admin',
      icon: <BarChartOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/parking-lot-requests',
      icon: <CarOutlined />,
      label: 'Yêu cầu bãi đỗ xe',
    },
    {
      key: '/admin/manage-parking-lots',
      icon: <EnvironmentOutlined />,
      label: 'Bãi đỗ xe',
    },
    {
      key: '/admin/reports',
      icon: <FileTextOutlined />,
      label: 'Báo cáo',
    },
    {
      key: '/admin/terms-policies',
      icon: <AppstoreOutlined />,
      label: 'Điều khoản & Chính sách',
    },
    {
      key: '/admin/faqs',
      icon: <AppstoreOutlined />,
      label: 'FAQs',
    },
    {
      key: '/admin/payments',
      icon: <WalletOutlined />,
      label: 'Thanh toán',
    },
    {
      key: '/admin/subscription-plan',
      icon: <WalletOutlined />,
      label: 'Dịch vụ đăng ký hàng tháng',
    },
    {
      key: '/admin/events',
      icon: <CalendarOutlined />,
      label: 'Sự kiện',
    },
    {
      key: '/admin/promotions',
      icon: <GiftOutlined />,
      label: 'Khuyến mãi',
    },
    {
      key: '/admin/announcements',
      icon: <NotificationOutlined />,
      label: 'Thông báo',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
    // Close mobile menu after navigation
    if (isMobile && onMobileToggle) {
      onMobileToggle()
    }
  }

  const selectedKeys = [location.pathname]

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={isMobile ? false : collapsed}
      className={`admin-sidebar ${isMobile && mobileOpen ? 'mobile-open' : ''}`}
      width={isMobile ? 280 : 280}
      collapsedWidth={isMobile ? 0 : 80}
    >
      <div className="sidebar-content">
        {/* Header Section */}
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo">
              <div className="logo-icon">
                <CarOutlined />
              </div>
              {!collapsed && <span className="logo-text">Park Smart</span>}
            </div>
            {!isMobile && (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => onCollapse(!collapsed)}
                className="collapse-btn"
              />
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="navigation-section">
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            items={menuItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: (
                <div className="menu-item-content">
                  <span className="menu-label">{item.label}</span>
                </div>
              ),
            }))}
            onClick={handleMenuClick}
            className="navigation-menu"
          />
        </div>
      </div>
    </Sider>
  )
}

export default AdminSidebar
