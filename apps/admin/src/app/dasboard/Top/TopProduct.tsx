import { getProductTop } from '@/api/services/Dashboard'
import { Select } from 'antd'
import { useEffect, useState } from 'react'
import ProductInTopProduct from './ProductInTopProduct'

const TopProduct = () => {
  const [top, settop] = useState<any>(3)
  const [product, setproduct] = useState<any>()
  useEffect(() => {
    const fetch = async () => {
      const data = await getProductTop(top)
      setproduct(data)
    }
    fetch()
  }, [top])
  console.log(product)

  return (
    <>
      <div>
        <div className="flex bg-gray-200 p-4 ">
          <span className="font-bold">Sản Phẩm Bán Chạy</span>
          <Select
            className="ml-auto"
            defaultValue="3 sản phẩm "
            style={{ width: 120 }}
            onChange={(e: any) => settop(e)}
            options={[
              { value: '3', label: '3 sản phẩm ' },
              { value: '4', label: '4 sản phẩm ' },
              { value: '5', label: '5 sản phẩm ' },
              { value: '6', label: '6 sản phẩm ' },
              { value: '7', label: '7 sản phẩm ' },
              { value: '8', label: '8 sản phẩm ' },
              { value: '9', label: '9 sản phẩm ' },
              { value: '10', label: '10 sản phẩm ' },
            ]}
          />
        </div>
        <ProductInTopProduct data={product} />
      </div>
    </>
  )
}

export default TopProduct
