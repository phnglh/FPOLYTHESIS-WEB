import { getAllSale, updateSale } from '@/api/services/Sale'
import formatNumber from '@/utilities/FormatTotal'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const SaleDetail = ({ data, check, onLoad }: any) => {
  const [currentSaleId, setCurrentSaleId] = useState(false)
  const [sales, setsale] = useState<any>()
  const [idSale, setIdsale] = useState<any>()
  const [saleNmae, setsalename] = useState<any>(data?.sale_id)
  const [load, setload] = useState<any>(false)
  useEffect(() => {
    const fetchPro = async () => {
      const sale = await getAllSale()
      setsale(sale)
      const saleName = sale?.find((item: any) => item?.id == data?.sale_id)?.id
      setsalename(saleName)
    }
    fetchPro()
  }, [check, load])

  const HandleUpdate = async (id: any) => {
    setCurrentSaleId(true)
    const data = {
      id: id,
      sale_id: {
        sale_id: idSale,
      },
    }
    await updateSale(data)
    setload(true)
    onLoad(idSale)
    toast.success('Thành công')
  }
  const saleName = sales?.find((item: any) => item?.id == data?.sale_id)?.name
  const totalDi = (data?.variants[0]?.price * saleName) / 100

  return (
    <tr className="border-b dark:border-neutral-500" key={data?.id}>
      <td className="whitespace-nowrap px-6 py-4 font-medium">{data?.id}</td>
      <td className="whitespace-nowrap px-6 py-4">{data?.name}</td>
      <td className="whitespace-nowrap px-6 py-4">
        {saleName ? (
          <>
            {' '}
            <span className="mr-4 line-through">
              {' '}
              {formatNumber(data?.variants[0]?.price)}đ
            </span>{' '}
            <span className="text-red-500">
              {' '}
              {formatNumber(data?.variants[0]?.price - totalDi)}đ
            </span>{' '}
          </>
        ) : (
          `${formatNumber(data?.variants[0]?.price)}đ`
        )}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        {idSale ? (
          <select
            id="largeSelect"
            className="form-select form-select-lg"
            // salesReady && sales && sales.length > 0 ? sales[0].id : "0"

            defaultValue={!currentSaleId ? undefined : saleNmae}
            style={{ width: '150px', height: '90%' }}
            onChange={(e) => setIdsale(e.target.value)}
          >
            <option value="0">Chọn sale</option>
            {sales?.map((data: any, index: any) => (
              <option value={data?.id} key={index + 1}>
                Mã sale {data?.name}%
              </option>
            ))}
          </select>
        ) : (
          <select
            id="largeSelect"
            className="form-select form-select-lg"
            // salesReady && sales && sales.length > 0 ? sales[0].id : "0"

            value={!currentSaleId ? saleNmae : undefined}
            style={{ width: '150px', height: '90%' }}
            onChange={(e) => setIdsale(e.target.value)}
          >
            <option value="0">Chọn sale</option>
            {sales?.map((data: any, index: any) => (
              <option value={data?.id} key={index + 1}>
                Mã sale {data?.name}%
              </option>
            ))}
          </select>
        )}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        {' '}
        <Button size="middle" onClick={() => HandleUpdate(data?.id)}>
          Cập nhật
        </Button>
      </td>
    </tr>
  )
}

export default SaleDetail
