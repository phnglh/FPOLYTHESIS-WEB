import { fetchUsers } from '@store/slices/userSlice'
import { AppDispatch, RootState } from '@store/store'
import { Table, Typography } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const UserManagement = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string | null) => phone || '—',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (address: string | null) => address || '—',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (_: string, record: { role: string }) => {
        return record.role === 'customer' ? 'Customer' : 'Admin'
      },
    },
  ]

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <Typography.Title level={3}>Quản lý người dùng</Typography.Title>
      </div>
      <Table dataSource={data} columns={columns} rowKey="id" />
    </div>
  )
}

export default UserManagement
