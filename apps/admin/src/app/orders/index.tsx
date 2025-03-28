import { Tabs } from 'antd'
import OrderList from '@app/orders/list'
import OrderDetails from '@app/orders/detail'
import RefundReturn from '@app/orders/return'
import OrderReports from '@app/orders/reports'

const { TabPane } = Tabs

const OrderManagement = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Danh sách đơn hàng" key="1">
        <OrderList />
      </TabPane>
      <TabPane tab="Chi tiết đơn hàng" key="2">
        <OrderDetails />
      </TabPane>
      <TabPane tab="Hoàn tiền & Đổi trả" key="3">
        <RefundReturn />
      </TabPane>
      <TabPane tab="Báo cáo & Thống kê" key="4">
        <OrderReports />
      </TabPane>
    </Tabs>
  )
}

export default OrderManagement
