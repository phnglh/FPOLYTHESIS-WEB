import { useState } from 'react'
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
} from 'antd'

import { HeartOutlined } from '@ant-design/icons'
import { useProductList } from '@hooks/useProductQuery'
import { Link } from 'react-router'
import { toast } from 'react-toastify'
import { addToCart, updateCart } from '@store/slices/cartSlice'
import { AppDispatch, store } from '@store/store'
import { useDispatch } from 'react-redux'

const { Title, Text } = Typography

const { Sider } = Layout
const { Panel } = Collapse

const FilterSection = ({ title, options, selected, setSelected }) => (
  <div className="mt-3">
    <h4 className="font-bold mb-2 text-black text-left">{title}</h4>
    <Checkbox.Group value={selected} onChange={setSelected}>
      {options.map((option) => (
        <Checkbox key={option} value={option}>
          {option}
        </Checkbox>
      ))}
    </Checkbox.Group>
  </div>
)

const ProductPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data, error, isLoading } = useProductList()
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])

  const handleSizeChange = (size: string, checked: boolean) => {
    setSelectedPrices((prevPrices) =>
      checked ? [...prevPrices, size] : prevPrices.filter((s) => s !== size),
    )
  }

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const categories = [
    {
      title: 'Áo thể thao',
      items: ['Áo thun thể thao', 'Áo ba lỗ', 'Áo giữ nhiệt'],
    },
    {
      title: 'Quần thể thao',
      items: [
        'Quần dài tập luyện',
        'Quần legging thể thao',
        'Quần jogger thể thao',
        'Quần shorts thể thao',
      ],
    },
  ]

  const priceFilters = [
    'Dưới 1 triệu',
    'Từ 1 triệu - 2 triệu',
    'Từ 2 triệu - 3 triệu',
    'Từ 3 triệu - 5 triệu',
    'Trên 5 triệu',
  ]
  const brands = [
    'Adidas',
    'Armour',
    'Converse',
    'Descente',
    'Jacquard Training',
    'Kipsta',
    'Motorsport',
  ]
  const productTypes = [
    'Áo ba lỗ',
    'Áo giữ nhiệt',
    'Áo tay dài',
    'Áo thun',
    'Băng đeo tay',
    'Bình nước',
    'Găng tay',
  ]
  const colors = [
    '#000',
    '#fff',
    '#1e90ff',
    '#dc143c',
    '#ffd700',
    '#ff69b4',
    '#8a2be2',
    '#808080',
  ]
  const genders = ['Nam', 'Nữ', 'Unisex', 'Bé trai', 'Bé gái']
  const sizes = [
    '35',
    '35.5',
    '36',
    '36.5',
    '37',
    '37.5',
    '38',
    '38.5',
    '39',
    '39.5',
    '40',
    '40.5',
    '41',
    '41.5',
    '42',
    '42.5',
  ]

  const handleAddToCart = async (productId, quantity) => {
    console.log('Thêm vào giỏ hàng:', productId)
    try {
      await dispatch(addToCart({ product_id: productId, quantity }))
      toast.success('Thêm vào giỏ hàng thành công')
    } catch (error) {
      toast.error('Thêm vào giỏ hàng thất bại')
    }
  }

  return (
    <Layout style={{ margin: '0 200px', padding: '10px' }}>
      <Sider
        width={350}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '5px',
          padding: '20px',
          height: 'calc(100vh - 20px)',
        }}
      >
        <Title level={3} className="text-center">
          Danh mục sản phẩm
        </Title>
        <Collapse accordion className="bg-transparent">
          {categories.map((category, index) => (
            <Panel header={category.title} key={index} className="text-left">
              <div className="flex flex-col gap-2">
                {category.items.map((item, idx) => (
                  <p key={idx}>{item}</p>
                ))}
              </div>
            </Panel>
          ))}
        </Collapse>

        <h3 className="text-white text-lg font-bold p-3 bg-green-800 text-center rounded mt-6">
          Bộ lọc sản phẩm
        </h3>
        {selectedPrices.length > 0 && (
          <div className="mb-3">
            <strong>Bạn chọn:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedPrices.map((item) => (
                <Tag
                  key={item}
                  closable
                  color="green"
                  onClose={() =>
                    setSelectedPrices(selectedPrices.filter((i) => i !== item))
                  }
                >
                  {item}
                </Tag>
              ))}
            </div>
            <span
              className="text-red-500 cursor-pointer font-bold block mt-2"
              onClick={() => setSelectedPrices([])}
            >
              Bỏ hết
            </span>
          </div>
        )}

        <FilterSection
          title="Chọn khoảng giá"
          options={priceFilters}
          selected={selectedPrices}
          setSelected={setSelectedPrices}
        />
        <FilterSection
          title="Thương hiệu"
          options={brands}
          selected={selectedPrices}
          setSelected={setSelectedPrices}
        />
        <FilterSection
          title="Loại sản phẩm"
          options={productTypes}
          selected={selectedPrices}
          setSelected={setSelectedPrices}
        />
        <FilterSection
          title="Giới tính"
          options={genders}
          selected={selectedPrices}
          setSelected={setSelectedPrices}
        />

        <h4 className="font-bold mb-2 text-black text-left mt-4">Màu sắc</h4>
        <div className="flex gap-2 flex-wrap">
          {colors.map((color) => (
            <div
              key={color}
              className="w-5 h-5 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>

        <h4 className="font-bold mb-2 text-black text-left mt-4">Kích thước</h4>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((size) => (
            <Checkbox
              key={size}
              value={size}
              onChange={(e) => handleSizeChange(size, e.target.checked)}
            >
              {size}
            </Checkbox>
          ))}
        </div>
      </Sider>
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
            <Title
              level={2}
              style={{ alignItems: 'center', textAlign: 'center' }}
            >
              Tất cả sản phẩm
            </Title>
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
        <Row
          gutter={[30, 30]}
          justify="center"
          style={{ padding: '20px 20px' }}
        >
          {data?.slice(0, 9).map((product, index) => (
            <Col xs={24} sm={12} md={8} lg={8} key={index}>
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
                      src={product.image_url}
                      preview={false}
                      style={{
                        width: '100%',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                      }}
                    />
                    {hoveredIndex === index && (
                      <div className="absolute bottom-0 w-full flex bg-black/70 transition-opacity duration-300">
                        <Button
                          style={{
                            backgroundColor: '#A4C49E',
                            color: 'white',
                            border: 'none',
                            flex: 1,
                            borderRadius: '0',
                          }}
                        >
                          <Link
                            to={`/products/${product.id}`}
                            style={{ color: 'white', textDecoration: 'none' }}
                          >
                            Xem chi tiết
                          </Link>
                        </Button>
                        <Button
                          style={{
                            backgroundColor: '#3C6255',
                            color: 'white',
                            border: 'none',
                            flex: 1,
                            borderRadius: '0',
                          }}
                          onClick={() => handleAddToCart(product.id, 1)}
                        >
                          Thêm vào giỏ hàng
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
                <Text type="secondary">{product.category_name}</Text>
                <Title
                  level={5}
                  style={{
                    marginTop: '5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {product.name}
                </Title>

                <Text strong style={{ fontSize: '16px', color: '#D92D20' }}>
                  {product.price} VND
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Layout>
    </Layout>
  )
}

export default ProductPage
