import { gettrangthaiDay } from '@/api/services/Dashboard'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const OrderDay = () => {
  const [trangthaiday, setdoanhsodatyy] = useState<any>()
  console.log(trangthaiday)

  useEffect(() => {
    const fetch = async () => {
      const data = await gettrangthaiDay()
      setdoanhsodatyy(data)
    }
    fetch()
  }, [])
  const trangthaiDone = trangthaiday?.find(
    (data: any) => data?.status == 'Shipping',
  )?.total_bill
  const trangthaiPending = trangthaiday?.find(
    (data: any) => data?.status == 'Pending',
  )?.total_bill
  const trangthaiConfirm = trangthaiday?.find(
    (data: any) => data?.status == 'Confirm',
  )?.total_bill
  return (
    <>
      <div className="order-first col-span-full xl:order-none xl:col-span-9">
        <div className="flex h-full flex-col">
          <div className="flex h-full flex-wrap">
            <div className="md:w-1/2 lg:w-1/3 ">
              <div className="rounded-lg bg-white shadow">
                <div className="p-10">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="bg-light text-primary flex h-12 w-12 items-center justify-center rounded-full text-3xl">
                        <i className="ri-file-list-fill"></i>
                      </span>
                    </div>
                    <div className="ml-3 flex-grow">
                      <p className="text-muted mb-1 text-xs font-semibold uppercase">
                        Chờ Xác Nhận
                      </p>
                      <h4 className="mb-0">
                        <span className="counter-value text-xl font-bold">
                          {trangthaiPending ? trangthaiPending : 0}
                        </span>
                      </h4>
                    </div>
                    <div className="flex-shrink-0 self-end">
                      <Link
                        to="/admin/orders/pending"
                        className="bg-success-subtle text-success rounded px-2 py-1"
                      >
                        <i className="ri-arrow-up-s-fill mr-1 align-middle"></i>
                        xem
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pl-2 pr-2 md:w-1/2 lg:w-1/3">
              <div className="rounded-lg bg-white shadow">
                <div className="p-10">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="bg-light text-primary flex h-12 w-12 items-center justify-center rounded-full text-3xl">
                        <i className=" ri-shopping-cart-2-fill"></i>
                      </span>
                    </div>
                    <div className="ml-3 flex-grow">
                      <p className="text-muted mb-1 text-xs font-semibold uppercase">
                        Chờ Vận Chuyển
                      </p>
                      <h4 className="mb-0">
                        <span className="counter-value text-xl font-bold">
                          {trangthaiConfirm ? trangthaiConfirm : 0}
                        </span>
                      </h4>
                    </div>
                    <div className="flex-shrink-0 self-end">
                      <Link
                        to="/admin/orders/confirm"
                        className="bg-success-subtle text-success rounded px-2 py-1"
                      >
                        <i className="ri-arrow-up-s-fill mr-1 align-middle"></i>
                        xem
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 lg:w-1/3 ">
              <div className="rounded-lg bg-white shadow">
                <div className="p-10">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="bg-light text-primary flex h-12 w-12 items-center justify-center rounded-full text-3xl">
                        <i className=" ri-truck-fill"></i>
                      </span>
                    </div>
                    <div className="ml-3 flex-grow">
                      <p className="text-muted mb-1 text-xs font-semibold uppercase">
                        Đang vận chuyển
                      </p>
                      <h4 className="mb-0">
                        <span className="counter-value text-xl font-bold">
                          {trangthaiDone ? trangthaiDone : 0}
                        </span>
                      </h4>
                    </div>
                    <div className="flex-shrink-0 self-end">
                      <Link
                        to="/admin/orders/shipping"
                        className="bg-danger-subtle text-danger rounded px-2 py-1"
                      >
                        <i className="ri-arrow-down-s-fill mr-1 align-middle"></i>
                        xem
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDay
