import { Avatar, Button, Divider, Drawer, Space, Typography, List } from 'antd'
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  PlusOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import { Link, useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { logout } from '@store/slices/authSlice'
import { AppDispatch } from '@store/store'
import { User } from '#types/user'

const { Title, Text } = Typography

type Props = {
  open: boolean
  onClose: () => void
  user: User | null
}
const ProfileTab = ({ open, onClose, user }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }
  const menuItems = [
    { icon: <HomeOutlined />, label: 'Dashboard', path: '/' },
    { icon: <UserOutlined />, label: 'Profile', path: '/profile' },
    {
      icon: <ShoppingOutlined />,
      label: 'Sản phẩm',
      path: '/products',
    },
    { icon: <SettingOutlined />, label: 'Account settings' },
  ]

  const avatars = [
    user?.avatar ||
      'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg',
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
  ]

  return (
    <Drawer
      title={null}
      placement="right"
      closable={false}
      onClose={onClose}
      open={open}
      width={300}
      style={{
        padding: '24px 16px',
      }}
    >
      <Space
        direction="vertical"
        size="middle"
        style={{ width: '100%' }}
        align="center"
      >
        <Avatar src={user?.avatar} size={80} />
        <div style={{ textAlign: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            {user?.name || 'Jaydon Frankie'}
          </Title>
          <Text type="secondary">{user?.email || 'demo@minimals.cc'}</Text>
        </div>

        {/* Multi-avatars */}
        <Space>
          {avatars.map((avt, idx) => (
            <Avatar key={idx} src={avt} />
          ))}
          <Avatar
            icon={<PlusOutlined />}
            style={{ backgroundColor: '#f0f0f0', color: '#888' }}
          />
        </Space>
      </Space>

      <Divider />

      {/* Menu List */}
      <List
        itemLayout="horizontal"
        dataSource={menuItems}
        renderItem={(item) => (
          <List.Item
            style={{ padding: '12px 0', cursor: 'pointer' }}
            onClick={() => console.log(item.label)}
          >
            <List.Item.Meta
              avatar={item.icon}
              title={
                <Link
                  to={item.path || '#'}
                  onClick={onClose}
                  style={{ fontWeight: 500, color: 'inherit' }}
                >
                  {item.label}
                </Link>
              }
            />
          </List.Item>
        )}
      />

      <Divider />

      <Button
        type="text"
        danger
        icon={<LogoutOutlined />}
        block
        style={{
          //   background: 'rgba(255, 0, 0, 0.05)',
          fontWeight: 'bold',
          padding: '12px 0',
        }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Drawer>
  )
}

export default ProfileTab
