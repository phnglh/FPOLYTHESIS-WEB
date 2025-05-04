import { useState, useEffect } from 'react'
import { useProductList } from '@hooks/useProductQuery'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { addToCart, fetchCart } from '@store/slices/cartSlice'
import ProductCard from '@layout/components/common/ProductCard'
import { Sku } from '#types/products'
import { fetchCategories } from '@store/slices/categorySlice'
import { fetchBrands } from '@store/slices/brandSlice'
import { FilterOutlined } from '@ant-design/icons'
import { Col, Pagination, Row } from 'antd'

const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>()

  const [category, setCategory] = useState<number | undefined>()
  const [brand, setBrand] = useState<number | undefined>()
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [sort, setSort] = useState<'newest' | undefined>('newest')

  const categories = useSelector((state: RootState) => state.categories.data)
  const brands = useSelector((state: RootState) => state.brands.data)

  const { data, pagination, isLoading, errorMessage, handleTableChange } =
    useProductList({
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
    })

  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories())
    if (!brands.length) dispatch(fetchBrands())
  }, [dispatch, categories.length, brands.length])

  const handleAddToCart = (selectedSku: Sku) => {
    if (!selectedSku) {
      alert('Vui lòng chọn phiên bản trước khi thêm vào giỏ hàng')
      return
    }
    dispatch(addToCart({ sku_id: selectedSku.id, quantity: 1 }))
      .unwrap()
      .then(() => dispatch(fetchCart()))
      .catch((error) => console.error('Lỗi khi thêm vào giỏ hàng:', error))
  }

  const handlePageChange = (page: number) => {
    handleTableChange({ current: page, pageSize: pagination.pageSize })
  }

  return (
    <div className="px-8 py-6 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <aside className="w-full md:w-1/4 bg-gray-100 p-5 rounded-lg shadow">
          <h3 className="font-bold text-lg flex items-center mb-6">
            <FilterOutlined className="mr-2 text-xl" />
            Bộ lọc
          </h3>

          {/* Category Filter */}
          <div className="mb-5">
            <label className="block mb-2 font-medium">Danh mục</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={category ?? ''}
              onChange={(e) =>
                setCategory(e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value="">Chọn danh mục</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="mb-5">
            <label className="block mb-2 font-medium">Thương hiệu</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={brand ?? ''}
              onChange={(e) =>
                setBrand(e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value="">Chọn thương hiệu</option>
              {brands?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <hr className="my-5" />
          <div className="text-right">
            <button
              onClick={() => {
                setCategory(undefined)
                setBrand(undefined)
                setMinPrice(undefined)
                setMaxPrice(undefined)
                setSort('newest')
              }}
              className="text-blue-500 hover:underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        </aside>

        {/* Product List */}
        <main className="w-full md:w-3/4">
          {isLoading ? (
            <div>Đang tải...</div>
          ) : errorMessage ? (
            <div>{errorMessage}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data
                ?.filter((product) => product.is_published)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
            </div>
          )}

          {pagination && (
            <Row justify="end" style={{ marginTop: '20px' }}>
              <Col>
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePageChange}
                  onShowSizeChange={(current, size) => {
                    handleTableChange({ current, pageSize: size })
                  }}
                />
              </Col>
            </Row>
          )}
        </main>
      </div>
    </div>
  )
}

export default ProductPage
