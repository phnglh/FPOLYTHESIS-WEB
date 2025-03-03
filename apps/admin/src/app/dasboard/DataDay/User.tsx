import { Link } from 'react-router-dom'

const User = ({ data }: any) => {
  return (
    <>
      <div className="animate__animated animate__fadeIn rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center">
          <div className="flex-grow overflow-hidden">
            <p className="text-uppercase mb-0 truncate font-medium text-gray-500">
              Khách hàng
            </p>
          </div>
          <div className="flex-shrink-0">
            <h5 className="mb-0 text-sm text-green-500"></h5>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="mb-4 text-2xl font-semibold">{data} User</h4>
            <Link
              to="/admin/quan-ly-nguoi-dung"
              className="text-blue-500 underline"
            >
              See details
            </Link>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-block rounded bg-yellow-100 p-2 text-yellow-500">
              <i className="bx bx-user-circle text-xl"></i>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default User
