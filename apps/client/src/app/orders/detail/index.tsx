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

const { Title, Text } = Typography
const { Content } = Layout

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

  if (loading) return <Spin size="large" />
  if (!order) return <Text>Không tìm thấy đơn hàng!</Text>

  return (
    <Layout style={{ padding: '24px', background: '#fff' }}>
      <Content>
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
                <strong>Trạng thái:</strong>
              </Col>
              <Col span={18}>
                <Tag
                  color={
                    order.status === 'pending' || order.status === 'processing'
                      ? 'blue'
                      : 'red'
                  }
                >
                  {order.status}
                </Tag>
              </Col>
            </Row>
          </Text>
        </Card>

        <Title level={4}>Sản phẩm trong đơn</Title>
        <Table
          dataSource={order.items}
          columns={[
            {
              title: 'Sản phẩm',
              dataIndex: 'product_name',
              key: 'product_name',
              render: (text, record) => (
                <Row>
                  <Col span={4}>
                    <img
                      src={JSON.parse(record.sku.image_url)[0]}
                      alt={text}
                      width={50}
                    />
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
              render: (total_price: string) =>
                `${Number(total_price).toLocaleString()} VND`,
            },
          ]}
          rowKey="id"
        />

        <Row justify="center" style={{ marginTop: 20 }}>
          <Button
            type="primary"
            onClick={() => (window.location.href = '/account/orders')}
          >
            Quay lại danh sách đơn hàng
          </Button>
          {['pending', 'processing'].includes(order.status) && (
            <Button
              type="default"
              danger
              onClick={() => setCancelModalVisible(true)}
            >
              Hủy đơn hàng
            </Button>
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
