import React, { useState, useEffect } from 'react'
import { Card, Form, Button, Upload, Input, message, Radio } from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router'
import apiClient from '@store/services/apiClient'

const colors = ['Đỏ', 'Xanh', 'Tím', 'Vàng']
const sizes = ['S', 'M', 'L', 'XL']

const AddProductVariants = () => {
  const [form] = Form.useForm()
  const [combinations, setCombinations] = useState<
    { color: string; size: string }[]
  >([])
  const [variantValues, setVariantValues] = useState<Record<string, any>>({})
  const [productName, setProductName] = useState<string>('')

  const { id } = useParams()
  const navigate = useNavigate()

  const generateCombinations = () => {
    const selectedColor = form.getFieldValue('colors')
    const selectedSize = form.getFieldValue('sizes')

    if (!selectedColor || !selectedSize) {
      message.warning('Vui lòng chọn màu sắc và kích thước.')
      return
    }

    const key = `${selectedColor}-${selectedSize}`
    const combo = [{ color: selectedColor, size: selectedSize }]
    setCombinations(combo)

    form.setFieldsValue({
      variants: combo.map((item) => {
        const key = `${item.color}-${item.size}`
        return (
          variantValues[key] || {
            quantity: 0,
            price: 0,
            image: [],
          }
        )
      }),
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skuRes, productRes] = await Promise.all([
          apiClient.get(`/${id}/skus`),
          productName ? null : apiClient.get(`/products/${id}`),
        ])

        if (!skuRes?.data) {
          throw new Error('Không tìm thấy dữ liệu biến thể.')
        }

        if (!productName && productRes?.data) {
          setProductName(productRes?.data?.name || 'Không rõ')
        }

        const variants = skuRes.data.map((sku: any) => ({
          id: sku.id,
          combination: sku.combination,
          quantity: sku.quantity,
          price: sku.price,
          image: sku.image
            ? [
                {
                  uid: `-${sku.id}`,
                  name: 'Ảnh biến thể',
                  status: 'done',
                  url: sku.image,
                },
              ]
            : [],
        }))

        form.setFieldsValue({ variants })
      } catch (error) {
        console.error(error)
        message.error('Lỗi khi tải dữ liệu sản phẩm.')
      }
    }

    if (id) fetchData()
  }, [id, form, productName])

  const onFinish = (values: any) => {
    console.log('Form values:', values)

    apiClient
      .post(`/${id}/skus`, values)
      .then((response) => {
        message.success('Biến thể sản phẩm đã được lưu')
        navigate('/products')
      })
      .catch((error) => {
        console.error(error)
        message.error('Lỗi khi lưu biến thể sản phẩm')
      })
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Card title="Thuộc tính sản phẩm" style={{ marginBottom: 24 }}>
        <Form.Item
          name="colors"
          label="Chọn màu sắc"
          rules={[{ required: true, message: 'Vui lòng chọn màu sắc' }]}
        >
          <Radio.Group>
            {colors.map((color) => (
              <Radio key={color} value={color}>
                {color}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="sizes"
          label="Chọn kích thước"
          rules={[{ required: true, message: 'Vui lòng chọn kích thước' }]}
        >
          <Radio.Group>
            {sizes.map((size) => (
              <Radio key={size} value={size}>
                {size}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={generateCombinations}
        >
          Tạo ra biến thể
        </Button>
      </Card>

      {combinations.length > 0 && (
        <Card title="Biến thể sản phẩm">
          {combinations.map((combo, index) => (
            <Card
              key={`${combo.color}-${combo.size}`}
              type="inner"
              style={{ marginBottom: 16 }}
              title={`Kết hợp : (${combo.color}) - (${combo.size})`}
            >
              <Form.Item
                name={['variants', index, 'image']}
                label="Ảnh"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name={['variants', index, 'quantity']}
                label="Số lượng"
                rules={[{ required: true, message: 'Nhập số lượng' }]}
              >
                <Input type="number" placeholder="Số lượng" />
              </Form.Item>

              <Form.Item
                name={['variants', index, 'price']}
                label="Giá"
                rules={[{ required: true, message: 'Nhập giá' }]}
              >
                <Input type="number" placeholder="Giá sản phẩm" />
              </Form.Item>
            </Card>
          ))}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu tất cả biến thể
            </Button>
          </Form.Item>
        </Card>
      )}
    </Form>
  )
}

export default AddProductVariants
