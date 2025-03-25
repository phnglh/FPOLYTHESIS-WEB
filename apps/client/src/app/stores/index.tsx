import { useState } from 'react'
import { Select, Card, List, Typography, Space } from 'antd'
import { EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

const branches = [
  {
    name: 'TRỤ SỞ HÀ NỘI',
    address: 'Tầng 6, Tòa Ladeco, 266 Đội Cấn, Ba Đình, Hà Nội',
    phone: '1900 6750',
    district: 'Ba Đình',
  },
  {
    name: 'CHI NHÁNH CẦU GIẤY',
    address: '136 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    phone: '0943521821',
    district: 'Cầu Giấy',
  },
  {
    name: 'CHI NHÁNH HÀ ĐÔNG',
    address: '39 Nguyễn Viết Xuân, P. Quang Trung, Hà Đông, Hà Nội',
    phone: '0965464212',
    district: 'Hà Đông',
  },
  {
    name: 'CHI NHÁNH BẮC',
    address: '3PGH+8R9, ĐT70A, thôn Trung, Nam Từ Liêm, Hà Nội',
    phone: '0987654321',
    district: 'Nam Từ Liêm',
  },
  {
    name: 'CHI NHÁNH NAM',
    address: '20 Ng. 322 Đ. Mỹ Đình, Nhân Mỹ, Nam Từ Liêm, Hà Nội',
    phone: '0956213211',
    district: 'Nam Từ Liêm',
  },
]

const StoresPage = () => {
  const [selectedCity, setSelectedCity] = useState('Hà Nội')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const filteredBranches = branches.filter(
    (branch) => !selectedDistrict || branch.district === selectedDistrict,
  )

  return (
    <Space direction="vertical" style={{ width: '100%', padding: '50px 10%' }}>
      <Title level={3} style={{ textAlign: 'center' }}>
        HỆ THỐNG CỬA HÀNG CHÚNG TÔI TRÊN TOÀN QUỐC
      </Title>

      <Space style={{ width: '100%', justifyContent: 'center' }}>
        <Select defaultValue={selectedCity} style={{ width: 480 }} disabled>
          <Option value="Hà Nội">Hà Nội</Option>
        </Select>
        <Select
          placeholder="Chọn Quận/Huyện"
          style={{ width: 700 }}
          onChange={(value) => setSelectedDistrict(value)}
          allowClear
        >
          <Option value="Ba Đình">Ba Đình</Option>
          <Option value="Cầu Giấy">Cầu Giấy</Option>
          <Option value="Hà Đông">Hà Đông</Option>
          <Option value="Nam Từ Liêm">Nam Từ Liêm</Option>
        </Select>
      </Space>

      <Space align="start" style={{ width: '100%', justifyContent: 'center' }}>
        <Card
          style={{
            width: 350,
            height: 450,
            backgroundColor: '#f8fff4',
            overflowY: 'auto',
          }}
        >
          <List
            dataSource={filteredBranches}
            renderItem={(branch) => (
              <List.Item>
                <Space direction="vertical">
                  <Text>{branch.name}</Text>
                  <Space>
                    <EnvironmentOutlined style={{ color: 'red' }} />
                    <Text>{branch.address}</Text>
                  </Space>
                  <Space>
                    <PhoneOutlined style={{ color: 'blue' }} />
                    <Text>{branch.phone}</Text>
                  </Space>
                </Space>
              </List.Item>
            )}
          />
        </Card>

        <Card style={{ flex: 1, height: 450, textAlign: 'center' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6901015254055!2d105.80812311540209!3d21.00565619397847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abafa90ea5b5%3A0xb1cf8a7f1ff5f0f!2sH%C3%A0%20N%E1%BB%99i%2C%20Vietnam!5e0!3m2!1sen!2s!4v1618561572064!5m2!1sen!2s"
            width="800px"
            height="420px"
            style={{ border: 0, borderRadius: '8px' }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </Card>
      </Space>
    </Space>
  )
}

export default StoresPage
