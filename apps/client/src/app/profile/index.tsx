import { useEffect, useState } from 'react'
import {
  Layout,
  Menu,
  Card,
  Typography,
  Avatar,
  Table,
  Spin,
  Tag,
  Button,
  Space,
  Form,
  Input,
} from 'antd'
import {
  UserOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  DeliveredProcedureOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '@store/slices/authSlice'
import { RootState } from '@store/store'
import apiClient from '@store/services/apiClient'

const { Title } = Typography
const { Sider, Content } = Layout

interface Address {
  id: number
  name: string
  email: string
  phone: string
  address: string
  status: string
}

interface Order {
  id: number
  order_number: string
  ordered_at: string
  final_total: string
  status: string
}

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state: RootState) => state.auth)
  const [selectedMenu, setSelectedMenu] = useState('info')
  const [userAddresses, setUserAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [paidPayments, setpaidPayments] = useState([])
  const [loadingpaid, setLoadingpaid] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  useEffect(() => {
    if (selectedMenu === 'address') {
      setLoadingAddresses(true)
      apiClient
        .get('/user_addresses')
        .then((response) => {
          if (response.data.status === 'success') {
            setUserAddresses(response.data.data)
          }
        })
        .catch((error) => console.error('Lỗi khi tải địa chỉ:', error))
        .finally(() => setLoadingAddresses(false))
    }

    if (selectedMenu === 'orders') {
      setLoadingOrders(true)
      apiClient
        .get('/orders')
        .then((response) => {
          if (response.data.status === 'success') {
            setOrders(response.data.data.data)
          }
        })
        .catch((error) => console.error('Lỗi khi tải đơn hàng:', error))
        .finally(() => setLoadingOrders(false))
    }
  }, [selectedMenu])

  useEffect(() => {
    if (selectedMenu === 'ordered' && orderId !== null) {
      setLoadingpaid(true)
      apiClient
        .post('/payment/pay', {
          order_id: orderId,
          payment_method: 'vnpay',
          amount: totalAmount,
        })
        .then((response) => {
          if (response.data.status === 'success') {
            const filtered = response.data.data.filter(
              (item: any) => item.status === 'paid',
            )
            setpaidPayments(filtered)
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            console.error('Lỗi từ API:', error.response.data)
          } else {
            console.error('Lỗi khi tải payments:', error)
          }
        })
        .finally(() => setLoadingpaid(false))
    }
  }, [selectedMenu, orderId, totalAmount])

  const addressColumns = [
    {
      title: 'STT',
      key: 'stt',
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: 'Tên', dataIndex: 'receiver_name', key: 'receiver_name' },
    {
      title: 'Số điện thoại',
      dataIndex: 'receiver_phone',
      key: 'receiver_phone',
    },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
  ]

  const paidColumns = [
    {
      title: 'STT',
      key: 'stt',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên người thanh toán',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${Number(amount).toLocaleString()} VND`,
    },
    {
      title: 'Phương thức',
      dataIndex: 'payment_method',
      key: 'payment_method',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'delivered' ? 'green' : 'red'}>
          {status === 'delivered' ? 'Đã giao hàng' : status}
        </Tag>
      ),
    },
  ]

  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'order_number',
      key: 'order_number',
      render: (text: string, record: Order) => (
        <a
          onClick={() => window.location.assign(`/account/orders/${record.id}`)}
          style={{ cursor: 'pointer', color: '#1890ff' }}
        >
          {text}
        </a>
      ),
    },
    { title: 'Ngày đặt', dataIndex: 'ordered_at', key: 'ordered_at' },
    {
      title: 'Tổng tiền',
      dataIndex: 'final_total',
      key: 'final_total',
      render: (total: string) => `${Number(total).toLocaleString()} VND`,
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          pending: 'Chờ xác nhận',
          processing: 'Xử lý',
          cancelled: 'Đã hủy',
          shipped: 'Đang giao',
          delivered: 'Đã giao hàng',
          returned: 'Đã trả lại',
        }

        const statusColorMap = {
          pending: 'blue',
          processing: 'orange',
          cancelled: 'red',
          shipped: 'green',
          delivered: 'green',
          returned: 'gray',
        }

        return <Tag color={statusColorMap[status]}>{statusMap[status]}</Tag>
      },
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status: string) => {
        const paymentStatusMap = {
          unpaid: 'Chưa thanh toán',
          pending: 'Chờ xác nhận',
          paid: 'Thanh toán thành công',
          failed: 'Thanh toán thất bại',
          refunded: 'Đã hoàn tiền',
        }

        const paymentStatusColorMap = {
          unpaid: 'red',
          pending: 'black',
          paid: 'blue',
          failed: 'green',
          refunded: 'orange',
        }

        return (
          <Tag color={paymentStatusColorMap[status]}>
            {paymentStatusMap[status]}
          </Tag>
        )
      },
    },
    {
      title: 'Chi tiết',
      key: 'action',
      render: (text: string, record: Order) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            type="link"
            onClick={() =>
              window.location.assign(`/account/orders/${record.id}`)
            }
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light">
        <Menu
          mode="inline"
          defaultSelectedKeys={['info']}
          onClick={(e) => setSelectedMenu(e.key)}
        >
          <Menu.Item key="info" icon={<UserOutlined />}>
            Thông tin cá nhân
          </Menu.Item>
          <Menu.Item key="address" icon={<HomeOutlined />}>
            Địa chỉ
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
            Danh sách đơn hàng
          </Menu.Item>
          <Menu.Item key="ordered" icon={<DeliveredProcedureOutlined />}>
            Đơn hàng đã đặt
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: '24px' }}>
        <Content>
          <Card>
            {selectedMenu === 'info' && (
              <div style={{ textAlign: 'center' }}>
                <Avatar size={60} icon={<UserOutlined />} />
                {loading ? (
                  <Spin size="large" />
                ) : user ? (
                  <Form
                    layout="vertical"
                    style={{ width: 500, margin: 'auto' }}
                  >
                    <Title level={4}>Thông tin người dùng</Title>
                    <Form.Item label="Tên người dùng">
                      <Input value={user.name || 'Người dùng'} disabled />
                    </Form.Item>
                    <Form.Item label="Email">
                      <Input value={user.email} disabled />
                    </Form.Item>
                    <Form.Item label="Địa chỉ">
                      <Input value={user.address || 'Chưa cập nhật'} disabled />
                    </Form.Item>
                    <Form.Item label="Số điện thoại">
                      <Input value={user.phone || 'Chưa cập nhật'} disabled />
                    </Form.Item>
                  </Form>
                ) : (
                  <Title level={5}>Không có thông tin người dùng</Title>
                )}
              </div>
            )}

            {selectedMenu === 'address' && (
              <>
                <Title level={4}>Danh sách địa chỉ</Title>
                {loadingAddresses ? (
                  <Spin size="large" />
                ) : (
                  <Table
                    dataSource={userAddresses || []}
                    columns={addressColumns}
                    rowKey="id"
                    bordered
                    pagination={{ pageSize: 5 }}
                    style={{ marginTop: '20px' }}
                  />
                )}
              </>
            )}

            {selectedMenu === 'orders' && (
              <>
                <Title level={4}>Danh sách đơn hàng</Title>
                {loadingOrders ? (
                  <Spin size="large" />
                ) : (
                  <Table
                    dataSource={orders || []}
                    columns={orderColumns}
                    rowKey="id"
                  />
                )}
              </>
            )}

            {selectedMenu === 'ordered' && (
              <>
                <Title level={4}>Đơn hàng đã giao</Title>
                {loadingpaid ? (
                  <Spin size="large" />
                ) : (
                  <Table
                    dataSource={paidPayments}
                    columns={paidColumns}
                    rowKey="id"
                  />
                )}
              </>
            )}
          </Card>
        </Content>
      </Layout>
    </Layout>
  )
}