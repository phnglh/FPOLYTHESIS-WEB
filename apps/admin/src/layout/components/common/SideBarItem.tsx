import {
  AppstoreOutlined,
  BarChartOutlined,
  CommentOutlined,
  FallOutlined,
  FormatPainterOutlined,
  OrderedListOutlined,
  TeamOutlined,
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
    label: 'Store',
    children: [
      {
        key: '/categories',
        label: 'Danh mục',
        icon: <AppstoreOutlined />,
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
        icon: <AppstoreOutlined />,
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
        icon: <AppstoreOutlined />,
        label: 'Attribute',
        children: [
          {
            key: '/attributes/list',
            label: <Link to="/attributes">Tất cả thuộc tính</Link>,
          },
          {
            key: '/attributes/create',
            label: <Link to="/attributes/create">Tất cả thuộc tính</Link>,
          },
        ],
      },
      {
        key: '/products',
        icon: <AppstoreOutlined />,
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
        icon: <OrderedListOutlined />,
        label: 'Orders',
        children: [
          {
            key: '/orders/list',
            label: <Link to="/orders">List</Link>,
          },
          {
            key: '/orders/create',
            label: <Link to="/orders/create">Create</Link>,
          },
        ],
      },
      {
        key: '/users',
        icon: <TeamOutlined />,
        label: 'Users',
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
    ],
  },

  {
    key: '/quan-ly-orders',
    icon: <OrderedListOutlined />,
    label: <Link to="/quan-ly-orders">Quản lý đơn hàng</Link>,
  },
  {
    key: '/quan-ly-sale',
    icon: <FallOutlined />,
    label: <Link to="/quan-ly-sale">Quản lý sản phẩm giảm giá</Link>,
  },
  {
    key: '/voucher',
    icon: <FormatPainterOutlined />,
    label: <Link to="/voucher">Quản lý mã giảm giá</Link>,
  },
  {
    key: '/comment',
    icon: <CommentOutlined />,
    label: <Link to="/comment">Quản lý đánh giá</Link>,
  },
]
