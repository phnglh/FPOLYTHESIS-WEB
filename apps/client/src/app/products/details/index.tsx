import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Radio,
  Rate,
  Tabs,
} from 'antd'
import { useNavigate, useParams } from 'react-router'
import { useGetProductQuery } from '@store/api/productApi'
import { Sku } from '#types/products'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { addToCart, fetchCart } from '@store/slices/cartSlice'
import { fetchAttributes } from '@store/slices/attributeSlice'
import { toast } from 'react-toastify'
import apiClient from '@store/services/apiClient'

const { TabPane } = Tabs

export interface Review {
  user_id: number
  user_name: string
  rating: number
  review: string
}
const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { data: product, isLoading } = useGetProductQuery(Number(id))
  const attributes = useSelector((state: RootState) => state.attributes.data)
  const [selectedSku, setSelectedSku] = useState<Sku | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({})
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id)

  const token = localStorage.getItem('access_token')

  const fetchReviews = async (id: number) => {
    try {
      const response = await apiClient.get(`/products/${id}/reviews`)
      const data = await response.data.data
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      return []
    }
  }

  useEffect(() => {
    dispatch(fetchAttributes())
    if (product && product.skus.length > 0) {
      setSelectedSku(product.skus[0])
      const defaultAttrs: Record<string, string> = {}
      product.options.forEach((opt) => {
        defaultAttrs[opt.attribute_name] = opt.values[0].value
      })
      setSelectedAttributes(defaultAttrs)
    }
  }, [product, dispatch, id])

  useEffect(() => {
    fetchReviews(Number(id))
  }, [])

  if (isLoading || !product) return <p>Đang tải sản phẩm...</p>

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

  const getFilteredValues = (attributeName: string): any[] => {
    const availableValues: string[] = []

    product.skus.forEach((sku) => {
      const matchedAttribute = sku.attributes.find(
        (attr) => attr.name === attributeName,
      )
      if (matchedAttribute) {
        if (!availableValues.includes(matchedAttribute.value)) {
          availableValues.push(matchedAttribute.value)
        }
      }
    })

    return (
      product.options
        .find((option) => option.attribute_name === attributeName)
        ?.values.filter((value) => availableValues.includes(value.value)) || []
    )
  }

  const handleAttributeChange = (attrName: string, value: string) => {
    const updatedAttrs = { ...selectedAttributes, [attrName]: value }
    setSelectedAttributes(updatedAttrs)

    const matchedSku = findMatchingSku(updatedAttrs)
    if (matchedSku) setSelectedSku(matchedSku)
  }

  const handleAddToCart = () => {
    if (!token) {
      toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!')
      navigate('/login')
      return
    }
    if (!selectedSku) {
      toast.warning('Vui lòng chọn phiên bản trước khi thêm vào giỏ hàng')
      return
    }

    if (quantity < 1 || quantity > selectedSku.stock) {
      toast.error('Số lượng không hợp lệ!')
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
  const MAX_QUANTITY = 50 // Giới hạn số lượng tối đa

  const handleQuantityChange = (value: number | null) => {
    if (value === null) {
      setQuantity(1)
      return
    }

    if (value > MAX_QUANTITY) {
      toast.warning(`Vui lòng nhập số lượng nhỏ hơn hoặc bằng ${MAX_QUANTITY}.`)
      return
    }
    setQuantity(value)
  }

  const handleReviewSubmit = async (values: any) => {
    try {
      const response = await apiClient.post(`/reviews`, {
        product_id: Number(id),
        rating: values.rating,
        review: values.review,
      })
      fetchReviews(Number(id))
      toast.success('Đánh giá của bạn đã được gửi thành công!')
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Đã xảy ra lỗi khi gửi đánh giá.')
    }
  }

  return (
    <div className="container mx-auto justify-center items-center p-8 flex flex-col gap-12">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Hình ảnh sản phẩm */}
        <div className="flex gap-6">
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

        {/* Thông tin và tương tác */}
        <div className="w-full max-w-xl">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-lg">
            <b>Thương hiệu:</b> {product.brand_name}
          </p>
          <p className="text-lg">
            <b>Danh mục:</b> {product.category_name}
          </p>

          {selectedSku && (
            <div className="mt-4">
              <p className="text-2xl font-bold text-red-500">
                {selectedSku.price.toLocaleString()}₫
              </p>
              <p className="text-green-600">Còn {selectedSku.stock} sản phẩm</p>
            </div>
          )}

          {/* Khuyến mãi */}
          <div className="border border-dashed border-red-500 p-4 rounded mt-4">
            <p className="text-red-600 font-semibold mb-2">
              🎁 KHUYẾN MÃI - ƯU ĐÃI
            </p>
            <ul className="text-sm list-disc ml-5 space-y-1">
              <li>MUA 2 sản phẩm GIẢM 10%</li>
              <li>
                Nhập mã <strong>APR10</strong> GIẢM 10% tối đa 10K
              </li>
              <li>
                Nhập mã <strong>APR30</strong> GIẢM 30K đơn từ 599K
              </li>
              <li>
                Nhập mã <strong>APR70</strong> GIẢM 70K đơn từ 899K
              </li>
              <li>
                Nhập mã <strong>APR100</strong> GIẢM 100K đơn từ 1199K
              </li>
              <li>🚚 Miễn phí vận chuyển cho đơn từ 250K</li>
            </ul>
          </div>

          {/* Thuộc tính */}
          {attributes.map((attribute) => {
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
                          disabled={isDisabled}
                        >
                          {v.value}
                        </Radio>
                      )
                    })}
                </Radio.Group>
              </div>
            )
          })}

          {/* Số lượng + Thêm vào giỏ */}
          {selectedSku && (
            <div className="mt-6">
              <div className="flex items-center gap-4">
                <InputNumber
                  min={1}
                  max={selectedSku.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <Button type="primary" size="large" onClick={handleAddToCart}>
                  Thêm vào giỏ
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs mô tả, đánh giá, chính sách */}
      <div className="mt-12 w-full max-w-4xl">
        <Tabs defaultActiveKey="1" type="line" tabBarGutter={32}>
          <TabPane tab="Mô tả sản phẩm" key="1">
            <p className="text-gray-700 leading-relaxed">
              {product.description ||
                'Hiện tại chưa có mô tả chi tiết cho sản phẩm này.'}
            </p>
          </TabPane>

          <TabPane tab="Đánh giá" key="2">
            <div className="space-y-6">
              {/* Danh sách đánh giá */}
              {reviews?.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{review.user.name}</p>
                      <Rate
                        disabled
                        defaultValue={review.rating}
                        className="text-base"
                      />
                    </div>
                    <p className="text-gray-700 mt-1">{review.review}</p>
                  </div>
                ))
              ) : (
                <p>Hiện chưa có đánh giá nào cho sản phẩm này.</p>
              )}

              {/* Nếu user chưa đánh giá */}
              {!reviews?.find((r) => r.user_id === currentUserId) && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Đánh giá sản phẩm
                  </h3>
                  <Form
                    layout="vertical"
                    onFinish={(values) => {
                      handleReviewSubmit(values)
                    }}
                  >
                    <Form.Item
                      name="rating"
                      label="Chọn số sao"
                      rules={[
                        { required: true, message: 'Vui lòng chọn số sao!' },
                      ]}
                    >
                      <Rate />
                    </Form.Item>

                    <Form.Item
                      name="review"
                      label="Nhận xét"
                      rules={[
                        { required: true, message: 'Vui lòng nhập nhận xét!' },
                      ]}
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Nhập đánh giá của bạn..."
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Gửi đánh giá
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              )}

              {/* Nếu user đã đánh giá */}
              {reviews?.find((r) => r.user_id === currentUserId) && (
                <p className="text-green-600 italic">
                  Bạn đã đánh giá sản phẩm này. Cảm ơn bạn!
                </p>
              )}
            </div>
          </TabPane>

          <TabPane tab="Chính sách giao hàng" key="3">
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Giao hàng tiêu chuẩn: 2-5 ngày làm việc.</li>
              <li>Giao hàng nhanh (Nội thành): 1-2 ngày.</li>
              <li>Miễn phí vận chuyển với đơn hàng từ 250,000₫ trở lên.</li>
              <li>Giao hàng toàn quốc.</li>
            </ul>
          </TabPane>

          <TabPane tab="Chính sách đổi trả" key="4">
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>
                Thời gian đổi hàng trong vòng 15 ngày kể từ khi nhận hàng.
              </li>
              <li>Sản phẩm còn nguyên tem mác, chưa qua sử dụng.</li>
              <li>Đổi hàng do lỗi nhà sản xuất hoặc không đúng mô tả.</li>
              <li>Không áp dụng đổi trả với sản phẩm khuyến mãi trên 50%.</li>
            </ul>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default ProductDetailPage
