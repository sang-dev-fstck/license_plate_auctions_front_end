import React from 'react'
import CustomModal from '../common/CustomModal'
import type { ParkingLotSession } from '../../types/ParkingLotSession'
import type { SessionImage } from '../../types/Session.images'
import { CalculateFeeSection } from './index'
import './SessionDetailModal.css'

interface SessionDetailModalProps {
  open: boolean
  onClose: () => void
  selectedSession: ParkingLotSession | null
  sessionImages: SessionImage[]
  isFetchingSessionDetail: boolean
  pricingPolicies: any
  selectedPricingPolicyId: string | null
  onSelectPolicy: (policyId: string) => void
  onCalculateFee: () => void
  isCalculatingFee: boolean
  calculateFeeResult: any
  onCheckout: (data: {
    pricingPolicyId: string
    amountPayAfterCheckOut: number
    file?: File | null
    note?: string
  }) => Promise<void>
  isSubmittingCheckout: boolean
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  open,
  onClose,
  selectedSession,
  sessionImages,
  isFetchingSessionDetail,
  pricingPolicies,
  selectedPricingPolicyId,
  onSelectPolicy,
  onCalculateFee,
  isCalculatingFee,
  calculateFeeResult,
  onCheckout,
  isSubmittingCheckout,
}) => {
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={selectedSession?.status === 'ACTIVE' ? 'Chi tiết phiên' : 'Ảnh check-in / check-out'}
      width="900px"
      loading={isFetchingSessionDetail}
    >
      {isFetchingSessionDetail ? (
        <div className="session-image-loading">
          <div className="session-image-loading-spinner" />
          <p>Đang tải thông tin...</p>
        </div>
      ) : (
        <>
          {selectedSession?.status === 'ACTIVE' && (
            <CalculateFeeSection
              pricingPolicies={pricingPolicies}
              selectedPricingPolicyId={selectedPricingPolicyId}
              onSelectPolicy={onSelectPolicy}
              onCalculateFee={onCalculateFee}
              isCalculatingFee={isCalculatingFee}
              calculateFeeResult={calculateFeeResult}
              onCheckout={onCheckout}
              isSubmittingCheckout={isSubmittingCheckout}
              selectedSession={selectedSession}
            />
          )}
          {sessionImages.length === 0 ? (
            <div className="session-image-empty">
              <div className="session-image-empty-icon">📷</div>
              <p>Không có ảnh cho phiên này</p>
            </div>
          ) : (
            <div className="session-images-grid">
              {sessionImages.map((image) => (
                <div key={image.id} className="session-image-card">
                  <img src={image.url} alt={image.description || 'Ảnh phiên gửi xe'} />
                  <span className="session-image-description">
                    {image.description || 'Không có mô tả'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </CustomModal>
  )
}

export default SessionDetailModal
