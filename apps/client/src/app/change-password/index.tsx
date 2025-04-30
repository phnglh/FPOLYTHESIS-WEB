import { useState } from 'react'
import { Form, Input, Button, Card, Typography, Divider } from 'antd'
import { toast } from 'react-toastify'
import apiClient from '@store/services/apiClient'

const { Title } = Typography

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false)

  const changePassword = async (
    current_password: string,
    new_password: string,
    new_password_confirmation: string,
  ) => {
    try {
      const response = await apiClient.post('/change-password', {
        current_password,
        new_password,
        new_password_confirmation,
      })
      toast.success('Password changed successfully!')
    } catch (error) {
      toast.error('Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  const onFinish = (values: any) => {
    setLoading(true)
    const { current_password, new_password, new_password_confirmation } = values
    changePassword(current_password, new_password, new_password_confirmation)
  }

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}
    >
      <Card
        style={{
          width: 450,
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          background: '#fff',
        }}
        title={
          <Title level={2} style={{ textAlign: 'center', color: '#333' }}>
            Đổi mật khẩu
          </Title>
        }
      >
        <Form
          name="change_password"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="current_password"
            rules={[
              {
                required: true,
                message: 'Please input your current password!',
              },
            ]}
          >
            <Input.Password
              placeholder="Nhâp mật khẩu hiện tại"
              style={{
                borderRadius: '8px',
                padding: '10px 15px',
                borderColor: '#d9d9d9',
              }}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="new_password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password
              placeholder="Nhâp mật khẩu mới"
              style={{
                borderRadius: '8px',
                padding: '10px 15px',
                borderColor: '#d9d9d9',
              }}
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="new_password_confirmation"
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error('The two passwords do not match!'),
                  )
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Nhâp lại mật khẩu mới"
              style={{
                borderRadius: '8px',
                padding: '10px 15px',
                borderColor: '#d9d9d9',
              }}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                borderRadius: '8px',
                padding: '20px 10px',
                fontSize: '16px',
              }}
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
        <Divider />
      </Card>
    </div>
  )
}
