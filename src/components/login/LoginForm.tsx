import React, { useState } from 'react'
import { Button, Input, Form, Typography, notification } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useLoginMutation } from '../../features/auth/authApi'
import Cookies from 'js-cookie'

const { Title, Text } = Typography

interface LoginFormProps {
  onSwitchToRegister: () => void
}
interface LoginFormValues {
  email: string
  password: string
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [login] = useLoginMutation()

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true)
    try {
      const response = await login({
        email: values.email || '',
        password: values.password,
      }).unwrap()

      const token = response.data

      if (token) {
        Cookies.set('userToken', token, { expires: 7 })
        notification.success({
          message: 'Đăng nhập thành công',
          description: 'Chào mừng bạn đến với ParkSmart!',
        })
      } else {
        notification.error({
          message: 'Lỗi phản hồi',
          description: 'Không tìm thấy token trong phản hồi từ server.',
        })
      }
    } catch (error: unknown) {
      let errorMessage = 'Đã xảy ra lỗi không xác định'

      // Kiểm tra nếu error là một đối tượng
      if (error && typeof error === 'object') {
        // Kiểm tra lỗi từ data.error (dựa trên ví dụ API)
        if (
          'data' in error &&
          error.data &&
          typeof error.data === 'object' &&
          'error' in error.data
        ) {
          errorMessage = (error.data as { error: string }).error
        }
        // Kiểm tra lỗi từ message (nếu có)
        else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message
        }
        // Kiểm tra lỗi từ meta.response.data (nếu lỗi từ Axios hoặc tương tự)
        else if (
          'meta' in error &&
          error.meta &&
          typeof error.meta === 'object' &&
          'response' in error.meta &&
          error.meta.response &&
          typeof error.meta.response === 'object' &&
          'data' in error.meta.response &&
          error.meta.response.data &&
          typeof error.meta.response.data === 'object' &&
          'error' in error.meta.response.data
        ) {
          errorMessage = (error.meta.response.data as { error: string }).error
        }
      }

      notification.error({
        message: 'Đăng nhập thất bại',
        description: errorMessage,
        duration: 4.5,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-form-container">
      <Title level={2} className="brand-title">
        ParkSmart
      </Title>
      <Title level={3} className="welcome-title">
        Chào mừng quay lại!
      </Title>

      <Text className="signup-prompt">
        Muốn trở thành chủ bãi đỗ xe?{' '}
        <span onClick={onSwitchToRegister} className="signup-link">
          Tạo tài khoản chủ bãi đỗ xe ngay,
        </span>{' '}
        Hoàn toàn miễn phí và chỉ mất dưới 1 phút.
      </Text>

      <Form form={form} name="login" onFinish={onFinish} layout="vertical" className="login-form">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Email đăng nhập"
            size="large"
            className="login-input"
          />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu"
            size="large"
            className="login-input"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="login-button"
            block
          >
            Đăng nhập ngay
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default LoginForm
