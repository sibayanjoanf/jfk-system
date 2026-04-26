import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface StatusItem {
  name: string;
  value: number;
  color: string;
}

interface OrderStatusChartProps {
  data: StatusItem[];
}

const EMPTY_DATA = [{ name: "No Data", value: 1, color: "#E5E7EB" }];

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ data }) => {
  const isEmpty =
    !data || data.length === 0 || data.every((d) => d.value === 0);
  const chartData = isEmpty ? EMPTY_DATA : data;

  if (!data) {
    return (
      <div className="bg-white h-[400px] p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center">
        <p className="text-sm text-gray-400">No data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white h-[400px] p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
      <h3 className="font-semibold text-md text-[#050F24] mb-4">
        Order Status Review
      </h3>

      <div className="w-full relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={80}
              cornerRadius={isEmpty ? 0 : 10}
              paddingAngle={isEmpty ? 0 : 2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-3">
        {isEmpty ? (
          <p className="text-xs text-gray-400 text-center">
            No orders to display
          </p>
        ) : (
          data.map((item, i) => (
            <div
              key={i}
              className={`flex justify-between text-sm text-[#6F757E] pb-1 ${
                i !== data.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <span className="flex items-center gap-2 font-normal">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.name}
              </span>
              <span className="font-normal text-[#050F24]">{item.value}%</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderStatusChart;
