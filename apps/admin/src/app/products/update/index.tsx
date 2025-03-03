import { Category } from '@/@types/category'
import { Attribute, Variant } from '@/@types/product'
import {
  getAllAttribute,
  getAllAttributeValue,
} from '@/api/services/AttributeService'
import { getAllCategory } from '@/api/services/CategoryService'
import { getProductById, updateProduct } from '@/api/services/ProductService'
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Button, Form, Image, Input, Select, Space, Upload } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
const { Option } = Select

const UpdateProduct = () => {
  const [form] = Form.useForm()
  const [categories, setCategories] = useState<Category[]>([])
  const [variants, setVariants] = useState<Variant[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [attributeValues, setAttributeValues] = useState<any>({})
  const navigate = useNavigate()
  const { id }: any = useParams()

  const {
    control,
    handleSubmit,
    setValue,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } = useForm()
  const formatVariantAttributes = (variant: any, attributeNames: string[]) => {
    const attributes: { [key: string]: string } = {}

    variant.attribute_values.forEach((attrValue: any) => {
      const attributeName = attributeNames.find(
        (name) => name === attrValue.attribute.name.toLowerCase(),
      )
      if (attributeName) {
        attributes[attributeName] = attrValue.value
      }
    })

    return attributes
  }
  const [image, setimage] = useState<any>()

  const fetchProductDetails = useCallback(async () => {
    if (id) {
      try {
        const product: any = await getProductById(id)
        console.log(product)

        setValue('name', product?.name)
        setimage(product?.image)
        setValue('category_id', product?.category_id)
        setValue('brand', product?.brand)
        setValue('description', product?.description)

        if (product?.image) {
        }
        if (product.variants.length > 0) {
          const arr: any = []
          const attributeNames = product.variants.reduce(
            (acc: string[], variant: any) => {
              variant.attribute_values.forEach((attrValue: any) => {
                console.log(attrValue)
                arr.push(attrValue?.pivot?.attribute_value_id)
                const attributeName = attrValue.attribute.name.toLowerCase()
                if (!acc.includes(attributeName)) {
                  acc.push(attributeName)
                }
              })
              return acc
            },
            [],
          )
          console.log(arr)

          const formattedVariants = product.variants.map((variant: any) => {
            const attributes = formatVariantAttributes(variant, attributeNames)
            return {
              ...variant,
              attributes,
            }
          })

          setVariants(formattedVariants)
        } else {
          console.log('Product has no variants or variants data is missing')
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error)
      }
    }
  }, [id, setValue])

  useEffect(() => {
    fetchCategories()
    fetchProductDetails()
    fetchAttributes()
    fetchAttributeValues()
  }, [fetchProductDetails])

  const fetchCategories = async () => {
    const allCategory = await getAllCategory()
    setCategories(allCategory)
  }
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
  const [uploadedImages, setUploadedImages] = useState<any>()
  const props: any = {
    action: 'https://api.cloudinary.com/v1_1/dsul0ahfu/image/upload',
    onChange({ file }: any) {
      if (file.status !== 'uploading') {
        // Sử dụng một hàm setState để cập nhật mảng uploadedImages
        setUploadedImages(file.response.secure_url)
      }
    },
    data: {
      upload_preset: 'dant_phat',
      folder: 'datn',
    },
  }
  const onSubmit = async (data: FieldValues) => {
    const formattedData: any = {
      name: data.name,
      category_id: data.category_id,
      brand: data.brand,
      description: data.description,
      image: uploadedImages ? uploadedImages : image,
      variants: variants.map((variant: any) => {
        // Lấy các key từ variant.attributes
        const attributeKeys = Object.keys(variant.attributes)
        console.log(variant)

        return {
          variant_id: variant?.id ?? null,
          price: variant.price,
          price_promotional: variant.price_promotional,
          quantity: variant.quantity,
          attributes: attributeKeys.map((key, index) => ({
            atribute_value_id: variant?.attribute_values?.[index]?.id ?? null,
            atribute_value_id_old:
              variant?.attribute_values?.[index]?.pivot?.attribute_value_id ??
              null,
            name: key,
            value: variant?.attributes?.[key] ?? null,
          })),
        }
      }),
    }

    try {
      const jsonData: any = JSON.stringify(formattedData)
      const response = await updateProduct(id, jsonData)
      console.log('Product updated successfully:', response)
      toast.success('Product updated successfully.')
      navigate('/admin/quan-ly-san-pham')
    } catch (error) {
      console.error('Failed to updated product:', error)
      toast.error('Failed to updated product. Please try again later.')
    }
  }
  const handleGoBack = () => {
    navigate('/admin/quan-ly-san-pham')
  }

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
  const handleRemoveVariant = (index: number) => {
    const newVariants: any = variants.filter((_, i) => i !== index)
    setVariants(newVariants)
  }
  const handleAttributeChange = (
    attributeType: string,
    value: string,
    index: number,
  ) => {
    const newVariants: any = [...variants]
    newVariants[index].attributes[attributeType] = value
    setVariants(newVariants)
  }
  console.log(variants)

  const [check, setcheck] = useState<any>(false)
  const HandleExit = () => {
    setcheck(true)
  }
  return (
    <div className="container mx-auto mt-10 flex flex-col space-y-10 rounded-lg bg-white p-5 shadow-lg">
      <h2 className="my-10 text-2xl font-semibold text-gray-700">
        Cập nhật thông tin sản phẩm
      </h2>
      <Form
        layout="vertical"
        className="space-y-4"
        form={form}
        onFinish={handleSubmit(onSubmit)}
      >
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
                defaultValue=""
                rules={{ required: 'Không được để trống' }}
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
          {check ? (
            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Không được để trống' }]}
            >
              <Upload.Dragger {...props} multiple accept=".jpg,.png">
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload.Dragger>
            </Form.Item>
          ) : (
            <Form.Item label="Image" style={{ width: '10%' }}>
              <Image src={image} />
              <Button onClick={() => HandleExit()} className="mt-2">
                Bỏ ảnh
              </Button>
            </Form.Item>
          )}
        </div>
        <h3 className="mt-4 text-lg font-semibold">Sản phẩm biến thể</h3>
        {variants.map((variant: any, index: any) => (
          <div key={index} className="flex flex-wrap space-x-4">
            <Form.Item
              label="Giá gốc"
              rules={[
                {
                  required: true,
                  message: 'Không được để trống',
                },
              ]}
            >
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
            {attributes.map((attribute) => (
              <Form.Item key={attribute.id} label={attribute.name}>
                <Select
                  size="large"
                  style={{ width: 240 }}
                  placeholder={attribute.name}
                  value={variant?.attributes[attribute.name] || ''}
                  onChange={(value) =>
                    handleAttributeChange(attribute.name, value, index)
                  }
                >
                  <Option value="">Chọn</Option>
                  {attributeValues[attribute.id]?.map((value: any) => {
                    const selectedColor = variant.attributes.color
                    const selectedSize = variant.attributes.size

                    if (attribute.name.toLowerCase() === 'size') {
                      // Nếu đã chọn màu
                      if (selectedColor) {
                        // Kiểm tra các biến thể khác xem có cặp "color" và "size" nào đã được chọn chưa
                        const isSizeDisabled = variants.some(
                          (otherVariant: any, otherIndex: number) =>
                            otherIndex !== index && // Loại trừ biến thể hiện tại
                            otherVariant.attributes.color === selectedColor && // Trùng color
                            otherVariant.attributes.size === value.value, // Trùng size
                        )

                        return (
                          <Option
                            key={value.id}
                            value={value.value}
                            disabled={isSizeDisabled} // Disable nếu size đã được chọn với cùng color
                          >
                            {value.value}
                          </Option>
                        )
                      }

                      // Nếu chưa chọn màu, không disable bất kỳ kích thước nào
                      return (
                        <Option key={value.id} value={value.value}>
                          {value.value}
                        </Option>
                      )
                    }

                    if (attribute.name.toLowerCase() === 'color') {
                      // Nếu đã chọn kích thước
                      if (selectedSize) {
                        // Kiểm tra các biến thể khác xem có cặp "color" và "size" nào đã được chọn chưa
                        const isColorDisabled = variants.some(
                          (otherVariant: any, otherIndex: number) =>
                            otherIndex !== index && // Loại trừ biến thể hiện tại
                            otherVariant.attributes.size === selectedSize && // Trùng size
                            otherVariant.attributes.color === value.value, // Trùng color
                        )

                        return (
                          <Option
                            key={value.id}
                            value={value.value}
                            disabled={isColorDisabled} // Disable nếu color đã được chọn với cùng size
                          >
                            {value.value}
                          </Option>
                        )
                      }

                      // Nếu chưa chọn kích thước, không disable bất kỳ màu nào
                      return (
                        <Option key={value.id} value={value.value}>
                          {value.value}
                        </Option>
                      )
                    }

                    // Trả về các tùy chọn khác không bị ảnh hưởng bởi logic lọc
                    return (
                      <Option key={value.id} value={value.value}>
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
        <Form.Item>
          <Space size="large">
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              icon={<PlusCircleOutlined />}
            >
              Cập nhật Sản Phẩm
            </Button>
            <Button
              size="large"
              type="primary"
              className="bg-red-500"
              onClick={handleGoBack}
              icon={<ArrowLeftOutlined />}
            >
              Quay Lại
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UpdateProduct
