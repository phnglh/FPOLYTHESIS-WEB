import React, { useState } from 'react'
import { Layout, Menu, Select, Card, Row, Col, Badge, Checkbox } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'

const { Sider, Content } = Layout
const { Option } = Select

const products = [
  {
    id: 1,
    name: 'Áo lót giữ nhiệt',
    brand: 'Kipsta',
    price: 395000,
    image: 'url1',
    discount: 0,
  },
  {
    id: 2,
    name: 'Áo giữ nhiệt nam',
    brand: 'Underwear',
    price: 200000,
    image: 'url2',
    discount: 0,
  },
  {
    id: 3,
    name: 'Áo dài tay nam',
    brand: 'Armour',
    price: 800000,
    image: 'url3',
    discount: 0,
  },
  {
    id: 4,
    name: 'Áo ba lỗ thể thao',
    brand: 'Sketchers',
    price: 690000,
    image: 'url4',
    discount: 0,
  },
  {
    id: 5,
    name: 'Quần tập luyện nam',
    brand: 'Nike',
    price: 3500000,
    image: 'url5',
    discount: 10,
  },
]

const ProductPage = () => {
  const [likedProducts, setLikedProducts] = useState<number[]>([])
  const toggleLike = (id: number) => {
    setLikedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    )
  }

  return (
    <Layout style={{ padding: '20px' }}>
      <Sider width={250} style={{ background: '#f5f5f5', padding: '10px' }}>
        <h3>Bộ lọc sản phẩm</h3>
        <div>
          <h4>Chọn khoảng giá</h4>
          <Checkbox.Group
            options={['Dưới 1 triệu', '1-2 triệu', '2-3 triệu']}
          />
        </div>
        <div>
          <h4>Thương hiệu</h4>
          <Checkbox.Group options={['Adidas', 'Nike', 'Puma']} />
        </div>
        <div>
          <h4>Loại sản phẩm</h4>
          <Checkbox.Group options={['Áo', 'Quần', 'Giày', 'Túi']} />
        </div>
        <div>
          <h4>Màu sắc</h4>
          <Checkbox.Group options={['Đen', 'Trắng', 'Xanh']} />
        </div>
        <div>
          <h4>Giới tính</h4>
          <Checkbox.Group options={['Nam', 'Nữ']} />
        </div>
      </Sider>
      <Layout style={{ paddingLeft: '20px' }}>
        <Row justify="space-between">
          <h2>Tất cả sản phẩm</h2>
          <Select defaultValue="Sắp xếp theo" style={{ width: 150 }}>
            <Option value="priceAsc">Giá thấp đến cao</Option>
            <Option value="priceDesc">Giá cao đến thấp</Option>
          </Select>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          {products.map((product) => (
            <Col span={6} key={product.id}>
              <Card
                cover={
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                }
                actions={[
                  likedProducts.includes(product.id) ? (
                    <HeartFilled
                      style={{ color: 'red' }}
                      onClick={() => toggleLike(product.id)}
                    />
                  ) : (
                    <HeartOutlined onClick={() => toggleLike(product.id)} />
                  ),
                ]}
              >
                <h4>{product.brand}</h4>
                <p>{product.name}</p>
                {product.discount > 0 ? (
                  <Badge
                    count={`-${product.discount}%`}
                    style={{ backgroundColor: '#52c41a' }}
                  />
                ) : null}
                <p style={{ color: 'red', fontWeight: 'bold' }}>
                  {product.price.toLocaleString()}đ
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </Layout>
    </Layout>
  )
}

export default ProductPage
