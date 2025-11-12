import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import TabNavigation from "./TabNavigation";

const LINE_COLOR = "#F2A03B";
const AXIS_COLOR = "#012622";
const BG_COLOR = "#E5F8F7";

export default function RevenueChart({
  value = "£1000.00",
  lineData = [],
  categories = [],
  activeTab,
  setActiveTab,
  tabs = ["Month", "Year"],
}) {
  const chartData = categories.map((label, index) => ({
    name: label,
    value: lineData[index] || 0,
  }));

  return (
    <div
      className="
        bg-[#E5F8F7] rounded-xl border border-[#BDE7DF]
        h-[230px] w-full px-6 py-5 flex flex-col justify-between box-border
      "
    >
      {/* Header */}
      <div className="flex flex-row flex-wrap items-center mb-2 gap-y-2 w-full">
        <div className="min-w-0 flex-shrink">
          <div className="font-medium text-base text-[#012622] truncate">
            Revenue
          </div>
          <div className="font-bold text-2xl text-[#012622] mt-0.5 truncate">
            {value}
          </div>
        </div>
        <div className="ml-auto flex-shrink-0">
          <TabNavigation
            tabs={["Month", "Year"]}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 15, left: 10, bottom: 10 }}
          >
            <CartesianGrid stroke="transparent" />
            <XAxis
              dataKey="name"
              tick={{ fill: AXIS_COLOR, fontSize: 13 }}
              axisLine={{ stroke: AXIS_COLOR, strokeWidth: 2 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#173331", fontSize: 13 }}
              axisLine={{ stroke: AXIS_COLOR, strokeWidth: 2 }}
              tickLine={false}
              tickFormatter={(val) => `£${val}`}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 8,
              }}
              labelStyle={{ color: "#012622", fontWeight: 500 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={LINE_COLOR}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
