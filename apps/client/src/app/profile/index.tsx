import React, { useState, useEffect } from 'react'
import { Layout, Menu, Card, Typography, Avatar, Table, Spin } from 'antd'
import {
  UserOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '@store/slices/authSlice'
import { fetchOrders } from '@store/slices/orderSlice'
import { AppDispatch, RootState } from '@store/store'
import { Link } from 'react-router'

const { Title, Text } = Typography
const { Sider, Content } = Layout

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading: userLoading } = useSelector(
    (state: RootState) => state.auth,
  )
  const { orders, loading: ordersLoading } = useSelector(
    (state: RootState) => state.order,
  )

  const [selectedMenu, setSelectedMenu] = useState('info')
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null)

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  useEffect(() => {
    if (selectedMenu === 'orders') {
      dispatch(fetchOrders())
    }
  }, [selectedMenu, dispatch])

  if (userLoading || !user) {
    return <Spin />
  }

  const orderColumns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id' },
    { title: 'Ngày đặt', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Tổng tiền', dataIndex: 'totalPrice', key: 'totalPrice' },
    {
      title: 'Hành động',
      key: 'action',
      render: (record: any) => (
        <a onClick={() => setSelectedOrder(record.id)}>Xem chi tiết</a>
      ),
    },
  ]

  const orderDetailColumns = [
    { title: 'Sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Đơn giá', dataIndex: 'price', key: 'price' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Thành tiền', dataIndex: 'totalPrice', key: 'totalPrice' },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light">
        <Menu
          mode="inline"
          defaultSelectedKeys={['info']}
          onClick={(e) => setSelectedMenu(e.key)}
        >
          <Menu.Item key="info" icon={<UserOutlined />}>
            Thông tin cá nhân
          </Menu.Item>
          <Menu.Item key="address" icon={<HomeOutlined />}>
            Địa chỉ
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
            <Link to="/account/orders">Danh sách đơn hàng</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: '24px' }}>
        <Content>
          <Card>
            {selectedMenu === 'info' && (
              <>
                <Avatar size={64} icon={<UserOutlined />} />
                <Title level={3}>{user.name}</Title>
                <Text>{user.email}</Text>
              </>
            )}

            {selectedMenu === 'address' && (
              <>
                <Title level={4}>Địa chỉ giao hàng</Title>
              </>
            )}
          </Card>
        </Content>
      </Layout>
    </Layout>
  )
}
