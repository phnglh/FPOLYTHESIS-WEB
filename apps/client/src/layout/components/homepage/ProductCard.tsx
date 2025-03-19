import { Card, Button } from 'antd'
import { HeartOutlined } from '@ant-design/icons'

export const ProductCard = ({ product }) => {
  return (
    <Card hoverable className="p-4 w-full max-w-sm mx-auto">
      <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
        <div className="relative w-40 md:w-1/4">
          {product.discount && (
            <div className="absolute top-2 left-2 z-10 bg-red-500 text-white p-1 text-xs rounded">
              -{product.discount}%
            </div>
          )}
          <img
            src="https://i.pinimg.com/736x/65/31/d0/6531d0729fff36015d278628fbeb414d.jpg"
            alt={product.name}
            className="w-40 h-40 object-cover rounded-lg"
          />
          <div className="flex gap-1 mt-2">
            {product.extraImages.slice(0, 2).map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Extra"
                className="w-8 h-8 rounded-md border"
              />
            ))}
            {product.extraImages.length > 2 && (
              <span className="text-xs text-gray-500">
                +{product.extraImages.length - 2}
              </span>
            )}
          </div>
        </div>

        <div className="w-full md:w-3/4 text-center md:text-left">
          <div className="flex justify-between w-full">
            <span className="text-sm text-gray-500">{product.brand}</span>
            <HeartOutlined className="text-gray-400 cursor-pointer" />
          </div>
          <h3 className="text-base md:text-lg font-semibold leading-tight">
            {product.name}
          </h3>
          <div className="text-red-600 text-lg font-bold">
            {product.price.toLocaleString()}đ{' '}
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-sm">
                {product.oldPrice.toLocaleString()}đ
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs md:text-sm">Hết ưu đãi</p>
          <div className="flex gap-2 mt-2 justify-center md:justify-start flex-wrap">
            <Button className="border-green-600 text-green-600 px-3 text-sm">
              Xem chi tiết
            </Button>
            <Button
              type="primary"
              className="bg-green-700 border-green-700 px-3 text-sm"
            >
              Tùy chọn
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
