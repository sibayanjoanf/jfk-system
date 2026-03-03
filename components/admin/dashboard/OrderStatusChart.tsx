import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface StatusItem {
  name: string;
  value: number;
  color: string;
}

interface OrderStatusChartProps {
  data: StatusItem[];
}

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ data }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
    <h3 className="font-semibold text-lg text-[#050F24] mb-4">Order Status Review</h3>
    
    <div className="h-42 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={data} 
            innerRadius={60} 
            outerRadius={80} 
            cornerRadius={10}    
            paddingAngle={2}   
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Number with bold styling */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-[#050F24]">64</span>
      </div>
    </div>

    {/* Legend Section with Conditional Borders */}
    <div className="mt-4 space-y-2">
      {data.map((item, i) => (
        <div 
          key={i} 
          className={`flex justify-between text-sm text-[#6F757E] pb-1 ${
            /* Removes the line below the final item */
            i !== data.length - 1 ? 'border-b border-gray-200' : ''
          }`}
        >
          <span className="flex items-center gap-2 font-normal">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}/> 
            {item.name}
          </span>
          <span className="font-normal text-[#050F24]">{item.value}%</span>
        </div>
      ))}
    </div>
  </div>
);

export default OrderStatusChart;