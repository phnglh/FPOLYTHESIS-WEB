import React, { useEffect } from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  Switch,
  Upload,
  Button,
  Typography,
  Row,
  Col,
  message,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { fetchCategories } from '@store/slices/categorySlice'
import { fetchBrands } from '@store/slices/brandSlice'
import { fetchProductById, updateProduct } from '@store/slices/productSlice'
import { useParams, useNavigate } from 'react-router'
import apiClient from '@store/services/apiClient'

const { Title } = Typography
const { TextArea } = Input

const beforeUpload = (file: RcFile) => {
  const isImage = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
  ].includes(file.type)
  if (!isImage) {
    message.error('Chỉ hỗ trợ ảnh .jpg, .jpeg, .png, .webp')
  }

  const isLt5MB = file.size / 1024 / 1024 < 5
  if (!isLt5MB) {
    message.error('Ảnh phải nhỏ hơn 5MB')
  }

  return isImage && isLt5MB
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const categories = useSelector((state: RootState) => state.categories.data)
  const brands = useSelector((state: RootState) => state.brands.data)
  const productDetail = useSelector(
    (state: RootState) => state.products.selectedItem,
  )

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchBrands())
    if (id) {
      dispatch(fetchProductById(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (productDetail) {
      form.setFieldsValue({
        name: productDetail.name,
        category_id: productDetail.category_id,
        brand_id: productDetail.brand_id,
        is_published: !!productDetail.is_published,
        has_variant: !!productDetail.has_variant,
        description: productDetail.description,
        thumbnail: productDetail.thumbnail
          ? [
              {
                uid: '-1',
                name: 'thumbnail',
                status: 'done',
                url: productDetail.thumbnail,
              },
            ]
          : [],
      })
    }
  }, [productDetail, form])

  const handleSubmit = async (values: any) => {
    if (!id) return

    try {
      const formData = new FormData()
      formData.append('id', id)
      formData.append('name', values.name)
      formData.append('category_id', values.category_id)
      formData.append('brand_id', values.brand_id)
      formData.append('is_published', values.is_published ? '1' : '0')
      formData.append('has_variant', values.has_variant ? '1' : '0')
      formData.append('description', values.description || '')
      const file = values.thumbnail?.[0]?.originFileObj
      if (file) {
        formData.append('thumbnail', file)
      }
      const res = await apiClient.put(`products/${id}`, formData)
      console.log(res)
      navigate('/products')
    } catch (error) {
      console.error(error)
      message.error('Có lỗi xảy ra khi cập nhật sản phẩm.')
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        is_published: true,
        has_variant: false,
      }}
    >
      <Card title="Thông tin sản phẩm">
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category_id"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
        >
          <Select placeholder="Chọn danh mục">
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Thương hiệu"
          name="brand_id"
          rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
        >
          <Select placeholder="Chọn thương hiệu">
            {brands.map((brand) => (
              <Select.Option key={brand.id} value={brand.id}>
                {brand.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Hiển thị" name="is_published" valuePropName="checked">
          <Switch disabled={productDetail?.is_published === 0} />
        </Form.Item>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={5}>Biến thể sản phẩm</Title>
          </Col>
          <Col>
            <Button
              type="link"
              disabled={!id}
              onClick={() =>
                navigate(`/products/product-variants/${id}`, {
                  state: { productName: productDetail?.name },
                })
              }
            >
              Xem biến thể &rsaquo;
            </Button>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 24 }} title="Mô tả">
        <Form.Item name="description">
          <TextArea rows={4} />
        </Form.Item>
      </Card>

      <Card style={{ marginTop: 24 }} title="Ảnh sản phẩm (1 ảnh)">
        <Form.Item
          name="thumbnail"
          label="Thumbnail"
          rules={[{ required: true, message: 'Vui lòng chọn ảnh thumbnail' }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={beforeUpload}
            showUploadList={{ showPreviewIcon: false }}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Chọn ảnh</div>
            </div>
          </Upload>
        </Form.Item>
      </Card>

      <Form.Item style={{ marginTop: 24 }}>
        <Button type="primary" htmlType="submit">
          Lưu sản phẩm
        </Button>
      </Form.Item>
    </Form>
  )
}

export default EditProduct
