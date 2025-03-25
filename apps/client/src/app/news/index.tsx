import React, { useState } from 'react'
import { Row, Col, Card, Typography, List, Menu, Tag, Pagination } from 'antd'
import { RightOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const NewsPage = () => {
  const [current, setCurrent] = useState<number>(1)

  const onChange = (page: number) => setCurrent(page)

  return (
    <Row gutter={[32, 32]} style={{ padding: '50px' }}>
      <Col
        xs={24}
        md={6}
        style={{ position: 'sticky', top: '20px', zIndex: 10 }}
      >
        <Card>
          <Title level={4}>DANH MỤC TIN TỨC</Title>
          <Menu mode="inline">
            {[
              'Áo thể thao',
              'Quần thể thao',
              'Giày thể thao',
              'Phụ kiện thể thao',
            ].map((item, index) => (
              <Menu.Item key={index} icon={<RightOutlined />}>
                {item}
              </Menu.Item>
            ))}
          </Menu>
        </Card>

        <Card style={{ marginTop: 20 }}>
          <Title level={4}>TIN TỨC NỔI BẬT</Title>
          <List
            itemLayout="horizontal"
            dataSource={Array.from({ length: 4 }, (_, index) => index)}
            renderItem={(index) => (
              <List.Item key={index}>
                <List.Item.Meta
                  avatar={
                    <img
                      src="https://bizweb.dktcdn.net/100/494/200/articles/rectangle-32-2.jpg?v=1692968657997"
                      width="90px"
                      height="65px"
                      alt="news"
                      style={{ border: '2px solid #ccc', borderRadius: '4px' }}
                    />
                  }
                  title={
                    <Typography.Text>
                      Tiêu đề tin tức {index + 1}
                    </Typography.Text>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>

      <Col xs={24} md={18}>
        <Title level={3}>TIN TỨC</Title>
        <Row gutter={[32, 32]}>
          {Array.from({ length: 4 }, (_, index) => (
            <Col xs={24} md={12} key={index}>
              <Card
                cover={
                  <img
                    src="https://bizweb.dktcdn.net/100/494/200/articles/rectangle-32-2.jpg?v=1692968657997"
                    width={'910px'}
                    height={'425px'}
                    alt="news"
                  />
                }
                hoverable
              >
                <Tag color="green">Thời trang</Tag>
                <Title level={5}>
                  Phối đồ với giày Converse 1970s chưa bao giờ đơn giản đến thế
                </Title>
                <Paragraph type="secondary">
                  05/10/2023 - Nguyễn Thị Kim Anh
                </Paragraph>
                <Paragraph>
                  Là một trong những dòng giày chủ lực của nhà bóng rổ, Converse
                  Chuck 1970s được các bạn trẻ săn đón nồng nhiệt, với mỗi phiên
                  bản ra đời...
                </Paragraph>
                <a href="#">Đọc tiếp →</a>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  )
}

export default NewsPage
