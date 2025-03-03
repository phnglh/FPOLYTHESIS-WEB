import {
  doanhThu7Day,
  getDoanhThuYear,
  getDoanhthuThang,
} from '@/api/services/Dashboard'
import formatNumber from '@/utilities/FormatTotal'
import { DatePicker, Dropdown, Menu, Modal, Tooltip } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
const DataIn1Year = () => {
  const [doanhsoyear, setdoanhsodatyy] = useState<any>()
  useEffect(() => {
    const fetch = async () => {
      const data = await getDoanhThuYear()
      setdoanhsodatyy(data)
    }
    fetch()
  }, [])
  const fullYearData = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString()
    const monthData = doanhsoyear?.monthly_revenues?.find(
      (item: any) => item.month == month,
    )?.total_revenue
    return {
      name: month,
      Total: monthData ? monthData : 0,
    }
  })
  console.log(fullYearData)
  const series: any = [
    {
      name: 'Total Orders',
      data: fullYearData ? fullYearData.map((data) => data.Total) : '',
    },
  ]

  const options: any = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: fullYearData
        ? fullYearData.map((item) => `Tháng ${item.name}`)
        : [],
    },
  }
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const [isModalOpen1, setIsModalOpen1] = useState(false)

  const showModal1 = () => {
    setIsModalOpen1(true)
  }

  const handleOk1 = () => {
    setIsModalOpen(false)
  }

  const handleCancel1 = () => {
    setIsModalOpen1(false)
  }
  const [khoangday, setkhoangday] = useState<any>()
  const onChange1 = async (dates: any, dateStrings: any) => {
    console.log(dates)

    const data = {
      start_date: dateStrings[0],
      end_date: dateStrings[1],
    }
    const startDate = dateStrings[0]
    const endDate = dateStrings[1]
    const response = await doanhThu7Day(data)
    console.log(response)
    const start = moment(startDate)
    const end = moment(endDate)
    const dateRange = []

    // Tạo danh sách các ngày trong khoảng
    for (let m = start; m.isSameOrBefore(end); m.add(1, 'days')) {
      dateRange.push(m.format('YYYY-MM-DD'))
    }
    const combinedData = dateRange.map((date) => {
      const found = response?.original?.daily_revenues?.find(
        (d: any) => d.date == date,
      )
      return {
        date: date,
        order_count: found ? found?.total_revenue : 0,
      }
    })
    setkhoangday(combinedData)
  }
  const [months, setmonths] = useState<any>()
  const [totalm, settotalm] = useState<any>()
  const [total, settotal] = useState<any>()
  const onChange: any = async (date: any, dateString: any) => {
    console.log(date)

    const month = dateString.split('-')[1]
    setmonths(month)
    const data = {
      month: month,
    }
    const response = await getDoanhthuThang(data)
    settotalm(response?.original?.total_revenue)
    settotal(response?.original?.daily_revenues)
  }
  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate()
  }
  const fullMonthData = Array.from(
    { length: daysInMonth(months, 2024) },
    (_, i) => {
      const day = (i + 1).toString()
      const monthData = total
        ? total.find((item: any) => {
            const itemMonth = item?.date.split('-')[1]
            return itemMonth == months && item?.date.split('-')[2] == day
          })?.total_revenue
        : ''
      return {
        name: `Ngày ${day}`,
        Total: monthData ? formatNumber(monthData) : 0,
      }
    },
  )
  const { RangePicker } = DatePicker
  const data = fullMonthData?.map((data1: any) => ({
    name: data1?.name,
    Total: data1?.Total,
  }))
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <i className=" ri-calendar-2-line mr-2 font-normal" onClick={showModal}>
          Xem doanh thu theo tháng
        </i>
      </Menu.Item>
      <Menu.Item key="2">
        <i
          className=" ri-calendar-2-line mr-4 font-normal"
          onClick={showModal1}
        >
          Xem doanh thu theo khoảng ngày
        </i>
      </Menu.Item>
    </Menu>
  )
  return (
    <>
      <div className="">
        <div className="rounded-lg bg-white pb-10 pt-8 shadow">
          <span className="flex pl-10 text-sm font-bold">
            Doanh Thu Trong 1 Năm
            <div className="ml-auto mr-2">
              <Dropdown overlay={menu} trigger={['click']}>
                <i className=" ri-more-2-fill text-black"></i>
              </Dropdown>
            </div>
          </span>

          {/* <CalendarOutlined className=" ml-4 p-1.5 border border-gray-300 bg-white rounded " onClick={showModal} /> */}
          {/* <CalendarOutlined className=" ml-4 p-1.5 border border-gray-300 bg-white rounded " onClick={showModal1} /> */}
          <Modal
            width={'70%'}
            title="Doanh thu cả tháng"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <DatePicker picker="month" onChange={onChange} className="mb-4" />
            <br className="mt-4" />
            {!months ? (
              <span className="text-xl font-bold">Hãy chọn tháng.</span>
            ) : (
              <span className=" text-xl">
                Doanh thu của tháng {months} là:{' '}
                <span className="text-xl font-bold">
                  {formatNumber(totalm ? totalm : 0)}đ{' '}
                </span>
              </span>
            )}
            {months ? (
              <LineChart
                width={1050}
                height={280}
                data={data}
                margin={{ right: 54, left: -20, top: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" style={{ fontSize: '0.8em' }} />
                <Tooltip />
                <YAxis style={{ fontSize: '0.8em' }} />
                <Line type="monotone" dataKey="Total" stroke="#8884d8" />
              </LineChart>
            ) : (
              ''
            )}
          </Modal>
          <Modal
            width={'70%'}
            title="Doanh thu theo khoảng ngày"
            open={isModalOpen1}
            onOk={handleOk1}
            onCancel={handleCancel1}
          >
            <RangePicker onChange={onChange1} />
            <br className="mt-4" />
            {khoangday ? (
              <LineChart
                width={1050}
                height={280}
                data={khoangday}
                margin={{ right: 54, left: -20, top: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: '0.8em' }} />
                <Tooltip />
                <YAxis style={{ fontSize: '0.8em' }} />
                <Line type="monotone" dataKey="order_count" stroke="#8884d8" />
              </LineChart>
            ) : (
              ''
            )}
          </Modal>
          <Chart
            options={options}
            series={series}
            type="bar"
            width="100%"
            height="200%"
          />
        </div>
      </div>
    </>
  )
}

export default DataIn1Year
