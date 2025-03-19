import React from 'react'
import { Form, Input, Button, Typography, Row, Col, Card } from 'antd'
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

const ContactPage = () => {
  return (
    <>
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: '100vh', padding: '50px' }}
      >
        <Col xs={24} md={20} lg={16}>
          <Card
            bordered={false}
            style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          >
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} md={12}>
                <img
                  src="https://via.placeholder.com/500x500"
                  alt="Contact"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Title level={3} style={{ textAlign: 'left' }}>
                  Bạn cần tư vấn ?
                </Title>
                <Paragraph style={{ textAlign: 'left' }}>
                  Liên hệ ngay với chúng tôi để được giải đáp mọi thắc mắc.
                  Chúng tôi sẽ phản hồi ngay khi nhận được thông tin của quý
                  khách.
                </Paragraph>

                <Form layout="vertical">
                  <Form.Item name="name">
                    <Input placeholder="Họ và tên" />
                  </Form.Item>
                  <Form.Item name="email">
                    <Input placeholder="Email" />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại!',
                      },
                    ]}
                  >
                    <Input placeholder="Điện thoại*" />
                  </Form.Item>
                  <Form.Item name="message">
                    <Input.TextArea placeholder="Nội dung" rows={4} />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      block
                      style={{ background: 'black', borderColor: 'black' }}
                    >
                      GỬI THÔNG TIN
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row
        gutter={[32, 0]}
        style={{ padding: '50px', background: '#f8f8f8' }}
        align="middle"
      >
        {/* Thông tin liên hệ */}
        <Col xs={24} md={12}>
          <Card bordered={false} style={{ padding: '20px', boxShadow: 'none' }}>
            <Title level={3} style={{ marginBottom: 10, textAlign: 'left' }}>
              Thông tin liên hệ
            </Title>
            <Paragraph style={{ marginBottom: 20, textAlign: 'left' }}>
              Thông tin trụ sở và các chi nhánh của chúng tôi.
            </Paragraph>

            <Row gutter={[16, 8]}>
              <Col xs={24} md={12}>
                <Paragraph style={{ textAlign: 'left' }}>
                  <EnvironmentOutlined style={{ marginRight: 8 }} />
                  <strong>Địa chỉ:</strong>
                </Paragraph>
                <Paragraph style={{ textAlign: 'left' }}>
                  Tầng 6, Tòa Ladeco, 266 Đội Cấn, <br /> Quận Ba Đình, TP Hà
                  Nội
                </Paragraph>
              </Col>

              <Col xs={24} md={12}>
                <Paragraph style={{ textAlign: 'left' }}>
                  <MailOutlined style={{ marginRight: 8 }} />
                  <strong>Email:</strong>
                </Paragraph>
                <Paragraph style={{ textAlign: 'left' }}>
                  flamess.strore@gmail.com
                </Paragraph>
              </Col>

              <Col xs={24} md={12}>
                <Paragraph style={{ textAlign: 'left' }}>
                  <PhoneOutlined style={{ marginRight: 8 }} />
                  <strong>Hotline:</strong>
                </Paragraph>
                <Paragraph style={{ textAlign: 'left' }}>1800.6750</Paragraph>
              </Col>

              <Col xs={24} md={12}>
                <Paragraph style={{ textAlign: 'left' }}>
                  <ClockCircleOutlined style={{ marginRight: 8 }} />
                  <strong>Giờ làm việc:</strong>
                </Paragraph>
                <Paragraph style={{ textAlign: 'left' }}>
                  T2 - T6: 8 AM - 5 PM <br />
                  T7 - CN: 8 AM - 2 PM
                </Paragraph>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Bản đồ */}
        <Col xs={24} md={12}>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.850836759919!2d105.81608517583358!3d21.00168168866239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abddbfb748bb%3A0x1c8f414146d25571!2zMjY2IMSQLiDEkOG7kWkgQ-G7pywgQuG6r2EgRGnhu4d0LCBCw6AgxJDhu5NuLCBIw6AgTuG7mWk!5e0!3m2!1sen!2s!4v1708848492262!5m2!1sen!2s"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: '8px' }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </Col>
      </Row>
    </>
  )
}

export default ContactPage
