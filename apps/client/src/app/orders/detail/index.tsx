import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Card, List, Typography, Button, Spin } from 'antd'
import apiClient from '@store/services/apiClient.ts'

interface OrderDetail {
  id: number
  order_number: string
  ordered_at: string
  final_total: string
  status: string
  items: {
    id: number
    product_name: string
    unit_price: string
    quantity: number
    total_price: string
    sku: { image_url: string }
  }[]
  address: {
    receiver_name: string
    receiver_phone: string
    address: string
  }
}

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    apiClient
      .get(`/orders/${id}`)
      .then((response) => {
        if (response.data.status === 'success') {
          setOrder(response.data.data)
        }
      })
      .catch((error) => console.error('Lỗi khi tải đơn hàng:', error))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spin size="large" />
  if (!order) return <Typography.Text>Không tìm thấy đơn hàng!</Typography.Text>

  return (
    <div>
      <Typography.Title level={2}>
        Chi tiết đơn hàng #{order.order_number}
      </Typography.Title>
      <Card>
        <Typography.Text>Ngày đặt: {order.ordered_at}</Typography.Text>
        <br />
        <Typography.Text>
          Tổng tiền: {Number(order.final_total).toLocaleString()} VND
        </Typography.Text>
        <br />
        <Typography.Text>Trạng thái: {order.status}</Typography.Text>
      </Card>

      <Typography.Title level={4}>Sản phẩm trong đơn</Typography.Title>
      <List
        dataSource={order.items}
        renderItem={(item) => (
          <List.Item>
            <img
              src={JSON.parse(item.sku.image_url)[0]}
              alt={item.product_name}
              width={50}
              height={50}
            />
            <Typography.Text>
              {item.product_name} - {item.quantity} x{' '}
              {Number(item.unit_price).toLocaleString()} VND
            </Typography.Text>
          </List.Item>
        )}
      />

      <Typography.Title level={4}>Thông tin giao hàng</Typography.Title>
      <Card>
        <Typography.Text>
          Người nhận: {order.address.receiver_name}
        </Typography.Text>
        <br />
        <Typography.Text>
          Điện thoại: {order.address.receiver_phone}
        </Typography.Text>
        <br />
        <Typography.Text>Địa chỉ: {order.address.address}</Typography.Text>
      </Card>

      <Button
        type="primary"
        onClick={() => navigate('/orders')}
        style={{ marginTop: 20 }}
      >
        Quay lại danh sách đơn hàng
      </Button>
    </div>
  )
}

export default OrderDetailPage
