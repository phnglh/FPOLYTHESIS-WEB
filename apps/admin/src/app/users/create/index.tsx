import {
  Form,
  Input,
  Button,
  Upload,
  Switch,
  Select,
  Row,
  Col,
  Typography,
  Space,
  Card,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const { Option } = Select
const { Text } = Typography

const CreateUser = () => {
  const [form] = Form.useForm()

  const handleFinish = (values: any) => {
    console.log('User Info:', values)
  }

  return (
    <Row
      justify="center"
      align="top"
      style={{
        marginTop: '20px',
      }}
    >
      <Col xl={24}>
        <Typography.Title>Create a new user</Typography.Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            emailVerified: true,
          }}
        >
          <Row gutter={[24, 24]} justify="space-around">
            <Col span={7}>
              <Card
                style={{
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  padding: '20px',
                  background: '#fff',
                }}
              >
                <Form.Item
                  name="avatar"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e?.fileList}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Upload
                      name="avatar"
                      listType="picture-circle"
                      maxCount={1}
                      accept=".jpeg,.jpg,.png,.gif"
                      beforeUpload={() => false}
                    >
                      <UploadOutlined />
                      <Text>Upload</Text>
                    </Upload>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Allowed *.jpeg, *.jpg, *.png, *.gif <br />
                      Max size of 3 Mb
                    </Text>
                  </div>
                </Form.Item>

                <Form.Item
                  name="emailVerified"
                  valuePropName="checked"
                  label={<Text strong>Email verified</Text>}
                >
                  <Space
                    direction="horizontal"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Disabling this will automatically send <br /> the user a
                      verification email
                    </Text>
                    <Switch />
                  </Space>
                </Form.Item>
              </Card>
            </Col>

            <Col
              span={16}
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                borderRadius: '8px',
                background: '#fff',
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="fullName"
                    label="Full name"
                    rules={[
                      { required: true, message: 'Please enter full name' },
                    ]}
                  >
                    <Input placeholder="Full name" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email address"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter email address',
                      },
                      { type: 'email', message: 'Invalid email format' },
                    ]}
                  >
                    <Input placeholder="Email address" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="Phone number"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter phone number',
                      },
                    ]}
                  >
                    <Input placeholder="Phone number" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="country"
                    label="Country"
                    rules={[
                      { required: true, message: 'Please choose a country' },
                    ]}
                  >
                    <Select placeholder="Choose a country">
                      <Option value="VN">Vietnam</Option>
                      <Option value="US">United States</Option>
                      <Option value="DE">Germany</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="state" label="State/Region">
                    <Input placeholder="State/Region" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="city" label="City">
                    <Input placeholder="City" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="address" label="Address">
                    <Input placeholder="Address" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="zip" label="Zip/Code">
                    <Input placeholder="Zip/Code" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="company" label="Company">
                    <Input placeholder="Company" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="role" label="Role">
                    <Input placeholder="Role" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Create Button */}
          <Row justify="end" style={{ marginTop: 24 }}>
            <Col>
              <Button type="primary" htmlType="submit">
                Create User
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  )
}

export default CreateUser
