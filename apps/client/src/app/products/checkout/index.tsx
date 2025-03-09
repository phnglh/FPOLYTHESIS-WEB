import React from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  Radio,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Badge,
} from 'antd'

const { Title, Text } = Typography
const { Option } = Select

const CheckoutPage = () => {
  return (
    <Row gutter={[16, 16]}>
      {/* Thông tin nhận hàng */}
      <Col xs={24} md={14}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 16,
            justifyContent: 'space-between',
          }}
        >
          <Title level={2}>Thông tin nhận hàng</Title>
          <Button type="link">Đăng nhập</Button>
        </div>
        <Card>
          <Form layout="vertical">
            <Form.Item label="Email">
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item label="Họ và tên">
              <Input placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item label="Số điện thoại (tùy chọn)">
              <Input placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item label="Địa chỉ (tùy chọn)">
              <Input placeholder="Địa chỉ" />
            </Form.Item>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item label="Tỉnh thành">
                  <Select placeholder="---">
                    <Option value="hcm">Hồ Chí Minh</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Quận huyện (tùy chọn)">
                  <Select placeholder="Quận huyện" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Phường xã (tùy chọn)">
                  <Select placeholder="Phường xã" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Ghi chú (tùy chọn)">
              <Input.TextArea placeholder="Ghi chú" />
            </Form.Item>
          </Form>
        </Card>
      </Col>
      {/* Vận chuyển & Thanh toán */}
      <Col xs={24} md={10}>
        <Card title="Vận chuyển">
          <Button block>Vui lòng nhập thông tin giao hàng</Button>
        </Card>
        <Card title="Thanh toán" style={{ marginTop: 16 }}>
          <Radio.Group>
            <Radio value="bank">Chuyển khoản</Radio>
            <Radio value="cod">Thu hộ (COD)</Radio>
          </Radio.Group>
        </Card>
      </Col>
      {/* Đơn hàng */}
      <Col xs={24}>
        <Card title="Đơn hàng (6 sản phẩm)">
          {[
            {
              name: 'Áo lót giữ nhiệt đá bóng Keepdry cho người lớn',
              size: 'XL',
              price: '395.000₫',
              quantity: 1,
              image: '/images/product1.jpg',
            },
            {
              name: 'Áo giữ nhiệt nam - Áo thun tập GYM',
              size: 'S',
              price: '200.000₫',
              quantity: 2,
              image: '/images/product2.jpg',
            },
          ].map((item, index) => (
            <Row gutter={[8, 8]} align="middle" key={index}>
              <Col span={4} style={{ position: 'relative' }}>
                <Badge count={item.quantity} offset={[-5, 5]}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%' }}
                  />
                </Badge>
              </Col>
              <Col span={16}>
                <Text>{item.name}</Text>
                <br />
                <Text type="secondary">Size: {item.size}</Text>
              </Col>
              <Col span={4}>
                <Text strong>{item.price}</Text>
              </Col>
            </Row>
          ))}
          <Divider />
          <Form layout="inline" style={{ marginBottom: 16 }}>
            <Form.Item>
              <Input placeholder="Nhập mã giảm giá" />
            </Form.Item>
            <Form.Item>
              <Button type="primary">Áp dụng</Button>
            </Form.Item>
          </Form>
          <Row justify="space-between">
            <Col>
              <Text>Tạm tính</Text>
            </Col>
            <Col>
              <Text strong>2.175.000₫</Text>
            </Col>
          </Row>
          <Row justify="space-between" style={{ marginTop: 8 }}>
            <Col>
              <Text>Tổng cộng</Text>
            </Col>
            <Col>
              <Title level={3} type="success">
                2.175.000₫
              </Title>
            </Col>
          </Row>
          <Button type="primary" block style={{ marginTop: 16 }}>
            ĐẶT HÀNG
          </Button>
          <Button type="link" block style={{ marginTop: 8 }}>
            Quay về giỏ hàng
          </Button>
        </Card>
      </Col>
    </Row>
  )
}

export default CheckoutPage
