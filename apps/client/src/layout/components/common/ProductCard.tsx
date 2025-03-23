import { Card, Button, Typography, Image } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Product, Sku } from '#types/products'

const { Meta } = Card
const { Text } = Typography

type Props = {
  product: Product
  onAddToCart: (sku: Sku) => void
}
const ProductCard = ({ product, onAddToCart }: Props) => {
  const [selectedSku, setSelectedSku] = useState(product.skus[0])
  return (
    <Card
      hoverable
      cover={
        <Image
          src={product.image_url}
          preview={false}
          style={{
            width: '100%',
            height: '250px',
            objectFit: 'fill',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
        />
      }
      style={{
        width: '280px',
        textAlign: 'center',
        borderRadius: '10px',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px',
      }}
    >
      <Meta
        title={
          <Text strong style={{ fontSize: '14px' }}>
            {product.name}
          </Text>
        }
        description={
          <Text type="secondary" ellipsis>
            {product.description}
          </Text>
        }
      />
      {product.skus && product.skus.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '8px',
          }}
        >
          {product.skus.map((sku) => {
            const skuImages = Array.isArray(sku.image_url)
              ? sku.image_url
              : JSON.parse(sku.image_url || '[]')
            return (
              <Image
                key={sku.id}
                src={skuImages.length > 0 ? skuImages[0] : product.image_url}
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
          ${selectedSku.price}
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
    </Card>
  )
}

export default ProductCard
