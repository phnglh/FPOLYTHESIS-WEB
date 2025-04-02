import { Layout, Menu, Dropdown, Avatar, Popover, Badge } from 'antd'
import {
  HeartOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { getUser, logout } from '@store/slices/authSlice'
import { fetchCart } from '@store/slices/cartSlice'
import { toast } from 'react-toastify'
import { Link } from 'react-router'
import { useCheckout } from '@hooks/useCheckout'
import { useTranslation } from 'react-i18next'

const { Header } = Layout

const AppHeader = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { handleCheckout } = useCheckout()
  const { user, access_token } = useSelector((state: RootState) => state.auth)

  const cart = useSelector((state: RootState) => state.cart)
  const cartItems = useMemo(() => cart.data?.items || [], [cart.data])

  useEffect(() => {
    if (access_token && user) {
      dispatch(fetchCart())
    }
  }, [access_token, user, dispatch])

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.unit_price
    return total + item.quantity * (isNaN(price) ? 0 : price)
  }, 0)

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
  const cartContent = (
    <div
      style={{
        width: 300,
        padding: 16,
        background: 'white',
        borderRadius: 8,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {cartItems?.map((item) => (
        <div
          key={item.id}
          style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}
        >
          {item.sku.image_url.length > 0 && (
            <img
              src={item.sku.image_url[0]}
              alt={item.sku.sku}
              style={{
                width: 50,
                height: 50,
                marginRight: 12,
                objectFit: 'cover',
                borderRadius: 4,
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 500 }}>
              {item.product_name} - {item.sku.sku}
            </p>
            <p style={{ margin: '4px 0', color: 'gray' }}>
              Số lượng: {item.quantity}
            </p>
            <p style={{ margin: 0, color: 'red' }}>{item.unit_price} VND</p>
          </div>
        </div>
      ))}
      <div
        style={{
          borderTop: '1px solid #ddd',
          paddingTop: 12,
          textAlign: 'right',
          fontWeight: 'bold',
        }}
      >
        Tổng tiền: {cartTotal.toLocaleString()} VND
      </div>
      <button
        style={{
          marginTop: 12,
          width: '100%',
          padding: 10,
          background: 'green',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 16,
          fontWeight: 500,
        }}
        onClick={handleCheckout}
      >
        Thanh toán
      </button>
    </div>
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
      <Menu.Item key="profile">Hồ sơ</Menu.Item>
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
        <Popover content={cartContent} title="Giỏ hàng" trigger="hover">
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
