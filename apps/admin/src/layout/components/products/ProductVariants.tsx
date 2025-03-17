import { Form, Input, InputNumber, Button, Table, Upload } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

const ProductVariants = ({ value = [], onChange }: any) => {
  const handleAdd = () => {
    const newVariants = [
      ...value,
      { sku: '', price: 0, stock: 0, attributes: {}, image: null },
    ]
    onChange(newVariants)
  }

  const handleRemove = (index: number) => {
    const newVariants = value.filter((_: any, idx: number) => idx !== index)
    onChange(newVariants)
  }

  const handleChange = (index: number, key: string, val: any) => {
    const newVariants = [...value]
    newVariants[index][key] = val
    onChange(newVariants)
  }

  const columns = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      render: (_: any, record: any, idx: number) => (
        <Input
          value={record.sku}
          onChange={(e) => handleChange(idx, 'sku', e.target.value)}
        />
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (_: any, record: any, idx: number) => (
        <InputNumber
          value={record.price}
          onChange={(val) => handleChange(idx, 'price', val)}
        />
      ),
    },
    {
      title: 'Kho',
      dataIndex: 'stock',
      render: (_: any, record: any, idx: number) => (
        <InputNumber
          value={record.stock}
          onChange={(val) => handleChange(idx, 'stock', val)}
        />
      ),
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      render: (_: any, record: any, idx: number) => (
        <Upload maxCount={1}>
          <Button>Upload</Button>
        </Upload>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: (_: any, __: any, idx: number) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleRemove(idx)}
        />
      ),
    },
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={value}
        rowKey={(record, index) => index.toString()}
        pagination={false}
      />
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ width: '100%', marginTop: 10 }}
      >
        Thêm biến thể
      </Button>
    </>
  )
}

export default ProductVariants
