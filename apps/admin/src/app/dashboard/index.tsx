import { Card, Col, Row, Space, Statistic, Tag } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import apiClient from '@store/services/apiClient'
import { useEffect, useState } from 'react'

const COLORS = ['#28A745', '#FFC107', '#FF5733', '#00BFFF', '#FF69B4']

export default function Dashboard() {
  const [revenueData, setRevenueData] = useState([])
  const [orderStatusData, setOrderStatusData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [topCustomers, setTopCustomers] = useState([])
  const [lowInventory, setLowInventory] = useState([])
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [cancelRate, setCancelRate] = useState(0)
  const [revenueByCategory, setRevenueByCategory] = useState([])
  const [dailyAverageOrder, setDailyAverageOrder] = useState(0)

  useEffect(() => {
    // Fetch data for all reports
    apiClient
      .get('/reports/revenue')
      .then((res) => setRevenueData(res.data.data || []))
      .catch((err) => console.error('Error fetching revenue data:', err))

    apiClient
      .get('/reports/orders')
      .then((res) => setOrderStatusData(res.data.data || []))
      .catch((err) => console.error('Error fetching order status data:', err))

    apiClient
      .get('/reports/products')
      .then((res) => setTopProducts(res.data.data || []))
      .catch((err) => console.error('Error fetching top products data:', err))

    apiClient
      .get('/reports/customers')
      .then((res) => setTopCustomers(res.data.data || []))
      .catch((err) => console.error('Error fetching top customers data:', err))

    apiClient
      .get('/reports/inventory')
      .then((res) => setLowInventory(res.data.data || []))
      .catch((err) => console.error('Error fetching low inventory data:', err))

    apiClient
      .get('/reports/monthly-revenue')
      .then((res) => setMonthlyRevenue(res.data.data || []))
      .catch((err) =>
        console.error('Error fetching monthly revenue data:', err),
      )

    apiClient
      .get('/reports/cancel-rate')
      .then((res) => setCancelRate(res.data.data || 0))
      .catch((err) => console.error('Error fetching cancel rate data:', err))

    apiClient
      .get('/reports/revenue-by-category')
      .then((res) => setRevenueByCategory(res.data.data || []))
      .catch((err) =>
        console.error('Error fetching revenue by category data:', err),
      )

    apiClient
      .get('/reports/daily-average')
      .then((res) => setDailyAverageOrder(res.data.data || 0))
      .catch((err) =>
        console.error('Error fetching daily average order data:', err),
      )
  }, [])

  const today = new Date().toISOString().split('T')[0]

  const todayRevenue = revenueData?.find((data: any) => data.date === today)

  const orderStatusPieData = orderStatusData.map((item) => ({
    name: item.status,
    value: item.count,
  }))

  return (
    <Row gutter={24}>
      {/* Top Stats */}
      <Col span={8}>
        <Card>
          <Statistic
            title="Doanh thu hôm nay"
            value={todayRevenue?.revenue || 0}
            suffix="₫"
            prefix={<ArrowUpOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Tỷ lệ huỷ đơn"
            value={cancelRate.cancel_rate}
            precision={2}
            suffix="%"
            prefix={<ArrowDownOutlined />}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="Giá trị đơn hàng TB"
            value={Math.floor(
              topCustomers.reduce((sum, c) => sum + c.total_spent, 0) /
                (topCustomers.length || 1),
            )}
            suffix="₫"
            prefix={<ArrowUpOutlined />}
          />
        </Card>
      </Col>

      {/* Doanh thu theo ngày (Line chart) */}
      <Col span={16}>
        <Card>
          <h3 className="font-semibold mb-2">Biểu đồ doanh thu theo ngày</h3>
          <LineChart width={600} height={300} data={revenueData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#28A745"
              strokeWidth={2}
            />
          </LineChart>
        </Card>
      </Col>

      {/* Trạng thái đơn hàng (Pie chart) */}
      <Col span={8}>
        <Card>
          <h3 className="font-semibold">Trạng thái đơn hàng</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={orderStatusPieData}
              dataKey="value"
              outerRadius={120}
              fill="#8884d8"
            >
              {orderStatusPieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  const data = payload[0]
                  return (
                    <div
                      style={{
                        backgroundColor: 'white',
                        padding: '5px',
                        borderRadius: '5px',
                      }}
                    >
                      <strong>{data.name}:</strong> {data.value} đơn
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
          <Row gutter={16} justify="center" style={{ marginTop: 20 }}>
            {orderStatusData.map((item, index) => (
              <Col key={item.status}>
                <Space size="middle" align="center">
                  <Tag color={COLORS[index % COLORS.length]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Tag>
                </Space>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>

      {/* Top sản phẩm bán chạy */}
      <Col span={8}>
        <Card>
          <h3 className="font-semibold mb-2">Top sản phẩm bán chạy</h3>
          <ul className="list-disc pl-5">
            {topProducts.map((product, index) => (
              <li key={index}>
                {product.name} - {product.quantity_sold} cái
              </li>
            ))}
          </ul>
        </Card>
      </Col>

      {/* Khách hàng chi tiêu nhiều */}
      <Col span={8}>
        <Card>
          <h3 className="font-semibold mb-2">Khách hàng chi tiêu nhiều</h3>
          <ul className="list-disc pl-5">
            {topCustomers.map((cus, index) => (
              <li key={index}>
                {cus.name} ({cus.email}) - {cus.total_spent.toLocaleString()} ₫
              </li>
            ))}
          </ul>
        </Card>
      </Col>

      {/* Sản phẩm sắp hết hàng */}
      <Col span={8}>
        <Card>
          <h3 className="font-semibold mb-2">Sản phẩm sắp hết hàng</h3>
          <ul className="list-disc pl-5">
            {lowInventory.map((item, index) => (
              <li key={index}>
                {item.name} - {item.sku} (Còn {item.stock})
              </li>
            ))}
          </ul>
        </Card>
      </Col>

      {/* Tăng trưởng doanh thu (Bar chart) */}
      <Col span={16}>
        <Card>
          <h3 className="font-semibold mb-2">
            Tăng trưởng doanh thu theo tháng
          </h3>
          <BarChart width={600} height={300} data={monthlyRevenue}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#00BFFF" />
          </BarChart>
        </Card>
      </Col>

      {/* Doanh thu theo danh mục */}
      <Col span={8}>
        <Card>
          <h3 className="font-semibold mb-2">Doanh thu theo danh mục</h3>
          <ul className="list-disc pl-5">
            {revenueByCategory.map((cat, index) => (
              <li key={index}>
                {cat.category} - {cat.revenue.toLocaleString()} ₫
              </li>
            ))}
          </ul>
        </Card>
      </Col>
    </Row>
  )
}
