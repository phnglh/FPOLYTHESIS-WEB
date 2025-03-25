import { Card, Button, Typography, Image } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Product, Sku } from '#types/products'

const { Text } = Typography

type Props = {
  product: Product
  onAddToCart: (sku: Sku) => void
}
const ProductCardHorizontal = ({ product, onAddToCart }: Props) => {
  const [selectedSku, setSelectedSku] = useState(product.skus[0])
  const images = Array.isArray(selectedSku.image_url)
    ? selectedSku.image_url
    : JSON.parse(selectedSku.image_url || '[]')

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
          src={images.length > 0 ? images[0] : product.image_url}
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
                const skuImages = Array.isArray(sku.image_url)
                  ? sku.image_url
                  : JSON.parse(sku.image_url || '[]')
                return (
                  <Image
                    key={sku.id}
                    src={
                      skuImages.length > 0 ? skuImages[0] : product.image_url
                    }
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
        </div>
      </div>
    </Card>
  )
}

export default ProductCardHorizontal
