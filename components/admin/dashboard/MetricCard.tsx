import React from "react";
import { useRouter } from "next/navigation";
import { type LucideIcon } from "lucide-react";

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
  viewPath,
}) => {
  const router = useRouter();

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex-1 min-w-[220px]">
      {/* Top row */}
      <div className="flex justify-between items-start">
        {/* Left side */}
        <div className="flex items-center w-full">
          <div
            className={`${color} p-4 rounded-xl text-white shadow-md flex-shrink-0`}
          >
            <Icon size={35} />
          </div>

          <div className="flex items-center justify-between min-w-0 flex-1 ml-4">
            <div className="flex flex-col min-w-0">
              <p className="text-[#050F24] text-sm font-semibold truncate">
                {title}
              </p>
              {showView && viewPath && (
                <button
                  onClick={() => router.push(viewPath)}
                  className="text-sm text-[#DF2025] hover:underline self-start"
                >
                  View
                </button>
              )}
            </div>
            <div className="flex-shrink-0 ml-4">
              <h3 className="text-lg font-semibold text-[#6F757E]">{value}</h3>
            </div>
          </div>
        </div>

        {/* Date at top right */}
        {date && (
          <p className="text-xs text-gray-400 whitespace-nowrap">{date}</p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
