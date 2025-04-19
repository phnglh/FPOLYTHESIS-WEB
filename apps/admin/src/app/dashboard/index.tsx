import { Card, Statistic, Table } from 'antd'
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

const COLORS = ['#28A745', '#FFC107', '#FF5733', '#00BFFF', '#FF69B4']

// Dummy data
const revenueData = [
  { date: '2025-04-01', revenue: 5000 },
  { date: '2025-04-02', revenue: 6000 },
  { date: '2025-04-03', revenue: 8000 },
  { date: '2025-04-04', revenue: 10000 },
  { date: '2025-04-05', revenue: 11000 },
]

const orderStatusData = [
  { name: 'Đang xử lý', value: 120 },
  { name: 'Đã giao', value: 300 },
  { name: 'Đã huỷ', value: 30 },
]

const topProducts = [
  { name: 'Áo sơ mi', quantity: 120 },
  { name: 'Quần jean', quantity: 100 },
  { name: 'Giày thể thao', quantity: 90 },
]

const topCustomers = [
  { name: 'Nguyễn Văn A', email: 'a@gmail.com', total_spent: 1500000 },
  { name: 'Trần Thị B', email: 'b@gmail.com', total_spent: 1200000 },
]

const lowInventory = [
  { name: 'Áo khoác', sku: 'AK123', stock: 3 },
  { name: 'Mũ lưỡi trai', sku: 'MLT456', stock: 5 },
]

const revenueByCategory = [
  { name: 'Thời trang nam', revenue: 5000000 },
  { name: 'Thời trang nữ', revenue: 7000000 },
  { name: 'Phụ kiện', revenue: 2000000 },
]

export default function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Top Stats */}
      <Card>
        <Statistic
          title="Doanh thu hôm nay"
          value={1200000}
          suffix="₫"
          prefix={<ArrowUpOutlined />}
        />
      </Card>
      <Card>
        <Statistic
          title="Tỷ lệ huỷ đơn"
          value={8.5}
          suffix="%"
          prefix={<ArrowDownOutlined />}
        />
      </Card>
      <Card>
        <Statistic
          title="Giá trị đơn hàng TB"
          value={356000}
          suffix="₫"
          prefix={<ArrowUpOutlined />}
        />
      </Card>

      {/* Biểu đồ doanh thu */}
      <Card className="col-span-2">
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

      {/* Trạng thái đơn hàng */}
      <Card>
        <h3 className="font-semibold text-center">Trạng thái đơn hàng</h3>
        <PieChart width={200} height={200}>
          <Pie
            data={orderStatusData}
            dataKey="value"
            outerRadius={80}
            fill="#8884d8"
          >
            {orderStatusData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </Card>

      {/* Top sản phẩm bán chạy */}
      <Card className="col-span-1">
        <h3 className="font-semibold mb-2">Top sản phẩm bán chạy</h3>
        <ul className="list-disc pl-5">
          {topProducts.map((product, index) => (
            <li key={index}>
              {product.name} - {product.quantity} cái
            </li>
          ))}
        </ul>
      </Card>

      {/* Khách hàng chi tiêu nhiều */}
      <Card className="col-span-1">
        <h3 className="font-semibold mb-2">Khách hàng chi tiêu nhiều</h3>
        <ul className="list-disc pl-5">
          {topCustomers.map((cus, index) => (
            <li key={index}>
              {cus.name} ({cus.email}) - {cus.total_spent.toLocaleString()} ₫
            </li>
          ))}
        </ul>
      </Card>

      {/* Sản phẩm sắp hết hàng */}
      <Card className="col-span-1">
        <h3 className="font-semibold mb-2">Sản phẩm sắp hết hàng</h3>
        <ul className="list-disc pl-5">
          {lowInventory.map((item, index) => (
            <li key={index}>
              {item.name} - {item.sku} (Còn {item.stock})
            </li>
          ))}
        </ul>
      </Card>

      {/* Tăng trưởng doanh thu (Bar chart mô phỏng) */}
      <Card className="col-span-2">
        <h3 className="font-semibold mb-2">Tăng trưởng doanh thu theo tháng</h3>
        <BarChart width={600} height={300} data={revenueData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#00BFFF" />
        </BarChart>
      </Card>

      {/* Phân bố doanh thu theo danh mục */}
      <Card className="col-span-1">
        <h3 className="font-semibold mb-2">Doanh thu theo danh mục</h3>
        <ul className="list-disc pl-5">
          {revenueByCategory.map((cat, index) => (
            <li key={index}>
              {cat.name} - {cat.revenue.toLocaleString()} ₫
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
