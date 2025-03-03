import Categories from './Categories'
import Data7Day from './Data7Day'
import Pay from './Pay'
const ChartAll = () => {
  return (
    <>
      <div className="flex h-full flex-wrap  border border-gray-100 ">
        <Categories />
        <Pay />
        <Data7Day />
      </div>
    </>
  )
}

export default ChartAll
