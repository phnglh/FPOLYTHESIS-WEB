import { Layout } from 'antd'
import { useParams } from 'react-router'

export default function ProductDetails() {
  const { productId } = useParams()

  console.log(productId)
  return (
    <Layout className="max-w-[1152px] mx-auto p-4 bg-white">
      <div className="flex">
        <div className="w-1/2">
          <img src="/img1.jpg" alt="product" />
        </div>
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold">ÁO LÓT GIỮ NHIỆT ĐÁ BÓNG</h2>
          <p className="text-lg font-semibold">Kipsta</p>
          <p className="text-lg font-semibold">395.000₫</p>
          <button className="bg-green-700 text-white p-2 rounded-md">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </Layout>
  )
}
