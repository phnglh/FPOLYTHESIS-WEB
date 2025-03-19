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
  Table,
  Tag,
  Typography,
} from 'antd'

import { ColumnGroupType, ColumnType } from 'antd/es/table'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@store/store'
import { deleteProduct } from '@store/slices/productSlice'
import { useProductList } from '@hooks/useProductQuery'
import type { Product, Attribute, Sku } from '#types/product'
import NotFound from '@layout/components/NotFound'

const { Title } = Typography

const ProductPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { data, errorMessage } = useProductList()
  const navigate = useNavigate()

  console.log(data)
  if (!data) return <NotFound />

  if (errorMessage || !data) return <div>{errorMessage}</div>

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xoá không?')) {
      dispatch(deleteProduct(id))
    }
  }
  const handleUpdateProduct = (id: number) => {
    navigate(`/admin/products/update/${id}`)
  }

  const handleViewProduct = async (id: number) => {
    console.log(id)
    const product = data.find((p) => p.id === id)
    setSelectedProduct(product)
    setIsModalVisible(true)
  }
  const columns: (ColumnGroupType<Product> | ColumnType<Product>)[] = [
    // {
    //   title: 'STT',
    //   dataIndex: 'id',
    //   key: 'id',
    //   render: (_text: string, _record: Product, index: number) => index + 1,
    // },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <p>{text}</p>,
    },
    {
      title: 'Image',
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
      title: 'Publish',
      dataIndex: ['is_published'],
      key: 'publish',
      render: (value: number) =>
        value === 1 ? (
          <Tag color="green">Đã xuất bản</Tag>
        ) : (
          <Tag color="red">Chưa xuất bản</Tag>
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
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
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
              type: 'checkbox', // có thể đổi thành 'radio' nếu chỉ muốn chọn 1
              onChange: (selectedRowKeys, selectedRows) => {
                console.log('Selected Row Keys:', selectedRowKeys)
                console.log('Selected Rows:', selectedRows)
              },
            }}
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{ pageSize: 10 }}
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
