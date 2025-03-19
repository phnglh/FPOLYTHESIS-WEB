import { useState } from 'react'
import { Select, Card, List } from 'antd'
import { EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons'

const { Option } = Select

const branches = [
  {
    name: 'TRỤ SỞ HÀ NỘI',
    address: 'Tầng 6, Tòa Ladeco, 266 Đội Cấn, Quận Ba Đình, TP Hà Nội',
    phone: '1900 6750',
  },
  {
    name: 'CHI NHÁNH CẦU GIẤY',
    address: '136 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    phone: '0943521821',
  },
  {
    name: 'CHI NHÁNH HÀ ĐÔNG',
    address: '39 P. Nguyễn Viết Xuân, P. Quang Trung, Hà Đông, Hà Nội',
    phone: '0965464212',
  },
  {
    name: 'CHI NHÁNH BẮC',
    address: '3PGH+8R9, ĐT70A, thôn Trung, Nam Từ Liêm, Hà Nội, Việt Nam',
    phone: '0987654321',
  },
  {
    name: 'CHI NHÁNH NAM',
    address: '20 Ng. 322 Đ. Mỹ Đình, Nhân Mỹ, Nam Từ Liêm, Hà Nội',
    phone: '0956213211',
  },
]

const StoresPage = () => {
  const [selectedCity, setSelectedCity] = useState('Hà Nội')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <h2 style={{ textAlign: 'left', color: 'black', fontSize: '30px' }}>
        Hệ thống cửa hàng trên toàn quốc
      </h2>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ width: '350px' }}>
          <Select
            defaultValue={selectedCity}
            style={{ width: '100%', marginBottom: 16 }}
          >
            <Option value="Hà Nội">Hà Nội</Option>
          </Select>
          <Select
            placeholder="Chọn Quận/Huyện"
            style={{ width: '100%', marginBottom: 16 }}
          >
            <Option value="Ba Đình">Ba Đình</Option>
            <Option value="Cầu Giấy">Cầu Giấy</Option>
            <Option value="Hà Đông">Hà Đông</Option>
            <Option value="Nam Từ Liêm">Nam Từ Liêm</Option>
          </Select>
          <Card>
            <List
              dataSource={branches}
              renderItem={(branch) => (
                <List.Item style={{ textAlign: 'left' }}>
                  <div>
                    <strong>
                      <strong style={{ marginRight: 8 }} />
                      {branch.name}
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <EnvironmentOutlined
                        style={{ marginRight: 8, flexShrink: 0 }}
                      />
                      <p style={{ margin: 0 }}>{branch.address}</p>
                    </div>
                    <p>
                      <PhoneOutlined style={{ marginRight: 8 }} />
                      {branch.phone}
                    </p>
                  </div>
                </List.Item>
              )}
              style={{ maxHeight: '300px', overflowY: 'auto' }}
            />
          </Card>
        </div>
        <div style={{ flex: 1 }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6901015254055!2d105.80812311540209!3d21.00565619397847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abafa90ea5b5%3A0xb1cf8a7f1ff5f0f!2sH%C3%A0%20N%E1%BB%99i%2C%20Vietnam!5e0!3m2!1sen!2s!4v1618561572064!5m2!1sen!2s"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default StoresPage
