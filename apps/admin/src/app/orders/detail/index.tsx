<<<<<<< HEAD
import {
  Card,
  Descriptions,
  Button,
  Table,
  Tag,
  Divider,
  message,
  Space,
  Typography,
} from 'antd'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { useEffect } from 'react'
import { fetchOrderById } from '@store/slices/orderSlice'
import { ColumnsType } from 'antd/es/table'

const statusColors: Record<string, string> = {
  pending: 'gold',
  processing: 'blue',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { data: order, loading } = useSelector(
    (state: RootState) => state.orders,
  )
=======
import { Table, Tag, Button, Card } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { fetchAllOrders } from '@store/slices/orderSlice'
import { useNavigate } from 'react-router'

const OrderList = () => {
>>>>>>> f4b94c1 (fix: profile checkout)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { orders, loading } = useSelector((state: RootState) => state.orders)

  useEffect(() => {
<<<<<<< HEAD
    if (id) {
      const orderId = Number(id)
      if (!isNaN(orderId)) {
        dispatch(fetchOrderById(orderId))
      } else {
        message.error('ID không hợp lệ')
      }
    }
  }, [dispatch, id])
=======
    dispatch(fetchAllOrders())
  }, [dispatch])

  useEffect(() => {
    console.log('Orders:', orders)
  }, [orders])

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
>>>>>>> f4b94c1 (fix: profile checkout)

  const productColumns: ColumnsType<any> = [
    {
      title: 'Ảnh',
      dataIndex: ['sku', 'image_url'],
      render: (url) => (
        <img src={url} alt="product" style={{ width: 60, borderRadius: 8 }} />
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product_name',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unit_price',
      render: (price) => `${Number(price).toLocaleString()} đ`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Tổng',
      dataIndex: 'total_price',
      render: (price) => `${Number(price).toLocaleString()} đ`,
    },
  ]

  if (!order?.id) return null

  return (
<<<<<<< HEAD
    <Card title={`Chi tiết đơn hàng: ${order.order_number}`} loading={loading}>
      <Descriptions title="Thông tin đơn hàng" bordered column={2}>
        <Descriptions.Item label="Mã đơn hàng">
          {order.order_number}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag
            color={statusColors[order.status]}
            style={{ textTransform: 'capitalize' }}
          >
            {order.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đặt">
          {order.ordered_at}
        </Descriptions.Item>
        <Descriptions.Item label="Thanh toán">
          <Tag color={order.payment_status === 'paid' ? 'green' : 'orange'}>
            {order.payment_status === 'paid'
              ? 'Đã thanh toán'
              : 'Chưa thanh toán'}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions title="Khách hàng" bordered column={2}>
        <Descriptions.Item label="Tên">{order.user?.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{order.user?.email}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions title="Địa chỉ giao hàng" bordered column={1}>
        <Descriptions.Item label="Tên người nhận">
          {order.address?.receiver_name}
        </Descriptions.Item>
        <Descriptions.Item label="SĐT">
          {order.address?.receiver_phone}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {order.address?.address}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Typography.Title level={4}>Sản phẩm</Typography.Title>
      <Table
        columns={productColumns}
        dataSource={order.items}
        rowKey="id"
        pagination={false}
      />

      <Divider />

      <Descriptions title="Tổng kết đơn hàng" bordered column={1}>
        <Descriptions.Item label="Tạm tính">
          {Number(order.subtotal).toLocaleString()} đ
        </Descriptions.Item>
        <Descriptions.Item label="Phí giao hàng">
          {Number(order.shipping_fee).toLocaleString()} đ
        </Descriptions.Item>
        <Descriptions.Item label="Giảm giá">
          {Number(order.discount).toLocaleString()} đ
        </Descriptions.Item>
        <Descriptions.Item label="Tổng thanh toán">
          <Typography.Text strong>
            {Number(order.final_total).toLocaleString()} đ
          </Typography.Text>
        </Descriptions.Item>
      </Descriptions>

      <Space style={{ marginTop: 24 }}>
        <Button type="primary">Gửi thông báo cho khách</Button>
        <Button danger>Hủy đơn</Button>
      </Space>
=======
    <Card title="Danh sách đơn hàng">
      <Table
        loading={loading}
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
>>>>>>> f4b94c1 (fix: profile checkout)
    </Card>
  )
}

export default OrderList
