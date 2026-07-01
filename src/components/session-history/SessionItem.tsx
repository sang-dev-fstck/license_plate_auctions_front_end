import React from 'react'
import {
  EyeOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CrownOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import type { ParkingLotSession } from '../../types/ParkingLotSession'
import {
  formatCurrency,
  dateFormatter,
  getStatusClass,
  getStatusLabel,
  getPaymentStatusClass,
  getPaymentStatusLabel,
} from './sessionHistoryUtils'
import './SessionItem.css'

interface SessionItemProps {
  session: ParkingLotSession
  onViewDetails: (sessionId: string, session: ParkingLotSession) => void
  onCheckout?: (sessionId: string, session: ParkingLotSession) => void
}

const SessionItem: React.FC<SessionItemProps> = ({ session, onViewDetails, onCheckout }) => {
  const statusClass = getStatusClass(session.status)
  const statusLabel = getStatusLabel(session.status)
  const paymentStatusClass = getPaymentStatusClass(session.paymentStatus)
  const paymentStatusLabel = getPaymentStatusLabel(session.paymentStatus)
  const totalAmount = (session.amountPaid || 0) + (session.amountPayAfterCheckOut || 0)

  return (
    <div className="session-item">
      <div className="session-item-header">
        <div className="session-item-title-section">
          <div className="session-plate-badge">{session.plateNumber}</div>
          <div className={`session-status-badge ${statusClass}`}>
            <span className="session-status-dot" />
            <span>{statusLabel}</span>
          </div>
          <div className={`session-payment-badge ${paymentStatusClass}`}>
            <span>{paymentStatusLabel}</span>
          </div>
        </div>
        <div className="session-item-actions">
          {session.status === 'ACTIVE' && onCheckout && (
            <button
              className="session-checkout-btn"
              onClick={() => onCheckout(session._id, session)}
              title="Checkout"
            >
              <LogoutOutlined />
              <span>Checkout</span>
            </button>
          )}
          {session.status === 'ACTIVE' ? (
            <button
              className="session-view-details-btn"
              onClick={() => onViewDetails(session._id, session)}
              title="Xem chi tiết"
            >
              <FileTextOutlined />
              <span>Xem chi tiết</span>
            </button>
          ) : (
            <button
              className="session-view-images-btn"
              onClick={() => onViewDetails(session._id, session)}
              title="Xem ảnh"
            >
              <EyeOutlined />
              <span>Xem ảnh</span>
            </button>
          )}
        </div>
      </div>

      <div className="session-item-body">
        <div className="session-time-info">
          <div className="session-time-item">
            <CheckCircleOutlined className="session-time-icon check-in" />
            <div>
              <span className="session-time-label">Check-in</span>
              <span className="session-time-value">{dateFormatter(session.checkInTime)}</span>
            </div>
          </div>
          <div className="session-time-item">
            <CloseCircleOutlined className="session-time-icon check-out" />
            <div>
              <span className="session-time-label">Check-out</span>
              <span className="session-time-value">{dateFormatter(session.checkOutTime)}</span>
            </div>
          </div>
        </div>

        {session.subscriptionId ? (
          <div className="session-subscription-info">
            <div className="session-subscription-badge">
              <CrownOutlined className="session-subscription-icon" />
              <span>Khách dùng vé tháng</span>
            </div>
          </div>
        ) : session.reservationId ? (
          <div className="session-reservation-info">
            <div className="session-reservation-badge">
              <CalendarOutlined className="session-reservation-icon" />
              <span>Đặt trước</span>
            </div>
          </div>
        ) : (
          <div className="session-payment-info">
            <div className="session-payment-item">
              <span className="session-payment-label">Phí đã thu:</span>
              <span className="session-payment-value paid">
                {formatCurrency(session.amountPaid)}
              </span>
            </div>
            <div className="session-payment-item">
              <span className="session-payment-label">Phí đã trả sau check-out:</span>
              <span className="session-payment-value unpaid">
                {formatCurrency(session.amountPayAfterCheckOut)}
              </span>
            </div>
            <div className="session-payment-item">
              <span className="session-payment-label">Tổng phí:</span>
              <span className="session-payment-value total">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionItem
