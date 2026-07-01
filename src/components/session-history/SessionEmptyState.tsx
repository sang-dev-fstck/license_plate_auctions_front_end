import React from 'react'
import './SessionEmptyState.css'

const SessionEmptyState: React.FC = () => {
  return (
    <div className="session-empty-state">
      <div className="session-empty-icon">🚗</div>
      <h3 className="session-empty-title">Chưa có dữ liệu</h3>
      <p className="session-empty-text">
        Chưa có dữ liệu trong khoảng thời gian này. Vui lòng thử chọn khoảng thời gian khác.
      </p>
    </div>
  )
}

export default SessionEmptyState
