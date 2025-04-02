import { useEffect, useState } from 'react'
import { Layout, Menu, Card, Typography, Avatar, Table, Spin, Tag } from 'antd'
import {
  UserOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import apiClient from '@store/services/apiClient.ts'

const { Title, Text } = Typography
const { Sider, Content } = Layout

interface Order {
  id: number
  order_number: string
  ordered_at: string
  final_total: string
  status: string
}

export default function ProfilePage() {
  const [selectedMenu, setSelectedMenu] = useState('info')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (selectedMenu === 'orders') {
      setLoading(true)
      apiClient
        .get('/orders')
        .then((response) => {
          if (response.data.status === 'success') {
            setOrders(response.data.data.data)
          }
        })
        .catch((error) => console.error('Lỗi khi tải đơn hàng:', error))
        .finally(() => setLoading(false))
    }
  }, [selectedMenu])

  const statusColors: Record<string, string> = {
    processing: 'blue',
    pending: 'orange',
    completed: 'green',
    cancelled: 'red',
  }

  const orderColumns = [
    { title: 'Mã đơn hàng', dataIndex: 'order_number', key: 'order_number' },
    { title: 'Ngày đặt', dataIndex: 'ordered_at', key: 'ordered_at' },
    {
      title: 'Tổng tiền',
      dataIndex: 'final_total',
      key: 'final_total',
      render: (total: string) => `${Number(total).toLocaleString()} VND`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status] || 'default'}>{status}</Tag>
      ),
    },
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
            Danh sách đơn hàng
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: '24px' }}>
        <Content>
          <Card>
            {selectedMenu === 'info' && (
              <>
                <Avatar size={64} icon={<UserOutlined />} />
                <Title level={3}>Người dùng</Title>
                <Text>user@example.com</Text>
              </>
            )}

            {selectedMenu === 'orders' && (
              <>
                <Title level={4}>Danh sách đơn hàng</Title>
                {loading ? (
                  <Spin size="large" />
                ) : (
                  <Table
                    dataSource={orders || []}
                    columns={orderColumns}
                    rowKey="id"
                  />
                )}
              </>
            )}
          </Card>
        </Content>
      </Layout>
    </Layout>
  )
}
