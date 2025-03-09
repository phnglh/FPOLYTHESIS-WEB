import { LockOutlined, UserOutlined } from '@ant-design/icons'
import apiClient from '@store/services/apiClient'
import { Button, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

const { Title } = Typography

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const res = await apiClient.post('/login', values)

      const user = res.data.user

      if (user.role !== 'admin') {
        toast.error('Tài khoản không có quyền truy cập!')
        return
      }

      localStorage.setItem('access_token', res.data.access_token)
      localStorage.setItem('user', JSON.stringify(user))

      toast.success('Đăng nhập thành công!')
      navigate('')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại')
    }
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
