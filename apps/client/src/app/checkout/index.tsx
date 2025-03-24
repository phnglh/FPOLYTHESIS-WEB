import {
  Form,
  Input,
  Button,
  Radio,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Badge,
  Space,
} from 'antd'
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import apiClient from '@store/services/apiClient'

const { Title, Text } = Typography

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [user, setUser] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get('/users/profile')
        setUser(response.data)
        form.setFieldsValue({
          email: response.data.email,
          fullName: response.data.name,
          phone: response.data.phone,
          address: response.data.address,
        })
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error)
      }
    }
    fetchUserProfile()

    const storedItems = localStorage.getItem('checkout_items')
    if (storedItems) {
      let parsedItems = JSON.parse(storedItems)

      parsedItems = parsedItems.map((item) => ({
        ...item,
        image:
          typeof item.image === 'string' ? JSON.parse(item.image) : item.image,
      }))

      setCartItems(parsedItems)
      setTotalPrice(
        parsedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      )
    }
  }, [form])

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card variant="borderless" style={{ borderRadius: 8, padding: 16 }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Title level={4}>Thông tin nhận hàng</Title>
            {!user && <Button type="link">Đăng nhập</Button>}
          </Space>
          <Form layout="vertical" form={form}>
            <Form.Item label="Email" name="email">
              <Input placeholder="Email" disabled={!!user} />
            </Form.Item>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
              ]}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input placeholder="Địa chỉ" />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea placeholder="Ghi chú cho đơn hàng" />
            </Form.Item>
          </Form>
        </Card>

        <Card
          title="Thanh toán"
          variant="borderless"
          style={{ borderRadius: 8, marginTop: 16 }}
        >
          <Radio.Group>
            <Radio value="bank">Chuyển khoản</Radio>
            <Radio value="cod">Thanh toán khi nhận hàng (COD)</Radio>
          </Radio.Group>
        </Card>

        <Card
          title={
            <Title level={5}>
              <ShoppingCartOutlined /> Đơn hàng ({cartItems.length} sản phẩm)
            </Title>
          }
          variant="borderless"
          style={{ borderRadius: 8, marginTop: 16 }}
        >
          {cartItems.map((item, index) => (
            <Row gutter={[12, 12]} align="middle" key={index}>
              <Col span={6}>
                <Badge count={item.quantity}>
                  <img
                    src={item.image[1]}
                    alt={item.sku}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: 8,
                      objectFit: 'cover',
                    }}
                  />
                </Badge>
              </Col>
              <Col span={12}>
                <Text strong>{item.name}</Text>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Text strong>{item.price}₫</Text>
              </Col>
            </Row>
          ))}
          <Divider />
          <Row justify="space-between">
            <Col>
              <Text>Tạm tính</Text>
            </Col>
            <Col>
              <Text strong>{totalPrice.toLocaleString()}₫</Text>
            </Col>
          </Row>
          <Row justify="space-between" style={{ marginTop: 8 }}>
            <Col>
              <Text>Tổng cộng</Text>
            </Col>
            <Col>
              <Title level={3} type="success">
                {totalPrice.toLocaleString()}₫
              </Title>
            </Col>
          </Row>
          <Button type="primary" block style={{ marginTop: 16 }}>
            ĐẶT HÀNG
          </Button>
          <Button
            type="link"
            block
            icon={<ArrowLeftOutlined />}
            style={{ marginTop: 8 }}
          >
            Quay về giỏ hàng
          </Button>
        </Card>
      </Col>
    </Row>
  )
}

export default CheckoutPage
