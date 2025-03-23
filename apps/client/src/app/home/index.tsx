import { useTranslation } from 'react-i18next'
import { Button, Col, Row, Typography, Card } from 'antd'
import { ProductCard } from '../../layout/components/homepage/ProductCard'
import { useProductList } from '@hooks/useProductQuery'
const { Title, Text } = Typography

export default function Home() {
  const { t } = useTranslation()
  const { data } = useProductList()

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
            {data?.map((product, index) => (
              <Col key={index} xs={24} sm={12} md={12} lg={6} xl={6}>
                <Card
                  hoverable
                  style={{ width: 300 }}
                  cover={<img alt={product.name} src={product.image_url} />}
                >
                  <div>
                    <Text strong>{product.brand_name}</Text>
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
            {data?.slice(0, 2).map((product, index) => (
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
