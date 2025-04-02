import { Card, Flex, Form, Space, Typography } from 'antd'
import GeneralInfo from '@layout/components/products/GeneralInfo.tsx'
import SkuForm from '@layout/components/products/SkuForm.tsx'
import FormFooter from '@layout/components/products/FormFooter.tsx'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@store/store.ts'
import { addProduct } from '@store/slices/productSlice.ts'
import { toast } from 'react-toastify'

const { Title, Text } = Typography
const CreateProduct = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch<AppDispatch>()

  const handleSubmit = async (values) => {
    console.log('🟢 Form values:', values)

    const formData = new FormData()

    // Thêm các thông tin sản phẩm vào FormData
    formData.append('name', values.productName)
    formData.append('category_id', values?.category)
    formData.append('brand_id', values?.brand)
    formData.append('description', values.description)
    formData.append('is_published', values.visible ? 1 : 0)

    // Thêm ảnh sản phẩm vào FormData
    values.imageUrl.forEach((file) => {
      formData.append('image_url', file.originFileObj)
    })

    // Thêm các SKU vào FormData
    values?.skus?.forEach((sku, index) => {
      formData.append(`skus[${index}][price]`, sku.price)
      formData.append(`skus[${index}][stock]`, sku.stock)

      if (sku.attributes) {
        Object.entries(sku.attributes).forEach(([attributeId, value]) => {
          formData.append(
            `skus[${index}][attributes][${attributeId}][attribute_id]`,
            attributeId,
          )
          formData.append(
            `skus[${index}][attributes][${attributeId}][value]`,
            value,
          )
        })
      }

      sku.image_url?.forEach((file) => {
        formData.append(`skus[${index}][image_url]`, file.originFileObj)
      })
      formData.forEach((value, key) => {
        console.log(`FormData key: ${key}, value: ${value}`)
      })
    })

    try {
      // Gửi FormData để tạo sản phẩm, bao gồm thông tin sản phẩm và ảnh
      await dispatch(addProduct(formData)) // Giả sử api.createProduct là hàm API để tạo sản phẩm

      // Sau khi gửi FormData thành công, bạn có thể làm gì đó như hiển thị thông báo thành công
      toast.success('Sản phẩm đã được tạo thành công!')

      // Bạn có thể dispatch các action khác nếu cần sau khi tạo sản phẩm thành công
    } catch (error) {
      console.error('❌ Error submitting product:', error)
      toast.error('Lỗi khi gửi dữ liệu. Vui lòng thử lại!')
    }
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
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <GeneralInfo form={form} />
          <SkuForm />
          <FormFooter
            onSubmit={form.submit}
            onSubmitAndNew={() => {
              form.submit()
              form.resetFields()
            }}
            onCancel={() => form.resetFields()}
          />
        </Form>
      </Card>
    </Flex>
  )
}

export default CreateProduct
