import { Button, Result, Space } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function DoesnotLoginYet() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <Result
        status="403"
        title="Yêu cầu Đăng nhập"
        subTitle="Xin lỗi, bạn cần phải đăng nhập để có thể truy cập trang này."
        extra={
          <Space>
            <Button type="primary" onClick={() => navigate('/')}>
              Đi đến trang Đăng nhập
            </Button>
          </Space>
        }
      />
    </div>
  )
}
