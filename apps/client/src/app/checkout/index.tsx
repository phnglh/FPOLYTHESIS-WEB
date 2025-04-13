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
  Table,
  Checkbox,
  Select,
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

  const [user, setUser] = useState<User | undefined>()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [useDefaultAddress, setUseDefaultAddress] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [selectedProvince, setSelectedProvince] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)

  const token = localStorage.getItem('access_token')

  // Fetch user data and default address
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await apiClient.get('/users/profile')
        setUser(userRes.data)
        form.setFieldsValue({
          email: userRes.data.email,
          payment_method: 'vnpay',
        })
      } catch (err) {
        console.error('Error fetching user data:', err)
      }
    }

    const fetchDefaultAddress = async () => {
      try {
        const addrRes = await apiClient.get('/user-addresses')
        const defaultAddr = addrRes.data?.data?.find(
          (addr: any) => addr.is_default === 1,
        )

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
        }
      } catch (err) {
        console.error('Error fetching default address:', err)
        setUseDefaultAddress(false)
      }
    }

    const fetchProvinces = async () => {
      try {
        const provincesRes = await apiClient.get(
          'https://esgoo.net/api-tinhthanh/1/0.htm',
        )
        setProvinces(provincesRes.data)
      } catch (err) {
        console.error('Error fetching provinces:', err)
      }
    }

    const handleProvinceChange = async (provinceId: number) => {
      setSelectedProvince(provinceId)
      try {
        const districtRes = await apiClient.get(
          `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`,
        )
        setDistricts(districtRes.data)
        setWards([]) // Reset wards when province changes
        form.setFieldsValue({ district: undefined }) // Clear district field
      } catch (err) {
        console.error('Error fetching districts:', err)
      }
    }

    if (token) {
      fetchUserData()
      fetchDefaultAddress()
      fetchProvinces()
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
        const total = parsedItems.reduce(
          (sum: number, item: CartItem) =>
            sum + item.quantity * item.unit_price,
          0,
        )
        setTotalPrice(total)
      } catch (err) {
        console.error('Error parsing cart items:', err)
      }
    }
  }, [form, navigate, token])

  // Handle province change
  const handleProvinceChange = async (provinceId: number) => {
    setSelectedProvince(provinceId)
    try {
      const districtRes = await apiClient.get(
        `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`,
      )
      setDistricts(districtRes.data)
      setWards([])
    } catch (err) {
      console.error('Error fetching districts:', err)
    }
  }

  // Handle district change
  const handleDistrictChange = async (districtId: number) => {
    setSelectedDistrict(districtId)
    try {
      const wardRes = await apiClient.get(
        `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`,
      )
      setWards(wardRes.data)
    } catch (err) {
      console.error('Error fetching wards:', err)
    }
  }

  const onFinish = async (values: any) => {
    setIsSubmitting(true)
    const checkoutData: any = {
      selected_sku_ids: cartItems.map((item) => item.sku_id),
      voucher_code: values.voucher_code || '',
      payment_method: values.payment_method,
      note: values.note || '',
    }

    if (useDefaultAddress) {
      try {
        const addrRes = await apiClient.get('/user-addresses')
        const defaultAddr = addrRes.data?.data?.find(
          (addr: any) => addr.is_default === 1,
        )
        if (defaultAddr) {
          checkoutData.address_id = defaultAddr.id
        } else {
          throw new Error('No default address found')
        }
      } catch (err) {
        toast.error('Failed to fetch default address!')
        setIsSubmitting(false)
        return
      }
    } else {
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
          toast.error('Failed to get VNPay payment URL!')
        }
      } else {
        toast.success('Order placed successfully!')
        localStorage.removeItem('checkout_items')
        navigate('/order-success')
      }
    } catch (error: unknown) {
      const errMsg = (error as ApiErrorResponse)?.message
      toast.error(errMsg || 'Failed to place order, please try again later!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (_: any, record: CartItem) => (
        <img
          src={record.sku.image_url}
          alt={record.name}
          style={{
            width: 60,
            height: 60,
            objectFit: 'cover',
            borderRadius: 8,
            border: '1px solid #eee',
          }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: CartItem) => <strong>{record.name}</strong>,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Màu sắc,Size',
      key: 'color_size',
      render: (_: any, record: CartItem) => (
        <span>
          {record.sku.color || 'Không có'} - {record.sku.size || 'Không có'}
        </span>
      ),
    },
  ]
  const handleUpdateAddress = async () => {
    try {
      const values = await form.validateFields([
        'receiver_name',
        'receiver_phone',
        'address',
        'is_default',
        'province',
        'district',
      ])

      const newAddress = {
        receiver_name: values.receiver_name,
        receiver_phone: values.receiver_phone,
        address: values.address,
        is_default: values.is_default ? 1 : 0,
        province_id: values.province,
        district_id: values.district,
      }

      await apiClient.post('/user-addresses', newAddress)
      toast.success('Đã cập nhật địa chỉ thành công!')
      setUseDefaultAddress(true)
    } catch (err) {
      console.error(err)
      toast.error('Cập nhật địa chỉ thất bại!')
    }
  }

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Row gutter={24} justify="center">
        <Col xs={24} md={18}>
          {/* Địa chỉ nhận hàng */}
          <Card title="Địa chỉ nhận hàng" bordered={false} className="mb-4">
            {useDefaultAddress &&
            user &&
            form.getFieldValue('is_default') === 1 ? (
              <div style={{ marginBottom: 16 }}>
                <Text strong>{user.email}</Text>
                <br />
                <Text strong>
                  {form.getFieldValue('receiver_name')} (+84){' '}
                  {form.getFieldValue('receiver_phone')}
                </Text>
                <br />
                <Text>{form.getFieldValue('address')}</Text>
                <br />
                <span
                  style={{
                    display: 'inline-block',
                    border: '1px solid #ff4d4f',
                    padding: '2px 6px',
                    color: '#ff4d4f',
                    borderRadius: 4,
                    fontSize: 12,
                    marginRight: 8,
                  }}
                >
                  Mặc Định
                </span>
                <Button
                  type="link"
                  onClick={() => setUseDefaultAddress(false)}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: '#52c41a', // màu green
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 14,
                    border: '1px solid #52c41a',
                    borderRadius: 4,
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.target as HTMLElement).style.backgroundColor = '#389e0d' // hover darker green
                  }}
                  onMouseLeave={(e) => {
                    ;(e.target as HTMLElement).style.backgroundColor = '#52c41a'
                  }}
                >
                  Thay Đổi
                </Button>
              </div>
            ) : (
              <>
                <Form.Item label="Email" name="email">
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="Họ và tên"
                  name="receiver_name"
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
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
                  label="Tỉnh/Thành phố"
                  name="province"
                  rules={[
                    { required: true, message: 'Vui lòng chọn tỉnh/thành phố' },
                  ]}
                >
                  <Select
                    placeholder="Chọn tỉnh/thành phố"
                    onChange={handleProvinceChange}
                    value={selectedProvince}
                  >
                    {provinces.map((province) => (
                      <Select.Option key={province.id} value={province.id}>
                        {province.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Quận/Huyện"
                  name="district"
                  rules={[
                    { required: true, message: 'Vui lòng chọn quận/huyện' },
                  ]}
                >
                  <Select
                    placeholder="Chọn quận/huyện"
                    onChange={handleDistrictChange}
                    value={selectedDistrict}
                    disabled={!selectedProvince}
                  >
                    {districts.map((district) => (
                      <Select.Option key={district.id} value={district.id}>
                        {district.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Địa chỉ cụ thể"
                  name="address"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                  <Input placeholder="Địa chỉ" />
                </Form.Item>
                <Form.Item name="is_default" valuePropName="checked">
                  <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
                </Form.Item>
                <Form.Item label="Ghi chú" name="note">
                  <Input.TextArea placeholder="Ghi chú cho đơn hàng" />
                </Form.Item>
                {!useDefaultAddress && (
                  <Row justify="end" gutter={12}>
                    <Col>
                      <Button
                        onClick={() => setUseDefaultAddress(true)}
                        style={{
                          backgroundColor: '#fff',
                          color: '#ff4d4f',
                          border: '1px solid #ff4d4f',
                          fontWeight: 'bold',
                          borderRadius: 4,
                        }}
                        onMouseEnter={(e) => {
                          ;(e.target as HTMLElement).style.backgroundColor =
                            '#fff1f0'
                        }}
                        onMouseLeave={(e) => {
                          ;(e.target as HTMLElement).style.backgroundColor =
                            '#fff'
                        }}
                      >
                        Huỷ
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="primary"
                        onClick={handleUpdateAddress}
                        style={{
                          backgroundColor: '#1890ff',
                          borderColor: '#1890ff',
                          fontWeight: 'bold',
                        }}
                      >
                        Cập nhật
                      </Button>
                    </Col>
                  </Row>
                )}
              </>
            )}
          </Card>

          {/* Đơn hàng */}
          <Card
            title={
              <Space>
                <ShoppingCartOutlined />
                <Title level={5} style={{ margin: 0 }}>
                  Đơn hàng ({cartItems.length} sản phẩm)
                </Title>
              </Space>
            }
            bordered={false}
          >
            <Table
              dataSource={cartItems}
              columns={columns}
              pagination={false}
              rowKey={(record) => `${record.sku_id}`}
            />
            <Form.Item name="voucher_code" label="Voucher">
              <Row gutter={8}>
                <Col span={16}>
                  <Input placeholder="Nhập mã voucher" />
                </Col>
                <Col span={8}>
                  <Button type="primary" block onClick={() => {}}>
                    Áp dụng
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Divider />

            <Row justify="space-between">
              <Text strong>Tổng cộng</Text>
              <Title level={4} type="success">
                {formatCurrency(totalPrice)}
              </Title>
            </Row>

            <Form.Item
              label="Phương thức thanh toán"
              name="payment_method"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value="vnpay">
                  <Space
                    style={{ justifyContent: 'space-between', width: '100%' }}
                  >
                    <span>VNPay</span>
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s"
                      alt="VNPay"
                      style={{ width: 30, height: 30 }}
                    />
                  </Space>
                </Radio>
                <br />
                <Radio value="cod">
                  <Space
                    style={{ justifyContent: 'space-between', width: '100%' }}
                  >
                    <span>Thanh toán khi nhận hàng</span>
                    <img
                      src="https://drive.gianhangvn.com/image/thanh-toan-khi-nhan-hang-2135165j32025.jpg"
                      alt="COD"
                      style={{ width: 30, height: 30 }}
                    />
                  </Space>
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item className="mt-4">
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
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
        </Col>
      </Row>
    </Form>
  )
}

export default CheckoutPage
