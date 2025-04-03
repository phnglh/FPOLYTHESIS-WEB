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
  Radio,
} from 'antd'
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import apiClient from '@store/services/apiClient'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'

const { Title, Text } = Typography

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [user, setUser] = useState(null)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { formatCurrency } = useCurrencyFormatter()

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
          payment_method: 'vnpay',
        })
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error)
      }
    }

    const token = localStorage.getItem('access_token')
    if (token) {
      fetchUserProfile()
    }

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

      // toast.success('Thanh toán thành công!')
      // localStorage.removeItem('checkout_items')
      // localStorage.setItem('orderSuccess', 'true')
      // navigate('/order-success')

      if (values.payment_method === 'vnpay') {
        const paymentUrl = response.data?.data?.payment_url
        if (paymentUrl) {
          window.location.href = paymentUrl
        } else {
          toast.error('Không lấy được URL thanh toán VNPay!')
        }
      } else {
        toast.success('Đặt hàng thành công!')
        localStorage.removeItem('checkout_items')
        navigate('/order-success')
      }
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

          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item label="Email" name="email">
              <Input placeholder="Email" />
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
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea placeholder="Ghi chú cho đơn hàng" />
            </Form.Item>

            <Form.Item
              label="Phương thức thanh toán"
              name="payment_method"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn phương thức thanh toán!',
                },
              ]}
            >
              <Radio.Group>
                <Radio value="vnpay">VNPay</Radio>
                <Radio value="cod">Thanh toán khi nhận hàng</Radio>
              </Radio.Group>
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
                        src={item.image_url}
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
                    <Text strong>{formatCurrency(item.price)}</Text>
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
                    {formatCurrency(totalPrice)}
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
