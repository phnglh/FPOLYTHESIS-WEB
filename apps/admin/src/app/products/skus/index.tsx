import { useEffect, useState } from 'react'
import { Card, Input, Form, Button, Typography, message, Upload } from 'antd'
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useParams, useNavigate, useLocation } from 'react-router'
import type { UploadProps } from 'antd'
import apiClient from '@store/services/apiClient'
import { toast } from 'react-toastify'

const { Title } = Typography

const Skus = () => {
  const [form] = Form.useForm()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const [productName, setProductName] = useState(
    location.state?.productName || '',
  )

  const fetchSkus = (id: number) => apiClient.get(`/${id}/skus`)
  const fetchProduct = (id: number) => apiClient.get(`/products/${id}`)

  const fetchSkusAndSetForm = async (id: number) => {
    try {
      const res = await fetchSkus(id)
      const skus = res?.data?.data || []

      const variants = skus.map((sku: any) => ({
        id: sku.id,
        name: sku.sku,
        stock: sku.stock,
        price: sku.price,
        image_url: sku.image_url
          ? [
              {
                url: sku.image_url,
              },
            ]
          : [],
        combination: sku.attributes.map((attr: any) => attr.value).join(', '),
        attributes: sku.attributes,
      }))

      form.setFieldsValue({ variants })
    } catch (err) {
      console.error(err)
      toast.error('Lỗi khi tải danh sách biến thể.')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shouldFetchProduct = !productName
        if (shouldFetchProduct) {
          const productRes = await fetchProduct(Number(id))
          if (productRes?.data?.data) {
            setProductName(productRes.data.data.name)
          }
        }

        await fetchSkusAndSetForm(Number(id))
      } catch (error) {
        console.error(error)
        toast.error('Lỗi khi tải dữ liệu sản phẩm.')
      }
    }

    if (id) {
      fetchData()
    }
  }, [id, form])

  const onFinish = async (values: any) => {
    try {
      const promises = values.variants.map(async (variant: any) => {
        const imageFile = variant.image_url?.[0]?.originFileObj
        const formData = new FormData()
        formData.append('_method', 'PUT')
        formData.append('combination', variant.combination || '')
        formData.append('stock', variant.stock)
        formData.append('price', variant.price)
        if (Array.isArray(variant.attributes)) {
          variant.attributes.forEach((attr: any, index: number) => {
            formData.append(
              `attributes[${index}][attribute_id]`,
              attr.attribute_id,
            )
            formData.append(`attributes[${index}][value]`, attr.value)
          })
        }
        if (imageFile) {
          formData.append('image_url', imageFile)
        }

        try {
          const response = variant.id
            ? await apiClient.post(`/skus/${variant.id}`, formData)
            : await apiClient.post(`/products/${id}`, formData)

          return response
        } catch (error: any) {
          if (error.response && error.response.status === 404) {
            console.error('API Error (404): Route not found')
            toast.error(
              'Lỗi: Không tìm thấy đường dẫn (Route not found). Vui lòng kiểm tra lại URL hoặc đường dẫn API.',
            )
          } else {
            console.error(
              'API Error:',
              error.response ? error.response.data : error,
            )
            toast.error(
              `Lỗi khi lưu biến thể: ${error.response?.data?.message || error.message || 'Không xác định'}`,
            )
          }
        }
      })

      await Promise.all(promises)
      toast.success('Cập nhật biến thể thành công!')
    } catch (error) {
      console.error('Lỗi khi lưu biến thể:', error)
      toast.error('Lỗi khi lưu biến thể.')
    }
  }

  const deleteSku = async (skuId: number) => {
    try {
      await apiClient.delete(`/skus/${skuId}`)
      await fetchSkusAndSetForm(Number(id))
      toast.success('Đã xóa biến thể thành công!')
    } catch (error) {
      toast.error('Lỗi khi xóa biến thể.')
      console.error('Error deleting SKU:', error)
    }
  }

  const uploadProps: UploadProps = {
    listType: 'picture',
    maxCount: 1,
    beforeUpload: () => false,
  }

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Card>
        <Title level={4}>Tên sản phẩm: {productName}</Title>
      </Card>

      <Card
        title="Biến thể sản phẩm"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(`/products/${id}/skus/add`)}
          >
            Thêm biến thể mới
          </Button>
        }
        style={{ marginTop: 24 }}
      >
        <Form.List name="variants">
          {(fields) => (
            <>
              {fields.map((field) => (
                <Card
                  key={field.key}
                  type="inner"
                  style={{
                    marginBottom: 24,
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: 16,
                    }}
                  >
                    <Form.Item
                      {...field}
                      label="Kết hợp"
                      name={[field.name, 'combination']}
                    >
                      <Input disabled placeholder="Kết hợp" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Số lượng"
                      name={[field.name, 'stock']}
                      rules={[
                        { required: true, message: 'Vui lòng nhập số lượng' },
                      ]}
                    >
                      <Input type="number" placeholder="Nhập số lượng" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Giá"
                      name={[field.name, 'price']}
                      rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                    >
                      <Input type="number" placeholder="Nhập giá" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Ảnh biến thể"
                      name={[field.name, 'image_url']}
                      valuePropName="fileList"
                      getValueFromEvent={(e) =>
                        Array.isArray(e) ? e : e?.fileList
                      }
                    >
                      <Upload
                        {...uploadProps}
                        listType="picture-card"
                        showUploadList={{
                          showPreviewIcon: false,
                          showRemoveIcon: true,
                        }}
                      >
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                        </div>
                      </Upload>
                    </Form.Item>
                  </div>

                  <div style={{ textAlign: 'right', marginTop: 12 }}>
                    <Button
                      danger
                      onClick={() => {
                        const variantId =
                          form.getFieldValue('variants')?.[field.name]?.id
                        if (variantId) {
                          deleteSku(variantId)
                        } else {
                          toast.error('Không tìm thấy ID của biến thể.')
                        }
                      }}
                      icon={<MinusCircleOutlined />}
                    >
                      Xoá biến thể
                    </Button>
                  </div>
                </Card>
              ))}
            </>
          )}
        </Form.List>
      </Card>

      <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
        <Button type="primary" htmlType="submit" size="large">
          Lưu thông tin biến thể
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Skus
