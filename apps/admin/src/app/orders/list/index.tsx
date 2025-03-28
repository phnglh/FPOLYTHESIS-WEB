import { Table, Tag, Space, Button, Input, Select } from 'antd'
import { useState } from 'react'

const { Option } = Select

const OrderList = () => {
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const orders = [
    {
      id: 'ORD001',
      customer: 'Nguyễn Văn A',
      total: 500000,
      status: 'Pending',
    },
    {
      id: 'ORD002',
      customer: 'Trần Thị B',
      total: 1200000,
      status: 'Completed',
    },
  ]

  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter === 'all' || order.status === statusFilter) &&
      order.id.includes(searchTerm),
  )

  const columns = [
    { title: 'Mã đơn hàng', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `${total.toLocaleString()} đ`,
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
        <Select defaultValue="all" onChange={(value) => setStatusFilter(value)}>
          <Option value="all">Tất cả</Option>
          <Option value="Pending">Chờ xử lý</Option>
          <Option value="Completed">Hoàn thành</Option>
        </Select>
      </Space>
      <Table columns={columns} dataSource={filteredOrders} rowKey="id" />
    </div>
  )
}

export default OrderList
