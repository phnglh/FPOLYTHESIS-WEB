import { Input, Select, Switch, Upload, Form } from 'antd'

const { TextArea } = Input

const ProductForm = () => {
  return (
    <>
      <Form.Item
        label="Tên sản phẩm"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
      >
        <Input placeholder="Nhập tên sản phẩm" />
      </Form.Item>

      <Form.Item
        label="Danh mục"
        name="category_id"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Chọn danh mục"
          options={
            [
              /* { label: 'Áo', value: 1 }, ... */
            ]
          }
        />
      </Form.Item>

      <Form.Item
        label="Thương hiệu"
        name="brand_id"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Chọn thương hiệu"
          options={
            [
              /* { label: 'Nike', value: 1 }, ... */
            ]
          }
        />
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
      </Form.Item>

      <Form.Item label="Hiển thị" name="is_published" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="Ảnh đại diện" name="thumbnail">
        <Upload listType="picture-card" maxCount={1}>
          <div>Upload</div>
        </Upload>
      </Form.Item>
    </>
  )
}

export default ProductForm
