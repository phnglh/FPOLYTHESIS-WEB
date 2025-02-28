import React, { useState } from 'react'
import { Table, Button, InputNumber, Card } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

const Cart = () => {
  const [cart, setCart] = useState([
    {
      key: '1',
      image: 'https://via.placeholder.com/50', // Thay bằng link ảnh thật
      name: 'Áo lót giữ nhiệt đá bóng Keepdry cho người lớn',
      size: 'XL',
      price: 395000,
      quantity: 1,
    },
  ])

  const updateQuantity = (key: string, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item,
    )
    setCart(updatedCart)
  }

  const removeItem = (key: string) => {
    setCart(cart.filter((item) => item.key !== key))
  }

  const columns = [
    {
      title: 'Thông tin sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={record.image} alt={record.name} style={{ width: 50 }} />
          <div>
            <div>{record.name}</div>
            <div>{record.size}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <span style={{ color: 'red' }}>{price.toLocaleString()}đ</span>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            onClick={() => updateQuantity(record.key, record.quantity - 1)}
          >
            -
          </Button>
          <InputNumber
            min={1}
            value={record.quantity}
            onChange={(value) => updateQuantity(record.key, value || 1)}
          />
          <Button
            onClick={() => updateQuantity(record.key, record.quantity + 1)}
          >
            +
          </Button>
        </div>
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'total',
      render: (_: any, record: any) => (
        <span style={{ color: 'red' }}>
          {(record.price * record.quantity).toLocaleString()}đ
        </span>
      ),
    },
    {
      render: (_: any, record: any) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.key)}
        />
      ),
    },
  ]

  return (
    <div style={{ maxWidth: '900px', margin: 'auto' }}>
      <h2>Giỏ hàng của bạn</h2>
      <Table columns={columns} dataSource={cart} pagination={false} />
      <Card style={{ marginTop: 16, textAlign: 'right' }}>
        <h3>
          Tổng tiền:{' '}
          <span style={{ color: 'red' }}>
            {cart
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toLocaleString()}
            đ
          </span>
        </h3>
        <Button
          type="primary"
          style={{ backgroundColor: 'black', color: 'white' }}
        >
          Thanh toán
        </Button>
      </Card>
    </div>
  )
}

export default Cart
