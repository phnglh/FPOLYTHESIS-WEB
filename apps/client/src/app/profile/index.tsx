import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '@store/slices/authSlice'
import { AppDispatch, RootState } from '@store/store'
import {
  Card,
  Col,
  Row,
  Typography,
  Avatar,
  Spin,
  Table,
  Tag,
  Button,
} from 'antd'
import apiClient from '@store/services/apiClient'
import { Link } from 'react-router'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'

const { Title, Text } = Typography
const statusColors: Record<string, string> = {
  pending: 'gold',
  processing: 'blue',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
}

const statusLabels: Record<string, string> = {
  pending: 'Chờ xác nhận',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
}
const paymentStatusColors: Record<string, string> = {
  unpaid: 'red',
  pending: 'gold',
  paid: 'green',
  failed: 'gray',
  refunded: 'blue',
}

const paymentStatusLabels: Record<string, string> = {
  unpaid: 'Chưa thanh toán',
  pending: 'Đang chờ',
  paid: 'Đã thanh toán',
  failed: 'Thanh toán thất bại',
  refunded: 'Đã hoàn tiền',
}
export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading } = useSelector((state: RootState) => state.auth)
  const [orders, setOrders] = useState<any[]>([]) // State for orders
  const { formatCurrency } = useCurrencyFormatter()
  // Fetch user data when component mounts
  useEffect(() => {
    dispatch(getUser())
    // Call API to fetch orders
    fetchOrders()
  }, [dispatch])

  console.log(orders)

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/orders') // Replace with actual API endpoint
      const data = await response.data.data
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  // Loading spinner while user data is being fetched
  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: 'block', marginTop: '50px', textAlign: 'center' }}
      />
    )
  }

  // Handle case if user data is not yet available
  if (!user) {
    return <Text>No user data available</Text>
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'order_number',
      key: 'order_number',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'final_total',
      key: 'final_total',
      render: (total: number) => formatCurrency(total),
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (payment_status: string) => (
        <Tag color={paymentStatusColors[payment_status]}>
          {paymentStatusLabels[payment_status]}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Chi tiết',
      key: 'details',
      render: (_text: string, record: any) => (
        <Link to={`/account/orders/${record.id}`}>
          <Button type="primary">Xem chi tiết</Button>
        </Link>
      ),
    },
  ]

  return (
    <div
      style={{
        padding: '30px',
        backgroundColor: '#f5f5f5',
        width: '100%',
        minHeight: '100vh',
      }}
    >
      {/* Profile Row */}
      <Row justify="center" gutter={32}>
        <Col span={24}>
          <Card
            title={<Title level={3}>Profile</Title>}
            style={{
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              backgroundColor: '#fff',
              padding: '20px',
              transition: 'box-shadow 0.3s',
            }}
            hoverable
          >
            {/* Avatar and user info */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Avatar
                size={100}
                src="https://i.pravatar.cc/150?img=3"
                style={{ border: '2px solid #1890ff' }}
              />
              <Title level={4} style={{ marginTop: '10px', fontWeight: '600' }}>
                {user.name}
              </Title>
              <Text
                type="secondary"
                style={{ display: 'block', marginBottom: '15px' }}
              >
                {user.role}
              </Text>
            </div>

            {/* User Info */}
            <div>
              <Row gutter={16}>
                <Col span={24}>
                  <Text strong>Email:</Text>
                  <Text>{user.email || 'Not provided'}</Text>
                </Col>
                <Col span={24}>
                  <Text strong>Phone:</Text>
                  <Text>{user.phone || 'Not provided'}</Text>
                </Col>
                <Col span={24}>
                  <Text strong>Created at:</Text>
                  <Text>{new Date(user.created_at).toLocaleString()}</Text>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Orders Row */}
      <Row justify="center" gutter={32} style={{ marginTop: '30px' }}>
        <Col span={24}>
          <Card
            title={<Title level={4}>Your Orders</Title>}
            style={{
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              backgroundColor: '#fff',
              padding: '20px',
              transition: 'box-shadow 0.3s',
            }}
            hoverable
          >
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              style={{ borderRadius: '12px', marginTop: '20px' }}
              rowClassName="order-row"
              scroll={{ x: true }} // Allow horizontal scroll if needed
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
