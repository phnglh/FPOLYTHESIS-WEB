import { Button, Space } from 'antd'

const FormFooter = ({ onSubmit, onSubmitAndNew, onCancel }: any) => {
  return (
    <Space style={{ marginTop: 20 }}>
      <Button type="primary" onClick={onSubmit}>
        Lưu
      </Button>
      <Button onClick={onSubmitAndNew}>Lưu & Thêm mới</Button>
      <Button danger onClick={onCancel}>
        Hủy
      </Button>
    </Space>
  )
}

export default FormFooter
