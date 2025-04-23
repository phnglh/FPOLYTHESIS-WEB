import {
  Form,
  Input,
  Button,
  Select,
  Spin,
  Card,
  Space,
  Typography,
  Flex,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import {
  fetchCategories,
  fetchCategoryById,
  updateCategory,
} from '@store/slices/categorySlice'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Category } from '#types/category'
import { toast } from 'react-toastify'

const { Title, Text } = Typography
const UpdateCategory = () => {
  const [form] = Form.useForm()
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const {
    data: categories,
    loading,
    selectedItem,
  } = useSelector((state: RootState) => state.categories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryById(Number(id)))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (selectedItem && categories.length > 0) {
      form.setFieldsValue({
        name: selectedItem.name,
        description: selectedItem.description,
        parent_id: selectedItem.parent_id ?? null,
      })
    }
  }, [selectedItem, categories, form])

  const handleFinish = async (values: Category) => {
    await dispatch(updateCategory({ ...values, id: Number(id) }))
    toast.success('Cập nhập danh mục thành công!')
    navigate('/categories')
  }

  if (!selectedItem) {
    return <Spin size="large" />
  }

  return (
    <div className="flex justify-center items-center p-6">
      <Flex
        vertical
        gap="large"
        style={{ padding: '24px', width: '100%', maxWidth: 900 }}
      >
        <Space direction="vertical" size="small">
          <Title level={3}>Thêm Danh Mục Mới</Title>
          <Text type="secondary">
            Điền thông tin để thêm danh mục vào hệ thống.
          </Text>
        </Space>

        <Card style={{ maxWidth: 800, width: '100%' }}>
          <Form form={form} onFinish={handleFinish} layout="vertical">
            <Form.Item
              label="Tên Danh Mục"
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập tên danh mục' },
              ]}
            >
              <Input placeholder="Nhập tên danh mục" />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <Input placeholder="Nhập mô tả" />
            </Form.Item>

            {selectedItem.parent_id !== null && (
              <Form.Item label="Danh Mục Cha" name="parent_id">
                <Select
                  allowClear
                  placeholder="Chọn danh mục cha"
                  options={categories
                    .filter((item) => item.id !== Number(id))
                    .map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))}
                />
              </Form.Item>
            )}

            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu Thay Đổi
            </Button>
          </Form>
        </Card>
      </Flex>
    </div>
  )
}

export default UpdateCategory
