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
} from 'antd'
import {
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  EnvironmentOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import apiClient from '@store/services/apiClient'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'
import { ApiErrorResponse } from '#types/api'
import { CartItem } from '#types/cart'

const { Title, Text } = Typography

const CheckoutPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { formatCurrency } = useCurrencyFormatter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
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
  const [hasCartItems, setHasCartItems] = useState(true)

  const token = localStorage.getItem('access_token')

  const fetchCartFromDB = async () => {
    try {
      const res = await apiClient.get('/cart')
      const cart = res.data?.data

      const allItems = cart?.items || []

      if (allItems.length === 0) {
        setHasCartItems(false)
        toast.warning('Giỏ hàng trống, vui lòng thêm sản phẩm!')
        return navigate('/products')
      }

      setCartItems(allItems)
      const total = allItems.reduce(
        (sum, item) => sum + item.quantity * parseFloat(item.unit_price),
        0,
      )
      setTotalPrice(total)
    } catch (err) {
      console.error(err)
      toast.error('Lỗi khi tải giỏ hàng')
    } finally {
      setIsLoading(false)
    }
  }
  const fetchUserAndAddresses = async () => {
    try {
      const addrRes = await apiClient.get('/user-addresses')
      const defaultAddr = addrRes.data?.data?.find(
        (addr: any) => addr.is_default === 1,
      )
      setCurrentAddress(defaultAddr)
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
      fetchCartFromDB()
    }
  }, [form, navigate, token])

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
    try {
      const res = await apiClient.post('/user-addresses', {
        ...values,
        is_default: false,
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
      //   fetchAddresses() // reload lại danh sách
    } catch (err) {
      toast.error('Có lỗi xảy ra!')
    } finally {
      setIsAdding(false)
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

    try {
      if (useDefaultAddress) {
        const addrRes = await apiClient.get('/user-addresses')
        const defaultAddr = addrRes.data?.data?.find(
          (addr: any) => addr.is_default === 1,
        )
        if (!defaultAddr) throw new Error('No default address found')
        checkoutData.address_id = defaultAddr.id
      } else {
        checkoutData.new_address = {
          receiver_name: currentAddress?.receiver_name,
          receiver_phone: currentAddress?.receiver_phone,
          address: currentAddress?.address,
          is_default: false,
        }
      }

      const res = await apiClient.post('/orders/create', checkoutData)
      if (values.payment_method === 'vnpay') {
        const paymentUrl = res.data?.data?.payment_url
        if (paymentUrl) {
          window.location.href = paymentUrl
        } else toast.error('Không lấy được link thanh toán VNPay!')
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
      title: <span style={{ fontSize: 25, fontWeight: 600 }}>Sản phẩm</span>,
      key: 'product',
      render: (_: any, record: CartItem) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            padding: '8px 0',
          }}
        >
          <img
            src={record.sku.image_url}
            alt={record.sku.sku}
            style={{
              width: 60,
              height: 60,
              objectFit: 'cover',
              borderRadius: 8,
              border: '1px solid #eee',
            }}
          />
          <div style={{ fontWeight: 500, fontSize: 18 }}>
            {record.product_name}
          </div>

          <div style={{ fontSize: 14, color: '#555' }}>
            Loại:{' '}
            {record.sku.attributes?.map((attr: any) => attr.value).join(', ')}
          </div>
        </div>
      ),
    },
    {
      title: <span style={{ fontSize: 25, fontWeight: 600 }}>Đơn giá</span>,
      key: 'unit_price',
      dataIndex: 'unit_price',
      render: (text: string) => formatCurrency(text),
    },
    {
      title: <span style={{ fontSize: 25, fontWeight: 600 }}>Số lượng</span>,
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ]

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '100px 0',
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    )
  }

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Row gutter={24} justify="center">
        <Col xs={24} md={18}>
          <Card
            title={
              <Space>
                <EnvironmentOutlined
                  style={{ fontSize: 18, color: 'tomato' }}
                />
                <Title level={5} style={{ margin: 0 }}>
                  Địa Chỉ Nhận Hàng
                </Title>
              </Space>
            }
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  flex: 1,
                  gap: 8,
                }}
              >
                <Text strong>{currentAddress?.receiver_name}</Text>
                <Text>({currentAddress?.receiver_phone})</Text>
                <span>{currentAddress?.address}</span>

                {useDefaultAddress && (
                  <Button
                    type="default"
                    size="small"
                    danger
                    ghost
                    style={{ padding: '0 6px' }}
                  >
                    Mặc Định
                  </Button>
                )}
              </div>

              <Button type="link" onClick={handleOpenModal}>
                Thay Đổi
              </Button>
            </div>
          </Card>

          <Modal
            title={isAddingNewAddress ? 'Thêm địa chỉ mới' : 'Địa chỉ của tôi'}
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false)
              setIsAddingNewAddress(false)
            }}
            footer={null}
          >
            {isAddingNewAddress ? (
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
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Số điện thoại"
                  name="receiver_phone"
                  rules={[{ required: true, message: 'Nhập số điện thoại' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  rules={[{ required: true, message: 'Nhập địa chỉ' }]}
                >
                  <Input.TextArea rows={2} />
                </Form.Item>
                <Form.Item name="is_default" valuePropName="checked">
                  <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
                </Form.Item>
                <Form.Item>
                  <Space
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button onClick={() => setIsAddingNewAddress(false)}>
                      Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" loading={isAdding}>
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
                      <div
                        key={addr.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          padding: '12px 0',
                          borderBottom: '1px solid #f0f0f0',
                        }}
                      >
                        <Radio value={addr.id} style={{ flex: 1 }}>
                          <strong>{addr.receiver_name}</strong> (
                          <span style={{ color: '#888' }}>
                            {addr.receiver_phone}
                          </span>
                          )<br />
                          {addr.address}
                          {addr.is_default && (
                            <Tag color="red" style={{ marginTop: 4 }}>
                              Mặc định
                            </Tag>
                          )}
                        </Radio>
                        <Space
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: 16,
                          }}
                        >
                          <Button
                            type="link"
                            onClick={() => {
                              setIsModalVisible(true)
                              setIsAddingNewAddress(true)
                              setIsEditing(true)
                              setEditingAddress(addr)
                            }}
                          >
                            Cập nhật
                          </Button>
                        </Space>
                      </div>
                    ))}
                  </Space>
                </Radio.Group>

                <Divider />

                <Button
                  block
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddingNewAddress(true)}
                >
                  Thêm địa chỉ mới
                </Button>

                <Space
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: 16,
                  }}
                >
                  <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
                  <Button
                    type="primary"
                    onClick={handleConfirmAddress}
                    disabled={!selectedAddressId}
                  >
                    Xác nhận
                  </Button>
                </Space>
              </>
            )}
          </Modal>

          <Card
            title={
              <Space>
                <ShoppingCartOutlined />
                <Title level={5} style={{ margin: 0 }}>
                  Đơn hàng ({cartItems.length} sản phẩm)
                </Title>
              </Space>
            }
          >
            <Table
              dataSource={cartItems}
              columns={columns}
              pagination={false}
              rowKey="sku_id"
            />

            <Form.Item name="voucher_code" label="Mã giảm giá">
              <Row gutter={8}>
                <Col span={16}>
                  <Input placeholder="Nhập mã voucher" />
                </Col>
                <Col span={8}>
                  <Button type="primary" block>
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
                <Radio value="cod">Thanh toán khi nhận hàng</Radio>
                <Radio value="vnpay">VNPay</Radio>
                <br />
              </Radio.Group>
            </Form.Item>

            <Form.Item>
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
              Quay lại giỏ hàng
            </Button>
          </Card>
        </Col>
      </Row>
    </Form>
  )
}

export default CheckoutPage
