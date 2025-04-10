import { useParams } from 'react-router'
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import { useEffect, useState } from 'react'
import apiClient from '@store/services/apiClient'
import { Order } from '#types/order'
import { Button, Spin } from 'antd'
import InvoicePDF from '@layout/components/orders/InvoicePDF'

const OrderInvoice = () => {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      try {
        const res = await apiClient.get(`/orders/${id}`)
        setOrder(res.data.data)
      } catch (error) {
        console.error('Error fetching order', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  console.log('order', order)

  if (loading || !order) return <Spin />

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ marginBottom: 16 }}>
        <PDFDownloadLink
          document={<InvoicePDF order={order} />}
          fileName={`invoice-${order.id}.pdf`}
        >
          {({ loading }) => (
            <Button type="primary">
              {loading ? 'Đang tạo PDF...' : 'Tải PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <PDFViewer width="100%" height="90%">
        <InvoicePDF order={order} />
      </PDFViewer>
    </div>
  )
}

export default OrderInvoice
