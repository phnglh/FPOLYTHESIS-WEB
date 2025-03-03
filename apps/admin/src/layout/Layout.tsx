import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Layout } from 'antd'
import React, { useState } from 'react'
import { Outlet } from 'react-router'
import { Sidebar } from './components/SideBar'

const { Header, Sider } = Layout

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

  const user = JSON.parse(localStorage.getItem('user')!)

  return (
    <Layout>
      <Sider
        width={210}
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        {!collapsed ? (
          <div className="p-3 text-2xl font-bold">GENTLEMAN'S</div>
        ) : (
          <div className="pb-2 pl-2 pt-2  font-bold">GENTLE</div>
        )}

        <Sidebar />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: 'white', display: 'flex' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div className="ml-auto mr-3">
            <div className="dropdown relative ms-3 ">
              <button className="bg-gray-100 pl-5 pr-5">
                <div className="flex items-center">
                  <img
                    className="header-profile-user h-10 w-10 rounded-full "
                    src={
                      user?.data?.avatar
                        ? user?.data?.avatar
                        : 'https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg'
                    }
                    alt="Header Avatar"
                  />
                  <div className="ml-2 text-start">
                    <span className="ms-1 hidden font-medium xl:inline-block ">
                      {user?.data?.name ? user?.data?.name : ''}
                    </span>
                    <span
                      className="user-name-sub-text ms-1 hidden  text-xs xl:block"
                      style={{ marginTop: '-20px' }}
                    >
                      Admin
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </Header>

        <div className="site-layout-content p-10">
          <Outlet />
        </div>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
