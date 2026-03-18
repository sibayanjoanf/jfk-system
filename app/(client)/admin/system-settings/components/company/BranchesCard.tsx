import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Branch } from "../../types";

interface BranchesCardProps {
  branches: Branch[];
  newBranch: { name: string; phone: string; telephone: string };
  showAddBranch: boolean;
  onNewBranchChange: (key: string, value: string) => void;
  onShowAdd: () => void;
  onAdd: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const BranchesCard: React.FC<BranchesCardProps> = ({
  branches,
  newBranch,
  showAddBranch,
  onNewBranchChange,
  onShowAdd,
  onAdd,
  onCancel,
  onDelete,
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Branches</h2>
        <p className="text-xs text-gray-400 mt-1">
          Manage your physical store locations.
        </p>
      </div>
      <button
        onClick={onShowAdd}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
      >
        <Plus size={13} />
        Add Branch
      </button>
    </div>

    {showAddBranch && (
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
        <p className="text-xs font-semibold text-gray-700">New Branch</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { placeholder: "Branch name", key: "name" },
            { placeholder: "Phone number", key: "phone" },
            { placeholder: "Telephone", key: "telephone" },
          ].map(({ placeholder, key }) => (
            <input
              key={key}
              type="text"
              placeholder={placeholder}
              value={newBranch[key as keyof typeof newBranch]}
              onChange={(e) => onNewBranchChange(key, e.target.value)}
              className="px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAdd}
            className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    )}

    <div className="space-y-3">
      {branches.map((branch) => (
        <div
          key={branch.id}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">{branch.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {branch.phone} · {branch.telephone}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(branch.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default BranchesCard;
