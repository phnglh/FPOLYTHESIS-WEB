import { Button, Input, Select, Space, Table, Tag, Modal, message } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store.ts'
import { fetchOrders } from '@store/slices/orderSlice.ts'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'
import { useNavigate } from 'react-router'
import { Order } from '#types/order'
import { User } from '#types/user'
import apiClient from '@store/services/apiClient'

const statusColors: Record<string, string> = {
  pending: 'gold',
  processing: 'blue',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
}

const OrderList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [confirmVisible, setConfirmVisible] = useState(false)

  const { data, loading } = useSelector((state: RootState) => state.orders)
  const { formatCurrency } = useCurrencyFormatter()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const filteredOrders = (Array.isArray(data) ? data : []).filter(
    (order) =>
      (statusFilter === 'all' || order.status === statusFilter) &&
      order.id.toString().includes(searchTerm.trim()),
  )

  const handleChangeStatus = (order: Order, newStatus: string) => {
    setSelectedOrder(order)
    setSelectedStatus(newStatus)
    setConfirmVisible(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!selectedOrder) return
    try {
      await apiClient.put(
        `/orders/${selectedOrder.id}/status`,
        { status: selectedStatus },
        { headers: { 'Content-Type': 'application/json' } },
      )
      message.success('Cập nhật trạng thái thành công')
      setConfirmVisible(false)
      dispatch(fetchOrders())
    } catch (error) {
      console.error('Failed to update status:', error)
      message.error('Có lỗi xảy ra khi cập nhật trạng thái')
    }
  }

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
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
      render: (status: string, record: Order) => (
        <Space>
          <Tag color={statusColors[status]}>{status}</Tag>
          <Select
            value={status}
            onChange={(newStatus) => handleChangeStatus(record, newStatus)}
            style={{ width: 160 }}
          >
            <Select.Option value="pending">Chờ xác nhận</Select.Option>
            <Select.Option value="processing">Đang xử lý</Select.Option>
            <Select.Option value="shipped">Đang giao</Select.Option>
            <Select.Option value="delivered">Đã giao</Select.Option>
            <Select.Option value="cancelled">Đã hủy</Select.Option>
          </Select>
        </Space>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: string, record: Order) => (
        <Space>
          <Button onClick={() => navigate(`/orders/${record.id}`)}>
            Chi tiết
          </Button>
          <Button onClick={() => navigate(`/orders/${record.id}/invoice`)}>
            Xem hóa đơn
          </Button>
          <Button
            onClick={() =>
              window.open(`/orders/${record.id}/invoice`, '_blank')
            }
          >
            In hóa đơn
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
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
        dataSource={filteredOrders}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Xác nhận thay đổi trạng thái"
        open={confirmVisible}
        onOk={handleConfirmStatusChange}
        onCancel={() => setConfirmVisible(false)}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc muốn đổi trạng thái đơn hàng{' '}
          <strong>#{selectedOrder?.id}</strong> thành{' '}
          <Tag color={statusColors[selectedStatus]}>{selectedStatus}</Tag>?
        </p>
      </Modal>
    </div>
  )
}

export default OrderList
