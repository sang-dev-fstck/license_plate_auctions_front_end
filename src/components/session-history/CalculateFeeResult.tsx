import React from 'react'
import { formatCurrency } from './sessionHistoryUtils'
import './CalculateFeeResult.css'
import type { Result } from '../../types/Result'

interface CalculateFeeResultProps {
  result: Result
}

const CalculateFeeResult: React.FC<CalculateFeeResultProps> = ({ result }) => {
  if (!result) return null

  const amount = result?.data?.[0]?.amount || 0

  return (
    <div className="session-fee-result">
      <h4>Kết quả tính phí:</h4>
      <div className="session-fee-details">
        <div className="session-fee-item">
          <span className="session-fee-label">Tổng phí:</span>
          <span className="session-fee-value">{formatCurrency(amount)}</span>
        </div>
        {result?.data?.[0]?.message && (
          <div className="session-fee-message">
            <span>{result.data?.[0]?.message}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default CalculateFeeResult
