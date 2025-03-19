import { Card, Form, Input, Button, Typography, Space, Flex } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { Brand } from '#types/brand'
import { addBrand, fetchBrands } from '@store/slices/brandSlice'

const { Title, Text } = Typography

const CreateBrand = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { data } = useSelector((state: RootState) => state.categories)

  console.log(data)
  useEffect(() => {
    dispatch(fetchBrands())
  }, [dispatch])

  const handleFinish = async (values: Brand) => {
    await dispatch(addBrand(values))
    navigate('/brands')
  }

  return (
    <Flex vertical gap="large" style={{ padding: '24px', width: '100%' }}>
      <Space direction="vertical" size="small">
        <Title level={3}>Thêm Thương Hiệu Mới</Title>
        <Text type="secondary">
          Điền thông tin để thêm thương hiệu vào hệ thống.
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
            label="Tên Thương Hiệu"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên thương hiệu' },
            ]}
          >
            <Input placeholder="Nhập tên thương hiệu" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả" />
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

export default CreateBrand
