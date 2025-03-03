import TopProduct from './TopProduct'
import TopUser from './TopUser'

const Top = () => {
  return (
    <>
      <div className="flex ">
        <div className=" w-2/4 bg-white shadow rounded-lg m-1">
          <TopProduct />
        </div>

        <div className=" w-2/4 bg-white shadow rounded-lg m-1">
          <TopUser />
        </div>
      </div>
    </>
  )
}

export default Top
