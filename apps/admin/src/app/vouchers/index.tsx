import { PlusOutlined } from '@ant-design/icons'
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
  Space,
  Row,
  Col,
  Typography,
  Table,
  Switch,
} from 'antd'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import moment from 'moment'

const { Option } = Select

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState<any[]>([])
  const [editingVoucher, setEditingVoucher] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const formRef = useRef<any>(null)

  const fetchVouchers = async () => {
    const res = await apiClient.get('/vouchers')
    setVouchers(res.data.data || [])
  }

  useEffect(() => {
    fetchVouchers()
  }, [])

  const openAddModal = () => {
    setEditingVoucher(null)
    setIsModalOpen(true)
  }

  const openEditModal = (voucher: any) => {
    setEditingVoucher(voucher)
    setIsModalOpen(true)
    setTimeout(() => {
      formRef.current.setFieldsValue({
        ...voucher,
        start_date: moment(voucher.start_date),
        end_date: moment(voucher.end_date),
        is_active: !!voucher.is_active,
      })
    }, 0)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    formRef.current.resetFields()
    setEditingVoucher(null)
  }

  const handleToggleActive = async (id: number, checked: boolean) => {
    try {
      await apiClient.patch(`/vouchers/${id}`, {
        is_active: checked ? 1 : 0,
      })
      toast.success(`Đã ${checked ? 'kích hoạt' : 'hủy kích hoạt'} voucher`)
      fetchVouchers()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await formRef.current.validateFields()
      const payload = {
        code: values.code,
        type: values.type,
        discount_value: values.discount_value,
        min_order_value: values.min_order_value,
        usage_limit: values.usage_limit,
        start_date: values.start_date.format('YYYY-MM-DD'),
        end_date: values.end_date.format('YYYY-MM-DD'),
        is_active: values.is_active ? 1 : 0,
      }

      if (editingVoucher) {
        await apiClient.put(`/vouchers/${editingVoucher.id}`, payload)
        toast.success('Cập nhật voucher thành công')
      } else {
        await apiClient.post('/vouchers', payload)
        toast.success('Thêm voucher thành công')
      }

      handleCancel()
      fetchVouchers()
    } catch (error) {
      toast.error('Đã có lỗi xảy ra')
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id: number) => `#${id}`,
    },
    {
      title: 'Mã',
      dataIndex: 'code',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      render: (type: string) =>
        type === 'percentage' ? 'Phần trăm' : 'Cố định',
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount_value',
      render: (_: any, record: any) =>
        record.type === 'percentage'
          ? `${record.discount_value}%`
          : record.discount_value,
    },
    {
      title: 'Tối thiểu',
      dataIndex: 'min_order_value',
    },
    {
      title: 'Giới hạn',
      dataIndex: 'usage_limit',
    },
    {
      title: 'Đã dùng',
      dataIndex: 'used_count',
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'start_date',
    },
    {
      title: 'Kết thúc',
      dataIndex: 'end_date',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      render: (checked: boolean, record: any) => (
        <Switch
          checked={checked}
          onChange={(newChecked) => handleToggleActive(record.id, newChecked)}
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => openEditModal(record)}>Sửa</Button>
        </Space>
      ),
    },
  ]

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ display: 'flex', marginTop: 30 }}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <Typography.Title level={3}>Danh sách mã khuyến mại</Typography.Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Thêm mã khuyến mại
          </Button>
        </Col>
      </Row>

      <Modal
        title={editingVoucher ? 'Cập nhật Voucher' : 'Thêm Voucher'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={editingVoucher ? 'Cập nhật' : 'Thêm'}
      >
        <Form ref={formRef} layout="vertical">
          <Form.Item
            name="code"
            label="Mã Voucher"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nhập mã voucher" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại Voucher"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn loại voucher">
              <Option value="percentage">Phần trăm</Option>
              <Option value="fixed">Cố định</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="discount_value"
            label="Giá trị giảm giá"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="min_order_value"
            label="Giá trị đơn hàng tối thiểu"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="usage_limit"
            label="Giới hạn sử dụng"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="start_date"
            label="Ngày bắt đầu"
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="end_date"
            label="Ngày kết thúc"
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="is_active" valuePropName="checked">
            <Checkbox>Kích hoạt</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        rowKey="id"
        dataSource={vouchers}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </Space>
  )
}

export default VoucherManagement
