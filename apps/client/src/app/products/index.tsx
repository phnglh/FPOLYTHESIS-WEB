import { useEffect, useState } from 'react'
import { Layout, Row, Col } from 'antd'

import { useProductList } from '@hooks/useProductQuery'
import { addToCart, fetchCart } from '@store/slices/cartSlice'
import { AppDispatch } from '@store/store'
import { useDispatch } from 'react-redux'
import ProductCard from '@layout/components/common/ProductCard'
import { Product, Sku } from '#types/products'
import FilterComponent from '@layout/components/products/FilterComponent'

const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data } = useProductList()
  const [selectedFilters, setSelectedFilters] = useState<{
    category: number[]
    brand: number[]
    attributes: { [key: string]: string[] }
  }>({
    category: [],
    brand: [],
    attributes: {},
  })

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

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
  useEffect(() => {
    if (!data) return

    const result = data.filter((product) => {
      if (!product.is_published) {
        return false
      }

      if (
        selectedFilters.category.length > 0 &&
        !selectedFilters.category.includes(Number(product.category_id))
      ) {
        return false
      }

      if (
        selectedFilters.brand.length > 0 &&
        !selectedFilters.brand.includes(Number(product.brand_id))
      ) {
        return false
      }

      if (Object.keys(selectedFilters.attributes).length > 0) {
        const matchesAllAttributes = Object.keys(
          selectedFilters.attributes,
        ).every((attrName) =>
          selectedFilters.attributes[attrName].some((selectedValue) =>
            product.skus.some((sku) =>
              sku.attributes.some(
                (attr) =>
                  attr.name === attrName && `${attr.value}` === selectedValue,
              ),
            ),
          ),
        )

        if (!matchesAllAttributes) {
          return false
        }
      }

      return true
    })

    setFilteredProducts(result)
  }, [data, selectedFilters])

  return (
    <Layout style={{ margin: '0 100px', padding: '10px' }}>
      <FilterComponent
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />

      <Layout style={{ padding: '10px' }}>
        <Row gutter={[30, 30]} justify="center">
          {/* {data?.map((product) => ( */}
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Col xs={20} sm={12} md={8} lg={8} key={product.id}>
                <ProductCard
                  product={product}
                  onAddToCart={(selectedSku) => handleAddToCart(selectedSku)}
                />
              </Col>
            ))
          ) : (
            <p>Không tìm thấy sản phẩm phù hợp.</p>
          )}
        </Row>
      </Layout>
    </Layout>
  )
}

export default ProductPage
