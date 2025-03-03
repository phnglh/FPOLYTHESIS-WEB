import { Link } from 'react-router-dom'

const Order = ({ data }: any) => {
  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-6 animate__animated animate__fadeIn">
        <div className="flex items-center">
          <div className="flex-grow overflow-hidden">
            <p className="text-uppercase font-medium text-gray-500 truncate mb-0">
              Đơn hàng
            </p>
          </div>
          <div className="flex-shrink-0">
            <h5 className="text-red-500 text-sm mb-0"></h5>
          </div>
        </div>
        <div className="flex items-end justify-between mt-4">
          <div>
            <h4 className="text-2xl font-semibold mb-4">{data}</h4>
            <Link
              to="/admin/quan-ly-orders"
              className="text-blue-500 underline"
            >
              View all orders
            </Link>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-block p-2 bg-blue-100 rounded text-blue-500">
              <i className="bx bx-shopping-bag text-xl"></i>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Order
