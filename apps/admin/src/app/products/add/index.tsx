import { Category } from '@/@types/category'
import type { Attribute, Variant } from '@/@types/product'
import {
  getAllAttribute,
  getAllAttributeValue,
} from '@/api/services/AttributeService'
import { getAllCategory } from '@/api/services/CategoryService'
import { createProduct } from '@/api/services/ProductService'
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Button, Form, Input, Select, Space, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
const { Option } = Select

const AddProductPage = () => {
  const [form] = Form.useForm()
  const [categories, setCategories] = useState<Category[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [attributeValues, setAttributeValues] = useState<any>({})
  const navigate = useNavigate()

  const { control, handleSubmit } = useForm()

  const handleGoBack = () => {
    navigate('/admin/quan-ly-san-pham')
  }

  // Fetch categories, attributes, and attribute values on component mount
  useEffect(() => {
    fetchCategories()
    fetchAttributes()
    fetchAttributeValues()
  }, [])

  // Fetch all categories from API
  const fetchCategories = async () => {
    const allCategory = await getAllCategory()
    setCategories(allCategory)
  }

  // Fetch all attributes from API
  const fetchAttributes = async () => {
    const allAttribute = await getAllAttribute()
    setAttributes(allAttribute)
  }

  // Fetch all attribute values from API and organize them by attribute_id
  const fetchAttributeValues = async () => {
    const values = await getAllAttributeValue()
    const organizedValues = values.reduce((acc: any, item: any) => {
      if (!acc[item.attribute_id]) {
        acc[item.attribute_id] = []
      }
      acc[item.attribute_id].push(item)
      return acc
    }, {})
    setAttributeValues(organizedValues)
  }
  const onSubmit = async (data: FieldValues) => {
    if (!uploadedImages) {
      toast.error('Please upload an image.')
      return // Exit early if image is not provided
    }

    const formattedData: any = {
      name: data.name,
      category_id: data.category_id,
      brand: data.brand,
      description: data.description,
      image: uploadedImages,
      variants: variants.map((variant: any) => {
        // Lấy các key từ variant.attributes
        const attributeKeys = Object.keys(variant.attributes)
        return {
          price: variant.price,
          price_promotional: variant.price_promotional,
          quantity: variant.quantity,
          attributes: attributeKeys.map((key) => ({
            name: key,
            value: variant.attributes[key],
          })),
        }
      }),
    }
    try {
      const response = await createProduct(formattedData)
      console.log(response)

      toast.success('Product created successfully.')
      navigate('/admin/quan-ly-san-pham')
    } catch (error) {
      console.error('Failed to create product:', error)
      toast.error('Failed to create product. Please try again later.')
    }
  }

  // Add a new variant to the list
  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        price: 0,
        price_promotional: 0,
        quantity: 0,
        attributes: {
          color: '',
          size: '',
        },
      },
    ])
  }

  // Remove a variant from the list
  const handleRemoveVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index)
    setVariants(newVariants)
  }

  // Handle attribute change for a variant
  const handleAttributeChange = (
    attributeName: any,
    value: any,
    index: any,
  ) => {
    const newVariants: any = [...variants]
    newVariants[index].attributes[attributeName] = value
    setVariants(newVariants)
  }
  const [uploadedImages, setUploadedImages] = useState([])
  const props: any = {
    action: 'https://api.cloudinary.com/v1_1/dsul0ahfu/image/upload',
    onChange({ file }: any) {
      if (file.status !== 'uploading') {
        setUploadedImages(file.response.secure_url)
      }
    },
    data: {
      upload_preset: 'dant_phat',
      folder: 'datn',
    },
  }
  return (
    <div className="container mx-auto flex flex-col space-y-10 rounded-lg bg-white p-5 shadow-lg">
      <h2 className="my-10 text-2xl font-semibold text-gray-700">
        Thêm sản phẩm
      </h2>
      <Form
        layout="vertical"
        className="space-y-4"
        form={form}
        onFinish={handleSubmit(onSubmit)}
      >
        {/* Form items for product information */}
        <div className="mb-5 flex space-x-4">
          <div className="w-[1000px]">
            <Form.Item label="Tên Sản Phẩm">
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Không được để trống' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      size="large"
                      style={{ height: 50 }}
                      {...field}
                      placeholder="Tên sản phẩm..."
                    />
                    {error && (
                      <span style={{ color: 'red' }}>{error.message}</span>
                    )}
                  </>
                )}
              />
            </Form.Item>
          </div>
          <div className="flex-grow">
            <Form.Item label="Danh mục sản phẩm">
              <Controller
                name="category_id"
                control={control}
                defaultValue=""
                rules={{ required: 'Không được để trống' }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select
                      {...field}
                      size="large"
                      style={{ height: 50 }}
                      onChange={(value) => field.onChange(value)}
                    >
                      <Option value="">Chọn</Option>
                      {categories.map((cat) => (
                        <Option key={cat.id} value={cat.id}>
                          {cat.name}
                        </Option>
                      ))}
                    </Select>
                    {error && (
                      <span style={{ color: 'red' }}>{error.message}</span>
                    )}
                  </>
                )}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex space-x-8">
          <div className="w-[1000px]">
            <Form.Item label="Thương hiệu">
              <Controller
                name="brand"
                control={control}
                rules={{ required: 'Không được để trống' }}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      {...field}
                      size="large"
                      className="w-full"
                      style={{ height: 50 }}
                      placeholder="Thương hiệu"
                    />
                    {error && (
                      <span style={{ color: 'red' }}>{error.message}</span>
                    )}
                  </>
                )}
              />
            </Form.Item>
            <Form.Item label="Mô Tả">
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Không được để trống' }}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input.TextArea
                      {...field}
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      placeholder="Mô tả"
                    />
                    {error && (
                      <span style={{ color: 'red' }}>{error.message}</span>
                    )}
                  </>
                )}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="image"
            className="col-md-10"
            rules={[{ required: true, message: 'Không được để trống' }]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Upload.Dragger {...props} multiple accept=".jpg,.png">
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload.Dragger>
          </Form.Item>
        </div>
        <h3 className="mt-4 text-lg font-semibold">Sản phẩm biến thể</h3>
        {/* Form items for variants */}
        {variants.map((variant: any, index: any) => (
          <div key={index} className="flex flex-wrap space-x-4">
            <Form.Item label="Giá gốc">
              <Input
                size="large"
                type="number"
                value={variant.price}
                onChange={(e) => {
                  const newVariants = [...variants]
                  newVariants[index].price = parseFloat(e.target.value)
                  setVariants(newVariants)
                }}
              />
            </Form.Item>

            <Form.Item label="Số lượng">
              <Input
                size="large"
                type="number"
                value={variant.quantity}
                onChange={(e) => {
                  const newVariants = [...variants]
                  newVariants[index].quantity = parseFloat(e.target.value)
                  setVariants(newVariants)
                }}
              />
            </Form.Item>
            {/* Select dropdowns for attributes */}
            {attributes.map((attribute: any) => (
              <Form.Item key={attribute.id} label={attribute.name}>
                <Select
                  size="large"
                  style={{ width: 240 }}
                  placeholder={attribute.name}
                  value={variant.attributes[attribute.name] || ''}
                  onChange={
                    (value) =>
                      handleAttributeChange(attribute.name, value, index) // Pass index here
                  }
                >
                  <Option value="">Chọn</Option>
                  {attributeValues[attribute.id]?.map((value: any) => {
                    const isColorSelected = variants.some(
                      (variant: any) =>
                        variant.attributes.color === value.value,
                    )
                    console.log(isColorSelected)

                    return (
                      <Option
                        key={value.id}
                        value={value.value}
                        // disabled={
                        //     isColorSelected
                        //         ? true
                        //         : false
                        // }
                      >
                        {value.value}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
            ))}
            <Form.Item className="flex items-end">
              <Button
                size="large"
                type="dashed"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveVariant(index)}
              />
            </Form.Item>
          </div>
        ))}
        {/* Button to add new variant */}
        <Form.Item style={{ marginBottom: 20 }}>
          <Button
            size="large"
            type="dashed"
            onClick={handleAddVariant}
            icon={<PlusOutlined />}
          >
            Thêm
          </Button>
        </Form.Item>
        {/* Submit and go back buttons */}
        <Form.Item>
          <Space size="large">
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              icon={<PlusCircleOutlined />}
            >
              Thêm Sản Phẩm
            </Button>
            <Button
              size="large"
              type="primary"
              className="bg-red-500"
              htmlType="submit"
              icon={<ArrowLeftOutlined />}
              onClick={handleGoBack}
            >
              Quay Lại
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddProductPage
