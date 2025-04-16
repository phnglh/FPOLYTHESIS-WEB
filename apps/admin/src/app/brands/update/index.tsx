import { Form, Input, Button, Spin, Card, Space, Typography, Flex } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { fetchBrandById, updateBrand } from '@store/slices/brandSlice'
import { Brand } from '#types/brand'

const { Title, Text } = Typography

const UpdateBrand = () => {
  const [form] = Form.useForm()
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const {
    data: brands,
    loading,
    selectedItem,
  } = useSelector((state: RootState) => state.brands)

  useEffect(() => {
    if (id) {
      dispatch(fetchBrandById(Number(id)))
    }
  }, [dispatch, id])

  console.log(brands)
  useEffect(() => {
    if (selectedItem && brands.length > 0) {
      form.setFieldsValue({
        name: selectedItem.name,
        description: selectedItem.description,
      })
    }
  }, [selectedItem, brands, form])

  const handleFinish = async (values: Brand) => {
    await dispatch(updateBrand({ ...values, id: Number(id) }))
    toast.success('Cập nhập thương hiệu thành công!')
    navigate('/brands')
  }

  if (!brands) {
    return <Spin size="large" />
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <Flex
        vertical
        gap="large"
        style={{ padding: '24px', width: '100%', maxWidth: 900 }}
      >
        <Space direction="vertical" size="small">
          <Title level={3}>Cập nhập Thương hiệu mới</Title>
          <Text type="secondary">
            Điền thông tin để cập nhập thương hiệu vào hệ thống.
          </Text>
        </Space>

        <Card style={{ maxWidth: 800, width: '100%' }}>
          <Form form={form} onFinish={handleFinish} layout="vertical">
            <Form.Item
              label="Tên Thương hiệu"
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
              <Input placeholder="Nhập mô tả" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu Thay Đổi
            </Button>
          </Form>
        </Card>
      </Flex>
    </div>
  )
}

export default UpdateBrand
