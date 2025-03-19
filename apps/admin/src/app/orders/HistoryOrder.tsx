import moment from 'moment'

const HistoryOrder = ({ data }: any) => {
  console.log(data)

  return (
    <>
      <tr key={data?.id} className="w-1/4 border border-gray-200">
        {/* <td className="border border-gray-200 p-2 font-normal">
                    {data.name}
                </td> */}
        <td className="border border-gray-200 p-2 font-normal">
          {data.description}
        </td>
        <td className="border border-gray-200 p-2 font-normal">
          {moment(data.updated_at).locale('vi').format('DD/MM/YYYY HH:mm:ss')}
        </td>
      </tr>
    </>
  )
}

export default HistoryOrder
