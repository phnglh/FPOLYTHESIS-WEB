import { fetchUsers } from '@store/slices/userSlice'
import { AppDispatch, RootState } from '@store/store'
import { Button, Table } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const UserManagement = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data } = useSelector((state: RootState) => state.users)

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  console.log(data)
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
      dataIndex: 'number',
      key: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
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
        <h2 className="text-xl">Quản lý người dùng</h2>
        <Button type="primary" onClick={() => navigate('/users/create')}>
          Thêm
        </Button>
      </div>
      <Table dataSource={data} columns={columns} rowKey="id" />
    </div>
  )
}

export default UserManagement
