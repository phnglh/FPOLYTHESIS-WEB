import { items } from '@layout/components/common/SideBarItem'
import { Breadcrumb } from 'antd'
import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { isValidElement } from 'react'

export interface SidebarItem {
  key: string
  label: ReactNode
  icon?: ReactNode
  children?: SidebarItem[]
}

const findBreadcrumbPath = (
  menuItems: SidebarItem[],
  path: string,
  parents: SidebarItem[] = [],
): SidebarItem[] => {
  for (const item of menuItems) {
    const currentPath = [...parents, item]
    if (item.key === path) {
      return currentPath
    }
    if (item.children) {
      const found = findBreadcrumbPath(item.children, path, currentPath)
      if (found.length) return found
    }
  }
  return []
}

const AppBreadcrumb = () => {
  const location = useLocation()
  const pathSnippets = location.pathname.split('/').filter((i) => i)

  // Build URL step by step to find correct breadcrumb
  const urlPaths = pathSnippets.map(
    (_, index) => `/${pathSnippets.slice(0, index + 1).join('/')}`,
  )

  // Tìm danh sách các item tương ứng để tạo Breadcrumb
  const breadcrumbItems = urlPaths.map((url) => {
    const matchedPath = findBreadcrumbPath(items, url)
    if (matchedPath.length > 0) {
      const lastItem = matchedPath[matchedPath.length - 1]
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>
            {isValidElement(lastItem.label) && lastItem.label.props?.children
              ? lastItem.label.props.children
              : lastItem.label}
          </Link>
        </Breadcrumb.Item>
      )
    }
    return null
  })
  const defaultBreadcrumb =
    location.pathname !== '/dashboard' ? (
      <Breadcrumb.Item key="/dashboard">
        <Link to="/dashboard">Thống kê</Link>
      </Breadcrumb.Item>
    ) : null

  return <Breadcrumb>{[defaultBreadcrumb, ...breadcrumbItems]}</Breadcrumb>
}

export default AppBreadcrumb
