import {
  FillterMonth,
  FillterToday,
  FillterWeek,
} from '@/api/services/Dashboard'
import formatNumber from '@/utilities/FormatTotal'
import { FileSearchOutlined } from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Order from './Order'
import User from './User'

const DataDay = () => {
  const [doanhsoday, setdoanhsodatyy] = useState<any>()
  const [doanhsomonth, setdoanhsomonth] = useState<any>()
  const [totalweek, settotalweek] = useState<any>()
  const [day, setday] = useState<any>(false)
  const [week, setweek] = useState<any>(false)
  const [month, setmonth] = useState<any>(false)
  const [khoangngay, setkhoangngay] = useState<any>(false)
  console.log(khoangngay)

  useEffect(() => {
    const fetch = async () => {
      const data = await FillterToday()
      setdoanhsodatyy(data)
    }
    fetch()
  }, [])
  console.log(doanhsoday)

  useEffect(() => {
    const fetch = async () => {
      const data = await FillterWeek()
      settotalweek(data)
    }
    fetch()
  }, [])
  useEffect(() => {
    const fetch = async () => {
      const data = await FillterMonth()
      setdoanhsomonth(data)
    }
    fetch()
  }, [])

  const handleChangeDay = () => {
    setday(true)
    setweek(false)
    setmonth(false)
    setkhoangngay(false)
  }
  const handleChangeWeek = () => {
    setday(false)
    setweek(true)
    setmonth(false)
    setkhoangngay(false)
  }
  const handleChangeMonth = () => {
    setday(false)
    setweek(false)
    setmonth(true)
    setkhoangngay(false)
  }

  const menu = (
    <Menu
      onClick={(e: any) => {
        if (e?.key === 'Ngày') handleChangeDay()
        if (e?.key === 'Tuần') handleChangeWeek()
        if (e?.key === 'Tháng') handleChangeMonth()
      }}
    >
      <Menu.Item key="Ngày">Ngày</Menu.Item>
      <Menu.Item key="Tuần">Tuần</Menu.Item>
      <Menu.Item key="Tháng">Tháng</Menu.Item>
    </Menu>
  )
  const getPeriodLabel = () => {
    if (day) return 'hôm nay'
    if (week) return 'tuần này'
    if (month) return 'tháng này'
    return 'hôm nay'
  }

  const getRevenue = () => {
    if (week) return formatNumber(totalweek?.data?.total_sales_week) + 'đ'
    if (month) return formatNumber(doanhsomonth?.data?.total_sales_week) + 'đ'
    return formatNumber(doanhsoday?.data?.total_sales_today) + 'đ'
  }
  const getRevenuePaid = () => {
    if (week) return formatNumber(totalweek?.data?.online_paid_orders_week)
    if (month) return formatNumber(doanhsomonth?.data?.online_paid_orders_week)
    return formatNumber(doanhsoday?.data?.online_paid_orders_today)
  }
  const getRevenueOrder = () => {
    if (week) return formatNumber(totalweek?.data?.order_count_week)
    if (month) return formatNumber(doanhsomonth?.data?.order_count_week)
    return formatNumber(doanhsoday?.data?.order_count_today)
  }
  const getRevenuePersion = () => {
    if (week) return formatNumber(totalweek?.data?.new_customers_week)
    if (month) return formatNumber(doanhsomonth?.data?.new_customers_week)
    return formatNumber(doanhsoday?.data?.new_customers_today)
  }

  return (
    <div className="rounded border border-gray-200 p-4 ">
      <div className="mb-4 ml-auto flex">
        <h1 className="text-xl font-bold">Dữ liệu {getPeriodLabel()}</h1>
        <Dropdown overlay={menu} trigger={['click']} className=" ml-auto">
          <FileSearchOutlined />
        </Dropdown>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="animate__animated animate__fadeIn rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center">
            <div className="flex-grow overflow-hidden">
              <p className="text-uppercase mb-0 truncate font-medium text-gray-500">
                Doanh số
              </p>
            </div>
            <div className="flex-shrink-0">
              <h5 className="mb-0 text-sm text-green-500">
                {/* <i className="ri-arrow-right-up-line text-xs align-middle"></i> +16.24 % */}
              </h5>
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="mb-4 text-2xl font-semibold">
                <p className="p-2 text-xl font-bold">{getRevenue()}</p>
              </h4>
              {/* <a href="#" className="text-blue-500 underline">View net earnings</a> */}
            </div>
            <div className="flex-shrink-0">
              <span className="inline-block rounded bg-green-100 p-2 text-green-500">
                <i className="bx bx-dollar-circle text-xl"></i>
              </span>
            </div>
          </div>
        </div>

        <Order data={getRevenueOrder()} />

        <User data={getRevenuePersion()} />

        <div className="animate__animated animate__fadeIn rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center">
            <div className="flex-grow overflow-hidden">
              <p className="text-uppercase mb-0 truncate font-medium text-gray-500">
                Đã thanh toán
              </p>
            </div>
            <div className="flex-shrink-0">
              {/* <h5 className="text-gray-500 text-sm mb-0">+0.00 %</h5> */}
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="mb-4 text-2xl font-semibold">
                {getRevenuePaid()}
              </h4>
              <Link to="/admin/orders/paid" className="text-blue-500 underline">
                See details
              </Link>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-block rounded bg-blue-100 p-2 text-blue-500">
                <i className="bx bx-wallet text-xl"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataDay
