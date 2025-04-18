import { Layout, Menu } from 'antd'
import { Link } from 'react-router'
import {
  UserOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  DeliveredProcedureOutlined,
} from '@ant-design/icons'
import { Outlet } from 'react-router'

const { Sider } = Layout

export const AccountLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light">
        <Menu mode="inline">
          <Menu.Item key="info" icon={<UserOutlined />}>
            <Link to="/account/info">Thông tin cá nhân</Link>
          </Menu.Item>
          <Menu.Item key="address" icon={<HomeOutlined />}>
            <Link to="/account/address">Địa chỉ</Link>
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
            <Link to="/account/orders">Danh sách đơn hàng</Link>
          </Menu.Item>
          <Menu.Item key="ordered" icon={<DeliveredProcedureOutlined />}>
            <Link to="/account/ordered">Đơn hàng đã đặt</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: '24px' }}>
        <div>
          <Outlet />
        </div>
      </Layout>
    </Layout>
  )
}
