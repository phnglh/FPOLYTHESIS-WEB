import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Typography,
  Space,
  Flex,
} from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { addCategory, fetchCategories } from '@store/slices/categorySlice'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { Category } from '#types/category'

const { Title, Text } = Typography

const CreateCategory = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { data } = useSelector((state: RootState) => state.categories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleFinish = async (values: Category) => {
    await dispatch(addCategory(values))
    navigate('/categories')
  }

  return (
    <Flex vertical gap="large" style={{ padding: '24px', width: '100%' }}>
      <Space direction="vertical" size="small">
        <Title level={3}>Thêm Danh Mục Mới</Title>
        <Text type="secondary">
          Điền thông tin để thêm danh mục vào hệ thống.
        </Text>
      </Space>

      <Card style={{ maxWidth: 800, width: '100%' }}>
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          size="large"
        >
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
            <Input.TextArea rows={4} placeholder="Nhập mô tả danh mục" />
          </Form.Item>

          <Form.Item label="Danh Mục Cha" name="parent_id">
            <Select placeholder="Chọn danh mục cha (nếu có)" allowClear>
              {data
                .filter((item) => item.parent_id === null)
                .map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Thêm Danh Mục
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}

export default CreateCategory
