import { Button, Col, Form, Input, Row, Select, Switch, Upload } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@store/store.ts'
import { fetchCategories } from '@store/slices/categorySlice.ts'
import { fetchBrands } from '@store/slices/brandSlice.ts'
import { useEffect, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'

const { Option } = Select

const GeneralInfo = ({ form }) => {
  const dispatch = useDispatch<AppDispatch>()
  const categories = useSelector((state: RootState) => state.categories.data)
  const brands = useSelector((state: RootState) => state.brands.data)
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchBrands())
  }, [dispatch])

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList)
    form.setFieldsValue({ imageUrl: fileList })
  }
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Tên sản phẩm"
          name="productName"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
        >
          <Input placeholder="Tên sản phẩm" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Danh mục" name="category">
          <Select placeholder="Chọn danh mục">
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Thương hiệu" name="brand">
          <Select placeholder="Chọn thương hiệu">
            {brands.map((brand) => (
              <Option key={brand.id} value={brand.id}>
                {brand.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Hiển thị" name="visible" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label="Hình ảnh"
          name="imageUrl"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleImageChange}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea placeholder="Mô tả sản phẩm" />
        </Form.Item>
      </Col>
    </Row>
  )
}
export default GeneralInfo
