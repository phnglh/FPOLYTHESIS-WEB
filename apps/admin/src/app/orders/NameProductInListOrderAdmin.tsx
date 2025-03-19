import {
  addHistoryBills,
  updateCancel,
  updateConfirm,
  updateDone,
  updateShiping,
} from '@/api/services/Bill'
import formatNumber from '@/utilities/FormatTotal'
import { Tag } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const NameProductInListOrderAdmin = ({ data, onCheck }: any) => {
  const [check, setcheck] = useState<any>()
  const [color, setcolor] = useState<any>()
  const [status, setstatus] = useState<any>()
  const user = JSON.parse(localStorage.getItem('user')!)

  useEffect(() => {
    if (data?.status == 'Pending') {
      setcolor('warning')
      setstatus('Chờ xác nhận')
      setcheck('Pending')
    } else if (data?.status == 'Confirm') {
      setcolor('processing')
      setstatus('Đã xác nhận')
      setcheck('Confirm')
    } else if (data?.status == 'Paid') {
      setcolor('brown')
      setstatus('Chờ lấy hàng')
      setcheck('Paid')
    } else if (data?.status == 'Shipping') {
      setcolor('purple')
      setstatus('Đang giao hàng')
      setcheck('Shipping')
    } else if (data?.status == 'Done') {
      setcolor('green')
      setstatus('Hoàn thành')
      setcheck('Done')
    } else if (data?.status == 'Cancel') {
      setcolor('error')
      setstatus('Hủy hàng')
      setcheck('Cancel')
    }
  }, [data])
  const HandleCancel = async (id: any) => {
    let input: any = ''
    while (input.trim() === '') {
      input = window.prompt('Lý do hủy đơn hàng:')
      if (input === null) {
        return
      }
      if (input.trim() !== '') {
        const data1 = {
          bill_id: data?.id,
          user_id: user?.data?.id,
          description: `Admin xác nhận hủy đơn hàng; Lý do: ${input}`,
        }
        await updateCancel(id).then(async () => {
          await addHistoryBills(data1).then(() => {
            toast.success('Bạn đã hủy đơn hàng')
            setcolor('error')
            setstatus('Hủy hàng')
            setcheck(false)
            onCheck(data?.id)
          })
        })
        return
      } else {
        alert('Vui lòng nhập lý do hủy đơn hàng.')
      }
    }
  }
  const HandleConfirm = async (id: any) => {
    const check = confirm('Bạn chắc chắn muốn xác nhận đơn hàng này?')
    if (check == true) {
      const data1 = {
        bill_id: data?.id,
        user_id: user?.data?.id,
        description: `Admin xác nhận đơn hàng`,
      }
      await updateConfirm(id).then(async () => {
        await addHistoryBills(data1).then(() => {
          toast.success('Bạn đã xác nhận đơn hàng')
          setcolor('processing')
          setstatus('Chờ giao hàng')
          setcheck(false)
          onCheck(data?.id)
        })
      })
    }
  }
  const parts = data?.Recipient_address
    ? data?.Recipient_address?.split(';').map((part: any) => part.trim())
    : ''
  const [address] = parts
  const total: any = Number(data?.total_amount)
  const HandleShiping = async (id: any) => {
    const check = confirm('Bạn có chắc chắn shiper đã lấy hàng?')
    if (check == true) {
      const data1 = {
        bill_id: data?.id,
        user_id: data?.user_id,
        description: `Admin xác nhận đơn hàng đã được shiper lấy`,
      }
      await updateShiping(id).then(async () => {
        await addHistoryBills(data1).then(() => {
          toast.success('Đơn hàng đã được chuyển sang đang vận chuyển')
          setcolor('purple')
          setstatus('Đang giao hàng')
          setcheck(false)
          onCheck(data?.id)
        })
      })
    }
  }
  const HandleDone = async (id: any) => {
    const check = confirm('Bạn có chắc chắn đơn hàng này khách hàng đã nhận?')
    if (check == true) {
      const data1 = {
        bill_id: data?.id,
        user_id: data?.user_id,
        description: `Admin xác nhận khách hàng đã nhận được đơn hàng`,
      }
      await updateDone(id).then(async () => {
        await addHistoryBills(data1).then(() => {
          toast.success('Đơn hàng đã hoàn thành')
          setcolor('green')
          setstatus('Hoàn thành')
          setcheck(false)
          onCheck(data?.id)
        })
      })
    }
  }
  return (
    <>
      <tr
        className="h-36 items-center justify-center border border-gray-300"
        key={data?.id}
      >
        <td className=" text-center font-normal">{data?.id}</td>
        <td className="p-2 text-center font-normal" style={{ width: '20%' }}>
          <span className="font-bold">Đ/c</span>: {address}
          <br />
          <span className="font-bold">Sđt</span>: {data?.Recipient_phone}
        </td>
        <td className="p-2 text-center font-normal " style={{ width: '10%' }}>
          {formatNumber(total + 30000)} đ
        </td>
        <td className="p-2 text-center font-normal">
          {data?.created_at.substring(0, 19)}
        </td>
        <td className="p-2 text-center font-normal">{data?.pay}</td>
        <td className="p-2 text-center font-normal">
          <Tag color={color}>{status}</Tag>
        </td>
        <td className="p-2 font-normal" style={{ width: '10%' }}>
          {check == 'Pending' ? (
            <>
              <button
                className="mb-1 w-24 rounded bg-red-500 p-1 text-white"
                onClick={() => HandleCancel(data?.id)}
              >
                Hủy
              </button>
              <button
                className="mb-1 w-24 rounded bg-blue-500 p-1 text-white"
                onClick={() => HandleConfirm(data?.id)}
              >
                Xác nhận
              </button>
              <Link to={`/admin/quan-ly-orders/${data?.id}`}>
                <button className="w-24 rounded border border-gray-300 bg-white p-1 text-black ">
                  Chi tiết
                </button>
              </Link>
            </>
          ) : (
            ''
          )}
          {check == 'Paid' ? (
            <>
              {/* <button
                                className="mb-1 w-24 rounded bg-red-500 p-1 text-white"
                                onClick={() => HandleCancel(data?.id)}
                            >
                                Hủy
                            </button> */}
              <button
                className="mb-1 w-24 rounded bg-blue-500 p-1 text-white"
                onClick={() => HandleShiping(data?.id)}
              >
                Giao hàng
              </button>
              <Link to={`/admin/quan-ly-orders/${data?.id}`}>
                <button className="w-24 rounded border border-gray-300 bg-white p-1 text-black ">
                  Chi tiết
                </button>
              </Link>
            </>
          ) : (
            ''
          )}
          {check == 'Confirm' ? (
            <>
              <button
                className="mb-1 w-24 rounded bg-blue-500 p-1 text-white"
                onClick={() => HandleShiping(data?.id)}
              >
                Giao hàng
              </button>
              <Link to={`/admin/quan-ly-orders/${data?.id}`}>
                <button className="w-24 rounded border border-gray-300 bg-white p-1 text-black ">
                  Chi tiết
                </button>
              </Link>
            </>
          ) : (
            ''
          )}
          {check == 'Shipping' ? (
            <>
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
            </>
          ) : (
            ''
          )}
          {check == 'Done' ? (
            <>
              <Link to={`/admin/quan-ly-orders/${data?.id}`}>
                <button className="w-24 rounded border border-gray-300 bg-white p-1 text-black ">
                  Chi tiết
                </button>
              </Link>
            </>
          ) : (
            ''
          )}
          {check == 'Cancel' ? (
            <>
              <Link to={`/admin/quan-ly-orders/${data?.id}`}>
                <button className="w-24 rounded border border-gray-300 bg-white p-1 text-black ">
                  Chi tiết
                </button>
              </Link>
            </>
          ) : (
            ''
          )}
        </td>
      </tr>
    </>
  )
}

export default NameProductInListOrderAdmin
