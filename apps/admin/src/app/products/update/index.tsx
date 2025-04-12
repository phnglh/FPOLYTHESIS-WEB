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
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { RcFile, UploadFile } from 'antd/es/upload'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { fetchCategories } from '@store/slices/categorySlice'
import { fetchBrands } from '@store/slices/brandSlice'
import { fetchProductById } from '@store/slices/productSlice'
import { useParams, useNavigate } from 'react-router'
import apiClient from '@store/services/apiClient'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

const beforeUpload = (file: RcFile) => {
  const isImage = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
  ].includes(file.type)
  if (!isImage) toast.error('Chỉ hỗ trợ ảnh .jpg, .jpeg, .png, .webp')

  const isLt5MB = file.size / 1024 / 1024 < 5
  if (!isLt5MB) toast.error('Ảnh phải nhỏ hơn 5MB')

  return isImage && isLt5MB
}

const normFile = (e: any) => {
  return Array.isArray(e) ? e : e?.fileList
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
    if (id) dispatch(fetchProductById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (productDetail) {
      form.setFieldsValue({
        name: productDetail.name,
        category_id: productDetail.category_id,
        brand_id: productDetail.brand_id,
        is_published: productDetail.is_published === 1,
        description: productDetail.description,
        image_url: productDetail.image_url
          ? [
              {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: productDetail.image_url,
              },
            ]
          : [],
      })
    }
  }, [productDetail, form])

  const handleSubmit = async (values: any) => {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('name', values.name)
    formData.append('category_id', String(values.category_id))
    formData.append('brand_id', String(values.brand_id))
    formData.append('is_published', values.is_published ? '1' : '0')
    formData.append('description', values.description || '')

    const imageFile: UploadFile = values.image_url?.[0]
    const file = imageFile?.originFileObj
    if (file) formData.append('image_url', file)

    try {
      await apiClient.post(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('Cập nhật sản phẩm thành công!')
      navigate('/products')
    } catch (err) {
      toast.error('Cập nhật thất bại.')
      console.error(err)
    }
  }

  return (
    <>
      <Title level={3}>Cập nhật sản phẩm</Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
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
                <Option key={brand.id} value={brand.id}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Hiển thị"
            name="is_published"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Card>

        <Card style={{ marginTop: 24 }} title="Mô tả sản phẩm">
          <Form.Item name="description">
            <TextArea rows={4} />
          </Form.Item>
        </Card>

        <Card style={{ marginTop: 24 }} title="Ảnh sản phẩm">
          <Form.Item
            name="image_url"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture-card"
              beforeUpload={beforeUpload}
              customRequest={({ file, onSuccess }) =>
                setTimeout(() => onSuccess?.('ok'), 0)
              }
              maxCount={1}
            >
              <div>
                <UploadOutlined style={{ fontSize: 24 }} />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
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
      <ToastContainer />
    </>
  )
}

export default EditProduct
