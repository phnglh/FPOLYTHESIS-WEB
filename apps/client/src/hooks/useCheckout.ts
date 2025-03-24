import { selectCartItems } from '@store/slices/cartSlice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

export const useCheckout = () => {
  const items = useSelector(selectCartItems)
  const navigate = useNavigate()

  const handleCheckout = () => {
    const selectedItems = items?.map((item) => ({
      sku_id: item.sku_id,
      name: item.sku.sku,
      price: item.unit_price,
      quantity: item.quantity,
      image: item.sku.image_url,
    }))

    localStorage.setItem('checkout_items', JSON.stringify(selectedItems))
    navigate('/checkout')
  }

  return { handleCheckout }
}
