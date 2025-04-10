import { fetchUsers } from '@store/slices/userSlice'
import { AppDispatch, RootState } from '@store/store'
import { Button, Popconfirm, Table, message } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

const UserManagement = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data } = useSelector((state: RootState) => state.users)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleDelete = (id: number) => {
    console.log('Delete user with id:', id)
    toast.success('Đã xóa người dùng (giả lập)')
  }

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
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: { id: number }) => (
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/users/edit/${record.id}`)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xoá?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
        </div>
      ),
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
