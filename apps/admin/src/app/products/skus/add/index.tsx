import { useState, useEffect } from 'react'
import {
  Card,
  Form,
  Button,
  Upload,
  Input,
  message,
  Radio,
  Typography,
  Space,
} from 'antd'
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router'
import apiClient from '@store/services/apiClient'
import { toast } from 'react-toastify'

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

const AddSku = () => {
  const [form] = Form.useForm()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [combinations, setCombinations] = useState<AttributeValue[][]>([])
  const [productName, setProductName] = useState<string>('')
  const [fileLists, setFileLists] = useState<{ [key: number]: any[] }>({})

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

  const cartesian = (arr: AttributeValue[][]): AttributeValue[][] => {
    return arr.reduce(
      (a, b) =>
        a.flatMap((d: AttributeValue[]) =>
          b.map((e: AttributeValue) => [...d, e]),
        ),
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
      .map((attr) => {
        const selectedValue = selectedAttributes[attr.id]
        return selectedValue ? [selectedValue] : []
      })
      .filter((vals) => vals.length > 0)

    if (valuesList.length === 0) {
      message.warning('Vui lòng chọn ít nhất một giá trị cho mỗi thuộc tính')
      return
    }

    const newCombos = cartesian(valuesList)

    // Check for duplicate combinations
    const existingComboStrings = combinations.map((combo) =>
      combo.map((v) => v.id).join('-'),
    )
    const newUniqueCombos = newCombos.filter((combo) => {
      const comboString = combo.map((v) => v.id).join('-')
      return !existingComboStrings.includes(comboString)
    })

    if (newUniqueCombos.length === 0) {
      message.warning('Biến thể này đã tồn tại')
      return
    }

    // Append new combinations to existing ones
    setCombinations((prev) => [...prev, ...newUniqueCombos])

    // Get current variants from form
    const currentVariants = form.getFieldValue('variants') || []

    // Append new variants to existing ones
    form.setFieldsValue({
      variants: [
        ...currentVariants,
        ...newUniqueCombos.map(() => ({ quantity: 0, price: 0, image: [] })),
      ],
    })
  }

  const handleImageChange = (
    index: number,
    { fileList }: { fileList: any[] },
  ) => {
    setFileLists((prev) => ({
      ...prev,
      [index]: fileList,
    }))
    form.setFieldsValue({
      variants: form
        .getFieldValue('variants')
        .map((variant: any, i: number) =>
          i === index ? { ...variant, image: fileList } : variant,
        ),
    })
  }

  const onFinish = async (values: any) => {
    try {
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
        formData.append(
          'stock',
          Math.floor(values.variants[i].quantity).toString(),
        )
        formData.append(
          'price',
          Math.floor(values.variants[i].price).toString(),
        )

        const imageFile = values.variants[i]?.image?.[0]?.originFileObj
        if (imageFile) {
          formData.append('image_url', imageFile)
        }

        await apiClient.post(`/${id}/skus`, formData)
      }

      toast.success('Tất cả biến thể đã được lưu')
      navigate('/products')
    } catch (error) {
      toast.error(error.response.data.error)
    }
  }

  const handleDeleteVariant = (index: number) => {
    // Remove combination at the specified index
    setCombinations((prev) => prev.filter((_, i) => i !== index))

    // Remove variant from form
    const currentVariants = form.getFieldValue('variants') || []
    form.setFieldsValue({
      variants: currentVariants.filter((_: any, i: number) => i !== index),
    })

    // Remove associated fileList
    setFileLists((prev) => {
      const newFileLists = { ...prev }
      delete newFileLists[index]
      // Reindex remaining fileLists to match new variant indices
      const reindexedFileLists: { [key: number]: any[] } = {}
      Object.keys(newFileLists).forEach((key, i) => {
        const newIndex =
          parseInt(key) > index ? parseInt(key) - 1 : parseInt(key)
        reindexedFileLists[newIndex] = newFileLists[key]
      })
      return reindexedFileLists
    })

    message.success('Đã xóa biến thể')
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
            rules={[
              { required: true, message: `Vui lòng chọn ${attribute.name}` },
            ]}
          >
            <Radio.Group>
              {attribute.values.map((val) => (
                <Radio key={val.id} value={val}>
                  {val.value}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        ))}

        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={generateCombinations}
        >
          Thêm biến thể
        </Button>
      </Card>

      {combinations.length > 0 && (
        <Card title="Biến thể sản phẩm">
          {combinations.map((combo, index) => (
            <Card
              key={combo.map((v) => v.id).join('-')}
              type="inner"
              style={{ marginBottom: 16 }}
              title={
                <Space>
                  <span>Kết hợp: {combo.map((v) => v.value).join(' - ')}</span>
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteVariant(index)}
                  />
                </Space>
              }
            >
              <Form.Item
                label="Hình ảnh"
                name={['variants', index, 'image']}
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
              >
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  fileList={fileLists[index] || []}
                  onChange={(info) => handleImageChange(index, info)}
                  maxCount={1}
                >
                  Upload
                </Upload>
              </Form.Item>
              <Form.Item
                name={['variants', index, 'quantity']}
                label="Số lượng"
                rules={[{ required: true, message: 'Nhập số lượng' }]}
              >
                <Input type="number" placeholder="Số lượng" min={0} />
              </Form.Item>

              <Form.Item
                name={['variants', index, 'price']}
                label="Giá"
                rules={[{ required: true, message: 'Nhập giá' }]}
              >
                <Input type="number" placeholder="Giá sản phẩm" min={0} />
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

export default AddSku
