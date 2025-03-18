import { Layout, Input, Space, Menu, Row, Col, Dropdown, Avatar } from 'antd'
import {
  SearchOutlined,
  HeartOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import Logo from '../images/logo.flames2.png'

const { Header } = Layout

const AppHeader = () => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

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
        <Col style={{ marginRight: '100px' }}>
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

            <a href="carts" style={{ color: 'white', fontSize: '14px' }}>
              <ShoppingCartOutlined /> <span>Giỏ hàng</span>
            </a>
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
            marginRight: '50px',
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
