// src/pages/categories/CategoryList.tsx

import { Category } from '#types/category'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Modal, Space, Table } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { deleteCategory, fetchCategories } from '@store/slices/categorySlice'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

const CategoryManagement = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { data } = useSelector((state: RootState) => state.categories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await dispatch(deleteCategory(categoryId))
      toast.success('Xóa danh mục thành công!')
    } catch {
      toast.error('Xóa danh mục thất bại!')
    }
  }

  const showDeleteConfirm = (categoryId: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa danh mục này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => handleDeleteCategory(categoryId),
    })
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      render: (_: number, __: Category, i: number) => i + 1,
    },
    { title: 'Tên Danh Mục', dataIndex: 'name' },
    {
      title: 'Thao Tác',
      render: (record: Category) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/categories/update/${record.id}`)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => showDeleteConfirm(record.id)}
          />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => navigate('/categories/create')}
      >
        Thêm Danh Mục
      </Button>

      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  )
}

export default CategoryManagement
