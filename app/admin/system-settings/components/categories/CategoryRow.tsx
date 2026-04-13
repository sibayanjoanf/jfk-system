import React, { useState } from "react"; /* ADDED: Imported useState for validation tracking */
import {
  Images,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
} from "lucide-react";
import { Category } from "../../types";
import SubCategoryRow from "./SubCategoryRow";

interface CategoryRowProps {
  cat: Category;
  hasSelection: boolean;
  editingCategory: string | null;
  editingCategoryName: string;
  editingSubCategory: string | null;
  editingSubCategoryName: string;
  showAddSubMap: Record<string, boolean>;
  newSubMap: Record<string, { name: string; image_url: string }>;
  selectedCatIds: string[];
  selectedSubIds: string[];
  onCategoryCheckboxToggle: (id: string) => void;
  onSubCheckboxToggle: (id: string) => void;
  onCategoryEditStart: (id: string, name: string) => void;
  onCategoryEditChange: (name: string) => void;
  onCategoryEditSave: (id: string) => void;
  onCategoryDelete: (id: string) => void;
  onCategoryThumbnail: (id: string, file: File) => void;
  onToggleExpand: (id: string) => void;
  onSubEditStart: (subId: string, name: string) => void;
  onSubEditChange: (name: string) => void;
  onSubEditSave: (subId: string) => void;
  onSubDelete: (subId: string) => void;
  onSubThumbnail: (subId: string, file: File) => void;
  onShowAddSub: (catId: string) => void;
  onHideAddSub: (catId: string) => void;
  onNewSubChange: (catId: string, name: string) => void;
  onNewSubThumbnail: (catId: string, file: File) => void;
  onAddSubCategory: (catId: string) => void;
  onSelectAllSubs: (catId: string) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  cat,
  hasSelection,
  editingCategory,
  editingCategoryName,
  editingSubCategory,
  editingSubCategoryName,
  showAddSubMap,
  newSubMap,
  selectedCatIds,
  selectedSubIds,
  onCategoryCheckboxToggle,
  onSubCheckboxToggle,
  onCategoryEditStart,
  onCategoryEditChange,
  onCategoryEditSave,
  onCategoryDelete,
  onCategoryThumbnail,
  onToggleExpand,
  onSubEditStart,
  onSubEditChange,
  onSubEditSave,
  onSubDelete,
  onSubThumbnail,
  onShowAddSub,
  onHideAddSub,
  onNewSubChange,
  onNewSubThumbnail,
  onAddSubCategory,
  onSelectAllSubs,
}) => {
  const catThumbInputRef = React.createRef<HTMLInputElement>();

  /* ADDED: States to track validation errors */
  const [editCatError, setEditCatError] = useState(false);
  const [newSubError, setNewSubError] = useState(false);

  const isCategorySelected = selectedCatIds.includes(cat.id);
  const allSubsSelected =
    cat.subCategories.length > 0 &&
    cat.subCategories.every((sub) => selectedSubIds.includes(sub.id));
  const someSubsSelected =
    !allSubsSelected &&
    cat.subCategories.some((sub) => selectedSubIds.includes(sub.id));

  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
        <input
          type="checkbox"
          className="w-3.5 h-3.5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
          checked={isCategorySelected}
          onChange={(e) => {
            e.stopPropagation();
            onCategoryCheckboxToggle(cat.id);
          }}
        />
        <div
          onClick={() => catThumbInputRef.current?.click()}
          className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center cursor-pointer hover:border-red-300 transition-colors shrink-0 overflow-hidden relative group"
        >
          {cat.image_url ? (
            <img
              src={cat.image_url}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Images size={14} className="text-gray-300" />
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Pencil size={10} className="text-white" />
          </div>
        </div>
        <input
          ref={catThumbInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] &&
            onCategoryThumbnail(cat.id, e.target.files[0])
          }
        />

        {/* Name / edit */}
        <div className="flex-1 min-w-0">
          {editingCategory === cat.id ? (
            <div>
              <input
                type="text"
                value={editingCategoryName}
                maxLength={50}
                autoFocus
                onChange={(e) => {
                  onCategoryEditChange(e.target.value);
                  if (e.target.value.trim()) setEditCatError(false);
                }}
                onBlur={() => {
                  if (!editingCategoryName.trim()) {
                    setEditCatError(true);
                  } else {
                    onCategoryEditSave(cat.id);
                    setEditCatError(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!editingCategoryName.trim()) {
                      setEditCatError(true);
                    } else {
                      onCategoryEditSave(cat.id);
                      setEditCatError(false);
                    }
                  }
                }}
                className={`w-full px-2 py-1 text-sm bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 ${editCatError ? "border-red-400" : "border-red-300"}`}
              />
              {editCatError && (
                <p className="text-xs text-red-500 mt-1">
                  Category name is required
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  {cat.name}
                </p>
                <span className="text-xs text-gray-400">
                  {cat.subCategories.length} sub-categories
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onCategoryDelete(cat.id)}
            className={`p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all ${
              hasSelection ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => onCategoryEditStart(cat.id, cat.name)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onToggleExpand(cat.id)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors ml-1"
          >
            {cat.expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Sub-categories */}
      {cat.expanded && (
        <div className="px-4 pb-3 pt-2 space-y-2 bg-white">
          {cat.subCategories.length > 0 && (
            <div className="flex items-center gap-2 pl-4 py-3">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                checked={allSubsSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSubsSelected;
                }}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelectAllSubs(cat.id);
                }}
              />
              <span className="text-xs text-gray-400 font-medium">
                {allSubsSelected
                  ? "Deselect all sub-categories"
                  : someSubsSelected
                    ? `${cat.subCategories.filter((s) => selectedSubIds.includes(s.id)).length} of ${cat.subCategories.length} selected`
                    : "Select all sub-categories"}
              </span>
            </div>
          )}

          {cat.subCategories.map((sub) => (
            <SubCategoryRow
              key={sub.id}
              sub={sub}
              hasSelection={hasSelection}
              editingSubCategory={editingSubCategory}
              editingSubCategoryName={editingSubCategoryName}
              isSelected={selectedSubIds.includes(sub.id)}
              onCheckboxToggle={onSubCheckboxToggle}
              onEditStart={onSubEditStart}
              onEditChange={onSubEditChange}
              onEditSave={onSubEditSave}
              onDelete={onSubDelete}
              onThumbnail={onSubThumbnail}
            />
          ))}

          {showAddSubMap[cat.id] ? (
            <div className="pl-6 pr-2 py-3 rounded-lg border border-dashed border-red-200 bg-red-50/30 space-y-2">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => {
                    const ref = document.getElementById(
                      `new-sub-thumb-${cat.id}`,
                    ) as HTMLInputElement;
                    ref?.click();
                  }}
                  className="w-8 h-8 rounded-lg border-2 border-dashed border-gray-300 hover:border-red-300 bg-white flex items-center justify-center cursor-pointer transition-colors shrink-0 overflow-hidden"
                >
                  {newSubMap[cat.id]?.image_url ? (
                    <img
                      src={newSubMap[cat.id].image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Images size={11} className="text-gray-300" />
                  )}
                </div>
                <input
                  id={`new-sub-thumb-${cat.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    onNewSubThumbnail(cat.id, e.target.files[0])
                  }
                />
                
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Sub-category name"
                    value={newSubMap[cat.id]?.name || ""}
                    maxLength={50}
                    onChange={(e) => {
                      onNewSubChange(cat.id, e.target.value);
                      if (e.target.value.trim()) setNewSubError(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (!newSubMap[cat.id]?.name.trim()) {
                          setNewSubError(true);
                        } else {
                          onAddSubCategory(cat.id);
                          setNewSubError(false);
                        }
                      }
                    }}
                    className={`w-full px-3 py-1.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all ${newSubError ? "border-red-400" : "border-gray-200"}`}
                  />
                  {newSubError && (
                    <p className="text-xs text-red-500 mt-1">
                      Sub-category name is required
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setNewSubError(false);
                    onHideAddSub(cat.id);
                  }}
                  className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newSubMap[cat.id]?.name.trim()) {
                      setNewSubError(true);
                    } else {
                      onAddSubCategory(cat.id);
                      setNewSubError(false);
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onShowAddSub(cat.id)}
              className="flex items-center gap-1.5 pl-6 py-2 text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <Plus size={12} />
              Add Sub-category
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryRow;