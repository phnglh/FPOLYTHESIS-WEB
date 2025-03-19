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
} from 'antd'
import {
  SearchOutlined,
  HeartOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import Logo from '../images/logo.flames2.png'

const { Header } = Layout

const AppHeader = () => {
  const [user, setUser] = useState<any>(null)
  const [cartVisible, setCartVisible] = useState(false)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Áo lót giữ nhiệt đá bóng Keepdry cho người lớn',
      size: 'XL',
      quantity: 1,
      price: 395000,
      image: 'https://via.placeholder.com/50',
    },
    {
      id: 2,
      name: 'Áo lót giữ nhiệt đá bóng Keepdry cho người lớn',
      size: 'S',
      quantity: 4,
      price: 395000,
      image: 'https://via.placeholder.com/50',
    },
    {
      id: 3,
      name: 'Áo giữ nhiệt nam - Áo thun tập GYM thể thao dài tay nam',
      size: 'S',
      quantity: 2,
      price: 200000,
      image: 'https://via.placeholder.com/50',
    },
  ])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )

  const cartContent = (
    <div
      style={{ width: 300, padding: 16, background: 'white', borderRadius: 8 }}
    >
      {cartItems.map((item) => (
        <div
          key={item.id}
          style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}
        >
          <img
            src={item.image}
            alt={item.name}
            style={{ width: 50, height: 50, marginRight: 12 }}
          />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0 }}>{item.name}</p>
            <p style={{ margin: '4px 0', color: 'gray' }}>Size: {item.size}</p>
            <p style={{ margin: 0, color: 'red' }}>
              {item.price.toLocaleString()}đ
            </p>
          </div>
        </div>
      ))}
      <div
        style={{
          borderTop: '1px solid #ddd',
          paddingTop: 12,
          textAlign: 'right',
        }}
      >
        <strong>Tổng tiền: {totalPrice.toLocaleString()}đ</strong>
      </div>
      <button
        style={{
          marginTop: 12,
          width: '100%',
          padding: 8,
          background: 'green',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
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
          onClick={() => {
            localStorage.removeItem('user')
            setUser(null)
          }}
          style={{ color: 'red' }}
        >
          Đăng xuất
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
      }}
    >
      {/* Logo  */}
      <div
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
          src={Logo}
          alt="Logo"
          style={{ height: '144px', width: '140px' }}
        />
      </div>

      <Row
        align="middle"
        style={{
          padding: '10px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          marginLeft: '200px',
        }}
      >
        {/* Thanh tìm kiếm */}
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

        {/* chức năng */}
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
                  <Popover
                    content={cartContent}
                    visible={cartVisible}
                    onVisibleChange={setCartVisible}
                    trigger="hover"
                  >
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

      {/* Thanh điều hướng + Hotline */}
      <Row
        style={{
          background: 'black',
          height: '65px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          marginTop: '-5px',
        }}
      >
        {/* Menu Điều Hướng */}
        <Col
          flex="auto"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginLeft: '110px',
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
              width: '800px',
              marginRight: '80px',
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

        {/* Hotline  */}
        <Col
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '100px',
          }}
        >
          <span
            style={{
              color: 'rgb(50, 149, 70)',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            <PhoneOutlined style={{ marginRight: '5px' }} /> Hotline: 1800.6750
          </span>
        </Col>
      </Row>
    </Header>
  )
}

export default AppHeader
