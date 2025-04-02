import { Button, Input, Select, Space, Table, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store.ts'
import { fetchOrders } from '@store/slices/orderSlice.ts'

const OrderList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { data, loading } = useSelector((state: RootState) => state.orders)

  console.log(data)
  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const filteredOrders = (data && Array.isArray(data) ? data : []).filter(
    (order) =>
      (statusFilter === 'all' || order.status === statusFilter) &&
      order.id.toString().includes(searchTerm),
  )

  const columns = [
    { title: 'Mã đơn hàng', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice) => `${totalPrice.toLocaleString()} đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Completed' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link">Xem</Button>
          <Button type="link" danger>
            Hủy
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm mã đơn hàng"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          defaultValue="all"
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'Pending', label: 'Chờ xử lý' },
            { value: 'Completed', label: 'Hoàn thành' },
          ]}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        loading={loading}
      />
    </div>
  )
}

export default OrderList
