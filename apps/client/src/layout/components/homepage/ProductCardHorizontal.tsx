import { Card, Button, Typography, Image } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Product, Sku } from '#types/products'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'
import { useNavigate } from 'react-router'

const { Text } = Typography

type Props = {
  product: Product
  onAddToCart: (sku: Sku) => void
}
const ProductCardHorizontal = ({ product }: Props) => {
  const [selectedSku, setSelectedSku] = useState(product.skus[0])
  const { formatCurrency } = useCurrencyFormatter()
  const navigate = useNavigate()
  return (
    <Card
      hoverable
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderRadius: '10px',
      }}
    >
      <div className="flex gap-10 items-center justify-between">
        <Image
          src={product.image_url}
          preview={false}
          style={{
            width: '150px',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '10px',
          }}
        />
        <div className="flex flex-col justify-between">
          <Text strong style={{ fontSize: '16px', display: 'block' }}>
            {product.name}
          </Text>

          {product.skus?.length > 0 && (
            <div className="flex gap-2 mt-2">
              {product.skus.map((sku) => {
                const isSelected = selectedSku.id === sku.id
                return (
                  <Image
                    key={sku.id}
                    src={sku.image_url}
                    preview={false}
                    width={40}
                    height={40}
                    style={{
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: isSelected
                        ? '2px solid #ff4d4f'
                        : '2px solid transparent',
                    }}
                    onClick={() => setSelectedSku(sku)}
                  />
                )
              })}
            </div>
          )}

          <div className="flex gap-5 items-center justify-between mt-10">
            <Text strong style={{ fontSize: '16px', color: '#ff4d4f' }}>
              {formatCurrency(selectedSku.price)}
            </Text>
            <Button
              size="small"
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              Chi tiết
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProductCardHorizontal
