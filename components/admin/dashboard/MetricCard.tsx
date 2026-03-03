import React from 'react';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number; 
  color: string;         
  icon: LucideIcon; 
  date?: string;
  showView?: boolean;    
  viewPath?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  color, 
  icon: Icon, 
  date,
  showView, 
  viewPath 
}) => {
  const router = useRouter();

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex-1 min-w-[220px]">
      
      {/* Top row */}
      <div className="flex justify-between items-start">

        {/* Left side */}
        <div className="flex items-center gap-4">
          <div className={`${color} p-4 rounded-xl text-white shadow-md flex-shrink-0`}>
            <Icon size={35} />
          </div>

          <div className="min-w-0">
            <p className="text-[#050F24] text-sm font-semibold truncate">
              {title}
            </p>
            <h3 className="text-sm text-[#6F757E] truncate">
              {value}
            </h3>
          </div>
        </div>

        {/* Date at top right */}
        {date && (
          <p className="text-xs text-gray-400 whitespace-nowrap">
            {date}
          </p>
        )}

      </div>

      {/* View button */}
      {showView && viewPath && (
        <button
          onClick={() => router.push(viewPath)}
          className="text-sm text-[#DF2025] hover:underline mt-2"
        >
          View
        </button>
      )}

    </div>
  );
};

export default MetricCard;