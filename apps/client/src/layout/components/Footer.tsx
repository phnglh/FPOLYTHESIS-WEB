import { Input, Button } from 'antd'
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Đăng ký nhận khuyến mãi */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Nhận thông tin khuyến mãi
          </h3>
          <div className="flex gap-4">
            <Input type="email" size="large" placeholder="Nhập email của bạn" />
            <Button size="large">Gửi</Button>
          </div>
        </div>

        {/* Thông tin cửa hàng */}
        <div className="text-center">
          <img
            src="/assets/images/logo/logo.png"
            alt="Flames Logo"
            className="h-16 mx-auto mb-3"
          />
          <p className="text-sm">CỬA HÀNG PHÂN PHỐI ĐỒ THỂ THAO CHÍNH HÃNG</p>
          <div className="mt-4 text-sm space-y-2">
            <p className="flex items-center justify-center gap-2">
              <EnvironmentOutlined /> Tầng 6, Tòa Ladeco, 266 Đội Cấn, Ba Đình,
              Hà Nội
            </p>
            <p className="flex items-center justify-center gap-2">
              <PhoneOutlined /> 1800.6750
            </p>
            <p className="flex items-center justify-center gap-2">
              <MailOutlined /> support@sapo.vn
            </p>
          </div>
        </div>

        {/* Liên kết nhanh */}
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Về chúng tôi</h3>
            <ul className="space-y-1">
              <li>Trang chủ</li>
              <li>Giới thiệu</li>
              <li>Sản phẩm</li>
              <li>Hệ thống cửa hàng</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Chính sách</h3>
            <ul className="space-y-1">
              <li>Chính sách đối tác</li>
              <li>Chính sách đổi trả</li>
              <li>Chính sách thanh toán</li>
              <li>Chính sách giao hàng</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Tư vấn khách hàng</h3>
            <ul className="space-y-1">
              <li>
                Mua hàng: <strong>1800.6750</strong>
              </li>
              <li>
                Bảo hành: <strong>1800.6750</strong>
              </li>
              <li>
                Kiếu nại: <strong>1800.6750</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
