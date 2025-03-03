import { Variant } from '@/@types/product'
import { getAllVariant } from '@/api/services/VariantService'
import Table, { ColumnGroupType, ColumnType } from 'antd/es/table'
import { useEffect, useState } from 'react'

function VariantManagement() {
  const [variants, setVariants] = useState<Variant[]>([])
  const fetchVariants = async () => {
    const getVariants: Variant[] = await getAllVariant()
    setVariants(getVariants)
  }
  useEffect(() => {
    fetchVariants()
  }, [])

  const columns: (ColumnGroupType<Variant> | ColumnType<Variant>)[] = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      render: (_text: string, _record: Variant, index: number) => index + 1,
    },
    {
      title: 'Product Name',
      dataIndex: ['product', 'name'],
      key: 'product_name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Color',
      key: 'color',
      render: (_, record: any) => {
        const colorAttribute = record.attribute_values.find(
          (attr: any) => attr.attribute_id === 1,
        )
        return colorAttribute ? colorAttribute.value : ''
      },
    },
    {
      title: 'Size',
      key: 'size',
      render: (_, record: any) => {
        const sizeAttribute = record.attribute_values.find(
          (attr: any) => attr.attribute_id === 2,
        )
        return sizeAttribute ? sizeAttribute.value : ''
      },
    },
  ]
  return (
    <>
      <Table
        columns={columns}
        dataSource={variants}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </>
  )
}
export default VariantManagement
