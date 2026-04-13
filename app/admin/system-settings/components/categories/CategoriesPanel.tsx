import React, { useRef, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
    type: "category" | "subcategory" | "bulk-category" | "bulk-subcategory";
    id: string;
    name: string;
    ids?: string[];
    blockedNames?: string[];
    isBlocked?: boolean;
  } | null>(null);


  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([]);
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>([]);


  const allCatIds = categories.map((c) => c.id);
  const hasSelection = selectedCatIds.length > 0 || selectedSubIds.length > 0;
  const selectionCount = selectedCatIds.length + selectedSubIds.length;


  const toggleCatSelection = (id: string) =>
    setSelectedCatIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );


  const toggleAllCatSelection = () => {
    if (selectedCatIds.length === allCatIds.length && allCatIds.length > 0) {
      setSelectedCatIds([]);
    } else {
      setSelectedCatIds(allCatIds);
    }
  };


  const toggleSubSelection = (id: string) =>
    setSelectedSubIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );


  const toggleCategorySubSelection = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;
    const subIds = cat.subCategories.map((s) => s.id);
    const allSelected = subIds.every((id) => selectedSubIds.includes(id));
    if (allSelected) {
      setSelectedSubIds((prev) => prev.filter((id) => !subIds.includes(id)));
    } else {
      setSelectedSubIds((prev) => [...new Set([...prev, ...subIds])]);
    }
  };


  const clearSelection = () => {
    setSelectedCatIds([]);
    setSelectedSubIds([]);
  };


  const openDeleteConfirm = (payload: typeof pendingDelete) => {
    setPendingDelete(payload);
    setConfirmOpen(true);
  };


  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const blockedNames: string[] = [];
    let blockedType: "category" | "subcategory" = "subcategory";


    try {
      if (pendingDelete.type === "category") {
        await deleteCategory(pendingDelete.id);
      } else if (pendingDelete.type === "subcategory") {
        try {
          await deleteSubCategory(pendingDelete.id);
        } catch (err: unknown) {
          const error = err as { message?: string; status?: number };
          if (error?.message === "has_products" || error?.status === 409) {
            blockedNames.push(pendingDelete.name);
            blockedType = "subcategory";
          } else {
            throw err;
          }
        }
      } else if (pendingDelete.type === "bulk-category" && pendingDelete.ids) {
        blockedType = "category";
        const deletable: string[] = [];
        for (const id of pendingDelete.ids) {
          const cat = categories.find((c) => c.id === id);
          if (cat?.subCategories && cat.subCategories.length > 0) {
            blockedNames.push(cat.name);
          } else {
            deletable.push(id);
          }
        }
        for (const id of deletable) {
          await deleteCategory(id);
        }
        setSelectedCatIds([]);
      } else if (
        pendingDelete.type === "bulk-subcategory" &&
        pendingDelete.ids
      ) {
        blockedType = "subcategory";
        for (const id of pendingDelete.ids) {
          const sub = categories
            .flatMap((c) => c.subCategories)
            .find((s) => s.id === id);
          try {
            await deleteSubCategory(id);
          } catch (err: unknown) {
            const error = err as { message?: string; status?: number };
            if (error?.message === "has_products" || error?.status === 409) {
              blockedNames.push(sub?.name ?? id);
            } else {
              throw err;
            }
          }
        }
        setSelectedSubIds([]);
      }
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setPendingDelete(null);


      if (blockedNames.length > 0) {
        setTimeout(() => {
          setPendingDelete({
            type: blockedType,
            id: "",
            name:
              blockedNames.length === 1
                ? `"${blockedNames[0]}"`
                : `${blockedNames.length} items`,
            isBlocked: true,
            blockedNames,
          });
          setConfirmOpen(true);
        }, 150);
      }
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Categories & Sub-categories
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage how products are organized.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {hasSelection && (
            <>
              <button
                onClick={() => {
                  if (selectedCatIds.length > 0) {
                    openDeleteConfirm({
                      type: "bulk-category",
                      id: "",
                      name: `${selectedCatIds.length} categor${selectedCatIds.length > 1 ? "ies" : "y"}`,
                      ids: selectedCatIds,
                    });
                  } else {
                    openDeleteConfirm({
                      type: "bulk-subcategory",
                      id: "",
                      name: `${selectedSubIds.length} sub-categor${selectedSubIds.length > 1 ? "ies" : "y"}`,
                      ids: selectedSubIds,
                    });
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors animate-in fade-in duration-150"
              >
                <Trash2 size={13} />
                Delete ({selectionCount})
              </button>
            </>
          )}
          {categories.length > 0 && (
            <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                checked={
                  selectedCatIds.length === allCatIds.length &&
                  allCatIds.length > 0
                }
                ref={(el) => {
                  if (el)
                    el.indeterminate =
                      selectedCatIds.length > 0 &&
                      selectedCatIds.length < allCatIds.length;
                }}
                onChange={toggleAllCatSelection}
              />
              <span className="text-xs font-medium text-gray-600">
                Select All
              </span>
            </label>
          )}
          <button
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Plus size={13} />
            Add Category
          </button>
        </div>
      </div>


      {showAddCategory && (
        <AddCategoryForm
          newCategory={newCategory}
          thumbRef={newCatThumbRef}
          existingNames={categories.map((c) => c.name)}
          onChange={(name) => setNewCategory({ ...newCategory, name })}
          onThumbnail={handleNewCategoryThumbnail}
          onAdd={handleAddCategory}
          onCancel={() => {
            setShowAddCategory(false);
            setNewCategory({ name: "", image_url: "" });
          }}
        />
      )}


      {/* Category list */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <CategoryRow
            key={cat.id}
            cat={cat}
            hasSelection={hasSelection}
            editingCategory={editingCategory}
            editingCategoryName={editingCategoryName}
            editingSubCategory={editingSubCategory}
            editingSubCategoryName={editingSubCategoryName}
            showAddSubMap={showAddSubMap}
            newSubMap={newSubMap}
            selectedCatIds={selectedCatIds}
            selectedSubIds={selectedSubIds}
            onCategoryCheckboxToggle={toggleCatSelection}
            onSubCheckboxToggle={toggleSubSelection}
            onCategoryEditStart={(id, name) => {
              setEditingCategory(id);
              setEditingCategoryName(name);
            }}
            onCategoryEditChange={setEditingCategoryName}
            onCategoryEditSave={handleSaveCategoryName}
            onCategoryDelete={(id) => {
              const cat = categories.find((c) => c.id === id);
              openDeleteConfirm({
                type: "category",
                id,
                name: cat?.name ?? "this category",
                isBlocked: !!(
                  cat?.subCategories && cat.subCategories.length > 0
                ),
              });
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
              openDeleteConfirm({
                type: "subcategory",
                id,
                name: sub?.name ?? "this sub-category",
              });
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
            onSelectAllSubs={toggleCategorySubSelection}
          />
        ))}
      </div>


      {/* Confirm / Error modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm flex items-center justify-center"
          onClick={() => !deleting && setConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {pendingDelete?.isBlocked ? (
              <>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Cannot delete{" "}
                  {pendingDelete.blockedNames &&
                  pendingDelete.blockedNames.length > 1
                    ? `${pendingDelete.blockedNames.length} items`
                    : pendingDelete.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {pendingDelete.type === "subcategory" ? (
                    <>
                      <span className="font-medium text-gray-600">
                        {pendingDelete.blockedNames &&
                        pendingDelete.blockedNames.length > 0
                          ? pendingDelete.blockedNames.join(", ")
                          : pendingDelete.name}
                      </span>{" "}
                      still{" "}
                      {pendingDelete.blockedNames &&
                      pendingDelete.blockedNames.length > 1
                        ? "have"
                        : "has"}{" "}
                      products assigned. Remove those products first.
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-gray-600">
                        {pendingDelete.blockedNames &&
                        pendingDelete.blockedNames.length > 0
                          ? pendingDelete.blockedNames.join(", ")
                          : pendingDelete.name}
                      </span>{" "}
                      still{" "}
                      {pendingDelete.blockedNames &&
                      pendingDelete.blockedNames.length > 1
                        ? "have"
                        : "has"}{" "}
                      sub-categories. Delete those first before removing them.
                    </>
                  )}
                </p>
                <div className="mt-5">
                  <button
                    onClick={() => setConfirmOpen(false)}
                    className="w-full px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Okay
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Delete {pendingDelete?.name}?
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  This is permanent and cannot be undone.
                </p>
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => setConfirmOpen(false)}
                    disabled={deleting}
                    className="flex-1 px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    {deleting ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      "Yes, delete"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default CategoriesPanel;