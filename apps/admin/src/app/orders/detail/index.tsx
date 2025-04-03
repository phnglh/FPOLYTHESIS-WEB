import { Card, Descriptions, Button, message } from 'antd'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { useEffect } from 'react'
import { fetchOrderById } from '@store/slices/orderSlice'

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { data } = useSelector((state: RootState) => state.orders)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (id) {
      const orderId = Number(id)
      if (!isNaN(orderId)) {
        dispatch(fetchOrderById(orderId))
      } else {
        console.error('ID không hợp lệ')
      }
    }
  }, [dispatch, id])

  return (
    <Card title={`Chi tiết đơn hàng ${data.id}`}>
      <Descriptions bordered>
        <Descriptions.Item label="Khách hàng">
          {data.user?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {data.final_total} đ
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đặt hàng">
          {data.created_at}
        </Descriptions.Item>
      </Descriptions>
      <Button type="primary" style={{ marginTop: 20 }}>
        Gửi thông báo cho khách hàng
      </Button>
    </Card>
  )
}

export default OrderDetails
