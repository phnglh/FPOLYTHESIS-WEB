import React, { useState } from 'react'
import {
  Layout,
  Select,
  Card,
  Row,
  Col,
  Checkbox,
  Collapse,
  Tag,
  Button,
  Typography,
  Image,
  Pagination,
} from 'antd'

import { HeartOutlined } from '@ant-design/icons'
import { useGetProductsQuery } from '../../store/api/productApi'
// import Title from 'antd/es/skeleton/Title';

const { Title, Text } = Typography

const { Sider } = Layout
const { Panel } = Collapse

const ProductPage = () => {
  // const { data, error, isLoading } = useGetProductsQuery()

  const [likedProducts, setLikedProducts] = useState<number[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const toggleLike = (id: number) => {
    setLikedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    )
  }
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])

  const handleChange = (value: string, checked: boolean) => {
    setSelectedPrices((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value),
    )
  }
  const clearAll = () => {
    setSelectedPrices([])
  }

  const [current, setCurrent] = useState(1)

  const onChange = (page: number) => {
    setCurrent(page)
    console.log(`Page: ${page}`)
  }

  // console.log(data)

  // if (!data) {
  //   return <div>Loading...</div>
  // }

  // const { products, meta } = data

  // const getMinprice = (skus) => skus.length ? Math.min(...skus.map((sku) => sku.price)) : null
  type Sku = { price: number }

  const getMinPrice = (skus: Sku[] = []): number | null =>
    skus.length ? Math.min(...skus.map((sku) => sku.price)) : null

  const products = [
    {
      id: 1,
      name: 'Laptop Dell XPS 13',
      brand: 'Dell',
      image: 'https://via.placeholder.com/300x180', // Hình ảnh giả
      skus: [{ price: 25000000 }, { price: 24000000 }, { price: 26000000 }],
    },
    {
      id: 2,
      name: 'MacBook Pro 14 M3',
      brand: 'Apple',
      image: 'https://via.placeholder.com/300x180',
      skus: [{ price: 45000000 }, { price: 44000000 }],
    },
    {
      id: 3,
      name: 'Asus ROG Strix G15',
      brand: 'Asus',
      image: 'https://via.placeholder.com/300x180',
      skus: [{ price: 32000000 }, { price: 31000000 }, { price: 33000000 }],
    },
    {
      id: 4,
      name: 'Lenovo ThinkPad X1 Carbon',
      brand: 'Lenovo',
      image: 'https://via.placeholder.com/300x180',
      skus: [{ price: 28000000 }],
    },
    {
      id: 5,
      name: 'HP Spectre x360',
      brand: 'HP',
      image: 'https://via.placeholder.com/300x180',
      skus: [{ price: 29000000 }, { price: 29500000 }],
    },
  ]

  return (
    <>
      <Layout style={{ padding: '10px' }}>
        <div>
          <Sider width={250} style={{ background: '#fff', padding: '10px' }}>
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '12px',
                background: '#3f573b',
                margin: '0 0 20px 0',
                textAlign: 'center',
                borderRadius: '4px',
                width: '100%',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Danh mục sản phẩm
            </h3>
            <Collapse accordion style={{ background: 'transparent' }}>
              <Panel header="Áo thể thao" key="1" style={{ textAlign: 'left' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <p>Áo thun thể thao</p>
                  <p>Áo ba lỗ</p>
                  <p>Áo giữ nhiệt</p>
                </div>
              </Panel>

              <Panel
                header="Quần thể thao"
                key="2"
                style={{ textAlign: 'left' }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <p>Quần dài tập luyện</p>
                  <p>Quần legging thể thao</p>
                  <p>Quần jogger thể thao</p>
                  <p>Quần shorts thể thao</p>
                </div>
              </Panel>

              <Panel
                header="Giày thể thao"
                key="3"
                style={{ textAlign: 'left' }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <p>Nike</p>
                  <p>Adidas</p>
                </div>
              </Panel>

              <Panel
                header="Phụ kiện thể thao"
                key="4"
                style={{ textAlign: 'left' }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <p>Bình nước thể thao</p>
                  <p>Găng tay thể thao</p>
                  <p>Băng tay thể thao</p>
                  <p>Túi xách thể thao</p>
                </div>
              </Panel>
            </Collapse>

            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '12px',
                background: '#3f573b',
                margin: '0 0 20px 0',
                textAlign: 'center',
                borderRadius: '4px',
                width: '100%',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '30px',
              }}
            >
              Bộ lọc sản phẩm
            </h3>
            <div>
              {selectedPrices.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <strong>Bạn chọn:</strong>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '5px',
                      marginTop: '5px',
                    }}
                  >
                    {selectedPrices.map((item) => (
                      <Tag
                        key={item}
                        closable
                        color="#3f573b"
                        onClose={() =>
                          setSelectedPrices(
                            selectedPrices.filter((i) => i !== item),
                          )
                        }
                      >
                        {item}
                      </Tag>
                    ))}
                  </div>
                  <span
                    onClick={clearAll}
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'block',
                      marginTop: '5px',
                    }}
                  >
                    Bỏ hết
                  </span>
                </div>
              )}

              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'black',
                  marginBottom: '10px',
                  textAlign: 'left',
                }}
              >
                Chọn khoảng giá
              </h4>
              <Checkbox.Group
                value={selectedPrices}
                onChange={setSelectedPrices}
              >
                <Checkbox value="Dưới 1 triệu">Dưới 1 triệu</Checkbox>
                <Checkbox value="Từ 1 triệu - 2 triệu">
                  Từ 1 triệu - 2 triệu
                </Checkbox>
                <Checkbox value="Từ 2 triệu - 3 triệu">
                  Từ 2 triệu - 3 triệu
                </Checkbox>
                <Checkbox value="Từ 3 triệu - 5 triệu">
                  Từ 3 triệu - 5 triệu
                </Checkbox>
                <Checkbox value="Trên 5 triệu">Trên 5 triệu</Checkbox>
              </Checkbox.Group>

              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'black',
                  marginBottom: '10px',
                  textAlign: 'left',
                }}
              >
                Thương hiệu
              </h4>
              <Checkbox.Group
                value={selectedPrices}
                onChange={setSelectedPrices}
              >
                <Checkbox value="Adidas">Adidas</Checkbox>
                <Checkbox value="Armour">Armour</Checkbox>
                <Checkbox value="Converse">Converse</Checkbox>
                <Checkbox value="Descente">Descente</Checkbox>
                <Checkbox value="Jacquard Training">Jacquard Training</Checkbox>
                <Checkbox value="Kipsta">Kipsta</Checkbox>
                <Checkbox value="Motorsport">Motorsport</Checkbox>
              </Checkbox.Group>

              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'black',
                  marginBottom: '10px',
                  textAlign: 'left',
                }}
              >
                Loại sản phẩm
              </h4>
              <Checkbox.Group
                value={selectedPrices}
                onChange={setSelectedPrices}
              >
                <Checkbox value="Áo ba lỗ">Áo ba lỗ</Checkbox>
                <Checkbox value="Áo giữ nhiệt">Áo giữ nhiệt</Checkbox>
                <Checkbox value="Áo tay dài">Áo tay dài</Checkbox>
                <Checkbox value="Áo thun">Áo thun</Checkbox>
                <Checkbox value="Băng đeo tay">Băng đeo tay</Checkbox>
                <Checkbox value="Bình nước">Bình nước</Checkbox>
                <Checkbox value="Găng tay">Găng tay</Checkbox>
              </Checkbox.Group>

              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'black',
                  marginBottom: '10px',
                  textAlign: 'left',
                  marginTop: '15px',
                }}
              >
                Màu sắc
              </h4>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {[
                  '#000',
                  '#fff',
                  '#1e90ff',
                  '#dc143c',
                  '#ffd700',
                  '#ff69b4',
                  '#8a2be2',
                  '#808080',
                ].map((color) => (
                  <div
                    key={color}
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: color,
                      borderRadius: '50%',
                      border: '1px solid #ccc',
                    }}
                  ></div>
                ))}
              </div>
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'black',
                  marginBottom: '10px',
                  textAlign: 'left',
                  marginTop: '15px',
                }}
              >
                Giới tính
              </h4>
              <Checkbox.Group
                value={selectedPrices}
                onChange={setSelectedPrices}
              >
                <Checkbox value="Nam">Nam</Checkbox>
                <Checkbox value="Nữ">Nữ</Checkbox>
                <br />
                <Checkbox value="Unisex">Unisex</Checkbox>
                <br />
                <Checkbox value="Bé trai">Bé trai</Checkbox>
                <br />
                <Checkbox value="Bé Gái">Bé Gái</Checkbox>
              </Checkbox.Group>

              <div>
                <h4
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    color: 'black',
                    fontSize: '16px',
                    textAlign: 'left',
                  }}
                >
                  Kích thước
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '5px',
                  }}
                >
                  <Checkbox
                    value="35"
                    onChange={(e) => handleChange('35', e.target.checked)}
                  >
                    35
                  </Checkbox>
                  <Checkbox
                    value="35.5"
                    onChange={(e) => handleChange('35.5', e.target.checked)}
                  >
                    35.5
                  </Checkbox>
                  <Checkbox
                    value="36"
                    onChange={(e) => handleChange('36', e.target.checked)}
                  >
                    36
                  </Checkbox>
                  <Checkbox
                    value="36.5"
                    onChange={(e) => handleChange('36.5', e.target.checked)}
                  >
                    36.5
                  </Checkbox>

                  <Checkbox
                    value="37"
                    onChange={(e) => handleChange('37', e.target.checked)}
                  >
                    37
                  </Checkbox>
                  <Checkbox
                    value="37.5"
                    onChange={(e) => handleChange('37.5', e.target.checked)}
                  >
                    37.5
                  </Checkbox>
                  <Checkbox
                    value="38"
                    onChange={(e) => handleChange('38', e.target.checked)}
                  >
                    38
                  </Checkbox>
                  <Checkbox
                    value="38.5"
                    onChange={(e) => handleChange('38.5', e.target.checked)}
                  >
                    38.5
                  </Checkbox>

                  <Checkbox
                    value="39"
                    onChange={(e) => handleChange('39', e.target.checked)}
                  >
                    39
                  </Checkbox>
                  <Checkbox
                    value="39.5"
                    onChange={(e) => handleChange('39.5', e.target.checked)}
                  >
                    39.5
                  </Checkbox>
                  <Checkbox
                    value="40"
                    onChange={(e) => handleChange('40', e.target.checked)}
                  >
                    40
                  </Checkbox>
                  <Checkbox
                    value="40.5"
                    onChange={(e) => handleChange('40.5', e.target.checked)}
                  >
                    40.5
                  </Checkbox>

                  <Checkbox
                    value="41"
                    onChange={(e) => handleChange('41', e.target.checked)}
                  >
                    41
                  </Checkbox>
                  <Checkbox
                    value="41.5"
                    onChange={(e) => handleChange('41.5', e.target.checked)}
                  >
                    41.5
                  </Checkbox>
                  <Checkbox
                    value="42"
                    onChange={(e) => handleChange('42', e.target.checked)}
                  >
                    42
                  </Checkbox>
                  <Checkbox
                    value="42.5"
                    onChange={(e) => handleChange('42.5', e.target.checked)}
                  >
                    42.5
                  </Checkbox>
                </div>
              </div>
            </div>
          </Sider>
        </div>
        {/* Nội dung chính */}
        <Layout style={{ paddingLeft: '20px', marginTop: '10px' }}>
          <Row
            justify="space-between"
            align="middle"
            style={{
              backgroundColor: '#3f573b',
              borderRadius: '5px',
              height: '50px',
              padding: '0 15px',
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <Col
              style={{ display: 'flex', alignItems: 'center', height: '100%' }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  margin: 0,
                }}
              >
                Tất cả sản phẩm
              </h2>
            </Col>
            <Col
              style={{ display: 'flex', alignItems: 'center', height: '100%' }}
            >
              <Select defaultValue="Sắp xếp theo" style={{ width: 150 }}>
                <Select.Option value="default">Mặc định</Select.Option>
                <Select.Option value="az">A — Z</Select.Option>
                <Select.Option value="za">Z — A</Select.Option>
                <Select.Option value="priceAsc">Giá tăng dần</Select.Option>
                <Select.Option value="priceDesc">Giá giảm dần</Select.Option>
                <Select.Option value="newest">Mới nhất</Select.Option>
                <Select.Option value="oldest">Cũ nhất</Select.Option>
              </Select>
            </Col>
          </Row>
          {/* Danh sách sản phẩm */}
          <Row gutter={[16, 16]} justify="center">
            {products?.map((product, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  hoverable
                  cover={
                    <div style={{ position: 'relative' }}>
                      <HeartOutlined
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          fontSize: '20px',
                          color: '#000',
                          zIndex: 10,
                        }}
                      />
                      <Image
                        src={product.image}
                        preview={false}
                        style={{
                          height: '280px',
                          width: '100%',
                          objectFit: 'cover',
                          borderTopLeftRadius: '10px',
                          borderTopRightRadius: '10px',
                        }}
                      />
                      {hoveredIndex === index && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-around',
                            background: 'rgba(0, 0, 0, 0.7)',
                            padding: '10px',
                            transition: 'opacity 0.3s ease',
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
                            style={{
                              backgroundColor: '#555',
                              color: 'white',
                              border: 'none',
                            }}
                          >
                            Tùy chọn
                          </Button>
                        </div>
                      )}
                    </div>
                  }
                  style={{
                    textAlign: 'center',
                    borderRadius: '10px',
                    minHeight: '350px',
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
                    {getMinPrice(product.skus)?.toLocaleString() ?? 'Liên hệ'}{' '}
                    VND
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
          <Pagination
            current={current}
            pageSize={6}
            onChange={onChange}
            showSizeChanger={false}
            style={{ textAlign: 'center', marginTop: '20px' }}
            className="custom-pagination"
          />
        </Layout>
      </Layout>

      <Title level={2} style={{ textAlign: 'center' }}>
        Sản phẩm gợi ý
      </Title>
      <Row gutter={[16, 16]} justify="center">
        {products.slice(0, 4).map((product, index) => (
          <Col xs={24} sm={12} md={6} lg={6} key={index}>
            <Card
              hoverable
              cover={
                <div
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <HeartOutlined
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      fontSize: '20px',
                      color: '#000',
                      zIndex: 2,
                    }}
                  />
                  <Image
                    src={product.image}
                    preview={false}
                    style={{
                      height: '280px',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {hoveredIndex === index && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-around',
                        background: 'rgba(0, 0, 0, 0.7)',
                        padding: '10px',
                        transition: 'opacity 0.3s ease',
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
                        style={{
                          backgroundColor: '#555',
                          color: 'white',
                          border: 'none',
                        }}
                      >
                        Tùy chọn
                      </Button>
                    </div>
                  )}
                </div>
              }
              style={{ textAlign: 'center' }}
            >
              <Text type="secondary">{product.brand}</Text>
              <Title level={5}>{product.name}</Title>
              <Text strong style={{ color: '#3C6255' }}>
                {getMinPrice(product.skus)?.toLocaleString() ?? 'Liên hệ'} VND
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default ProductPage
