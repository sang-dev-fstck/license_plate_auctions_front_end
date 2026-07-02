import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authApi";
import { Button, Card, Form, Input, message } from "antd";
import { refreshCsrfToken } from "../../utils/csrf";

type LoginFormValues = {
  email: string;
  password: string;
};
type LoginResponse = {
  message?: string
}
interface ErrrorResponse {
  data: {
    message?: string
  }
}
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await refreshCsrfToken();
      const response = await login(values).unwrap() as LoginResponse;
      await refreshCsrfToken();
      message.success(response.message);
      navigate("/auction-sessions/6a165f974b18e5349b1996d1");
    } catch (error: unknown) {
      const err = error as ErrrorResponse;
      message.error(err.data.message);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Card title="Login" style={{ width: 360 }}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            name="email"
            initialValue="sangho1306@gmail.com"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            initialValue="Abc123@123"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default Login
