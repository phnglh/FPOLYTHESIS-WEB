import { ProInCategory } from '@/api/services/Dashboard'
import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'

const Categories = () => {
  const [pro, setpro] = useState<any>()
  useEffect(() => {
    const ferchPro = async () => {
      const resposive = await ProInCategory()
      setpro(resposive)
    }
    ferchPro()
  }, [])
  console.log(pro)

  const series = pro?.original?.categories
    ? pro?.original?.categories.map((data: any) => data?.products_count)
    : [44, 55, 13]
  const options: any = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Danh mục',
      align: 'center',
    },
    labels: pro?.original?.categories?.map((data: any) => data?.name),
    legend: {
      position: 'bottom', // Di chuyển chú giải xuống dưới
    },
    colors: ['#34c38f', '#f1b44c', '#50a5f1', '#FFFF66', '#66FFCC', '#CD2990'],
  }
  console.log(series)

  return (
    <>
      <div className="lg:w-1/4 md:w-1/2 ">
        <div className="bg-white shadow rounded-lg pt-8 pb-20">
          <div className="card-body">
            <Chart options={options} series={series} type="pie" width="100%" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Categories
