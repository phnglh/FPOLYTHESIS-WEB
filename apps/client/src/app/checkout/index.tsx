/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { ApiErrorResponse } from '#types/api'
import { CartItem } from '#types/cart'

const { Title, Text } = Typography

const CheckoutPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const { formatCurrency } = useCurrencyFormatter()
  const { data, loading } = useSelector((state: RootState) => state.cart)
  const cartItemsFromRedux = data?.items || []

  const [selectedItems, setSelectedItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [useDefaultAddress, setUseDefaultAddress] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [addressList, setAddressList] = useState<any[]>([])
  const [currentAddress, setCurrentAddress] = useState<any>(null)
  const [selectedAddressId, setSelectedAddressId] = useState<number>()
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const token = localStorage.getItem('access_token')

  // useEffect để kiểm tra token và khôi phục giỏ hàng từ sessionStorage
  useEffect(() => {
    if (!token) {
      toast.error('Vui lòng đăng nhập để thanh toán!')
      navigate('/login')
      return
    }

    // Khôi phục giỏ hàng từ sessionStorage
    dispatch(restoreCartFromSession())

    // Gọi API để lấy giỏ hàng
    dispatch(fetchCart())
      .unwrap()
      .catch((err) => {
        toast.error(
          `Lỗi khi tải giỏ hàng từ server: ${err?.message || 'Thử lại sau!'}`,
        )
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [dispatch, navigate, token])

  // useEffect để xử lý logic chọn sản phẩm từ giỏ hàng sau khi Redux store được cập nhật
  useEffect(() => {
    if (isLoading) return // Đợi đến khi dữ liệu được tải xong

    const params = new URLSearchParams(location.search)
    const skuIds = params.get('skus')?.split(',').map(Number) || []

    if (skuIds.length === 0) {
      toast.warning('Không có sản phẩm nào được chọn!')
      navigate('/cart')
      return
    }

    // Kiểm tra cartItemsFromRedux sau khi Redux store được cập nhật
    if (!cartItemsFromRedux || cartItemsFromRedux.length === 0) {
      setFetchError('Giỏ hàng trống, vui lòng thêm sản phẩm!')
      return
    }

    const filteredItems = cartItemsFromRedux.filter((item) =>
      skuIds.includes(item.sku_id),
    )
    if (filteredItems.length === 0) {
      setFetchError('Không tìm thấy sản phẩm được chọn trong giỏ hàng!')
      return
    }

    setSelectedItems(filteredItems)
    const total = filteredItems.reduce((sum, item) => {
      const price = Number(item.unit_price)
      return sum + item.quantity * (isNaN(price) ? 0 : price)
    }, 0)
    setTotalPrice(total)
  }, [cartItemsFromRedux, location.search, navigate, isLoading])

  const fetchUserAndAddresses = async () => {
    try {
      const addrRes = await apiClient.get('/user-addresses')
      const addresses = addrRes.data?.data || []
      const defaultAddr = addresses.find((addr: any) => addr.is_default === 1)
      setAddressList(addresses)
      setCurrentAddress(defaultAddr)
      setSelectedAddressId(defaultAddr?.id)
      form.setFieldsValue({
        payment_method: 'cod',
      })
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    if (token) {
      fetchUserAndAddresses()
    }
  }, [form, token])

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const vnpayStatus = queryParams.get('vnpay_status')

    if (vnpayStatus === 'success') {
      toast.success('Đặt hàng thành công!')
      navigate('/order-success')
    }
  }, [navigate, location.search])

  const handleOpenModal = async () => {
    try {
      const res = await apiClient.get('/user-addresses')
      setAddressList(res.data?.data || [])
      setIsModalVisible(true)
    } catch (err) {
      toast.error('Không thể lấy danh sách địa chỉ')
    }
  }

  const handleConfirmAddress = () => {
    const addr = addressList.find((a) => a.id === selectedAddressId)
    if (addr) {
      setCurrentAddress(addr)
      setUseDefaultAddress(true)
      setIsModalVisible(false)
    }
  }

  const handleAddNewAddress = async (values: any) => {
    setIsAdding(true)
    console.log('Submitting address with values:', values)

    try {
      const res = await apiClient.post('/user-addresses', {
        ...values,
      })
      const newAddr = res.data?.data
      if (newAddr) {
        toast.success('Thêm địa chỉ thành công!')
        const updatedList = [...addressList, newAddr]
        setAddressList(updatedList)
        setSelectedAddressId(newAddr.id)
        setCurrentAddress(newAddr)
        setUseDefaultAddress(false)
        setIsAddingNewAddress(false)
        fetchUserAndAddresses()
      }
    } catch (err) {
      toast.error('Không thể thêm địa chỉ mới!')
    } finally {
      setIsAdding(false)
    }
  }

  const updateAddressAPI = async (id: number, values: any) => {
    try {
      const res = await apiClient.put(`/user-addresses/${id}`, {
        ...values,
      })
      const updatedAddr = res.data?.data
      if (updatedAddr) {
        toast.success('Cập nhật địa chỉ thành công!')
        const updatedList = addressList.map((addr) =>
          addr.id === id ? updatedAddr : addr,
        )
        setAddressList(updatedList)
        setSelectedAddressId(updatedAddr.id)
        setCurrentAddress(updatedAddr)
        setUseDefaultAddress(false)
        setIsAddingNewAddress(false)
        setIsEditing(false)
        setEditingAddress(null)
      }
    } catch (err) {
      toast.error('Không thể cập nhật địa chỉ!')
    } finally {
      setIsAdding(false)
    }
  }

  const handleUpdateAddress = async (values: any) => {
    try {
      setIsAdding(true)
      await updateAddressAPI(editingAddress.id, values)
      toast.success('Cập nhật địa chỉ thành công!')
      setIsModalVisible(false)
      setIsAddingNewAddress(false)
      setIsEditing(false)
      setEditingAddress(null)
    } catch (err) {
      toast.error('Có lỗi xảy ra!')
    } finally {
      setIsAdding(false)
    }
  }

  const onFinish = async (values: any) => {
    setIsSubmitting(true)
    const checkoutData: any = {
      selected_sku_ids: selectedItems.map((item) => item.sku_id),
      voucher_code: values.voucher_code || '',
      payment_method: values.payment_method,
      note: values.note || '',
    }

    try {
      if (useDefaultAddress && currentAddress) {
        checkoutData.address_id = currentAddress.id
      } else if (currentAddress) {
        checkoutData.new_address = {
          receiver_name: currentAddress.receiver_name,
          receiver_phone: currentAddress.receiver_phone,
          address: currentAddress.address,
          is_default: false,
        }
      } else {
        throw new Error('Không có địa chỉ giao hàng!')
      }

      const res = await apiClient.post('/orders/create', checkoutData)
      if (values.payment_method === 'vnpay') {
        const paymentUrl = res.data?.data?.payment_url
        if (paymentUrl) {
          window.location.href = paymentUrl
        } else {
          toast.error('Không lấy được link thanh toán VNPay!')
        }
      } else {
        toast.success('Đặt hàng thành công!')
        navigate('/order-success')
      }
    } catch (error) {
      const errMsg = (error as ApiErrorResponse)?.message
      toast.error(errMsg || 'Lỗi khi đặt hàng, thử lại sau!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    {
      title: 'Ảnh sản phẩm',
      dataIndex: 'product',
      key: 'product',
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
          {record?.sku?.attributes && record.sku.attributes.length > 0 ? (
            <Text type="secondary" style={{ fontSize: 14 }}>
              Loại:{' '}
              {record.sku.attributes.map((attr) => attr.value).join(' / ')}
            </Text>
          ) : (
            <Text type="secondary" style={{ fontSize: 14 }}>
              Không có thuộc tính
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price: number) => (
        <Text strong type="danger" style={{ fontSize: 16 }}>
          {formatCurrency(price || 0)}
        </Text>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => (
        <Text style={{ fontSize: 16 }}>{quantity}</Text>
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
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
        {/* Cột bên trái: Thông tin đơn hàng */}
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
                rowClassName={() => 'ant-table-row-custom'}
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

        {/* Cột bên phải: Thông tin giao hàng và thanh toán */}
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
            {currentAddress ? (
              <Row align="middle" justify="space-between" gutter={[16, 8]}>
                {/* Cột trái: Thông tin người nhận */}
                <Col flex="auto">
                  <Space direction="vertical" size={4}>
                    {/* Hàng 1: Tên + SĐT */}
                    <Space>
                      <Text strong style={{ fontSize: 16 }}>
                        {currentAddress.receiver_name}
                      </Text>
                      <Text style={{ fontSize: 16 }}>
                        ({currentAddress.receiver_phone})
                      </Text>
                    </Space>

                    {/* Hàng 2: Địa chỉ + Tag */}
                    <Space>
                      <Text style={{ fontSize: 16 }}>
                        {currentAddress.address}
                      </Text>
                      {Boolean(currentAddress.is_default) && (
                        <Tag
                          color="blue"
                          style={{ fontSize: 14, padding: '2px 8px' }}
                        >
                          Mặc định
                        </Tag>
                      )}
                    </Space>
                  </Space>
                </Col>

                {/* Cột phải: Button Thay đổi */}
                <Col>
                  <Button
                    type="link"
                    onClick={handleOpenModal}
                    style={{ fontSize: 16, color: '#1890ff' }}
                  >
                    Thay đổi
                  </Button>
                </Col>
              </Row>
            ) : (
              <Text type="danger" style={{ fontSize: 16 }}>
                Chưa có địa chỉ giao hàng
              </Text>
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
            headStyle={{ borderBottom: '2px solid #e8e8e8' }}
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
                  <br />
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
                  disabled={selectedItems.length === 0 || fetchError !== null}
                  style={{
                    borderRadius: 8,
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    fontSize: 16,
                    height: 48,
                    transition: 'all 0.3s',
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

      {/* Modal chọn địa chỉ */}
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
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Nhập địa chỉ' }]}
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
                  loading={isAdding}
                  style={{ borderRadius: 8 }}
                >
                  Lưu
                </Button>
              </Space>
            </Form.Item>
          </Form>
        ) : (
          <>
            <Radio.Group
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
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
                        selectedAddressId === addr.id
                          ? '#e6f7ff'
                          : 'transparent',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <Radio value={addr.id} style={{ flex: 1 }}>
                      <Space direction="vertical" size={4}>
                        <Text strong style={{ fontSize: 16 }}>
                          {addr.receiver_name}{' '}
                          <Text type="secondary" style={{ fontSize: 16 }}>
                            ({addr.receiver_phone})
                          </Text>
                        </Text>
                        <Space
                          direction="horizontal"
                          size="small"
                          align="center"
                        >
                          <Text style={{ fontSize: 16 }}>{addr.address}</Text>
                          {Boolean(addr.is_default) && (
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
                        setIsModalVisible(true)
                        setIsAddingNewAddress(true)
                        setIsEditing(true)
                        setEditingAddress(addr)
                      }}
                      style={{ fontSize: 16 }}
                    >
                      Cập nhật
                    </Button>
                  </Space>
                ))}
              </Space>
            </Radio.Group>

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
                onClick={handleConfirmAddress}
                disabled={!selectedAddressId}
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
