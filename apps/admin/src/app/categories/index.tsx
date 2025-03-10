import { Category } from '#types/category'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {} from '@store/api/categoryApi'
import {
  addCategory,
  deleteCategory,
  fetchCategories,
} from '@store/slices/categorySlice'
import { AppDispatch, RootState } from '@store/store'
import { Button, Form, Input, Modal, Select, Space, Table } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const CategoryManagement = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category>()
  const [form] = Form.useForm()

  const dispatch = useDispatch<AppDispatch>()
  const { data, loading, error } = useSelector(
    (state: RootState) => state.categories,
  )

  console.log(data)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleAddCategory = async (value: Category) => {
    try {
      await dispatch(addCategory(value))
      await dispatch(fetchCategories())
      setIsAddModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Failed to add category:', error)
    }
  }

  const handleEditCategory = async (value: Category) => {
    try {
      console.log(value)
      setIsEditModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Failed to edit category:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await dispatch(deleteCategory(categoryId))
      toast.success('Xóa danh mục thành công!')
    } catch (error) {
      toast.error('Xóa danh mục thất bại!')
    }
  }
  console.log(currentCategory)

  const showDeleteConfirm = (category: Category) => {
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
      >
        Thêm Danh Mục Mới
      </Button>

      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        title="Thêm Danh Mục Mới"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
      >
        <Form
          form={form}
          onFinish={handleAddCategory}
          layout="vertical"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            label="Tên Danh Mục"
            name="name"
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <Input placeholder="Nhập mô tả" />
          </Form.Item>

          <Form.Item label="Danh Mục Cha" name="parent_id">
            <Select placeholder="Chọn danh mục cha" allowClear>
              {data
                ?.filter((category) => category.parent_id === null)
                .map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
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
        <Form form={form} onFinish={handleEditCategory} layout="vertical">
          <Form.Item
            label="Tên Danh Mục"
            name="name"
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Không được để trống' }]}
          >
            <Input />
          </Form.Item>
          {currentCategory?.parent_id !== null && (
            <Form.Item label="Danh Mục Cha" name="parent_id">
              <Select placeholder="Chọn danh mục cha" allowClear>
                {data
                  ?.filter(
                    (category) =>
                      category.id !== currentCategory?.id &&
                      category.parent_id === null,
                  )
                  .map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          )}

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
