import React, { useState } from 'react'
import {
  Button,
  Input,
  Form,
  Typography,
  notification,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Space,
  Steps,
  Checkbox,
  Modal,
} from 'antd'
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  BankOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useRegisterMutation } from '../../features/auth/authApi'
import { useGetWardQuery } from '../../features/operator/wardAPI'
import type { OperatorFullRegisterRequest } from '../../types/register.types'
import LocationPickerMap from '../common/LocationPickerMap'
import type { Ward } from '../../types/Ward'

const { Title, Text, Paragraph } = Typography

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

interface RegisterFormValues {
  email: string
  password: string
  phoneNumber: string
  paymentEmail: string
  fullName: string
  wardId: string
  fullAddress: string
  isAgreeToP: boolean
  effectiveDate: dayjs.Dayjs
  totalCapacityEachLevel: number
  totalLevel: number
  bussinessName: string
  parkingLotName: string
  latitude: number
  longitude: number
  bookableCapacity: number
  leasedCapacity: number
  walkInCapacity: number
  bookingSlotDurationHours: number
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [register] = useRegisterMutation()
  const [step, setStep] = useState(1)
  const [isAgreeToP, setIsAgreeToP] = useState(false)
  const { data: wards, isLoading: isLoadingWards } = useGetWardQuery({})
  const wardData = (wards?.data?.[0] as Ward[]) || []
  const [formData, setFormData] = useState<Partial<RegisterFormValues>>({})
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [tempLocation, setTempLocation] = useState<{ lat: number; lng: number } | null>(null)

  const HO_CHI_MINH_BOUNDS = {
    lat: { min: 10.35, max: 11.25 },
    lng: { min: 106.3, max: 107.2 },
  }

  const HO_CHI_MINH_BOUNDS_RECT: [[number, number], [number, number]] = [
    [HO_CHI_MINH_BOUNDS.lat.min, HO_CHI_MINH_BOUNDS.lng.min],
    [HO_CHI_MINH_BOUNDS.lat.max, HO_CHI_MINH_BOUNDS.lng.max],
  ]

  const isWithinHoChiMinh = (lat: number, lng: number) =>
    lat >= HO_CHI_MINH_BOUNDS.lat.min &&
    lat <= HO_CHI_MINH_BOUNDS.lat.max &&
    lng >= HO_CHI_MINH_BOUNDS.lng.min &&
    lng <= HO_CHI_MINH_BOUNDS.lng.max

  const nextStep = async () => {
    try {
      await form.validateFields([
        'fullName',
        'email',
        'phoneNumber',
        'password',
        'confirmPassword',
        'paymentEmail',
      ])
      setFormData((prev) => ({ ...prev, ...form.getFieldsValue() }))
      setStep((prev) => prev + 1)
    } catch (error) {
      // validation errors handled by antd
    }
  }
  const prevStep = () => {
    setStep(step - 1)
    form.setFieldsValue(formData)
  }

  const openLocationPicker = () => {
    const currentLat = form.getFieldValue('latitude')
    const currentLng = form.getFieldValue('longitude')
    if (typeof currentLat === 'number' && typeof currentLng === 'number') {
      setTempLocation({ lat: currentLat, lng: currentLng })
    } else {
      setTempLocation(null)
    }
    setIsLocationModalOpen(true)
  }

  const handleLocationSelect = (coords: { lat: number; lng: number }) => {
    if (!isWithinHoChiMinh(coords.lat, coords.lng)) {
      notification.warning({
        message: 'Ngoài phạm vi TP.HCM',
        description: 'Vui lòng chọn vị trí thuộc khu vực TP.HCM.',
        duration: 4.5,
      })
      return
    }
    setTempLocation(coords)
  }

  const handleLocationConfirm = () => {
    if (tempLocation) {
      form.setFieldsValue({
        latitude: Number(tempLocation.lat.toFixed(6)),
        longitude: Number(tempLocation.lng.toFixed(6)),
      })
    }
    setIsLocationModalOpen(false)
    setTempLocation(null)
  }

  const handleLocationCancel = () => {
    setIsLocationModalOpen(false)
    setTempLocation(null)
  }

  const currentLatitude = form.getFieldValue('latitude')
  const currentLongitude = form.getFieldValue('longitude')
  const formLocation =
    typeof currentLatitude === 'number' && typeof currentLongitude === 'number'
      ? { lat: currentLatitude, lng: currentLongitude }
      : null
  const mapLocation = tempLocation ?? formLocation

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true)
    const mergedValues = { ...formData, ...values } as RegisterFormValues
    try {
      const registerPayload: OperatorFullRegisterRequest = {
        registerRequest: {
          email: mergedValues.email,
          password: mergedValues.password,
          paymentEmail: mergedValues.paymentEmail,
          phoneNumber: mergedValues.phoneNumber,
          fullName: mergedValues.fullName,
          bussinessName: mergedValues.bussinessName,
          isAgreeToP: mergedValues.isAgreeToP,
        },
        addressRequest: {
          wardId: mergedValues.wardId,
          fullAddress: mergedValues.fullAddress,
          latitude: mergedValues.latitude ?? null,
          longitude: mergedValues.longitude ?? null,
        },
        parkingLotRequest: {
          addressId: 'null',
          parkingLotOperatorId: 'null',
          name: mergedValues.parkingLotName || mergedValues.bussinessName,
          totalCapacityEachLevel: Number(mergedValues.totalCapacityEachLevel ?? 0),
          totalLevel: Number(mergedValues.totalLevel ?? 0),
          effectiveDate: mergedValues.effectiveDate
            ? mergedValues.effectiveDate.format('YYYY-MM-DD')
            : null,
          bookableCapacity: Number(mergedValues.bookableCapacity ?? 0),
          leasedCapacity: Number(mergedValues.leasedCapacity ?? 0),
          walkInCapacity: Number(mergedValues.walkInCapacity ?? 0),
          bookingSlotDurationHours: Number(mergedValues.bookingSlotDurationHours ?? 1),
        },
      }

      await register(registerPayload).unwrap()

      notification.success({
        message: 'Đăng ký thành công!',
        description: `Người dùng ${mergedValues.fullName} đã tạo tài khoản thành công với email đăng nhập là ${mergedValues.email}`,
        duration: 4.5,
      })
      notification.success({
        message: 'Gửi yêu cầu bãi đỗ xe thành công',
        description:
          'Thông tin yêu cầu bãi đỗ xe đã được gửi tới Admin. Vui lòng chờ xét duyệt để tiếp tục sử dụng hệ thống.',
        duration: 4.5,
      })
      form.resetFields()
      setStep(1)
      setIsAgreeToP(false)
      setFormData({})
      setTempLocation(null)
    } catch (error: unknown) {
      let errorMessage = 'Đã xảy ra lỗi không xác định'

      // Kiểm tra nếu error là một đối tượng
      if (error && typeof error === 'object') {
        if ('data' in error && error.data && typeof error.data === 'object') {
          const errorData = error.data as {
            message?: string
            error?: string | string[]
          }
          const candidate =
            typeof errorData.message === 'string' && errorData.message.trim().length > 0
              ? errorData.message
              : errorData.error

          if (Array.isArray(candidate)) {
            errorMessage =
              candidate.filter((msg) => typeof msg === 'string').join(', ') || errorMessage
          } else if (typeof candidate === 'string' && candidate.trim().length > 0) {
            errorMessage = candidate
          }
        } else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message
        } else if (
          'meta' in error &&
          error.meta &&
          typeof error.meta === 'object' &&
          'response' in error.meta &&
          error.meta.response &&
          typeof error.meta.response === 'object' &&
          'data' in error.meta.response &&
          error.meta.response.data &&
          typeof error.meta.response.data === 'object'
        ) {
          const responseData = error.meta.response.data as {
            message?: string
            error?: string | string[]
          }
          const candidate =
            typeof responseData.message === 'string' && responseData.message.trim().length > 0
              ? responseData.message
              : responseData.error

          if (Array.isArray(candidate)) {
            errorMessage =
              candidate.filter((msg) => typeof msg === 'string').join(', ') || errorMessage
          } else if (typeof candidate === 'string' && candidate.trim().length > 0) {
            errorMessage = candidate
          }
        }
      }

      notification.error({
        message: 'Đăng ký thất bại',
        description: errorMessage,
        duration: 4.5,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="login-form-container">
        <Title level={2} className="brand-title">
          ParkSmart
        </Title>
        <Title level={3} className="welcome-title">
          Tạo tài khoản chủ bãi đỗ xe
        </Title>

        <Text className="signup-prompt">
          Đã có tài khoản?
          <span onClick={onSwitchToLogin} className="signup-link">
            Đăng nhập tại đây
          </span>
        </Text>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          className="login-form"
          initialValues={{
            isAgreeToP: false,
          }}
        >
          <Steps
            current={step - 1}
            items={[{ title: 'Thông tin tài khoản' }, { title: 'Thông tin bãi đỗ' }]}
            size="small"
            style={{ marginBottom: 24 }}
          />
          {step === 1 && (
            <>
              <Form.Item
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Họ và tên"
                  size="large"
                  className="login-input"
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Email"
                  size="large"
                  className="login-input"
                />
              </Form.Item>
              <Form.Item
                name="paymentEmail"
                rules={[
                  { required: true, message: 'Vui lòng nhập email thanh toán!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Email thanh toán"
                  size="large"
                  className="login-input"
                />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  {
                    pattern: /^\d{10,11}$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Số điện thoại"
                  size="large"
                  className="login-input"
                />
              </Form.Item>
              <Form.Item
                name="bussinessName"
                rules={[{ required: true, message: 'Vui lòng nhập tên doanh nghiệp!' }]}
              >
                <Input
                  prefix={<BankOutlined />}
                  placeholder="Tên doanh nghiệp"
                  size="large"
                  className="login-input"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt!',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                  size="large"
                  className="login-input"
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Mật khẩu không khớp!'))
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Xác nhận mật khẩu"
                  size="large"
                  className="login-input"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={nextStep}
                  size="large"
                  className="login-button"
                  block
                >
                  Tiếp tục
                </Button>
              </Form.Item>
            </>
          )}
          {step === 2 && (
            <>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item
                    label={
                      <Space>
                        <EnvironmentOutlined />
                        <span>Phường</span>
                      </Space>
                    }
                    name="wardId"
                    rules={[{ required: true, message: 'Vui lòng chọn phường' }]}
                  >
                    <Select
                      placeholder="Chọn phường"
                      loading={isLoadingWards}
                      showSearch
                      optionFilterProp="label"
                      options={wardData?.map((w: Ward) => ({
                        key: w._id,
                        label: w.wardName,
                        value: w._id,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label={
                      <Space>
                        <EnvironmentOutlined />
                        <span>Địa chỉ đầy đủ</span>
                      </Space>
                    }
                    name="fullAddress"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                  >
                    <Input placeholder="VD: 29 Lê Duẩn, Phường Bến Nghé, Quận 1" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label={
                      <Space>
                        <EnvironmentOutlined />
                        <span>Tên bãi đỗ</span>
                      </Space>
                    }
                    name="parkingLotName"
                    rules={[{ required: true, message: 'Vui lòng nhập tên bãi đỗ xe' }]}
                  >
                    <Input placeholder="VD: ParkSmart Lê Duẩn" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Button
                    type="dashed"
                    icon={<EnvironmentOutlined />}
                    onClick={openLocationPicker}
                    block
                  >
                    Chọn vị trí trên bản đồ
                  </Button>
                  <Text type="secondary">
                    Nhấn vào nút trên để mở bản đồ và chọn vị trí bãi đỗ xe.
                  </Text>
                  <div>
                    {formLocation ? (
                      <Text type="success">Đã lưu vị trí bãi đỗ.</Text>
                    ) : (
                      <Text type="danger">Chưa chọn vị trí.</Text>
                    )}
                  </div>
                  <Form.Item
                    name="latitude"
                    hidden
                    rules={[{ required: true, message: 'Vui lòng chọn vị trí trên bản đồ' }]}
                  >
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item
                    name="longitude"
                    hidden
                    rules={[{ required: true, message: 'Vui lòng chọn vị trí trên bản đồ' }]}
                  >
                    <Input type="hidden" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label={
                      <Space>
                        <CalendarOutlined />
                        <span>Ngày hiệu lực</span>
                      </Space>
                    }
                    name="effectiveDate"
                    rules={[
                      { required: true, message: 'Chọn ngày hiệu lực' },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.reject(new Error('Chọn ngày hiệu lực'))
                          const diffDays = value.startOf('day').diff(dayjs().startOf('day'), 'day')
                          return diffDays >= 1
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error('Ngày hiệu lực phải muộn hơn hiện tại ít nhất 1 ngày')
                              )
                        },
                      },
                    ]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"
                      className="w-100"
                      placeholder="Chọn ngày"
                      disabledDate={(current) =>
                        !!current && current.startOf('day').diff(dayjs().startOf('day'), 'day') < 1
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Sức chứa mỗi tầng"
                    name="totalCapacityEachLevel"
                    rules={[{ required: true, message: 'Nhập sức chứa/tầng' }]}
                  >
                    <InputNumber min={1} className="w-100" placeholder="VD: 50" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Tổng số tầng"
                    name="totalLevel"
                    rules={[{ required: true, message: 'Nhập số tầng' }]}
                  >
                    <InputNumber min={1} className="w-100" placeholder="VD: 5" />
                  </Form.Item>
                </Col>
              </Row>
              <Typography.Title level={5} style={{ marginBottom: 12, marginTop: 12 }}>
                Phân bổ sức chứa & thời lượng đặt chỗ
              </Typography.Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Sức chứa dành cho booking (chỗ)"
                    name="bookableCapacity"
                    rules={[{ required: true, message: 'Nhập sức chứa booking' }]}
                  >
                    <InputNumber min={0} className="w-100" placeholder="VD: 20" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Sức chứa cho thuê dài hạn (chỗ)"
                    name="leasedCapacity"
                    rules={[{ required: true, message: 'Nhập sức chứa thuê dài hạn' }]}
                  >
                    <InputNumber min={0} className="w-100" placeholder="VD: 10" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Sức chứa khách vãng lai (chỗ)"
                    name="walkInCapacity"
                    rules={[{ required: true, message: 'Nhập sức chứa khách vãng lai' }]}
                  >
                    <InputNumber min={0} className="w-100" placeholder="VD: 15" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Thời lượng mỗi slot đặt chỗ (giờ)"
                    name="bookingSlotDurationHours"
                    rules={[{ required: true, message: 'Nhập thời lượng slot' }]}
                  >
                    <InputNumber min={1} max={24} className="w-100" placeholder="VD: 1" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="isAgreeToP"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error('Bạn cần đồng ý với điều khoản')),
                  },
                ]}
              >
                <Checkbox onChange={(e) => setIsAgreeToP(e.target.checked)}>
                  Tôi đã đọc và đồng ý với Chính sách & Điều khoản
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={prevStep}
                  size="large"
                  className="login-button"
                  block
                >
                  Quay lại
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="login-button"
                  block
                  loading={loading}
                  disabled={!isAgreeToP}
                >
                  Gửi yêu cầu tạo bãi đỗ
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
      </div>
      <Modal
        title="Chọn vị trí bãi đỗ"
        open={isLocationModalOpen}
        onOk={handleLocationConfirm}
        onCancel={handleLocationCancel}
        okText="Sử dụng vị trí này"
        cancelText="Hủy"
        width={760}
        destroyOnHidden
      >
        <Paragraph type="secondary" style={{ marginBottom: 12 }}>
          Nhấp vào vị trí trên bản đồ để đặt điểm đánh dấu. Bạn có thể thu phóng hoặc kéo bản đồ để
          chọn chính xác vị trí bãi đỗ xe.
        </Paragraph>
        <LocationPickerMap
          value={mapLocation}
          onChange={handleLocationSelect}
          bounds={HO_CHI_MINH_BOUNDS_RECT}
        />
      </Modal>
    </>
  )
}

export default RegisterForm
