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
  Modal,
  Tag,
  Checkbox,
  Spin,
  Image,
  Select,
} from 'antd'
import {
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import apiClient from '@store/services/apiClient'
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from 'react-router'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'
import { AppDispatch, RootState } from '@store/store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart, restoreCartFromSession } from '@store/slices/cartSlice'
import { CartItem } from '#types/cart'
import axios from 'axios'

const { Title, Text } = Typography
const { Option } = Select
interface Address {
  id: number
  receiver_name: string
  receiver_phone: string
  address: string
  is_default: number
}

interface District {
  name: string
  code: number
  division_type: string
  codename: string
  province_code: number
}

interface Province {
  name: string
  code: number
  division_type: string
  codename: string
  phone_code: number
  districts: District[]
}

const CheckoutPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const { formatCurrency } = useCurrencyFormatter()
  const { data, loading } = useSelector((state: RootState) => state.cart)
  const cartItems = data?.items || []

  const [selectedItems, setSelectedItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [addressList, setAddressList] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [provinces, setProvinces] = useState<Province[]>([])
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [districts, setDistricts] = useState<District[]>([])
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)

  const token = localStorage.getItem('access_token')

  const fetchProvincesAndDistricts = async () => {
    setIsLoadingProvinces(true)
    try {
      const response = await axios.get<Province[]>(
        'https://provinces.open-api.vn/api/?depth=2',
      )
      setProvinces(response.data)
    } catch (error) {
      console.error('Lỗi khi gọi API tỉnh/huyện:', error)
      toast.error('Không thể tải danh sách tỉnh/thành phố')
    } finally {
      setIsLoadingProvinces(false)
    }
  }

  useEffect(() => {
    fetchProvincesAndDistricts()
  }, [])

  const handleProvinceChange = (provinceCode: string) => {
    setSelectedProvince(provinceCode)
    const selected = provinces.find(
      (province) => province.code === Number(provinceCode),
    )
    setDistricts(selected ? selected.districts : [])
    form.setFieldsValue({ district: undefined })
  }

  useEffect(() => {
    dispatch(restoreCartFromSession())
    dispatch(fetchCart())
      .unwrap()
      .catch((err) =>
        toast.error(`Lỗi khi tải giỏ hàng: ${err?.message || 'Thử lại sau!'}`),
      )
      .finally(() => setIsLoading(false))
  }, [dispatch])

  useEffect(() => {
    if (isLoading || !cartItems) return

    const params = new URLSearchParams(location.search)
    const skuIds = params.get('skus')?.split(',').map(Number) || []

    if (skuIds.length === 0) {
      toast.warning('Không có sản phẩm nào được chọn!')
      navigate('/cart')
      return
    }

    if (cartItems.length === 0) {
      setFetchError('Giỏ hàng trống, vui lòng thêm sản phẩm!')
      return
    }

    const filteredItems = cartItems.filter((item) =>
      skuIds.includes(item.sku_id),
    )
    if (filteredItems.length === 0) {
      setFetchError('Không tìm thấy sản phẩm được chọn trong giỏ hàng!')
      return
    }

    setSelectedItems(filteredItems)
    const total = filteredItems.reduce(
      (sum, item) => sum + item.quantity * (Number(item.unit_price) || 0),
      0,
    )
    setTotalPrice(total)
  }, [cartItems, location.search, navigate, isLoading])

  useEffect(() => {
    if (token) {
      fetchAddresses()
    }
  }, [token])

  //   useEffect(() => {
  //     const queryParams = new URLSearchParams(location.search)
  //     if (queryParams.get('vnpay_status') === 'success') {
  //       toast.success('Đặt hàng thành công!')
  //       navigate('/order-success')
  //     }
  //   }, [navigate, location.search])

  const fetchAddresses = async () => {
    try {
      const response = await apiClient.get('/user-addresses')
      const addresses = response.data?.data || []
      setAddressList(addresses)
      const defaultAddress = addresses.find(
        (addr: Address) => addr.is_default === 1,
      )
      setSelectedAddress(
        defaultAddress || (addresses.length > 0 ? addresses[0] : null),
      )
      form.setFieldsValue({ payment_method: 'cod' })
    } catch (error) {
      toast.error('Không thể tải danh sách địa chỉ')
    }
  }

  const handleAddNewAddress = async (values: any) => {
    try {
      const selectedProvinceData = provinces.find(
        (p) => p.code === Number(values.province),
      )
      const selectedDistrictData = districts.find(
        (d) => d.code === Number(values.district),
      )

      const fullAddress = `${values.address}, ${selectedDistrictData?.name}, ${selectedProvinceData?.name}`
      const response = await apiClient.post('/user-addresses', {
        receiver_name: values.receiver_name,
        receiver_phone: values.receiver_phone,
        address: fullAddress,
        province_code: values.province,
        district_code: values.district,
        is_default: values.is_default || false,
      })
      const newAddress = response.data?.data
      setAddressList([...addressList, newAddress])
      setSelectedAddress(newAddress)
      setIsAddingNewAddress(false)
      setIsModalVisible(false)
      toast.success('Thêm địa chỉ thành công!')
      fetchAddresses()
    } catch (error) {
      toast.error('Không thể thêm địa chỉ mới!')
    }
  }

  const handleUpdateAddress = async (values: any) => {
    if (!editingAddress) return
    try {
      const selectedProvinceData = provinces.find(
        (p) => p.code === Number(values.province),
      )
      const selectedDistrictData = districts.find(
        (d) => d.code === Number(values.district),
      )

      // Gộp địa chỉ
      const fullAddress = `${values.address}, ${selectedDistrictData?.name}, ${selectedProvinceData?.name}`

      const response = await apiClient.put(`/user-addresses/${id}`, {
        receiver_name: values.receiver_name,
        receiver_phone: values.receiver_phone,
        address: fullAddress,
        province_code: values.province,
        district_code: values.district,
        is_default: values.is_default || false,
      })
      const updatedAddress = response.data?.data
      setAddressList(
        addressList.map((addr) =>
          addr.id === updatedAddress.id ? updatedAddress : addr,
        ),
      )
      setSelectedAddress(updatedAddress)
      setIsEditing(false)
      setEditingAddress(null)
      setIsModalVisible(false)
      toast.success('Cập nhật địa chỉ thành công!')
    } catch (error) {
      toast.error('Không thể cập nhật địa chỉ!')
    }
  }

  const onFinish = async (values: any) => {
    setIsSubmitting(true)
    try {
      const checkoutData: any = {
        selected_sku_ids: selectedItems.map((item) => item.sku_id),
        voucher_code: values.voucher_code || '',
        payment_method: values.payment_method,
        note: values.note || '',
        address_id: selectedAddress?.id,
      }

      if (!selectedAddress) {
        throw new Error('Vui lòng chọn địa chỉ giao hàng!')
      }

      const response = await apiClient.post('/orders/create', checkoutData)
      if (values.payment_method === 'vnpay') {
        const paymentUrl = response.data?.data?.payment_url
        if (paymentUrl) {
          window.location.href = paymentUrl
        } else {
          throw new Error('Không lấy được link thanh toán VNPay!')
        }
      } else {
        toast.success('Đặt hàng thành công!')
        const orderId = response.data?.data?.order_id
        const orderNumber = response.data?.data?.order_number
        navigate(
          `/order-status?success=1&id=${orderId}&order_number=${orderNumber}&message=Đặt hàng thành công`,
        )
      }
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi đặt hàng, thử lại sau!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    {
      title: 'Ảnh sản phẩm',
      dataIndex: 'product',
      render: (_: string, record: CartItem) => (
        <Image
          src={record?.sku?.image_url || 'https://via.placeholder.com/60'}
          alt={record?.sku?.sku || 'Sản phẩm'}
          width={100}
          height={100}
          preview={false}
          style={{
            objectFit: 'cover',
            borderRadius: 8,
            border: '1px solid #eee',
          }}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'product_name',
      render: (_: string, record: CartItem) => (
        <Space direction="vertical" size={2}>
          <Text strong style={{ fontSize: 16 }}>
            {record?.product_name || 'Sản phẩm không xác định'}
          </Text>
          <Text type="secondary" style={{ fontSize: 14 }}>
            {record?.sku?.attributes?.length
              ? `Loại: ${record.sku.attributes.map((attr) => attr.value).join(' / ')}`
              : 'Không có thuộc tính'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unit_price',
      render: (price: number) => (
        <Text strong type="danger" style={{ fontSize: 16 }}>
          {formatCurrency(price || 0)}
        </Text>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (quantity: number) => (
        <Text style={{ fontSize: 16 }}>{quantity}</Text>
      ),
    },
    {
      title: 'Thành tiền',
      render: (_: string, record: CartItem) => (
        <Text strong type="danger" style={{ fontSize: 16 }}>
          {formatCurrency((record.unit_price || 0) * (record.quantity || 0))}
        </Text>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f0f2f5',
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: '#f0f2f5',
        padding: '24px 0',
        minHeight: '100vh',
      }}
    >
      <Row gutter={[24, 24]} style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Col xs={24} md={16}>
          <Card
            title={
              <Space>
                <ShoppingCartOutlined
                  style={{ fontSize: 24, color: '#1890ff' }}
                />
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                  Đơn hàng của bạn ({selectedItems.length} sản phẩm)
                </Title>
              </Space>
            }
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              marginBottom: 24,
            }}
          >
            {fetchError ? (
              <Text type="danger" style={{ fontSize: 16 }}>
                {fetchError}
              </Text>
            ) : (
              <Table
                dataSource={selectedItems}
                columns={columns}
                pagination={false}
                rowKey="id"
                loading={loading}
                style={{ marginBottom: 16 }}
              />
            )}

            <Form.Item
              name="voucher_code"
              label="Mã giảm giá"
              style={{ marginBottom: 16 }}
            >
              <Row gutter={8}>
                <Col span={18}>
                  <Input
                    placeholder="Nhập mã voucher"
                    size="large"
                    style={{ borderRadius: 8 }}
                  />
                </Col>
                <Col span={6}>
                  <Button
                    type="primary"
                    block
                    size="large"
                    style={{
                      borderRadius: 8,
                      backgroundColor: '#52c41a',
                      borderColor: '#52c41a',
                    }}
                  >
                    Áp dụng
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Divider style={{ margin: '16px 0' }} />
            <Row justify="space-between" style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 18 }}>
                Tổng cộng:
              </Text>
              <Title level={3} style={{ color: '#ff4d4f', margin: 0 }}>
                {formatCurrency(totalPrice)}
              </Title>
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            title={
              <Space>
                <EnvironmentOutlined style={{ fontSize: 24 }} />
                <Title level={4} style={{ margin: 0 }}>
                  Thông tin giao hàng
                </Title>
              </Space>
            }
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              marginBottom: 24,
            }}
          >
            {addressList.length === 0 ? (
              <Button
                block
                icon={<PlusOutlined />}
                onClick={() => {
                  setIsAddingNewAddress(true)
                  setIsModalVisible(true)
                }}
                style={{ borderRadius: 8 }}
              >
                Thêm địa chỉ giao hàng
              </Button>
            ) : (
              <Row align="middle" justify="space-between" gutter={[16, 8]}>
                <Col flex="auto">
                  {selectedAddress ? (
                    <Space direction="vertical" size={4}>
                      <Space>
                        <Text strong style={{ fontSize: 16 }}>
                          {selectedAddress.receiver_name}
                        </Text>
                        <Text style={{ fontSize: 16 }}>
                          ({selectedAddress.receiver_phone})
                        </Text>
                      </Space>
                      <Space>
                        <Text style={{ fontSize: 16 }}>
                          {selectedAddress.address}
                        </Text>
                        {selectedAddress.is_default === 1 && (
                          <Tag
                            color="blue"
                            style={{ fontSize: 14, padding: '2px 8px' }}
                          >
                            Mặc định
                          </Tag>
                        )}
                      </Space>
                    </Space>
                  ) : (
                    <Text style={{ fontSize: 16 }}>
                      Vui lòng chọn địa chỉ giao hàng
                    </Text>
                  )}
                </Col>
                <Col>
                  <Button
                    type="link"
                    onClick={() => setIsModalVisible(true)}
                    style={{ fontSize: 16, color: '#1890ff' }}
                  >
                    {selectedAddress ? 'Thay đổi' : 'Chọn địa chỉ'}
                  </Button>
                </Col>
              </Row>
            )}
          </Card>

          <Card
            title={
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                Phương thức thanh toán
              </Title>
            }
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <Form layout="vertical" form={form} onFinish={onFinish}>
              <Form.Item
                name="payment_method"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn phương thức thanh toán',
                  },
                ]}
              >
                <Radio.Group style={{ width: '100%' }}>
                  <Radio value="cod" style={{ fontSize: 16, marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>
                        Thanh toán khi nhận hàng
                      </span>
                      <img
                        src="https://vantaithanhphat.vn/wp-content/uploads/2022/04/ship-cod-la-gi.jpg"
                        alt="COD Icon"
                        style={{ width: 50, height: 50 }}
                      />
                    </div>
                  </Radio>
                  <Radio value="vnpay" style={{ fontSize: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 8 }}>
                        Thanh toán bằng VNPay
                      </span>
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s"
                        alt="VNPay Icon"
                        style={{ width: 50, height: 50 }}
                      />
                    </div>
                  </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={isSubmitting}
                  disabled={
                    selectedItems.length === 0 ||
                    fetchError !== null ||
                    !selectedAddress
                  }
                  style={{
                    borderRadius: 8,
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    fontSize: 16,
                    height: 48,
                  }}
                  icon={<CheckCircleOutlined />}
                >
                  ĐẶT HÀNG
                </Button>
              </Form.Item>

              <Button
                type="link"
                block
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/carts')}
                style={{ fontSize: 16, color: '#1890ff' }}
              >
                Quay lại giỏ hàng
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            {isAddingNewAddress || isEditing
              ? 'Thêm địa chỉ mới'
              : 'Địa chỉ của tôi'}
          </Title>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setIsAddingNewAddress(false)
          setIsEditing(false)
          setEditingAddress(null)
        }}
        footer={null}
        style={{ borderRadius: 12 }}
      >
        {isAddingNewAddress || isEditing ? (
          <Form
            layout="vertical"
            onFinish={isEditing ? handleUpdateAddress : handleAddNewAddress}
            initialValues={editingAddress || {}}
          >
            <Form.Item
              label="Tên người nhận"
              name="receiver_name"
              rules={[{ required: true, message: 'Nhập tên người nhận' }]}
            >
              <Input size="large" style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="receiver_phone"
              rules={[{ required: true, message: 'Nhập số điện thoại' }]}
            >
              <Input size="large" style={{ borderRadius: 8 }} />
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
                size="large"
                onChange={handleProvinceChange}
                loading={isLoadingProvinces}
                style={{ borderRadius: 8 }}
              >
                {provinces.map((province) => (
                  <Option key={province.code} value={province.code}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Quận/Huyện"
              name="district"
              rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
            >
              <Select
                placeholder="Chọn quận/huyện"
                size="large"
                disabled={!selectedProvince}
                style={{ borderRadius: 8 }}
              >
                {districts.map((district) => (
                  <Option key={district.code} value={district.code}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Địa chỉ chi tiết"
              name="address"
              rules={[{ required: true, message: 'Nhập địa chỉ chi tiết' }]}
            >
              <Input.TextArea rows={3} style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item name="is_default" valuePropName="checked">
              <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
            </Form.Item>
            <Form.Item>
              <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => {
                    setIsAddingNewAddress(false)
                    setIsEditing(false)
                    setEditingAddress(null)
                  }}
                  style={{ borderRadius: 8 }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ borderRadius: 8 }}
                >
                  Lưu
                </Button>
              </Space>
            </Form.Item>
          </Form>
        ) : (
          <>
            {addressList.length === 0 ? (
              <Text style={{ fontSize: 16 }}>Chưa có địa chỉ nào</Text>
            ) : (
              <Radio.Group
                value={selectedAddress?.id}
                onChange={(e) => {
                  const addr = addressList.find((a) => a.id === e.target.value)
                  setSelectedAddress(addr || null)
                }}
                style={{ width: '100%' }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {addressList.map((addr) => (
                    <Space
                      key={addr.id}
                      direction="horizontal"
                      align="start"
                      style={{
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: 12,
                        borderBottom: '1px solid #f0f0f0',
                        borderRadius: 8,
                        backgroundColor:
                          selectedAddress?.id === addr.id
                            ? '#e6f7ff'
                            : 'transparent',
                      }}
                    >
                      <Radio value={addr.id} style={{ flex: 1 }}>
                        <Space direction="vertical" size={4}>
                          <Text strong style={{ fontSize: 16 }}>
                            {addr.receiver_name}{' '}
                            <Text type="secondary">
                              ({addr.receiver_phone})
                            </Text>
                          </Text>
                          <Space
                            direction="horizontal"
                            size="small"
                            align="center"
                          >
                            <Text style={{ fontSize: 16 }}>{addr.address}</Text>
                            {addr.is_default === 1 && (
                              <Tag color="blue" style={{ fontSize: 14 }}>
                                Mặc định
                              </Tag>
                            )}
                          </Space>
                        </Space>
                      </Radio>
                      <Button
                        type="link"
                        onClick={() => {
                          setIsEditing(true)
                          setEditingAddress(addr)
                          setIsAddingNewAddress(true)
                        }}
                        style={{ fontSize: 16 }}
                      >
                        Cập nhật
                      </Button>
                    </Space>
                  ))}
                </Space>
              </Radio.Group>
            )}

            <Divider />
            <Button
              block
              icon={<PlusOutlined />}
              onClick={() => setIsAddingNewAddress(true)}
              style={{ borderRadius: 8, marginBottom: 16 }}
            >
              Thêm địa chỉ mới
            </Button>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => setIsModalVisible(false)}
                style={{ borderRadius: 8 }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                onClick={() => setIsModalVisible(false)}
                disabled={!selectedAddress}
                style={{ borderRadius: 8 }}
              >
                Xác nhận
              </Button>
            </Space>
          </>
        )}
      </Modal>
    </div>
  )
}

export default CheckoutPage
