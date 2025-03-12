import { Layout, Input, Space, Menu, Row, Col } from 'antd'
import {
  SearchOutlined,
  HeartOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import React from 'react'

const { Header } = Layout

const AppHeader: React.FC = () => {
  return (
    <Header
      style={{
        background: 'rgb(70, 105, 79)',
        padding: '0',
        height: 'auto',
        position: 'relative',
      }}
    >
      {/* Logo (Chiều cao bằng tổng 2 thanh) */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '20px',
          zIndex: 10,
          background: 'black',
          padding: '10px 20px',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img
          src="/path-to-your-logo/logo.png"
          alt="Logo"
          style={{ height: '100px' }}
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
            <a href="#" style={{ color: 'white', fontSize: '14px' }}>
              <HeartOutlined /> <span>Yêu thích (0)</span>
            </a>
            <a href="#" style={{ color: 'white', fontSize: '14px' }}>
              <UserOutlined /> <span>Đăng ký / Đăng nhập</span>
            </a>
            <a href="#" style={{ color: 'white', fontSize: '14px' }}>
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
