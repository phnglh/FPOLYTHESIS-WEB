import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Avatar, Button, Layout, Typography, Flex } from 'antd'
import React, { useState } from 'react'
import { Outlet } from 'react-router'
import { Sidebar } from './components/SideBar'
import ProfileTab from '@layout/Profile'
import { useSelector } from 'react-redux'
import { RootState } from '@store/store'
import AppBreadcrumb from '@layout/components/common/AppBreadcrumb'

const { Title } = Typography
const { Header, Sider, Content } = Layout

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)
  const [open, setOpen] = useState(false)

  const avatarSrc =
    user?.avatar ||
    'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg'

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
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
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '18px' }}
          />
          <Avatar
            src={avatarSrc}
            size="large"
            style={{ cursor: 'pointer' }}
            onClick={showDrawer}
          />
          <ProfileTab open={open} onClose={onClose} user={user} />
        </Header>
        <Content style={{ padding: '24px', background: '#fff' }}>
          <AppBreadcrumb />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
