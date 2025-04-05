import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Radio,
  Space,
  Select,
} from 'antd'
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import apiClient from '@store/services/apiClient'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'

const { Title, Text } = Typography

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [addresses, setAddresses] = useState<any[]>([])
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { formatCurrency } = useCurrencyFormatter()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          toast.error('Vui lòng đăng nhập để tiếp tục.')
          return
        }

        // Lấy thông tin người dùng
        const response = await apiClient.get('/user_addresses', {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        })

        const userData = response.data
        setUser(userData)
        form.setFieldsValue({
          email: userData.email,
          receiver_name: userData.name, // Đặt tên người nhận mặc định từ dữ liệu người dùng
          payment_method: 'vnpay', // Mặc định là VNPay
        })

        // Lấy danh sách địa chỉ của người dùng
        const addressResponse = await apiClient.get('/user_addresses', {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        })

        if (Array.isArray(addressResponse.data)) {
          setAddresses(addressResponse.data)
          if (addressResponse.data.length > 0) {
            const defaultPhone = addressResponse.data[0].receiver_phone // Lấy số điện thoại mặc định từ địa chỉ đầu tiên
            form.setFieldsValue({
              receiver_phone: defaultPhone, // Đặt giá trị cho receiver_phone trong form
            })
          }
        } else {
          console.error('Dữ liệu địa chỉ không phải mảng')
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error)
        toast.error('Lỗi khi lấy thông tin người dùng!')
      }
    }

    const token = localStorage.getItem('access_token')
    if (token) {
      fetchUserProfile()
    }

    const storedItems = localStorage.getItem('checkout_items')
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems)
        setCartItems(parsedItems)
        const total = parsedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        )
        setTotalPrice(total)
      } catch (error) {
        console.error('Lỗi khi phân tích checkout_items:', error)
      }
    }
  }, [form])

  const onFinish = async (values: any) => {
    const checkoutData = {
      selected_sku_ids: cartItems.map((item) => item.sku_id),
      voucher_code: values.voucher_code || '',
      payment_method: values.payment_method,
      new_address: {
        receiver_name: values.receiver_name,
        receiver_phone: values.receiver_phone, // Sử dụng receiver_phone trong checkout data
        address: values.address,
        city: values.city || '',
        state: values.state || '',
        zip_code: values.zip_code || '',
        is_default: true,
      },
    }

    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        toast.error('Vui lòng đăng nhập để tiếp tục.')
        return
      }

      const response = await apiClient.post('/orders/create', checkoutData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (values.payment_method === 'vnpay') {
        const paymentUrl = response.data?.data?.payment_url
        if (paymentUrl) {
          localStorage.removeItem('checkout_items')
          window.location.href = paymentUrl
        } else {
          toast.error('Không lấy được URL thanh toán VNPay!')
        }
      } else {
        toast.success('Đặt hàng thành công!')
        localStorage.removeItem('checkout_items')
        navigate('/order-success')
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!')
    }
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const vnpayStatus = queryParams.get('vnpay_status')

    if (vnpayStatus === 'success') {
      toast.success('Đặt hàng thành công!')
      navigate('/order-success')
    }
  }, [])

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
              <Input placeholder="Email" disabled />
            </Form.Item>
            <Form.Item
              label="Họ và tên"
              name="receiver_name"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input placeholder="Họ và tên" disabled />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="receiver_phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                {
                  pattern: /^0\d{9}$/,
                  message:
                    'Số điện thoại phải bắt đầu bằng 0 và có đủ 10 chữ số!',
                },
              ]}
            >
              <Select placeholder="Chọn số điện thoại đã lưu hoặc nhập số mới">
                {Array.isArray(addresses) &&
                  addresses.length > 0 &&
                  addresses.map((address) => (
                    <Select.Option
                      key={address.id}
                      value={address.receiver_phone}
                    >
                      {address.receiver_phone}
                    </Select.Option>
                  ))}
              </Select>
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
              <Row gutter={[12, 12]} style={{ fontWeight: 'bold' }}>
                <Col span={6}>Ảnh</Col>
                <Col span={6}>Tên sản phẩm</Col>
                <Col span={6}>Số lượng</Col>
                <Col span={6}>Đơn giá</Col>
              </Row>

              {cartItems.map((item, index) => (
                <Row gutter={[12, 12]} align="middle" key={index}>
                  <Col span={6}>
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
                  </Col>

                  <Col span={6}>
                    <Text strong>{item.name}</Text>
                  </Col>

                  <Col span={6}>
                    <Text type="secondary">{item.quantity}</Text>
                  </Col>

                  <Col span={6}>
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
