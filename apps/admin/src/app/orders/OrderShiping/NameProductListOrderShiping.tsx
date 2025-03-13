import { addHistoryBills, updateDone } from '@/api/services/Bill'
import formatNumber from '@/utilities/FormatTotal'
import { Tag } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const NameProductListOrderShiping = ({ data, onCheck }: any) => {
  // const billsProduct = billdetail?.find((item: any) => item?.bill_id == data?.id)
  const [color, setcolor] = useState<any>()
  const [status, setstatus] = useState<any>()
  useEffect(() => {
    if (data?.status == 'Shipping') {
      setcolor('purple')
      setstatus('Đang giao hàng')
    }
  }, [data])
  const user = JSON.parse(localStorage.getItem('user')!)
  const HandleDone = async (id: any) => {
    const check = confirm('Bạn có chắc chắn đơn hàng này khách hàng đã nhận?')
    if (check == true) {
      const data1 = {
        bill_id: data?.id,
        user_id: user?.data?.id,
        description: `Admin xác nhận khách hàng đã nhận được đơn hàng`,
      }
      await updateDone(id).then(async () => {
        await addHistoryBills(data1).then(() => {
          toast.success('Đơn hàng đã hoàn thành')
          setcolor('green')
          setstatus('Hoàn thành')
          onCheck(data?.id)
        })
      })
    }
  }
  const total: any = Number(data?.total_amount)
  return (
    <>
      <tr
        className="h-36 items-center justify-center border border-gray-300 p-2"
        key={data?.id}
      >
        <td className="p-2 text-center font-normal">{data?.id}</td>

        <td className="p-2 text-center font-normal" style={{ width: '20%' }}>
          <span className="font-bold">Đ/c</span>: {data?.Recipient_address}
          <br />
          <span className="font-bold">Sđt</span>: {data?.Recipient_phone}
        </td>
        <td className="p-2 text-center font-normal " style={{ width: '10%' }}>
          {formatNumber(total + 30000)} đ
        </td>
        <td className="p-2 text-center font-normal">
          {data?.created_at.substring(0, 19)}
        </td>
        <td className="p-2 text-center font-normal"> {data?.pay}</td>
        <td className="p-2 text-center font-normal">
          <Tag color={color}>{status}</Tag>
        </td>
        <td className="p-2 font-normal" style={{ width: '10%' }}>
          {/* <button className="mb-1 w-24 rounded bg-red-500 p-1 text-white">
                                Không nhận
                            </button> */}
          <button
            className="mb-1 w-24 rounded bg-blue-500 p-1 text-white"
            onClick={() => HandleDone(data?.id)}
          >
            Đã nhận hàng
          </button>
          <Link to={`/admin/quan-ly-orders/${data?.id}`}>
            <button className="w-24 rounded border border-gray-300 bg-white p-1 text-black ">
              Chi tiết
            </button>
          </Link>
        </td>
      </tr>
    </>
  )
}
export default NameProductListOrderShiping
