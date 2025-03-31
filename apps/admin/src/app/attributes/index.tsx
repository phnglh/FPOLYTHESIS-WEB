import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Modal, Form, Input, Space } from 'antd'
import {
  fetchAttributes,
  addAttribute,
  updateAttribute,
  deleteAttribute,
  fetchAttributeValues,
  addAttributeValue,
  deleteAttributeValue,
} from '@store/slices/attributeSlice'
import { AppDispatch, RootState } from '@store/store'
import { Attribute, AttributeValue } from '#types/product'
import { toast } from 'react-toastify'

const AttributeManagement = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading } = useSelector((state: RootState) => state.attributes)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAttribute, setEditingAttribute] = useState<Attribute>()
  const [form] = Form.useForm()

  const [isValueModalOpen, setIsValueModalOpen] = useState(false)
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(
    null,
  )
  const [valueForm] = Form.useForm()

  useEffect(() => {
    dispatch(fetchAttributes())
  }, [dispatch])

  const handleAdd = () => {
    setIsModalOpen(true)
  }

  const handleEdit = (record: Attribute) => {
    setEditingAttribute(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteAttribute(id)).unwrap()
      toast.success('Xóa thuộc tính thành công!')
      await dispatch(fetchAttributes())
    } catch (error) {
      toast.error(`Xóa thất bại: ${error}`)
    }
  }

  const handleSubmit = async (values: Attribute) => {
    if (editingAttribute) {
      await dispatch(updateAttribute({ ...values, id: editingAttribute.id }))
    } else {
      await dispatch(addAttribute(values)).unwrap()
      toast.success('Thêm thành công')
    }
    await dispatch(fetchAttributes())
    setIsModalOpen(false)
    form.resetFields()
  }

  const handleManageValues = (attribute: Attribute) => {
    setSelectedAttribute(attribute)
    dispatch(fetchAttributeValues(attribute.id))
    setIsValueModalOpen(true)
  }

  const handleAddValue = async () => {
    try {
      const { value } = await valueForm.validateFields()
      if (selectedAttribute) {
        await dispatch(
          addAttributeValue({ attributeId: selectedAttribute.id, value }),
        )
        const response = await dispatch(
          fetchAttributeValues(selectedAttribute.id),
        )
        console.log('🔄 Fetch lại values:', response)
        valueForm.resetFields()
        toast.success('Thêm giá trị thành công!')
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Lỗi không xác định khi thêm giá trị!'

      toast.error(`Xóa thất bại: ${errorMessage}`)
    }
  }

  const handleDeleteValue = async (valueId: number) => {
    try {
      await dispatch(deleteAttributeValue(valueId)).unwrap()
      dispatch(fetchAttributeValues(selectedAttribute!.id))
      toast.success('Xóa giá trị thành công!')
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Lỗi không xác định khi xóa giá trị!'

      toast.error(`Xóa thất bại: ${errorMessage}`)
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    {
      title: 'Giá trị',
      dataIndex: 'values',
      key: 'values',
      render: (values: AttributeValue) => {
        console.log('Debug values:', values)
        return Array.isArray(values)
          ? values.map((v) => v.value).join(', ')
          : 'Chưa có'
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: unknown, record: Attribute) => (
        <Space style={{ gap: 10 }}>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Button onClick={() => handleManageValues(record)}>
            Quản lý giá trị
          </Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Thêm thuộc tính
      </Button>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingAttribute ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thuộc tính"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Quản lý giá trị thuộc tính"
        open={isValueModalOpen}
        onCancel={() => setIsValueModalOpen(false)}
        footer={null}
      >
        <Form form={valueForm} layout="inline" onFinish={handleAddValue}>
          <Form.Item
            name="value"
            rules={[{ required: true, message: 'Nhập giá trị' }]}
          >
            <Input placeholder="Nhập giá trị mới" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>

        <Table
          dataSource={
            data.find((attr) => attr.id === selectedAttribute?.id)?.values || []
          }
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id' },
            { title: 'Giá trị', dataIndex: 'value', key: 'value' },
            {
              title: 'Hành động',
              key: 'actions',
              render: (_, record) => (
                <Button onClick={() => handleDeleteValue(record.id)} danger>
                  Xóa
                </Button>
              ),
            },
          ]}
          rowKey="id"
        />
      </Modal>
    </div>
  )
}

export default AttributeManagement
