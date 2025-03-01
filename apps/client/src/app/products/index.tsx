import { useState } from 'react'
import { Input, Card, Select, Slider } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const { Option } = Select

// Fake dữ liệu sản phẩm
const products = [
  { id: 1, name: 'Áo Thun Nam', price: 200000, category: 'Áo' },
  { id: 2, name: 'Quần Jeans', price: 500000, category: 'Quần' },
  { id: 3, name: 'Giày Sneaker', price: 1000000, category: 'Giày' },
  { id: 4, name: 'Túi Xách', price: 700000, category: 'Phụ kiện' },
]

export default function ProductPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [price, setPrice] = useState([0, 2000000])

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === 'all' || product.category === category) &&
      product.price >= price[0] &&
      product.price <= price[1]
    )
  })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />
        <Select
          className="w-full md:w-1/4"
          value={category}
          onChange={setCategory}
        >
          <Option value="all">Tất cả danh mục</Option>
          <Option value="Áo">Áo</Option>
          <Option value="Quần">Quần</Option>
          <Option value="Giày">Giày</Option>
          <Option value="Phụ kiện">Phụ kiện</Option>
        </Select>
        <Slider
          range
          max={2000000}
          defaultValue={[0, 2000000]}
          onChange={setPrice}
          className="w-full md:w-1/3"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} title={product.name} className="shadow-lg">
            <p className="text-gray-600">
              Giá: {product.price.toLocaleString()} VND
            </p>
            <p className="text-gray-400">Danh mục: {product.category}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
