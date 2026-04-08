"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  count: number;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  count,
  deleting,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm flex items-center justify-center"
      onClick={() => !deleting && onCancel()}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Delete {count} {count === 1 ? "inquiry" : "inquiries"}?
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          This action is permanent and cannot be undone. The selected{" "}
          {count === 1 ? "record" : "records"} will be removed from the
          database.
        </p>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
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
  );
};

export default DeleteConfirmModal;
