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
  const { product_id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const [productName, setProductName] = useState(
    location.state?.productName || '',
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skuRes, productRes] = await Promise.all([
          apiClient.get(`/${product_id}/skus`),
          productName ? null : apiClient.get(`/products/${product_id}`),
        ])

        if (!skuRes?.data) {
          throw new Error('Không tìm thấy dữ liệu biến thể.')
        }

        if (!productName && productRes?.data) {
          setProductName(productRes?.data?.name || 'Không rõ')
        }
        console.log(skuRes)

        const variants = skuRes.data.map((skus: any) => ({
          id: skus.id,
          name: skus.name,
          quantity: skus.quantity,
          price: skus.price,
          image_url: skus.image_url,
        }))

        form.setFieldsValue({ variants })
      } catch (error) {
        console.error(error)
        message.error('Lỗi khi tải dữ liệu sản phẩm.')
      }
    }

    if (product_id) fetchData()
  }, [product_id, form, productName])

  const onFinish = async (values: any) => {
    try {
      const promises = values.variants.map(async (variant: any) => {
        const imageFile = variant.image?.[0]?.originFileObj
        const formData = new FormData()
        formData.append('combination', variant.combination || '')
        formData.append('quantity', variant.quantity)
        formData.append('price', variant.price)

        if (imageFile) {
          formData.append('image', imageFile)
        }

        if (variant.id) {
          return apiClient.post(
            `/products/skus/${variant.id}?_method=PUT`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          )
        } else {
          return apiClient.post(`/products/${product_id}/skus`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        }
      })

      await Promise.all(promises)
      message.success('Cập nhật biến thể thành công!')
    } catch (error) {
      console.error(error)
      message.error('Lỗi khi lưu biến thể.')
    }
  }

  const uploadProps: UploadProps = {
    listType: 'picture',
    maxCount: 1,
    beforeUpload: () => false, // Không upload ngay mà để cho người dùng chọn ảnh
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
                    name={[field.name, 'quantity']}
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
