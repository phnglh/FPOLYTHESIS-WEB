import {
  AppstoreOutlined,
  BarChartOutlined,
  CommentOutlined,
  FallOutlined,
  FormatPainterOutlined,
  OrderedListOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'
import { Link, useLocation } from 'react-router'

const items = [
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
    ],
  },
  {
    key: '/quan-ly-attr',
    icon: <TagsOutlined />,
    label: <Link to="/quan-ly-attr">Quản lý thuộc tính</Link>,
  },
  {
    key: '/quan-ly-nguoi-dung',
    icon: <TeamOutlined />,
    label: <Link to="/quan-ly-nguoi-dung">Quản lý người dùng</Link>,
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

export function Sidebar() {
  const location = useLocation()

  return <Menu mode="inline" selectedKeys={[location.pathname]} items={items} />
}
