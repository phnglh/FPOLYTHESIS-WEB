import { Layout } from 'antd'
import { Outlet } from 'react-router'
// import { useTranslation } from 'react-i18next'
import AppHeader from '@layout/components/AppBar'
import Footer from '@layout/components/Footer'

const { Content } = Layout

export default function AppLayout() {
  // const { t } = useTranslation()
  return (
    <Layout className="layout">
      {/* <Header
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
        <Menu mode="horizontal" style={{ flexShrink: 0 }}>
          <Menu.Item icon={<HeartOutlined />} />
          <Menu.Item icon={<ShoppingCartOutlined />} />
          <Menu.Item icon={<UserOutlined />} />
        </Menu>
      </Header> */}
      <AppHeader />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  )
}
