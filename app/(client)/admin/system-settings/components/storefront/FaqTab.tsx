import React, { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Pencil,
  Loader2,
  X,
} from "lucide-react";
import { useFaqs } from "../../hooks/useFaqs";

const FaqTab: React.FC = () => {
  const {
    faqCategories,
    faqs,
    loading,
    addFaqCategory,
    deleteFaqCategory,
    updateFaqCategory,
    addFaq,
    deleteFaq,
    updateFaq,
    toggleFaq,
  } = useFaqs();

  // ── Add Category state ─────────────────────────────
  const [newCatName, setNewCatName] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");

  // ── Add FAQ state ──────────────────────────────────
  const [showAddFaqMap, setShowAddFaqMap] = useState<Record<string, boolean>>(
    {},
  );
  const [newFaqMap, setNewFaqMap] = useState<
    Record<string, { question: string; answer: string }>
  >({});
  const [editingFaq, setEditingFaq] = useState<{
    id: string;
    question: string;
    answer: string;
  } | null>(null);

  // ── Delete confirm state ───────────────────────────
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    type: "category" | "faq";
    id: string;
    name: string;
  } | null>(null);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    if (pendingDelete.type === "category")
      await deleteFaqCategory(pendingDelete.id);
    else await deleteFaq(pendingDelete.id);
    setDeleting(false);
    setConfirmOpen(false);
    setPendingDelete(null);
  };

  if (loading)
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm text-gray-400">Loading FAQs...</p>
      </div>
    );

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Manage FAQ categories and items.
            </p>
          </div>
          <button
            onClick={() => setShowAddCat(!showAddCat)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Plus size={13} />
            Add Category
          </button>
        </div>

        {/* Add Category Form */}
        {showAddCat && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
            <p className="text-xs font-semibold text-gray-700">
              New FAQ Category
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Category name (e.g. Delivery, Payment)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addFaqCategory(newCatName);
                    setNewCatName("");
                    setShowAddCat(false);
                  }
                }}
                className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
              />
              <button
                onClick={() => {
                  addFaqCategory(newCatName);
                  setNewCatName("");
                  setShowAddCat(false);
                }}
                className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddCat(false);
                  setNewCatName("");
                }}
                className="px-4 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* FAQ Categories */}
        <div className="space-y-4">
          {faqCategories.map((cat) => {
            const catFaqs = faqs.filter((f) => f.category_id === cat.id);
            return (
              <div
                key={cat.id}
                className="rounded-xl border border-gray-100 overflow-hidden"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between px-4 py-3">
                  {editingCatId === cat.id ? (
                    <input
                      type="text"
                      value={editingCatName}
                      autoFocus
                      onChange={(e) => setEditingCatName(e.target.value)}
                      onBlur={() => {
                        updateFaqCategory(cat.id, editingCatName);
                        setEditingCatId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateFaqCategory(cat.id, editingCatName);
                          setEditingCatId(null);
                        }
                      }}
                      className="flex-1 px-2 py-1 text-sm bg-white border border-red-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 mr-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-red-600 bg-red-50 py-1 px-3 rounded-xl">
                        {cat.name}
                      </p>
                      <span className="text-xs text-gray-400">
                        {catFaqs.length} FAQs
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingCatId(cat.id);
                        setEditingCatName(cat.name);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => {
                        setPendingDelete({
                          type: "category",
                          id: cat.id,
                          name: cat.name,
                        });
                        setConfirmOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* FAQs under this category */}
                <div className="px-4 pb-3 pt-2 space-y-2 bg-white">
                  {catFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="rounded-lg border border-gray-100 overflow-hidden"
                    >
                      <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleFaq(faq.id)}
                      >
                        <p className="text-sm text-gray-800 flex-1 min-w-0 truncate">
                          {faq.question}
                        </p>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingFaq({
                                id: faq.id,
                                question: faq.question,
                                answer: faq.answer,
                              });
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingDelete({
                                type: "faq",
                                id: faq.id,
                                name: faq.question,
                              });
                              setConfirmOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                          {faq.open ? (
                            <ChevronUp size={14} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={14} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                      {faq.open && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add FAQ inline */}
                  {showAddFaqMap[cat.id] ? (
                    <div className="p-3 rounded-lg border border-dashed border-red-200 bg-red-50/30 space-y-2">
                      <input
                        type="text"
                        placeholder="Question"
                        value={newFaqMap[cat.id]?.question || ""}
                        onChange={(e) =>
                          setNewFaqMap((prev) => ({
                            ...prev,
                            [cat.id]: {
                              ...prev[cat.id],
                              question: e.target.value,
                              answer: prev[cat.id]?.answer || "",
                            },
                          }))
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                      />
                      <textarea
                        placeholder="Answer"
                        value={newFaqMap[cat.id]?.answer || ""}
                        onChange={(e) =>
                          setNewFaqMap((prev) => ({
                            ...prev,
                            [cat.id]: {
                              ...prev[cat.id],
                              answer: e.target.value,
                              question: prev[cat.id]?.question || "",
                            },
                          }))
                        }
                        rows={3}
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 transition-all resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            setShowAddFaqMap((prev) => ({
                              ...prev,
                              [cat.id]: false,
                            }))
                          }
                          className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            const f = newFaqMap[cat.id];
                            if (!f?.question.trim()) return;
                            await addFaq(cat.id, f.question, f.answer);
                            setNewFaqMap((prev) => ({
                              ...prev,
                              [cat.id]: { question: "", answer: "" },
                            }));
                            setShowAddFaqMap((prev) => ({
                              ...prev,
                              [cat.id]: false,
                            }));
                          }}
                          className="px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setShowAddFaqMap((prev) => ({
                          ...prev,
                          [cat.id]: true,
                        }))
                      }
                      className="flex items-center gap-1.5 py-2 text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      <Plus size={12} />
                      Add FAQ
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit FAQ */}
      {editingFaq && (
        <div
          className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setEditingFaq(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl mx-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Edit FAQ</h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={editingFaq.question}
                onChange={(e) =>
                  setEditingFaq({ ...editingFaq, question: e.target.value })
                }
                placeholder="Question"
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
              />
              <textarea
                value={editingFaq.answer}
                onChange={(e) =>
                  setEditingFaq({ ...editingFaq, answer: e.target.value })
                }
                placeholder="Answer"
                rows={4}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all resize-none"
              />
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setEditingFaq(null)}
                className="flex-1 px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateFaq(
                    editingFaq.id,
                    editingFaq.question,
                    editingFaq.answer,
                  );
                  setEditingFaq(null);
                }}
                className="flex-1 px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ───────────────────────── */}
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
              Delete {pendingDelete?.type === "category" ? "category" : "FAQ"}?
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {pendingDelete?.type === "category"
                ? "All FAQs under this category will also be deleted. This cannot be undone."
                : "This FAQ will be permanently removed. This cannot be undone."}
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
    </>
  );
};

export default FaqTab;
