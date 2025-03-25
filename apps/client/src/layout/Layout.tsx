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
      <AppHeader />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  )
}
