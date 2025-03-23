import {
  Layout,
  Input,
  Space,
  Menu,
  Row,
  Col,
  Dropdown,
  Avatar,
  Popover,
  Badge,
  Spin,
} from 'antd'
import {
  SearchOutlined,
  HeartOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { getUser, logout } from '@store/slices/authSlice'
import { fetchCart } from '@store/slices/cartSlice'
import { toast } from 'react-toastify'

const { Header } = Layout

const AppHeader = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, access_token, loading } = useSelector(
    (state: RootState) => state.auth,
  )

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
    if (access_token && !user) {
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
            <p style={{ margin: 0, fontWeight: 500 }}>{item.sku.sku}</p>
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
        onClick={() => (window.location.href = '/thanh-toan')}
      >
        Thanh toán
      </button>
    </div>
  )

  const userMenu = (
    <div
      style={{ width: 280, padding: 16, background: 'white', borderRadius: 8 }}
    >
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <Avatar size={64} icon={<UserOutlined />} src={user?.avatar} />
        <h3 style={{ margin: '8px 0' }}>{user?.name}</h3>
        <p style={{ color: 'gray' }}>Chưa phân hạng</p>
      </div>
      <Menu style={{ border: 'none' }}>
        <Menu.Item key="profile">Ví Của Tôi</Menu.Item>
        <Menu.Item key="orders">Lịch Sử Đặt Hàng</Menu.Item>
        <Menu.Item key="favorites">Yêu Thích</Menu.Item>
        <Menu.Item key="gift-codes">Mã Quà Tặng</Menu.Item>
        <Menu.Divider />
        <Menu.Item
          key="logout"
          onClick={loading ? undefined : handleLogout}
          style={{ color: 'red', cursor: loading ? 'not-allowed' : 'pointer' }}
          disabled={loading}
        >
          {loading ? <Spin size="small" /> : 'Đăng xuất'}
        </Menu.Item>
      </Menu>
    </div>
  )

  return (
    <Header
      style={{
        background: 'rgb(70, 105, 79)',
        padding: '0',
        height: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Space
        style={{
          position: 'absolute',
          top: '0',
          left: '60px',
          zIndex: 10,
          background: 'black',
          height: '144px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img
          src="/assets/images/logo/logo.png"
          alt="Logo"
          style={{ height: '144px', width: '140px' }}
        />
      </Space>

      <Row
        align="middle"
        style={{
          padding: '10px 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          marginLeft: '200px',
        }}
      >
        <Col
          flex="auto"
          style={{ padding: '0 16px', maxWidth: '580px', marginLeft: '130px' }}
        >
          <Input
            placeholder="Tìm kiếm sản phẩm"
            prefix={<SearchOutlined />}
            style={{ width: '100%', padding: '6px 12px', borderRadius: '8px' }}
          />
        </Col>

        <Col style={{ marginLeft: '100px' }}>
          <Space size="middle">
            <a href="yeu-thich" style={{ color: 'white', fontSize: '14px' }}>
              <HeartOutlined /> <span>Yêu thích (0)</span>
            </a>
            <Col
              style={{
                marginLeft: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
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
                    <span style={{ color: 'white', fontSize: '14px' }}>
                      Xin chào, <b>{user?.name}</b>
                    </span>
                  </div>
                </Dropdown>
              ) : (
                <>
                  <UserOutlined
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      marginRight: '6px',
                    }}
                  />
                  <a
                    href="register"
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      textDecoration: 'none',
                    }}
                  >
                    Đăng ký
                  </a>
                  <span style={{ color: 'white', margin: '0 8px' }}>|</span>
                  <a
                    href="login"
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      textDecoration: 'none',
                    }}
                  >
                    Đăng nhập
                  </a>
                </>
              )}
            </Col>

            <Row
              align="middle"
              style={{
                padding: '10px 24px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Col style={{ marginRight: '100px' }}>
                <Space size="middle">
                  <Popover content={cartContent} trigger="hover">
                    <Badge count={cartItems.length}>
                      <a
                        href="carts"
                        style={{ color: 'white', fontSize: '14px' }}
                      >
                        <ShoppingCartOutlined
                          style={{
                            color: 'white',
                            fontSize: '20px',
                            cursor: 'pointer',
                          }}
                        />{' '}
                        <span>Giỏ hàng</span>
                      </a>
                    </Badge>
                  </Popover>
                </Space>
              </Col>
            </Row>
          </Space>
        </Col>
      </Row>

      <Row
        style={{
          background: 'black',
          height: '65px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          marginTop: '-5px',
        }}
      >
        <Col
          flex="auto"
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexGrow: 1,
            maxWidth: '800px',
            marginLeft: '50px',
          }}
        >
          <Menu
            mode="horizontal"
            theme="dark"
            style={{
              background: 'black',
              border: 'none',
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'nowrap',
              height: '100%',
              width: '100%',
            }}
          >
            <Menu.Item key="home">
              <a href="/" style={{ color: 'white' }}>
                Trang chủ
              </a>
            </Menu.Item>
            <Menu.Item key="about">
              <a href="gioi-thieu" style={{ color: 'white' }}>
                Giới thiệu
              </a>
            </Menu.Item>
            <Menu.Item key="products">
              <a href="products" style={{ color: 'white' }}>
                Sản phẩm
              </a>
            </Menu.Item>
            <Menu.Item key="news">
              <a href="tin-tuc" style={{ color: 'white' }}>
                Tin tức
              </a>
            </Menu.Item>
            <Menu.Item key="contact">
              <a href="lien-he" style={{ color: 'white' }}>
                Liên hệ
              </a>
            </Menu.Item>
            <Menu.Item key="stores">
              <a href="he-thong-cua-hang" style={{ color: 'white' }}>
                Hệ thống cửa hàng
              </a>
            </Menu.Item>
          </Menu>
        </Col>

        <Col
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingRight: '24px',
          }}
        >
          <Space
            style={{
              color: 'rgb(50, 149, 70)',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            <PhoneOutlined style={{ marginRight: '5px' }} /> Hotline: 1800.6750
          </Space>
        </Col>
      </Row>
    </Header>
  )
}

export default AppHeader
