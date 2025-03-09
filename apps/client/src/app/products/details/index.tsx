import React, { useState } from 'react'
import {
  Card,
  Radio,
  Button,
  InputNumber,
  Image,
  Modal,
  Slider,
  Tabs,
  Row,
  Col,
  Typography,
} from 'antd'
import {
  HeartFilled,
  HeartOutlined,
  LikeFilled,
  ShoppingCartOutlined,
} from '@ant-design/icons'

const { TabPane } = Tabs
const { Title, Text } = Typography

const sizeGuide = [
  { size: 'S', height: [150, 158], weight: [53, 60] },
  { size: 'M', height: [158, 168], weight: [61, 68] },
  { size: 'L', height: [168, 176], weight: [69, 76] },
  { size: 'XL', height: [176, 184], weight: [77, 84] },
  { size: 'XXL', height: [184, 192], weight: [85, 200] },
]

const colors = [
  { name: 'Trắng', code: '#FFFFFF' },
  { name: 'Đen', code: '#000000' },
  { name: 'Xanh Dương', code: '#1E90FF' },
  { name: 'Đỏ', code: '#FF0000' },
]

const products = [
  {
    id: 1,
    name: 'Áo ba lỗ thể thao nam',
    price: '500.000₫',
    image: '/path-to-image-3.jpg',
  },
  {
    id: 2,
    name: 'Áo ba lỗ thể thao nam không tay',
    price: '1.300.000₫',
    image: '/path-to-image-4.jpg',
  },
]

const ProductDetailPage = () => {
  const [size, setSize] = useState('S')
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [height, setHeight] = useState(150)
  const [weight, setWeight] = useState(53)

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const getRecommendedSize = () => {
    return (
      sizeGuide.find(
        (s) =>
          height >= s.height[0] &&
          height <= s.height[1] &&
          weight >= s.weight[0] &&
          weight <= s.weight[1],
      )?.size || 'Chưa chọn'
    )
  }

  return (
    <>
      <div className="product-page" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div className="product-images" style={{ flex: 1 }}>
            <Image.PreviewGroup>
              <Image style={{ width: '300px' }} src="/path-to-image-1.jpg" />
              <Image style={{ width: '300px' }} src="/path-to-image-2.jpg" />
            </Image.PreviewGroup>
          </div>

          <Card
            title="Áo ba lỗ thể thao nam phom suông thời trang"
            style={{ flex: 1, textAlign: 'left' }}
          >
            <p>
              <b>Thương hiệu:</b> Skechers
            </p>
            <p>
              <b>Mã sản phẩm:</b> SP22Q4M410
            </p>
            <p style={{ color: 'red', fontSize: '18px' }}>
              <b>690.000₫</b>
            </p>

            <p>
              <b>Màu sắc:</b> {selectedColor.name}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              {colors.map((color) => (
                <div
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '30px',
                    height: '30px',
                    backgroundColor: color.code,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border:
                      selectedColor.name === color.name
                        ? '3px solid black'
                        : '1px solid gray',
                  }}
                />
              ))}
            </div>

            <p>
              <b>Size:</b>{' '}
              <Button type="link" onClick={() => setIsModalVisible(true)}>
                Hướng dẫn chọn size
              </Button>
            </p>
            <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
              {sizeGuide.map((s) => (
                <Radio.Button key={s.size} value={s.size}>
                  {s.size}
                </Radio.Button>
              ))}
            </Radio.Group>
            <p>
              <b>Size phù hợp với bạn là: {getRecommendedSize()}</b>
            </p>

            <p>
              <b>Số lượng:</b>
            </p>
            <InputNumber
              min={1}
              max={10}
              value={quantity}
              onChange={(value) => setQuantity(value || 1)}
            />

            <div style={{ marginTop: '20px' }}>
              <Button type="primary" style={{ marginRight: '10px' }}>
                Mua ngay
              </Button>
              <Button icon={<ShoppingCartOutlined />}>Thêm vào giỏ hàng</Button>
            </div>
          </Card>
        </div>

        <Tabs
          defaultActiveKey="1"
          style={{ marginTop: '20px', textAlign: 'left' }}
        >
          <TabPane tab="Thông tin chi tiết" key="1">
            <ul style={{ listStyleType: 'disc' }}>
              <li>Kiểu dáng áo ba lỗ nam cổ tròn hiện đại</li>
              <li>Chi tiết logo chữ S in nổi bật ở ngực trái</li>
              <li>Chất vải mềm mịn, khả năng thấm hút mồ hôi tốt</li>
              <li>Phom áo suông, tạo sự dễ chịu và tự do chuyển động</li>
              <li>
                Thích hợp sử dụng cho tập luyện thể thao, hoạt động ngoài trời
              </li>
              <li>Xuất xứ thương hiệu: Mỹ</li>
            </ul>
          </TabPane>
          <TabPane tab="Chính sách bán hàng" key="2">
            <p>Chính sách đổi trả, bảo hành...</p>
          </TabPane>
          <TabPane tab="Đánh giá sản phẩm" key="3">
            <p>Khách hàng đánh giá sản phẩm...</p>
          </TabPane>
        </Tabs>

        {/* Sản phẩm cùng danh mục */}
        <div>
          <Title
            level={3}
            style={{ textAlign: 'center', color: 'black', marginTop: '30px' }}
          >
            Sản phẩm cùng danh mục
          </Title>
          <Row gutter={[16, 16]} style={{ textAlign: 'left' }}>
            {products.map((product, index) => (
              <Col xs={12} sm={12} md={6} lg={6} key={index}>
                <Card
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <HeartOutlined
                    style={{
                      fontSize: 20,
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      color: 'black',
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{ position: 'relative' }}>
                    <img
                      alt={product.name}
                      src={product.image}
                      style={{
                        height: '200px',
                        objectFit: 'contain',
                        padding: '10px',
                        width: '100%',
                        transition: 'opacity 0.3s',
                        opacity: hoveredIndex === index ? 0.7 : 1,
                      }}
                    />
                    {hoveredIndex === index && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '5px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          padding: '10px',
                        }}
                      >
                        <Button
                          style={{
                            backgroundColor: '#3C6255',
                            color: 'white',
                            border: 'none',
                          }}
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          style={{ backgroundColor: '#555', color: 'white' }}
                        >
                          Tùy chọn
                        </Button>
                      </div>
                    )}
                  </div>
                  <Title level={5} style={{ marginTop: '5px' }}>
                    {product.name}
                  </Title>
                  <Text
                    strong
                    style={{
                      fontSize: '16px',
                      color: '#3C6255',
                      display: 'block',
                      marginTop: '5px',
                    }}
                  >
                    {product.price}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Sản phẩm gợi ý */}
        <div>
          <Title
            level={3}
            style={{ textAlign: 'center', color: 'black', marginTop: '30px' }}
          >
            Sản phẩm gợi ý
          </Title>
          <Row gutter={[16, 16]} style={{ textAlign: 'left' }}>
            {products.map((product, index) => (
              <Col xs={12} sm={12} md={6} lg={6} key={index}>
                <Card
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <HeartOutlined
                    style={{
                      fontSize: 20,
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      color: 'black',
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{ position: 'relative' }}>
                    <img
                      alt={product.name}
                      src={product.image}
                      style={{
                        height: '200px',
                        objectFit: 'contain',
                        padding: '10px',
                        width: '100%',
                        transition: 'opacity 0.3s',
                        opacity: hoveredIndex === index ? 0.7 : 1,
                      }}
                    />
                    {hoveredIndex === index && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '5px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          padding: '10px',
                        }}
                      >
                        <Button
                          style={{
                            backgroundColor: '#3C6255',
                            color: 'white',
                            border: 'none',
                          }}
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          style={{ backgroundColor: '#555', color: 'white' }}
                        >
                          Tùy chọn
                        </Button>
                      </div>
                    )}
                  </div>
                  <Title level={5} style={{ marginTop: '5px' }}>
                    {product.name}
                  </Title>
                  <Text
                    strong
                    style={{
                      fontSize: '16px',
                      color: '#3C6255',
                      display: 'block',
                      marginTop: '5px',
                    }}
                  >
                    {product.price}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Sản phẩm đã xemxem */}
        <div>
          <Title
            level={3}
            style={{ textAlign: 'center', color: 'black', marginTop: '30px' }}
          >
            Sản phẩm đã xem
          </Title>
          <Row gutter={[16, 16]} style={{ textAlign: 'left' }}>
            {products.map((product, index) => (
              <Col xs={12} sm={12} md={6} lg={6} key={index}>
                <Card
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    textAlign: 'center',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <HeartOutlined
                    style={{
                      fontSize: 20,
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      color: 'black',
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{ position: 'relative' }}>
                    <img
                      alt={product.name}
                      src={product.image}
                      style={{
                        height: '200px',
                        objectFit: 'contain',
                        padding: '10px',
                        width: '100%',
                        transition: 'opacity 0.3s',
                        opacity: hoveredIndex === index ? 0.7 : 1,
                      }}
                    />
                    {hoveredIndex === index && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '5px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          padding: '10px',
                        }}
                      >
                        <Button
                          style={{
                            backgroundColor: '#3C6255',
                            color: 'white',
                            border: 'none',
                          }}
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          style={{ backgroundColor: '#555', color: 'white' }}
                        >
                          Tùy chọn
                        </Button>
                      </div>
                    )}
                  </div>
                  <Title level={5} style={{ marginTop: '5px' }}>
                    {product.name}
                  </Title>
                  <Text
                    strong
                    style={{
                      fontSize: '16px',
                      color: '#3C6255',
                      display: 'block',
                      marginTop: '5px',
                    }}
                  >
                    {product.price}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Modal
          title="Hướng dẫn chọn size"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <p>Xem hướng dẫn tính số đo vòng chuẩn tại đây</p>
          <p>
            <b>Số đo</b>
          </p>
          <p>
            Chiều cao:{' '}
            <Slider min={150} max={192} value={height} onChange={setHeight} />{' '}
            {height} cm
          </p>
          <p>
            Cân nặng:{' '}
            <Slider min={53} max={100} value={weight} onChange={setWeight} />{' '}
            {weight} kg
          </p>
          <p>
            <b>Size phù hợp với bạn là: {getRecommendedSize()}</b>
          </p>
        </Modal>
      </div>
    </>
  )
}

export default ProductDetailPage
