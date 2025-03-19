import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Badge,
  Button,
  Col,
  Row,
  Typography,
  Card,
  Image,
  Tabs,
  Rate,
  Carousel,
  Avatar,
  Tag,
} from 'antd'
import {
  CreditCardOutlined,
  CustomerServiceOutlined,
  HeartOutlined,
  RightOutlined,
  SyncOutlined,
  TruckOutlined,
} from '@ant-design/icons'
import { ProductCard } from '../../layout/components/homepage/ProductCard'
const { Title, Text } = Typography

export default function Home() {
  const { t } = useTranslation()
  const [value, setValue] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const products = [
    {
      brand: 'Puma',
      name: 'TÚI TRỐNG THỂ THAO UNISEX FIT DUFFEL',
      price: 1500000,
      oldPrice: null,
      discount: null,
      image: 'https://via.placeholder.com/150',
      extraImages: [
        'https://via.placeholder.com/40',
        'https://via.placeholder.com/40',
      ],
      colors: [],
    },
    {
      brand: 'Nike',
      name: 'NIKE DUNK HIGH UP',
      price: 3890000,
      oldPrice: 4100000,
      discount: 5,
      image: 'https://via.placeholder.com/150',
      extraImages: [
        'https://via.placeholder.com/40',
        'https://via.placeholder.com/40',
      ],
      colors: ['#C62828', '#795548', '#000000', '#FFFFFF'],
    },
    {
      brand: 'Nike',
      name: 'NIKE DUNK HIGH UP',
      price: 3890000,
      oldPrice: 4100000,
      discount: 5,
      image: 'https://via.placeholder.com/150',
      extraImages: [
        'https://via.placeholder.com/40',
        'https://via.placeholder.com/40',
      ],
      colors: ['#C62828', '#795548', '#000000', '#FFFFFF'],
    },
    {
      brand: 'Nike',
      name: 'NIKE DUNK HIGH UP',
      price: 3890000,
      oldPrice: 4100000,
      discount: 5,
      image: 'https://via.placeholder.com/150',
      extraImages: [
        'https://via.placeholder.com/40',
        'https://via.placeholder.com/40',
      ],
      colors: ['#C62828', '#795548', '#000000', '#FFFFFF'],
    },
    {
      brand: 'Nike',
      name: 'NIKE DUNK HIGH UP',
      price: 3890000,
      oldPrice: 4100000,
      discount: 5,
      image: 'https://via.placeholder.com/150',
      extraImages: [
        'https://via.placeholder.com/40',
        'https://via.placeholder.com/40',
      ],
      colors: ['#C62828', '#795548', '#000000', '#FFFFFF'],
    },
    {
      brand: 'Nike',
      name: 'NIKE DUNK HIGH UP',
      price: 3890000,
      oldPrice: 4100000,
      discount: 5,
      image: 'https://via.placeholder.com/150',
      extraImages: [
        'https://via.placeholder.com/40',
        'https://via.placeholder.com/40',
      ],
      colors: ['#C62828', '#795548', '#000000', '#FFFFFF'],
    },
    {
      brand: 'Nike',
      name: 'NIKE DUNK HIGH UP',
      price: 3890000,
      oldPrice: 4100000,
      discount: 5,
      image: 'https://via.placeholder.com/150',
      extraImages: [
        'https://via.placeholder.com/40',
        'https://via.placeholder.com/40',
      ],
      colors: ['#C62828', '#795548', '#000000', '#FFFFFF'],
    },
    {
      brand: 'Nike',
      name: 'NIKE DUNK HIGH UP',
      price: 3890000,
      oldPrice: 4100000,
      discount: 5,
      image: 'https://via.placeholder.com/150',
      extraImages: [
        'https://via.placeholder.com/40',
        'https://via.placeholder.com/40',
      ],
      colors: ['#C62828', '#795548', '#000000', '#FFFFFF'],
    },
  ]

  return (
    <Row>
      <Col className="banner">
        <img
          src="https://bizweb.dktcdn.net/100/494/200/themes/918976/assets/slider_1.jpg?1721817765499"
          alt="Banner"
        />
      </Col>
      <Col
        className="container"
        style={{ padding: '20px', alignItems: 'center', margin: '0 auto' }}
      >
        <Row justify="center">
          <Col span={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Title>{t('homepage.products')}</Title>
          </Col>
          <Row
            justify="center"
            gutter={[50, 30]}
            style={{ margin: '0 auto', maxWidth: '1400px' }}
          >
            {products.map((product, index) => (
              <Col key={index} xs={24} sm={12} md={12} lg={6} xl={6}>
                <Card
                  hoverable
                  style={{ width: 300 }}
                  cover={
                    <img
                      alt="example"
                      src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                    />
                  }
                >
                  <div>
                    <Text strong>{product.brand}</Text>
                    <br />
                    <Text>{product.name}</Text>
                    <br />
                    <Text>{product.price}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Col span={24} style={{ textAlign: 'center', marginTop: 20 }}>
            <Button type="primary" size="large">
              Xem tất cả
            </Button>
          </Col>
        </Row>
      </Col>
      <Col className="container">
        <Row
          justify="center"
          align="middle"
          style={{ marginTop: 50, backgroundColor: '#46694f' }}
        >
          <Col span={24} style={{ textAlign: 'center', margin: '30px 0' }}>
            <Title style={{ color: '#fff' }}>{t('homepage.categories')}</Title>
          </Col>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 px-40">
            {products.slice(0, 2).map((product, index) => (
              <div
                key={index}
                className={`${index >= 1 ? 'hidden md:block' : ''}`}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </Row>
      </Col>
    </Row>
  )
}
