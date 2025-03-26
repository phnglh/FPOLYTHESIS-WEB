import { Typography, Layout, Card } from 'antd'

const { Title, Paragraph, Text } = Typography
const { Content } = Layout

const AboutUsPage = () => {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Content
        style={{
          padding: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          style={{
            maxWidth: 900,
            width: '100%',
            padding: '30px',
            textAlign: 'left',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
          }}
        >
          <Title level={2} style={{ textAlign: 'center', color: '#1890ff' }}>
            Giới thiệu
          </Title>
          <Paragraph>
            Mẫu thiết kế website <Text strong>đồ thể thao</Text> thương hiệu nổi
            tiếng. Nếu bạn sở hữu một cửa hàng thể thao, thì việc có một trang
            web chuyên nghiệp sẽ giúp bạn tiếp cận nhiều khách hàng hơn.
          </Paragraph>
          <Paragraph>
            Hiện nay, <Text strong>xu hướng mua hàng trực tuyến</Text> ngày càng
            phổ biến, đặc biệt trong lĩnh vực giày dép, quần áo thể thao. Một
            website bán hàng sẽ giúp bạn dễ dàng quản lý đơn hàng và tiếp cận
            khách hàng hiệu quả hơn.
          </Paragraph>
          <Paragraph>
            Các thương hiệu lớn như <Text strong>Adidas, Nike, Converse</Text>{' '}
            đã thành công với kênh bán hàng trực tuyến của họ. Nếu bạn muốn phát
            triển trong lĩnh vực này, một website chuyên nghiệp là không thể
            thiếu.
          </Paragraph>

          <Title level={3} style={{ color: '#1890ff', marginTop: '30px' }}>
            Lợi ích khi có website bán đồ thể thao
          </Title>
          <Paragraph>
            ✅ <Text strong>Tiếp cận khách hàng dễ dàng hơn</Text>: Website giúp
            bạn tiếp cận khách hàng ở mọi nơi chỉ với một thiết bị có kết nối
            Internet.
          </Paragraph>
          <Paragraph>
            ✅ <Text strong>Tiết kiệm chi phí</Text>: So với việc mở cửa hàng
            truyền thống, một website giúp bạn cắt giảm chi phí mặt bằng, điện
            nước,...
          </Paragraph>
          <Paragraph>
            ✅ <Text strong>Hoạt động 24/7</Text>: Khách hàng có thể mua sắm bất
            kỳ lúc nào mà không bị giới hạn thời gian như cửa hàng vật lý.
          </Paragraph>
          <Paragraph>
            ✅ <Text strong>Bắt kịp xu hướng tiêu dùng</Text>: Người tiêu dùng
            hiện đại thích mua hàng trực tuyến hơn là đến cửa hàng.
          </Paragraph>

          <Title level={3} style={{ color: '#1890ff', marginTop: '30px' }}>
            Hỗ trợ đo lường hiệu quả kinh doanh
          </Title>
          <Paragraph>
            Một website bán hàng không chỉ giúp bạn trưng bày sản phẩm mà còn
            cung cấp công cụ để{' '}
            <Text strong>thống kê lượt truy cập, đơn hàng</Text> và nhiều tính
            năng hữu ích khác.
          </Paragraph>

          <Title
            level={3}
            style={{ textAlign: 'center', color: '#1890ff', marginTop: '40px' }}
          >
            🚀 Hãy bắt đầu ngay hôm nay!
          </Title>
          <Paragraph style={{ textAlign: 'center' }}>
            Nếu bạn muốn phát triển kinh doanh <Text strong>đồ thể thao</Text>,
            đừng bỏ qua việc thiết kế một website chuyên nghiệp!
          </Paragraph>
        </Card>
      </Content>
    </Layout>
  )
}

export default AboutUsPage
