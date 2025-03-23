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

const { Title, Text } = Typography

interface CartItem {
  product_id: number
  name: string
  price: number
  quantity: number
  image: string
}

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)

  useEffect(() => {
    const storedItems = localStorage.getItem('checkout_items')
    if (storedItems) {
      const parsedItems: CartItem[] = JSON.parse(storedItems)
      setCartItems(parsedItems)
      const total = parsedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      )
      setTotalPrice(total)
    }
  }, [])

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card variant="borderless" style={{ borderRadius: 8, padding: 16 }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Title level={4}>Thông tin nhận hàng</Title>
            <Button type="link">Đăng nhập</Button>
          </Space>
          <Form layout="vertical">
            <Form.Item label="Email">
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item label="Họ và tên">
              <Input placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item label="Số điện thoại">
              <Input placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item label="Địa chỉ">
              <Input placeholder="Địa chỉ" />
            </Form.Item>
            <Form.Item label="Ghi chú">
              <Input.TextArea placeholder="Ghi chú cho đơn hàng" />
            </Form.Item>
          </Form>
        </Card>

        <Card
          title="Vận chuyển"
          variant="borderless"
          style={{ borderRadius: 8, marginTop: 16 }}
        >
          <Button type="primary" block>
            Nhập thông tin giao hàng
          </Button>
        </Card>

        <Card
          title="Thanh toán"
          bordered={false}
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
          bordered={false}
          style={{ borderRadius: 8, marginTop: 16 }}
        >
          {cartItems.map((item, index) => (
            <Row gutter={[12, 12]} align="middle" key={index}>
              <Col span={6}>
                <Badge count={item.quantity}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Badge>
              </Col>
              <Col span={12}>
                <Text strong>{item.name}</Text>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Text strong>{item.price.toLocaleString()}₫</Text>
              </Col>
            </Row>
          ))}
          <Divider />
          <Form layout="inline" style={{ marginBottom: 16 }}>
            <Form.Item>
              <Input placeholder="Nhập mã giảm giá" />
            </Form.Item>
            <Form.Item>
              <Button type="primary">Áp dụng</Button>
            </Form.Item>
          </Form>
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
