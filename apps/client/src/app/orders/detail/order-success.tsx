import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Button, Result } from 'antd'

const OrderSuccess = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const orderSuccess = localStorage.getItem('orderSuccess')
    if (!orderSuccess) {
      navigate('/')
    } else {
      localStorage.removeItem('orderSuccess')
    }
  }, [navigate])

  return (
    <Result
      status="success"
      title="Đặt hàng thành công!"
      subTitle="Cảm ơn bạn đã mua hàng. Bạn có thể kiểm tra đơn hàng của mình."
      extra={[
        <Button type="primary" onClick={() => navigate('/orders')}>
          Xem đơn hàng
        </Button>,
        <Button onClick={() => navigate('/')}>Tiếp tục mua sắm</Button>,
      ]}
    />
  )
}

export default OrderSuccess
