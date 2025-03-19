import FormFooter from '@layout/components/products/FormFooter'
import ProductAttributes from '@layout/components/products/ProductAttributes'
import ProductForm from '@layout/components/products/ProductForm'
import ProductGallery from '@layout/components/products/ProductGallery'
import ProductVariants from '@layout/components/products/ProductVariants'
import { Form } from 'antd'

const CreateProduct = () => {
  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log('Form data:', values)
    })
  }

  return (
    <Form form={form} layout="vertical">
      <ProductForm />
      <ProductAttributes />
      <Form.Item label="Biến thể (SKU)" name="variants">
        <ProductVariants />
      </Form.Item>
      <ProductGallery />
      <FormFooter
        onSubmit={handleSubmit}
        onSubmitAndNew={() => {
          handleSubmit()
          form.resetFields()
        }}
        onCancel={() => console.log('Cancel')}
      />
    </Form>
  )
}

export default CreateProduct
