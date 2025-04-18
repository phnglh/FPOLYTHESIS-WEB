import {
  AppstoreOutlined,
  BarChartOutlined,
  FolderOutlined,
  TrademarkCircleOutlined,
  TagsOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router'

export const items = [
  {
    key: '/dashboard',
    icon: <BarChartOutlined />,
    label: <Link to="/dashboard">Thống kê</Link>,
  },
  {
    key: '/store',
    icon: <AppstoreOutlined />,
    label: 'Cửa hàng',
    children: [
      {
        key: '/categories',
        label: 'Danh mục',
        icon: <FolderOutlined />,
        children: [
          {
            key: '/categories/list',
            label: <Link to="/categories">Tất cả danh mục</Link>,
          },
          {
            key: '/categories/create',
            label: <Link to="/categories/create">Tạo danh mục</Link>,
          },
        ],
      },
      {
        key: '/brands',
        label: 'Thương hiệu',
        icon: <TrademarkCircleOutlined />,
        children: [
          {
            key: '/brands/list',
            label: <Link to="/brands">Tất cả thương hiệu</Link>,
          },
          {
            key: '/brands/create',
            label: <Link to="/brands/create">Thêm thương hiệu</Link>,
          },
        ],
      },
      {
        key: '/attributes',
        icon: <TagsOutlined />,
        label: 'Thuộc tính',
        children: [
          {
            key: '/attributes/list',
            label: <Link to="/attributes">Tất cả thuộc tính</Link>,
          },
        ],
      },
      {
        key: '/products',
        icon: <ShoppingOutlined />,
        label: 'Sản phẩm',
        children: [
          {
            key: '/products/list',
            label: <Link to="/products">Tất cả sản phẩm</Link>,
          },
          {
            key: '/products/create',
            label: <Link to="/products/create">Thêm sản phẩm</Link>,
          },
        ],
      },
      {
        key: '/orders',
        icon: <ShoppingCartOutlined />,
        label: <Link to="/orders">Danh sách đơn hàng</Link>,
      },
    ],
  },
  {
    key: '/vouchers',
    icon: <UserOutlined />,
    label: <Link to="/vouchers">Quản lý mã khuyến mại</Link>,
  },
  {
    key: '/users',
    icon: <UserOutlined />,
    label: 'Người dùng',
    children: [
      {
        key: '/users/list',
        label: <Link to="/users">Quản lý người dùng</Link>,
      },
      {
        key: '/users/create',
        label: <Link to="/users/create">Thêm người dùng</Link>,
      },
    ],
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: <Link to="/settings">Cài đặt</Link>,
  },
]
