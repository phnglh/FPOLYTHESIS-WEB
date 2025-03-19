import { SearchBillByPhone, getAllBill } from '@/api/services/Bill' // Adjust the import path as per your project structure
import { LoadingOutlined } from '@ant-design/icons'
import { Button, Input, Pagination, Spin } from 'antd'
import 'moment/locale/vi' // Import the Vietnamese locale
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NameProductInListOrderAdmin from './NameProductInListOrderAdmin'

const { Search } = Input

const ListOrderAdmin = () => {
  const [bill, setBill] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const [filterStatus] = useState<string>('')
  const [set, setset] = useState<any>()
  const fetchBills = async () => {
    try {
      const allBills: any = await getAllBill()
      setBill(allBills)
    } catch (error) {
      console.error('Error fetching bills:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBills()
  }, [set])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = bill?.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  const [searchBill, setsearchBill] = useState<any>([])
  const [check, setcheck] = useState<any>(false)

  const handleSearch = async (value: string) => {
    setcheck(true)
    const response = await SearchBillByPhone(value)
    setsearchBill(response)
    console.log(response)
    if (response) {
      setsearchBill(response)
    } else {
      alert('Không tìm thấy đơn hàng')
    }
  }
  const render = (value: any) => {
    setset(value)
  }
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex space-x-4">
          <Link to="/admin/orders/all">
            {' '}
            <Button value="" className="bg-blue-600 text-white">
              Tất cả đơn hàng
            </Button>
          </Link>
          <Link to="/admin/orders/paid">
            {' '}
            <Button value="paid">Đã thanh toán</Button>
          </Link>
          <Link to="/admin/orders/pending">
            <Button value="pending">Chờ xác nhận</Button>
          </Link>
          <Link to="/admin/orders/confirm">
            {' '}
            <Button value="confirmed">Đã xác nhận</Button>
          </Link>
          <Link to="/admin/orders/shipping">
            <Button value="shipping">Đang giao</Button>
          </Link>
          <Link to="/admin/orders/done">
            {' '}
            <Button value="delivered">Đã giao</Button>
          </Link>
          <Link to="/admin/orders/cancel">
            {' '}
            <Button value="cancelled">Đã hủy</Button>
          </Link>
        </div>
        <Search
          placeholder="Tìm kiếm theo số điện thoại đơn hàng"
          onSearch={handleSearch}
          className="w-1/4"
        />
      </div>

      {loading ? (
        <div className="flex h-24 items-center justify-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      ) : (
        <>
          {filterStatus === '' && (
            <table className="file: w-full border border-gray-300 bg-gray-100 text-sm text-black">
              <thead className="text-center align-middle">
                <tr>
                  <th className="p-2">ID</th>
                  {/* <th className="p-2">Tên sản phẩm</th>
                                    <th className="p-2">Ảnh</th> */}
                  <th className="p-2">Địa chỉ/Sđt</th>
                  <th className="p-2">Giá</th>
                  <th className="p-2">Ngày</th>
                  <th className="p-2">Hình thức</th>
                  <th className="p-2">Trạng thái</th>
                  <th className="p-2">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {check
                  ? ''
                  : currentItems?.map((data: any) => (
                      <NameProductInListOrderAdmin
                        key={data.id}
                        data={data}
                        onCheck={render}
                      />
                    ))}
                {searchBill != undefined
                  ? searchBill?.data?.map((data: any) => (
                      <NameProductInListOrderAdmin key={data.id} data={data} />
                    ))
                  : currentItems?.map((data: any) => (
                      <NameProductInListOrderAdmin key={data.id} data={data} />
                    ))}
              </tbody>
            </table>
          )}
          {filterStatus === '' && (
            <div className="mt-5 flex items-center justify-center">
              <Pagination
                current={currentPage}
                total={bill?.length}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
              />
            </div>
          )}

          {/* {filterStatus === "paid" && <ListOrderPaid />}
                        {filterStatus === "pending" && <ListOrderPending />}
                        {filterStatus === "confirmed" && <ListOrderConFirm />}
                        {filterStatus === "shipping" && <ListOrderSiping />}
                        {filterStatus === "delivered" && <ListOrderDones />}
                        {filterStatus === "cancelled" && <ListOrderCancel />} */}
        </>
      )}
    </>
  )
}

export default ListOrderAdmin
