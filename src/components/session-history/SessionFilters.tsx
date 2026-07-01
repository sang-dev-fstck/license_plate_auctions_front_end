import React from 'react'
import { DatePicker } from 'antd'
import type { Dayjs } from 'dayjs'
import { ReloadOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons'
import type { ParkingLot } from '../../types/ParkingLot'
import './SessionFilters.css'

const { RangePicker } = DatePicker

interface SessionFiltersProps {
  parkingLots: ParkingLot[]
  selectedLotId: string | undefined
  onLotChange: (value: string) => void
  dateRange: [Dayjs, Dayjs]
  onDateChange: (value: [Dayjs | null, Dayjs | null] | null) => void
  plateNumberSearch: string
  onPlateNumberSearchChange: (value: string) => void
  onClearPlateNumberSearch: () => void
  onRefresh: () => void
}

const SessionFilters: React.FC<SessionFiltersProps> = ({
  parkingLots,
  selectedLotId,
  onLotChange,
  dateRange,
  onDateChange,
  plateNumberSearch,
  onPlateNumberSearchChange,
  onClearPlateNumberSearch,
  onRefresh,
}) => {
  return (
    <div className="session-controls-card">
      <div className="session-filter-wrapper">
        <div className="session-filter-item">
          <label htmlFor="lot-select" className="session-filter-label">
            Bãi đỗ xe:
          </label>
          <select
            id="lot-select"
            className="session-filter-select"
            value={selectedLotId || ''}
            onChange={(e) => onLotChange(e.target.value)}
          >
            <option value="">-- Chọn bãi đỗ xe --</option>
            {parkingLots.map((lot) => (
              <option key={lot._id} value={lot._id}>
                {lot.name}
              </option>
            ))}
          </select>
        </div>
        <div className="session-filter-item">
          <label htmlFor="date-range" className="session-filter-label">
            Khoảng thời gian:
          </label>
          <RangePicker
            id="date-range"
            value={dateRange}
            onChange={onDateChange}
            allowClear={false}
            format="DD/MM/YYYY"
            className="session-date-picker"
          />
        </div>
        <div className="session-filter-item">
          <label htmlFor="plate-search" className="session-filter-label">
            Tìm kiếm biển số:
          </label>
          <div className="session-search-wrapper">
            <SearchOutlined className="session-search-icon" />
            <input
              id="plate-search"
              type="text"
              className="session-search-input"
              placeholder="Nhập biển số xe..."
              value={plateNumberSearch}
              onChange={(e) => onPlateNumberSearchChange(e.target.value)}
            />
            {plateNumberSearch && (
              <button
                className="session-search-clear"
                onClick={onClearPlateNumberSearch}
                title="Xóa tìm kiếm"
              >
                <CloseOutlined />
              </button>
            )}
          </div>
        </div>
        <button className="session-refresh-btn" onClick={onRefresh}>
          <ReloadOutlined />
          <span>Làm mới</span>
        </button>
      </div>
    </div>
  )
}

export default SessionFilters
