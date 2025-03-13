import formatNumber from '@/utilities/FormatTotal'
import { Tag } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const NameProductListOrderCancel = ({ data }: any) => {
  // const billsProduct = billdetail?.find((item: any) => item?.bill_id == data?.id)
  const [color, setcolor] = useState<any>()
  const [status, setstatus] = useState<any>()
  useEffect(() => {
    if (data?.status == 'Cancel') {
      setcolor('error')
      setstatus('Hủy hàng')
    }
  }, [data])
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

export default NameProductListOrderCancel
