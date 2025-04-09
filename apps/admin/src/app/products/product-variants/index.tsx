import React, { useEffect, useState } from 'react'
import { Card, Input, Form, Button, Typography, message, Upload } from 'antd'
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useParams, useNavigate, useLocation } from 'react-router'
import type { UploadProps } from 'antd'
import apiClient from '@store/services/apiClient'

const { Title } = Typography

const ProductVariants = () => {
  const [form] = Form.useForm()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const [productName, setProductName] = useState(
    location.state?.productName || '',
  )

  useEffect(() => {
    const fetchSkus = (id: number) => apiClient.get(`/${id}/skus`)
    const fetchProduct = (id: number) => apiClient.get(`/products/${id}`)
    const fetchData = async () => {
      try {
        const shouldFetchProduct = !productName
        const [skuRes, productRes] = await Promise.all([
          fetchSkus(Number(id)),
          shouldFetchProduct ? fetchProduct(Number(id)) : Promise.resolve(null),
        ])

        const skus = skuRes?.data.data
        if (!skus) throw new Error('Không tìm thấy dữ liệu biến thể.')

        if (shouldFetchProduct && productRes?.data?.data) {
          setProductName(productRes.data.data.name)
        }

        const variants = skus.map((sku: any) => ({
          id: sku.id,
          name: sku.sku,
          stock: sku.stock,
          price: sku.price,
          image_url: sku.image_url,
          combination: sku.attributes.map((attr: any) => attr.value).join(', '),
          attributes: sku.attributes,
        }))

        form.setFieldsValue({ variants })
      } catch (error) {
        console.error(error)
        message.error('Lỗi khi tải dữ liệu sản phẩm.')
      }
    }

    if (id) {
      fetchData()
    }
  }, [id, form, productName])

  const onFinish = async (values: any) => {
    try {
      const promises = values.variants.map(async (variant: any) => {
        const imageFile = variant.image?.[0]?.originFileObj
        const formData = new FormData()
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
          formData.append('image', imageFile)
        }

        // const url = variant.id ? `/skus/${variant.id}` : `/${id}/skus`
        // console.log(`Request URL: ${url}`)

        try {
          const response = variant.id
            ? await apiClient.put(`/skus/${variant.id}`, formData)
            : await apiClient.post(`/products/${id}`, formData)

          if (response.status === 200 || response.status === 201) {
            message.success('Cập nhật biến thể thành công!')
          } else {
            throw new Error(
              `Lỗi khi lưu biến thể: ${response.data?.message || 'Không xác định'}`,
            )
          }
        } catch (error: any) {
          if (error.response && error.response.status === 404) {
            console.error('API Error (404): Route not found')
            message.error(
              'Lỗi: Không tìm thấy đường dẫn (Route not found). Vui lòng kiểm tra lại URL hoặc đường dẫn API.',
            )
          } else {
            console.error(
              'API Error:',
              error.response ? error.response.data : error,
            )
            message.error(
              `Lỗi khi lưu biến thể: ${error.response?.data?.message || error.message || 'Không xác định'}`,
            )
          }
        }
      })

      await Promise.all(promises)
      message.success('Cập nhật biến thể thành công!')
    } catch (error) {
      console.error('Lỗi khi lưu biến thể:', error)
      message.error('Lỗi khi lưu biến thể.')
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
            onClick={() => navigate(`/products/add-product-variants/${id}`)}
            style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
          >
            Thêm biến thể mới
          </Button>
        }
        style={{ marginTop: 24 }}
      >
        <Form.List name="variants">
          {(fields, { remove }) => (
            <>
              {fields.map((field) => (
                <Card key={field.key} type="inner" style={{ marginBottom: 16 }}>
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
                    name={[field.name, 'image']}
                    valuePropName="fileList"
                    getValueFromEvent={(e) =>
                      Array.isArray(e) ? e : e?.fileList
                    }
                  >
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                  </Form.Item>

                  <Button
                    danger
                    onClick={() => remove(field.name)}
                    icon={<MinusCircleOutlined />}
                  >
                    Xoá biến thể
                  </Button>
                </Card>
              ))}
            </>
          )}
        </Form.List>
      </Card>

      <Form.Item style={{ marginTop: 24 }}>
        <Button type="primary" htmlType="submit">
          Lưu thông tin biến thể
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ProductVariants
