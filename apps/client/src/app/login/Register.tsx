import React from 'react'
import { Form, Input, Button, Card, Typography } from 'antd'
import { FacebookOutlined, GoogleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const Register = () => {
  const onFinish = (values: any) => {
    console.log('Received values:', values)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        alignItems: 'center',
        background: '#f8f9fa',
      }}
    >
      <Card
        style={{
          width: 400,
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Title level={2} style={{ textAlign: 'center' }}>
          ĐĂNG KÝ
        </Title>
        <Text
          style={{
            display: 'block',
            textAlign: 'center',
            marginBottom: '10px',
          }}
        >
          Đã có tài khoản, <a href="/login">đăng nhập tại đây</a>
        </Text>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="firstName"
            label="Họ"
            rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
          >
            <Input placeholder="Họ" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input placeholder="Tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Vui lòng nhập email hợp lệ',
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ backgroundColor: '#2D6A4F' }}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <Text
          style={{ display: 'block', textAlign: 'center', margin: '10px 0' }}
        >
          Hoặc đăng nhập bằng
        </Text>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button
            icon={<FacebookOutlined />}
            style={{ backgroundColor: '#1877F2', color: 'white' }}
          >
            Facebook
          </Button>
          <Button
            icon={<GoogleOutlined />}
            style={{ backgroundColor: '#DB4437', color: 'white' }}
          >
            Google
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Register
