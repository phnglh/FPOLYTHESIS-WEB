import { Layout } from 'antd'
import { Outlet } from 'react-router'

import AppHeader from '@layout/components/AppBar'
import Footer from '@layout/components/Footer'

const { Content } = Layout

export default function AppLayout() {
  return (
    <Layout className="layout">
      <AppHeader />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  )
}
