import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/assets/font/Roboto-Regular.ttf', fontWeight: 'normal' },
    { src: '/assets/font/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Roboto' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  section: { marginBottom: 12 },
  bold: { fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  table: { border: '1pt solid #ccc', marginTop: 10 },
  cell: { padding: 6, borderBottom: '1pt solid #ccc' },
})

const InvoicePDF = ({ order }: { order: any }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>HÓA ĐƠN BÁN HÀNG</Text>

        {/* Thông tin khách */}
        <View style={styles.section}>
          <Text style={styles.bold}>Khách hàng:</Text>
          <Text>{order.user?.name}</Text>
          <Text>SDT: {order.address?.receiver_phone}</Text>
          <Text>Địa chỉ: {order.address?.address}</Text>
        </View>

        {/* Thông tin đơn */}
        <View style={styles.section}>
          <Text style={styles.bold}>Mã đơn hàng: </Text>
          <Text>{order.order_number}</Text>
          <Text>Ngày đặt: {order.ordered_at}</Text>
          <Text>Trạng thái: {order.status}</Text>
        </View>

        {/* Bảng sản phẩm */}
        <View style={styles.table}>
          <View style={[styles.row, styles.cell]}>
            <Text style={{ width: '40%' }}>Sản phẩm</Text>
            <Text style={{ width: '20%' }}>Đơn giá</Text>
            <Text style={{ width: '20%' }}>SL</Text>
            <Text style={{ width: '20%' }}>Thành tiền</Text>
          </View>
          {order.items.map((item: any) => (
            <View key={item.id} style={[styles.row, styles.cell]}>
              <Text style={{ width: '40%' }}>{item.product_name}</Text>
              <Text style={{ width: '20%' }}>{item.unit_price}</Text>
              <Text style={{ width: '20%' }}>{item.quantity}</Text>
              <Text style={{ width: '20%' }}>{item.total_price}</Text>
            </View>
          ))}
        </View>

        {/* Tổng cộng */}
        <View style={[styles.section, { marginTop: 16 }]}>
          <Text>Tạm tính: {order.subtotal}đ</Text>
          <Text>Phí vận chuyển: {order.shipping_fee}đ</Text>
          <Text>Giảm giá: {order.discount}đ</Text>
          <Text style={styles.bold}>Tổng cộng: {order.final_total}đ</Text>
        </View>

        <Text style={{ marginTop: 20 }}>Cảm ơn quý khách đã mua hàng!</Text>
      </Page>
    </Document>
  )
}

export default InvoicePDF
