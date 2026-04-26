import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";

interface RevenueData {
  name: string;
  website: number;
}

type CustomTooltipProps = TooltipProps<number, string> & {
  label?: string;
  payload?: Payload<number, string>[];
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="text-center"
        style={{
          backgroundColor: "#050F24",
          borderRadius: "12px",
          padding: "10px 40px",
          color: "#fff",
        }}
      >
        <p className="text-xs font-medium mb-2">{label}</p>
        <div className="flex flex-col gap-1">
          {payload.map((entry: Payload<number, string>, index: number) => (
            <p
              key={index}
              className="text-sm font-medium leading-tight"
              style={{
                color: entry.dataKey === "facebook" ? "#DF2025" : "#27D095",
              }}
            >
              ₱{entry.value}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

interface RevenueChartProps {
  data: RevenueData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[400px] flex items-center justify-center">
        <p className="text-sm text-gray-400">No revenue data available.</p>
      </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-md font-semibold text-[#050F24]">
          Revenue Over Time
        </h3>
        <div className="flex gap-4 text-xs font-normal text-gray-500">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#27D095]" />
            Website
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          style={{ outline: "none" }}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6F757E", fontSize: 12 }}
            dy={10}
          />

          <YAxis
            width={50}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6F757E", fontSize: 12 }}
            dx={-10}
          />

          <Tooltip
            content={<CustomTooltip />}
            shared={true}
            cursor={{ stroke: "#6F757E", strokeDasharray: "5 5" }}
          />

          <Line
            type="monotone"
            dataKey="website"
            stroke="#27D095"
            strokeWidth={4}
            dot={false}
            strokeLinecap="round"
            activeDot={{
              r: 6,
              fill: "#fff",
              strokeWidth: 3,
              stroke: "#27D095",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
