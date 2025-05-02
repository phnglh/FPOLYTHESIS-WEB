import { useEffect, useState } from 'react'
import {
  Layout,
  Card,
  Typography,
  Table,
  Spin,
  Tag,
  Button,
  Modal,
  Row,
  Col,
} from 'antd'
import apiClient from '@store/services/apiClient.ts'
import { useDispatch } from 'react-redux'
import { cancelOrder } from '@store/slices/orderSlice'
import { AppDispatch } from '@store/store'
import { useNavigate, useParams } from 'react-router'

const { Title, Text } = Typography
const { Content } = Layout

interface OrderDetail {
  id: number
  order_number: string
  ordered_at: string
  final_total: string
  status: string
  payment_status: string
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
  discount: string
  shipping_fee: string
  user: {
    name: string
    email: string
  }
  payment: {
    payment_method: string
    paid_at: string | null
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Chờ xác nhận'
    case 'processing':
      return 'Đang xử lý'
    case 'cancelled':
      return 'Đã hủy'
    case 'shipped':
      return 'Đang giao'
    case 'delivered':
      return 'Đã giao hàng'
    case 'returned':
      return 'Đã trả lại'
    default:
      return status
  }
}

const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case 'unpaid':
      return 'Chưa thanh toán'
    case 'pending':
      return 'Chờ xác nhận'
    case 'paid':
      return 'Thanh toán thành công'
    case 'failed':
      return 'Thanh toán thất bại'
    case 'refunded':
      return 'Đã hoàn tiền'
    default:
      return status
  }
}

const OrderDetailPage = () => {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return

    apiClient
      .get(`/customer/orders/${id}`)
      .then((res) => {
        if (res.data.status === 'success') {
          setOrder(res.data.data)
        }
      })
      .catch((err) => console.error('Lỗi khi lấy đơn hàng:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleCancelOrder = async () => {
    if (!order) return
    try {
      await dispatch(cancelOrder(order.id)).unwrap()
      setCancelModalVisible(false)
      window.location.reload()
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error)
    }
  }

  const retryPayment = async () => {
    if (!order) return
    try {
      const res = await apiClient.post(`/payment/retry/${order.id}`)
      if (res.data.success) {
        window.location.href = res.data.data.redirect_url
      } else {
        Modal.warning({
          title: 'Không thể thanh toán lại',
          content: res.data.message || 'Vui lòng thử lại sau.',
        })
      }
    } catch (err) {
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể thực hiện lại thanh toán. Vui lòng thử lại sau.',
      })
    }
  }

  if (loading) return <Spin size="large" />
  if (!order) return <Text>Không tìm thấy đơn hàng!</Text>

  return (
    <Layout style={{ padding: 24, background: '#fff' }}>
      <Content style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Card>
          <Title level={2}>Chi tiết đơn hàng #{order.order_number}</Title>

          <Row gutter={[0, 12]}>
            <Col span={6}>
              <strong>Người nhận:</strong>
            </Col>
            <Col span={18}>{order.address.receiver_name}</Col>

            <Col span={6}>
              <strong>Điện thoại:</strong>
            </Col>
            <Col span={18}>{order.address.receiver_phone}</Col>

            <Col span={6}>
              <strong>Địa chỉ:</strong>
            </Col>
            <Col span={18}>{order.address.address}</Col>

            <Col span={6}>
              <strong>Email người đặt:</strong>
            </Col>
            <Col span={18}>{order.user.email}</Col>

            <Col span={6}>
              <strong>Ngày đặt:</strong>
            </Col>
            <Col span={18}>{order.ordered_at}</Col>

            <Col span={6}>
              <strong>Trạng thái đơn hàng:</strong>
            </Col>
            <Col span={18}>
              <Tag
                color={
                  order.status === 'pending' || order.status === 'processing'
                    ? 'blue'
                    : order.status === 'cancelled'
                      ? 'red'
                      : order.status === 'shipped' ||
                          order.status === 'delivered'
                        ? 'green'
                        : 'default'
                }
              >
                {getStatusLabel(order.status)}
              </Tag>
            </Col>

            <Col span={6}>
              <strong>Trạng thái thanh toán:</strong>
            </Col>
            <Col span={18}>
              <Tag
                color={
                  order.payment_status === 'paid'
                    ? 'green'
                    : order.payment_status === 'unpaid'
                      ? 'red'
                      : order.payment_status === 'failed'
                        ? 'orange'
                        : order.payment_status === 'refunded'
                          ? 'purple'
                          : 'default'
                }
              >
                {getPaymentStatusLabel(order.payment_status)}
              </Tag>
            </Col>

            <Col span={6}>
              <strong>Phương thức thanh toán:</strong>
            </Col>
            <Col span={18}>{order.payment.payment_method.toUpperCase()}</Col>

            <Col span={6}>
              <strong>Giảm giá:</strong>
            </Col>
            <Col span={18}>{Number(order.discount).toLocaleString()} VND</Col>

            <Col span={6}>
              <strong>Phí vận chuyển:</strong>
            </Col>
            <Col span={18}>
              {Number(order.shipping_fee).toLocaleString()} VND
            </Col>

            <Col span={6}>
              <strong>Tổng cộng:</strong>
            </Col>
            <Col span={18}>
              <strong>{Number(order.final_total).toLocaleString()} VND</strong>
            </Col>
          </Row>
        </Card>

        <Title level={4} style={{ marginTop: 24 }}>
          Sản phẩm trong đơn
        </Title>

        <Table
          dataSource={order.items}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: 'Sản phẩm',
              dataIndex: 'product_name',
              render: (text, record) => (
                <Row>
                  <Col span={4}>
                    <img src={record.sku?.image_url} width={50} alt={text} />
                  </Col>
                  <Col span={20}>{text}</Col>
                </Row>
              ),
            },
            {
              title: 'Đơn giá',
              dataIndex: 'unit_price',
              render: (text) => `${Number(text).toLocaleString()} VND`,
            },
            {
              title: 'Số lượng',
              dataIndex: 'quantity',
            },
            {
              title: 'Thành tiền',
              render: (_, record) =>
                `${(Number(record.unit_price) * record.quantity).toLocaleString()} VND`,
            },
          ]}
        />

        <Row justify="center" gutter={16} style={{ marginTop: 24 }}>
          <Col span={8}>
            <Button
              type="primary"
              style={{ width: '100%' }}
              onClick={() => navigate('/account')}
            >
              Quay lại
            </Button>
          </Col>

          {['pending', 'processing'].includes(order.status) && (
            <Col span={8}>
              <Button
                danger
                type="default"
                style={{ width: '100%' }}
                onClick={() => setCancelModalVisible(true)}
              >
                Hủy đơn hàng
              </Button>
            </Col>
          )}

          {order.payment_status === 'failed' && (
            <Col span={8}>
              <Button
                danger
                type="primary"
                style={{ width: '100%' }}
                onClick={retryPayment}
              >
                Thanh toán lại
              </Button>
            </Col>
          )}
        </Row>

        <Modal
          title="Xác nhận hủy đơn hàng"
          open={cancelModalVisible}
          onOk={handleCancelOrder}
          onCancel={() => setCancelModalVisible(false)}
        >
          <Text>Bạn có chắc chắn muốn hủy đơn hàng này không?</Text>
        </Modal>
      </Content>
    </Layout>
  )
}

export default OrderDetailPage
