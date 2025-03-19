import {
  RemoveVoucher,
  addVoucher,
  getAllVoucher,
} from '@/api/services/Voucher'
import formatNumber from '@/utilities/FormatTotal'
import { Button, Form, Input, Modal, Popconfirm } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

const ListVoucher = () => {
  const [vouchers, setvouchers] = useState<any>()
  const [namevoucher, setnamevoucher] = useState<any>()
  const [discountvoucher, setdiscountvoucher] = useState<any>()
  const [limitvoucher, setlimitvoucher] = useState<any>()
  const [check, setcheck] = useState<any>()
  useEffect(() => {
    const fetchVoucher = async () => {
      const response = await getAllVoucher()
      setvouchers(response)
    }
    fetchVoucher()
  }, [check])
  const formRef: any = useRef(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = async () => {
    if (!namevoucher || !discountvoucher || !limitvoucher) {
      return
    }
    const data = {
      voucher_code: namevoucher,
      expiration_date: '2025-07-20',
      discount_amount: discountvoucher,
      minimum_purchase: 100,
      status: 1,
      usage_limit: limitvoucher,
      description: 'voucher',
    }
    const response = await addVoucher(data)
    if (response) {
      setIsModalOpen(false)
      setcheck(response)
      toast.success('Thành công')
      setTimeout(() => {
        window.location.reload()
      }, 300)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const HandleDelete = async (id: any) => {
    const response = await RemoveVoucher(id)
    toast.success('Thành công')
    setcheck(response)
  }
  return (
    <>
      <button
        type="button"
        className="focus:shadow-outline mb-2 rounded bg-blue-500 px-4 py-1 font-bold text-white transition duration-150 ease-in-out hover:bg-blue-700 focus:outline-none"
        onClick={showModal}
      >
        Thêm
      </button>
      <Modal
        title="Thêm voucher"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form ref={formRef}>
          <Form.Item
            name="voucher_code"
            rules={[
              {
                required: true,
                message: 'Không được để trống tên ',
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Nhập tên voucher"
              onChange={(e: any) => setnamevoucher(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="discount_amount"
            rules={[
              {
                required: true,
                message: 'Không được để trống phần trăm ',
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Phần trăm giảm giá"
              onChange={(e: any) => setdiscountvoucher(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="usage_limit"
            rules={[
              {
                required: true,
                message: 'Không được để trống giới hạn ',
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Giới hạn sử dụng voucher"
              onChange={(e: any) => setlimitvoucher(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Voucher code
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Số lượng
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Phần trăm giảm
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
          {vouchers
            ? vouchers?.data?.map((data: any) => {
                return (
                  <>
                    <tr key={data.id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <a href="#" className="font-semibold text-blue-600">
                          #{data?.id}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {data?.voucher_code}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {data?.usage_limit}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {formatNumber(data?.discount_amount)}%
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {' '}
                        <Popconfirm
                          title="Bạn có chắc chắn muốn xóa?"
                          onConfirm={() => HandleDelete(data?.id)}
                          // onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button>Xóa</Button>
                        </Popconfirm>
                      </td>
                    </tr>
                  </>
                )
              })
            : ''}
        </tbody>
      </table>
    </>
  )
}

export default ListVoucher
