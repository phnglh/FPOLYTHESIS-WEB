import { useState, useEffect } from 'react'
import { Image, Select, Button, InputNumber } from 'antd'
import { useParams } from 'react-router'
import { useGetProductQuery } from '@store/api/productApi'
import { Sku } from '#types/products'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@store/store'
import { addToCart, fetchCart } from '@store/slices/cartSlice'

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { data: product, isLoading } = useGetProductQuery(Number(id))

  const [selectedSku, setSelectedSku] = useState<Sku | null>(null)
  const [quantity, setQuantity] = useState<number>(1)

  useEffect(() => {
    if (product && product.skus.length > 0) {
      setSelectedSku(product.skus[0])
    }
  }, [product])

  if (isLoading || !product) return <p>Đang tải sản phẩm...</p>

  const getImages = (sku: Sku): string[] => {
    if (Array.isArray(sku.image_url)) {
      return sku.image_url
    }
    try {
      const images = JSON.parse(sku.image_url)
      return Array.isArray(images) &&
        images.every((img) => typeof img === 'string')
        ? images
        : []
    } catch (error) {
      console.error('Invalid image_url format:', error)
      return []
    }
  }

  // Handle SKU selection
  const handleAttributeChange = (attrName: string, value: string) => {
    const matchedSku = product.skus.find((sku: Sku) =>
      sku.attributes.some(
        (attr) => attr.name === attrName && attr.value === value,
      ),
    )
    if (matchedSku) setSelectedSku(matchedSku)
  }

  const handleAddToCart = (selectedSku: Sku) => {
    if (!selectedSku) {
      alert('Vui lòng chọn phiên bản trước khi thêm vào giỏ hàng')
      return
    }

    dispatch(addToCart({ sku_id: selectedSku.id, quantity: 1 }))
      .unwrap()
      .then(() => {
        dispatch(fetchCart())
      })
      .catch((error) => {
        console.error('Lỗi khi thêm vào giỏ hàng:', error)
      })
  }

  return (
    <div className="container mx-auto justify-center p-8 flex gap-20">
      <div className="flex gap-6">
        {/* Ảnh nhỏ */}
        <div className="flex flex-col gap-1 mt-3">
          {selectedSku &&
            getImages(selectedSku).map((img, index) => (
              <Image
                style={{
                  objectFit: 'fill',
                }}
                key={index}
                width={150}
                height={190}
                src={img}
                className="cursor-pointer"
              />
            ))}
        </div>
        <div>
          {selectedSku && (
            <Image width={400} height={600} src={getImages(selectedSku)[0]} />
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

        {product.options.map((option) => (
          <div key={option.attribute_id} className="mt-4">
            <p className="font-semibold">{option.attribute_name}:</p>
            <Select
              defaultValue={option.values[0].value}
              onChange={(value) =>
                handleAttributeChange(option.attribute_name, value)
              }
              style={{ width: 200 }}
            >
              {option.values.map((v: { value: string }) => (
                <Select.Option key={v.value} value={v.value}>
                  {v.value}
                </Select.Option>
              ))}
            </Select>
          </div>
        ))}

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
              <Button
                type="primary"
                size="large"
                onClick={() => handleAddToCart(selectedSku)}
              >
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
