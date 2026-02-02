"use client"

import { useState, useRef } from "react";
import { X } from 'lucide-react';
import axios from "axios";

enum enumStatus {
    new = "new",
    contacted = "contacted",
    qualified = "qualified",
    won = "won",
    lost = "lost"
}

interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    company_name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface EditLeadModalProps {
    lead: Lead;
    onClose: () => void;
    onSuccess: () => void;
    userToken: string;
}

export default function EditLeadModal({ lead, onClose, onSuccess, userToken }: EditLeadModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const [modalError, setModalError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [name, setName] = useState<string>(lead.name);
    const [email, setEmail] = useState<string>(lead.email || "");
    const [companyName, setCompanyName] = useState<string>(lead.company_name || "");
    const [phone, setPhone] = useState<string>(lead.phone || "");
    type T_status = keyof typeof enumStatus;
    const [status, setStatus] = useState<T_status>(lead.status as T_status);
    const statusOptions: T_status[] = Object.keys(enumStatus) as T_status[];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setModalError(null);
        setIsSubmitting(true);

        try {
            const tokenConfig = {
                headers: { "Authorization": `Bearer ${userToken}` }
            };

            const requestBody = {
                name,
                email,
                phone,
                company_name: companyName,
                status
            };

            await axios.patch(
                `http://localhost:8000/patchlead/${lead.id}`,
                requestBody,
                tokenConfig
            );

            onSuccess();
            onClose();
        } catch (err: any) {
            setModalError(
                err.response?.data?.detail || "Failed to update lead. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = (e: React.MouseEvent) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    return (
        <>
        <div ref={modalRef} onClick={closeModal} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-foreground">Edit Lead</h3>
                    <button onClick={onClose} className="text-text-tertiary hover:text-foreground transition">
                        <X size={30}/>
                    </button>
                </div>

                {modalError && (
                    <div className="bg-error/10 border-2 border-error rounded-lg p-4 mb-4">
                        <p className="text-error">{modalError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Enter Lead Name (min 10 characters)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border-2 rounded-lg border-border bg-background text-foreground px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Enter Email (optional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-2 rounded-lg border-border bg-background text-foreground px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    />
                    <input
                        type="text"
                        placeholder="Enter Company Name (optional)"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full border-2 rounded-lg border-border bg-background text-foreground px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    />
                    <input
                        type="tel"
                        placeholder="Enter Phone Number (optional)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border-2 rounded-lg border-border bg-background text-foreground px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    />
                    <div className="flex flex-col gap-2">
                        <label htmlFor="status" className="text-text-secondary">Lead Status:</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as T_status)}
                            className="w-full border-2 rounded-lg border-border bg-background text-foreground px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>{enumStatus[status]}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Updating..." : "Update Lead"}
                    </button>
                </form>
            </div>
        </div>
        </>
    );
}
