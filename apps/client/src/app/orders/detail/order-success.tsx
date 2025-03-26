import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, Result } from 'antd'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const orderSuccess = localStorage.getItem('orderSuccess')
    if (!orderSuccess) {
      navigate('/')
    } else {
      setIsValid(true)
    }
  }, [navigate])

  const handleNavigation = (path: string) => {
    localStorage.removeItem('orderSuccess')
    navigate(path)
  }

  if (!isValid) return null

  return (
    <Result
      status="success"
      title="Đặt hàng thành công!"
      subTitle="Cảm ơn bạn đã mua hàng. Bạn có thể kiểm tra đơn hàng của mình."
      extra={[
        <Button type="primary" onClick={() => handleNavigation('/orders')}>
          Xem đơn hàng
        </Button>,
        <Button onClick={() => handleNavigation('/')}>Tiếp tục mua sắm</Button>,
      ]}
    />
  )
}

export default OrderSuccess
