// ProductPage.jsx
import { Layout, Menu, Card, Checkbox, Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Link } from 'react-router'

const { Sider } = Layout
const { Meta } = Card

export default function ProductPage() {
  const products = [
    {
      id: 1,
      name: 'ÁO LÓT GIỮ NHIỆT ĐÁ BÓNG',
      brand: 'Kipsta',
      price: '395.000₫',
      img: '/img1.jpg',
    },
    {
      id: 2,
      name: 'ÁO GIỮ NHIỆT NAM - ÁO THUN TẬP',
      brand: 'Underwear',
      price: '200.000₫',
      img: '/img2.jpg',
    },
    // ... các sản phẩm khác
  ]

  return (
    <Layout className="max-w-[1152px] mx-auto p-4 bg-white">
      <Sider
        style={{ background: 'white' }}
        width={250}
        className="bg-white border-r p-4"
      >
        <h2 className="text-lg font-bold bg-green-700 text-white p-3 rounded-md">
          Danh mục sản phẩm
        </h2>
        <Menu mode="vertical" className="border-none">
          <Menu.SubMenu title="Áo thể thao" />
          <Menu.SubMenu title="Quần thể thao" />
          <Menu.SubMenu title="Giày thể thao" />
          <Menu.SubMenu title="Phụ kiện thể thao" />
        </Menu>

        <h2 className="text-lg font-bold bg-green-700 text-white p-3 rounded-md mt-4">
          Bộ lọc sản phẩm
        </h2>
        <div className="bg-gray-100 p-3 rounded-md">
          <h3 className="font-semibold">Chọn khoảng giá</h3>
          {[
            'Dưới 1 triệu',
            '1-2 triệu',
            '2-3 triệu',
            '3-5 triệu',
            'Trên 5 triệu',
          ].map((price, index) => (
            <Checkbox key={index} className="block">
              {price}
            </Checkbox>
          ))}

          <h3 className="font-semibold mt-4">Thương hiệu</h3>
          {[
            'Adidas',
            'Armour',
            'Converse',
            'Descente',
            'Jacquard Training',
            'Kipsta',
            'Motorsport',
          ].map((brand, index) => (
            <Checkbox key={index} className="block">
              {brand}
            </Checkbox>
          ))}
        </div>
      </Sider>

      <Layout className="flex-1 p-4">
        <div className="flex justify-between items-center bg-green-700 text-white p-3 rounded-md">
          <h2 className="text-lg font-bold">Tất cả sản phẩm</h2>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>Giá thấp đến cao</Menu.Item>
                <Menu.Item>Giá cao đến thấp</Menu.Item>
              </Menu>
            }
          >
            <a className="flex items-center">
              Mặc định <DownOutlined className="ml-2" />
            </a>
          </Dropdown>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {products.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id}>
              <Card
                cover={
                  <img
                    alt={product.name}
                    src={product.img}
                    className="h-48 w-full object-cover"
                  />
                }
                hoverable
              >
                <Meta
                  title={
                    <span className="text-green-800 font-semibold">
                      {product.brand}
                    </span>
                  }
                  description={product.name}
                />
                <p className="text-green-700 font-bold mt-2">{product.price}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Layout>
    </Layout>
  )
}
