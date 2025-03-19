import { Select, Form, Button, Space } from 'antd'

const ProductAttributes = () => {
  return (
    <>
      <Form.Item label="Kích thước" name="sizes">
        <Select
          mode="multiple"
          placeholder="Chọn kích thước"
          options={[
            { label: 'S', value: 'S' },
            { label: 'M', value: 'M' },
          ]}
        />
      </Form.Item>

      <Form.Item label="Màu sắc" name="colors">
        <Select
          mode="multiple"
          placeholder="Chọn màu sắc"
          options={[
            { label: 'Đỏ', value: 'Đỏ' },
            { label: 'Xanh', value: 'Xanh' },
          ]}
        />
      </Form.Item>

      <Form.Item label="Chất liệu" name="materials">
        <Select
          mode="multiple"
          placeholder="Chọn chất liệu"
          options={[
            { label: 'Cotton', value: 'Cotton' },
            { label: 'Polyester', value: 'Polyester' },
          ]}
        />
      </Form.Item>

      <Space>
        <Button type="dashed">+ Thêm thuộc tính</Button>
      </Space>
    </>
  )
}

export default ProductAttributes
