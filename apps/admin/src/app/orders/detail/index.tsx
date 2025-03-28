import { Card, Descriptions, Table, Select, Button, message } from 'antd'
import { useState } from 'react'

const { Option } = Select

const OrderDetails = () => {
  const [orderStatus, setOrderStatus] = useState('Pending')

  const order = {
    id: 'ORD001',
    customer: 'Nguyễn Văn A',
    total: 500000,
    status: 'Pending',
    date: '2025-03-25',
    items: [
      { id: 1, name: 'Laptop Acer', quantity: 1, price: 15000000 },
      { id: 2, name: 'Chuột Logitech', quantity: 2, price: 600000 },
    ],
  }

  const handleStatusChange = (value) => {
    setOrderStatus(value)
    message.success(`Cập nhật trạng thái: ${value}`)
  }

  const handleNotifyCustomer = () => {
    message.info('Đã gửi thông báo cho khách hàng')
  }

  const columns = [
    { title: 'Sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()} đ`,
    },
  ]

  return (
    <Card title={`Chi tiết đơn hàng ${order.id}`}>
      <Descriptions bordered>
        <Descriptions.Item label="Khách hàng">
          {order.customer}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {order.total.toLocaleString()} đ
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đặt hàng">
          {order.date}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Select value={orderStatus} onChange={handleStatusChange}>
            <Option value="Pending">Chờ xử lý</Option>
            <Option value="Completed">Hoàn thành</Option>
            <Option value="Cancelled">Đã hủy</Option>
          </Select>
        </Descriptions.Item>
      </Descriptions>
      <Table
        columns={columns}
        dataSource={order.items}
        rowKey="id"
        style={{ marginTop: 20 }}
      />
      <Button
        type="primary"
        onClick={handleNotifyCustomer}
        style={{ marginTop: 20 }}
      >
        Gửi thông báo cho khách hàng
      </Button>
    </Card>
  )
}

export default OrderDetails
