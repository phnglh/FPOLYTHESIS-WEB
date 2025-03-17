import { Attribute, AttributeValue } from '#types/product'

import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { fetchAttributes } from '@store/slices/attributeSlice'
import { AppDispatch, RootState } from '@store/store'
import { Button, Form, Input, Modal, Space, Table } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const AttributeManagement = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isValueModalVisible, setIsValueModalVisible] = useState(false)
  const [currentAttribute, setCurrentAttribute] = useState<Attribute>()
  const [currentAttributeValue] = useState<AttributeValue>()
  const [attributesid, setAttributesid] = useState<number[]>([])

  const [form] = Form.useForm()
  console.log(attributesid)
  const { data } = useSelector((state: RootState) => state.attributes)

  useEffect(() => {
    dispatch(fetchAttributes())
  }, [dispatch])

  console.log(data)
  const fetchAttributesId = async (id: number) => {
    try {
      setAttributesid(data)
    } catch (error) {
      console.error('Failed to fetch attributes:', error)
    }
  }

  const handleAddAttribute = async (values: Attribute) => {
    try {
      console.log(values)
      setIsAddModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Failed to add attribute:', error)
    }
  }

  const handleEditAttribute = async (values: Attribute) => {
    try {
      console.log(values)
      setIsEditModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error('Failed to edit attribute:', error)
    }
  }

  const handleAddAttributeValue = async (values: AttributeValue) => {
    try {
      if (currentAttribute) {
        const data: any = {
          value: values?.value,
          attribute_id: currentAttribute?.id,
        }
        setIsValueModalVisible(false)
        form.resetFields()
      }
    } catch (error) {
      console.error('Failed to add attribute value:', error)
    }
  }

  const handleEditAttributeValue = async (values: AttributeValue) => {
    try {
      if (currentAttribute && currentAttributeValue) {
        console.log(values)
        fetchAttributes()
        setIsValueModalVisible(false)
        form.resetFields()
      }
    } catch (error) {
      console.error('Failed to edit attribute value:', error)
    }
  }
  const attributeColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (_text: string, _record: Attribute, index: number) => index + 1,
    },
    {
      title: 'Thuộc tính',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Hoạt động',
      key: 'action',
      render: (record: Attribute) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentAttribute(record)
              form.setFieldsValue(record)
              setIsEditModalVisible(true)
            }}
          />
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentAttribute(record)
              setIsValueModalVisible(true)
            }}
          >
            Thêm giá trị cho thuộc tính
          </Button>
          <Button onClick={() => showModal(record?.id)}>Chi tiết</Button>
        </Space>
      ),
    },
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = (id: any) => {
    fetchAttributesId(id)
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const valueColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (_text: string, _record: AttributeValue, index: number) =>
        index + 1,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (text: string, record: AttributeValue) => {
        console.log(text)

        return record.value
      },
    },
  ]
  return (
    <div className="content">
      <Table columns={attributeColumns} dataSource={data} rowKey={'id'} />

      <Modal
        title="Thêm thuộc tính"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddAttribute}>
          <Form.Item
            label="Tên thuộc tính"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input the attribute name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* modal con */}
      <Modal
        title="Attribute_value"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Table
          columns={valueColumns}
          dataSource={attributesid}
          pagination={false}
        />
      </Modal>

      <Modal
        title="Sửa thuộc tính"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleEditAttribute}>
          <Form.Item
            label="Tên thuộc tính"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input the attribute name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Sửa
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          currentAttributeValue ? 'Edit Attribute Value' : 'Add Attribute Value'
        }
        open={isValueModalVisible}
        onCancel={() => setIsValueModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={
            currentAttributeValue
              ? handleEditAttributeValue
              : handleAddAttributeValue
          }
        >
          <Form.Item
            label="Value"
            name="value"
            rules={[
              {
                required: true,
                message: 'Please input the attribute value!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentAttributeValue ? 'Save Changes' : 'Add Value'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AttributeManagement
