import { Table, Button, InputNumber, Card, Space, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { AppDispatch, RootState } from '@store/store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchCart, removeFromCart } from '@store/slices/cartSlice'
import { CartItem } from '#types/cart'
import { useNavigate } from 'react-router'

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data } = useSelector((state: RootState) => state.cart)
  const items = data?.items || []
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const handleRemoveItem = async (id: number) => {
    await dispatch(removeFromCart(id))
    await dispatch(fetchCart())
  }

  const handleCheckout = () => {
    const selectedItems = items.map((item) => ({
      sku_id: item.sku_id,
      name: item.sku.sku,
      price: item.unit_price,
      quantity: item.quantity,
      image: item.sku.image_url,
    }))

    localStorage.setItem('checkout_items', JSON.stringify(selectedItems))
    navigate('/checkout')
  }

  const columns = [
    {
      title: 'Thông tin sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (_: any, record: CartItem) => (
        <div className="flex items-center gap-3">
          <img
            src={record.sku.image_url[1]}
            alt={record.sku.sku}
            className="w-12 h-12 object-cover"
          />
          <div>
            <div className="font-medium">{record.sku.sku}</div>
            <div className="text-gray-500 text-sm">Mã: {record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price: number) => `${price.toLocaleString()} đ`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: any, record: CartItem) => (
        <Space>
          <Button>-</Button>
          <InputNumber
            min={1}
            max={100}
            defaultValue={record.quantity}
            className="w-14 text-center"
          />
          <Button>+</Button>
        </Space>
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_: any, record: CartItem) => (
        <span className="text-red-600 font-semibold">
          {(record.unit_price * record.quantity).toLocaleString()} đ
        </span>
      ),
    },
    {
      render: (_: any, record: CartItem) => (
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
    <div className="max-w-3xl mx-auto">
      <h2 className="text-left text-black text-2xl mb-4">Giỏ hàng của bạn</h2>

      <Table
        columns={columns}
        dataSource={items}
        pagination={false}
        rowKey="id"
      />

      <Card className="mt-4 text-right">
        <Typography.Title level={4} className="flex justify-between">
          <span>Tổng tiền:</span>
          <span className="text-red-600">
            {items
              .reduce(
                (total, item) => total + item.unit_price * item.quantity,
                0,
              )
              .toLocaleString()}{' '}
            đ
          </span>
        </Typography.Title>

        <Button
          type="primary"
          className="bg-black text-white"
          onClick={handleCheckout}
        >
          Thanh toán
        </Button>
      </Card>
    </div>
  )
}

export default CartPage
