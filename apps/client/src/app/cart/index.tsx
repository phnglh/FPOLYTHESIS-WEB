import {
  Button,
  InputNumber,
  Card,
  Space,
  Typography,
  Image,
  Checkbox,
  Empty,
  Row,
  Col,
  Divider,
  Modal,
  Spin,
} from 'antd'
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { AppDispatch, RootState } from '@store/store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useCallback } from 'react'
import {
  decrementCartItem,
  fetchCart,
  incrementCartItem,
  removeFromCart,
  updateCartItem,
  restoreCartFromSession,
} from '@store/slices/cartSlice'
import { CartItem } from '#types/cart'
import { useNavigate } from 'react-router'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'
import { toast } from 'react-toastify'
import _ from 'lodash'

const { Title, Text } = Typography

const MAX_QUANTITY_PER_SKU = 50 // Giới hạn tối đa 50 mỗi SKU

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { formatCurrency } = useCurrencyFormatter()
  const { data, loading, error } = useSelector((state: RootState) => state.cart)
  const items = data?.items || []
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [localQuantities, setLocalQuantities] = useState<{
    [key: number]: number
  }>({})
  const [loadingActions, setLoadingActions] = useState<{
    [key: number]: boolean
  }>({})
  const navigate = useNavigate()

  // Debounce chỉ cho API call
  const debouncedUpdateQuantity = useCallback(
    _.debounce((id: number, quantity: number) => {
      setLoadingActions((prev) => ({ ...prev, [id]: true }))
      dispatch(updateCartItem({ id, quantity }))
        .unwrap()
        .then(() => {
          toast.success('Cập nhật số lượng thành công!')
        })
        .catch((err) => {
          toast.error(
            `Lỗi khi cập nhật số lượng: ${err?.message || 'Vui lòng thử lại!'}`,
          )
          // Rollback nếu API thất bại
          setLocalQuantities((prev) => ({
            ...prev,
            [id]: items.find((item) => item.id === id)?.quantity || 1,
          }))
        })
        .finally(() => {
          setLoadingActions((prev) => ({ ...prev, [id]: false }))
        })
    }, 500),
    [dispatch, items],
  )

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem giỏ hàng!')
      navigate('/login')
      return
    }

    // Khôi phục giỏ hàng từ sessionStorage nếu Redux rỗng
    if (!items || items.length === 0) {
      dispatch(restoreCartFromSession())
    }

    dispatch(fetchCart())
      .unwrap()
      .catch((err) => {
        toast.error(
          `Lỗi khi tải giỏ hàng: ${err?.message || 'Vui lòng thử lại!'}`,
        )
      })
  }, [dispatch, navigate])

  useEffect(() => {
    if (items.length > 0 && selectedRowKeys.length === 0) {
      setSelectedRowKeys(items.map((item) => item.id))
      // Khởi tạo local quantities
      const quantities = items.reduce(
        (acc, item) => {
          acc[item.id] = item.quantity
          return acc
        },
        {} as { [key: number]: number },
      )
      setLocalQuantities(quantities)
    }
  }, [items])

  const getMaxQuantity = (item: CartItem) => {
    const stock = item?.sku?.stock ?? 100
    return Math.min(stock, MAX_QUANTITY_PER_SKU)
  }

  const handleUpdateQuantity = (id: number, value: number | null) => {
    const item = items.find((item) => item.id === id)
    if (!item || value === null) return

    let newQuantity = value

    const maxQuantity = getMaxQuantity(item)

    if (newQuantity < 1) {
      toast.error('Số lượng phải lớn hơn 0!')
      newQuantity = 1
    } else if (newQuantity > maxQuantity) {
      if (maxQuantity === MAX_QUANTITY_PER_SKU) {
        toast.error(`Số lượng tối đa mua sản phẩm là ${MAX_QUANTITY_PER_SKU}!`)
      } else {
        toast.error(`Số lượng tối đa là ${maxQuantity} (tồn kho)!`)
      }
      newQuantity = maxQuantity
    }

    // Cập nhật local quantities ngay lập tức
    setLocalQuantities((prev) => ({ ...prev, [id]: newQuantity }))

    // Chỉ gọi API nếu số lượng hợp lệ
    if (newQuantity !== (localQuantities[id] || item.quantity)) {
      debouncedUpdateQuantity(id, newQuantity)
    }
  }

  const handleIncrement = (id: number) => {
    const item = items.find((item) => item.id === id)
    if (!item || loadingActions[id]) return

    const currentQuantity = localQuantities[id] || item.quantity
    const maxQuantity = getMaxQuantity(item)

    if (currentQuantity >= maxQuantity) {
      toast.error(
        maxQuantity === MAX_QUANTITY_PER_SKU
          ? `Số lượng tối đa mua sản phẩm là ${MAX_QUANTITY_PER_SKU}!`
          : `Số lượng tối đa là ${maxQuantity} (tồn kho)!`,
      )
      return
    }

    const newQuantity = currentQuantity + 1
    setLocalQuantities((prev) => ({ ...prev, [id]: newQuantity }))
    setLoadingActions((prev) => ({ ...prev, [id]: true }))
    dispatch(incrementCartItem(id))
      .unwrap()
      .then(() => {
        toast.success('Tăng số lượng thành công!')
      })
      .catch((err) => {
        toast.error(
          `Lỗi khi tăng số lượng: ${err?.message || 'Vui lòng thử lại!'}`,
        )
        setLocalQuantities((prev) => ({ ...prev, [id]: item.quantity }))
      })
      .finally(() => {
        setLoadingActions((prev) => ({ ...prev, [id]: false }))
      })
  }

  const handleDecrement = (id: number) => {
    const item = items.find((item) => item.id === id)
    if (!item || loadingActions[id]) return

    const currentQuantity = localQuantities[id] || item.quantity
    if (currentQuantity <= 1) {
      toast.error('Số lượng phải lớn hơn 0!')
      return
    }

    const newQuantity = currentQuantity - 1
    setLocalQuantities((prev) => ({ ...prev, [id]: newQuantity }))
    setLoadingActions((prev) => ({ ...prev, [id]: true }))
    dispatch(decrementCartItem(id))
      .unwrap()
      .then(() => {
        toast.success('Giảm số lượng thành công!')
      })
      .catch((err) => {
        toast.error(
          `Lỗi khi giảm số lượng: ${err?.message || 'Vui lòng thử lại!'}`,
        )
        setLocalQuantities((prev) => ({ ...prev, [id]: item.quantity }))
      })
      .finally(() => {
        setLoadingActions((prev) => ({ ...prev, [id]: false }))
      })
  }

  const handleRemoveItem = async (id: number) => {
    setLoadingActions((prev) => ({ ...prev, [id]: true }))
    try {
      await dispatch(removeFromCart(id)).unwrap()
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!')
      // Cập nhật selectedRowKeys sau khi xóa
      setSelectedRowKeys((prev) => prev.filter((key) => key !== id))
    } catch (err) {
      toast.error(
        `Lỗi khi xóa sản phẩm: ${err?.message || 'Vui lòng thử lại!'}`,
      )
      await dispatch(fetchCart()).unwrap()
    } finally {
      setLoadingActions((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleRemoveAll = () => {
    Modal.confirm({
      title: 'Xác nhận xóa toàn bộ giỏ hàng',
      content: 'Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          for (const item of items) {
            await dispatch(removeFromCart(item.id)).unwrap()
          }
          toast.success('Đã xóa toàn bộ giỏ hàng!')
          setSelectedRowKeys([])
        } catch (err) {
          toast.error(
            `Lỗi khi xóa toàn bộ: ${err?.message || 'Vui lòng thử lại!'}`,
          )
          await dispatch(fetchCart()).unwrap()
        }
      },
    })
  }

  const handleSelectChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys([...selectedRowKeys, id])
    } else {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== id))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(items.map((item) => item.id))
    } else {
      setSelectedRowKeys([])
    }
  }

  const selectedItems = items.filter((item) =>
    selectedRowKeys.includes(item.id),
  )
  const totalAmount = selectedItems.reduce(
    (total, item) =>
      total +
      (item.unit_price || 0) * (localQuantities[item.id] || item.quantity || 0),
    0,
  )

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một sản phẩm!')
      return
    }
    // Kiểm tra số lượng trước khi thanh toán
    for (const item of selectedItems) {
      const maxQuantity = getMaxQuantity(item)
      const currentQuantity = localQuantities[item.id] || item.quantity
      if (currentQuantity > maxQuantity) {
        toast.error(
          `Sản phẩm "${item.product_name}" vượt quá giới hạn (${maxQuantity}). Vui lòng điều chỉnh số lượng!`,
        )
        return
      }
    }
    const selectedSkuIds = selectedItems.map((item) => item.sku_id)
    navigate(`/checkout?skus=${selectedSkuIds.join(',')}`)
  }

  return (
    <div style={{ background: '#F7F7F7', minHeight: '50vh', padding: '24px' }}>
      <Row justify="center">
        <Col span={13}>
          <Card
            title={
              <Row align="middle" justify="space-between">
                <Title
                  level={3}
                  style={{
                    margin: 0,
                    color: '#1A1A1A',
                    fontSize: '20px',
                    padding: '16px',
                  }}
                >
                  🛒 Giỏ hàng
                </Title>
                {items.length > 0 && (
                  <Space>
                    <Checkbox
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={
                        items.length > 0 &&
                        selectedRowKeys.length === items.length
                      }
                    >
                      Chọn tất cả
                    </Checkbox>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={handleRemoveAll}
                      style={{ fontSize: '14px', color: '#FF4D4F' }}
                    >
                      Xóa toàn bộ
                    </Button>
                  </Space>
                )}
              </Row>
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 3px 15px rgba(0,0,0,0.05)',
              background: '#FFFFFF',
            }}
          >
            {error && (
              <Text
                type="danger"
                style={{ display: 'block', margin: '12px', fontSize: '14px' }}
              >
                Lỗi: {error}
              </Text>
            )}
            {loading && (
              <Spin style={{ display: 'block', margin: '24px auto' }} />
            )}
            {items.length === 0 && !loading ? (
              <div style={{ textAlign: 'center', padding: '36px 0' }}>
                <Empty
                  description={
                    <Text style={{ color: '#595959', fontSize: '16px' }}>
                      Giỏ hàng trống
                    </Text>
                  }
                  imageStyle={{ height: 100 }}
                />
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate('/products')}
                  style={{
                    marginTop: '16px',
                    borderRadius: '6px',
                    padding: '0 32px',
                    height: '40px',
                    background: '#FA8C16',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = '#F5A623')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = '#FA8C16')
                  }
                >
                  Tiếp tục mua sắm
                </Button>
              </div>
            ) : (
              <>
                <Row
                  align="middle"
                  gutter={[8, 8]}
                  style={{
                    padding: '12px',
                    background: 'rgb(255, 224, 224)',
                    borderBottom: '1px solid #E8ECEF',
                    fontSize: '18px',
                    fontWeight: 500,
                    color: '#1A1A1A',
                    margin: '12px',
                    borderRadius: '10px',
                    border: '1px solid #F0F0F0',
                  }}
                >
                  <Col span={1}></Col>
                  <Col span={5}>
                    <strong style={{ fontSize: '16px', color: '#1A1A1A' }}>
                      Ảnh sản phẩm
                    </strong>
                  </Col>
                  <Col span={8}>
                    <strong style={{ fontSize: '16px', color: '#1A1A1A' }}>
                      Tên sản phẩm
                    </strong>
                  </Col>
                  <Col span={6}>
                    <strong style={{ fontSize: '16px', color: '#1A1A1A' }}>
                      Số lượng
                    </strong>
                  </Col>
                  <Col span={3}>
                    <strong style={{ fontSize: '16px', color: '#1A1A1A' }}>
                      Thành tiền
                    </strong>
                  </Col>
                  <Col span={1}></Col>
                </Row>
                <Space
                  direction="vertical"
                  size={8}
                  style={{ width: '100%', padding: '12px' }}
                >
                  {items.map((item: CartItem) => (
                    <Card
                      key={item.id}
                      style={{
                        borderRadius: '10px',
                        border: '1px solid #E8ECEF',
                        transition: 'all 0.2s',
                        background: '#FFFFFF',
                      }}
                      hoverable
                      bodyStyle={{ padding: '12px' }}
                    >
                      <Row align="middle" gutter={[8, 8]}>
                        <Col span={1}>
                          <Checkbox
                            checked={selectedRowKeys.includes(item.id)}
                            onChange={(e) =>
                              handleSelectChange(item.id, e.target.checked)
                            }
                          />
                        </Col>
                        <Col span={5}>
                          <Image
                            src={
                              item?.sku?.image_url ||
                              'https://via.placeholder.com/80?text=Sản+phẩm'
                            }
                            alt={item?.sku?.sku || 'Sản phẩm'}
                            width={80}
                            height={80}
                            preview={false}
                            style={{
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid #F0F0F0',
                              transition: 'transform 0.3s',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.transform = 'scale(1.05)')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform = 'scale(1)')
                            }
                          />
                        </Col>
                        <Col span={8}>
                          <Space direction="vertical" size={4}>
                            <Text
                              strong
                              style={{ fontSize: '14px', color: '#1A1A1A' }}
                            >
                              {item?.product_name || 'Sản phẩm không xác định'}
                            </Text>
                            {item?.sku?.attributes &&
                            item.sku.attributes.length > 0 ? (
                              <Text
                                style={{ fontSize: '12px', color: '#595959' }}
                              >
                                {item.sku.attributes
                                  .map((attr) => attr.value)
                                  .join(' / ')}
                              </Text>
                            ) : (
                              <Text
                                style={{ fontSize: '12px', color: '#595959' }}
                              >
                                Không có thuộc tính
                              </Text>
                            )}
                            <Text
                              strong
                              style={{
                                fontSize: '14px',
                                color: 'rgb(255, 0, 0)',
                              }}
                            >
                              {formatCurrency(item.unit_price || 0)}
                            </Text>
                          </Space>
                        </Col>
                        <Col span={6}>
                          <Space size={6} align="center">
                            <Button
                              icon={<MinusOutlined />}
                              size="small"
                              onClick={() => handleDecrement(item.id)}
                              disabled={
                                loadingActions[item.id] ||
                                (localQuantities[item.id] || item.quantity) <= 1
                              }
                              style={{
                                borderRadius: '50%',
                                width: 30,
                                height: 30,
                                borderColor: '#E8ECEF',
                              }}
                              loading={loadingActions[item.id]}
                            />
                            <InputNumber
                              min={1}
                              value={localQuantities[item.id] || item.quantity}
                              onChange={(value) =>
                                handleUpdateQuantity(item.id, value)
                              }
                              style={{
                                width: 50,
                                borderRadius: '6px',
                                textAlign: 'center',
                                borderColor: '#E8ECEF',
                              }}
                              disabled={loadingActions[item.id]}
                            />
                            <Button
                              icon={<PlusOutlined />}
                              size="small"
                              onClick={() => handleIncrement(item.id)}
                              disabled={
                                loadingActions[item.id] ||
                                (localQuantities[item.id] || item.quantity) >=
                                  getMaxQuantity(item)
                              }
                              style={{
                                borderRadius: '50%',
                                width: 30,
                                height: 30,
                                borderColor: '#E8ECEF',
                              }}
                              loading={loadingActions[item.id]}
                            />
                          </Space>
                        </Col>
                        <Col span={3}>
                          <Text
                            strong
                            style={{
                              fontSize: '15px',
                              color: 'rgb(255, 0, 0)',
                            }}
                          >
                            {formatCurrency(
                              (item.unit_price || 0) *
                                (localQuantities[item.id] ||
                                  item.quantity ||
                                  0),
                            )}
                          </Text>
                        </Col>
                        <Col span={1} style={{ textAlign: 'center' }}>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveItem(item.id)}
                            style={{ fontSize: '14px', color: '#FF4D4F' }}
                            loading={loadingActions[item.id]}
                          />
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </Space>
                <Divider style={{ margin: '12px 0' }} />
                <Card
                  style={{
                    borderRadius: '10px',
                    border: 'none',
                    background: '#FFFFFF',
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 10,
                    padding: '12px 16px',
                    boxShadow: '0 -2px 6px rgba(0,0,0,0.05)',
                  }}
                >
                  <Row align="middle" justify="end" gutter={[12, 12]}>
                    <Col span={12}>
                      <Title
                        level={4}
                        style={{
                          margin: 0,
                          color: '#1A1A1A',
                          fontSize: '18px',
                        }}
                      >
                        Tổng tiền:{' '}
                        <Text strong type="danger" style={{ fontSize: '20px' }}>
                          {formatCurrency(totalAmount)}
                        </Text>
                      </Title>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <Space size={8}>
                        <Button
                          size="middle"
                          onClick={() => navigate('/products')}
                          style={{
                            borderRadius: '6px',
                            padding: '0 20px',
                            height: '40px',
                            borderColor: '#E8ECEF',
                            fontSize: '14px',
                            fontWeight: 500,
                          }}
                        >
                          Tiếp tục mua sắm
                        </Button>
                        <Button
                          type="primary"
                          size="middle"
                          onClick={handleCheckout}
                          disabled={selectedItems.length === 0}
                          style={{
                            borderRadius: '6px',
                            padding: '0 28px',
                            height: '40px',
                            background:
                              selectedItems.length === 0
                                ? '#B0B0B0'
                                : '#FA8C16',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: 500,
                            transition: 'all 0.3s',
                          }}
                          onMouseEnter={(e) =>
                            selectedItems.length > 0 &&
                            (e.currentTarget.style.background = '#F5A623')
                          }
                          onMouseLeave={(e) =>
                            selectedItems.length > 0 &&
                            (e.currentTarget.style.background = '#FA8C16')
                          }
                        >
                          Thanh toán ({selectedItems.length})
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CartPage
