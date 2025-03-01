import React, { useState } from 'react'
import { Form, Input, Button, Typography } from 'antd'
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const Login = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleLogin = (values: any) => {
    console.log('Đăng nhập với:', values)
  }

  const handleForgotPassword = (values: any) => {
    console.log('Email lấy lại mật khẩu:', values.email)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f8f8f8',
      }}
    >
      <div
        style={{
          width: 400,
          padding: 32,
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <Title level={3}>ĐĂNG NHẬP</Title>
        <Text>
          Nếu bạn chưa có tài khoản,{' '}
          <a href="/register" style={{ color: 'green' }}>
            đăng ký tại đây
          </a>
        </Text>

        <Form
          layout="vertical"
          onFinish={handleLogin}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập Email!' }]}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
          >
            <Input.Password placeholder="Mật khẩu" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', backgroundColor: '#2D5233' }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        <a
          style={{ display: 'block', marginBottom: 10, cursor: 'pointer' }}
          onClick={() => setShowForgotPassword(!showForgotPassword)}
        >
          {showForgotPassword ? 'Đóng lấy lại mật khẩu' : 'Quên mật khẩu?'}
        </a>

        {showForgotPassword && (
          <div
            style={{
              marginTop: 2,
              padding: 15,
              background: '#f5f5f5',
              borderRadius: 5,
            }}
          >
            <Text>Nhập email của bạn để đặt lại mật khẩu.</Text>
            <Form
              layout="vertical"
              onFinish={handleForgotPassword}
              style={{ marginTop: 10 }}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
              >
                <Input placeholder="Nhập email của bạn" size="large" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%' }}
                >
                  Lấy lại mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
        <Text>Hoặc đăng nhập bằng</Text>
        <div
          style={{
            marginTop: 10,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
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
        </div>
      </div>
    </div>
  )
}

export default Login
