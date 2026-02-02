"use client"

import { useRef } from "react";

interface DeleteConfirmModalProps {
    leadName: string;
    leadId: number;
    onClose: () => void;
    onConfirm: (leadId: number) => void;
    isDeleting: boolean;
}

export default function DeleteConfirmModal({ leadName, leadId, onClose, onConfirm, isDeleting }: DeleteConfirmModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const closeModal = (e: React.MouseEvent) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    return (
        <div ref={modalRef} onClick={closeModal} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-error mb-4">Confirm Delete</h3>
                <p className="text-text-secondary mb-6">
                    Are you sure you want to delete <span className="font-bold text-foreground">{leadName}</span>?
                    This action cannot be undone.
                </p>
                <div className="flex gap-4 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border-2 border-border rounded-lg text-text-secondary hover:bg-muted transition"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(leadId)}
                        className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
