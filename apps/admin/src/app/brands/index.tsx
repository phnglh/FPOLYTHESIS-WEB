// src/pages/categories/CategoryList.tsx

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Modal, Row, Space, Table, Typography } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { deleteBrand, fetchBrands } from '@store/slices/brandSlice'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { Brand } from '#types/brand'

const { Title } = Typography
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
    <Space
      direction="vertical"
      size="middle"
      style={{ display: 'flex', marginTop: '30px' }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Danh sách thương hiệu
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/brands/create')}
          >
            Thêm thương hiệu
          </Button>
        </Col>
      </Row>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </Space>
  )
}

export default BrandManagement
