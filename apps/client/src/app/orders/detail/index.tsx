import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
  Card,
  List,
  Typography,
  Button,
  Spin,
  Timeline,
  Modal,
  Row,
  Col,
  Space,
} from 'antd'
import apiClient from '@store/services/apiClient.ts'
import { useDispatch } from 'react-redux'
import { cancelOrder } from '@store/slices/orderSlice'
import { AppDispatch } from '@store/store'

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
  tracking: { date: string; status: string }[]
}

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

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

  const handleCancelOrder = async () => {
    try {
      await dispatch(cancelOrder(Number(id))).unwrap()
      setCancelModalVisible(false)

      setOrder((prevOrder) =>
        prevOrder ? { ...prevOrder, status: 'Đã hủy' } : prevOrder,
      )
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error)
    }
  }

  if (loading) return <Spin size="large" />
  if (!order) return <Typography.Text>Không tìm thấy đơn hàng!</Typography.Text>

  return (
    <Row justify="center" style={{ padding: 20 }}>
      <Col xs={24} sm={22} md={20} lg={18} xl={16}>
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
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

        <Typography.Title level={4} style={{ textAlign: 'center' }}>
          Lịch trình vận chuyển
        </Typography.Title>
        <Card>
          <Timeline>
            {order.tracking?.length ? (
              order.tracking.map((event, index) => (
                <Timeline.Item key={index}>
                  {event.date} - {event.status}
                </Timeline.Item>
              ))
            ) : (
              <Timeline.Item>Chưa có thông tin vận chuyển</Timeline.Item>
            )}
          </Timeline>
        </Card>

        <Typography.Title level={4} style={{ textAlign: 'center' }}>
          Sản phẩm trong đơn
        </Typography.Title>
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={order.items}
          renderItem={(item) => (
            <List.Item>
              <Card style={{ textAlign: 'center' }}>
                <img
                  src={JSON.parse(item.sku.image_url)[0]}
                  alt={item.product_name}
                  width={80}
                  height={80}
                />
                <Typography.Text>
                  {item.product_name} - {item.quantity} x{' '}
                  {Number(item.unit_price).toLocaleString()} VND
                </Typography.Text>
              </Card>
            </List.Item>
          )}
        />

        <Typography.Title level={4} style={{ textAlign: 'center' }}>
          Thông tin giao hàng
        </Typography.Title>
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

        <Row justify="center" style={{ marginTop: 20 }}>
          <Space>
            <Button type="primary" onClick={() => navigate('/orders')}>
              Quay lại danh sách đơn hàng
            </Button>
            {order.status !== 'Đã hủy' && (
              <Button
                type="default"
                danger
                onClick={() => setCancelModalVisible(true)}
              >
                Hủy đơn hàng
              </Button>
            )}
          </Space>
        </Row>

        <Modal
          title="Xác nhận hủy đơn hàng"
          open={cancelModalVisible}
          onOk={handleCancelOrder}
          onCancel={() => setCancelModalVisible(false)}
        >
          <Typography.Text>
            Bạn có chắc chắn muốn hủy đơn hàng này không?
          </Typography.Text>
        </Modal>
      </Col>
    </Row>
  )
}

export default OrderDetailPage
