import { Input, Button } from 'antd'
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import { Row, Col } from 'antd'
import Logo from '../images/logo.flames2.png'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 mt-10">
      <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <article>
          <p className="text-lg font-semibold mb-3 ml-2">
            Nhận thông tin khuyến mãi từ chúng tôi
          </p>
          <form className="flex p-2 rounded-lg mr-6">
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 border-none px-4 py-2 rounded-l-lg"
            />
            <Button className="bg-white font-semibold px-4 rounded-r-lg">
              Gửi
            </Button>
          </form>
        </article>

        <article>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <img
              src={Logo}
              alt="Flames Logo"
              className="h-8 w-auto"
              style={{ height: '70px', width: '70px' }}
            />
          </h2>
          <p className="text-sm mt-2">
            CỬA HÀNG PHÂN PHỐI ĐỒ THỂ THAO CHÍNH HÃNG
          </p>
          <address className="mt-4 space-y-2 text-sm">
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
          </address>
        </article>

        <nav className="grid grid-cols-3 gap-4 text-sm">
          <section>
            <h3 className="font-semibold">Về chúng tôi</h3>
            <ul className="mt-2 space-y-1">
              <li>Trang chủ</li>
              <li>Giới thiệu</li>
              <li>Sản phẩm</li>
              <li>Hệ thống cửa hàng</li>
            </ul>
          </section>
          <section>
            <h3 className="font-semibold">Chính sách</h3>
            <ul className="mt-2 space-y-1">
              <li>Chính sách đối tác</li>
              <li>Chính sách đổi trả</li>
              <li>Chính sách thanh toán</li>
              <li>Chính sách giao hàng</li>
            </ul>
          </section>
          <section>
            <h3 className="font-semibold">Tư vấn khách hàng</h3>
            <ul className="mt-2 space-y-1">
              <li>
                Mua hàng <span className="font-bold">1800.6750</span>
              </li>
              <li>
                Bảo hành <span className="font-bold">1800.6750</span>
              </li>
              <li>
                Kiếu nại <span className="font-bold">1800.6750</span>
              </li>
            </ul>
          </section>
        </nav>
      </section>

      <section className="container mx-auto px-6 mt-6 border-t border-gray-700 pt-6 flex flex-wrap justify-center">
        <article className="text-center mx-4">
          <h3 className="font-semibold mb-2">Hình thức thanh toán</h3>
          <Row gutter={[8, 8]}>
            {['Mastercard', 'ZaloPay', 'Visa', 'JCB'].map((item, index) => (
              <Col key={index}>
                <img
                  src={`https://example.com/${item.toLowerCase()}.png`}
                  alt={item}
                  className="w-[68px] h-[48px] object-contain"
                />
              </Col>
            ))}
          </Row>
        </article>
        <article className="text-center mx-4">
          <h3 className="font-semibold mb-2">Mua qua sàn TMĐT</h3>
          <Row gutter={[8, 8]}>
            {['Lazada', 'Sendo', 'Shopee', 'Tiki'].map((item, index) => (
              <Col key={index}>
                <img
                  src={`https://example.com/${item.toLowerCase()}.svg`}
                  alt={item}
                  className="w-12 h-12 object-contain"
                />
              </Col>
            ))}
          </Row>
        </article>
      </section>
    </footer>
  )
}

export default Footer
