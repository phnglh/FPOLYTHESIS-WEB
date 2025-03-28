import { Table, Tag, Space, Button } from 'antd'
import { useState } from 'react'

const RefundReturn = () => {
  const [refundRequests, setRefundRequests] = useState([
    {
      id: 'RF001',
      orderId: 'ORD001',
      customer: 'Nguyễn Văn A',
      amount: 500000,
      status: 'Pending',
    },
    {
      id: 'RF002',
      orderId: 'ORD002',
      customer: 'Trần Thị B',
      amount: 1200000,
      status: 'Approved',
    },
  ])

  const handleApprove = (id) => {
    setRefundRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'Approved' } : req)),
    )
  }

  const columns = [
    { title: 'Mã hoàn tiền', dataIndex: 'id', key: 'id' },
    { title: 'Mã đơn hàng', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount.toLocaleString()} đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Approved' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'Pending' && (
            <Button type="primary" onClick={() => handleApprove(record.id)}>
              Duyệt
            </Button>
          )}
          <Button type="link" danger>
            Hủy
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Table columns={columns} dataSource={refundRequests} rowKey="id" />
    </div>
  )
}

export default RefundReturn
