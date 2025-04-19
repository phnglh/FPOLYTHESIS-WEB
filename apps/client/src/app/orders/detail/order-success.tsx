import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { Button, Result } from 'antd'

const OrderStatus = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [orderId, setOrderId] = useState('')
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const success = params.get('success')
    const msg = params.get('message')
    const orderNum = params.get('order_number')
    const id = params.get('id')
    if (success === '1') {
      setIsSuccess(true)
    } else {
      setIsSuccess(false)
    }
    setOrderId(id)
    setMessage(msg || '')
    setOrderNumber(orderNum || '')
  }, [location.search])

  return isSuccess ? (
    <Result
      status="success"
      title="Đặt hàng thành công!"
      subTitle={message + (orderNumber ? ` (Mã đơn hàng: ${orderNumber})` : '')}
      extra={[
        <Button
          type="primary"
          onClick={() => navigate(`/account/orders/${orderId}`)}
        >
          Xem đơn hàng
        </Button>,
        <Button onClick={() => navigate('/products')}>Tiếp tục mua sắm</Button>,
      ]}
    />
  ) : (
    <Result
      status="error"
      title="Thanh toán thất bại"
      subTitle={message || 'Có lỗi xảy ra trong quá trình thanh toán.'}
      extra={[
        <Button type="primary" onClick={() => navigate('/')}>
          Trở về trang chủ
        </Button>,
      ]}
    />
  )
}

export default OrderStatus
