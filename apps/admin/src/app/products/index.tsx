import {
  ArrowRightOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Descriptions,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd'

import { ColumnGroupType, ColumnType } from 'antd/es/table'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useProductList } from '@hooks/useProductQuery'
import type { Product, Attribute, Sku } from '#types/product'
import NotFound from '@layout/components/NotFound'
import apiClient from '@store/services/apiClient'
import { toast } from 'react-toastify'

const { Title } = Typography

const ProductPage = () => {
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState<Product>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { data, isLoading, errorMessage, pagination, handleTableChange } =
    useProductList()

  if (!data) return <NotFound />

  if (errorMessage || !data) return <div>{errorMessage}</div>

  const handleTogglePublish = async (id: number) => {
    try {
      await apiClient.patch(`/products/${id}/publish`)
      toast.success('Cập nhập thành công!')
    } catch (error) {
      toast.error(error)
    }
  }

  const handleUpdateProduct = (id: number) => {
    navigate(`/products/update/${id}`)
  }

  const handleViewProduct = async (id: number) => {
    const product = data.data.find((p) => p.id === id)
    setSelectedProduct(product)
    setIsModalVisible(true)
  }
  const columns: (ColumnGroupType<Product> | ColumnType<Product>)[] = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <p>{text}</p>,
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <img
          src={record.image_url}
          style={{ width: '50px', height: 'auto' }}
          alt={text}
        />
      ),
    },
    {
      title: 'Trạng thái hiển thị',
      dataIndex: 'is_published',
      key: 'publish',
      render: (value: number) =>
        value === 1 ? (
          <Tag color="green">Đã hiển thị</Tag>
        ) : (
          <Tag color="red">Ẩn</Tag>
        ),
    },
    {
      title: 'Số lượng kho',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_text: string, record: Product) => (
        <Space size="middle">
          <Switch
            checked={!!record.is_published}
            checkedChildren="Hiển thị"
            unCheckedChildren="Ẩn"
            onChange={() => handleTogglePublish(record.id)}
            style={{
              backgroundColor: record.is_published ? '#52c41a' : '#f5222d',
              color: 'white',
              fontWeight: 'bold',
            }}
          />

          <Button
            type="primary"
            onClick={() => handleUpdateProduct(record.id)}
            icon={<ArrowRightOutlined />}
          >
            Sửa
          </Button>
          <Button type="default" onClick={() => handleViewProduct(record.id)}>
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ]
  const variantColumns = [
    {
      title: 'Mã SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => Number(price).toLocaleString('vi-VN') + ' ₫',
    },
    {
      title: 'Số lượng kho',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Thuộc tính',
      key: 'attributes',
      render: (_: string, record: Sku) =>
        record.attributes.map((attr: Attribute) => (
          <p key={attr.id} className="m-0">
            {attr.name}: {attr.value}
          </p>
        )),
    },
  ]

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ display: 'flex', marginTop: '30px' }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Danh sách sản phẩm
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/products/create')}
          >
            Thêm sản phẩm
          </Button>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Table<Product>
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                console.log('Selected Row Keys:', selectedRowKeys)
                console.log('Selected Rows:', selectedRows)
              },
            }}
            columns={columns}
            dataSource={data.data}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: data?.meta?.total,
            }}
            onChange={handleTableChange}
            title={() => (
              <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col>
                  <Row gutter={8}>
                    <Col>
                      <Select defaultValue="Stock" style={{ width: 120 }}>
                        <Select.Option value="in_stock">In Stock</Select.Option>
                        <Select.Option value="out_stock">
                          Out of Stock
                        </Select.Option>
                      </Select>
                    </Col>
                    <Col>
                      <Select defaultValue="Publish" style={{ width: 120 }}>
                        <Select.Option value="published">
                          Published
                        </Select.Option>
                        <Select.Option value="draft">Draft</Select.Option>
                      </Select>
                    </Col>
                    <Col>
                      <Input.Search placeholder="Search..." allowClear />
                    </Col>
                  </Row>
                </Col>

                <Col>
                  <Row gutter={16}>
                    <Col>
                      <Button type="link" icon={<EyeOutlined />}>
                        Columns
                      </Button>
                    </Col>
                    <Col>
                      <Button type="link" icon={<FilterOutlined />}>
                        Filters
                      </Button>
                    </Col>
                    <Col>
                      <Button type="link" icon={<UploadOutlined />}>
                        Export
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          />
        </Col>
      </Row>
      {selectedProduct && (
        <Modal
          title={`Chi tiết sản phẩm: ${selectedProduct.name}`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={800}
        >
          <Descriptions bordered size="middle" column={1}>
            <Descriptions.Item label="ID">
              {selectedProduct.id}
            </Descriptions.Item>
            <Descriptions.Item label="Tên sản phẩm">
              {selectedProduct.name}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {selectedProduct.description}
            </Descriptions.Item>
            <Descriptions.Item label="Danh mục">
              {selectedProduct.category_name || 'Chưa có'}
            </Descriptions.Item>
            <Descriptions.Item label="Thương hiệu">
              {selectedProduct.brand_name || 'Chưa có'}
            </Descriptions.Item>
          </Descriptions>

          <h3 className="mt-4">Biến thể (SKU)</h3>
          <Table
            columns={variantColumns}
            dataSource={selectedProduct.skus}
            rowKey="id"
            pagination={false}
            style={{ marginTop: 20 }}
          />
        </Modal>
      )}
    </Space>
  )
}

export default ProductPage
