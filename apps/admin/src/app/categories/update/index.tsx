import { Form, Input, Button, Select, Spin } from 'antd'
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
    if (selectedItem) {
      form.setFieldsValue({
        name: selectedItem.name,
        description: selectedItem.description,
        parent_id: selectedItem.parent_id || null,
      })
    }
  }, [selectedItem, form])

  const handleFinish = async (values: Category) => {
    console.log('Update category', values)
    await dispatch(updateCategory({ ...values, id: Number(id) }))
    navigate('/categories')
  }

  if (!selectedItem) {
    return <Spin size="large" />
  }

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item
        label="Tên Danh Mục"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
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
          <Select allowClear placeholder="Chọn danh mục cha">
            {categories
              .filter((item) => item.id !== Number(id))
              .map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      )}

      <Button type="primary" htmlType="submit" loading={loading}>
        Lưu Thay Đổi
      </Button>
    </Form>
  )
}

export default UpdateCategory
