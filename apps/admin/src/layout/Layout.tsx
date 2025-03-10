import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Dropdown, Layout, Typography, Space, Flex } from 'antd'
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { Sidebar } from './components/SideBar'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { logout } from '@store/slices/authSlice'
import { useAppToast } from '@hooks/useAppToast'

const { Title, Text } = Typography
const { Header, Sider, Content } = Layout

const AdminLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { success } = useAppToast()
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)
  const avatarSrc =
    user?.avatar ||
    'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg'

  // Xử lý logout
  const handleMenuClick = async ({ key }: { key: string }) => {
    if (key === 'logout') {
      try {
        await dispatch(logout()).unwrap()
        success('Đăng xuất thành công!', { onClose: () => navigate('/login') })
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
  }

  const profileMenu = {
    items: [
      {
        key: 'profile',
        label: <span>Hồ sơ</span>,
      },
      {
        key: 'logout',
        label: <span>Đăng xuất</span>,
      },
    ],
    onClick: handleMenuClick,
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={250}
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ borderRight: '1px solid #f0f0f0' }}
      >
        <Flex
          align="center"
          justify="center"
          style={{
            padding: collapsed ? '12px 8px' : '16px',
          }}
        >
          <Title
            level={collapsed ? 5 : 4}
            style={{
              margin: 0,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {collapsed ? 'FL' : 'Flames Management'}
          </Title>
        </Flex>

        <Sidebar />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '18px' }}
          />

          <Dropdown menu={profileMenu} placement="bottomRight" arrow>
            <Space align="center" size="middle" style={{ cursor: 'pointer' }}>
              <Avatar size="large" src={avatarSrc} icon={<UserOutlined />} />
              {!collapsed && <Text strong>{user?.name || ''}</Text>}
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
