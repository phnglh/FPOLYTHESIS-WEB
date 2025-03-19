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
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-lg font-semibold mb-3 ml-2">
            Nhận thông tin khuyến mãi từ chúng tôi
          </p>
          <div className="flex p-2 rounded-lg mr-6">
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
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <img
                src={Logo}
                alt="Flames Logo"
                className="h-8 w-auto"
                style={{ height: '70px', width: '70px' }}
              />
            </h2>
          </div>
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

        <div className="grid grid-cols-3 gap-4 text-sm ">
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

          <div>
            <h3 className="font-semibold">Tư vấn khách hàng</h3>
            <ul className="mt-2 space-y-1">
              <li>
                {' '}
                Mua hàng <span className="font-bold">1800.6750</span>
              </li>
              <li>
                {' '}
                Bảo hành <span className="font-bold">1800.6750</span>
              </li>
              <li>
                {' '}
                Kiếu nại <span className="font-bold">1800.6750</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-6 border-t border-gray-700 pt-6">
        <Row
          gutter={[16, 16]}
          justify="start"
          align="top"
          style={{ marginLeft: '500px' }}
        >
          {/* Hình thức thanh toán */}
          <Col xs={24} sm={12} md={8}>
            <h3 className="font-semibold mb-2">Hình thức thanh toán</h3>
            <Row gutter={[8, 8]}>
              <Col>
                <img
                  src="https://logos-world.net/wp-content/uploads/2020/09/Mastercard-Logo-2016-2020.png"
                  alt="Mastercard"
                  className="w-[68px] h-[48px] object-contain"
                />
              </Col>
              <Col>
                <img
                  src="https://vectorseek.com/wp-content/uploads/2023/09/Zalopay-Logo-Vector.svg-.png"
                  alt="ZaloPay"
                  className="w-[68px] h-[48px] object-contain"
                />
              </Col>
              <Col>
                <img
                  src="https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo-2014-present.jpg"
                  alt="Visa"
                  className="w-[68px] h-[48px] object-contain"
                />
              </Col>
              <Col>
                <img
                  src="https://lofrev.net/wp-content/photos/2014/08/JCB-Logo-3D.jpg"
                  alt="JCB"
                  className="w-[68px] h-[48px] object-contain"
                />
              </Col>
            </Row>
          </Col>

          {/* Mua qua sàn TMĐT */}
          <Col xs={24} sm={12} md={8} style={{ marginLeft: '170px' }}>
            <h3 className="font-semibold mb-2">Mua qua sàn TMĐT</h3>
            <Row gutter={[8, 8]}>
              <Col>
                <img
                  src="https://bizweb.dktcdn.net/100/494/200/themes/918976/assets/lazada.svg?1721817765499"
                  alt="Lazada"
                  className="w-12 h-12 object-contain"
                />
              </Col>
              <Col>
                <img
                  src="https://bizweb.dktcdn.net/100/494/200/themes/918976/assets/sendo.svg?1721817765499"
                  alt="Sendo"
                  className="w-12 h-12 object-contain"
                />
              </Col>
              <Col>
                <img
                  src="https://bizweb.dktcdn.net/100/494/200/themes/918976/assets/shopee.svg?1721817765499"
                  alt="Shopee"
                  className="w-12 h-12 object-contain"
                />
              </Col>
              <Col>
                <img
                  src="https://bizweb.dktcdn.net/100/494/200/themes/918976/assets/tiki.svg?1721817765499"
                  alt="Tiki"
                  className="w-12 h-12 object-contain"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </footer>
  )
}

export default Footer
