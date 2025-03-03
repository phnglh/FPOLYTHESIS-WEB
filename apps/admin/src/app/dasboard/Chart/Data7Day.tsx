import { OrderInDay } from '@/api/services/Dashboard'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'

const Data7Day = () => {
  const [data, setdata] = useState<any>()
  useEffect(() => {
    const fetchData = async () => {
      const resposive = await OrderInDay()
      setdata(resposive)
    }
    fetchData()
  }, [])

  const [processedOrders, setProcessedOrders] = useState([])
  const generateDates = (startDate: any, days: any) => {
    const dates = []
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split('T')[0]) // Chuyển đổi ngày thành chuỗi định dạng YYYY-MM-DD
    }
    return dates
  }
  useEffect(() => {
    const startDate = new Date() // Ngày hiện tại
    const days = 7 // Số ngày cần kiểm tra
    const dates = generateDates(startDate, days)
    const processed: any = dates.map((date) => {
      const order = data?.original?.daily_revenues.find(
        (order: any) => order?.date == date,
      )
      return {
        date: date,
        orderCount: order ? order.total_quantity_sold : 0,
      }
    })

    setProcessedOrders(processed)
  }, [processedOrders])
  const series = [
    {
      name: 'Orders',
      data: processedOrders.map((item: any) => item.orderCount),
    },
  ]
  const options: any = {
    chart: {
      type: 'line',
      height: 350,
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    title: {
      text: 'Đơn hàng trong 7 ngày gần nhất',
      align: 'center',
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: processedOrders.map((item: any) => item.date),
    },
  }

  return (
    <>
      <div className="lg:w-2/4 md:w-1/2 ">
        <div className="bg-white shadow rounded-lg">
          <div className="card-body pt-4 ">
            <Chart options={options} series={series} type="line" height={300} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Data7Day
