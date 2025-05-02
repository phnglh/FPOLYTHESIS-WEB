import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Table, Button, Typography, Spin, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import apiClient from '@store/services/apiClient.ts'

interface Order {
  id: number
  order_number: string
  ordered_at: string
  final_total: string
  status: string
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    apiClient
      .get('/customer/orders')
      .then((response) => {
        if (response.data.status === 'success') {
          setOrders(response.data.data)
        }
      })
      .catch((error) => console.error('Lỗi khi tải đơn hàng:', error))
      .finally(() => setLoading(false))
  }, [])

  const statusColors: Record<string, string> = {
    processing: 'blue',
    pending: 'orange',
    completed: 'green',
    cancelled: 'red',
  }

  const columns: ColumnsType<Order> = [
    { title: 'Mã đơn hàng', dataIndex: 'order_number', key: 'order_number' },
    { title: 'Ngày đặt', dataIndex: 'ordered_at', key: 'ordered_at' },
    {
      title: 'Tổng tiền',
      dataIndex: 'final_total',
      key: 'final_total',
      render: (total) => `${Number(total).toLocaleString()} VND`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status] || 'default'}>{status}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/account/orders/${record.id}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Typography.Title level={2}>Danh sách đơn hàng</Typography.Title>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table dataSource={orders} columns={columns} rowKey="id" />
      )}
    </div>
  )
}

export default Orders
