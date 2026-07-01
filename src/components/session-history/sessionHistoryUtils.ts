import dayjs from 'dayjs'

export const formatCurrency = (value?: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

export const dateFormatter = (value?: string | null) =>
  value ? dayjs(value).format('HH:mm DD/MM/YYYY') : 'Chưa có'

export const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    ACTIVE: 'Đang đậu',
    COMPLETED: 'Hoàn thành',
    IN_PROGRESS: 'Đang diễn ra',
    CANCELLED: 'Đã hủy',
    PENDING: 'Đang chờ',
  }
  return statusMap[status] || status
}

export const getStatusClass = (status: string): string => {
  const statusClassMap: Record<string, string> = {
    ACTIVE: 'status-active',
    COMPLETED: 'status-completed',
    IN_PROGRESS: 'status-in-progress',
    CANCELLED: 'status-cancelled',
    PENDING: 'status-pending',
  }
  return statusClassMap[status] || 'status-default'
}

export const getPaymentStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    PAID: 'Đã thanh toán',
    UNPAID: 'Chưa thanh toán',
    PENDING: 'Đang chờ',
  }
  return statusMap[status] || status
}

export const getPaymentStatusClass = (status: string): string => {
  const statusClassMap: Record<string, string> = {
    PAID: 'payment-paid',
    UNPAID: 'payment-unpaid',
    PENDING: 'payment-pending',
  }
  return statusClassMap[status] || 'payment-default'
}
