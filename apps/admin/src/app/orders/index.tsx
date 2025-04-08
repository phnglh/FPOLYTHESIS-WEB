import { Button, Input, Select, Space, Table, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store.ts'
import { fetchOrders } from '@store/slices/orderSlice.ts'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'
import { useNavigate } from 'react-router'
import { Order } from '#types/order'
import { User } from '#types/user'
import apiClient from '@store/services/apiClient'

const { Option } = Select

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

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await apiClient.put(
        `/orders/${id}/status`,
        { status }, // phải là object có key 'status'
        { headers: { 'Content-Type': 'application/json' } },
      )
      dispatch(fetchOrders()) // reload lại danh sách
    } catch (error) {
      console.error('Failed to update status:', error)
      // optional: hiển thị message ra UI
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
        <Select
          value={status}
          onChange={(newStatus) => updateOrderStatus(record.id, newStatus)}
          style={{ width: 160 }}
        >
          <Select.Option value="pending">Chờ xác nhận</Select.Option>
          <Select.Option value="processing">Đang xử lý</Select.Option>
          <Select.Option value="shipped">Đang giao</Select.Option>
          <Select.Option value="delivered">Đã giao</Select.Option>
          <Select.Option value="cancelled">Đã hủy</Select.Option>
        </Select>
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
          <Button type="link" danger>
            Hủy
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
            { value: 'Pending', label: 'Chờ xử lý' },
            { value: 'Completed', label: 'Hoàn thành' },
            { value: 'Cancelled', label: 'Đã hủy' },
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
    </div>
  )
}

export default OrderList
