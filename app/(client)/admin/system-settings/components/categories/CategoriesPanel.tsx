import React, { useRef, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";
import CategoryRow from "./CategoryRow";
import AddCategoryForm from "./AddCategoryForm";

const CategoriesPanel: React.FC = () => {
  const {
    categories,
    loading,
    toggleCategoryExpand,
    addCategory,
    deleteCategory,
    saveCategoryName,
    addSubCategory,
    deleteSubCategory,
    saveSubCategoryName,
    updateCategoryImage,
    updateSubCategoryImage,
  } = useCategories();

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", image_url: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    type: "category" | "subcategory";
    id: string;
    name: string;
  } | null>(null);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    if (pendingDelete.type === "category") {
      await deleteCategory(pendingDelete.id);
    } else {
      await deleteSubCategory(pendingDelete.id);
    }
    setDeleting(false);
    setConfirmOpen(false);
    setPendingDelete(null);
  };

  const [showAddSubMap, setShowAddSubMap] = useState<Record<string, boolean>>(
    {},
  );
  const [newSubMap, setNewSubMap] = useState<
    Record<string, { name: string; image_url: string }>
  >({});

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const [editingSubCategory, setEditingSubCategory] = useState<string | null>(
    null,
  );
  const [editingSubCategoryName, setEditingSubCategoryName] = useState("");

  const newCatThumbRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", `${folder}/${Date.now()}.${ext}`);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Upload failed");
    return result.url;
  };

  const handleAddCategory = async () => {
    await addCategory(newCategory.name, newCategory.image_url);
    setNewCategory({ name: "", image_url: "" });
    setShowAddCategory(false);
  };

  const handleNewCategoryThumbnail = async (file: File) => {
    const url = await uploadImage(file, "categories");
    setNewCategory((prev) => ({ ...prev, image_url: url }));
  };

  const handleCategoryThumbnail = async (id: string, file: File) => {
    const url = await uploadImage(file, "categories");
    await updateCategoryImage(id, url);
  };

  const handleAddSubCategory = async (catId: string) => {
    const sub = newSubMap[catId];
    if (!sub?.name.trim()) return;
    await addSubCategory(catId, sub.name, sub.image_url ?? "");
    setNewSubMap((prev) => ({ ...prev, [catId]: { name: "", image_url: "" } }));
    setShowAddSubMap((prev) => ({ ...prev, [catId]: false }));
  };

  const handleSubThumbnail = async (subId: string, file: File) => {
    const url = await uploadImage(file, "sub_categories");
    await updateSubCategoryImage(subId, url);
  };

  const handleNewSubThumbnail = async (catId: string, file: File) => {
    const url = await uploadImage(file, "sub_categories");
    setNewSubMap((prev) => ({
      ...prev,
      [catId]: { ...prev[catId], image_url: url },
    }));
  };

  const handleSaveCategoryName = async (id: string) => {
    await saveCategoryName(id, editingCategoryName);
    setEditingCategory(null);
  };

  const handleSaveSubCategoryName = async (subId: string) => {
    await saveSubCategoryName(subId, editingSubCategoryName);
    setEditingSubCategory(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm text-gray-400">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Categories & Sub-categories
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage how products are organized. Each category can have multiple
            sub-categories with their own images.
          </p>
        </div>
        <button
          onClick={() => setShowAddCategory(!showAddCategory)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shrink-0"
        >
          <Plus size={13} />
          Add Category
        </button>
      </div>

      {showAddCategory && (
        <AddCategoryForm
          newCategory={newCategory}
          thumbRef={newCatThumbRef}
          onChange={(name) => setNewCategory({ ...newCategory, name })}
          onThumbnail={handleNewCategoryThumbnail}
          onAdd={handleAddCategory}
          onCancel={() => {
            setShowAddCategory(false);
            setNewCategory({ name: "", image_url: "" });
          }}
        />
      )}

      <div className="space-y-3">
        {categories.map((cat) => (
          <CategoryRow
            key={cat.id}
            cat={cat}
            editingCategory={editingCategory}
            editingCategoryName={editingCategoryName}
            editingSubCategory={editingSubCategory}
            editingSubCategoryName={editingSubCategoryName}
            showAddSubMap={showAddSubMap}
            newSubMap={newSubMap}
            onCategoryEditStart={(id, name) => {
              setEditingCategory(id);
              setEditingCategoryName(name);
            }}
            onCategoryEditChange={setEditingCategoryName}
            onCategoryEditSave={handleSaveCategoryName}
            onCategoryDelete={(id) => {
              const cat = categories.find((c) => c.id === id);
              setPendingDelete({
                type: "category",
                id,
                name: cat?.name ?? "this category",
              });
              setConfirmOpen(true);
            }}
            onCategoryThumbnail={handleCategoryThumbnail}
            onToggleExpand={toggleCategoryExpand}
            onSubEditStart={(subId, name) => {
              setEditingSubCategory(subId);
              setEditingSubCategoryName(name);
            }}
            onSubEditChange={setEditingSubCategoryName}
            onSubEditSave={handleSaveSubCategoryName}
            onSubDelete={(id) => {
              const sub = categories
                .flatMap((c) => c.subCategories)
                .find((s) => s.id === id);
              setPendingDelete({
                type: "subcategory",
                id,
                name: sub?.name ?? "this sub-category",
              });
              setConfirmOpen(true);
            }}
            onSubThumbnail={handleSubThumbnail}
            onShowAddSub={(catId) =>
              setShowAddSubMap((prev) => ({ ...prev, [catId]: true }))
            }
            onHideAddSub={(catId) =>
              setShowAddSubMap((prev) => ({ ...prev, [catId]: false }))
            }
            onNewSubChange={(catId, name) =>
              setNewSubMap((prev) => ({
                ...prev,
                [catId]: {
                  ...prev[catId],
                  name,
                  image_url: prev[catId]?.image_url ?? "",
                },
              }))
            }
            onNewSubThumbnail={handleNewSubThumbnail}
            onAddSubCategory={handleAddSubCategory}
          />
        ))}
      </div>
      {confirmOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm flex items-center justify-center"
          onClick={() => !deleting && setConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Delete {pendingDelete?.name}?
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              This is permanent and cannot be undone.{" "}
              {pendingDelete?.type === "category"
                ? "All sub-categories under this category will also be deleted."
                : "This sub-category will be removed from the database."}
            </p>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Deleting...
                  </>
                ) : (
                  "Yes, delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPanel;
