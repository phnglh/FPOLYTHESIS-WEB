import {
  Button,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Modal,
  Row,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'
import { useNavigate } from 'react-router'
import { Order } from '#types/order'
import { User } from '#types/user'
import apiClient from '@store/services/apiClient'
import { toast } from 'react-toastify'

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

const OrderList = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [pageSize, setPageSize] = useState(10) // mặc định 10 dòng mỗi trang
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [confirmVisible, setConfirmVisible] = useState(false)

  const { formatCurrency } = useCurrencyFormatter()
  const [currentPage, setCurrentPage] = useState(1)
  const fetchOrders = async (page: number, size: number) => {
    try {
      console.log(size)
      const response = await apiClient.get(`/orders?page=${page}&limit=${size}`)
      setOrders(response.data.data)
      setLoading(false)
      setCurrentPage(response.data.meta.current_page)
      setTotal(response.data.meta.total)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Có lỗi xảy ra khi tải danh sách đơn hàng')
    }
  }

  useEffect(() => {
    fetchOrders(currentPage, pageSize)
  }, [])

  console.log(pageSize)
  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination
    setCurrentPage(current)
    setPageSize(pageSize)
    fetchOrders(current, pageSize)
  }

  const filteredOrders = (Array.isArray(orders) ? orders : []).filter(
    (order) =>
      (statusFilter === 'all' || order.status === statusFilter) &&
      order.id.toString().includes(searchTerm.trim()),
  )

  const handleConfirmStatusChange = async () => {
    if (!selectedOrder) return
    try {
      await apiClient.put(
        `/orders/${selectedOrder.id}/status`,
        { status: selectedStatus },
        { headers: { 'Content-Type': 'application/json' } },
      )
      toast.success('Cập nhật trạng thái thành công')
      setConfirmVisible(false)
      await fetchOrders(currentPage, pageSize)
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái')
    }
  }

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'order_number',
      key: 'order_number',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      key: 'user',
      render: (user: User | null) => user?.name || 'N/A',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'final_total',
      key: 'final_total',
      render: (total: number) => formatCurrency(total),
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
      title: 'Hành động',
      key: 'actions',
      render: (_: string, record: Order) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedOrder(record)
              setSelectedStatus(record.status)
              setConfirmVisible(true)
            }}
            disabled={
              record.status === 'delivered' || record.status === 'cancelled'
            }
          >
            Cập nhật
          </Button>
          <Button onClick={() => navigate(`/orders/${record.id}`)}>
            Chi tiết
          </Button>
          <Button onClick={() => navigate(`/orders/${record.id}/invoice`)}>
            Xem hóa đơn
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ display: 'flex', marginTop: '30px' }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Danh sách đơn hàng
        </Typography.Title>
      </Row>
      <Space size="middle" style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm mã đơn hàng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'pending', label: 'Chờ xác nhận' },
            { value: 'processing', label: 'Đang xử lý' },
            { value: 'shipped', label: 'Đang giao' },
            { value: 'delivered', label: 'Đã giao' },
            { value: 'cancelled', label: 'Đã hủy' },
          ]}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,

          showSizeChanger: true,
          pageSizeOptions: ['10', '25', '50', '100'],
        }}
        onChange={handleTableChange}
      />

      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={confirmVisible}
        onOk={handleConfirmStatusChange}
        onCancel={() => setConfirmVisible(false)}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <p>
          Đơn hàng <strong>#{selectedOrder?.id}</strong> hiện đang ở trạng thái:{' '}
          <Tag color={statusColors[selectedOrder?.status || '']}>
            {statusLabels[selectedOrder?.status || '']}
          </Tag>
        </p>
        <p>Chọn trạng thái mới:</p>
        <Select
          value={selectedStatus}
          onChange={setSelectedStatus}
          style={{ width: '100%' }}
        >
          <Select.Option value="pending">Chờ xác nhận</Select.Option>
          <Select.Option value="processing">Đang xử lý</Select.Option>
          <Select.Option value="shipped">Đang giao</Select.Option>
          <Select.Option value="delivered">Đã giao</Select.Option>
          <Select.Option value="cancelled">Đã hủy</Select.Option>
        </Select>
      </Modal>
    </Space>
  )
}

export default OrderList
