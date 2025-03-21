import { useState } from 'react'
import {
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  Card,
  Space,
  Row,
  Col,
} from 'antd'
import {
  FacebookOutlined,
  GoogleOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { Login } from '#types/auth'
import { login } from '@store/slices/authSlice'
import { toast } from 'react-toastify'
import { Link, Navigate } from 'react-router'

const { Title, Text } = Typography

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()

  const handleLogin = (values: Login) => {
    setLoading(true)
    dispatch(login(values))
      .unwrap()
      .then(() => {
        toast.success('Đăng nhập thành công!')
      })
      .catch((err) => {
        toast.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <Row justify="center" style={{ paddingTop: 80, marginBottom: 50 }}>
      <Col xs={24} sm={16} md={12} lg={8} xl={6}>
        <Card style={{ width: '100%', padding: 20 }}>
          <Title level={3} style={{ textAlign: 'center' }}>
            Đăng Nhập
          </Title>
          <Text>
            Nếu bạn chưa có tài khoản,{' '}
            <Link to="/register">
              <Text style={{ color: '#3a5c44' }}>Đăng ký ngay!</Text>
            </Link>
          </Text>
          <Form
            name="login"
            initialValues={{ remember: true }}
            layout="vertical"
            onFinish={handleLogin}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
              />
            </Form.Item>
            <Row justify="space-between" align="middle">
              <Col>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Nhớ mật khẩu</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <Link style={{ color: '#3a5c44' }} to="/forgot-password">
                  Quên mật khẩu?
                </Link>
              </Col>
            </Row>
            <Form.Item>
              <Button block type="primary" htmlType="submit" loading={loading}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          <Text>Hoặc đăng nhập bằng</Text>
          <Space
            style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}
          >
            <Button
              icon={<FacebookOutlined />}
              style={{ backgroundColor: '#1877F2', color: '#fff' }}
            >
              Facebook
            </Button>
            <Button
              icon={<GoogleOutlined />}
              style={{ backgroundColor: '#DB4437', color: '#fff' }}
            >
              Google
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  )
}
