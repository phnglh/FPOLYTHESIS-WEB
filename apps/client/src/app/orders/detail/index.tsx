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
import { useNavigate } from 'react-router'

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
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Chờ xác nhận'
    case 'processing':
      return 'Xử lý'
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

const getPaymentStatusLabel = (paymentStatus: string) => {
  switch (paymentStatus) {
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
      return paymentStatus
  }
}

const OrderDetailPage = () => {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const orderId = window.location.pathname.split('/').pop()
    if (!orderId) return

    apiClient
      .get(`/orders/${orderId}`)
      .then((response) => {
        if (response.data.status === 'success') {
          setOrder(response.data.data)
        }
      })
      .catch((error) => console.error('Lỗi khi tải đơn hàng:', error))
      .finally(() => setLoading(false))
  }, [])

  const handleCancelOrder = async () => {
    try {
      if (!order) return
      await dispatch(cancelOrder(order.id)).unwrap()
      setCancelModalVisible(false)
      window.location.reload()
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error)
    }
  }

  const retryPayment = async () => {
    try {
      if (!order) return

      const response = await apiClient.post(`/payment/retry/${order.id}`)
      const resData = response.data

      if (resData.success === true) {
        window.location.href = resData.data.redirect_url
      } else {
        Modal.warning({
          title: 'Không thể thanh toán lại',
          content: resData.message || 'Vui lòng thử lại sau.',
        })
      }
    } catch (error) {
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể thực hiện lại thanh toán. Vui lòng thử lại sau.',
      })
      console.error('Lỗi khi gửi lại thanh toán:', error)
    }
  }

  console.log('order', order)

  if (loading) return <Spin size="large" />
  if (!order) return <Text>Không tìm thấy đơn hàng!</Text>

  return (
    <Layout style={{ padding: '24px', background: '#fff' }}>
      <Content
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: '100px',
        }}
      >
        <Card>
          <Title level={2}>Chi tiết đơn hàng #{order.order_number}</Title>

          <Text
            style={{
              fontSize: '18px',
              lineHeight: '2.8',
              marginBottom: '12px',
            }}
          >
            <Row>
              <Col span={6}>
                <strong>Người nhận:</strong>
              </Col>
              <Col span={18}>{order.address.receiver_name}</Col>
            </Row>
          </Text>

          <Text
            style={{
              fontSize: '18px',
              lineHeight: '2.8',
              marginBottom: '12px',
            }}
          >
            <Row>
              <Col span={6}>
                <strong>Điện thoại:</strong>
              </Col>
              <Col span={18}>{order.address.receiver_phone}</Col>
            </Row>
          </Text>

          <Text
            style={{
              fontSize: '18px',
              lineHeight: '2.8',
              marginBottom: '12px',
            }}
          >
            <Row>
              <Col span={6}>
                <strong>Địa chỉ:</strong>
              </Col>
              <Col span={18}>{order.address.address}</Col>
            </Row>
          </Text>

          <Text
            style={{
              fontSize: '18px',
              lineHeight: '2.8',
              marginBottom: '12px',
            }}
          >
            <Row>
              <Col span={6}>
                <strong>Ngày đặt:</strong>
              </Col>
              <Col span={18}>{order.ordered_at}</Col>
            </Row>
          </Text>

          <Text
            style={{
              fontSize: '18px',
              lineHeight: '2.8',
              marginBottom: '12px',
            }}
          >
            <Row>
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
                          : 'gray'
                  }
                >
                  {getStatusLabel(order.status)}
                </Tag>
              </Col>
            </Row>
          </Text>

          <Text
            style={{
              fontSize: '18px',
              lineHeight: '2.8',
              marginBottom: '12px',
            }}
          >
            <Row>
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
                        : order.payment_status === 'pending'
                          ? 'blue'
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
            </Row>
          </Text>
        </Card>

        <Title level={4}>Sản phẩm trong đơn</Title>
        <Table
          dataSource={[
            ...order.items,
            {
              id: 'total',
              product_name: 'Tổng tiền',
              unit_price: '',
              quantity: '',
              total_price: '',
            },
          ]}
          columns={[
            {
              title: 'Sản phẩm',
              dataIndex: 'product_name',
              key: 'product_name',
              render: (text, record) => (
                <Row>
                  <Col span={4}>
                    {record.id === 'total' ? null : (
                      <img src={record?.sku?.image_url} alt={text} width={50} />
                    )}
                  </Col>
                  <Col span={20}>{text}</Col>
                </Row>
              ),
            },
            { title: 'Đơn giá', dataIndex: 'unit_price', key: 'unit_price' },
            { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
            {
              title: 'Thành tiền',
              dataIndex: 'total_price',
              key: 'total_price',
              render: (text, record) => {
                if (record.id === 'total') {
                  return `${order.items.reduce((total, item) => total + Number(item.unit_price) * item.quantity, 0).toLocaleString()} VND`
                }
                return `${(Number(record.unit_price) * record.quantity).toLocaleString()} VND`
              },
            },
          ]}
          rowKey="id"
        />

        <Row justify="center" gutter={16} style={{ marginTop: '16px' }}>
          <Col span={8}>
            <Button
              type="primary"
              style={{ width: '100%' }}
              onClick={() => (window.location.href = '/account')}
            >
              Quay lại
            </Button>
          </Col>

          {['pending', 'processing'].includes(order.status) && (
            <Col span={8}>
              <Button
                type="default"
                danger
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
                type="primary"
                danger
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
