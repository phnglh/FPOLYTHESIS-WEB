import { useState, useEffect } from 'react'
import {
  Col,
  Layout,
  Row,
  Select,
  InputNumber,
  Radio,
  Space,
  Pagination,
} from 'antd'
import { useProductList } from '@hooks/useProductQuery'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { addToCart, fetchCart } from '@store/slices/cartSlice'
import ProductCard from '@layout/components/common/ProductCard'
import { Sku } from '#types/products'
import { fetchCategories } from '@store/slices/categorySlice'
import { fetchBrands } from '@store/slices/brandSlice'

const { Option } = Select

const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>()

  // Filter states
  const [category, setCategory] = useState<number | undefined>()
  const [brand, setBrand] = useState<number | undefined>()
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [sort, setSort] = useState<'newest' | undefined>('newest')

  // Fetch categories and brands from API
  const categories = useSelector((state: RootState) => state.categories.data)
  const brands = useSelector((state: RootState) => state.brands.data)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12) // Set default pageSize to 12

  const { data, pagination, isLoading, errorMessage } = useProductList({
    category,
    brand,
    minPrice,
    maxPrice,
    sort,
    page: currentPage,
    per_page: pageSize,
  })

  useEffect(() => {
    // Fetch categories and brands if not already loaded
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

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setPageSize(pageSize)
  }

  return (
    <Layout style={{ margin: '0 100px', padding: '10px' }}>
      {/* Filter section */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Select
            allowClear
            style={{ width: '100%' }}
            placeholder="Chọn danh mục"
            onChange={(value) => setCategory(value)}
          >
            {categories?.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={6}>
          <Select
            allowClear
            style={{ width: '100%' }}
            placeholder="Chọn thương hiệu"
            onChange={(value) => setBrand(value)}
          >
            {brands?.map((brand) => (
              <Option key={brand.id} value={brand.id}>
                {brand.name}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={6}>
          <Space>
            <InputNumber
              style={{ width: 100 }}
              placeholder="Giá từ"
              min={0}
              onChange={(value) => setMinPrice(value)}
            />
            <InputNumber
              style={{ width: 100 }}
              placeholder="Đến"
              min={0}
              onChange={(value) => setMaxPrice(value)}
            />
          </Space>
        </Col>

        <Col span={6}>
          <Radio.Group
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="newest">Mới nhất</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>

      {/* Product list */}
      <Layout style={{ padding: '10px' }}>
        <Row gutter={[30, 30]} justify="center">
          {data?.map((product) => (
            <Col xs={20} sm={12} md={8} lg={5} key={product.id}>
              <ProductCard
                product={product}
                onAddToCart={(selectedSku) => handleAddToCart(selectedSku)}
              />
            </Col>
          ))}
        </Row>
      </Layout>

      {/* Pagination */}
      <Row justify="end">
        <Col>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger
            onShowSizeChange={(current, size) => setPageSize(size)}
          />
        </Col>
      </Row>
    </Layout>
  )
}

export default ProductPage
