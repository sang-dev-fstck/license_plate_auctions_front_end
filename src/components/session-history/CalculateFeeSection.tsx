import React, { useState } from 'react'
import { CalculatorOutlined } from '@ant-design/icons'
import { Input, Upload, message } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import type { PricingPolicyLink } from '../../types/PricingPolicyLink'
import type { ParkingLotSession } from '../../types/ParkingLotSession'
import { useUpdateGuestCardStatusMutation } from '../../features/operator/guestCardAPI'
import PricingPolicySelector from './PricingPolicySelector'
import CalculateFeeResult from './CalculateFeeResult'
import './CalculateFeeSection.css'

interface CalculateFeeSectionProps {
  pricingPolicies: PricingPolicyLink[] | undefined
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
  selectedSession: ParkingLotSession | null
}

const CalculateFeeSection: React.FC<CalculateFeeSectionProps> = ({
  pricingPolicies,
  selectedPricingPolicyId,
  onSelectPolicy,
  onCalculateFee,
  isCalculatingFee,
  calculateFeeResult,
  onCheckout,
  isSubmittingCheckout,
  selectedSession,
}) => {
  const [note, setNote] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [lostCard, setLostCard] = useState(false)
  const [updateGuestCardStatus] = useUpdateGuestCardStatusMutation()

  const calculatedAmount = calculateFeeResult?.data?.[0]?.amount || 0
  const totalAmount = calculatedAmount + (lostCard ? 500000 : 0)

  const handleFileChange = (info: any) => {
    let newFileList = [...info.fileList]
    newFileList = newFileList.slice(-1) // keep last
    setFileList(newFileList)
  }

  const handleCheckout = async () => {
    if (!selectedPricingPolicyId) {
      message.error('Vui lòng chọn chính sách giá')
      return
    }
    if (!calculatedAmount || calculatedAmount <= 0) {
      message.error('Vui lòng tính phí trước khi checkout')
      return
    }
    const file = fileList.length > 0 ? (fileList[0].originFileObj as File) : null
    
    try {
      // Checkout first
      await onCheckout({
        pricingPolicyId: selectedPricingPolicyId,
        amountPayAfterCheckOut: totalAmount,
        file,
        note: note || undefined,
      })

      // After successful checkout, if lost card checkbox is ticked and session has guestCardId, deactivate the card
      if (lostCard && selectedSession?.guestCardId) {
        const guestCardId =
          typeof selectedSession.guestCardId === 'object'
            ? selectedSession.guestCardId._id
            : selectedSession.guestCardId

        if (guestCardId) {
          try {
            await updateGuestCardStatus({
              id: guestCardId,
              status: 'INACTIVE',
            }).unwrap()
            message.success('Đã vô hiệu hóa thẻ khách')
          } catch (error: any) {
            console.error('Error deactivating guest card:', error)
            message.warning(
              error?.data?.message ||
                error?.message ||
                'Không thể vô hiệu hóa thẻ khách. Vui lòng thử lại.'
            )
            // Checkout already succeeded, so we just warn about deactivation failure
          }
        }
      }

      setNote('')
      setFileList([])
      setLostCard(false)
    } catch (err) {
      // parent handles error
    }
  }

  return (
    <div className="session-calculate-fee-section">
      <h3 className="session-fee-section-title">Chọn chính sách giá</h3>
      <PricingPolicySelector
        policies={pricingPolicies || []}
        selectedPolicyId={selectedPricingPolicyId}
        onSelectPolicy={onSelectPolicy}
      />
      <button
        className="session-calculate-fee-btn"
        onClick={onCalculateFee}
        disabled={isCalculatingFee || !selectedPricingPolicyId}
      >
        <CalculatorOutlined />
        <span>{isCalculatingFee ? 'Đang tính...' : 'Tính tiền thủ công'}</span>
      </button>
      <CalculateFeeResult result={calculateFeeResult} />

      {calculateFeeResult && (
        <div className="session-inline-checkout">
          <h4 className="session-inline-title">Checkout thủ công</h4>
          <div className="session-inline-field">
            <label>Ghi chú (tuỳ chọn)</label>
            <Input.TextArea
              rows={3}
              placeholder="Nhập ghi chú"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        <div className="session-inline-field session-inline-checkbox">
          <label>
            <input
              type="checkbox"
              checked={lostCard}
              onChange={(e) => setLostCard(e.target.checked)}
            />
            Mất thẻ (phụ phí 500.000đ)
          </label>
        </div>
          <div className="session-inline-field">
            <label>File ảnh chứng từ (tuỳ chọn)</label>
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
            >
              <button type="button" className="session-inline-upload-btn">
                Chọn file
              </button>
            </Upload>
          </div>
          <div className="session-inline-actions">
            <div className="session-inline-amount">
            Số tiền:
            <strong>
              {totalAmount.toLocaleString('vi-VN')} đ
              {lostCard && ' (đã gồm 500.000đ mất thẻ)'}
            </strong>
            </div>
            <button
              type="button"
              className="session-inline-checkout-btn"
              onClick={handleCheckout}
            disabled={isSubmittingCheckout || !selectedPricingPolicyId || !calculatedAmount}
            >
              {isSubmittingCheckout ? 'Đang xử lý...' : 'Checkout thủ công'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalculateFeeSection
