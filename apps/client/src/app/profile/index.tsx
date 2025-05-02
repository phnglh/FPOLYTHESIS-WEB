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

  const [orders, setOrders] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const { formatCurrency } = useCurrencyFormatter()

  // Fetch user when component mounts
  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  // Fetch orders when pagination changes
  useEffect(() => {
    fetchOrders(pagination.current, pagination.pageSize)
  }, [pagination.current, pagination.pageSize])

  const fetchOrders = async (page: number = 1, pageSize: number = 10) => {
    try {
      const response = await apiClient.get('/customer/orders', {
        params: { page, per_page: pageSize },
      })
      const { data, meta } = response.data

      setOrders(data)
      setPagination({
        current: page,
        pageSize,
        total: meta.total,
      })
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: 'block', marginTop: '50px', textAlign: 'center' }}
      />
    )
  }

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
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Avatar size={100} src={user?.avatar} />
              <Title level={4} style={{ marginTop: '10px', fontWeight: '600' }}>
                {user.name}
              </Title>
            </div>

            <div>
              <Row gutter={16}>
                <Col span={24}>
                  <Text strong>Email:</Text>
                  <Text> {user.email || 'Not provided'}</Text>
                </Col>
                <Col span={24}>
                  <Text strong>Tạo lúc:</Text>
                  <Text> {new Date(user.created_at).toLocaleString()}</Text>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Orders */}
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
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true, // Cho phép thay đổi số dòng/trang
              }}
              onChange={(pagination) => {
                fetchOrders(pagination.current, pagination.pageSize)
              }}
              style={{ borderRadius: '12px', marginTop: '20px' }}
              rowClassName="order-row"
              scroll={{ x: true }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
