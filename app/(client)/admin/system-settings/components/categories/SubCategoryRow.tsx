import React from "react";
import { ChevronRight, Images, Pencil, Trash2 } from "lucide-react";
import { SubCategory } from "../../types";

interface SubCategoryRowProps {
  sub: SubCategory;
  editingSubCategory: string | null;
  editingSubCategoryName: string;
  onEditStart: (subId: string, name: string) => void;
  onEditChange: (name: string) => void;
  onEditSave: (subId: string) => void;
  onDelete: (subId: string) => void;
  onThumbnail: (subId: string, file: File) => void;
}

const SubCategoryRow: React.FC<SubCategoryRowProps> = ({
  sub,
  editingSubCategory,
  editingSubCategoryName,
  onEditStart,
  onEditChange,
  onEditSave,
  onDelete,
  onThumbnail,
}) => {
  const subThumbRef = React.createRef<HTMLInputElement>();

  return (
    <div className="flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
      <ChevronRight size={12} className="text-gray-300 shrink-0" />

      <div
        onClick={() => subThumbRef.current?.click()}
        className="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-red-300 transition-colors shrink-0 overflow-hidden relative group"
      >
        {sub.image_url ? (
          <img
            src={sub.image_url}
            alt={sub.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Images size={11} className="text-gray-300" />
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Pencil size={8} className="text-white" />
        </div>
      </div>
      <input
        ref={subThumbRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          e.target.files?.[0] && onThumbnail(sub.id, e.target.files[0])
        }
      />

      <div className="flex-1 min-w-0">
        {editingSubCategory === sub.id ? (
          <input
            type="text"
            value={editingSubCategoryName}
            autoFocus
            onChange={(e) => onEditChange(e.target.value)}
            onBlur={() => onEditSave(sub.id)}
            onKeyDown={(e) => e.key === "Enter" && onEditSave(sub.id)}
            className="w-full px-2 py-1 text-xs bg-white border border-red-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        ) : (
          <p className="text-sm text-gray-700">{sub.name}</p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEditStart(sub.id, sub.name)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={() => onDelete(sub.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};

export default SubCategoryRow;
