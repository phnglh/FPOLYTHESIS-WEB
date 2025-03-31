import { Card, Statistic } from 'antd'
import { LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

const data = [
  { name: 'Jan', income: 50, expenses: 30 },
  { name: 'Feb', income: 45, expenses: 35 },
  { name: 'Mar', income: 60, expenses: 40 },
  { name: 'Apr', income: 70, expenses: 55 },
  { name: 'May', income: 100, expenses: 65 },
  { name: 'Jun', income: 90, expenses: 75 },
  { name: 'Jul', income: 120, expenses: 80 },
  { name: 'Aug', income: 140, expenses: 90 },
  { name: 'Sep', income: 110, expenses: 85 },
  { name: 'Oct', income: 95, expenses: 70 },
  { name: 'Nov', income: 85, expenses: 60 },
  { name: 'Dec', income: 80, expenses: 55 },
]

const genderData = [
  { name: 'Mens', value: 1000 },
  { name: 'Womens', value: 800 },
  { name: 'Kids', value: 524 },
]
const COLORS = ['#28A745', '#FFC107', '#FF5733']

export default function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Top Stats */}
      <Card>
        <Statistic
          title="Product Sold"
          value={765}
          suffix={<ArrowUpOutlined />}
        />
      </Card>
      <Card>
        <Statistic
          title="Total Balance"
          value={18765}
          suffix={<ArrowDownOutlined />}
        />
      </Card>
      <Card>
        <Statistic
          title="Sales Profit"
          value={4876}
          suffix={<ArrowUpOutlined />}
        />
      </Card>

      {/* Sales by Gender */}
      <Card className="col-span-1 flex justify-center items-center">
        <PieChart width={200} height={200}>
          <Pie
            data={genderData}
            dataKey="value"
            outerRadius={80}
            fill="#8884d8"
          >
            {genderData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </Card>

      {/* Yearly Sales */}
      <Card className="col-span-2">
        <LineChart width={600} height={300} data={data}>
          <Line
            type="monotone"
            dataKey="income"
            stroke="#28A745"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#FFC107"
            strokeWidth={2}
          />
        </LineChart>
      </Card>
    </div>
  )
}
