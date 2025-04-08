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
  DeliveredProcedureOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '@store/slices/authSlice'
import { RootState } from '@store/store'
import apiClient from '@store/services/apiClient'

const { Title } = Typography
const { Sider, Content } = Layout

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state: RootState) => state.auth)
  const [selectedMenu, setSelectedMenu] = useState('info')
  const [addresses, setAddresses] = useState([])
  const [orders, setOrders] = useState([])
  const [payments, setPayments] = useState([])
  const [loadingState, setLoadingState] = useState(false)

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  useEffect(() => {
    setLoadingState(true)

    const fetchData = async () => {
      try {
        if (selectedMenu === 'address') {
          const res = await apiClient.get('/user_addresses')
          if (res.data.status === 'success' && Array.isArray(res.data.data)) {
            setAddresses(res.data.data)
          }
        }

        if (selectedMenu === 'orders') {
          const res = await apiClient.get('/orders')
          const data = res.data?.data
          if (res.data.status === 'success' && Array.isArray(data)) {
            setOrders(data)
          } else if (Array.isArray(data?.data)) {
            setOrders(data.data)
          }
        }

        if (selectedMenu === 'ordered') {
          const res = await apiClient.get('/payments')
          if (res.data.status === 'success' && Array.isArray(res.data.data)) {
            const delivered = res.data.data.filter(
              (p: any) => p.status === 'delivered',
            )
            setPayments(delivered)
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
      } finally {
        setLoadingState(false)
      }
    }

    fetchData()
  }, [selectedMenu])

  const addressColumns = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Tên', dataIndex: 'receiver_name', key: 'receiver_name' },
    { title: 'SĐT', dataIndex: 'receiver_phone', key: 'receiver_phone' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
  ]

  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'order_number',
      render: (_: any, r: any) => (
        <a onClick={() => window.location.assign(`/account/orders/${r.id}`)}>
          {r.order_number}
        </a>
      ),
    },
    { title: 'Ngày đặt', dataIndex: 'ordered_at' },
    {
      title: 'Tổng tiền',
      dataIndex: 'final_total',
      render: (v: string) => `${Number(v).toLocaleString()} VND`,
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      render: (status: string) => {
        const colors = {
          pending: 'blue',
          processing: 'orange',
          cancelled: 'red',
          shipped: 'green',
          delivered: 'green',
          returned: 'gray',
        }
        const labels = {
          pending: 'Chờ xác nhận',
          processing: 'Xử lý',
          cancelled: 'Đã hủy',
          shipped: 'Đang giao',
          delivered: 'Đã giao hàng',
          returned: 'Đã trả lại',
        }
        return <Tag color={colors[status]}>{labels[status]}</Tag>
      },
    },
    {
      title: 'Thanh toán',
      dataIndex: 'payment_status',
      render: (status: string) => {
        const colors = {
          unpaid: 'red',
          pending: 'black',
          paid: 'blue',
          failed: 'green',
          refunded: 'orange',
        }
        const labels = {
          unpaid: 'Chưa thanh toán',
          pending: 'Chờ xác nhận',
          paid: 'Đã thanh toán',
          failed: 'Thất bại',
          refunded: 'Đã hoàn',
        }
        return <Tag color={colors[status]}>{labels[status]}</Tag>
      },
    },
    {
      title: 'Chi tiết',
      render: (_: any, r: any) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => window.location.assign(`/account/orders/${r.id}`)}
        >
          Xem
        </Button>
      ),
    },
  ]

  const paymentColumns = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Người thanh toán', dataIndex: 'name' },
    { title: 'Ngày tạo', dataIndex: 'created_at' },
    { title: 'Cập nhật', dataIndex: 'updated_at' },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      render: (v: number) => `${Number(v).toLocaleString()} VND`,
    },
    { title: 'Phương thức', dataIndex: 'payment_method' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={status === 'delivered' ? 'green' : 'red'}>
          {status === 'delivered' ? 'Đã giao hàng' : status}
        </Tag>
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
            Đơn hàng đã giao
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: 24 }}>
        <Content>
          <Card>
            {selectedMenu === 'info' && (
              <div style={{ textAlign: 'center' }}>
                <Avatar size={64} icon={<UserOutlined />} />
                {loading ? (
                  <Spin />
                ) : user ? (
                  <Form
                    layout="vertical"
                    style={{ maxWidth: 500, margin: '20px auto' }}
                  >
                    <Form.Item label="Tên">
                      <Input value={user.name || 'Chưa có'} disabled />
                    </Form.Item>
                    <Form.Item label="Email">
                      <Input value={user.email || 'Chưa có'} disabled />
                    </Form.Item>
                    <Form.Item label="Địa chỉ">
                      <Input value={user.address || 'Chưa cập nhật'} disabled />
                    </Form.Item>
                    <Form.Item label="SĐT">
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
                {loadingState ? (
                  <Spin />
                ) : (
                  <Table
                    dataSource={addresses}
                    columns={addressColumns}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                  />
                )}
              </>
            )}

            {selectedMenu === 'orders' && (
              <>
                <Title level={4}>Danh sách đơn hàng</Title>
                {loadingState ? (
                  <Spin />
                ) : (
                  <Table
                    dataSource={orders}
                    columns={orderColumns}
                    rowKey="id"
                    pagination={false}
                  />
                )}
              </>
            )}

            {selectedMenu === 'ordered' && (
              <>
                <Title level={4}>Đơn hàng đã giao</Title>
                {loadingState ? (
                  <Spin />
                ) : (
                  <Table
                    dataSource={payments}
                    columns={paymentColumns}
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
