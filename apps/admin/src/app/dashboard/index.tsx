import { useEffect, useState, useMemo } from 'react'
import apiClient from '@store/services/apiClient'
import dayjs from 'dayjs'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function DashboardPage() {
  const [summary, setSummary] = useState<{
    todayRevenue: number
    yesterdayRevenue: number
    monthRevenue: number
    todayOrders: number
  } | null>(null)
  const [filteredData, setFilteredData] = useState<{
    totalRevenue: number
    totalOrders: number
    cancelRate: number
  } | null>(null)
  const [revenueChart, setRevenueChart] = useState<
    { date: string; revenue: number }[]
  >([])
  const [topProducts, setTopProducts] = useState<
    {
      product_name: string
      total_quantity: number
      variant: string
      stock: number
    }[]
  >([])
  const [topCustomers, setTopCustomers] = useState<
    { name: string; total_spent: number; arpu: number; order_count: number }[]
  >([])
  const [dateRange, setDateRange] = useState({
    from: dayjs().startOf('month').format('YYYY-MM-DD'),
    to: dayjs().format('YYYY-MM-DD'),
  })
  const [debouncedDateRange, setDebouncedDateRange] = useState(dateRange)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chartLoading, setChartLoading] = useState(false)
  const [chartError, setChartError] = useState<string | null>(null)

  // Debounce date range changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDateRange(dateRange)
    }, 500)

    return () => clearTimeout(handler)
  }, [dateRange])

  // Lấy dữ liệu cho phần tổng quan (giữ nguyên)
  const fetchSummary = async () => {
    try {
      setLoading(true)
      setError(null)
      const today = dayjs().format('YYYY-MM-DD')
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      const firstDayOfMonth = dayjs().startOf('month').format('YYYY-MM-DD')

      const [
        todayRevenueRes,
        yesterdayRevenueRes,
        monthRevenueRes,
        todayOrdersRes,
      ] = await Promise.all([
        apiClient.get('/reports/revenue', {
          params: { start_date: today, end_date: today },
        }),
        apiClient.get('/reports/revenue', {
          params: { start_date: yesterday, end_date: yesterday },
        }),
        apiClient.get('/reports/revenue', {
          params: { start_date: firstDayOfMonth, end_date: today },
        }),
        apiClient.get('/reports/orders', {
          params: { start_date: today, end_date: today },
        }),
      ])

      setSummary({
        todayRevenue: todayRevenueRes.data?.data || 0,
        yesterdayRevenue: yesterdayRevenueRes.data?.data || 0,
        monthRevenue: monthRevenueRes.data?.data || 0,
        todayOrders: todayOrdersRes.data?.data || 0,
      })
    } catch (err: any) {
      setError('Không thể tải dữ liệu tổng quan. Vui lòng thử lại sau.')
      console.error('Error fetching summary:', err)
    } finally {
      setLoading(false)
    }
  }

  // Lấy dữ liệu cho phần lọc theo khoảng ngày (giữ nguyên)
  const fetchFilteredData = async () => {
    try {
      setLoading(true)
      setError(null)

      const startDate = debouncedDateRange.from
      const endDate = debouncedDateRange.to

      const [
        revenueRes,
        ordersRes,
        cancelRateRes,
        chartRes,
        productRes,
        customerRes,
      ] = await Promise.all([
        apiClient.get('/reports/revenue', {
          params: { start_date: startDate, end_date: endDate },
        }),
        apiClient.get('/reports/orders', {
          params: { start_date: startDate, end_date: endDate },
        }),
        apiClient.get('/reports/cancel-rate', {
          params: { start_date: startDate, end_date: endDate },
        }),
        apiClient.get('/reports/revenue', {
          params: { start_date: startDate, end_date: endDate, group_by: 'day' },
        }),
        apiClient.get('/reports/top-products', {
          params: { start_date: startDate, end_date: endDate },
        }),
        apiClient.get('/reports/top-customers', {
          params: { start_date: startDate, end_date: endDate },
        }),
      ])

      setFilteredData({
        totalRevenue: revenueRes.data?.data || 0,
        totalOrders: ordersRes.data?.data || 0,
        cancelRate: cancelRateRes.data?.data || 0,
      })

      const chartData = Array.isArray(chartRes.data?.data)
        ? chartRes.data.data
        : []
      console.log(
        'Raw chart response (old API):',
        JSON.stringify(chartRes, null, 2),
      )
      console.log(
        'Revenue chart data (old API):',
        JSON.stringify(chartData, null, 2),
      )

      setTopProducts(
        Array.isArray(productRes.data?.data) ? productRes.data?.data : [],
      )
      setTopCustomers(
        Array.isArray(customerRes.data?.data) ? customerRes.data?.data : [],
      )
    } catch (err: any) {
      setError(
        `Không thể tải dữ liệu: ${err.response?.data?.message || 'Lỗi không xác định'}. Vui lòng thử lại sau.`,
      )
      console.error('Error fetching filtered data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Lấy dữ liệu cho biểu đồ (giữ nguyên)
  const fetchRevenueChart = async () => {
    try {
      setChartLoading(true)
      setChartError(null)

      const startDate = debouncedDateRange.from
      const endDate = debouncedDateRange.to

      const chartRes = await apiClient.get('/reports/revenue-statistics', {
        params: { start_date: startDate, end_date: endDate },
      })

      if (!chartRes.data.success) {
        throw new Error(chartRes.data.message || 'Lỗi khi lấy dữ liệu biểu đồ')
      }

      const chartData = Array.isArray(chartRes.data?.data?.daily_statistics)
        ? chartRes.data.data.daily_statistics.map((item: any) => {
            if (!item.date || typeof item.total_revenue !== 'number') {
              throw new Error(
                'Dữ liệu không hợp lệ: Thiếu date hoặc total_revenue',
              )
            }
            return {
              date: item.date,
              revenue: item.total_revenue,
            }
          })
        : []
      console.log(
        'Raw chart response (new API):',
        JSON.stringify(chartRes, null, 2),
      )
      console.log(
        'Revenue chart data (new API):',
        JSON.stringify(chartData, null, 2),
      )
      setRevenueChart(chartData)
    } catch (err: any) {
      setChartError(
        `Không thể tải dữ liệu biểu đồ: ${err.response?.data?.message || err.message || 'Lỗi không xác định'}. Vui lòng kiểm tra đường dẫn API hoặc thử lại sau.`,
      )
      console.error('Error fetching revenue chart:', err)
      console.error(
        'Failed API URL:',
        `${apiClient.defaults.baseURL}/reports/revenue-statistics?start_date=${startDate}&end_date=${endDate}`,
      )
    } finally {
      setChartLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
    fetchFilteredData()
    fetchRevenueChart()
  }, [debouncedDateRange])

  // Dữ liệu cho biểu đồ (giữ nguyên)
  const chartData = useMemo(() => {
    const labels = revenueChart.map((item) => dayjs(item.date).format('DD/MM'))
    const data = revenueChart.map((item) => item.revenue)
    console.log('Chart labels:', labels)
    console.log('Chart values:', data)
    return {
      labels: labels,
      datasets: [
        {
          label: 'Doanh thu',
          data: data,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          hoverBackgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        },
      ],
    }
  }, [revenueChart])

  // Tùy chọn cho biểu đồ (giữ nguyên)
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Doanh thu (VNĐ)',
        },
        ticks: {
          callback: (value: number) => `${value.toLocaleString('vi-VN')}`,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Ngày',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y
            return `Doanh thu: ${value.toLocaleString('vi-VN')} VNĐ`
          },
        },
      },
    },
  }

  // Tính phần trăm tăng/giảm so với hôm qua (giữ nguyên)
  const growthRate = summary?.yesterdayRevenue
    ? (
        ((summary.todayRevenue - summary.yesterdayRevenue) /
          summary.yesterdayRevenue) *
        100
      ).toFixed(2)
    : '0'

  // Skeleton loading component (giữ nguyên)
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm text-center animate-pulse border border-gray-200">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-6 bg-gray-200 rounded"></div>
    </div>
  )

  return (
    <div className="p-6 space-y-8">
      {/* Hiển thị thông báo lỗi nếu có */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
          role="alert"
        >
          <span>{error}</span>
        </div>
      )}

      {/* Phần tổng quan */}
      <h1 className="text-2xl font-semibold">Tổng quan</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title="💰 Doanh thu hôm nay"
            value={
              summary?.todayRevenue
                ? `${Math.round(summary.todayRevenue).toLocaleString('vi-VN')} VNĐ`
                : '0 VNĐ'
            }
            valueClass="text-blue-600"
            borderClass="border-blue-200"
          />
          <Card
            title="📊 So với hôm qua"
            value={
              <span
                className={
                  parseFloat(growthRate) >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {growthRate >= '0' ? '+' : ''}
                {growthRate}%
              </span>
            }
            valueClass={
              parseFloat(growthRate) >= 0 ? 'text-green-600' : 'text-red-600'
            }
            borderClass={
              parseFloat(growthRate) >= 0
                ? 'border-green-200'
                : 'border-red-200'
            }
          />
          <Card
            title="📆 Doanh thu tháng này"
            value={
              summary?.monthRevenue
                ? `${Math.round(summary.monthRevenue).toLocaleString('vi-VN')} VNĐ`
                : '0 VNĐ'
            }
            valueClass="text-blue-600"
            borderClass="border-blue-200"
          />
          <Card
            title="🛒 Đơn hàng hôm nay"
            value={summary?.todayOrders || 0}
            valueClass="text-purple-600"
            borderClass="border-purple-200"
          />
        </div>
      )}

      {/* Phần lọc theo khoảng ngày */}
      <h1 className="text-2xl font-semibold">Lọc theo khoảng ngày</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card
            title="Tổng doanh thu"
            value={
              filteredData?.totalRevenue
                ? `${Math.round(filteredData.totalRevenue).toLocaleString('vi-VN')} VNĐ`
                : '0 VNĐ'
            }
            valueClass="text-blue-600"
            borderClass="border-blue-200"
          />
          <Card
            title="Tổng số đơn"
            value={filteredData?.totalOrders || 0}
            valueClass="text-purple-600"
            borderClass="border-purple-200"
          />
          <Card
            title="Tỷ lệ hủy đơn"
            value={
              filteredData?.cancelRate
                ? `${filteredData.cancelRate.toFixed(2)}%`
                : '0%'
            }
            valueClass="text-red-600"
            borderClass="border-red-200"
          />
        </div>
      )}

      {/* Đoạn hiển thị biểu đồ doanh thu theo ngày */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-200">
        <h2 className="text-lg font-semibold mb-4">
          Biểu đồ doanh thu theo ngày
        </h2>
        {chartLoading ? (
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        ) : chartError ? (
          <p className="text-red-500">{chartError}</p>
        ) : revenueChart.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
        )}
      </div>

      {/* Phần Top sản phẩm và Top khách hàng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bảng Top sản phẩm bán chạy */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-200">
          <h2 className="text-lg font-semibold mb-4">Top sản phẩm bán chạy</h2>
          {topProducts.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-left bg-green-100 text-green-800">
                  <th className="p-3">STT</th>
                  <th className="p-3">Tên sản phẩm</th>
                  <th className="p-3">Biến thể</th>
                  <th className="p-3 text-center">Tồn kho</th>
                  <th className="p-3 text-center">Số lượng bán</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-green-50 transition-colors duration-300"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{item.product_name}</td>
                    <td className="p-3">{item.variant}</td>
                    <td className="p-3 text-center">{item.stock}</td>
                    <td className="p-3 text-center text-green-600">
                      {item.total_quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">Không có dữ liệu</p>
          )}
        </div>

        {/* Bảng Top khách hàng chi tiêu */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-200">
          <h2 className="text-lg font-semibold mb-4">
            Top khách hàng chi tiêu
          </h2>
          {topCustomers.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="text-left bg-orange-100 text-orange-800">
                  <th className="p-3">STT</th>
                  <th className="p-3">Tên khách hàng</th>
                  <th className="p-3 text-center">Số lượt mua</th>
                  <th className="p-3 text-center">Tổng chi tiêu</th>
                  <th className="p-3 text-center">ARPU</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-orange-50 transition-colors duration-300"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 text-center">{item.order_count}</td>
                    <td className="p-3 text-center text-orange-600">
                      {Math.round(item.total_spent).toLocaleString('vi-VN')} VNĐ
                    </td>
                    <td className="p-3 text-center">
                      {Math.round(item.arpu).toLocaleString('vi-VN')} VNĐ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">Không có dữ liệu</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, valueClass, borderClass }) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-sm text-center transform transition-all duration-300 hover:shadow-md hover:scale-105 border ${borderClass || 'border-gray-200'}`}
    >
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-xl font-bold ${valueClass || 'text-gray-800'}`}>
        {value}
      </div>
    </div>
  )
}
