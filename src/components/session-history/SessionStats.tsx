import React from 'react'
import { CarOutlined, ClockCircleOutlined, DollarCircleOutlined } from '@ant-design/icons'
import { formatCurrency } from './sessionHistoryUtils'
import './SessionStats.css'

interface SessionStatsProps {
  total: number
  active: number
  revenue: number
  avgDuration: string
}

const SessionStats: React.FC<SessionStatsProps> = ({ total, active, revenue, avgDuration }) => {
  return (
    <div className="session-stats-section">
      <div className="session-stat-card">
        <div className="session-stat-icon total">
          <CarOutlined />
        </div>
        <div className="session-stat-content">
          <h3>{total}</h3>
          <p>Tổng phiên</p>
          <div className="session-stat-sub">Trang hiện tại</div>
        </div>
      </div>
      <div className="session-stat-card">
        <div className="session-stat-icon active">
          <ClockCircleOutlined />
        </div>
        <div className="session-stat-content">
          <h3>{active}</h3>
          <p>Đang đậu</p>
          <div className="session-stat-sub">Chưa check-out</div>
        </div>
      </div>
      <div className="session-stat-card">
        <div className="session-stat-icon revenue">
          <DollarCircleOutlined />
        </div>
        <div className="session-stat-content">
          <h3>{formatCurrency(revenue)}</h3>
          <p>Doanh thu</p>
          <div className="session-stat-sub">Trang hiện tại</div>
        </div>
      </div>
      <div className="session-stat-card">
        <div className="session-stat-icon duration">
          <ClockCircleOutlined />
        </div>
        <div className="session-stat-content">
          <h3>{avgDuration}</h3>
          <p>Thời gian đậu TB</p>
          <div className="session-stat-sub">Trung bình</div>
        </div>
      </div>
    </div>
  )
}

export default SessionStats
