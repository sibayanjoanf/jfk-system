import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";
import { TimeFilter } from "@/app/admin/dashboard/useDashboard";

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
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          padding: "10px 16px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          fontSize: "12px",
          border: "none",
        }}
      >
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-900">
          ₱
          {Number(payload[0]?.value ?? 0).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}
        </p>
      </div>
    );
  }
  return null;
};

interface RevenueChartProps {
  data: RevenueData[];
  timeFilter: TimeFilter;
  onTimeFilterChange: (f: TimeFilter) => void;
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  timeFilter,
  onTimeFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs border rounded-lg font-medium transition-colors ${
              isOpen
                ? "bg-red-600 text-white border-red-600"
                : "border-red-200 text-red-600 hover:bg-red-50"
            }`}
          >
            {timeFilter}
            <ChevronDown size={14} />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
              {(["Daily", "Weekly", "Monthly", "Yearly"] as TimeFilter[]).map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => {
                      onTimeFilterChange(item);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${
                      item === timeFilter
                        ? "text-red-600 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#F1F5F9"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 11 }}
            tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
          <Bar
            dataKey="website"
            fill="#DF2025"
            radius={[4, 4, 0, 0]}
            barSize={10}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
