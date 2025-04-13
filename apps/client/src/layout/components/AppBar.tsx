import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Popover,
  Badge,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Image,
  Divider,
  Space,
} from 'antd'
import {
  HeartOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { getUser, logout } from '@store/slices/authSlice'
import {
  decrementCartItem,
  fetchCart,
  incrementCartItem,
} from '@store/slices/cartSlice'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'

const { Header } = Layout

const AppHeader = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { formatCurrency } = useCurrencyFormatter()
  const dispatch = useDispatch<AppDispatch>()
  const { user, access_token } = useSelector((state: RootState) => state.auth)
  const cart = useSelector((state: RootState) => state.cart)
  const cartItems = useMemo(() => cart.data?.items || [], [cart.data])

  useEffect(() => {
    if (access_token && user) {
      dispatch(fetchCart())
    }
  }, [access_token, user, dispatch])

  useEffect(() => {
    if (
      !!access_token &&
      typeof access_token === 'string' &&
      access_token.trim() !== '' &&
      !user
    ) {
      dispatch(getUser())
    }
  }, [access_token, user, dispatch])

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success('Đăng xuất thành công!')
      })
      .catch((err) => {
        toast.error(err || 'Đăng xuất thất bại!')
      })
  }

  const handleIncrement = (id: number) => {
    dispatch(incrementCartItem(id)).then(() => dispatch(fetchCart()))
  }

  const handleDecrement = (id: number, quantity: number) => {
    if (quantity > 1) {
      dispatch(decrementCartItem(id)).then(() => dispatch(fetchCart()))
    }
  }

  const cartContent = (
    <Card style={{ width: 400 }}>
      {cartItems?.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.id} style={{ marginBottom: 12 }}>
            <Row gutter={12} align="middle" justify="space-between">
              <Col>
                <Row gutter={8} align="middle">
                  <Col>
                    {item.sku.image_url && (
                      <Image
                        src={item.sku.image_url}
                        alt={item.sku.sku}
                        width={50}
                        height={50}
                        style={{ borderRadius: 4, objectFit: 'cover' }}
                      />
                    )}
                  </Col>
                  <Col>
                    <Typography.Text strong>
                      {item.product_name}
                    </Typography.Text>
                    <Typography.Paragraph
                      type="secondary"
                      style={{ margin: '4px 0' }}
                    >
                      {item.sku.sku} | Số lượng:
                      <Button
                        size="small"
                        style={{ margin: '0 5px' }}
                        onClick={() => handleDecrement(item.id, item.quantity)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      {item.quantity}
                      <Button
                        size="small"
                        style={{ margin: '0 5px' }}
                        onClick={() => handleIncrement(item.id)}
                      >
                        +
                      </Button>
                    </Typography.Paragraph>
                    <Typography.Text type="danger" strong>
                      {formatCurrency(item.unit_price)}
                    </Typography.Text>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    dispatch(decrementCartItem(item.id))
                    toast.success('Đã xóa sản phẩm khỏi giỏ hàng!')
                    setTimeout(() => dispatch(fetchCart()), 300)
                  }}
                />
              </Col>
            </Row>
            <Divider style={{ margin: '8px 0' }} />
          </div>
        ))
      ) : (
        <Typography.Text
          type="secondary"
          style={{ textAlign: 'center', display: 'block' }}
        >
          Giỏ hàng trống
        </Typography.Text>
      )}
      <Divider />
      <Row justify="space-between">
        <Col>
          <Typography.Text strong>Tổng tiền:</Typography.Text>
        </Col>
        <Col>
          <Typography.Text strong>
            {formatCurrency(
              cartItems.reduce((total, item) => {
                const price = Number(item.unit_price)
                return total + item.quantity * (isNaN(price) ? 0 : price)
              }, 0),
            )}
          </Typography.Text>
        </Col>
      </Row>
      <Space direction="vertical" style={{ width: '100%', marginTop: 12 }}>
        <Button type="default" block onClick={() => navigate('/carts')}>
          Xem giỏ hàng
        </Button>
      </Space>
    </Card>
  )

  const authMenu = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Link to="/login">Đăng nhập</Link>
      <Link to="/register" style={{ marginTop: 4 }}>
        Đăng ký
      </Link>
    </div>
  )

  const userMenu = (
    <Menu>
      <Menu.Item key="account">
        <Link to="/account">Hồ sơ</Link>{' '}
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  )

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '0 20px',
      }}
    >
      <Link to="/">
        <img
          src="/assets/images/logo/logo.png"
          alt="logo"
          style={{ height: 60 }}
        />
      </Link>

      <Menu
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ flexGrow: 1, minWidth: 0, justifyContent: 'center' }}
      >
        <Menu.Item key="1">
          <Link to="/">{t('menu.homepage')}</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/about">{t('menu.about')}</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/products">{t('menu.products')}</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/contact">{t('menu.contact')}</Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="/stores">{t('menu.stores')}</Link>
        </Menu.Item>
      </Menu>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <HeartOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
        <Popover content={cartContent} title="Giỏ hàng của bạn" trigger="hover">
          <Badge count={cartItems.length}>
            <ShoppingCartOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Badge>
        </Popover>
        {user ? (
          <Dropdown
            overlay={userMenu}
            trigger={['click']}
            placement="bottomRight"
            arrow
          >
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Avatar
                size={24}
                icon={<UserOutlined />}
                src={user?.avatar}
                style={{ marginRight: '6px' }}
              />
              <span style={{ fontSize: '14px' }}>
                Xin chào, <b>{user?.name}</b>
              </span>
            </div>
          </Dropdown>
        ) : (
          <Popover content={authMenu} title="Tài khoản" trigger="click">
            <UserOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Popover>
        )}
      </div>
    </Header>
  )
}

export default AppHeader
