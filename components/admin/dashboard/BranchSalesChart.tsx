import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface BranchData {
  name: string;
  value: number;
  color: string;
}

interface BranchSalesChartProps {
  data: BranchData[];
}

const BranchSalesChart: React.FC<BranchSalesChartProps> = ({ data }) => {

  const renderColorfulLegendText = (value: string) => {
    return <span className="text-[#050F24] ml-1">{value}</span>;
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-[#050F24] mb-6">Branch Sales</h3>
      <div className="h-49">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              innerRadius={60} 
              outerRadius={85}  
              dataKey="value"
              stroke="none" 
              
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle" 
              iconType="circle"
              iconSize={8}
              formatter={renderColorfulLegendText} 
              wrapperStyle={{ 
                paddingLeft: '20px',
                fontSize: '14px',
                fontWeight: '400'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BranchSalesChart;