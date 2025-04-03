import { useEffect, useState } from 'react'
import { Button, Image, InputNumber, message, Radio } from 'antd'
import { useParams } from 'react-router'
import { useGetProductQuery } from '@store/api/productApi'
import { Sku } from '#types/products'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { addToCart, fetchCart } from '@store/slices/cartSlice'
import { fetchAttributes } from '@store/slices/attributeSlice'
import { toast } from 'react-toastify'

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { data: product, isLoading } = useGetProductQuery(Number(id))
  const attributes = useSelector((state: RootState) => state.attributes.data)
  const [selectedSku, setSelectedSku] = useState<Sku | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({})

  useEffect(() => {
    dispatch(fetchAttributes())
    if (product && product.skus.length > 0) {
      setSelectedSku(product.skus[0])
      // Set giá trị mặc định cho thuộc tính
      const defaultAttrs: Record<string, string> = {}
      product.options.forEach((opt) => {
        defaultAttrs[opt.attribute_name] = opt.values[0].value
      })
      setSelectedAttributes(defaultAttrs)
    }
  }, [product, dispatch])

  if (isLoading || !product) return <p>Đang tải sản phẩm...</p>

  // Tìm SKU phù hợp với các thuộc tính đã chọn
  const findMatchingSku = (attrs: Record<string, string>): Sku | null => {
    return (
      product.skus.find((sku: Sku) =>
        Object.entries(attrs).every(([key, value]) =>
          sku.attributes.some(
            (attr) => attr.name === key && attr.value === value,
          ),
        ),
      ) || null
    )
  }

  // Hàm lọc các giá trị thuộc tính có sẵn cho các thuộc tính hiện tại
  const getFilteredValues = (attributeName: string): any[] => {
    const availableValues: string[] = []

    // Duyệt qua các SKUs để lấy ra các giá trị có sẵn cho thuộc tính
    product.skus.forEach((sku) => {
      const matchedAttribute = sku.attributes.find(
        (attr) => attr.name === attributeName,
      )
      if (matchedAttribute) {
        // Nếu thuộc tính đã có trong sku, thêm giá trị vào mảng availableValues
        if (!availableValues.includes(matchedAttribute.value)) {
          availableValues.push(matchedAttribute.value)
        }
      }
    })

    // Trả về giá trị hợp lệ cho thuộc tính đó (giá trị có trong SKU)
    return (
      product.options
        .find((option) => option.attribute_name === attributeName)
        ?.values.filter((value) => availableValues.includes(value.value)) || []
    )
  }

  // Xử lý khi thay đổi thuộc tính
  const handleAttributeChange = (attrName: string, value: string) => {
    const updatedAttrs = { ...selectedAttributes, [attrName]: value }
    setSelectedAttributes(updatedAttrs)

    const matchedSku = findMatchingSku(updatedAttrs)
    if (matchedSku) setSelectedSku(matchedSku)
  }

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedSku) {
      message.warning('Vui lòng chọn phiên bản trước khi thêm vào giỏ hàng')
      return
    }

    if (quantity < 1 || quantity > selectedSku.stock) {
      message.error('Số lượng không hợp lệ!')
      return
    }

    dispatch(addToCart({ sku_id: selectedSku.id, quantity }))
      .unwrap()
      .then(() => {
        toast.success('Thêm vào giỏ hàng thành công!')
        dispatch(fetchCart())
      })
      .catch((error) => {
        console.error('Lỗi khi thêm vào giỏ hàng:', error)
        toast.error('Không thể thêm vào giỏ hàng!')
      })
  }

  return (
    <div className="container mx-auto justify-center p-8 flex gap-20">
      <div className="flex gap-6">
        {/* Ảnh nhỏ */}
        <div className="flex flex-col gap-1 mt-3">
          {selectedSku && selectedSku.image_url && (
            <Image
              key={selectedSku.image_url}
              width={150}
              height={190}
              src={selectedSku.image_url}
              className="cursor-pointer"
            />
          )}
        </div>
        <div>
          {selectedSku && selectedSku.image_url && (
            <Image width={400} height={600} src={selectedSku.image_url} />
          )}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500 text-lg">{product.description}</p>
        <p className="mt-2 text-lg">
          <b>Thương hiệu:</b> {product.brand_name}
        </p>
        <p className="text-lg">
          <b>Danh mục:</b> {product.category_name}
        </p>
        <div>
          {attributes.map((attribute) => {
            // Lấy option của sản phẩm hiện tại nếu có
            const productOption = product.options.find(
              (opt) => opt.attribute_id === attribute.id,
            )

            return (
              <div key={attribute.id} className="mt-4">
                <p className="font-semibold">{attribute.name}:</p>
                <Radio.Group
                  value={selectedAttributes[attribute.name]}
                  onChange={(e) =>
                    handleAttributeChange(attribute.name, e.target.value)
                  }
                >
                  {Array.isArray(attribute.values) &&
                    getFilteredValues(attribute.name).map((v) => {
                      const isDisabled =
                        !productOption ||
                        !productOption.values.some((pv) => pv.value === v.value)

                      return (
                        <Radio
                          key={v.value}
                          value={v.value}
                          disabled={isDisabled} // Disable các tùy chọn không hợp lệ
                        >
                          {v.value}
                        </Radio>
                      )
                    })}
                </Radio.Group>
              </div>
            )
          })}
        </div>

        {selectedSku && (
          <>
            <p className="mt-4 text-2xl font-bold text-red-500">
              ${selectedSku.price}
            </p>
            <p className="text-green-600">Còn {selectedSku.stock} sản phẩm</p>

            <div className="flex items-center gap-4 mt-4">
              <InputNumber
                min={1}
                max={selectedSku.stock}
                value={quantity}
                onChange={(value) => setQuantity(value ?? 1)}
              />
              <Button type="primary" size="large" onClick={handleAddToCart}>
                Thêm vào giỏ
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProductDetailPage
