import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Badge,
  Space,
  Select,
} from 'antd'
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import apiClient from '@store/services/apiClient'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

const { Title, Text } = Typography

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [user, setUser] = useState(null)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get('/users/profile')
        setUser(response.data)
        form.setFieldsValue({
          email: response.data.email,
          receiver_name: response.data.name,
          receiver_phone: response.data.phone,
          address: response.data.address,
          payment_method: 'vnpay', // Mặc định chọn VNPay
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

  const onFinish = async (values) => {
    const checkoutData = {
      selected_sku_ids: cartItems.map((item) => item.sku_id),
      voucher_code: values.voucher_code || '',
      payment_method: values.payment_method,
      new_address: {
        receiver_name: values.receiver_name,
        receiver_phone: values.receiver_phone,
        address: values.address,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        is_default: true,
      },
    }

    try {
      const response = await apiClient.post('/orders/create', checkoutData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      toast.success('Thanh toán thành công!')
      localStorage.removeItem('checkout_items') // Xóa giỏ hàng sau khi checkout
      navigate('/order-success')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!')
    }
  }

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card variant="borderless" style={{ borderRadius: 8, padding: 16 }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Title level={4}>Thông tin nhận hàng</Title>
            {!user && <Button type="link">Đăng nhập</Button>}
          </Space>

          {/* GỘP FORM CHUNG */}
          <Form layout="vertical" form={form} onFinish={onFinish}>
            {/* Thông tin người nhận */}
            <Form.Item label="Email" name="email">
              <Input placeholder="Email" disabled />
            </Form.Item>
            <Form.Item
              label="Họ và tên"
              name="receiver_name"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="receiver_phone"
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
            <Form.Item label="Thành phố" name="city">
              <Input placeholder="Thành phố" />
            </Form.Item>
            <Form.Item label="Quận/Huyện" name="state">
              <Input placeholder="Quận/Huyện" />
            </Form.Item>
            <Form.Item label="Mã bưu điện" name="zip_code">
              <Input placeholder="Mã bưu điện" />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea placeholder="Ghi chú cho đơn hàng" />
            </Form.Item>

            {/* Phương thức thanh toán */}
            <Form.Item
              label="Phương thức thanh toán"
              name="payment_method"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="vnpay">VNPay</Select.Option>
                <Select.Option value="cod">
                  Thanh toán khi nhận hàng
                </Select.Option>
              </Select>
            </Form.Item>

            {/* Thông tin đơn hàng */}
            <Card
              title={
                <Title level={5}>
                  <ShoppingCartOutlined /> Đơn hàng ({cartItems.length} sản
                  phẩm)
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
                  <Text>Tổng cộng</Text>
                </Col>
                <Col>
                  <Title level={3} type="success">
                    {totalPrice.toLocaleString()}₫
                  </Title>
                </Col>
              </Row>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  style={{ marginTop: 16 }}
                >
                  ĐẶT HÀNG
                </Button>
              </Form.Item>
              <Button
                type="link"
                block
                icon={<ArrowLeftOutlined />}
                style={{ marginTop: 8 }}
                onClick={() => navigate('/cart')}
              >
                Quay về giỏ hàng
              </Button>
            </Card>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default CheckoutPage
