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
import {
  decrementCartItem,
  fetchCart,
  incrementCartItem,
  removeFromCart,
  updateCartItem,
} from '@store/slices/cartSlice'
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

  const handleUpdateQuantity = (id: number, quantity: number) => {
    dispatch(updateCartItem({ id, quantity })).then(() => dispatch(fetchCart()))
  }

  const handleIncrement = (id: number) => {
    dispatch(incrementCartItem(id)).then(() => dispatch(fetchCart()))
  }

  const handleDecrement = (id: number, quantity: number) => {
    if (quantity > 1) {
      dispatch(decrementCartItem(id)).then(() => dispatch(fetchCart()))
    }
  }

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
            src={
              Array.isArray(record?.sku.image_url)
                ? record?.sku.image_url[0]
                : JSON.parse(record?.sku.image_url)[0]
            }
            alt={record.sku.sku}
            width={50}
            height={50}
          />
          <div>
            <Typography.Text strong>
              {record.sku?.product?.name}
            </Typography.Text>
            <Typography.Text type="secondary">
              SKU: {record.sku.sku}
            </Typography.Text>
          </div>
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
          <Button
            icon={<MinusOutlined />}
            size="small"
            onClick={() => handleDecrement(record.id, record.quantity)}
          />
          <InputNumber
            min={1}
            max={100}
            value={record.quantity}
            onChange={(value) => handleUpdateQuantity(record.id, value ?? 1)}
          />
          <Button
            icon={<PlusOutlined />}
            size="small"
            onClick={() => handleIncrement(record.id)}
          />
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
      variant="borderless"
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      <Table
        columns={columns}
        dataSource={items}
        pagination={false}
        rowKey="id"
      />
      <Card
        variant="borderless"
        style={{ marginTop: '16px', textAlign: 'right' }}
      >
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
