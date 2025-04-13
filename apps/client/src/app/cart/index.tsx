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
import { useEffect, useState } from 'react'
import {
  decrementCartItem,
  fetchCart,
  incrementCartItem,
  removeFromCart,
  updateCartItem,
} from '@store/slices/cartSlice'
import { CartItem } from '#types/cart'
import { useNavigate } from 'react-router'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'
import { toast } from 'react-toastify'

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { formatCurrency } = useCurrencyFormatter()
  const { data } = useSelector((state: RootState) => state.cart)
  const items = data?.items || []
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  useEffect(() => {
    setSelectedRowKeys([]) // Reset selected keys if items change
  }, [items])

  const handleUpdateQuantity = (id: number, quantity: number) => {
    // Update quantity and keep the selected items intact
    dispatch(updateCartItem({ id, quantity })).then(() => {
      dispatch(fetchCart()) // Re-fetch cart data
    })
  }

  const handleIncrement = (id: number) => {
    dispatch(incrementCartItem(id)).then(() => {
      dispatch(fetchCart())
    })
  }

  const handleDecrement = (id: number, quantity: number) => {
    if (quantity > 1) {
      dispatch(decrementCartItem(id)).then(() => {
        dispatch(fetchCart())
      })
    }
  }

  const handleRemoveItem = async (id: number) => {
    await dispatch(removeFromCart(id))
    await dispatch(fetchCart())
  }

  const handleSelectChange = (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectChange,
  }

  const selectedItems = items.filter((item) =>
    selectedRowKeys.includes(item.id),
  )

  const totalAmount = selectedItems.reduce(
    (total, item) => total + item.unit_price * item.quantity,
    0,
  )

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.warning('Vui lòng chọn sản phẩm để thanh toán!')
      return
    }

    const checkoutData = selectedItems.map((item) => ({
      id: item.id,
      name: item.product_name,
      sku_id: item.sku.id,
      sku: item.sku.sku,
      price: item.unit_price,
      quantity: item.quantity,
      image_url: item.sku.image_url,
      attributes: item.sku.attributes.map((attr) => ({
        id: attr.id,
        name: attr.name,
        value: attr.value,
      })),
    }))
    localStorage.setItem('checkout_items', JSON.stringify(checkoutData))
    navigate('/checkout')
  }

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'product',
      key: 'product',
      render: (_: string, record: CartItem) => (
        <Space>
          <Image
            src={record?.sku.image_url}
            alt={record.sku.sku}
            width={50}
            height={50}
          />
        </Space>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'product_name',
      render: (_: string, record: CartItem) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{record.sku?.product?.name}</Typography.Text>
          <Typography.Text type="secondary">{record.sku.sku}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price: number) => (
        <Typography.Text strong type="danger">
          {formatCurrency(price)}
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
          {formatCurrency(record.unit_price * record.quantity)}
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
        rowSelection={rowSelection}
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
            {formatCurrency(totalAmount)} đ
          </Typography.Text>
        </Typography.Title>
        <Button
          type="primary"
          onClick={handleCheckout}
          disabled={selectedItems.length === 0}
        >
          Thanh toán
        </Button>
      </Card>
    </Card>
  )
}

export default CartPage
