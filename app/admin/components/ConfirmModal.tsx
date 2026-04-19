"use client";

import React from "react";
import { Loader2, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: "archive" | "restore" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  variant = "restore",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const confirmStyles =
    variant === "archive"
      ? "bg-amber-500 hover:bg-amber-600"
      : variant === "danger"
        ? "bg-red-600 hover:bg-red-700"
        : "bg-green-500 hover:bg-green-600";

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm flex items-center justify-center"
      onClick={() => !loading && onCancel()}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-white rounded-lg transition-colors disabled:opacity-60 ${confirmStyles}`}
          >
            {loading ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Please wait...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
