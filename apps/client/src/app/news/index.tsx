import React, { useState } from 'react'
import { Row, Col, Card, Typography, List, Menu, Tag, Pagination } from 'antd'
import { RightOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const categories = [
  'Áo thể thao',
  'Quần thể thao',
  'Giày thể thao',
  'Phụ kiện thể thao',
]

const featuredNews = [
  {
    title: 'Phối đồ với giày Converse 1970s chưa bao giờ đơn giản đến thế',
    image: 'https://via.placeholder.com/80',
  },
  {
    title:
      'Cách chọn size giày MLB nam đúng chuẩn ? Bảng size giày MLB Việt Nam',
    image: 'https://via.placeholder.com/80',
  },
  {
    title: 'Tips chọn áo thun thể thao nam phù hợp anh chàng ưa vận động',
    image: 'https://via.placeholder.com/80',
  },
  {
    title: 'Tất tần tật bí quyết chọn mua quần áo thể thao nam chất lượng nhất',
    image: 'https://via.placeholder.com/80',
  },
]

const news = [
  {
    image: 'link_to_image_1.jpg',
    tag: 'Thời trang',
    title: 'Phối đồ với giày Converse 1970s chưa bao giờ đơn giản đến thế',
    date: '05/10/2023',
    author: 'Nguyễn Thị Kim Anh',
    excerpt:
      'Là một trong những dòng giày chủ lực của nhà bóng rổ, Converse Chuck 1970s được các bạn trẻ săn đón rộng rãi, với mỗi phiên bản ra đời...',
  },
  {
    image: 'link_to_image_2.jpg',
    tag: 'Hướng dẫn',
    title:
      'Cách chọn size giày MLB nam đúng chuẩn ? Bảng size giày MLB Việt Nam',
    date: '05/10/2023',
    author: 'Nguyễn Thị Kim Anh',
    excerpt:
      'Giày MLB nam được nhiều bạn trẻ yêu thích. Vậy bạn đã biết cách chọn size giày MLB nam đúng chuẩn chưa ? Tham khảo ngay bảng size giày...',
  },
  {
    image: 'link_to_image_3.jpg',
    tag: 'Tip chọn',
    title: 'Tips chọn áo thun thể thao nam phù hợp anh chàng ưa vận động',
    date: '05/10/2023',
    author: 'Nguyễn Thị Kim Anh',
    excerpt:
      'Áo thun thể thao dành cho nam là món đồ phổ biến ở những chàng trai yêu thích thể dục thể thao, các hoạt động cần sự vận động...',
  },
  {
    image: 'link_to_image_4.jpg',
    tag: 'Thời trang',
    title: 'Tất tần tật bí quyết chọn mua quần áo thể thao nam chất lượng nhất',
    date: '05/10/2023',
    author: 'Nguyễn Thị Kim Anh',
    excerpt:
      'Là những người đam mê bộ môn Gym và mong muốn có thân hình đẹp, thu hút mọi ánh nhìn của nữ giới, hãy đơn giản bạn tập để nâng cao...',
  },
  {
    image: 'link_to_image_5.jpg',
    tag: 'Thời trang',
    title: 'Trào lưu băng đô to bản đồ bộ spring summer 2023',
    date: '05/10/2023',
    author: 'Nguyễn Thị Kim Anh',
    excerpt:
      'Thay thế các phụ kiện thời trang nữ tính như cài tóc ngọc trai, nón tai bèo... băng đô to bản (sweatband) bằng trán được nhiều tín đồ thời trang...',
  },
  {
    image: 'link_to_image_6.jpg',
    tag: 'Hướng dẫn',
    title: 'Chọn running bra, sport bra cho dân chạy bộ',
    date: '05/10/2023',
    author: 'Nguyễn Thị Kim Anh',
    excerpt:
      'Sử dụng đồ ngủ thể thao (sport bra) phù hợp rất quan trọng vì chúng giúp bạn luôn thoải mái khi chạy, đặc biệt là trong thời gian dài...',
  },
  {
    image: 'link_to_image_7.jpg',
    tag: 'Tip chọn',
    title: 'Các runner nữ nên mặc gì để vừa tiện lợi vừa thoải mái nhất?',
    date: '05/10/2023',
    author: 'Nguyễn Thị Kim Anh',
    excerpt:
      'Bài viết này sẽ gợi ý cho các nàng yêu chạy bộ những outfit vừa đẹp lại vừa thoải mái nhất! Trang phục là yếu tố giúp phải nữ có thêm động lực...',
  },
  {
    image: 'link_to_image_8.jpg',
    tag: 'Hướng dẫn',
    title: 'Hướng dẫn cách sử dụng băng keo thể thao hiệu quả',
    date: '05/10/2023',
    author: 'Nguyễn Thị Kim Anh',
    excerpt:
      'Băng keo thể thao là gì? Sử dụng sản phẩm này có tác dụng gì? Người ta thường dùng băng keo thể thao ở những bộ phận nào trên cơ thể?',
  },
]

const NewsPage = () => {
  const [current, setCurrent] = useState(1)

  const onChange = (page: number) => {
    setCurrent(page)
  }
  return (
    <>
      <Row gutter={[32, 32]} style={{ padding: '50px' }}>
        <Col
          xs={24}
          md={6}
          style={{
            position: 'sticky',
            top: '20px',
            height: '100%',
            zIndex: 10,
          }}
        >
          <Card>
            <Title level={4} style={{ textAlign: 'left' }}>
              DANH MỤC TIN TỨC
            </Title>
            <Menu mode="inline">
              {categories.map((item, index) => (
                <Menu.Item key={index} icon={<RightOutlined />}>
                  {item}
                </Menu.Item>
              ))}
            </Menu>
          </Card>

          <Card style={{ marginTop: 20 }}>
            <Title level={4} style={{ textAlign: 'left' }}>
              TIN TỨC NỔI BẬT
            </Title>
            <List
              itemLayout="horizontal"
              dataSource={featuredNews}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<img src={item.image} alt="news" width={50} />}
                    title={
                      <Typography.Text
                        style={{ textAlign: 'left', display: 'block' }}
                      >
                        {item.title}
                      </Typography.Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={18}>
          <Title level={3} style={{ textAlign: 'left' }}>
            TIN TỨC
          </Title>
          <Row gutter={[32, 32]}>
            {news.map((article, index) => (
              <Col xs={24} md={12} key={index}>
                <Card
                  cover={<img src={article.image} alt="news" />}
                  hoverable
                  style={{ textAlign: 'left' }} // Căn trái toàn bộ nội dung trong Card
                >
                  <Tag color="green">{article.tag}</Tag>
                  <Title level={5} style={{ textAlign: 'left' }}>
                    {article.title}
                  </Title>
                  <Paragraph type="secondary" style={{ textAlign: 'left' }}>
                    {article.date} - {article.author}
                  </Paragraph>
                  <Paragraph style={{ textAlign: 'left' }}>
                    {article.excerpt}
                  </Paragraph>
                  <a href="#" style={{ textAlign: 'left', display: 'block' }}>
                    Đọc tiếp →
                  </a>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Pagination
          current={current}
          onChange={onChange}
          total={8}
          pageSize={4}
          showSizeChanger={false}
          itemRender={(page, type, originalElement) => {
            if (type === 'prev') {
              return <a>&lt;</a>
            }
            if (type === 'next') {
              return <a>&gt;</a>
            }
            return originalElement
          }}
          style={{
            textAlign: 'center',
            marginTop: '20px',
            marginLeft: '550px',
          }}
        />
      </Row>
    </>
  )
}

export default NewsPage
