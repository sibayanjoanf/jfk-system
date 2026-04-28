import React, { useState } from "react";
import { Plus, Images, Trash2, Search, Loader2, X } from "lucide-react";
import { useShowcase } from "../hooks/useShowcase";
import { supabase } from "@/lib/supabase";

interface ProductResult {
  id: string;
  name: string;
  product_variants: {
    id: string;
    sku: string;
    image_url: string | null;
  }[];
}

const ShowcaseTab: React.FC = () => {
  const { showCaseImages, loading, addShowcase, deleteShowcase } =
    useShowcase();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResult | null>(
    null,
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const resetModal = () => {
    setShowAddModal(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedProduct(null);
    setSelectedImageUrl("");
    setUploadedFile(null);
    setUploadPreview("");
  };

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const { data } = await supabase
      .from("products")
      .select("id, name, product_variants(id, sku, image_url)")
      .ilike("name", `%${q}%`)
      .limit(8);
    setSearchResults(data ?? []);
    setSearching(false);
  };

  const handleUpload = (file: File) => {
    setUploadedFile(file);
    setUploadPreview(URL.createObjectURL(file));
    setSelectedImageUrl("");
  };

  const handleSave = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    try {
      let image_url = selectedImageUrl;

      if (uploadedFile) {
        const ext = uploadedFile.name.split(".").pop();
        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append("path", `showcase/${Date.now()}.${ext}`);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error);
        image_url = result.url;
      }

      await addShowcase(selectedProduct.name, image_url);
      resetModal();
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleting(true);
    await deleteShowcase(pendingDeleteId);
    setDeleting(false);
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  if (loading)
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm text-gray-400">Loading showcase...</p>
      </div>
    );

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Showcase Images
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Featured products displayed on landing page.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Plus size={13} />
            Add Image
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {showCaseImages.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Images size={16} className="text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.product_name}
                </p>
              </div>
              <button
                onClick={() => handleDeleteClick(item.id)}
                className="cursor-pointer p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2 shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm flex items-center justify-center"
          onClick={resetModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Add Showcase Image
              </h3>
              <button
                onClick={resetModal}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Search product */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Search Product
              </label>
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by product name..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                />
                {searching && (
                  <Loader2
                    size={13}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
                  />
                )}
              </div>

              {/* Search results */}
              {searchResults.length > 0 && !selectedProduct && (
                <div className="mt-1.5 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProduct(p);
                        setSearchResults([]);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}

              {selectedProduct && (
                <div className="mt-2 flex items-center justify-between px-3 py-2 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-xs font-medium text-red-700">
                    {selectedProduct.name}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setSelectedImageUrl("");
                    }}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* pick image */}
            {selectedProduct && (
              <div className="mb-4 space-y-3">
                {/* Upload image */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      className={`w-14 h-14 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${uploadPreview ? "border-red-500" : "border-gray-200 hover:border-red-300"}`}
                    >
                      {uploadPreview ? (
                        <img
                          src={uploadPreview}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Images size={16} className="text-gray-300" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      Click to uplad
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleUpload(e.target.files[0])
                      }
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-5">
              <button
                onClick={resetModal}
                className="flex-1 px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  saving ||
                  !selectedProduct ||
                  (!selectedImageUrl && !uploadedFile)
                }
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
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
              Remove from showcase?
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              This will remove the image from your storefront showcase. This
              cannot be undone.
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
                  "Yes, remove"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowcaseTab;
