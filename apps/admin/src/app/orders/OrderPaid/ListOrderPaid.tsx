import { getBillPaid } from '@/api/services/Bill'
import { LoadingOutlined } from '@ant-design/icons'
import { Button, Pagination, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NameProductListOrderPaid from './NameProductListOrderPaid'

const ListOrderPaid = () => {
  const [bill, setbill] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const [check1, setcheck] = useState<boolean>()
  const fetchBills = async () => {
    try {
      const allBills: any = await getBillPaid()
      setbill(allBills)
    } catch {
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchBills()
  }, [check1])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = bill?.slice(indexOfFirstItem, indexOfLastItem)
  const handlePageChange = (page: any) => {
    setCurrentPage(page)
  }
  const check = (key: any) => {
    setcheck(key)
  }
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex space-x-4">
          <Link to="/admin/orders/all">
            {' '}
            <Button value="">Tất cả đơn hàng</Button>
          </Link>
          <Link to="/admin/orders/paid">
            {' '}
            <Button value="paid" className="bg-blue-600 text-white">
              Đã thanh toán
            </Button>
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
      </div>
      <table className="w-full border border-gray-300 bg-gray-100 text-sm text-black">
        <thead className="text-center align-middle">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Địa chỉ/Sđt</th>
            <th className="p-2">Giá</th>
            <th className="p-2">Ngày</th>
            <th className="p-2">Hình thức</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {loading ? (
            <tr>
              <td colSpan={9}>
                <div className="flex h-24 items-center justify-center">
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 48 }} spin />
                    }
                  />
                </div>
              </td>
            </tr>
          ) : (
            currentItems?.map((data: any) => (
              <NameProductListOrderPaid
                key={data.id}
                data={data}
                onCheck={check}
              />
            ))
          )}
        </tbody>
      </table>
      <div className="mt-5 flex items-center justify-center">
        <Pagination
          current={currentPage}
          total={bill?.length}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
        />
      </div>
    </>
  )
}

export default ListOrderPaid
