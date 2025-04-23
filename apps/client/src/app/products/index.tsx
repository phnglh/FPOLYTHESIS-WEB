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
  Divider,
} from 'antd'
import { FilterOutlined } from '@ant-design/icons' // Import the FilterOutlined icon
import { useProductList } from '@hooks/useProductQuery'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store'
import { addToCart, fetchCart } from '@store/slices/cartSlice'
import ProductCard from '@layout/components/common/ProductCard'
import { Sku } from '#types/products'
import { fetchCategories } from '@store/slices/categorySlice'
import { fetchBrands } from '@store/slices/brandSlice'

const { Sider, Content } = Layout
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
  const [pageSize, setPageSize] = useState(12)

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
    <Layout style={{ padding: '20px 50px', background: '#fff' }}>
      <Row gutter={24}>
        {/* Filter Sidebar */}
        <Col xs={24} md={6}>
          <Sider
            width="100%"
            style={{
              background: '#f5f5f5',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                marginBottom: '20px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FilterOutlined
                style={{ marginRight: '8px', fontSize: '20px' }}
              />
              Bộ lọc
            </h3>

            {/* Category Filter */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                }}
              >
                Danh mục
              </label>
              <Select
                allowClear
                style={{ width: '100%' }}
                placeholder="Chọn danh mục"
                onChange={(value) => setCategory(value)}
                value={category}
              >
                {categories?.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Brand Filter */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                }}
              >
                Thương hiệu
              </label>
              <Select
                allowClear
                style={{ width: '100%' }}
                placeholder="Chọn thương hiệu"
                onChange={(value) => setBrand(value)}
                value={brand}
              >
                {brands?.map((brand) => (
                  <Option key={brand.id} value={brand.id}>
                    {brand.name}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Price Range Filter */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                }}
              >
                Khoảng giá
              </label>
              <Space>
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Giá từ"
                  min={0}
                  value={minPrice}
                  onChange={(value) => setMinPrice(value)}
                />
                <span>-</span>
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Đến"
                  min={0}
                  value={maxPrice}
                  onChange={(value) => setMaxPrice(value)}
                />
              </Space>
            </div>

            {/* Sort Filter */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                }}
              >
                Sắp xếp
              </label>
              <Radio.Group
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value="newest">Mới nhất</Radio.Button>
              </Radio.Group>
            </div>

            <Divider />
            <div style={{ textAlign: 'right' }}>
              <a
                onClick={() => {
                  setCategory(undefined)
                  setBrand(undefined)
                  setMinPrice(undefined)
                  setMaxPrice(undefined)
                  setSort('newest')
                }}
                style={{ color: '#1890ff' }}
              >
                Xóa bộ lọc
              </a>
            </div>
          </Sider>
        </Col>

        {/* Product List */}
        <Col xs={24} md={18}>
          <Content style={{ padding: '0 20px' }}>
            <Row gutter={[30, 30]} justify="start">
              {isLoading ? (
                <Col span={24}>Đang tải...</Col>
              ) : errorMessage ? (
                <Col span={24}>{errorMessage}</Col>
              ) : (
                data
                  ?.filter((product) => product.is_published)
                  .map((product) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                      <ProductCard
                        product={product}
                        onAddToCart={(selectedSku) =>
                          handleAddToCart(selectedSku)
                        }
                      />
                    </Col>
                  ))
              )}
            </Row>

            {/* Pagination */}
            {pagination && (
              <Row justify="end" style={{ marginTop: '20px' }}>
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
            )}
          </Content>
        </Col>
      </Row>
    </Layout>
  )
}

export default ProductPage
