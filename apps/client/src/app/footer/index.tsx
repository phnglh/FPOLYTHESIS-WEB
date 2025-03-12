import { Input, Button } from 'antd'
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-lg font-semibold mb-3">
            Nhận thông tin khuyến mãi từ chúng tôi
          </p>
          <div className="flex p-2 rounded-lg">
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 border-none px-4 py-2 rounded-l-lg"
            />
            <Button className="bg-white font-semibold px-4 rounded-r-lg">
              Gửi
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-green-400">Flames </span>
          </h2>
          <p className="text-sm mt-2">
            CỬA HÀNG PHÂN PHỐI ĐỒ THỂ THAO CHÍNH HÃNG
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <EnvironmentOutlined /> Tầng 6, Tòa Ladeco, 266 Đội Cấn, Ba Đình,
              Hà Nội
            </p>
            <p className="flex items-center gap-2">
              <PhoneOutlined /> 1800.6750
            </p>
            <p className="flex items-center gap-2">
              <MailOutlined /> support@sapo.vn
            </p>
            <p>@oh_thethao_fashion</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold">Về chúng tôi</h3>
            <ul className="mt-2 space-y-1">
              <li>Trang chủ</li>
              <li>Giới thiệu</li>
              <li>Sản phẩm</li>
              <li>Hệ thống cửa hàng</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Chính sách</h3>
            <ul className="mt-2 space-y-1">
              <li>Chính sách đối tác</li>
              <li>Chính sách đổi trả</li>
              <li>Chính sách thanh toán</li>
              <li>Chính sách giao hàng</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-6 border-t border-gray-700 pt-6 grid grid-cols-1 md:grid-cols-3 text-sm">
        <div>
          <h3 className="font-semibold">Tư vấn khách hàng</h3>
          <p>
            Mua hàng <span className="font-bold">1800.6750</span>
          </p>
          <p>
            Bảo hành <span className="font-bold">1800.6750</span>
          </p>
          <p>
            Kiếu nại <span className="font-bold">1800.6750</span>
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Hình thức thanh toán</h3>
          <div className="flex gap-2 mt-2">
            <img src="/zalo-pay.png" alt="ZaloPay" className="w-10" />
            <img src="/visa.png" alt="Visa" className="w-10" />
            <img src="/mastercard.png" alt="Mastercard" className="w-10" />
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Mua qua sàn TMĐT</h3>
          <div className="flex gap-2 mt-2">
            <img src="/shopee.png" alt="Shopee" className="w-10" />
            <img src="/lazada.png" alt="Lazada" className="w-10" />
            <img src="/tiki.png" alt="Tiki" className="w-10" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
