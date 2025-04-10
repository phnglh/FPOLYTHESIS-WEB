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
} from 'antd'
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import apiClient from '@store/services/apiClient'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'
import { ApiErrorResponse } from '#types/api'
import { CartItem } from '#types/cart'
import { User } from '#types/user'

const { Title, Text } = Typography

const CheckoutPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { formatCurrency } = useCurrencyFormatter()

  const [user, setUser] = useState<User>()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [useDefaultAddress, setUseDefaultAddress] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const token = localStorage.getItem('access_token')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await apiClient.get('/users/profile')
        const userData = userRes.data
        setUser(userData)

        form.setFieldsValue({
          email: userData.email,
          payment_method: 'vnpay',
        })
      } catch (err) {
        console.error('Lỗi khi lấy thông tin người dùng:', err)
      }
    }

    const fetchDefaultAddress = async () => {
      try {
        const addrRes = await apiClient.get('/user-addresses')
        const addresses = addrRes.data?.data || []

        const defaultAddr = addresses.find((addr) => addr.is_default === 1)

        if (defaultAddr) {
          setUseDefaultAddress(true)
          form.setFieldsValue({
            receiver_name: defaultAddr.receiver_name,
            receiver_phone: defaultAddr.receiver_phone,
            address: defaultAddr.address,
            is_default: 1,
          })
        } else {
          setUseDefaultAddress(false)
          form.setFieldsValue({ is_default: 0 })
        }
      } catch (err) {
        console.error('Không có địa chỉ mặc định hoặc lỗi API:', err)
        setUseDefaultAddress(false)
        form.setFieldsValue({ is_default: 0 })
      }
    }

    if (token) {
      fetchUserData()
      fetchDefaultAddress()
    }

    const storedItems = localStorage.getItem('checkout_items')
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems)
        if (parsedItems.length === 0) {
          toast.warning('Giỏ hàng trống, vui lòng thêm sản phẩm!')
          navigate('/cart')
        }
        setCartItems(parsedItems)
        const total = parsedItems.reduce((sum: number, item: CartItem) => {
          const price = Number(item.unit_price)
          return sum + item.quantity * (isNaN(price) ? 0 : price)
        }, 0)
        setTotalPrice(total)
      } catch (err) {
        console.error('Lỗi khi phân tích checkout_items:', err)
      }
    }
  }, [form])

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const vnpayStatus = queryParams.get('vnpay_status')

    if (vnpayStatus === 'success') {
      toast.success('Đặt hàng thành công!')
      navigate('/order-success')
    }
  }, [])

  const onFinish = async (values: any) => {
    setIsSubmitting(true)

    const checkoutData: any = {
      selected_sku_ids: cartItems.map((item) => item.sku_id),
      voucher_code: values.voucher_code || '',
      payment_method: values.payment_method,
      note: values.note || '',
    }

    if (useDefaultAddress) {
      // Lấy danh sách địa chỉ rồi tìm địa chỉ mặc định để lấy ID
      try {
        const res = await apiClient.get('/user-addresses')
        const addresses = res.data?.data || []
        const defaultAddr = addresses.find((addr) => addr.is_default === 1)

        if (defaultAddr) {
          checkoutData.address_id = defaultAddr.id
        } else {
          throw new Error('Không tìm thấy địa chỉ mặc định')
        }
      } catch (err) {
        toast.error('Không lấy được địa chỉ mặc định!')
        setIsSubmitting(false)
        return
      }
    } else {
      // Nếu là địa chỉ mới thì gửi new_address
      checkoutData.new_address = {
        receiver_name: values.receiver_name,
        receiver_phone: values.receiver_phone,
        address: values.address,
        is_default: values.is_default === 1,
      }
    }

    try {
      const res = await apiClient.post('/orders/create', checkoutData)

      if (values.payment_method === 'vnpay') {
        const paymentUrl = res.data?.data?.payment_url
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
    } catch (error: unknown) {
      const errMsg = (error as ApiErrorResponse)?.message
      toast.error(errMsg || 'Đặt hàng thất bại, vui lòng thử lại sau!')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Row gutter={[16, 16]} justify="center">
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card style={{ borderRadius: 8, padding: 16 }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Title level={4}>Thông tin nhận hàng</Title>
            {!user && <Button type="link">Đăng nhập</Button>}
          </Space>

          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="is_default"
              label="Chọn địa chỉ giao hàng"
              rules={[{ required: true }]}
            >
              <Radio.Group
                onChange={(e) => {
                  const isDefault = e.target.value === 1
                  setUseDefaultAddress(isDefault)
                  form.setFieldsValue({ is_default: isDefault ? 1 : 0 })

                  if (isDefault) {
                    apiClient
                      .get('/user-addresses')
                      .then((res) => {
                        const addr = res.data?.data
                        if (addr) {
                          form.setFieldsValue({
                            receiver_name: addr.receiver_name,
                            receiver_phone: addr.receiver_phone,
                            address: addr.address,
                          })
                        }
                      })
                      .catch(() => {
                        toast.error('Không lấy được địa chỉ mặc định!')
                      })
                  } else {
                    form.setFieldsValue({
                      receiver_name: '',
                      receiver_phone: '',
                      address: '',
                    })
                  }
                }}
              >
                <Radio value={1}>Sử dụng địa chỉ đã lưu</Radio>
                <Radio value={0}>Nhập địa chỉ mới</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Họ và tên"
              name="receiver_name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input placeholder="Họ và tên" disabled={useDefaultAddress} />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="receiver_phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                {
                  pattern: /^0\d{9}$/,
                  message: 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số!',
                },
              ]}
            >
              <Input placeholder="Số điện thoại" disabled={useDefaultAddress} />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input placeholder="Địa chỉ" disabled={useDefaultAddress} />
            </Form.Item>

            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea placeholder="Ghi chú cho đơn hàng" />
            </Form.Item>

            <Form.Item
              label="Phương thức thanh toán"
              name="payment_method"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value="vnpay">VNPay</Radio>
                <Radio value="cod">Thanh toán khi nhận hàng</Radio>
              </Radio.Group>
            </Form.Item>

            <Card
              title={
                <Title level={5}>
                  <ShoppingCartOutlined /> Đơn hàng ({cartItems.length} sản
                  phẩm)
                </Title>
              }
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
                      src={item.sku.image_url}
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
                    <Text>{item.quantity}</Text>
                  </Col>
                  <Col span={6}>
                    <Text strong>
                      {formatCurrency(Number(item.unit_price) || 0)}
                    </Text>
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
                  loading={isSubmitting}
                >
                  ĐẶT HÀNG
                </Button>
              </Form.Item>

              <Button
                type="link"
                block
                icon={<ArrowLeftOutlined />}
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
