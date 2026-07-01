import React from 'react'
import type { PricingPolicyLink } from '../../types/PricingPolicyLink'
import { formatCurrency } from './sessionHistoryUtils'
import './PricingPolicySelector.css'

interface PricingPolicySelectorProps {
  policies: PricingPolicyLink[]
  selectedPolicyId: string | null
  onSelectPolicy: (policyId: string) => void
}

const PricingPolicySelector: React.FC<PricingPolicySelectorProps> = ({
  policies,
  selectedPolicyId,
  onSelectPolicy,
}) => {
  if (!policies || !Array.isArray(policies) || policies.length === 0) {
    return (
      <div className="session-pricing-policy-empty">
        <p>Không có chính sách giá nào</p>
      </div>
    )
  }

  return (
    <div className="session-pricing-policies-grid">
      {policies.map((policyLink) => {
        const policy = policyLink.pricingPolicyId
        const isSelected = selectedPolicyId === policy._id
        return (
          <div
            key={policy._id}
            className={`session-pricing-policy-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectPolicy(policy._id)}
          >
            <div className="session-policy-card-header">
              <h4 className="session-policy-name">{policy.name}</h4>
              {isSelected && <div className="session-policy-selected-badge">✓ Đã chọn</div>}
            </div>
            <div className="session-policy-card-body">
              <div className="session-policy-info-row">
                <span className="session-policy-info-label">Giá mỗi giờ:</span>
                <span className="session-policy-info-value">
                  {formatCurrency(policy.pricePerHour || 0)}
                </span>
              </div>
              <div className="session-policy-info-row">
                <span className="session-policy-info-label">Giá cố định:</span>
                <span className="session-policy-info-value">
                  {formatCurrency(policy.fixedPrice || 0)}
                </span>
              </div>
              {policy.basisId && (
                <div className="session-policy-info-row">
                  <span className="session-policy-info-label">Cơ sở:</span>
                  <span className="session-policy-info-value">
                    {typeof policy.basisId === 'object' ? policy.basisId.basisName : policy.basisId}
                  </span>
                </div>
              )}
              {policyLink.priority && (
                <div className="session-policy-info-row">
                  <span className="session-policy-info-label">Độ ưu tiên:</span>
                  <span className="session-policy-info-value">{policyLink.priority}</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PricingPolicySelector
