// src/pages/categories/CategoryList.tsx

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Modal, Space, Table } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { deleteBrand, fetchBrands } from '@store/slices/brandSlice'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { Brand } from '#types/brand'

const BrandManagement = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { data } = useSelector((state: RootState) => state.brands)

  useEffect(() => {
    dispatch(fetchBrands())
  }, [dispatch])

  const handleDeleteBrand = async (brandId: number) => {
    try {
      await dispatch(deleteBrand(brandId))
      toast.success('Xóa thương hiệu thành công!')
    } catch {
      toast.error('Xóa thương hiệu thất bại!')
    }
  }

  const showDeleteConfirm = (brandId: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa thương hiệu này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => handleDeleteBrand(brandId),
    })
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      render: (_: number, __: Brand, i: number) => i + 1,
    },
    { title: 'Tên Thương Hiệu', dataIndex: 'name' },
    {
      title: 'Thao Tác',
      render: (record: Brand) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/brands/update/${record.id}`)}
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
        onClick={() => navigate('/brands/create')}
      >
        Thêm thương hiệu
      </Button>

      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  )
}

export default BrandManagement
