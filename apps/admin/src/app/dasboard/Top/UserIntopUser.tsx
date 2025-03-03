const UserIntopUser = ({ data }: any) => {
  return (
    <>
      {data?.map((data1: any, index: any) => {
        return (
          <div className="flex p-2" key={index + 1}>
            <div className="h-24 w-24 border  ">
              {/* <img src="https://tokyolife.vn/_next/image?url=https%3A%2F%2Fpm2ec.s3.ap-southeast-1.amazonaws.com%2Fcms%2F17205122836764534.png&w=1920&q=75" alt="" className='' /> */}
            </div>
            <div className=" flex w-2/3 flex-col items-center justify-center border">
              <span className="text-sm font-bold">{data1?.name}</span>
            </div>
            <div className=" flex w-1/3 flex-col items-center justify-center border">
              <span className="text-sm font-bold">
                {data1?.total_orders} lượt mua
              </span>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default UserIntopUser
