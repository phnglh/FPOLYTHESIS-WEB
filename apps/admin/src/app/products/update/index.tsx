import { useEffect } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { updateProduct, fetchProductById } from '@store/slices/productSlice.ts'
import { AppDispatch, RootState } from '@store/store.ts'
import {
  Form,
  Flex,
  Card,
  Typography,
  Space,
  Input,
  Select,
  Button,
  Switch,
  Upload,
  Row,
  Col,
} from 'antd'
import { toast } from 'react-toastify'
import { UploadOutlined } from '@ant-design/icons'
import { fetchCategories } from '@store/slices/categorySlice'
import { fetchBrands } from '@store/slices/brandSlice'

const { Title, Text } = Typography
const { Option } = Select

const EditProduct = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch<AppDispatch>()
  const { id } = useParams()

  const product = useSelector((state: RootState) => state.products.selectedItem)
  const categories = useSelector((state: RootState) => state.categories.data)
  const brands = useSelector((state: RootState) => state.brands.data)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchBrands())
    if (!product && id) {
      dispatch(fetchProductById(id))
    } else if (product) {
      form.setFieldsValue({
        productName: product.name,
        category: product.category_id,
        brand: product.brand_id,
        description: product.description,
        visible: product.is_published === 1,
        imageUrl: product.image_url,
        skus: product.skus,
      })
    }
  }, [product, id, dispatch, form])

  const handleSubmit = async (values) => {
    const formData = new FormData()

    formData.append('name', values.productName)
    formData.append('category_id', values?.category)
    formData.append('brand_id', values?.brand)
    formData.append('description', values.description)
    formData.append('is_published', values.visible ? 1 : 0)

    const imageUrl = values.imageUrl

    // Kiểm tra nếu imageUrl là một mảng (fileList từ Upload) hoặc một chuỗi
    if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      // Lấy URL của tệp đầu tiên trong danh sách
      const firstImage = imageUrl[0]
      if (firstImage?.url) {
        formData.append('image_url', firstImage.url)
      } else {
        // Nếu không có URL, thì thêm tệp vào formData
        formData.append('image_url', firstImage.originFileObj)
      }
    } else if (typeof imageUrl === 'string') {
      formData.append('image_url', imageUrl)
    }

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

      // Ensure `image_url` is an array
      const skuImageUrls = Array.isArray(sku.image_url)
        ? sku.image_url
        : [sku.image_url]
      skuImageUrls.forEach((file) => {
        formData.append(`skus[${index}][image_url]`, file)
      })
    })

    try {
      await dispatch(updateProduct({ id, data: formData }))
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1])
      }
      toast.success('Cập nhật sản phẩm thành công!')
    } catch (error) {
      console.error('Lỗi cập nhật:', error)
      toast.error('Cập nhật thất bại, vui lòng thử lại!')
    }
  }

  const handleImageChange = ({ fileList }) => {
    // Đảm bảo fileList là mảng trước khi sử dụng .forEach
    const validFileList = Array.isArray(fileList) ? fileList : []

    // Kiểm tra và xử lý fileList
    validFileList.forEach((file) => {
      console.log(file) // Xử lý tệp tin tại đây nếu cần
    })

    // Cập nhật giá trị imageUrl trong form
    form.setFieldsValue({ imageUrl: validFileList })
  }

  return (
    <Flex vertical gap="large" style={{ padding: '24px', width: '100%' }}>
      <Space direction="vertical" size="small">
        <Title level={3}>Cập Nhật Sản Phẩm</Title>
        <Text type="secondary">Chỉnh sửa thông tin sản phẩm.</Text>
      </Space>
      <Card style={{ maxWidth: 800, width: '100%' }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên sản phẩm"
                name="productName"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên sản phẩm' },
                ]}
              >
                <Input placeholder="Tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Danh mục" name="category">
                <Select placeholder="Chọn danh mục">
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thương hiệu" name="brand">
                <Select placeholder="Chọn thương hiệu">
                  {brands.map((brand) => (
                    <Option key={brand.id} value={brand.id}>
                      {brand.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Hiển thị"
                name="visible"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Hình ảnh">
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  onChange={handleImageChange}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea placeholder="Mô tả sản phẩm" />
              </Form.Item>
            </Col>
          </Row>

          {/* SKU Form */}
          <Form.List name="skus">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    title={`SKU ${key + 1}`}
                    className="mb-4"
                    extra={<Button onClick={() => remove(name)}>Xóa</Button>}
                  >
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          label="Giá"
                          name={[name, 'price']}
                          rules={[{ required: true, message: 'Nhập giá' }]}
                        >
                          <Input type="number" placeholder="Giá" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          label="Số lượng"
                          name={[name, 'stock']}
                          rules={[{ required: true, message: 'Nhập số lượng' }]}
                        >
                          <Input type="number" placeholder="Số lượng" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="Hình ảnh" name={[name, 'image_url']}>
                          <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            multiple
                          >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Thêm SKU
                </Button>
              </>
            )}
          </Form.List>

          {/* Footer with submit and reset buttons */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
            <Button type="default" onClick={() => form.resetFields()}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  )
}

export default EditProduct
