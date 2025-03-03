import {
  AppstoreOutlined,
  BarChartOutlined,
  CommentOutlined,
  FallOutlined,
  FormatPainterOutlined,
  OrderedListOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'
import { Link } from 'react-router'

const items = [
  {
    key: '1',
    icon: <BarChartOutlined />,
    label: <Link to="dashboard">Thống kê</Link>,
  },
  {
    key: '2',
    icon: <AppstoreOutlined />,
    label: <Link to="quan-ly-danh-muc">Tất cả danh mục</Link>,
  },
  {
    key: 'sub2',
    icon: <ShoppingCartOutlined />,
    label: 'Quản lý sản phẩm',
    children: [
      {
        key: '3',
        label: <Link to="products">Tất cả sản phẩm</Link>,
      },
      {
        key: '4',
        label: <Link to="products/add">Thêm sản phẩm</Link>,
      },
    ],
  },
  {
    key: '6',
    icon: <TagsOutlined />,
    label: <Link to="quan-ly-attr">Quản lý thuộc tính</Link>,
  },
  {
    key: '7',
    icon: <TeamOutlined />,
    label: <Link to="quan-ly-nguoi-dung">Quản lý người dùng</Link>,
  },
  {
    key: '8',
    icon: <OrderedListOutlined />,
    label: <Link to="quan-ly-orders">Quản lý đơn hàng</Link>,
  },
  {
    key: '9',
    icon: <FallOutlined />,
    label: <Link to="quan-ly-sale">Quản lý sản phẩm giảm giá</Link>,
  },
  {
    key: '10',
    icon: <FormatPainterOutlined />,
    label: <Link to="voucher">Quản lý mã giảm giá</Link>,
  },
  {
    key: '11',
    icon: <CommentOutlined />,
    label: <Link to="comment">Quản lý đánh giá</Link>,
  },
]

export function Sidebar() {
  return <Menu mode="inline" defaultSelectedKeys={['1']} items={items} />
}
