import { Card, Button, Typography, Image } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Product, Sku } from '#types/products'
import useCurrencyFormatter from '@hooks/useCurrencyFormatter'

const { Text } = Typography

type Props = {
  product: Product
  onAddToCart: (sku: Sku) => void
}
const ProductCardHorizontal = ({ product, onAddToCart }: Props) => {
  const [selectedSku, setSelectedSku] = useState(product.skus[0])
  const { formatCurrency } = useCurrencyFormatter()

  return (
    <Card
      hoverable
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        maxWidth: '600px',
        borderRadius: '10px',
        padding: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          width: '100%',
        }}
      >
        <Image
          src={product.image_url}
          preview={false}
          style={{
            width: '120px',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '10px',
          }}
        />
        <div style={{ flex: 1 }}>
          <Text strong style={{ fontSize: '16px', display: 'block' }}>
            {product.name}
          </Text>
          <Text
            type="secondary"
            ellipsis
            style={{ display: 'block', marginTop: '4px' }}
          >
            {product.description}
          </Text>
          {product.skus && product.skus.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {product.skus.map((sku) => {
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
                      border:
                        selectedSku.id === sku.id
                          ? '2px solid #ff4d4f'
                          : '2px solid transparent',
                    }}
                    onClick={() => setSelectedSku(sku)}
                  />
                )
              })}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '12px',
            }}
          >
            <Text strong style={{ fontSize: '16px', color: '#ff4d4f' }}>
              {formatCurrency(selectedSku.price)}
            </Text>
            <Button
              size="small"
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={() => onAddToCart(selectedSku)}
            >
              Mua
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProductCardHorizontal
