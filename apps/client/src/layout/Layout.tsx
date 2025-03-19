// import { Outlet } from 'react-router'
// import { Layout } from 'antd'

// const { Header, Footer, Content } = Layout

// const headerStyle: React.CSSProperties = {
//   textAlign: 'center',
//   color: 'black',
//   height: 64,
//   paddingInline: 48,
//   lineHeight: '64px',
//   backgroundColor: 'white',
// }

// const contentStyle: React.CSSProperties = {
//   textAlign: 'center',
//   minHeight: 120,
//   lineHeight: '120px',
//   color: '#fff',
//   // backgroundColor: '#0958d9',
//   margin: '0 30px',
// }

// const footerStyle: React.CSSProperties = {
//   textAlign: 'center',
//   color: 'black',
//   backgroundColor: 'white',
// }
// const layoutStyle = {
//   borderRadius: 8,
//   overflow: 'hidden',
//   minHeight: '100vh',
//   backgroundColor: 'white',
// }
// export default function AppLayout() {
//   return (
//     <Layout style={layoutStyle}>
//       <Header style={headerStyle}>Header </Header>
//       <Content style={contentStyle}>
//         <Outlet />
//       </Content>
//       <Footer style={footerStyle}>
//         Ant Design ©{new Date().getFullYear()} Created by Ant UED
//       </Footer>
//     </Layout>
//   )
// }

import { Outlet } from 'react-router'
import { Layout } from 'antd'
import AppHeader from '../app/header'
import Footer from '../app/footer'

const { Content } = Layout

const layoutStyle: React.CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  overflowX: 'hidden',
}

const contentStyle: React.CSSProperties = {
  maxWidth: '100vw',
  overflowX: 'hidden',
}
export default function AppLayout() {
  return (
    <Layout style={layoutStyle}>
      <AppHeader />
      <Content style={contentStyle}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  )
}
