import { items } from '@layout/components/common/SideBarItem'
import { Menu } from 'antd'
import { useLocation } from 'react-router'

export function Sidebar() {
  const location = useLocation()

  return <Menu mode="inline" selectedKeys={[location.pathname]} items={items} />
}
