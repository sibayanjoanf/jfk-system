"use client";

import { useState } from "react";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Toggle from "../../system-settings/components/shared/Toggle";

const AnnouncementsTab: React.FC = () => {
  const {
    announcements,
    loading,
    addAnnouncement,
    deleteAnnouncement,
    toggleAnnouncement,
  } = useAnnouncements();
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleAdd = async () => {
    if (!newText.trim()) {
      setError(true);
      return;
    }

    setError(false);
    setAdding(true);
    await addAnnouncement(newText);
    setNewText("");
    setAdding(false);
  };

  const confirmDelete = async () => {
    if (!pendingId) return;
    setDeleting(true);
    await deleteAnnouncement(pendingId);
    setDeleting(false);
    setConfirmOpen(false);
    setPendingId(null);
  };

  if (loading)
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm text-gray-400">Loading announcements...</p>
      </div>
    );

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900">
            Text Announcements
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Announcements shown to customers.
          </p>
        </div>

        {/* Add input */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={newText}
              maxLength={100}
              onChange={(e) => {
                setNewText(e.target.value);
                if (e.target.value.trim()) setError(false);
              }}
              placeholder="Enter announcement text..."
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all ${
                error ? "border-red-400" : "border-gray-200"
              }`}
            />

            {error && (
              <p className="text-xs text-red-500 mt-1">The field is empty</p>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-60"
          >
            {adding ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={14} />
            )}
            Add
          </button>
        </div>

        {/* List */}
        <div className="space-y-2">
          {announcements.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">
              No announcements yet.
            </p>
          )}
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <Toggle
                  enabled={ann.active}
                  onClick={() => toggleAnnouncement(ann.id, ann.active)}
                />
                <p
                  className={`text-sm ${ann.active ? "text-gray-900" : "text-gray-400 line-through"}`}
                >
                  {ann.text}
                </p>
              </div>
              <button
                onClick={() => {
                  setPendingId(ann.id);
                  setConfirmOpen(true);
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2 shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

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
              Delete announcement?
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              This will permanently remove the announcement. This cannot be
              undone.
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

export default AnnouncementsTab;
