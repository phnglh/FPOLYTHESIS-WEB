import { GetAllComment } from '@/api/services/Comment'
import { useEffect, useState } from 'react'
import CommentDetail from './CommentDetail'

const ListComment = () => {
  const [cmt, setcmt] = useState<any>()
  const [check, setcheck] = useState<any>()
  useEffect(() => {
    const getComment = async () => {
      const response = await GetAllComment()
      setcmt(response)
    }
    getComment()
  }, [check])
  const checks = (value: any) => {
    setcheck(value)
  }
  return (
    <>
      <h1 className="p-4 text-xl font-bold">Danh sách bình luận</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Id
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Người dùng
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Thời gian
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Nội dung
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {cmt
            ? cmt?.map((data: any) => {
                return <CommentDetail data={data} onCheck={checks} />
              })
            : ''}
        </tbody>
      </table>
    </>
  )
}

export default ListComment
