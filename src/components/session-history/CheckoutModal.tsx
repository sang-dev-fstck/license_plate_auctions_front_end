import React, { useState } from 'react'
import { Input, InputNumber, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import CustomModal from '../common/CustomModal'
import type { PricingPolicyLink } from '../../types/PricingPolicyLink'
import { formatCurrency } from './sessionHistoryUtils'
import './CheckoutModal.css'

const { TextArea } = Input

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (data: {
    pricingPolicyId: string
    amountPayAfterCheckOut: number
    file?: File | null
    note?: string
  }) => Promise<void>
  sessionId: string // Used for API call in parent component
  pricingPolicies: PricingPolicyLink[] | undefined
  calculatedAmount?: number
  isSubmitting: boolean
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  open,
  onClose,
  onConfirm,
  pricingPolicies,
  calculatedAmount,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    pricingPolicyId: pricingPolicies && pricingPolicies.length > 0 ? pricingPolicies[0]._id : '',
    amountPayAfterCheckOut: calculatedAmount || 0,
    note: '',
  })
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleSubmit = async () => {
    if (!formData.pricingPolicyId) {
      message.error('Vui lòng chọn chính sách giá')
      return
    }

    if (!formData.amountPayAfterCheckOut || formData.amountPayAfterCheckOut <= 0) {
      message.error('Vui lòng nhập số tiền thanh toán')
      return
    }

    const file = fileList.length > 0 ? (fileList[0].originFileObj as File) : null

    try {
      await onConfirm({
        pricingPolicyId: formData.pricingPolicyId,
        amountPayAfterCheckOut: formData.amountPayAfterCheckOut,
        file,
        note: formData.note || undefined,
      })
      handleClose()
    } catch (error) {
      // Error handling is done in parent component
    }
  }

  const handleClose = () => {
    setFormData({
      pricingPolicyId: pricingPolicies && pricingPolicies.length > 0 ? pricingPolicies[0]._id : '',
      amountPayAfterCheckOut: calculatedAmount || 0,
      note: '',
    })
    setFileList([])
    onClose()
  }

  const handleFileChange = (info: any) => {
    let newFileList = [...info.fileList]
    newFileList = newFileList.slice(-1) // Only keep the last file
    setFileList(newFileList)
  }

  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      title="Checkout thủ công"
      width="600px"
      loading={isSubmitting}
    >
      <div className="checkout-modal-content">
        <div className="checkout-form-item">
          <label className="checkout-form-label">
            Chính sách giá: <span className="required">*</span>
          </label>
          <select
            className="checkout-form-select"
            value={formData.pricingPolicyId}
            onChange={(e) => setFormData({ ...formData, pricingPolicyId: e.target.value })}
          >
            <option value="">-- Chọn chính sách giá --</option>
            {pricingPolicies?.map((policyLink) => {
              const policy = policyLink.pricingPolicyId
              return (
                <option key={policy._id} value={policy._id}>
                  {policy.name}
                </option>
              )
            })}
          </select>
        </div>

        <div className="checkout-form-item">
          <label className="checkout-form-label">
            Số tiền thanh toán: <span className="required">*</span>
          </label>
          <InputNumber
            className="checkout-form-input-number"
            style={{ width: '100%' }}
            placeholder="Nhập số tiền"
            value={formData.amountPayAfterCheckOut}
            onChange={(value) => setFormData({ ...formData, amountPayAfterCheckOut: value || 0 })}
            formatter={(value) => formatCurrency(Number(value))}
            parser={(value) => {
              const parsed = value?.replace(/[^\d]/g, '') || '0'
              return Number(parsed)
            }}
            min={0}
          />
        </div>

        <div className="checkout-form-item">
          <label className="checkout-form-label">File ảnh chứng từ thanh toán (nếu có):</label>
          <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
          >
            <button className="checkout-upload-btn" type="button">
              <UploadOutlined />
              Chọn file
            </button>
          </Upload>
        </div>

        <div className="checkout-form-item">
          <label className="checkout-form-label">Ghi chú:</label>
          <TextArea
            rows={3}
            placeholder="Nhập ghi chú (tùy chọn)"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        </div>

        <div className="checkout-modal-actions">
          <button className="checkout-cancel-btn" onClick={handleClose} disabled={isSubmitting}>
            Hủy
          </button>
          <button className="checkout-confirm-btn" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận checkout'}
          </button>
        </div>
      </div>
    </CustomModal>
  )
}

export default CheckoutModal
