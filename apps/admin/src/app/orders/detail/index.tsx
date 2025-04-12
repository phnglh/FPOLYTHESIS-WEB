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
  Modal,
} from 'antd'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { useEffect } from 'react'
import { fetchOrderById } from '@store/slices/orderSlice'
import { ColumnsType } from 'antd/es/table'
import apiClient from '@store/services/apiClient'
import { toast } from 'react-toastify'

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
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (id) {
      const orderId = Number(id)
      if (!isNaN(orderId)) {
        dispatch(fetchOrderById(orderId))
      } else {
        toast.error('ID không hợp lệ')
      }
    }
  }, [dispatch, id])

  const handleCancelOrder = async () => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      okText: 'Hủy đơn',
      okType: 'danger',
      cancelText: 'Không',
      async onOk() {
        try {
          await apiClient.delete(`/orders/${id}`)
          message.success('Đã hủy đơn hàng thành công')
          dispatch(fetchOrderById(Number(id)))
        } catch (error) {
          console.error('Error cancelling order:', error)
          toast.error('Không thể hủy đơn hàng. Vui lòng thử lại.')
        }
      },
    })
  }

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

  const canCancel = ['pending', 'processing'].includes(order?.status)

  return (
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
        {canCancel && (
          <Button danger onClick={handleCancelOrder}>
            Hủy đơn
          </Button>
        )}
      </Space>
    </Card>
  )
}

export default OrderDetails
