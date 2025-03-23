import { useEffect, useState } from 'react'
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

import { useProductList } from '@hooks/useProductQuery'
import { addToCart, fetchCart } from '@store/slices/cartSlice'
import { AppDispatch } from '@store/store'
import { useDispatch } from 'react-redux'
import { Sku } from '#types/products'

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
  const { data } = useProductList()
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])

  const handleSizeChange = (size: string, checked: boolean) => {
    setSelectedPrices((prevPrices) =>
      checked ? [...prevPrices, size] : prevPrices.filter((s) => s !== size),
    )
  }

  const [selectedSkus, setSelectedSkus] = useState<{ [key: string]: any }>({})

  const handleSelectSku = (productId: string, sku: Sku) => {
    setSelectedSkus((prev) => ({
      ...prev,
      [productId]: sku,
    }))
  }

  const handleAddToCart = (productId: string) => {
    const selectedSku = selectedSkus[productId]
    if (!selectedSku)
      return alert('Vui lòng chọn phiên bản trước khi thêm vào giỏ hàng')

    dispatch(addToCart({ sku_id: selectedSku.id, quantity: 1 }))
      .unwrap()
      .then(() => {
        dispatch(fetchCart())
      })
  }

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
      <Layout style={{ margin: '0 200px', padding: '10px' }}>
        <Row gutter={[30, 30]} justify="center" style={{ padding: '20px' }}>
          {data?.map((product) => (
            <Col xs={24} sm={12} md={8} lg={8} key={product.id}>
              <Card
                hoverable
                cover={
                  <Image
                    src={product.image_url}
                    preview={false}
                    style={{
                      width: '100%',
                      borderTopLeftRadius: '10px',
                      borderTopRightRadius: '10px',
                    }}
                  />
                }
                style={{
                  textAlign: 'center',
                  borderRadius: '10px',
                  minHeight: '420px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Title
                  level={5}
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {product.name}
                </Title>

                <Text strong style={{ fontSize: '16px', color: '#D92D20' }}>
                  {selectedSkus[product.id]?.price || 'Chọn phiên bản'} VND
                </Text>

                <Select
                  placeholder="Chọn kích thước & màu sắc"
                  style={{ width: '100%', marginTop: 10 }}
                  onChange={(skuId) => {
                    const selected = product.skus.find((s) => s.id === skuId)
                    handleSelectSku(product.id, selected)
                  }}
                >
                  {product.skus.map((sku) => (
                    <Select.Option key={sku.id} value={sku.id}>
                      {sku.attributes.map((attr) => attr.value).join(' - ')}
                    </Select.Option>
                  ))}
                </Select>

                {/* Nút thêm vào giỏ hàng */}
                <Button
                  type="primary"
                  onClick={() => handleAddToCart(product.id)}
                  style={{ marginTop: '10px' }}
                  disabled={!selectedSkus[product.id]}
                >
                  Thêm vào giỏ hàng
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Layout>
    </Layout>
  )
}

export default ProductPage
