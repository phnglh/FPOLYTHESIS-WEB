import { getUserTop } from '@/api/services/Dashboard'
import { Select } from 'antd'
import { useEffect, useState } from 'react'
import UserIntopUser from './UserIntopUser'

const TopUser = () => {
  const [top, settop] = useState<any>(3)
  const [user, setproduct] = useState<any>()
  useEffect(() => {
    const fetch = async () => {
      const data = await getUserTop(top)
      setproduct(data)
    }
    fetch()
  }, [top])
  // console.log(product);
  return (
    <>
      <div>
        <div className="flex bg-gray-200 p-4 ">
          <span className="font-bold">Top người dùng</span>
          <Select
            className="ml-auto"
            defaultValue="3 người dùng"
            style={{ width: 120 }}
            onChange={(e: any) => settop(e)}
            options={[
              { value: '3', label: '3 người dùng ' },
              { value: '4', label: '4 người dùng' },
              { value: '5', label: '5 người dùng ' },
              { value: '6', label: '6 người dùng ' },
              { value: '7', label: '7 người dùng' },
              { value: '8', label: '8 người dùng' },
              { value: '9', label: '9 người dùng' },
              { value: '10', label: '10 người dùng ' },
            ]}
          />
        </div>
        <UserIntopUser data={user} />
      </div>
    </>
  )
}

export default TopUser
