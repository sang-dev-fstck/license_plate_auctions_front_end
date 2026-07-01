import React from 'react'
import type { Pagination } from '../../types/Pagination'
import './SessionPagination.css'

interface SessionPaginationProps {
  pagination: Pagination | undefined
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
}

const SessionPagination: React.FC<SessionPaginationProps> = ({
  pagination,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  if (!pagination || pagination.totalItems <= pageSize) {
    return null
  }

  const totalPages = Math.ceil(pagination.totalItems / pageSize)

  return (
    <div className="session-pagination">
      <button
        className="session-pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Trước
      </button>
      <span className="session-pagination-info">
        Trang {pagination.currentPage || currentPage} / {totalPages}
      </span>
      <button
        className="session-pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={(pagination.currentPage || currentPage) >= totalPages}
      >
        Sau
      </button>
    </div>
  )
}

export default SessionPagination
