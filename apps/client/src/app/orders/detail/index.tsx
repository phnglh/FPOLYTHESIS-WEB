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
import apiClient from '@store/services/apiClient'
import { useDispatch } from 'react-redux'
import { cancelOrder } from '@store/slices/orderSlice'
import { AppDispatch } from '@store/store'
import { useNavigate } from 'react-router'

const { Title, Text } = Typography
const { Content } = Layout

interface OrderItem {
  id: number
  product_name: string
  unit_price: string
  quantity: number
  total_price: string
  sku: { image_url: string }
}

interface AddressInfo {
  receiver_name: string
  receiver_phone: string
  address: string
}

interface OrderDetail {
  id: number
  order_number: string
  ordered_at: string
  final_total: string
  status: string
  payment_status: string
  items: OrderItem[]
  address: AddressInfo
}

const statusColors: Record<string, string> = {
  pending: 'blue',
  processing: 'blue',
  cancelled: 'red',
  shipped: 'green',
  delivered: 'green',
  returned: 'gray',
}

const paymentColors: Record<string, string> = {
  unpaid: 'red',
  pending: 'blue',
  paid: 'green',
  failed: 'orange',
  refunded: 'purple',
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Chờ xác nhận',
    processing: 'Xử lý',
    cancelled: 'Đã hủy',
    shipped: 'Đang giao',
    delivered: 'Đã giao hàng',
    returned: 'Đã trả lại',
  }
  return labels[status] || status
}

const getPaymentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    unpaid: 'Chưa thanh toán',
    pending: 'Chờ xác nhận',
    paid: 'Thanh toán thành công',
    failed: 'Thanh toán thất bại',
    refunded: 'Đã hoàn tiền',
  }
  return labels[status] || status
}

const OrderDetailPage = () => {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  useEffect(() => {
    const orderId = window.location.pathname.split('/').pop()
    if (!orderId) return

    apiClient
      .get(`/orders/${orderId}`)
      .then(({ data }) => {
        if (data.status === 'success') setOrder(data.data)
      })
      .catch((err) => console.error('Lỗi khi tải đơn hàng:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleCancelOrder = async () => {
    if (!order) return
    try {
      await dispatch(cancelOrder(order.id)).unwrap()
      setCancelModalVisible(false)
      window.location.reload()
    } catch (err) {
      console.error('Lỗi khi hủy đơn hàng:', err)
    }
  }

  const retryPayment = async () => {
    if (!order) return
    try {
      const { data } = await apiClient.post(`/payment/retry/${order.id}`)
      if (data.status === 'success') {
        localStorage.setItem('checkout', JSON.stringify(order.items))
        navigate('/checkout')
      } else {
        Modal.warning({
          title: 'Không thể thanh toán lại',
          content: data.message || 'Vui lòng thử lại sau.',
        })
      }
    } catch (err) {
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể thực hiện lại thanh toán. Vui lòng thử lại sau.',
      })
      console.error('Lỗi khi gửi lại thanh toán:', err)
    }
  }

  if (loading) return <Spin size="large" />
  if (!order) return <Text>Không tìm thấy đơn hàng!</Text>

  const detailRows = [
    { label: 'Người nhận', value: order.address.receiver_name },
    { label: 'Điện thoại', value: order.address.receiver_phone },
    { label: 'Địa chỉ', value: order.address.address },
    { label: 'Ngày đặt', value: order.ordered_at },
    {
      label: 'Trạng thái đơn hàng',
      value: (
        <Tag color={statusColors[order.status]}>
          {getStatusLabel(order.status)}
        </Tag>
      ),
    },
    {
      label: 'Trạng thái thanh toán',
      value: (
        <Tag color={paymentColors[order.payment_status]}>
          {getPaymentStatusLabel(order.payment_status)}
        </Tag>
      ),
    },
  ]

  return (
    <Layout style={{ padding: '24px', background: '#fff' }}>
      <Content
        style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '100px' }}
      >
        <Card>
          <Title level={2}>Chi tiết đơn hàng #{order.order_number}</Title>
          {detailRows.map(({ label, value }) => (
            <Row
              key={label}
              style={{ fontSize: 18, lineHeight: 2.8, marginBottom: 12 }}
            >
              <Col span={6}>
                <strong>{label}:</strong>
              </Col>
              <Col span={18}>{value}</Col>
            </Row>
          ))}
        </Card>

        <Title level={4} style={{ marginTop: 32 }}>
          Sản phẩm trong đơn
        </Title>
        <Table
          dataSource={order.items}
          columns={[
            {
              title: 'Sản phẩm',
              dataIndex: 'product_name',
              render: (text, record) => (
                <Row gutter={8} align="middle">
                  <Col>
                    {record.sku?.image_url && (
                      <img src={record.sku.image_url} alt={text} width={50} />
                    )}
                  </Col>
                  <Col>{text}</Col>
                </Row>
              ),
            },
            { title: 'Đơn giá', dataIndex: 'unit_price' },
            { title: 'Số lượng', dataIndex: 'quantity' },
            {
              title: 'Thành tiền',
              render: (_, record) =>
                `${(Number(record.unit_price) * record.quantity).toLocaleString()} VND`,
            },
          ]}
          rowKey="id"
          pagination={false}
        />

        <Row justify="center" gutter={16} style={{ marginTop: 24 }}>
          <Col span={8}>
            <Button type="primary" block onClick={() => navigate('/account')}>
              Quay lại
            </Button>
          </Col>
          {['pending', 'processing'].includes(order.status) && (
            <Col span={8}>
              <Button danger block onClick={() => setCancelModalVisible(true)}>
                Hủy đơn hàng
              </Button>
            </Col>
          )}
          {order.payment_status === 'failed' && (
            <Col span={8}>
              <Button type="primary" danger block onClick={retryPayment}>
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
