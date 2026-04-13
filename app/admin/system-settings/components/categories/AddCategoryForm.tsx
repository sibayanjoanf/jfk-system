import React, { useState } from "react";
import { Images } from "lucide-react";

interface AddCategoryFormProps {
  newCategory: { name: string; image_url: string };
  thumbRef: React.RefObject<HTMLInputElement | null>;
  onChange: (name: string) => void;
  onThumbnail: (file: File) => void;
  onAdd: () => void;
  onCancel: () => void;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({
  newCategory,
  thumbRef,
  onChange,
  onThumbnail,
  onAdd,
  onCancel,
}) => {
  const [error, setError] = useState(false);

  const handleAdd = () => {
    if (!newCategory.name.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onAdd();
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
      <p className="text-xs font-semibold text-gray-700">New Category</p>
      <div className="flex items-center gap-4">
        <div
          onClick={() => thumbRef.current?.click()}
          className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 hover:border-red-300 hover:bg-red-50/30 flex items-center justify-center cursor-pointer transition-colors shrink-0 overflow-hidden"
        >
          {newCategory.image_url ? (
            <img
              src={newCategory.image_url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <Images size={18} className="text-gray-300" />
          )}
        </div>
        <input
          ref={thumbRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onThumbnail(e.target.files[0])}
        />
        <div className="flex-1">
          <input
            type="text"
            placeholder="Category name"
            value={newCategory.name}
            maxLength={50}
            onChange={(e) => {
              onChange(e.target.value);
              if (e.target.value.trim()) setError(false);
            }}
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all ${error ? "border-red-400" : "border-gray-200"}`}
          />
          {error && (
            <p className="text-xs text-red-500 mt-1">
              Category name is required
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1.5">
            Click the box to upload image.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={() => {
            setError(false);
            onCancel();
          }}
          className="px-4 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddCategoryForm;