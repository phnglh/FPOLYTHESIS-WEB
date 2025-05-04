import { Login } from '#types/auth'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { login } from '@store/slices/authSlice'
import { AppDispatch, RootState } from '@store/store'
import { Button, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import { toast } from 'react-toastify'

const { Title } = Typography

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
        toast.error('Đăng nhập thất bại!')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (user && user.role === 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Title level={3} className="text-center">
          Đăng nhập quản trị
        </Title>
        <Form
          name="admin-login"
          onFinish={handleLogin}
          layout="vertical"
          initialValues={{
            email: 'admin@gmail.com',
            password: '123456789@',
          }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="admin@gmail.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
