import { Category } from '@/@types/category'
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from '@/api/services/CategoryService'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Space, Table } from 'antd'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<any>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const data = await getAllCategory()
    setCategories(data)
  }

  const handleAddCategory = async (values: Category) => {
    try {
      await createCategory(values)
      fetchCategories()
      setIsAddModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Failed to add category:', error)
    }
  }

  const handleEditCategory = async (values: Category) => {
    try {
      await updateCategory(currentCategory?.id, values)
      fetchCategories()
      setIsEditModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Failed to edit category:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId)
      fetchCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const showDeleteConfirm = (category: Category) => {
    if (category.quantity > 0) {
      toast.warning('Danh mục này có sản phẩm và không thể xóa.')
      return
    }

    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa danh mục này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => handleDeleteCategory(category.id),
    })
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      render: (_text: string, _record: Category, index: number) => index + 1,
    },
    {
      title: 'Tên Danh Mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      render: (record: Category) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentCategory(record)
              form.setFieldsValue(record)
              setIsEditModalVisible(true)
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
            danger
          />
        </Space>
      ),
    },
  ]

  return (
    <div className="content">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsAddModalVisible(true)}
        style={{ marginBottom: '16px' }}
      >
        Thêm Danh Mục Mới
      </Button>

      <Table columns={columns} dataSource={categories} rowKey={'id'} />

      <Modal
        title="Thêm Danh Mục Mới"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddCategory}>
          <Form.Item
            label="Tên Danh Mục"
            name="name"
            rules={[
              {
                required: true,
                message: 'Không được để trống',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm Danh Mục
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh Sửa Danh Mục"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleEditCategory}>
          <Form.Item
            label="Tên Danh Mục"
            name="name"
            rules={[
              {
                required: true,
                message: 'Không được để trống',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu Thay Đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CategoryManagement
