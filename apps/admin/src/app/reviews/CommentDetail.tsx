import { DeleteComment } from '@/api/services/Comment'
import { getUser } from '@/api/services/UserService'
import { Button, Popconfirm } from 'antd'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const CommentDetail = ({ data, onCheck }: any) => {
  const [user, setuser] = useState<any>()
  useEffect(() => {
    const getUsers = async () => {
      const response = await getUser(data?.user_id)
      setuser(response)
    }
    getUsers()
  }, [])
  const users = JSON.parse(localStorage.getItem('user')!)
  const confirm = async (id: any) => {
    await DeleteComment(id, users?.token)
    toast.success('Thành công!')
    onCheck(id)
  }
  return (
    <tr key={data?.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {data?.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user?.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {data?.created_at}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {data?.description}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Popconfirm
          title="Xóa bình luận"
          description="Bạn có muốn xóa bình luận này không?"
          onConfirm={() => confirm(data?.id)}
          // onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      </td>
    </tr>
  )
}

export default CommentDetail
