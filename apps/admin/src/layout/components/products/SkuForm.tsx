import { Button, Card, Col, Form, Input, Radio, Row, Upload } from 'antd'
import { useEffect, useState } from 'react'
import apiClient from '@store/services/apiClient.ts'
import { Attribute } from '#types/product.ts'
import { UploadOutlined } from '@ant-design/icons'

export default function SkuForm() {
  const [attributes, setAttributes] = useState([])
  const [selectedAttributes, setSelectedAttributes] = useState({})

  useEffect(() => {
    apiClient
      .get('/attributes')
      .then((response) => setAttributes(response.data.data))
      .catch((error) => console.error('Error fetching attributes:', error))
  }, [])

  return (
    <Form.List name="skus">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Card
              key={key}
              title={`SKU ${key + 1}`}
              className="mb-4"
              extra={<Button onClick={() => remove(name)}>Xóa</Button>}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    label="Giá"
                    name={[name, 'price']}
                    rules={[{ required: true, message: 'Nhập giá' }]}
                  >
                    <Input type="number" placeholder="Giá" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    label="Số lượng"
                    name={[name, 'stock']}
                    rules={[{ required: true, message: 'Nhập số lượng' }]}
                  >
                    <Input type="number" placeholder="Số lượng" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    label="Hình ảnh"
                    name={[name, 'image_url']}
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e.fileList}
                  >
                    <Upload
                      listType="picture"
                      beforeUpload={() => false}
                      multiple
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Card title="Thuộc tính SKU">
                {attributes.map((attr: Attribute) => (
                  <Form.Item
                    key={attr.id}
                    label={attr.name}
                    name={[name, 'attributes', attr.id]}
                  >
                    <Radio.Group
                      onChange={(e) =>
                        setSelectedAttributes({
                          ...selectedAttributes,
                          [attr.id]: e.target.value,
                        })
                      }
                    >
                      {attr.values?.map((value) => (
                        <Radio key={value.id} value={value.value}>
                          {value.value}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                ))}
              </Card>
            </Card>
          ))}
          <Button
            type="dashed"
            onClick={() => {
              // Thêm SKU mới với attributes
              add({ attributes: selectedAttributes })
            }}
            block
          >
            + Thêm SKU
          </Button>
        </>
      )}
    </Form.List>
  )
}
