const ProductInTopProduct = ({ data }: any) => {
  return (
    <>
      {data?.map((data1: any, index: any) => {
        return (
          <div className="flex p-2" key={index + 1}>
            <div className="w-16 border ">
              <span>{index + 1}</span>
            </div>
            <div className="h-24 w-24 border ">
              <img
                src={data1?.image}
                alt=""
                style={{
                  textAlign: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
            <div className=" flex w-2/3 flex-col items-center justify-center border">
              <span className="text-sm font-bold">
                {data1?.product_name?.length > 30
                  ? `${data1?.product_name?.slice(0, 30)}`
                  : data1?.product_name}
              </span>
            </div>
            <div className=" flex w-1/3 flex-col items-center justify-center border">
              <span className="text-sm font-bold">
                {data1?.sold_count} lượt bán
              </span>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default ProductInTopProduct
