import {
  Table,
  Button,
  InputNumber,
  Card,
  Space,
  Typography,
  Image,
} from 'antd'
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { AppDispatch, RootState } from '@store/store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchCart, removeFromCart } from '@store/slices/cartSlice'
import { CartItem } from '#types/cart'
import { useCheckout } from '@hooks/useCheckout'

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data } = useSelector((state: RootState) => state.cart)
  const items = data?.items || []
  const { handleCheckout } = useCheckout()
  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const handleRemoveItem = async (id: number) => {
    await dispatch(removeFromCart(id))
    await dispatch(fetchCart())
  }

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (_: string, record: CartItem) => (
        <Space>
          <Image
            src={record.sku.image_url[1]}
            alt={record.sku.sku}
            width={50}
            height={50}
          />
          <Typography.Text strong>{record.sku.sku}</Typography.Text>
          <Typography.Text type="secondary">Mã: {record.id}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price: number) => (
        <Typography.Text strong type="danger">
          {price.toLocaleString()} đ
        </Typography.Text>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: string, record: CartItem) => (
        <Space>
          <Button icon={<MinusOutlined />} size="small" />
          <InputNumber min={1} max={100} defaultValue={record.quantity} />
          <Button icon={<PlusOutlined />} size="small" />
        </Space>
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_: string, record: CartItem) => (
        <Typography.Text strong type="danger">
          {(record.unit_price * record.quantity).toLocaleString()} đ
        </Typography.Text>
      ),
    },
    {
      render: (_: string, record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.id)}
        />
      ),
    },
  ]

  return (
    <Card
      title="🛒 Giỏ hàng của bạn"
      bordered={false}
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      <Table
        columns={columns}
        dataSource={items}
        pagination={false}
        rowKey="id"
      />
      <Card bordered={false} style={{ marginTop: '16px', textAlign: 'right' }}>
        <Typography.Title level={4}>
          Tổng tiền:{' '}
          <Typography.Text type="danger" strong>
            {items
              .reduce(
                (total, item) => total + item.unit_price * item.quantity,
                0,
              )
              .toLocaleString()}{' '}
            đ
          </Typography.Text>
        </Typography.Title>
        <Button type="primary" onClick={handleCheckout}>
          Thanh toán
        </Button>
      </Card>
    </Card>
  )
}

export default CartPage
