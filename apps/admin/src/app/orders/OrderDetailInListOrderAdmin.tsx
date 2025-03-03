import { getBillsDetail } from '@/api/services/Bill'
import { getOrderHistory } from '@/api/services/Order'
import { getUser } from '@/api/services/UserService'
import formatNumber from '@/utilities/FormatTotal'
import { CarOutlined, LeftOutlined, LoadingOutlined } from '@ant-design/icons'
import { Spin, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import HistoryOrder from './HistoryOrder'
import ProductOrderDetailInAdmin from './ProductOrderDetailInAdmin'

const OrderDetailInListOrderAdmin = () => {
  const { id }: any = useParams()
  const [bill, setBill] = useState<any>()
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setloading] = useState(true)
  const [billHistory, setBillHistory] = useState([])
  const fetchOrder = async () => {
    try {
      const data: any = await getBillsDetail(id)
      setBill(data)
    } catch {
    } finally {
      setloading(false)
    }
  }
  const fetchOrderHistory = async () => {
    try {
      const { data } = await getOrderHistory(id)
      const billStory = data.bill_story

      // Iterate through bill_story to fetch user names
      const updatedBillHistory: any = await Promise.all(
        billStory.map(async (bill: any) => {
          const userId = bill.user_id
          const { name } = await getUser(userId)
          return {
            ...bill,
            name: name,
          }
        }),
      )

      setBillHistory(updatedBillHistory)
    } catch (error) {
      console.error('Error fetching order history:', error)
    }
  }
  useEffect(() => {
    fetchOrder()
    fetchOrderHistory()
  }, [])
  console.log(billHistory)

  const ProductInbill = bill?.bill_details?.filter(
    (data: any) => data?.bill_id == id,
  )
  useEffect(() => {
    const totalPrice: any = calculateTotalClick()
    setTotalPrice(totalPrice)
  }, [ProductInbill])

  const calculateTotalClick = () => {
    let total = 0
    if (ProductInbill) {
      ProductInbill.forEach((product: any) => {
        const price = parseFloat(product.price)
        const quantity = parseInt(product.quantity, 10)
        if (!isNaN(price) && !isNaN(quantity)) {
          total += price * quantity
        }
      })
      return total
    }
  }
  const [color, setcolor] = useState<any>()
  const [status, setstatus] = useState<any>()

  useEffect(() => {
    if (bill?.status == 'Pending') {
      setcolor('warning')
      setstatus('Chờ xác nhận')
    } else if (bill?.status == 'Confirm') {
      setcolor('processing')
      setstatus('Chờ giao hàng')
    } else if (bill?.status == 'Paid') {
      setcolor('brown')
      setstatus('Chờ xác nhận')
    } else if (bill?.status == 'Shipping') {
      setcolor('purple')
      setstatus('Đang giao hàng')
    } else if (bill?.status == 'Done') {
      setcolor('green')
      setstatus('Hoàn thành')
    } else if (bill?.status == 'Cancel') {
      setcolor('error')
      setstatus('Hủy hàng')
    }
  }, [bill])
  const parts = bill?.Recipient_address
    ? bill?.Recipient_address?.split(';').map((part: any) => part.trim())
    : ''
  const [name, descbill, address] = parts
  console.log(billHistory)

  return (
    <>
      <div className="w-full bg-gray-200 p-5 pl-10 pr-10">
        <div className="w-full">
          <div className="flex">
            <Link to="/admin/quan-ly-orders">
              <button>
                <LeftOutlined /> Quay lại
              </button>
            </Link>
          </div>
          {loading ? (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100px',
                }}
              >
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mt-10 flex">
                <span className="text-2xl font-bold">
                  CHI TIẾT ĐƠN HÀNG #{bill?.id}
                </span>
                <Tag color={color} className="ml-auto mt-1 text-sm font-bold">
                  {status}
                </Tag>
              </div>
              <div className="mt-5 flex w-full">
                <div className="mr-2 w-1/3 ">
                  <span className="text-sl font-bold">Địa chỉ người nhận</span>
                  <div
                    className="mt-2 bg-gray-100 p-5"
                    style={{ minHeight: '200px' }}
                  >
                    <span className="font-bold">
                      {name != 'undefined' ? name : ''}
                    </span>
                    <p>Địa chỉ: {address}</p>
                    <p>Điện thoại: {bill?.Recipient_phone}</p>
                  </div>
                </div>
                <div className="mr-2 w-1/3">
                  <span className="text-sl font-bold">Hình thức giao hàng</span>
                  <div
                    className="mt-2 bg-gray-100 p-5"
                    style={{ minHeight: '200px' }}
                  >
                    <span className="font-bold">
                      {name != 'undefined' ? name : ''}
                    </span>
                    <p className="mb-2">
                      <CarOutlined />
                      Giao hàng tại nhà
                    </p>
                    <span className="">Ghi chú đơn hàng: {descbill}</span>
                  </div>
                </div>
                <div className="mr-2 w-1/3 ">
                  <span className="text-sl font-bold">
                    Hình thức thanh toán
                  </span>
                  <div
                    className="mt-2 bg-gray-100 p-5"
                    style={{ minHeight: '200px' }}
                  >
                    <span className="">
                      Hình thức thanh toán đơn hàng ({bill?.pay})
                    </span>
                  </div>
                </div>
              </div>
              <div className="mb-4 mt-4">
                <span className="text-xl font-bold">THÔNG TIN SẢN PHẨM</span>
                <span text-sm className="text-red-500">
                  ({ProductInbill?.length} sản phẩm)
                </span>
              </div>
              <div className="w-full">
                <table className="mb-10 w-full bg-gray-100">
                  <thead>
                    <th className="p-2">Tên Hàng</th>
                    <th className="p-2">Giá</th>
                    <th className="p-2">Số Lượng</th>
                    <th className="p-2">Tạm Tính</th>
                  </thead>
                  <tbody className="bg-white text-center align-middle">
                    {loading ? (
                      <>
                        <div className="flex h-24 items-center justify-center">
                          <Spin
                            indicator={
                              <LoadingOutlined
                                style={{
                                  fontSize: 48,
                                }}
                                spin
                              />
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {bill?.bill_details?.map((data: any) => {
                          return (
                            <>
                              <ProductOrderDetailInAdmin
                                data={data}
                                loading={loading}
                              />
                            </>
                          )
                        })}
                      </>
                    )}
                  </tbody>
                </table>

                <hr className="my-4 ml-2 mr-2 w-full border-t border-dashed border-gray-400" />
                <div className="flex">
                  <p className="text-sm">Tổng cộng</p>
                  <p className="mb-2 ml-auto text-xl font-bold text-red-500">
                    {formatNumber(totalPrice)} đ
                  </p>
                </div>
                <div className="flex">
                  <p className="text-sm">Giảm giá</p>
                  <p className="mb-2 ml-auto text-xl font-bold text-red-500">
                    -{formatNumber(totalPrice - Number(bill?.total_amount))} đ
                  </p>
                </div>
                <div className="flex">
                  <p className="text-sm">Giao hàng</p>
                  <p className="mb-2 ml-auto text-xl font-bold text-red-500">
                    +{formatNumber(30000)} đ
                  </p>
                </div>
                <div className="flex">
                  <p className="text-xl">Thành tiền</p>
                  <p className="mb-20 ml-auto text-3xl font-bold text-red-500">
                    {formatNumber(Number(bill?.total_amount) + 30000)} đ
                  </p>
                </div>
              </div>
              <div className="mb-4 mt-4">
                <span className="text-xl font-bold">
                  LỊCH SỬ UPDATE ĐƠN HÀNG
                </span>
              </div>
              <div>
                <table className="mb-10 w-full bg-gray-200">
                  <thead>
                    <tr>
                      {/* <th className="p-2">Người hành động</th> */}
                      <th className="p-2">Nội dung hành động</th>
                      <th className="p-2">Thời gian hành động</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-center align-middle">
                    {billHistory?.map((item: any, index: any) => {
                      return <HistoryOrder key={index} data={item} />
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default OrderDetailInListOrderAdmin
