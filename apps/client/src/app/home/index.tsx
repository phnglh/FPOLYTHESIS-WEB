import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Badge,
  Button,
  Col,
  Row,
  Slider,
  Table,
  Typography,
  Card,
  Popover,
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
const { Title, Text } = Typography

export default function Home() {
  const { t } = useTranslation()
  const [value, setValue] = useState(false)

  const images = [
    'https://bizweb.dktcdn.net/100/494/200/themes/918976/assets/slider_2.jpg?1721817765499',
    'https://bizweb.dktcdn.net/100/494/200/themes/918976/assets/slider_1.jpg?1721817765499',
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length])

  const brandLogos = [
    {
      name: 'The Guardian',
      img: 'https://bizweb.dktcdn.net/thumb/medium/100/494/200/themes/918976/assets/img_brand_1.png?1721817765499',
    },
    {
      name: 'Squares',
      img: 'https://bizweb.dktcdn.net/thumb/medium/100/494/200/themes/918976/assets/img_brand_2.png?1721817765499',
    },
    {
      name: 'Rippling',
      img: 'https://bizweb.dktcdn.net/thumb/medium/100/494/200/themes/918976/assets/img_brand_3.png?1721817765499',
    },
    {
      name: 'Asana',
      img: 'https://bizweb.dktcdn.net/thumb/medium/100/494/200/themes/918976/assets/img_brand_4.png?1721817765499',
    },
    {
      name: 'Square',
      img: 'https://bizweb.dktcdn.net/thumb/medium/100/494/200/themes/918976/assets/img_brand_5.png?1721817765499',
    },
    {
      name: 'Attentive',
      img: 'https://bizweb.dktcdn.net/thumb/medium/100/494/200/themes/918976/assets/img_brand_6.png?1721817765499',
    },
    {
      name: 'Classpass',
      img: 'https://bizweb.dktcdn.net/thumb/medium/100/494/200/themes/918976/assets/img_brand_7.png?1721817765499',
    },
    {
      name: 'Hopin',
      img: 'https://bizweb.dktcdn.net/thumb/medium/100/494/200/themes/918976/assets/img_brand_8.png?1721817765499',
    },
    {
      name: 'Zapier',
      img: 'https://bizweb.dktcdn.net/thumb/medium/100/494/200/themes/918976/assets/img_brand_9.png?1721817765499',
    },
    {
      name: 'Medium',
      img: 'https://bizweb.dktcdn.net/thumb/medium/100/494/200/themes/918976/assets/img_brand_10.png?1721817765499',
    },
    {
      name: 'HelloSign',
      img: 'https://bizweb.dktcdn.net/thumb/medium/100/494/200/themes/918976/assets/img_brand_11.png?1721817765499',
    },
  ]
  const categories = [
    'Áo thể thao',
    'Quần thể thao',
    'Giày thể thao',
    'Phụ kiện thể thao',
  ]
  const products2 = [
    { image: '/images/banner.png', type: 'banner' },
    {
      image: '/images/product1.png',
      name: 'ÁO LÓT GIỮ NHIỆT ĐÁ BÓNG',
      brand: 'Kipsta',
      price: '395.000₫',
    },
    {
      image: '/images/product2.png',
      name: 'ÁO GIỮ NHIỆT NAM',
      brand: 'Underwear',
      price: '200.000₫',
    },
    {
      image: '/images/product3.png',
      name: 'ÁO DÀI TAY NAM UNDER ARMOUR',
      brand: 'Armour',
      price: '800.000₫',
    },
    {
      image: '/images/product4.png',
      name: 'ÁO BA LỖ THỂ THAO NAM PHOM',
      brand: 'Skechers',
      price: '690.000₫',
    },
    {
      image: '/images/product5.png',
      name: 'ÁO BA LỖ THỂ THAO NAM',
      brand: 'Jacquard Training',
      price: '500.000₫',
    },
    {
      image: '/images/product6.png',
      name: 'ÁO THUN THỂ THAO UNISEX',
      brand: 'Descente',
      price: '850.000₫',
    },
  ]

  const services = [
    {
      icon: <TruckOutlined style={{ fontSize: '32px', color: '#fff' }} />,
      title: 'MIỄN PHÍ GIAO HÀNG',
      description:
        'Áp dụng Free ship cho tất cả đơn hàng từ 500 nghìn, giao ngay trong vòng 24h',
    },
    {
      icon: <SyncOutlined style={{ fontSize: '32px', color: '#fff' }} />,
      title: 'ĐỔI TRẢ DỄ DÀNG',
      description:
        'Đổi ngay trong ngày nếu sản phẩm bị lỗi sản xuất, giao sai yêu cầu của quý khách',
    },
    {
      icon: (
        <CustomerServiceOutlined style={{ fontSize: '32px', color: '#fff' }} />
      ),
      title: 'TƯ VẤN 24/7',
      description:
        'Gọi hotline: 1900 6750 để được hỗ trợ ngay, hỗ trợ tư vấn mọi vấn đề về thể thao',
    },
    {
      icon: <CreditCardOutlined style={{ fontSize: '32px', color: '#fff' }} />,
      title: 'THANH TOÁN ĐA DẠNG',
      description:
        'Thanh toán khi nhận hàng COD, Chuyển Khoản, Napas, Visa, ATM, Trả góp',
    },
  ]

  const newsData = [
    {
      title: 'Phối đồ với giày Converse 1970s chưa bao giờ đơn giản đến thế',
      category: 'Thời trang',
      image: 'converse-1970s.jpg',
      date: '05/10/2023',
      author: 'Nguyễn Thị Kim Anh',
      description:
        'Là một trong những dòng giày chủ lực của nhà bóng rổ, Converse Chuck 1970s được các bạn trẻ săn đón...',
    },
    {
      title:
        'Cách chọn size giày MLB nam đúng chuẩn ? Bảng size giày MLB Việt Nam',
      category: 'Hướng dẫn',
      image: 'mlb-shoes.jpg',
      date: '05/10/2023',
      author: 'Nguyễn Thị Kim Anh',
      description:
        'Giày MLB nam được nhiều bạn trẻ yêu thích. Vậy bạn đã biết cách chọn size giày MLB nam đúng chuẩn chưa?...',
    },
    {
      title: 'Tips chọn áo thun thể thao nam phù hợp anh chàng ưa vận động',
      category: 'Tip chọn',
      image: 'running-shirt.jpg',
      date: '05/10/2023',
      author: 'Nguyễn Thị Kim Anh',
      description:
        'Áo thun thể thao dành cho nam là món đồ phổ biến ở những chàng trai yêu thích thể dục thể thao, các hoạt...',
    },
    {
      title:
        'Tất tần tật bí quyết chọn mua quần áo thể thao nam chất lượng nhất',
      category: 'Thời trang',
      image: 'gym-clothes.jpg',
      date: '05/10/2023',
      author: 'Nguyễn Thị Kim Anh',
      description:
        'Là những người đam mê bộ môn Gym và mong muốn có thân hình đẹp, thu hút mọi ánh nhìn của nữ giới, hay đ...',
    },
  ]
  const banner =
    'https://bizweb.dktcdn.net/100/494/200/themes/918976/assets/section_product_banner.jpg?1721817765499'
  // danh sách sản phẩmphẩm
  const products = [
    {
      brand: 'Puma',
      name: 'TÚI TRỐNG THỂ THAO UNISEX FIT...',
      price: '1.500.000₫',
      oldPrice: '',
      status: 'Hết ưu đãi',
      image: 'https://link-to-image-1.jpg',
      thumbnails: [
        'https://link-to-image-1.jpg',
        'https://link-to-image-2.jpg',
      ],
    },
    {
      brand: 'Nike',
      name: 'NIKE LUNARACER 4',
      oldPrice: '4.100.000₫',
      discount: '-5%',
      price: '3.500.000₫',
      image: 'https://link-to-image-2.jpg',
      thumbnails: [
        'https://link-to-image-3.jpg',
        'https://link-to-image-4.jpg',
      ],
    },
    {
      brand: 'Descente',
      name: 'SET 2 BĂNG ĐEO TAY THỂ THAO...',
      price: '390.000₫',
      oldPrice: '',
      status: 'Hết ưu đãi',
      image: 'https://link-to-image-3.jpg',
      thumbnails: [
        'https://link-to-image-1.jpg',
        'https://link-to-image-2.jpg',
      ],
    },
    {
      brand: 'Descente',
      name: 'QUẦN LEGGINGS THỂ THAO NAM...',
      price: '650.000₫',
      oldPrice: '',
      status: 'Hết ưu đãi',
      image: 'https://link-to-image-4.jpg',
      thumbnails: [
        'https://link-to-image-1.jpg',
        'https://link-to-image-2.jpg',
      ],
    },
    {
      brand: 'Puma',
      name: 'ÁO THUN THỂ THAO NAM TAY NGẮN...',
      price: '700.000₫',
      oldPrice: '',
      status: 'Hết ưu đãi',
      image: 'https://link-to-image-5.jpg',
      thumbnails: [
        'https://link-to-image-1.jpg',
        'https://link-to-image-2.jpg',
      ],
    },
    {
      brand: 'Converse',
      name: 'CONVERSE CHUCK 70 E260 HI',
      price: '3.500.000₫',
      oldPrice: '',
      status: 'Hết ưu đãi',
      image: 'https://link-to-image-6.jpg',
      thumbnails: [
        'https://link-to-image-1.jpg',
        'https://link-to-image-2.jpg',
      ],
    },
    {
      brand: 'Descente',
      name: 'ÁO THUN THỂ THAO NAM CỔ TRÒN...',
      price: '1.200.000₫',
      oldPrice: '',
      status: 'Hết ưu đãi',
      image: 'https://link-to-image-7.jpg',
      thumbnails: [
        'https://link-to-image-1.jpg',
        'https://link-to-image-2.jpg',
      ],
    },
    {
      brand: 'Nike',
      name: 'NIKE DUNK HIGH UP',
      price: '3.890.000₫',
      oldPrice: '4.100.000₫',
      discount: '-5%',
      image: 'https://link-to-image-8.jpg',
      thumbnails: [
        'https://link-to-image-1.jpg',
        'https://link-to-image-2.jpg',
      ],
    },
  ]

  useEffect(() => {
    console.log('value', value)
  }, [value])
  return (
    <>
      <div>
        <div
          className="position-relative text-center text-white"
          style={{
            backgroundImage: `url('${images[currentImageIndex]}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        ></div>

        {/* logo thương hiệu */}
        <div style={{ maxWidth: '90%', margin: '20px auto' }}>
          <div
            style={{
              backgroundColor: '#d9e0d9',
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <Row justify="center">
              {brandLogos.slice(0, 5).map((brand, index) => (
                <Col
                  key={index}
                  xs={12}
                  sm={8}
                  md={4}
                  lg={4}
                  style={{ textAlign: 'center', marginBottom: '20px' }}
                >
                  <img
                    src={brand.img}
                    alt={brand.name}
                    style={{
                      maxWidth: '120px',
                      height: 'auto',
                      filter: 'brightness(0.3)',
                    }}
                  />
                </Col>
              ))}
            </Row>
            <Row justify="center" style={{ marginTop: '20px' }}>
              {brandLogos.slice(5, 11).map((brand, index) => (
                <Col
                  key={index}
                  xs={12}
                  sm={8}
                  md={4}
                  lg={4}
                  style={{ textAlign: 'center', marginBottom: '20px' }}
                >
                  <img
                    src={brand.img}
                    alt={brand.name}
                    style={{
                      maxWidth: '120px',
                      height: 'auto',
                      filter: 'brightness(0.3)',
                    }}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* sản phẩm nổi bật*/}
        <div style={{ padding: '20px' }}>
          <Title level={2} style={{ textAlign: 'center', color: '#3C6255' }}>
            SẢN PHẨM NỔI BẬT
          </Title>
          <Row gutter={[16, 16]} justify="center">
            {products.map((product, index) => (
              <Col xs={12} sm={8} md={6} lg={6} key={index}>
                <Popover
                  content={
                    <div>
                      <Title level={5}>{product.name}</Title>
                      <Text>{product.brand}</Text>
                      <div style={{ marginTop: '10px' }}>
                        <Text
                          strong
                          style={{ fontSize: '16px', color: '#3C6255' }}
                        >
                          {product.price}
                        </Text>
                        {product.oldPrice && (
                          <Text
                            delete
                            style={{ marginLeft: '8px', color: '#999' }}
                          >
                            {product.oldPrice}
                          </Text>
                        )}
                      </div>
                    </div>
                  }
                  title="Chi tiết sản phẩm"
                  trigger="hover"
                >
                  <Card
                    cover={
                      <img
                        alt={product.name}
                        src={product.image}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    }
                    actions={[<HeartOutlined key="like" />]}
                    style={{ textAlign: 'center', borderRadius: '8px' }}
                  >
                    <Text type="secondary">{product.brand}</Text>
                    <Title level={5} style={{ marginTop: '5px' }}>
                      {product.name}
                    </Title>
                    {product.discount && (
                      <Badge
                        count={product.discount}
                        style={{ backgroundColor: '#3C6255', fontSize: '12px' }}
                      />
                    )}
                  </Card>
                </Popover>
              </Col>
            ))}
          </Row>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              type="primary"
              style={{ backgroundColor: '#3C6255', borderColor: '#3C6255' }}
            >
              Xem tất cả
            </Button>
          </div>
        </div>

        {/* hot trong tuầntuần */}
        <div
          style={{
            backgroundColor: '#3C6255',
            padding: '40px 0',
            textAlign: 'center',
          }}
        >
          <Title level={2} style={{ color: '#fff' }}>
            DEAL HOT TRONG TUẦN
          </Title>
          <Row gutter={[32, 32]} justify="center">
            {products.slice(0, 2).map((product, index) => (
              <Col xs={24} sm={20} md={10} lg={8} key={index}>
                <Card
                  hoverable
                  style={{ borderRadius: '10px', textAlign: 'left' }}
                  cover={
                    <Image
                      src={product.image}
                      alt={product.name}
                      preview={false}
                    />
                  }
                  actions={[
                    <Button type="default">Xem chi tiết</Button>,
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: '#3C6255',
                        borderColor: '#3C6255',
                      }}
                    >
                      Tùy chọn
                    </Button>,
                  ]}
                >
                  <Text type="secondary">{product.brand}</Text>
                  <Title level={5} style={{ marginTop: '5px' }}>
                    {product.name}
                  </Title>
                  {product.discount && (
                    <Badge
                      count={product.discount}
                      style={{ backgroundColor: '#3C6255', fontSize: '12px' }}
                    />
                  )}
                  <div>
                    <Text strong style={{ fontSize: '18px', color: '#D92D20' }}>
                      {product.price}
                    </Text>
                    {product.oldPrice && (
                      <Text delete style={{ marginLeft: '8px', color: '#999' }}>
                        {product.oldPrice}
                      </Text>
                    )}
                  </div>
                  <Text type="danger">{product.status}</Text>
                  <div
                    style={{ marginTop: '10px', display: 'flex', gap: '5px' }}
                  >
                    {product.thumbnails.map((thumb, i) => (
                      <Image key={i} src={thumb} width={50} preview={false} />
                    ))}
                    {product.thumbnails.length > 2 && (
                      <span>+{product.thumbnails.length - 2}</span>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Button
            type="primary"
            style={{
              marginTop: '20px',
              backgroundColor: '#fff',
              color: '#3C6255',
            }}
          >
            Xem tất cả
          </Button>
        </div>
        {/* sản phẩm của chúng tôitôi */}
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Title level={2} style={{ color: '#3C6255' }}>
            SẢN PHẨM CỦA CHÚNG TÔI
          </Title>

          <Tabs defaultActiveKey="0" centered>
            {categories.map((category, index) => (
              <Tabs.TabPane tab={category} key={index}></Tabs.TabPane>
            ))}
          </Tabs>
          <Row gutter={[16, 16]} justify="center">
            {products2.slice(0, 3).map((product, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card
                  hoverable
                  cover={
                    <Image
                      src={product.image}
                      preview={false}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  }
                  style={{
                    textAlign: 'center',
                    borderRadius: '10px',
                    minHeight: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text type="secondary">{product.brand}</Text>
                  <Title level={5} style={{ marginTop: '5px' }}>
                    {product.name}
                  </Title>
                  <Text strong style={{ fontSize: '16px', color: '#D92D20' }}>
                    {product.price}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]} justify="center">
            {products.slice(0, 4).map((product, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card
                  hoverable
                  cover={
                    <Image
                      src={product.image}
                      preview={false}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  }
                  style={{
                    textAlign: 'center',
                    borderRadius: '10px',
                    minHeight: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text type="secondary">{product.brand}</Text>
                  <Title level={5} style={{ marginTop: '5px' }}>
                    {product.name}
                  </Title>
                  <Text strong style={{ fontSize: '16px', color: '#D92D20' }}>
                    {product.price}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
          <Button
            type="primary"
            style={{
              marginTop: '20px',
              backgroundColor: '#3C6255',
              borderColor: '#3C6255',
            }}
          >
            Xem thêm
          </Button>
        </div>
        {/* tư vấn giao hànghàng */}
        <div style={{ backgroundColor: '#A8B5A2', padding: '20px 0' }}>
          <Row gutter={[16, 16]} justify="center">
            {services.map((service, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card
                  style={{
                    backgroundColor: index % 2 === 0 ? '#506A58' : '#2D4634',
                    textAlign: 'center',
                    color: '#fff',
                    borderRadius: '8px',
                    height: '100%',
                  }}
                  bordered={false}
                >
                  {service.icon}
                  <h3 style={{ color: '#fff', marginTop: '10px' }}>
                    {service.title}
                  </h3>
                  <p style={{ color: '#EAEAEA', fontSize: '14px' }}>
                    {service.description}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        {/* best seller */}
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <Title level={2} style={{ color: '#1E3A34' }}>
            BEST SELLER
          </Title>

          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={24} md={18} lg={18}>
              <Row gutter={[16, 16]}>
                {products.slice(0, 6).map((product, index) => (
                  <Col xs={12} sm={8} md={8} lg={8} key={index}>
                    <Card
                      hoverable
                      cover={
                        <Image
                          src={product.image}
                          preview={false}
                          style={{ height: '180px', objectFit: 'cover' }}
                        />
                      }
                      style={{ textAlign: 'center', borderRadius: '10px' }}
                    >
                      <Text type="secondary">{product.brand}</Text>
                      <Title level={5} style={{ marginTop: '5px' }}>
                        {product.name}
                      </Title>
                      <Text
                        strong
                        style={{ fontSize: '16px', color: '#D92D20' }}
                      >
                        {product.price}
                      </Text>
                      {product.oldPrice && (
                        <Text
                          delete
                          style={{ marginLeft: '8px', color: '#888' }}
                        >
                          {product.oldPrice}
                        </Text>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>

            <Col xs={24} sm={24} md={6} lg={6}>
              <Image
                src={banner}
                preview={false}
                style={{ width: '100%', borderRadius: '10px' }}
              />
            </Col>
          </Row>

          <Button
            type="primary"
            style={{
              marginTop: '20px',
              backgroundColor: '#1E3A34',
              borderColor: '#1E3A34',
            }}
          >
            Xem tất cả
          </Button>
        </div>
        {/* khách hàng nói gìgì */}
        <Row
          style={{ background: '#3E5E46', padding: '50px 0' }}
          align="middle"
        >
          <Col xs={24} md={12}>
            <Image
              src="store-image.jpg"
              preview={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Col>
          <Col xs={24} md={12} style={{ padding: '40px', color: 'white' }}>
            <Title level={2} style={{ color: 'white' }}>
              KHÁCH HÀNG NÓI GÌ VỀ SẢN PHẨM CỦA OH! THỂ THAO
            </Title>

            <Carousel autoplay dots={true}>
              <div>
                <Text
                  style={{
                    fontSize: '18px',
                    fontStyle: 'italic',
                    display: 'block',
                    marginBottom: '20px',
                  }}
                >
                  "Cảm ơn OH!Sport đã giúp mình tậu được 2 đôi giày ưng ý cho
                  mùa hè này. Đối với mình OH!Sport luôn là lựa chọn đầu tiên
                  của mình, mẫu mã đa dạng, cách phục vụ chu đáo và luôn support
                  khách hàng nhiệt tình. Chúc OH!Sport thành công hơn nữa."
                </Text>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '20px',
                  }}
                >
                  <Avatar src="customer-avatar.jpg" size={50} />{' '}
                  <div style={{ marginLeft: '15px' }}>
                    <Title level={5} style={{ margin: 0, color: 'white' }}>
                      Bạn Diễm Hằng
                    </Title>
                    <Text style={{ color: '#ccc' }}>
                      Khách hàng mua giày tại OH!Sport
                    </Text>
                    <div>
                      <Rate
                        disabled
                        defaultValue={5}
                        style={{ color: '#FFD700' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Carousel>
          </Col>
        </Row>
        {/* tin tức nổi bậtbật */}
        <div style={{ padding: '50px 100px', textAlign: 'center' }}>
          <Title level={2} style={{ marginBottom: 30 }}>
            TIN TỨC MỚI NHẤT
          </Title>

          <Row gutter={[30, 30]}>
            {newsData.map((news, index) => (
              <Col xs={24} sm={24} md={12} lg={12} key={index}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={news.title}
                      src={news.image}
                      style={{ height: '180px', objectFit: 'cover' }}
                    />
                  }
                  bordered={false}
                >
                  <Tag color="green">{news.category}</Tag>
                  <Title level={4} style={{ marginTop: 10 }}>
                    {news.title}
                  </Title>
                  <Text type="secondary">
                    {news.date} - {news.author}
                  </Text>
                  <Text style={{ display: 'block', marginTop: 10 }}>
                    {news.description}
                  </Text>
                  <Button
                    type="link"
                    icon={<RightOutlined />}
                    style={{ marginTop: 10, padding: 0 }}
                  >
                    Đọc tiếp
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>

          <Button
            type="primary"
            size="large"
            style={{ marginTop: 30, background: '#2D5E3F', border: 'none' }}
          >
            Xem tất cả
          </Button>
        </div>
      </div>
    </>
  )
}
