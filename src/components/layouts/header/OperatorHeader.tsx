import React from 'react'
import { Layout, Button, Dropdown, Avatar, Space } from 'antd'
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons'
import './AdminHeader.css'
import { getUserFullName } from '../../../utils/userData'
import { useLogout } from '../../../hooks/useLogout'
import { NotificationDropdown } from '../../common'
import { useNavigate } from 'react-router-dom'
const { Header } = Layout

interface OperatorHeaderProps {
  onMobileMenuToggle?: () => void
  isMobile?: boolean
}

const OperatorHeader: React.FC<OperatorHeaderProps> = ({ onMobileMenuToggle, isMobile }) => {
  const fullName = getUserFullName('Chủ bãi xe')
  const logout = useLogout()
  const navigate = useNavigate()
  const userMenuItems = [
    {
      key: '1',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
      onClick: () => {
        navigate('/profile')
      },
    },
    {
      key: '3',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        logout()
      },
    },
  ]

  return (
    <Header className="admin-header">
      {isMobile && (
        <button
          className="mobile-menu-toggle"
          onClick={onMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          <MenuOutlined />
        </button>
      )}

      <div className="header-left">
        <h3>
          {isMobile
            ? `Xin chào, ${fullName.split(' ')[0]}!`
            : `Chào mừng quay lại, ${fullName}! Hãy quản lý bãi đỗ của bạn nhé.`}
        </h3>
      </div>

      <div className="header-right">
        <Space size="middle">
          <NotificationDropdown isMobile={!!isMobile} />
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <Button type="text" className="user-menu-btn">
              <Avatar
                size={isMobile ? 24 : 32}
                icon={<UserOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  marginRight: isMobile ? '6px' : '8px',
                }}
              />
              {!isMobile && fullName}
            </Button>
          </Dropdown>
        </Space>
      </div>
    </Header>
  )
}

export default OperatorHeader
