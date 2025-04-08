import { Table, Tag, Button, Card } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { fetchAllOrders } from '@store/slices/orderSlice'
import { useNavigate } from 'react-router'

const OrderList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { orders, loading } = useSelector((state: RootState) => state.orders)

  useEffect(() => {
    dispatch(fetchAllOrders())
  }, [dispatch])

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: ['user', 'name'],
      key: 'user',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'final_total',
      key: 'final_total',
      render: (value: number) => `${value.toLocaleString()} đ`,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default'
        if (status === 'delivered') color = 'green'
        else if (status === 'pending') color = 'orange'
        else if (status === 'cancelled') color = 'red'
        return <Tag color={color}>{status.toUpperCase()}</Tag>
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Button onClick={() => navigate(`/orders/${record.id}`)}>Xem</Button>
      ),
    },
  ]

  return (
    <Card title="Danh sách đơn hàng">
      <Table
        loading={loading}
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  )
}

export default OrderList
