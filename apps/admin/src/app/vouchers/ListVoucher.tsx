import apiClient from '@store/services/apiClient'
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  DatePicker,
  Checkbox,
} from 'antd'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

const { Option } = Select

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState<any[]>([])
  const [check, setCheck] = useState<any>()
  const formRef = useRef<any>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchVoucher = async () => {
      const response = await apiClient.get('/vouchers')
      setVouchers(response.data.data)
    }
    fetchVoucher()
  }, [check])

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    try {
      const values = await formRef.current.validateFields()
      const data = {
        code: values.code,
        type: values.type,
        discount_value: values.discount_value,
        min_order_value: values.min_order_value,
        usage_limit: values.usage_limit,
        start_date: values.start_date.format('YYYY-MM-DD'),
        end_date: values.end_date.format('YYYY-MM-DD'),
        is_active: values.is_active ? 1 : 0,
      }

      const response = await apiClient.post('/vouchers', data)
      if (response) {
        setIsModalOpen(false)
        setCheck(response)
        toast.success('Thêm voucher thành công')
        formRef.current.resetFields()
        setTimeout(() => {
          window.location.reload()
        }, 300)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm voucher')
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    formRef.current.resetFields()
  }

  const handleDelete = async (id: any) => {
    const response = await apiClient.delete(`/vouchers/${id}`)
    toast.success('Xóa voucher thành công')
    setCheck(response)
  }

  return (
    <>
      <Button type="primary" className="mb-2" onClick={showModal}>
        Thêm Voucher
      </Button>
      <Modal
        title="Thêm Voucher"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form ref={formRef} layout="vertical">
          <Form.Item
            name="code"
            label="Mã Voucher"
            rules={[{ required: true, message: 'Vui lòng nhập mã voucher' }]}
          >
            <Input placeholder="Nhập mã voucher" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại Voucher"
            rules={[{ required: true, message: 'Vui lòng chọn loại voucher' }]}
          >
            <Select placeholder="Chọn loại voucher">
              <Option value="percentage">Phần trăm</Option>
              <Option value="fixed">Cố định</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="discount_value"
            label="Giá trị giảm giá"
            rules={[
              { required: true, message: 'Vui lòng nhập giá trị giảm giá' },
            ]}
          >
            <Input type="number" placeholder="Nhập giá trị giảm giá" />
          </Form.Item>
          <Form.Item
            name="min_order_value"
            label="Giá trị đơn hàng tối thiểu"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập giá trị đơn hàng tối thiểu',
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Nhập giá trị đơn hàng tối thiểu"
            />
          </Form.Item>
          <Form.Item
            name="usage_limit"
            label="Giới hạn sử dụng"
            rules={[
              { required: true, message: 'Vui lòng nhập giới hạn sử dụng' },
            ]}
          >
            <Input type="number" placeholder="Nhập giới hạn sử dụng" />
          </Form.Item>
          <Form.Item
            name="start_date"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="end_date"
            label="Ngày kết thúc"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" valuePropName="checked">
            <Checkbox>Kích hoạt</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Mã
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Loại
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Giá trị giảm
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Đơn hàng tối thiểu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Giới hạn
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Đã dùng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Ngày bắt đầu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Ngày kết thúc
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {vouchers?.map((data: any) => (
            <tr key={data.id}>
              <td className="whitespace-nowrap px-6 py-4">
                <a href="#" className="font-semibold text-blue-600">
                  #{data.id}
                </a>
              </td>
              <td className="whitespace-nowrap px-6 py-4">{data.code}</td>
              <td className="whitespace-nowrap px-6 py-4">
                {data.type === 'percentage' ? 'Phần trăm' : 'Cố định'}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {data.discount_value}
                {data.type === 'percentage' ? '%' : ''}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {data.min_order_value}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {data.usage_limit}
              </td>
              <td className="whitespace-nowrap px-6 py-4">{data.used_count}</td>
              <td className="whitespace-nowrap px-6 py-4">{data.start_date}</td>
              <td className="whitespace-nowrap px-6 py-4">{data.end_date}</td>
              <td className="whitespace-nowrap px-6 py-4">
                {data.is_active ? 'Kích hoạt' : 'Không kích hoạt'}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa?"
                  onConfirm={() => handleDelete(data.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger>Xóa</Button>
                </Popconfirm>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default VoucherManagement
