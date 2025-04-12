import React, { useState, useEffect } from 'react'
import {
  Card,
  Form,
  Button,
  Upload,
  Input,
  message,
  Checkbox,
  Typography,
} from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router'
import apiClient from '@store/services/apiClient'

const { Title } = Typography

interface AttributeValue {
  id: number
  attribute_id: number
  value: string
  created_at: string
  updated_at: string
}

interface Attribute {
  id: number
  name: string
  values: AttributeValue[]
}

interface VariantFormValue {
  image?: any
  quantity: number
  price: number
}

const AddProductVariants: React.FC = () => {
  const [form] = Form.useForm()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [combinations, setCombinations] = useState<string[][]>([])
  const [productName, setProductName] = useState<string>('')
  const [fileList, setFileList] = useState([])

  const fetchAttributes = async () => {
    try {
      const res = await apiClient.get(`/attributes`)
      setAttributes(res.data.data || [])
    } catch (error) {
      console.error(error)
      message.error('Không thể tải thuộc tính sản phẩm.')
    }
  }

  const fetchProductName = async () => {
    try {
      const res = await apiClient.get(`/products/${id}`)
      setProductName(res.data.data.name || '')
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (id) {
      fetchAttributes()
      fetchProductName()
    }
  }, [id])

  const cartesian = (arr: any[][]): any[][] => {
    return arr.reduce(
      (a, b) => a.flatMap((d: any) => b.map((e: any) => [...d, e])),
      [[]],
    )
  }

  const generateCombinations = () => {
    const selectedAttributes = form.getFieldValue('attributes')
    if (!selectedAttributes) {
      message.warning('Vui lòng chọn ít nhất một thuộc tính')
      return
    }

    const valuesList = attributes
      .map((attr) => selectedAttributes[attr.id] || [])
      .filter((vals) => vals.length > 0)

    if (valuesList.length === 0) {
      message.warning('Vui lòng chọn ít nhất một thuộc tính')
      return
    }

    const combos = cartesian(valuesList)
    setCombinations(combos)

    form.setFieldsValue({
      variants: combos.map(() => ({ quantity: 0, price: 0, image: [] })),
    })
  }

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList)
    form.setFieldsValue({ imageUrl: fileList })
  }

  const onFinish = async (values: any) => {
    try {
      const selectedAttributes = values.attributes

      for (let i = 0; i < combinations.length; i++) {
        const combo = combinations[i]
        const formData = new FormData()

        combo.forEach((val: AttributeValue, idx: number) => {
          formData.append(
            `attributes[${idx}][attribute_id]`,
            val.attribute_id.toString(),
          )
          formData.append(`attributes[${idx}][value]`, val.value)
        })

        formData.append('combination', combo.map((v) => v.value).join(' - '))
        // formData.append('stock', values.variants[i].quantity)
        // formData.append('price', values.variants[i].price)
        formData.append(
          'stock',
          Math.floor(values.variants[i].quantity).toString(),
        )
        formData.append(
          'price',
          Math.floor(values.variants[i].price).toString(),
        )

        const imageFile = values.variants[i]?.image?.[0]?.originFileObj
        console.log(imageFile)

        if (imageFile) {
          formData.append('image_url', imageFile)
        }

        await apiClient.post(`/${id}/skus`, formData)
      }

      message.success('Tất cả biến thể đã được lưu')
      navigate('/products')
    } catch (error) {
      console.error(error)
      message.error('Lỗi khi lưu biến thể sản phẩm')
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Card title="Thông tin sản phẩm" style={{ marginBottom: 24 }}>
        <Title level={4}>Tên sản phẩm: {productName}</Title>
      </Card>

      <Card title="Thuộc tính sản phẩm" style={{ marginBottom: 24 }}>
        {attributes.map((attribute) => (
          <Form.Item
            key={attribute.id}
            name={['attributes', attribute.id]}
            label={`Chọn ${attribute.name}`}
          >
            <Checkbox.Group>
              {attribute.values.map((val) => (
                <Checkbox key={val.id} value={val}>
                  {val.value}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
        ))}

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
              key={combo.map((v) => v.id).join('-')}
              type="inner"
              style={{ marginBottom: 16 }}
              title={`Kết hợp: ${combo.map((v) => v.value).join(' - ')}`}
            >
              <Form.Item
                label="Hình ảnh"
                name="imageUrl"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
              >
                <Upload
                  listType="picture"
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={handleImageChange}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
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
