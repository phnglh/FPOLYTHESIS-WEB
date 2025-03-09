import { useState } from 'react'
import { Card, Typography, Row, Col, Button } from 'antd'

const { Title, Text } = Typography

const products = [
  {
    id: 1,
    name: 'ÁO LÓT GIỮ NHIỆT ĐÁ BÓNG',
    price: '395.000₫',
    image: 'URL_HINH_1',
    brand: 'Kipsta',
  },
  {
    id: 2,
    name: 'ÁO GIỮ NHIỆT NAM - ÁO THUN TẬP',
    price: '200.000₫',
    image: 'URL_HINH_2',
    brand: 'Underwear',
  },
]

const FavoriteProducts = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div>
      <Title level={3} style={{ textAlign: 'center' }}>
        Sản phẩm yêu thích
      </Title>
      <Row gutter={[16, 16]}>
        {products.map((product, index) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              cover={
                <img
                  alt={product.name}
                  src={product.image}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
              hoverable
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ position: 'relative' }}
            >
              {hoveredIndex === index && (
                <div
                  style={{
                    position: 'absolute',
                    top: 160,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    padding: '8px',
                    borderRadius: '5px',
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <Button
                    style={{
                      backgroundColor: '#3C6255',
                      color: 'white',
                      border: 'none',
                      fontSize: '14px',
                      padding: '6px 12px',
                    }}
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    style={{
                      backgroundColor: '#555',
                      color: 'white',
                      border: 'none',
                      fontSize: '14px',
                      padding: '6px 12px',
                    }}
                  >
                    Tùy chọn
                  </Button>
                </div>
              )}
              <Text
                type="secondary"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '30px',
                }}
              >
                {product.brand}
              </Text>
              <Title level={5}>{product.name}</Title>
              <Text strong style={{ color: 'green' }}>
                {product.price}
              </Text>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button type="link" danger>
                  Xóa yêu thích
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default FavoriteProducts
