import { Upload, Form } from 'antd'

const ProductGallery = () => {
  return (
    <Form.Item label="Bộ sưu tập ảnh" name="gallery">
      <Upload listType="picture-card" multiple>
        <div>Upload</div>
      </Upload>
    </Form.Item>
  )
}

export default ProductGallery
