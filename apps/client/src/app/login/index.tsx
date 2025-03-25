import { useState } from 'react'
import { Form, Input, Button, Typography, Card, Row, Col } from 'antd'
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

const LoginPage = () => {
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
        <Card style={{ width: '100%', padding: 30 }}>
          <Title level={3} style={{ textAlign: 'center' }}>
            ĐĂNG NHẬP
          </Title>
          <Text
            style={{ display: 'block', textAlign: 'center', marginBottom: 15 }}
          >
            Nếu bạn chưa có tài khoản,{' '}
            <Link to="/register" style={{ color: '#3a5c44' }}>
              đăng ký tại đây
            </Link>
          </Text>
          <Form name="login" layout="vertical" onFinish={handleLogin}>
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
            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ backgroundColor: '#3a5c44', borderColor: '#3a5c44' }}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          <Text
            style={{ display: 'block', textAlign: 'center', marginBottom: 10 }}
          >
            Quên mật khẩu
          </Text>
          <Text
            style={{ display: 'block', textAlign: 'center', marginBottom: 10 }}
          >
            Hoặc đăng nhập bằng
          </Text>
          <Row justify="center" gutter={10}>
            <Col>
              <Button
                icon={<FacebookOutlined />}
                style={{ backgroundColor: '#1877F2', color: '#fff' }}
              >
                Facebook
              </Button>
            </Col>
            <Col>
              <Button
                icon={<GoogleOutlined />}
                style={{ backgroundColor: '#DB4437', color: '#fff' }}
              >
                Google
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default LoginPage
