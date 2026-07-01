import { Result, Button } from 'antd'
import { useNavigateHome } from '../../hooks/useNavigateHome'

const NoPermission = () => {
  const { navigateToHome } = useNavigateHome()

  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
      extra={
        <Button type="primary" onClick={navigateToHome}>
          Trở về trang chủ
        </Button>
      }
    />
  )
}

export default NoPermission
