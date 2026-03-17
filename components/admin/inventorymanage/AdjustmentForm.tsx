import React from "react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, Bell, CircleUserRound, ArrowLeft, Upload } from "lucide-react";

const AdjustmentForm: React.FC = () => {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [activeButton, setActiveButton] = useState<string | null>(null);

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center flex-1">
          <button
            onClick={() => router.push(`/inventory/${id}`)}
            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-[#050F24]" />
          </button>
          {/* Gap between title and search bar */}
          <div className="w-35 pl-5 shrink-0">
            <h1 className="text-xl font-semibold text-[#0f172a]">Inventory</h1>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl group">
            <span className="absolute inset-y-0 right-4 flex items-center text-[#6F757E] pointer-events-none group-focus-within:text-[#DF2025] transition-colors overflow-hidden">
              <Search size={18} strokeWidth={2.5} />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#DF2025] transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-8">
          {/* Bell Button */}
          <button
            onClick={() =>
              setActiveButton(activeButton === "bell" ? null : "bell")
            }
            className={`p-1.5 rounded-full transition-all overflow-hidden ${
              activeButton === "bell"
                ? "bg-[#DF2025] text-white"
                : "text-[#050F24] hover:bg-gray-200"
            }`}
          >
            <Bell size={24} />
          </button>

          {/* User Button */}
          <button
            onClick={() =>
              setActiveButton(activeButton === "user" ? null : "user")
            }
            className={`p-1.5 rounded-full transition-all overflow-hidden ${
              activeButton === "user"
                ? "bg-[#DF2025] text-white"
                : "text-[#050F24] hover:bg-gray-200"
            }`}
          >
            <CircleUserRound size={27} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="mt-8 bg-[#FFFFFF] rounded-2xl p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[#0F172A]">
              Adjustment Form
            </h1>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              Record any changes to product stock by filling out the adjustment
              details below. Ensure all required fields are completed for
              accurate inventory tracking.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/inventory/${id}`)}
              className="bg-[#DF2025] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#b3191d] transition"
            >
              Save
            </button>
            <button
              onClick={() => router.push(`/inventory/${id}/view-adjustment`)}
              className="bg-[#DF2025] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#b3191d] transition"
            >
              View
            </button>
          </div>
        </div>

        {/* Adjustment Information Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-6">
            Adjustment Information
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Selected Product Name"
              className="bg-gray-100 rounded-full px-4 py-3 outline-none"
            />

            <input
              type="text"
              placeholder="Current Stock Display"
              className="bg-gray-100 rounded-full px-4 py-3 outline-none"
            />

            <select className="bg-gray-100 rounded-full px-4 py-3 outline-none text-gray-500">
              <option>Adjustment Type</option>
              <option>Add Stock</option>
              <option>Deduct Stock</option>
            </select>

            <input
              type="number"
              placeholder="Quantity to Adjust"
              className="bg-gray-100 rounded-full px-4 py-3 outline-none text-gray-500"
            />

            <select className="bg-gray-100 rounded-full px-4 py-3 outline-none text-gray-500">
              <option>Batch ID</option>
              <option>LOT-2025-JAN-001</option>
              <option>LOT-2025-FEB-002</option>
              <option>LOT-2025-MAR-003</option>
              <option>LOT-2025-APR-004</option>
              <option>LOT-2025-MAY-005</option>
              <option>LOT-2025-JUN-006</option>
              <option>LOT-2025-JUL-007</option>
              <option>LOT-2025-AUG-008</option>
              <option>LOT-2025-SEP-009</option>
            </select>

            <input
              type="text"
              placeholder="Adjusted by (auto-filled)"
              className="bg-gray-100 rounded-full px-4 py-3 outline-none"
            />
          </div>

          <textarea
            placeholder="Type reason/notes here (optional)..."
            className="mt-6 w-full bg-gray-100 rounded-2xl px-4 py-4 outline-none resize-none"
            rows={4}
          />
        </div>

        {/* Supporting Document Upload */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-6">
            Supporting Document Upload (Optional)
          </h2>

          <div className="border-2 border-dashed border-red-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-[#DF2025] text-white flex items-center justify-center rounded-full mb-4">
              <Upload size={20} />
            </div>
            <p className="text-sm text-gray-600">
              Drop your files here or{" "}
              <span className="text-[#DF2025] font-semibold cursor-pointer">
                Browse
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Support: JPG, JPEG, PNG, PDF, DOC, DOCX, XLS, XLSX
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentForm;
